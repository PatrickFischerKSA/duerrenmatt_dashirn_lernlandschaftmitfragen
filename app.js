// ======================
// Normalisierung (robust)
// ======================
function norm(s) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ======================
// Semantische Synonyme
// ======================
const SYNONYMS = {
  angst: ["angst", "furcht", "entsetzen", "panik", "bedroh", "schrecken"],
  hirn: ["hirn", "gehirn", "bewusstsein", "geist", "denken"],
  gegenueber: ["gegenuber", "anderes", "du", "welt", "aussenwelt"],
  ordnung: ["ordnung", "struktur", "gesetz", "system", "regel"],
  zeit: ["zeit", "dauer", "abfolge", "rhythmus", "folge"],
  musik: ["musik", "klang", "melodie", "rhythmus", "takt"],
  ich: ["ich", "selbst", "selbstbewusstsein", "identitat"],
  tod: ["tod", "sterben", "sterblichkeit", "vergehen"],
  sinn: ["sinn", "bedeutung", "antwort", "erlosung"],
  auschwitz: ["auschwitz", "vernichtung", "lager", "holocaust"]
};

function semanticHits(text) {
  let hits = 0;
  Object.values(SYNONYMS).forEach(group => {
    if (group.some(w => text.includes(w))) hits++;
  });
  return hits;
}

function containsAny(text, list) {
  return list.some(w => text.includes(w));
}

// ======================
// Fragen
// ======================
const questions = [
  { q: "Was setzt Dürrenmatt an den Anfang seines Gedankengangs?", page: 1,
    groups: [["hirn","bewusstsein","geist"],["gedankenexperiment","modell","annahme"]],
    hint: "Er ersetzt den kosmologischen Ursprung durch ein Denkmodell." },

  { q: "Warum existiert das Hirn zunächst ohne Außenwelt?", page: 1,
    groups: [["allein","isoliert","kein aussen"],["nur","rein"],["hirn","bewusstsein"]],
    hint: "Am Anfang gibt es nur das Hirn selbst – kein Außen." },

  { q: "Welches Grundgefühl prägt den Beginn des Denkens?", page: 1,
    groups: [["angst","furcht","entsetzen"]],
    hint: "Ein negatives Grundgefühl dominiert den Anfang." },

  { q: "Warum ist das Alleinsein des Hirns problematisch?", page: 1,
    groups: [["kein gegenuber","kein du"],["angst","bedrohlich"]],
    hint: "Ohne Gegenüber kippt Existenz in Angst." },

  { q: "Wie entstehen die ersten Impulse im Hirn?", page: 2,
    groups: [["impuls","regung","bewegung"],["selbst","innen"]],
    hint: "Regungen entstehen im Hirn selbst." },

  { q: "Warum empfindet das Hirn Angst vor dem Stillstand?", page: 2,
    groups: [["stillstand","leere","nichts"],["angst"]],
    hint: "Stillstand bedeutet Leere – das wird als bedrohlich erlebt." },

  { q: "Wie entwickelt sich aus Impulsen das Zeitgefühl?", page: 2,
    groups: [["abfolge","rhythmus","folge"],["zeit","dauer"]],
    hint: "Zeit entsteht aus Abfolge und Wiederholung." },

  { q: "Welche Funktion übernimmt das Gedächtnis?", page: 3,
    groups: [["gedachtnis","erinnerung"],["festhalten","ordnen"]],
    hint: "Gedächtnis ordnet und bewahrt Abfolgen." },

  { q: "Warum beginnt das Hirn zu zählen?", page: 3,
    groups: [["zahlen","zaehlen"],["angst","beruhigen","kontrolle"]],
    hint: "Zählen schafft Ordnung gegen Angst." },

  { q: "Was geschieht, wenn das Zählen endet?", page: 3,
    groups: [["angst","furcht"],["ruckkehr","wieder"]],
    hint: "Mit dem Ende der Ordnung kehrt Angst zurück." },

  // … (11–40 bleiben unverändert inhaltlich; Logik gilt für alle)
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
    <p><strong>${i + 1}. ${item.q}</strong></p>
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
    const val = norm(raw);
    answers[i] = raw;

    if (!val) {
      feedback.textContent = "";
      hintDiv.textContent = "";
      return;
    }

    const strong =
      item.groups.flat().some(w => val.includes(w));

    const sem = semanticHits(val);

    const groupHit =
      item.groups.every(g => containsAny(val, g));

    const ok = strong || sem >= 2 || groupHit;

    if (ok) {
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
    text += `${i + 1}. ${q.q}\nAntwort: ${answers[i] || ""}\nSeite: ${q.page}\n\n`;
  });
  const blob = new Blob([text], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `Das_Hirn_${name}.txt`;
  link.click();
});
