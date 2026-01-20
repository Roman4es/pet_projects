const QUESTIONS = [
  'РљР°РєРѕР№ РїСЂРѕРµРєС‚ РїСЂРёР·РЅР°РЅ РїРѕР±РµРґРёС‚РµР»РµРј РІ РЅРѕРјРёРЅР°С†РёРё "Р›СѓС‡С€РёР№ РїСЂРѕРµРєС‚ Р±РёР·РЅРµСЃ Рё РїСЂРµРјРёСѓРј РєР»Р°СЃСЃР° РІ РїСЂРµРјРёРё "Р”РµР»РѕРІРѕР№ РџРµС‚РµСЂР±СѓСЂРі"?',
  "РљР°РєР°СЏ СѓРїСЂР°РІР»СЏСЋС‰Р°СЏ РєРѕРјРїР°РЅРёСЏ РІ Bereg.РљСѓСЂРѕСЂС‚РЅС‹Р№?",
  "РќР°Р·РѕРІРёС‚Рµ С‚РµР»РµРіСЂР°Рј-РєР°РЅР°Р»С‹ РљРѕРјРїР°РЅРёРё",
  "РџРѕС‡РµРјСѓ Р±РёР·РЅРµСЃ-С†РµРЅС‚СЂ Element Prime СЃС‡РёС‚Р°СЋС‚ РїРµСЂРІРѕРїСЂРѕС…РѕРґС†РµРј РЅР° СЂС‹РЅРєРµ РєРѕРјРјРµСЂС‡РµСЃРєРѕР№ РЅРµРґРІРёР¶РёРјРѕСЃС‚Рё РџРµС‚РµСЂР±СѓСЂРіР°?",
  "РЎРєРѕР»СЊРєРѕ СЃРµРєС†РёР№ Рё РїСЂРѕСЃС‚СЂР°РЅСЃС‚РІ РІ РєРѕРјРїР»РµРєСЃРµ 17/33?",
  "РљР°РєР°СЏ С„РёР»РѕСЃРѕС„РёСЏ Р»РµР¶РёС‚ РІ РЅР°Р·РІР°РЅРёРё РїСЂРѕРµРєС‚Р° 19/19?",
  "Р’ С‡РµСЃС‚СЊ РєРѕРіРѕ РЅР°Р·РІР°РЅ РѕР±СЉРµРєС‚, РєРѕС‚РѕСЂС‹Р№ СЃС‡РёС‚Р°РµС‚СЃСЏ Р”РѕРјРѕРј РІС‹СЃРѕРєРѕРіРѕ СЃС‚РёР»СЏ?",
  "РќР°Р·РѕРІРёС‚Рµ Р”РµРЅСЊ Р РѕР¶РґРµРЅРёСЏ РљРѕРјРїР°РЅРёРё",
  "РљР°РєРѕР№ Р·РЅР°РєРѕРІС‹Р№ Р°СЂС‚-РѕР±СЉРµРєС‚ СЂР°Р·РјРµСЃС‚РёР»СЃСЏ РІРѕ РґРІРѕСЂРµ 1919?",
  "РќР° РєР°РєРѕРј СЌС‚Р°Р¶Рµ СЂР°СЃРїРѕР»РѕР¶РµРЅ Sky Lounge РІ РЁРµРїРёР»РµРІСЃРєРѕРј?",
  "РњРµР¶РґСѓ РєР°РєРёРјРё Р±Р°С€РЅСЏРјРё СЂР°СЃРїРѕР»РѕР¶РµРЅ РЅРµР±РµСЃРЅС‹Р№ РјРѕСЃС‚?",
  "РљР°РєРѕР№ РѕР±СЉРµРєС‚ РљРѕРјРїР°РЅРёРё РІР°Рј РЅСЂР°РІРёС‚СЃСЏ Р±РѕР»СЊС€Рµ РІСЃРµРіРѕ? РќР°РїРёС€РёС‚Рµ РєСЂР°С‚РєСѓСЋ РѕРґСѓ РїСЂРѕРµРєС‚Сѓ",
  "Р’ РєР°РєРѕРј СЂР°Р№РѕРЅРµ РњРѕСЃРєРІС‹ Р±СѓРґРµС‚ СЂР°СЃРїРѕР»РѕР¶РµРЅ РїРµСЂРІС‹Р№ РїСЂРѕРµРєС‚ РєРѕРјРїР°РЅРёРё",
  "РљР°РєРѕР№ СЃР»РѕРіР°РЅ Сѓ РєРѕРјРїР°РЅРёРё",
  "РќР° РєР°РєРёРµ С„СЂР°РіРјРµРЅС‚С‹ РґРµР»РёС‚СЃСЏ Element Prime",
  "Р§С‚Рѕ С‚Р°РєРѕРµ Element РџРµСЂРІС‹Р№?",
  "РљРѕРіРґР° Р±С‹Р» РїРѕР»СѓС‡РµРЅ Р РќР’ РІ 1919?",
  "РљР°РєР°СЏ РІС‹СЃРѕС‚Р° РІРµСЂР±Р»СЋРґР° Сѓ Р‘Р°С€РµРЅ?",
  "РќР° РєР°РєРѕР№ РІС‹СЃРѕС‚Рµ РЅР°С…РѕРґРёС‚СЃСЏ РќРµР±РµСЃРЅС‹Р№ РјРѕСЃС‚ РІ Р‘Р°С€РЅСЏС…?",
  "РљР°РєР°СЏ РґР»РёРЅР° Рё РіР»СѓР±РёРЅР° Р±Р°СЃСЃРµР№РЅР° РІ Р‘РµСЂРµРі. РљСѓСЂРѕСЂС‚РЅС‹Р№?",
  "РќР°Р·РѕРІРёС‚Рµ Р·РЅР°РєРѕРІРѕРµ С‡РёСЃР»Рѕ РєРѕРјРїР°РЅРёРё?",
  "РќР°Р·РѕРІРёС‚Рµ Р°СЂС‚РёСЃС‚РѕРІ, РєРѕС‚РѕСЂС‹Рµ РІС‹СЃС‚СѓРїР°Р»Рё РЅР° РїСЂРµР·РµРЅС‚Р°С†РёРё 17/33",
  "РљР°РєРёРµ РёРіСЂРѕРєРё Р—РµРЅРёС‚Р° СЃРЅСЏР»РёСЃСЊ РІ СЂРёР»Р»СЃР°С… Element?",
  "Р’ РєР°РєРѕРј Р·Р°РіРѕСЂРѕРґРЅРѕРј РєСѓСЂРѕСЂС‚РЅРѕРј РєРѕРјРїР»РµРєСЃРµ РѕС‚РєСЂС‹С‚ Р±СЂРµРЅРґРёСЂРѕРІР°РЅРЅС‹Р№ РїР»СЏР¶ Element Lounge?",
  "РЎРєРѕР»СЊРєРѕ СЃС‚РѕРёС‚ СЃР°РјС‹Р№ РґРѕСЂРѕРіРѕР№ РїРµРЅС‚С…Р°СѓСЃ РІ РџРµС‚РµСЂР±СѓСЂРіРµ, СЂР°СЃРїРѕР»РѕР¶РёРІС€РёР№РјСЏ РІ 17/33 Residence",
];

const TOTAL_SECONDS = 50 * 60;
const MAX_LENGTH = 144;

const welcomeSection = document.getElementById("welcome");
const surveySection = document.getElementById("survey");
const endSection = document.getElementById("end");
const startBtn = document.getElementById("start-btn");
const finishBtn = document.getElementById("finish-btn");
const nameInput = document.getElementById("participant-name");
const greeting = document.getElementById("participant-greeting");
const timerEl = document.getElementById("timer");
const formEl = document.getElementById("survey-form");
const endMessage = document.getElementById("end-message");
const saveStatus = document.getElementById("save-status");

let remainingSeconds = TOTAL_SECONDS;
let timerId = null;
let startedAt = null;
let hasSubmitted = false;

function renderQuestions() {
  const fragment = document.createDocumentFragment();
  QUESTIONS.forEach((question, index) => {
    const fieldset = document.createElement("div");
    fieldset.className = "question";

    const label = document.createElement("label");
    const input = document.createElement("input");

    const id = `q-${index + 1}`;
    label.setAttribute("for", id);
    label.textContent = `${index + 1}. ${question}`;

    input.type = "text";
    input.id = id;
    input.name = id;
    input.maxLength = MAX_LENGTH;
    input.setAttribute("aria-label", question);

    fieldset.append(label, input);
    fragment.appendChild(fieldset);
  });
  formEl.appendChild(fragment);
}

function updateTimer() {
  const minutes = String(Math.floor(remainingSeconds / 60)).padStart(2, "0");
  const seconds = String(remainingSeconds % 60).padStart(2, "0");
  timerEl.textContent = `РћСЃС‚Р°Р»РѕСЃСЊ: ${minutes}:${seconds}`;
}

function disableInputs() {
  const inputs = formEl.querySelectorAll("input");
  inputs.forEach((input) => {
    input.disabled = true;
  });
  finishBtn.disabled = true;
}

function collectAnswers() {
  return QUESTIONS.map((question, index) => {
    const input = document.getElementById(`q-${index + 1}`);
    return {
      question_id: index + 1,
      question,
      answer: input ? input.value.trim() : "",
    };
  });
}

async function submitAnswers(status) {
  if (hasSubmitted) {
    return;
  }
  hasSubmitted = true;

  const finishedAt = new Date().toISOString();
  const durationSeconds = Math.max(0, TOTAL_SECONDS - remainingSeconds);

  const payload = {
    name: nameInput.value.trim(),
    started_at: startedAt,
    finished_at: finishedAt,
    duration_seconds: durationSeconds,
    status,
    answers: collectAnswers(),
  };

  try {
    const response = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error("Bad response");
    }
    saveStatus.textContent = "РћС‚РІРµС‚С‹ СЃРѕС…СЂР°РЅРµРЅС‹.";
  } catch (error) {
    saveStatus.textContent =
      "РќРµ СѓРґР°Р»РѕСЃСЊ СЃРѕС…СЂР°РЅРёС‚СЊ РѕС‚РІРµС‚С‹. РџСЂРѕРІРµСЂСЊС‚Рµ СЃРѕРµРґРёРЅРµРЅРёРµ.";
  }
}

function showEnd(status) {
  surveySection.classList.remove("is-active");
  endSection.classList.add("is-active");
  endMessage.textContent =
    status === "timeout"
      ? "Р’СЂРµРјСЏ РІС‹С€Р»Рѕ, С„РѕСЂРјР° РѕРїСЂРѕСЃР° Р·Р°РєСЂС‹С‚Р°."
      : "РћРїСЂРѕСЃ Р·Р°РІРµСЂС€РµРЅ.";
}

function finishSurvey(status) {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
  remainingSeconds = Math.max(remainingSeconds, 0);
  updateTimer();
  disableInputs();
  showEnd(status);
  submitAnswers(status);
}

function startSurvey() {
  welcomeSection.classList.remove("is-active");
  surveySection.classList.add("is-active");
  const name = nameInput.value.trim();
  greeting.textContent = name ? `РЈС‡Р°СЃС‚РЅРёРє: ${name}` : "";
  startedAt = new Date().toISOString();
  updateTimer();

  timerId = setInterval(() => {
    remainingSeconds -= 1;
    if (remainingSeconds <= 0) {
      remainingSeconds = 0;
      finishSurvey("timeout");
      return;
    }
    updateTimer();
  }, 1000);
}

renderQuestions();
startBtn.addEventListener("click", startSurvey);
finishBtn.addEventListener("click", () => finishSurvey("manual"));
