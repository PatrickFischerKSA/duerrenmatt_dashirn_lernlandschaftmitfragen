// ======================
// Helfer: Normalisierung
// ======================
function norm(s) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Umlaute/Diakritika vereinheitlichen
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9\s-]/g, " ") // Satzzeichen raus
    .replace(/\s+/g, " ")
    .trim();
}

function containsAny(text, needles) {
  return needles.some(n => text.includes(n));
}

function containsAllGroups(text, groups) {
  // groups = [ ["hirn","bewusstsein"], ["angst","furcht"] ] => mind. 1 aus jeder Gruppe
  return groups.every(g => containsAny(text, g));
}

// ======================
// Fragen + erwartete Begriffe
// ======================
const questions = [
  // 1–10 Anfang / Angst / Zählen
  {
    q: "Was setzt Dürrenmatt an den Anfang seines Gedankengangs?",
    page: 1,
    groups: [["hirn", "bewusstsein", "geist"], ["gedankenexperiment", "modell", "annahme"]],
    hint: "Suche am Anfang: Er ersetzt den kosmologischen Ursprung durch ein Denkmodell."
  },
  {
    q: "Warum existiert das Hirn zunächst ohne Außenwelt?",
    page: 1,
    groups: [["allein", "isoliert", "ohne aussenwelt", "kein aussen"], ["nur", "rein", "bloss"], ["hirn", "bewusstsein"]],
    hint: "Betone: Es gibt am Anfang nur das Hirn selbst – kein Außen, keine Dinge."
  },
  {
    q: "Welches Grundgefühl prägt den Beginn des Denkens?",
    page: 1,
    groups: [["angst", "furcht", "entsetzen", "urangst"]],
    hint: "Ein negatives Grundgefühl dominiert den Beginn (nicht Neugier, nicht Freude)."
  },
  {
    q: "Warum ist das Alleinsein des Hirns problematisch?",
    page: 1,
    groups: [["keine beziehung", "kein gegenuber", "kein du", "kein anderes"], ["angst", "furcht", "bedrohlich", "unertraglich"]],
    hint: "Fokus: Ohne Gegenüber kippt die Existenz in Angst/Bedrohung."
  },
  {
    q: "Wie entstehen die ersten Impulse im Hirn?",
    page: 2,
    groups: [["impuls", "reiz", "regung", "bewegung"], ["aus sich", "selbst", "innen"]],
    hint: "Beschreibe: Regungen entstehen im Hirn selbst – nicht durch Außenreize."
  },
  {
    q: "Warum empfindet das Hirn Angst vor dem Stillstand?",
    page: 2,
    groups: [["stillstand", "leere", "nichts", "erstarren"], ["angst", "furcht", "panik"]],
    hint: "Begründe: Stillstand bedeutet Leere/Nichts – und genau das wird als bedrohlich erlebt."
  },
  {
    q: "Wie entwickelt sich aus Impulsen das Zeitgefühl?",
    page: 2,
    groups: [["folge", "abfolge", "rhythmus", "sequenz"], ["zeit", "dauer", "vorher", "nachher"]],
    hint: "Zeit entsteht aus Abfolge: vorher/nachher, Wiederholung, Rhythmus."
  },
  {
    q: "Welche Funktion übernimmt das Gedächtnis?",
    page: 3,
    groups: [["gedachtnis", "erinnerung"], ["speichern", "festhalten", "bewahren"], ["ordnung", "struktur", "zusammenhang"]],
    hint: "Gedächtnis = Festhalten/Ordnen von Abfolgen, damit Kontinuität möglich wird."
  },
  {
    q: "Warum beginnt das Hirn zu zählen?",
    page: 3,
    groups: [["zahlen", "zahlenfolge", "zahlenreihe", "zaehlen"], ["gegen angst", "angst bändigen", "beruhigen", "kontrolle"]],
    hint: "Zählen dient als Strategie gegen Angst/Leere: Ordnung und Kontrolle."
  },
  {
    q: "Was geschieht, wenn das Zählen endet?",
    page: 3,
    groups: [["angst", "furcht", "entsetzen"], ["ruckkehr", "wieder", "erneut"]],
    hint: "Wenn die Ordnung wegfällt, kehrt das Grundgefühl zurück."
  },

  // 11–20 Zahl / Rhythmus / Musik
  {
    q: "Warum wird das bloße Zählen dem Hirn langweilig?",
    page: 4,
    groups: [["langweilig", "monoton", "eintonig"], ["zahlen", "zaehlen"]],
    hint: "Monotonie der Zahlenfolge – das Hirn sucht Variation/Mehr."
  },
  {
    q: "Wie entstehen aus Zahlen Rhythmen?",
    page: 4,
    groups: [["rhythmus", "takt", "wiederholung"], ["zahlen", "zaehlen"], ["muster", "struktur"]],
    hint: "Erkläre: Wiederkehrende Zahlenmuster werden als Rhythmus/Takt erfahrbar."
  },
  {
    q: "Wie entwickelt sich daraus Musik?",
    page: 4,
    groups: [["musik", "klang", "melodie"], ["rhythmus", "takt"], ["ordnung", "struktur"]],
    hint: "Musik als gesteigerte Ordnung: Rhythmus + Struktur (nicht bloß Zählen)."
  },
  {
    q: "Warum kann das Hirn Musik denken, ohne sie zu hören?",
    page: 5,
    groups: [["vorstellen", "im kopf", "denken", "innerlich"], ["musik", "klang"], ["ohne aussen", "ohne horen", "ohne ohr"]],
    hint: "Betone die Innenwelt: Musik entsteht als gedankliche Form, nicht als Außenreiz."
  },
  {
    q: "Welches Gefühl ersetzt zeitweise die Angst?",
    page: 5,
    groups: [["lust", "freude", "genuss", "beruhigung"], ["musik", "ordnung", "rhythmus"]],
    hint: "Beschreibe: Ordnung/Musik erzeugt kurzzeitig ein positives oder beruhigendes Gefühl."
  },
  {
    q: "Warum kehrt die Angst immer wieder zurück?",
    page: 5,
    groups: [["grundlage", "ursprung", "nicht gelost", "unaufhebbar"], ["angst", "furcht"], ["kein gegenuber", "allein"]],
    hint: "Die Ursache ist nicht wirklich beseitigt: Alleinsein/Grundbedrohung bleibt."
  },
  {
    q: "Welche Rolle spielt Ordnung im Denken?",
    page: 6,
    groups: [["ordnung", "struktur", "gesetz"], ["gegen angst", "bändigen", "kontrolle"]],
    hint: "Ordnung ist Abwehr gegen Angst: Strukturieren, festlegen, kontrollieren."
  },
  {
    q: "Warum entsteht Ohnmacht?",
    page: 6,
    groups: [["ohnmacht", "machtlos", "hilflos"], ["grenze", "unvermogen", "scheitern"], ["denken", "begreifen"]],
    hint: "Ohnmacht entsteht, wenn Denken an Grenzen stößt und keine Lösung findet."
  },
  {
    q: "Wie reagiert das Hirn emotional auf diese Ohnmacht?",
    page: 6,
    groups: [["verzweiflung", "wut", "panik", "angst"], ["ohnmacht", "machtlos"]],
    hint: "Nenne ein starkes Gefühl als Reaktion auf Machtlosigkeit (z. B. Angst/Verzweiflung/Wut)."
  },
  {
    q: "Warum sucht das Hirn ein Gegenüber?",
    page: 7,
    groups: [["gegenuber", "du", "anderes", "welt"], ["beziehung", "dialog", "antwort"]],
    hint: "Weil Bedeutung/Ich erst im Verhältnis zu einem Anderen stabil wird."
  },

  // 21–30 Ich / Mathematik / Materie
  {
    q: "Wie entdeckt das Hirn das Ich?",
    page: 7,
    groups: [["ich", "selbst", "selbstbewusstsein"], ["abgrenzung", "unterscheidung", "gegenuber"]],
    hint: "Ich entsteht als Unterscheidung: Ich vs. Nicht-Ich / Gegenüber."
  },
  {
    q: "Warum wird das Hirn nach der Ich-Entdeckung ‚ganz Gefühl‘?",
    page: 7,
    groups: [["gefuhl", "emotion", "empfinden"], ["ich", "selbst"]],
    hint: "Nach dem Ich-Blick wird Existenz stark emotional erlebt – nicht nur als Struktur."
  },
  {
    q: "Welche Rolle spielt die Mathematik im Denken des Hirns?",
    page: 8,
    groups: [["mathematik", "zahlen", "formel", "logik"], ["ordnung", "struktur", "gesetz"]],
    hint: "Mathematik = radikale Ordnung/Strukturierung der Welt (und des Denkens)."
  },
  {
    q: "Warum reicht Mathematik allein nicht aus?",
    page: 8,
    groups: [["nicht genug", "reicht nicht", "unzulanglich"], ["wirklichkeit", "leben", "sinn", "gefuhl"]],
    hint: "Sie ordnet, aber erklärt nicht alles (Sinn/Leben/Existenz bleiben offen)."
  },
  {
    q: "Was versucht das Hirn stattdessen zu denken?",
    page: 9,
    groups: [["materie", "stoff", "welt", "ding"], ["aussen", "wirklichkeit"]],
    hint: "Übergang: vom reinen Denken zur Vorstellung von Welt/Materie."
  },
  {
    q: "Wie denkt das Hirn Materie?",
    page: 9,
    groups: [["materie", "stoff"], ["energie", "kraft", "bewegung"], ["raum", "welt"]],
    hint: "Beschreibe Materie als etwas Räumliches/Wirksames (Stoff/Energie/Bewegung)."
  },
  {
    q: "Warum bleibt auch Materie unbefriedigend?",
    page: 10,
    groups: [["unbefriedigend", "nicht genug"], ["kein sinn", "keine antwort", "leer"], ["angst", "ohnmacht"]],
    hint: "Auch Materie liefert keine endgültige Antwort gegen Angst/Ohnmacht."
  },
  {
    q: "Welche Bedeutung hat der Raum außerhalb des Hirns?",
    page: 10,
    groups: [["raum", "aussenraum", "welt"], ["gegenuber", "anderes"], ["wirklichkeit", "existenz"]],
    hint: "Außenraum = Möglichkeit eines Gegenübers/Welt, die nicht nur im Hirn ist."
  },
  {
    q: "Was sucht das Hirn letztlich wirklich?",
    page: 11,
    groups: [["sinn", "bedeutung", "erlosung", "antwort"], ["gegenuber", "du", "anderes"]],
    hint: "Nicht bloß Dinge: Es geht um Sinn/Antwort/Beziehung – ein Gegenüber."
  },
  {
    q: "Warum ist Denken auf ein Gegenüber angewiesen?",
    page: 11,
    groups: [["gegenuber", "du", "anderes"], ["bestatigung", "antwort", "beziehung"], ["ich", "selbst"]],
    hint: "Ohne Gegenüber bleibt das Ich instabil und Sinn/Antwort fehlen."
  },

  // 31–40 Leben / Geschichte / Auschwitz
  {
    q: "Wie gelangt das Hirn zur Vorstellung der Urzelle?",
    page: 12,
    groups: [["urzelle", "zelle", "anfang des lebens"], ["leben", "biologie", "evolution"]],
    hint: "Der Gedanke bewegt sich vom Kosmos zur Entstehung von Leben (Zelle als Ursprung)."
  },
  {
    q: "Warum wird der Tod Teil des Lebensdenkens?",
    page: 12,
    groups: [["tod", "sterben"], ["leben", "lebewesen"], ["notwendig", "bedingt", "teil davon"]],
    hint: "Leben wird zusammen mit Vergänglichkeit gedacht: Sterblichkeit gehört dazu."
  },
  {
    q: "Was bedeutet Evolution für das Hirn?",
    page: 13,
    groups: [["evolution", "entwicklung", "anpassung"], ["kampf", "selektion", "auswahl"]],
    hint: "Evolution als Entwicklung durch Auswahl/Kampf/Anpassung."
  },
  {
    q: "Warum gehört der Mord zum Denken des Lebens?",
    page: 13,
    groups: [["mord", "toten", "gewalt"], ["kampf", "uberleben", "evolution"]],
    hint: "Hart, aber textnah: Leben/Kampf/Überleben führt auch zu Gewalt."
  },
  {
    q: "Wie entsteht menschliches Ich-Bewusstsein?",
    page: 14,
    groups: [["ich", "bewusstsein", "selbst"], ["mensch", "sprache", "denken"], ["beziehung", "gegenuber"]],
    hint: "Betone: menschliches Selbstbewusstsein entsteht sozial/sprachlich und im Gegenüber."
  },
  {
    q: "Warum ist die Erkenntnis der eigenen Sterblichkeit zentral?",
    page: 14,
    groups: [["sterblichkeit", "tod"], ["erkenntnis", "wissen"], ["sinn", "angst", "existenz"]],
    hint: "Sterblichkeit verändert Sinn/Angst/Existenz – sie ist ein Kern der menschlichen Lage."
  },
  {
    q: "Welche Rolle spielen Religionen im Denken des Hirns?",
    page: 15,
    groups: [["religion", "gott", "glauben"], ["antwort", "sinn", "trosten", "erlosung"]],
    hint: "Religionen erscheinen als Sinn-/Antwortversuch angesichts von Angst und Tod."
  },
  {
    q: "Warum wiederholt sich Geschichte?",
    page: 16,
    groups: [["geschichte", "wiederholung", "immer wieder"], ["macht", "gewalt", "krieg"]],
    hint: "Denk an Muster: Macht/Angst/Ordnung/Gewalt kehren in Variationen zurück."
  },
  {
    q: "Wie beschreibt Dürrenmatt den historischen Bruch?",
    page: 17,
    groups: [["bruch", "zivilisationsbruch", "abgrund"], ["geschichte", "neu", "ohne beispiel"]],
    hint: "Hier geht es um eine Grenze des Vorstellbaren/der bisherigen Geschichte."
  },
  {
    q: "Warum bezeichnet Dürrenmatt Auschwitz als undenkbar?",
    page: 18,
    groups: [["auschwitz"], ["undenkbar", "nicht denkbar", "unvorstellbar"], ["bruch", "grenze"]],
    hint: "Auschwitz erscheint als Grenze des Denkens/der Vorstellung – ein radikaler Bruch."
  }
];

// ======================
// UI-Aufbau
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
    const valRaw = input.value;
    const val = norm(valRaw);
    answers[i] = valRaw;

    if (!val) {
      feedback.textContent = "";
      hintDiv.textContent = "";
      return;
    }

    // großzügig: mind. 1 Begriff aus jeder Gruppe
    const ok = containsAllGroups(val, item.groups);

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
  document.querySelectorAll(".question input").forEach(i => (i.value = ""));
  document.querySelectorAll(".feedback").forEach(f => (f.textContent = ""));
  document.querySelectorAll(".hint").forEach(h => (h.textContent = ""));
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
