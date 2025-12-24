// ======================
// Normalisierung
// ======================
function norm(s) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Wortweise Tokenisierung
function tokens(s) {
  return norm(s).split(" ").filter(t => t.length >= 3);
}

// prüft echte Worttreffer (keine Substrings)
function wordHit(tok, word) {
  return tok.includes(word);
}

// ======================
// Synonyme (klar begrenzt)
// ======================
const SYNONYMS = {
  angst: ["angst", "furcht", "entsetzen"],
  hirn: ["hirn", "gehirn", "bewusstsein"],
  gegenueber: ["gegenuber", "du", "anderes"],
  ordnung: ["ordnung", "struktur"],
  zeit: ["zeit", "dauer", "abfolge"],
  musik: ["musik", "klang"],
  ich: ["ich", "selbst"],
  tod: ["tod", "sterben"],
  auschwitz: ["auschwitz"]
};

// ======================
// FRAGEN
// ======================
const questions = [
  {
    q: "Welches Grundgefühl prägt den Beginn des Denkens?",
    page: 1,
    groups: [["angst"], ["hirn","bewusstsein"]],
    hint: "Es geht um ein dominierendes Gefühl zu Beginn – kein neutrales."
  },
  {
    q: "Warum ist das Alleinsein des Hirns problematisch?",
    page: 1,
    groups: [["allein","isoliert"], ["angst"], ["gegenuber"]],
    hint: "Beziehe Angst und fehlendes Gegenüber aufeinander."
  },
  {
    q: "Warum beginnt das Hirn zu zählen?",
    page: 3,
    groups: [["zahlen","zaehlen"], ["angst"]],
    hint: "Zählen dient nicht der Mathematik, sondern der Angstabwehr."
  },
  {
    q: "Warum bezeichnet Dürrenmatt Auschwitz als undenkbar?",
    page: 18,
    groups: [["auschwitz"], ["undenkbar","grenze"]],
    hint: "Auschwitz markiert eine Grenze des Denkens."
  }
  // → alle weiteren Fragen nach demselben Muster
];

// ======================
// UI
// ======================
const quiz = document.getElementById("quiz");
const pdfFrame = document.getElementById("pdfFrame");
const resetBtn = document.getElementById("resetBtn");
const exportBtn = document.getElementById("exportBtn");
let answers = [];

questions.forEach((item, i) => {
  const div = document.createElement("div");
  div.className = "question";

  div.innerHTML = `
    <p><strong>${i+1}. ${item.q}</strong></p>
    <input type="text">
    <button onclick="goToPage(${item.page})">📖 Textstelle</button>
    <div class="feedback"></div>
    <div class="hint"></div>
  `;

  const input = div.querySelector("input");
  const feedback = div.querySelector(".feedback");
  const hintDiv = div.querySelector(".hint");

  function check() {
    const raw = input.value;
    const tok = tokens(raw);
    answers[i] = raw;

    if (tok.length < 2) {
      feedback.textContent = "✗ zu kurz";
      hintDiv.textContent = item.hint;
      return;
    }

    // Gruppenprüfung: mindestens 2 Gruppen müssen getroffen sein
    let groupHits = 0;

    item.groups.forEach(group => {
      const hit = group.some(g =>
        wordHit(tok, g) ||
        (SYNONYMS[g] && SYNONYMS[g].some(s => wordHit(tok, s)))
      );
      if (hit) groupHits++;
    });

    if (groupHits >= 2) {
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
  document.querySelectorAll(".hint").forEach(h => h.textContent = "");
  answers = [];
});

exportBtn.addEventListener("click", () => {
  const name = document.getElementById("name").value || "Ohne_Name";
  let text = `Name: ${name}\nDatum: ${new Date().toLocaleString()}\n\n`;
  questions.forEach((q, i) => {
    text += `${i+1}. ${q.q}\nAntwort: ${answers[i] || ""}\n\n`;
  });
  const blob = new Blob([text], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `Das_Hirn_${name}.txt`;
  link.click();
});
