from pathlib import Path
from typing import List, Optional
from datetime import datetime
from io import BytesIO
import sqlite3

import os

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.responses import FileResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
from openpyxl import Workbook
from pydantic import BaseModel, Field
from fastapi.security import HTTPBasic, HTTPBasicCredentials


BASE_DIR = Path(__file__).resolve().parent
WEB_DIR = BASE_DIR / "web"
DB_PATH = BASE_DIR / "survey.db"

app = FastAPI(title="Company Survey")
security = HTTPBasic()

ADMIN_USER = os.getenv("SURVEY_ADMIN_USER", "admin")
ADMIN_PASS = os.getenv("SURVEY_ADMIN_PASS", "admin123")


def init_db() -> None:
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS responses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            started_at TEXT NOT NULL,
            finished_at TEXT NOT NULL,
            duration_seconds INTEGER NOT NULL,
            status TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
        """
    )
    cursor.execute(
        """
        CREATE TABLE IF NOT EXISTS answers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            response_id INTEGER NOT NULL,
            question_id INTEGER NOT NULL,
            question TEXT NOT NULL,
            answer TEXT,
            FOREIGN KEY (response_id) REFERENCES responses(id)
        )
        """
    )
    conn.commit()
    conn.close()


def get_conn() -> sqlite3.Connection:
    return sqlite3.connect(DB_PATH)


def require_admin(credentials: HTTPBasicCredentials = Depends(security)) -> None:
    is_user_ok = credentials.username == ADMIN_USER
    is_pass_ok = credentials.password == ADMIN_PASS
    if not (is_user_ok and is_pass_ok):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Unauthorized",
            headers={"WWW-Authenticate": "Basic"},
        )


@app.on_event("startup")
def startup() -> None:
    WEB_DIR.mkdir(parents=True, exist_ok=True)
    init_db()


class Answer(BaseModel):
    question_id: int = Field(..., ge=1)
    question: str
    answer: Optional[str] = ""


class SubmitPayload(BaseModel):
    name: Optional[str] = ""
    started_at: str
    finished_at: str
    duration_seconds: int = Field(..., ge=0)
    status: str
    answers: List[Answer]


@app.get("/")
def index() -> FileResponse:
    index_path = WEB_DIR / "index.html"
    if not index_path.exists():
        raise HTTPException(status_code=404, detail="index.html not found")
    return FileResponse(index_path)


@app.get("/admin")
def admin(_: None = Depends(require_admin)) -> FileResponse:
    admin_path = WEB_DIR / "admin.html"
    if not admin_path.exists():
        raise HTTPException(status_code=404, detail="admin.html not found")
    return FileResponse(admin_path)


@app.get("/api/export")
def export_results(_: None = Depends(require_admin)):
    conn = get_conn()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT question_id, question
        FROM answers
        GROUP BY question_id, question
        ORDER BY question_id
        """
    )
    questions = cursor.fetchall()

    cursor.execute(
        """
        SELECT id, name, started_at, finished_at, duration_seconds, status, created_at
        FROM responses
        ORDER BY id
        """
    )
    responses = cursor.fetchall()

    cursor.execute(
        """
        SELECT response_id, question_id, answer
        FROM answers
        ORDER BY response_id, question_id
        """
    )
    answers_map = {
        (response_id, question_id): answer
        for response_id, question_id, answer in cursor.fetchall()
    }
    conn.close()

    workbook = Workbook()
    sheet = workbook.active
    headers = [
        "response_id",
        "name",
        "started_at",
        "finished_at",
        "duration_seconds",
        "status",
        "created_at",
    ]
    headers.extend([f"Q{qid}: {question}" for qid, question in questions])
    sheet.append(headers)

    for response in responses:
        response_id = response[0]
        row = list(response)
        row.extend(
            [
                answers_map.get((response_id, qid), "")
                for qid, _ in questions
            ]
        )
        sheet.append(row)

    buffer = BytesIO()
    workbook.save(buffer)
    buffer.seek(0)
    filename = f"survey_results_{datetime.utcnow().date().isoformat()}.xlsx"
    return StreamingResponse(
        buffer,
        media_type=(
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        ),
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@app.post("/api/submit")
def submit(payload: SubmitPayload):
    if payload.status not in {"manual", "timeout"}:
        raise HTTPException(status_code=400, detail="Invalid status")

    conn = get_conn()
    cursor = conn.cursor()
    now = datetime.utcnow().isoformat()
    cursor.execute(
        """
        INSERT INTO responses (name, started_at, finished_at, duration_seconds, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (
            payload.name or "",
            payload.started_at,
            payload.finished_at,
            payload.duration_seconds,
            payload.status,
            now,
        ),
    )
    response_id = cursor.lastrowid
    cursor.executemany(
        """
        INSERT INTO answers (response_id, question_id, question, answer)
        VALUES (?, ?, ?, ?)
        """,
        [
            (
                response_id,
                answer.question_id,
                answer.question,
                answer.answer or "",
            )
            for answer in payload.answers
        ],
    )
    conn.commit()
    conn.close()
    return {"ok": True, "response_id": response_id}


app.mount("/static", StaticFiles(directory=WEB_DIR), name="static")
