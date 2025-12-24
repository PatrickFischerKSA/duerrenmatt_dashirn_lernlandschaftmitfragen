// ======================
// Normalisierung + Tokens
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

function tokens(s) {
  return norm(s).split(" ").filter(t => t.length >= 3);
}

function wordHit(tok, word) {
  return tok.includes(word);
}

// ======================
// Synonyme (gruppenbasiert)
// ======================
const SYNONYMS = {
  angst: ["angst", "furcht", "entsetzen", "panik"],
  hirn: ["hirn", "gehirn", "bewusstsein", "geist"],
  gegenueber: ["gegenuber", "du", "anderes", "welt", "aussenwelt"],
  ordnung: ["ordnung", "struktur", "gesetz", "system", "regel"],
  zeit: ["zeit", "dauer", "abfolge", "rhythmus", "folge"],
  musik: ["musik", "klang", "melodie", "takt", "rhythmus"],
  ich: ["ich", "selbst", "selbstbewusstsein", "identitat"],
  tod: ["tod", "sterben", "sterblichkeit", "vergehen"],
  sinn: ["sinn", "bedeutung", "antwort", "erlosung"],
  auschwitz: ["auschwitz", "holocaust", "vernichtung"]
};

// Ein Group-Key ist entweder ein echtes Wort ("zahlen") ODER ein Synonym-Key ("angst").
// Wenn SYNONYMS[key] existiert, matchen wir gegen dieses Set, sonst gegen das Wort selbst.
function groupKeyMatches(tok, key) {
  if (SYNONYMS[key]) {
    return SYNONYMS[key].some(w => wordHit(tok, w));
  }
  return wordHit(tok, key);
}

function countGroupHits(tok, groups) {
  // groups: Array von Gruppen; jede Gruppe ist Array von Keys/Wörtern
  let hits = 0;
  groups.forEach(group => {
    const ok = group.some(key => groupKeyMatches(tok, key));
    if (ok) hits++;
  });
  return hits;
}

function missingGroups(tok, groups) {
  const missing = [];
  groups.forEach((group, idx) => {
    const ok = group.some(key => groupKeyMatches(tok, key));
    if (!ok) missing.push(idx);
  });
  return missing;
}

// Für Lösungsvorschläge: schöne Liste aus Keys/Synonymen
function suggestionsForGroups(groups) {
  // wir geben pro Gruppe 2–4 Vorschläge (kompakt)
  return groups.map(group => {
    // group: ["angst"] oder ["zahlen","zaehlen"] usw.
    const out = [];
    group.forEach(key => {
      if (SYNONYMS[key]) {
        // nimm 3 Synonyme aus dem Set
        out.push(...SYNONYMS[key].slice(0, 3));
      } else {
        out.push(key);
      }
    });
    // Dedupe & kürzen
    const uniq = [...new Set(out)];
    return uniq.slice(0, 4);
  });
}

// ======================
// FRAGEN (40) – Struktur bleibt gleich
// Hinweis-Regeln greifen automatisch.
// WICHTIG: groups sind jetzt bewusst "Schlüsselbegriffe" (Keys/Wörter),
// z.B. ["angst"] statt ["angst","furcht",...], denn SYNONYMS deckt das ab.
// ======================
const questions = [
  { q: "Was setzt Dürrenmatt an den Anfang seines Gedankengangs?", page: 1,
    groups: [["hirn"], ["gedankenexperiment","modell","annahme"]],
    hint1: "Formuliere: Was wird als Ausgangspunkt gesetzt (nicht Kosmos, sondern Denkmodell)?"
  },
  { q: "Warum existiert das Hirn zunächst ohne Außenwelt?", page: 1,
    groups: [["hirn"], ["allein","isoliert","kein","aussenwelt"]],
    hint1: "Betone den Startzustand: nur Innen – noch kein Außen/keine Welt."
  },
  { q: "Welches Grundgefühl prägt den Beginn des Denkens?", page: 1,
    groups: [["angst"]],
    hint1: "Nenne das dominante Gefühl am Anfang (kein neutrales Wort)."
  },
  { q: "Warum ist das Alleinsein des Hirns problematisch?", page: 1,
    groups: [["hirn"], ["allein","isoliert"], ["angst"]],
    hint1: "Verknüpfe: Alleinsein → bedrohliches Gefühl. Was fehlt dem Hirn?"
  },
  { q: "Wie entstehen die ersten Impulse im Hirn?", page: 2,
    groups: [["hirn"], ["impuls","regung","bewegung"], ["selbst","innen"]],
    hint1: "Wichtig: Die Impulse kommen nicht von außen, sondern aus dem Hirn selbst."
  },
  { q: "Warum empfindet das Hirn Angst vor dem Stillstand?", page: 2,
    groups: [["stillstand","leere","nichts"], ["angst"]],
    hint1: "Nenne das Bedrohliche am Stillstand (Leere/Nichts) + das Gefühl dazu."
  },
  { q: "Wie entwickelt sich aus Impulsen das Zeitgefühl?", page: 2,
    groups: [["abfolge","folge","rhythmus"], ["zeit"]],
    hint1: "Zeit entsteht aus Reihenfolge/Wiederholung (vorher–nachher)."
  },
  { q: "Welche Funktion übernimmt das Gedächtnis?", page: 3,
    groups: [["gedachtnis","erinnerung"], ["ordnen","festhalten","speichern"]],
    hint1: "Gedächtnis = Festhalten/Ordnen, damit Kontinuität möglich wird."
  },
  { q: "Warum beginnt das Hirn zu zählen?", page: 3,
    groups: [["zahlen","zaehlen"], ["ordnung"], ["angst"]],
    hint1: "Zählen ist nicht Mathe-Spiel: Es schafft Ordnung gegen Angst."
  },
  { q: "Was geschieht, wenn das Zählen endet?", page: 3,
    groups: [["angst"], ["ruckkehr","wieder"]],
    hint1: "Was kommt zurück, wenn die Ordnung wegfällt?"
  },

  { q: "Warum wird das bloße Zählen dem Hirn langweilig?", page: 4,
    groups: [["zahlen","zaehlen"], ["langweilig","monoton"]],
    hint1: "Begründe: Zählen wird monoton – das Hirn sucht Variation."
  },
  { q: "Wie entstehen aus Zahlen Rhythmen?", page: 4,
    groups: [["zahlen","zaehlen"], ["rhythmus","takt"], ["muster","wiederholung"]],
    hint1: "Zahlenmuster/Wiederholung → Rhythmus/Takt."
  },
  { q: "Wie entwickelt sich daraus Musik?", page: 4,
    groups: [["rhythmus","takt"], ["musik"]],
    hint1: "Musik als gesteigerter Rhythmus/Ordnung – nenne beides."
  },
  { q: "Warum kann das Hirn Musik denken, ohne sie zu hören?", page: 5,
    groups: [["musik"], ["hirn"], ["innen","vorstellen","denken"]],
    hint1: "Betone: innere Vorstellung (im Kopf) statt Außenreiz (Hören)."
  },
  { q: "Welches Gefühl ersetzt zeitweise die Angst?", page: 5,
    groups: [["angst"], ["beruhigung","freude","lust","genuss"]],
    hint1: "Welches positiv/beruhigende Gefühl taucht kurz auf?"
  },
  { q: "Warum kehrt die Angst immer wieder zurück?", page: 5,
    groups: [["angst"], ["ursache","grund"], ["allein","gegenueber"]],
    hint1: "Die Grundursache bleibt: Was fehlt weiterhin?"
  },
  { q: "Welche Rolle spielt Ordnung im Denken?", page: 6,
    groups: [["ordnung"], ["angst"]],
    hint1: "Ordnung dient als Gegenmittel gegen Angst/Leere."
  },
  { q: "Warum entsteht Ohnmacht?", page: 6,
    groups: [["ohnmacht","machtlos","hilflos"], ["grenze","scheitern"], ["denken"]],
    hint1: "Denken stößt an Grenzen → Machtlosigkeit."
  },
  { q: "Wie reagiert das Hirn emotional auf diese Ohnmacht?", page: 6,
    groups: [["ohnmacht","machtlos"], ["angst"]],
    hint1: "Nenne die emotionale Reaktion (Angst/Verzweiflung o.ä.)."
  },
  { q: "Warum sucht das Hirn ein Gegenüber?", page: 7,
    groups: [["gegenueber"], ["beziehung","antwort","dialog"]],
    hint1: "Sinn/Ich stabilisiert sich im Verhältnis zu einem Anderen."
  },

  { q: "Wie entdeckt das Hirn das Ich?", page: 7,
    groups: [["ich"], ["gegenueber"], ["abgrenzung","unterscheidung"]],
    hint1: "Ich entsteht durch Unterscheidung: Ich vs. Nicht-Ich/Gegenüber."
  },
  { q: "Warum wird das Hirn nach der Ich-Entdeckung ‚ganz Gefühl‘?", page: 7,
    groups: [["ich"], ["gefuhl","emotion","empfinden"]],
    hint1: "Nach dem Ich-Blick wird Existenz stark emotional erlebt."
  },
  { q: "Welche Rolle spielt die Mathematik im Denken des Hirns?", page: 8,
    groups: [["mathematik","zahlen"], ["ordnung"]],
    hint1: "Mathematik = radikale Ordnung/Struktur der Welt."
  },
  { q: "Warum reicht Mathematik allein nicht aus?", page: 8,
    groups: [["mathematik","zahlen"], ["nicht","reicht"], ["sinn"]],
    hint1: "Mathematik ordnet, aber Sinn/Antwort bleibt offen."
  },
  { q: "Was versucht das Hirn stattdessen zu denken?", page: 9,
    groups: [["welt","aussenwelt","materie"], ["gegenueber"]],
    hint1: "Übergang: vom reinen Denken zur Vorstellung einer Welt/Materie."
  },
  { q: "Wie denkt das Hirn Materie?", page: 9,
    groups: [["materie","stoff"], ["raum","welt"]],
    hint1: "Materie als etwas Räumliches/Weltliches – nicht nur Zahl."
  },
  { q: "Warum bleibt auch Materie unbefriedigend?", page: 10,
    groups: [["materie","stoff"], ["nicht","genug"], ["angst"]],
    hint1: "Auch Materie liefert keine endgültige Antwort gegen Angst/Ohnmacht."
  },
  { q: "Welche Bedeutung hat der Raum außerhalb des Hirns?", page: 10,
    groups: [["raum"], ["aussenwelt","welt"], ["gegenueber"]],
    hint1: "Außenraum = Möglichkeit eines echten Gegenübers/Welt."
  },
  { q: "Was sucht das Hirn letztlich wirklich?", page: 11,
    groups: [["sinn"], ["antwort","bedeutung"], ["gegenueber"]],
    hint1: "Nicht nur Dinge: Es geht um Sinn/Antwort im Verhältnis zum Anderen."
  },
  { q: "Warum ist Denken auf ein Gegenüber angewiesen?", page: 11,
    groups: [["gegenueber"], ["ich"], ["bestatigung","antwort"]],
    hint1: "Ohne Gegenüber bleibt das Ich/Sinn instabil."
  },

  { q: "Wie gelangt das Hirn zur Vorstellung der Urzelle?", page: 12,
    groups: [["urzelle","zelle"], ["leben"]],
    hint1: "Vom Kosmos zur Entstehung des Lebens: Zelle als Ursprung."
  },
  { q: "Warum wird der Tod Teil des Lebensdenkens?", page: 12,
    groups: [["tod"], ["leben"]],
    hint1: "Leben wird mit Vergänglichkeit zusammen gedacht."
  },
  { q: "Was bedeutet Evolution für das Hirn?", page: 13,
    groups: [["evolution","entwicklung"], ["auswahl","selektion","kampf"]],
    hint1: "Evolution = Entwicklung durch Auswahl/Anpassung."
  },
  { q: "Warum gehört der Mord zum Denken des Lebens?", page: 13,
    groups: [["mord","gewalt","toten"], ["kampf","uberleben"]],
    hint1: "Textnah: Kampf/Überleben kann in Gewalt münden."
  },
  { q: "Wie entsteht menschliches Ich-Bewusstsein?", page: 14,
    groups: [["ich"], ["mensch","sprache"], ["gegenueber"]],
    hint1: "Selbstbewusstsein entsteht sozial/sprachlich im Gegenüber."
  },
  { q: "Warum ist die Erkenntnis der eigenen Sterblichkeit zentral?", page: 14,
    groups: [["tod"], ["erkenntnis","wissen"], ["sinn","angst"]],
    hint1: "Sterblichkeit verändert Sinn/Angst/Existenz."
  },
  { q: "Welche Rolle spielen Religionen im Denken des Hirns?", page: 15,
    groups: [["religion","gott","glauben"], ["sinn"], ["antwort","trosten"]],
    hint1: "Religionen als Antwort-/Sinnversuch angesichts von Tod/Angst."
  },
  { q: "Warum wiederholt sich Geschichte?", page: 16,
    groups: [["geschichte"], ["wiederholung"], ["macht","gewalt","krieg"]],
    hint1: "Denke an Muster: Macht/Angst/Ordnung/Gewalt kehren wieder."
  },
  { q: "Wie beschreibt Dürrenmatt den historischen Bruch?", page: 17,
    groups: [["bruch"], ["grenze","abgrund"], ["geschichte"]],
    hint1: "Hier geht es um eine Grenze des Vorstellbaren in der Geschichte."
  },
  { q: "Warum bezeichnet Dürrenmatt Auschwitz als undenkbar?", page: 18,
    groups: [["auschwitz"], ["undenkbar","unvorstellbar","grenze"]],
    hint1: "Auschwitz erscheint als Grenze des Denkens/Vorstellens."
  }
];

// ======================
// UI
// ======================
const quiz = document.getElementById("quiz");
const pdfFrame = document.getElementById("pdfFrame");
const resetBtn = document.getElementById("resetBtn");
const exportBtn = document.getElementById("exportBtn");
let answers = [];
let attempts = new Array(questions.length).fill(0);

questions.forEach((item, i) => {
  const div = document.createElement("div");
  div.className = "question";

  div.innerHTML = `
    <p><strong>${i + 1}. ${item.q}</strong></p>
    <input type="text">
    <button class="refBtn">📖 Textstelle</button>
    <div class="feedback"></div>
    <div class="hint"></div>
  `;

  const input = div.querySelector("input");
  const feedback = div.querySelector(".feedback");
  const hintDiv = div.querySelector(".hint");
  const refBtn = div.querySelector(".refBtn");

  function buildHintLevel1(tok) {
    // präziser Hinweis, ohne zu spoilern:
    // sagt, was fehlt (Themenfeld), nicht was genau zu schreiben ist.
    const miss = missingGroups(tok, item.groups);
    if (miss.length === 0) return item.hint1 || "Achte auf die zentrale Aussage dieses Abschnitts.";

    // mappe fehlende Gruppe auf einen neutralen Hinweis
    const label = (grp) => {
      // grp ist Array von keys
      const key = grp[0];
      const map = {
        angst: "Gefühlsebene (Grundgefühl)",
        hirn: "Ausgangspunkt/Instanz (wer denkt?)",
        gegenueber: "Beziehungs-Aspekt (Gegenüber/Welt)",
        ordnung: "Ordnungs-/Struktur-Aspekt",
        zeit: "Zeit-/Abfolge-Aspekt",
        musik: "Rhythmus/Musik-Aspekt",
        ich: "Ich-/Selbst-Aspekt",
        tod: "Tod/Sterblichkeit",
        sinn: "Sinn/Antwort",
        auschwitz: "Schlusspunkt/Auschwitz"
      };
      return map[key] || "fehlender Kernaspekt";
    };

    const missingLabels = miss.map(idx => label(item.groups[idx]));
    // maximal 2 Labels nennen, damit es nicht zu konkret wird
    const shown = missingLabels.slice(0, 2);
    return `Hinweis: Es fehlt noch ein Kernaspekt (${shown.join(" + ")}). Lies die markierte Textstelle nochmals genau.`;
  }

  function buildSolutionSuggestions() {
    // Vorschläge = akzeptierte Begriffe/Synonyme, gruppenweise
    const sug = suggestionsForGroups(item.groups);
    const parts = sug.map((arr, idx) => {
      const n = idx + 1;
      return `(${n}) ${arr.join(" / ")}`;
    });
    return `Lösungsvorschläge (mögliche Schlüsselwörter): ${parts.join("   ")}`;
  }

  function check() {
    const raw = input.value;
    const tok = tokens(raw);
    answers[i] = raw;

    // zu kurz
    if (tok.length < 2) {
      attempts[i]++;
      feedback.textContent = "✗ zu kurz";
      hintDiv.textContent = attempts[i] >= 2 ? buildSolutionSuggestions() : "Hinweis: Formuliere mit mindestens 2–3 sinntragenden Wörtern.";
      return;
    }

    // Treffer zählen: mind. 2 Gruppen müssen getroffen sein
    const hitCount = countGroupHits(tok, item.groups);

    if (hitCount >= 2 || (item.groups.length === 1 && hitCount === 1)) {
      feedback.textContent = "✓ richtig";
      hintDiv.textContent = "";
      return;
    }

    // falsch
    attempts[i]++;
    feedback.textContent = "✗ noch nicht richtig";

    if (attempts[i] >= 2) {
      hintDiv.textContent = buildSolutionSuggestions();
    } else {
      hintDiv.textContent = buildHintLevel1(tok);
    }
  }

  // Korrektur nur bei Blur/Enter
  input.addEventListener("blur", check);
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      check();
    }
  });

  refBtn.addEventListener("click", () => {
    pdfFrame.src = `media/pdf/Duerrenmatt_DasHirn.pdf#page=${item.page}`;
    pdfFrame.scrollIntoView({ behavior: "smooth" });
  });

  quiz.appendChild(div);
});

// ======================
// Reset & Export
// ======================
resetBtn.addEventListener("click", () => {
  if (!confirm("Alle Antworten wirklich löschen?")) return;
  document.querySelectorAll(".question input").forEach(i => (i.value = ""));
  document.querySelectorAll(".feedback").forEach(f => (f.textContent = ""));
  document.querySelectorAll(".hint").forEach(h => (h.textContent = ""));
  answers = [];
  attempts = new Array(questions.length).fill(0);
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
