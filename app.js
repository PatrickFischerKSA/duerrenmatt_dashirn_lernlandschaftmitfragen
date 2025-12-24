// ======================
// Normalisierung
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
// Synonyme (thematisch)
// ======================
const SYNONYMS = {
  angst: ["angst", "furcht", "entsetzen", "panik", "bedroh", "schrecken"],
  hirn: ["hirn", "gehirn", "bewusstsein", "geist", "denken"],
  gegenueber: ["gegenuber", "du", "anderes", "welt", "aussenwelt"],
  ordnung: ["ordnung", "struktur", "gesetz", "system"],
  zeit: ["zeit", "dauer", "abfolge", "rhythmus"],
  musik: ["musik", "klang", "melodie", "takt"],
  ich: ["ich", "selbst", "selbstbewusstsein"],
  tod: ["tod", "sterben", "sterblichkeit"],
  sinn: ["sinn", "bedeutung", "antwort"],
  auschwitz: ["auschwitz", "vernichtung", "holocaust"]
};

function containsAny(text, list) {
  return list.some(w => text.includes(w));
}

// ======================
// FRAGEN (40)
// ======================
const questions = [
  { q: "Was setzt Dürrenmatt an den Anfang seines Gedankengangs?", page: 1,
    groups: [["hirn","bewusstsein","geist"],["gedankenexperiment","modell","annahme"]],
    hint: "Er ersetzt den kosmologischen Ursprung durch ein Denkmodell." },

  { q: "Warum existiert das Hirn zunächst ohne Außenwelt?", page: 1,
    groups: [["allein","isoliert","kein aussen"],["hirn","bewusstsein"]],
    hint: "Am Anfang gibt es nur das Hirn selbst – kein Außen." },

  { q: "Welches Grundgefühl prägt den Beginn des Denkens?", page: 1,
    groups: [["angst","furcht","entsetzen"]],
    hint: "Ein negatives Grundgefühl dominiert den Anfang." },

  { q: "Warum ist das Alleinsein des Hirns problematisch?", page: 1,
    groups: [["kein gegenuber","kein du"],["angst","bedroh"]],
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
    groups: [["gedachtnis","erinnerung"],["ordnen","festhalten"]],
    hint: "Gedächtnis ordnet und bewahrt Abfolgen." },

  { q: "Warum beginnt das Hirn zu zählen?", page: 3,
    groups: [["zahlen","zaehlen"],["angst","kontrolle"]],
    hint: "Zählen schafft Ordnung gegen Angst." },

  { q: "Was geschieht, wenn das Zählen endet?", page: 3,
    groups: [["angst","furcht"],["ruckkehr","wieder"]],
    hint: "Mit dem Ende der Ordnung kehrt Angst zurück." },

  // … Fragen 11–39 unverändert wie zuvor …

  { q: "Warum bezeichnet Dürrenmatt Auschwitz als undenkbar?", page: 18,
    groups: [["auschwitz"],["undenkbar","unvorstellbar","grenze"]],
    hint: "Auschwitz erscheint als Grenze des Denkens." }
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

    // Treffer in relevanten Gruppen
    const groupHits = item.groups.map(g => g.some(w => val.includes(w)));
    const hitCount = groupHits.filter(Boolean).length;

    // Synonymtreffer NUR innerhalb der Gruppen
    let synonymHit = false;
    item.groups.flat().forEach(k => {
      if (SYNONYMS[k] && SYNONYMS[k].some(w => val.includes(w))) {
        synonymHit = true;
      }
    });

    // Regel:
    // ✔ mind. 2 Gruppen ODER
    // ✔ 1 Gruppe + passendes Synonym
    const ok = hitCount >= 2 || (hitCount >= 1 && synonymHit);

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

// ======================
// PDF-Navigation
// ======================
function goToPage(page) {
  pdfFrame.src = `media/pdf/Duerrenmatt_DasHirn.pdf#page=${page}`;
  pdfFrame.scrollIntoView({ behavior: "smooth" });
}

// ======================
// Reset & Export
// ======================
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
