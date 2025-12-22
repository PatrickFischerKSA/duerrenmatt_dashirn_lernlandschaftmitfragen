const audio = document.getElementById("bgAudio");
let audioReady = false;

function initAudio() {
  if (!audioReady) {
    audio.volume = 0.15;
    audio.play().then(() => {
      audio.pause();
      audioReady = true;
      toggleAudio();
    }).catch(e => console.log("Audio blockiert", e));
  } else {
    toggleAudio();
  }
}

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

questions.forEach((item, i) => {
  const div = document.createElement("div");
  div.className = "question";
  div.innerHTML = `
    <p><strong>${i+1}. ${item.q}</strong></p>
    <input type="text">
    <button onclick="goToPage(${item.page})">📖 Textstelle</button>
    <div class="feedback"></div>
  `;
  const input = div.querySelector("input");
  const fb = div.querySelector(".feedback");
  input.oninput = () => {
    const val = input.value.toLowerCase();
    fb.textContent = item.a.some(a => val.includes(a)) ? "✓ richtig" : "";
  };
  quiz.appendChild(div);
});

function goToPage(page) {
  document.querySelector("iframe").src =
    `media/pdf/Duerrenmatt_DasHirn.pdf#page=${page}`;
}
