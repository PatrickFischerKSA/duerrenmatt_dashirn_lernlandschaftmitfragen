const questions = [
  // 1–10 Anfang / Angst / Zählen
  { q: "Was setzt Dürrenmatt an den Anfang seines Gedankengangs?", page: 1 },
  { q: "Warum existiert das Hirn zunächst ohne Außenwelt?", page: 1 },
  { q: "Welches Grundgefühl prägt den Beginn des Denkens?", page: 1 },
  { q: "Warum ist das Alleinsein des Hirns problematisch?", page: 1 },
  { q: "Wie entstehen die ersten Impulse im Hirn?", page: 2 },
  { q: "Warum empfindet das Hirn Angst vor dem Stillstand?", page: 2 },
  { q: "Wie entwickelt sich aus Impulsen das Zeitgefühl?", page: 2 },
  { q: "Welche Funktion übernimmt das Gedächtnis?", page: 3 },
  { q: "Warum beginnt das Hirn zu zählen?", page: 3 },
  { q: "Was geschieht, wenn das Zählen endet?", page: 3 },

  // 11–20 Zahl / Rhythmus / Musik
  { q: "Warum wird das bloße Zählen dem Hirn langweilig?", page: 4 },
  { q: "Wie entstehen aus Zahlen Rhythmen?", page: 4 },
  { q: "Wie entwickelt sich daraus Musik?", page: 4 },
  { q: "Warum kann das Hirn Musik denken, ohne sie zu hören?", page: 5 },
  { q: "Welches Gefühl ersetzt zeitweise die Angst?", page: 5 },
  { q: "Warum kehrt die Angst immer wieder zurück?", page: 5 },
  { q: "Welche Rolle spielt Ordnung im Denken?", page: 6 },
  { q: "Warum entsteht Ohnmacht?", page: 6 },
  { q: "Wie reagiert das Hirn emotional auf diese Ohnmacht?", page: 6 },
  { q: "Warum sucht das Hirn ein Gegenüber?", page: 7 },

  // 21–30 Ich / Mathematik / Materie
  { q: "Wie entdeckt das Hirn das Ich?", page: 7 },
  { q: "Warum wird das Hirn nach der Ich-Entdeckung ‚ganz Gefühl‘?", page: 7 },
  { q: "Welche Rolle spielt die Mathematik im Denken des Hirns?", page: 8 },
  { q: "Warum reicht Mathematik allein nicht aus?", page: 8 },
  { q: "Was versucht das Hirn stattdessen zu denken?", page: 9 },
  { q: "Wie denkt das Hirn Materie?", page: 9 },
  { q: "Warum bleibt auch Materie unbefriedigend?", page: 10 },
  { q: "Welche Bedeutung hat der Raum außerhalb des Hirns?", page: 10 },
  { q: "Was sucht das Hirn letztlich wirklich?", page: 11 },
  { q: "Warum ist Denken auf ein Gegenüber angewiesen?", page: 11 },

  // 31–40 Leben / Geschichte / Auschwitz
  { q: "Wie gelangt das Hirn zur Vorstellung der Urzelle?", page: 12 },
  { q: "Warum wird der Tod Teil des Lebensdenkens?", page: 12 },
  { q: "Was bedeutet Evolution für das Hirn?", page: 13 },
  { q: "Warum gehört der Mord zum Denken des Lebens?", page: 13 },
  { q: "Wie entsteht menschliches Ich-Bewusstsein?", page: 14 },
  { q: "Warum ist die Erkenntnis der eigenen Sterblichkeit zentral?", page: 14 },
  { q: "Welche Rolle spielen Religionen im Denken des Hirns?", page: 15 },
  { q: "Warum wiederholt sich Geschichte?", page: 16 },
  { q: "Wie beschreibt Dürrenmatt den historischen Bruch?", page: 17 },
  { q: "Warum bezeichnet Dürrenmatt Auschwitz als undenkbar?", page: 18 }
];

const quiz = document.getElementById("quiz");
const pdfFrame = document.getElementById("pdfFrame");
const resetBtn = document.getElementById("resetBtn");
const exportBtn = document.getElementById("exportBtn");
let answers = [];

questions.forEach((item, i) => {
  const div = document.createElement("div");
  div.className = "question";

  div.innerHTML = `
    <p><strong>${i + 1}. ${item.q}</strong></p>
    <input type="text">
    <button onclick="goToPage(${item.page})">📖 Textstelle</button>
    <div class="feedback"></div>
  `;

  const input = div.querySelector("input");
  const feedback = div.querySelector(".feedback");

  function check() {
    answers[i] = input.value;
    feedback.textContent = input.value ? "✓ beantwortet" : "";
  }

  input.addEventListener("blur", check);
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      check();
    }
  });

  quiz.appendChild(div);
});

function goToPage(page) {
  pdfFrame.src = `media/pdf/Duerrenmatt_DasHirn.pdf#page=${page}`;
  pdfFrame.scrollIntoView({ behavior: "smooth" });
}

resetBtn.addEventListener("click", () => {
  if (!confirm("Alle Antworten wirklich löschen?")) return;
  document.querySelectorAll(".question input").forEach(i => i.value = "");
  document.querySelectorAll(".feedback").forEach(f => f.textContent = "");
  answers = [];
});

exportBtn.addEventListener("click", () => {
  const name = document.getElementById("name").value || "Ohne_Name";
  let text = `Name: ${name}\nDatum: ${new Date().toLocaleString()}\n\n`;
  questions.forEach((q, i) => {
    text += `${i + 1}. ${q.q}\nAntwort: ${answers[i] || ""}\nSeite: ${q.page}\n\n`;
  });
  const blob = new Blob([text], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `Das_Hirn_${name}.txt`;
  link.click();
});
