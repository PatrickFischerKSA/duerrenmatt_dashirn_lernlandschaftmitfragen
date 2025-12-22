const audio = document.getElementById("bgAudio");
const audioBtn = document.getElementById("audioBtn");
const resetBtn = document.getElementById("resetBtn");
const exportBtn = document.getElementById("exportBtn");
const pdfFrame = document.getElementById("pdfFrame");

let audioUnlocked = false;
let audioPlaying = false;

audioBtn.addEventListener("click", () => {
  if (!audioUnlocked) {
    audio.volume = 0.12;
    audio.play().then(() => {
      audioUnlocked = true;
      audioPlaying = true;
    }).catch(e => console.log("Audio blockiert:", e));
  } else {
    if (audioPlaying) {
      audio.pause();
      audioPlaying = false;
    } else {
      audio.play();
      audioPlaying = true;
    }
  }
});

const questions = [
  {
    q: "Was stellt Dürrenmatt anstelle des Urknalls als Gedankenexperiment vor?",
    a: ["hirn", "reines hirn"],
    hint: "Am Anfang ersetzt Dürrenmatt den kosmologischen Ursprung durch ein Denkmodell.",
    page: 1
  },
  {
    q: "Welches Gefühl steht am Anfang der Existenz des Hirns?",
    a: ["angst", "entsetzen", "urangst"],
    hint: "Das Hirn fühlt zunächst nur sich selbst – und das ist kein positives Gefühl.",
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
let answers = [];

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

  function check() {
    const val = input.value.toLowerCase();
    answers[i] = val;
    if (!val) {
      feedback.textContent = "";
      hintDiv.textContent = "";
      return;
    }
    if (item.a.some(a => val.includes(a))) {
      feedback.textContent = "✓ richtig";
      hintDiv.textContent = "";
    } else {
      feedback.textContent = "✗ noch nicht richtig";
      hintDiv.textContent = item.hint;
    }
  }

  input.addEventListener("blur", check);
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      check();
    }
  });

  btn.addEventListener("click", () => {
    pdfFrame.src = `media/pdf/Duerrenmatt_DasHirn.pdf#page=${item.page}`;
    pdfFrame.scrollIntoView({ behavior: "smooth" });
  });

  quiz.appendChild(div);
});

resetBtn.addEventListener("click", () => {
  if (!confirm("Alle Antworten wirklich löschen?")) return;
  document.querySelectorAll(".question input").forEach(i => i.value = "");
  document.querySelectorAll(".feedback").forEach(f => f.textContent = "");
  document.querySelectorAll(".hint").forEach(h => h.textContent = "");
  answers = [];
});

exportBtn.addEventListener("click", () => {
  const name = document.getElementById("name").value || "Ohne_Name";
  let text = `Name: ${name}\nDatum: ${new Date().toLocaleString()}\n\n`;
  questions.forEach((q, i) => {
    text += `${i + 1}. ${q.q}\nAntwort: ${answers[i] || ""}\n\n`;
  });
  const blob = new Blob([text], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `Das_Hirn_${name}.txt`;
  link.click();
});
