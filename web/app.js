const QUESTIONS = [
  'Какой проект признан победителем в номинации "Лучший проект бизнес и премиум класса в премии "Деловой Петербург"?',
  "Какая управляющая компания в Bereg.Курортный?",
  "Назовите телеграм-каналы Компании",
  "Почему бизнес-центр Element Prime считают первопроходцем на рынке коммерческой недвижимости Петербурга?",
  "Сколько секций и пространств в комплексе 17/33?",
  "Какая философия лежит в названии проекта 19/19?",
  "В честь кого назван объект, который считается Домом высокого стиля?",
  "Назовите День Рождения Компании",
  "Какой знаковый арт-объект разместился во дворе 1919?",
  "На каком этаже расположен Sky Lounge в Шепилевском?",
  "Между какими башнями расположен небесный мост?",
  "Какой объект Компании вам нравится больше всего? Напишите краткую оду проекту",
  "В каком районе Москвы будет расположен первый проект компании",
  "Какой слоган у компании",
  "На какие фрагменты делится Element Prime",
  "Что такое Element Первый?",
  "Когда был получен РНВ в 1919?",
  "Какая высота верблюда у Башен?",
  "На какой высоте находится Небесный мост в Башнях?",
  "Какая длина и глубина бассейна в Берег. Курортный?",
  "Назовите знаковое число компании?",
  "Назовите артистов, которые выступали на презентации 17/33",
  "Какие игроки Зенита снялись в риллсах Element?",
  "В каком загородном курортном комплексе открыт брендированный пляж Element Lounge?",
  "Сколько стоит самый дорогой пентхаус в Петербурге, расположившиймя в 17/33 Residence",
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
  timerEl.textContent = `Осталось: ${minutes}:${seconds}`;
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
  const durationSeconds = Math.max(
    0,
    TOTAL_SECONDS - remainingSeconds
  );

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
    saveStatus.textContent = "Ответы сохранены.";
  } catch (error) {
    saveStatus.textContent =
      "Не удалось сохранить ответы. Проверьте соединение.";
  }
}

function showEnd(status) {
  surveySection.classList.remove("is-active");
  endSection.classList.add("is-active");
  endMessage.textContent =
    status === "timeout"
      ? "Время вышло, форма опроса закрыта."
      : "Опрос завершен.";
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
  greeting.textContent = name ? `Участник: ${name}` : "";
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
