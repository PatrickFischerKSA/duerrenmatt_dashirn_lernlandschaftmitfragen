// ======================
// Normalisierung & Tokenisierung
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
// Synonyme (kontrolliert)
// ======================
const SYNONYMS = {
  angst: ["angst", "furcht", "entsetzen", "panik"],
  hirn: ["hirn", "gehirn", "bewusstsein", "geist"],
  gegenueber: ["gegenuber", "du", "anderes", "welt", "aussenwelt"],
  ordnung: ["ordnung", "struktur", "gesetz", "system"],
  zeit: ["zeit", "dauer", "abfolge", "rhythmus"],
  musik: ["musik", "klang", "melodie", "takt"],
  ich: ["ich", "selbst", "selbstbewusstsein"],
  tod: ["tod", "sterben", "sterblichkeit"],
  sinn: ["sinn", "bedeutung", "antwort"],
  auschwitz: ["auschwitz", "holocaust", "vernichtung"]
};

function groupKeyMatches(tok, key) {
  if (SYNONYMS[key]) {
    return SYNONYMS[key].some(w => wordHit(tok, w));
  }
  return wordHit(tok, key);
}

function countGroupHits(tok, groups) {
  let hits = 0;
  groups.forEach(group => {
    if (group.some(key => groupKeyMatches(tok, key))) hits++;
  });
  return hits;
}

function missingGroups(tok, groups) {
  const missing = [];
  groups.forEach((group, idx) => {
    if (!group.some(key => groupKeyMatches(tok, key))) missing.push(idx);
  });
  return missing;
}

function suggestionsForGroups(groups) {
  return groups.map(group => {
    const out = [];
    group.forEach(key => {
      if (SYNONYMS[key]) out.push(...SYNONYMS[key].slice(0, 3));
      else out.push(key);
    });
    return [...new Set(out)].slice(0, 4);
  });
}

// ======================
// FRAGEN + MUSTERLÖSUNGEN (40)
// ======================
const questions = [
  {
    q: "Was setzt Dürrenmatt an den Anfang seines Gedankengangs?",
    page: 1,
    groups: [["hirn"], ["gedankenexperiment","modell","annahme"]],
    hint1: "Es geht um den gedanklichen Ausgangspunkt, nicht um Natur oder Kosmos.",
    solution: "Dürrenmatt setzt an den Anfang seines Gedankengangs ein Gedankenexperiment: Er denkt ein isoliertes Hirn, um zu zeigen, wie Denken, Angst und Weltvorstellung überhaupt erst entstehen."
  },
  {
    q: "Warum existiert das Hirn zunächst ohne Außenwelt?",
    page: 1,
    groups: [["hirn"], ["allein","isoliert","aussenwelt"]],
    hint1: "Beschreibe den Startzustand des Denkens.",
    solution: "Das Hirn existiert zunächst ohne Außenwelt, weil Dürrenmatt radikal vom inneren Denken ausgeht und alles Äußere bewusst ausblendet, um den Ursprung des Bewusstseins zu untersuchen."
  },
  {
    q: "Welches Grundgefühl prägt den Beginn des Denkens?",
    page: 1,
    groups: [["angst"]],
    hint1: "Nenne das vorherrschende Gefühl zu Beginn.",
    solution: "Den Beginn des Denkens prägt Angst, da das Hirn seine isolierte Existenz als bedrohlich und haltlos erlebt."
  },
  {
    q: "Warum ist das Alleinsein des Hirns problematisch?",
    page: 1,
    groups: [["hirn"], ["allein"], ["angst"]],
    hint1: "Verbinde Zustand und Gefühl.",
    solution: "Das Alleinsein des Hirns ist problematisch, weil es ohne Gegenüber keine Beziehung zur Welt aufbauen kann und dadurch in Angst und Orientierungslosigkeit gerät."
  },
  {
    q: "Wie entstehen die ersten Impulse im Hirn?",
    page: 2,
    groups: [["hirn"], ["impuls","bewegung"], ["innen"]],
    hint1: "Woher kommen die Impulse?",
    solution: "Die ersten Impulse entstehen im Hirn selbst, da es keine Außenreize gibt und jede Bewegung aus dem inneren Denken hervorgeht."
  },
  {
    q: "Warum empfindet das Hirn Angst vor dem Stillstand?",
    page: 2,
    groups: [["stillstand","leere"], ["angst"]],
    hint1: "Erkläre die Bedeutung des Stillstands.",
    solution: "Das Hirn empfindet Angst vor dem Stillstand, weil Stillstand Leere und Nichts bedeutet und damit den Verlust von Existenz und Sinn."
  },
  {
    q: "Wie entwickelt sich aus Impulsen das Zeitgefühl?",
    page: 2,
    groups: [["abfolge","rhythmus"], ["zeit"]],
    hint1: "Denke an Wiederholung.",
    solution: "Aus der Abfolge von Impulsen entsteht ein Zeitgefühl, weil Wiederholung und Rhythmus ein Vorher und Nachher ermöglichen."
  },
  {
    q: "Welche Funktion übernimmt das Gedächtnis?",
    page: 3,
    groups: [["gedachtnis"], ["ordnen","festhalten"]],
    hint1: "Was bewirkt Erinnerung?",
    solution: "Das Gedächtnis ordnet und bewahrt die Abfolge von Gedanken, sodass Kontinuität, Identität und zeitliches Erleben möglich werden."
  },
  {
    q: "Warum beginnt das Hirn zu zählen?",
    page: 3,
    groups: [["zahlen"], ["ordnung"], ["angst"]],
    hint1: "Zählen hat eine psychische Funktion.",
    solution: "Das Hirn beginnt zu zählen, um Ordnung herzustellen und die Angst vor Leere und Stillstand zu bändigen."
  },
  {
    q: "Was geschieht, wenn das Zählen endet?",
    page: 3,
    groups: [["angst"], ["ruckkehr"]],
    hint1: "Was kehrt zurück?",
    solution: "Wenn das Zählen endet, kehrt die Angst zurück, da die ordnende Struktur wegfällt."
  },

  {
    q: "Warum wird das bloße Zählen dem Hirn langweilig?",
    page: 4,
    groups: [["zahlen"], ["langweilig","monoton"]],
    hint1: "Begründe die Monotonie.",
    solution: "Das bloße Zählen wird dem Hirn langweilig, weil es monoton ist und keine neue Struktur oder Bedeutung erzeugt."
  },
  {
    q: "Wie entstehen aus Zahlen Rhythmen?",
    page: 4,
    groups: [["zahlen"], ["rhythmus"], ["wiederholung"]],
    hint1: "Zahlenmuster sind entscheidend.",
    solution: "Aus Zahlen entstehen Rhythmen, indem regelmäßige Wiederholungen und Muster gebildet werden."
  },
  {
    q: "Wie entwickelt sich daraus Musik?",
    page: 4,
    groups: [["rhythmus"], ["musik"]],
    hint1: "Steigerung der Ordnung.",
    solution: "Aus Rhythmus entwickelt sich Musik, weil geordnete Abfolgen als sinnvolle und ästhetische Struktur wahrgenommen werden."
  },
  {
    q: "Warum kann das Hirn Musik denken, ohne sie zu hören?",
    page: 5,
    groups: [["musik"], ["hirn"], ["vorstellen"]],
    hint1: "Innen statt Außen.",
    solution: "Das Hirn kann Musik denken, ohne sie zu hören, weil sie als innere Vorstellung und nicht als äußerer Reiz entsteht."
  },
  {
    q: "Welches Gefühl ersetzt zeitweise die Angst?",
    page: 5,
    groups: [["angst"], ["freude","beruhigung"]],
    hint1: "Ein positives Gefühl.",
    solution: "Zeitweise ersetzt Freude oder Beruhigung die Angst, da Ordnung und Musik dem Hirn Halt geben."
  },
  {
    q: "Warum kehrt die Angst immer wieder zurück?",
    page: 5,
    groups: [["angst"], ["grund"], ["gegenueber"]],
    hint1: "Was bleibt ungelöst?",
    solution: "Die Angst kehrt immer wieder zurück, weil das grundlegende Problem des Alleinseins und des fehlenden Gegenübers nicht gelöst ist."
  },
  {
    q: "Welche Rolle spielt Ordnung im Denken?",
    page: 6,
    groups: [["ordnung"], ["angst"]],
    hint1: "Ordnung wozu?",
    solution: "Ordnung spielt die Rolle eines Schutzes gegen Angst, indem sie Struktur und Vorhersagbarkeit schafft."
  },
  {
    q: "Warum entsteht Ohnmacht?",
    page: 6,
    groups: [["ohnmacht","machtlos"], ["grenze"], ["denken"]],
    hint1: "Denken stößt an Grenzen.",
    solution: "Ohnmacht entsteht, wenn das Denken an seine Grenzen stößt und keine umfassende Ordnung oder Antwort mehr findet."
  },
  {
    q: "Wie reagiert das Hirn emotional auf diese Ohnmacht?",
    page: 6,
    groups: [["ohnmacht"], ["angst"]],
    hint1: "Emotionale Reaktion.",
    solution: "Auf die Ohnmacht reagiert das Hirn mit Angst und Verzweiflung, da es keinen Ausweg erkennt."
  },
  {
    q: "Warum sucht das Hirn ein Gegenüber?",
    page: 7,
    groups: [["gegenueber"], ["beziehung"]],
    hint1: "Beziehung ist zentral.",
    solution: "Das Hirn sucht ein Gegenüber, weil Sinn, Identität und Stabilität erst in Beziehung zu einem Anderen entstehen."
  },

  {
    q: "Wie entdeckt das Hirn das Ich?",
    page: 7,
    groups: [["ich"], ["gegenueber"]],
    hint1: "Ich entsteht nicht isoliert.",
    solution: "Das Hirn entdeckt das Ich durch die Abgrenzung vom Gegenüber, wodurch Selbstbewusstsein entsteht."
  },
  {
    q: "Warum wird das Hirn nach der Ich-Entdeckung ‚ganz Gefühl‘?",
    page: 7,
    groups: [["ich"], ["gefuhl"]],
    hint1: "Emotionale Intensivierung.",
    solution: "Nach der Entdeckung des Ichs wird das Hirn ganz Gefühl, weil Existenz nun als persönliche Betroffenheit erlebt wird."
  },
  {
    q: "Welche Rolle spielt die Mathematik im Denken des Hirns?",
    page: 8,
    groups: [["mathematik","zahlen"], ["ordnung"]],
    hint1: "Mathematik ordnet.",
    solution: "Die Mathematik spielt die Rolle einer radikalen Ordnung, mit der das Hirn versucht, die Welt rational zu strukturieren."
  },
  {
    q: "Warum reicht Mathematik allein nicht aus?",
    page: 8,
    groups: [["mathematik"], ["sinn"]],
    hint1: "Ordnung ohne Sinn.",
    solution: "Mathematik allein reicht nicht aus, weil sie zwar ordnet, aber keine Antwort auf Sinn, Angst und Existenz gibt."
  },
  {
    q: "Was versucht das Hirn stattdessen zu denken?",
    page: 9,
    groups: [["welt","materie"], ["gegenueber"]],
    hint1: "Übergang zur Welt.",
    solution: "Das Hirn versucht stattdessen, eine äußere Welt und Materie zu denken, um ein echtes Gegenüber zu gewinnen."
  },
  {
    q: "Wie denkt das Hirn Materie?",
    page: 9,
    groups: [["materie"], ["raum"]],
    hint1: "Materie ist räumlich.",
    solution: "Das Hirn denkt Materie als etwas Räumliches und Wirkliches, das außerhalb des reinen Denkens existiert."
  },
  {
    q: "Warum bleibt auch Materie unbefriedigend?",
    page: 10,
    groups: [["materie"], ["angst"]],
    hint1: "Materie löst nicht alles.",
    solution: "Auch Materie bleibt unbefriedigend, weil sie die grundlegende Angst und Sinnfrage nicht auflöst."
  },
  {
    q: "Welche Bedeutung hat der Raum außerhalb des Hirns?",
    page: 10,
    groups: [["raum"], ["gegenueber"]],
    hint1: "Raum ermöglicht Beziehung.",
    solution: "Der Raum außerhalb des Hirns ermöglicht die Vorstellung eines echten Gegenübers und einer unabhängigen Welt."
  },
  {
    q: "Was sucht das Hirn letztlich wirklich?",
    page: 11,
    groups: [["sinn"], ["gegenueber"]],
    hint1: "Nicht nur Ordnung.",
    solution: "Das Hirn sucht letztlich Sinn und Beziehung zu einem Gegenüber, nicht bloß Ordnung oder Materie."
  },
  {
    q: "Warum ist Denken auf ein Gegenüber angewiesen?",
    page: 11,
    groups: [["gegenueber"], ["ich"]],
    hint1: "Ich braucht Beziehung.",
    solution: "Denken ist auf ein Gegenüber angewiesen, weil das Ich und Sinn erst im Verhältnis zu einem Anderen entstehen."
  },

  {
    q: "Wie gelangt das Hirn zur Vorstellung der Urzelle?",
    page: 12,
    groups: [["urzelle","zelle"], ["leben"]],
    hint1: "Ursprung des Lebens.",
    solution: "Das Hirn gelangt zur Vorstellung der Urzelle, indem es den Ursprung des Lebens biologisch denkt."
  },
  {
    q: "Warum wird der Tod Teil des Lebensdenkens?",
    page: 12,
    groups: [["tod"], ["leben"]],
    hint1: "Vergänglichkeit.",
    solution: "Der Tod wird Teil des Lebensdenkens, weil Leben untrennbar mit Vergänglichkeit verbunden ist."
  },
  {
    q: "Was bedeutet Evolution für das Hirn?",
    page: 13,
    groups: [["evolution"], ["anpassung","auswahl"]],
    hint1: "Entwicklung durch Auswahl.",
    solution: "Evolution bedeutet für das Hirn eine Entwicklung durch Anpassung und Auswahl im Kampf ums Überleben."
  },
  {
    q: "Warum gehört der Mord zum Denken des Lebens?",
    page: 13,
    groups: [["mord","gewalt"], ["uberleben"]],
    hint1: "Dürrenmatt ist radikal.",
    solution: "Der Mord gehört zum Denken des Lebens, weil der Kampf ums Überleben Gewalt einschließen kann."
  },
  {
    q: "Wie entsteht menschliches Ich-Bewusstsein?",
    page: 14,
    groups: [["ich"], ["sprache","mensch"], ["gegenueber"]],
    hint1: "Sozialer Ursprung.",
    solution: "Menschliches Ich-Bewusstsein entsteht sozial, sprachlich und im Verhältnis zu anderen Menschen."
  },
  {
    q: "Warum ist die Erkenntnis der eigenen Sterblichkeit zentral?",
    page: 14,
    groups: [["tod"], ["sinn"]],
    hint1: "Existenzielle Bedeutung.",
    solution: "Die Erkenntnis der eigenen Sterblichkeit ist zentral, weil sie Sinnfragen, Angst und Verantwortung hervorruft."
  },
  {
    q: "Welche Rolle spielen Religionen im Denken des Hirns?",
    page: 15,
    groups: [["religion"], ["sinn"], ["antwort"]],
    hint1: "Antwortversuche.",
    solution: "Religionen erscheinen als Versuche, Sinn und Antworten auf Tod und Angst zu geben."
  },
  {
    q: "Warum wiederholt sich Geschichte?",
    page: 16,
    groups: [["geschichte"], ["macht","gewalt"]],
    hint1: "Strukturen kehren zurück.",
    solution: "Geschichte wiederholt sich, weil Macht, Angst und Gewalt strukturell immer wieder auftreten."
  },
  {
    q: "Wie beschreibt Dürrenmatt den historischen Bruch?",
    page: 17,
    groups: [["bruch"], ["grenze"]],
    hint1: "Grenze des Vorstellbaren.",
    solution: "Dürrenmatt beschreibt den historischen Bruch als eine Grenze des Vorstellbaren und bisherigen Denkens."
  },
  {
    q: "Warum bezeichnet Dürrenmatt Auschwitz als undenkbar?",
    page: 18,
    groups: [["auschwitz"], ["grenze"]],
    hint1: "Zivilisationsbruch.",
    solution: "Dürrenmatt bezeichnet Auschwitz als undenkbar, weil es einen radikalen Zivilisationsbruch darstellt, der sich rationalem Denken entzieht."
  }
];

// ======================
// UI-LOGIK (3-Stufen-Feedback)
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

  function check() {
    const raw = input.value;
    const tok = tokens(raw);
    answers[i] = raw;

    if (tok.length < 2) {
      attempts[i]++;
      feedback.textContent = "✗ zu kurz";
      hintDiv.textContent =
        attempts[i] >= 3
          ? "Musterlösung: " + item.solution
          : attempts[i] === 2
          ? "Hinweis: Versuche zentrale Begriffe aus dem Text zu verwenden."
          : "Hinweis: Formuliere vollständiger.";
      return;
    }

    const hitCount = countGroupHits(tok, item.groups);

    if (hitCount >= 2 || (item.groups.length === 1 && hitCount === 1)) {
      feedback.textContent = "✓ richtig";
      hintDiv.textContent = "";
      return;
    }

    attempts[i]++;
    feedback.textContent = "✗ noch nicht richtig";

    if (attempts[i] >= 3) {
      hintDiv.textContent = "Musterlösung: " + item.solution;
    } else if (attempts[i] === 2) {
      const sug = suggestionsForGroups(item.groups)
        .map(arr => arr.join(" / "))
        .join("   ");
      hintDiv.textContent = "Lösungsvorschläge: " + sug;
    } else {
      hintDiv.textContent = item.hint1;
    }
  }

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
