const audio = document.getElementById("bgAudio");
const audioBtn = document.getElementById("audioBtn");
let audioOn = false;

// very strict browser-safe audio toggle
audioBtn.addEventListener("click", () => {
  if (!audioOn) {
    audio.volume = 0.15;
    audio.play().then(() => {
      audioOn = true;
    }).catch(e => {
      console.log("Audio blockiert:", e);
    });
  } else {
    audio.pause();
    audioOn = false;
  }
});

const questions = [
  {
    q: "Was stellt Dürrenmatt anstelle des Urknalls als Gedankenexperiment vor?",
    a: ["hirn", "reines hirn"],
    hint: "Gleich zu Beginn ersetzt Dürrenmatt den kosmologischen Urknall durch ein Denkmodell.",
    page: 1
  },
  {
    q: "Welches Gefühl steht am Anfang der Existenz des Hirns?",
    a: ["angst", "entsetzen", "urangst"],
    hint: "Das Hirn empfindet zunächst nichts außer sich selbst.",
    page: 1
  },
  {
    q: "Warum beginnt das Hirn zu zählen?",
    a: ["gegen angst", "zeit", "zahlen"],
    hint: "Zählen ist eine Strategie, um einem Zustand zu entkommen.",
    page: 2
  }
];

const quiz = document.getElementById("quiz");
const pdfFrame = document.getElementById("pdfFrame");

questions.forEach((item, i) => {
  const div = document.createElement("div");
  div.className = "question";

  div.innerHTML = `
    <p><strong>${i + 1}. ${item.q}</strong></p>
    <input type="text">
    <div class="buttons">
      <button data-page="${item.page}">📖 Textstelle</button>
    </div>
    <div class="feedback"></div>
    <div class="hint"></div>
  `;

  const input = div.querySelector("input");
  const feedback = div.querySelector(".feedback");
  const hintDiv = div.querySelector(".hint");
  const btn = div.querySelector("button");

  input.addEventListener("input", () => {
    const val = input.value.toLowerCase();
    if (item.a.some(a => val.includes(a))) {
      feedback.textContent = "✓ richtig";
      hintDiv.textContent = "";
    } else {
      feedback.textContent = "";
      hintDiv.textContent = item.hint;
    }
  });

  btn.addEventListener("click", () => {
    pdfFrame.src = `media/pdf/Duerrenmatt_DasHirn.pdf#page=${item.page}`;
    pdfFrame.scrollIntoView({ behavior: "smooth" });
  });

  quiz.appendChild(div);
});
