const audio = document.getElementById("bgAudio");
const audioBtn = document.getElementById("audioBtn");
let audioReady = false;

// robust audio init: must be triggered directly by user click
audioBtn.addEventListener("click", () => {
  if (!audioReady) {
    audio.volume = 0.15;
    audio.play().then(() => {
      audio.pause();
      audioReady = true;
      toggleAudio();
    }).catch(e => {
      console.log("Audio blockiert:", e);
    });
  } else {
    toggleAudio();
  }
});

function toggleAudio() {
  audio.paused ? audio.play() : audio.pause();
}

const questions = [
  {
    q: "Was stellt Dürrenmatt anstelle des Urknalls als Gedankenexperiment vor?",
    a: ["hirn", "reines hirn"],
    page: 1
  },
  {
    q: "Welches Gefühl steht am Anfang der Existenz des Hirns?",
    a: ["angst", "entsetzen"],
    page: 1
  },
  {
    q: "Warum beginnt das Hirn zu zählen?",
    a: ["gegen angst", "zeit"],
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
  `;

  const input = div.querySelector("input");
  const feedback = div.querySelector(".feedback");
  const btn = div.querySelector("button");

  input.addEventListener("input", () => {
    const val = input.value.toLowerCase();
    feedback.textContent =
      item.a.some(a => val.includes(a)) ? "✓ richtig" : "";
  });

  btn.addEventListener("click", () => {
    pdfFrame.src = `media/pdf/Duerrenmatt_DasHirn.pdf#page=${item.page}`;
    pdfFrame.scrollIntoView({ behavior: "smooth" });
  });

  quiz.appendChild(div);
});
