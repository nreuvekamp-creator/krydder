// Indeling per hoofdstuk van "Byen er Bergen". Wordt als laatste geladen (na lijsten.js en opdrachten-*.js).
// Aanpassen: zet een lijst-id onder een ander hoofdstuk in de tabel hieronder. Learn NoW en Grammatica gaan automatisch.
(function () {
  var HOOFDSTUKKEN = [
    "Kap. 1 – Endelig i Bergen!",
    "Kap. 2 – Sulten og tørst!",
    "Kap. 3 – Kom inn!",
    "Kap. 4 – Hverdag og fritid",
    "Kap. 5 – Det finnes ikke dårlig vær, bare dårlige klær",
    "Kap. 6 – Ut på tur, aldri sur",
    "Kap. 7 – Fest og høytider",
    "Litt om Bergen / Vanlige fraser",
    "Other teacher material",
    "Learn NoW (textbook)",
    "Grammar (AI lists)"
  ];
  var BERGEN = 8, OVERIG = 9;

  // id → hoofdstuk (1..7, 8 = Litt om Bergen / Vanlige fraser, 9 = Overig van de docent)
  var TABEL = {
    // Kap. 1: spørreord, pronomen, presens, ordstilling, land/språk/nasjonalitet
    "beb-1-tekst1": 1, "beb-1-kurs1": 1, "beb-1-kurs2": 1, "beb-1-kurs3": 1, "beb-1-oppg": 1,
    "beb-1-land": 1, "beb-1-nasj": 1, "beb-1-retn": 1, "beb-1-gram": 1,
    "doc-a-land-sprak": 1, "doc-a-land-person": 1, "doc-a-sporreord-inn": 1, "doc-a-sporreord-ord": 1,
    "doc-a-verb-betydning": 1, "doc-a-verb-presens": 1, "doc-a-imperativ": 1, "doc-a-gram-pronomen": 1,
    "doc-a-nyibyen": 1, "doc-a-ordstilling": 1, "doc-a-now-1": 1, "doc-a-now-2": 1,
    "doc-2209-presens": 1, "doc-0924-verb-presens": 1,
    "doc-2209-ordstilling": 1, "doc-0924-ordstilling": 1,
    "doc-fasit-pronomen": 1, "doc-fasit-verb-sporreord": 1, "doc-fasit-setninger": 1,

    // Kap. 2: tall, en/ei/et, flertall, bestemt form, mat og drikke, kafé
    "bergen-05": 2, "bergen-07": 2, "beb-2-tall": 2,
    "doc-a-flertall": 2, "doc-a-tall": 2, "doc-a-genus": 2, "doc-1209-diktat": 2,
    "doc-2209-mat-ord": 2, "doc-0924-farikal": 2, "doc-0924-mat-kjonn": 2, "doc-0924-kafe": 2,
    "doc-sub-fantoft-1": 2, "doc-sub-fantoft-2": 2, "doc-sub-kjonn": 2, "doc-sub-best": 2,
    "doc-sub-fl": 2, "doc-sub-bfl": 2, "doc-sub-thomas-best": 2, "doc-sub-thomas-presens": 2,
    "doc-fasit-flertall": 2,

    // Kap. 3: possessiver (sin/si/sitt, hennes), bolig
    "bergen-03": 3,
    "doc-2209-nathalie-3p": 3,

    // Kap. 4: refleksiv, klokka, ukedager, tidsuttrykk, hverdag, fritid
    "bergen-04": 4, "beb-4-dager": 4, "beb-4-tid": 4,
    "doc-a-ukedager": 4, "doc-a-klokka": 4, "doc-1209-klokka": 4, "doc-1209-dag-ord": 4,
    "doc-1209-tidsuttrykk": 4, "doc-2209-ukedager": 4, "doc-2209-anna": 4, "doc-2209-hverdagen-uttrykk": 4,
    "doc-2209-fra-morgen": 4, "doc-2209-fritid": 4, "doc-loop-klokke": 4, "doc-0924-pronomen": 4,

    // Kap. 5: vær, klær
    "bergen-02": 5,

    // Kap. 6: preteritum, onregelmatige werkwoorden, stedsadverb, reise, helg
    "bergen-06": 6,
    "doc-a-irr-pret-1": 6, "doc-a-irr-pret-2": 6, "doc-a-irr-perf-1": 6, "doc-a-irr-perf-2": 6,
    "doc-2209-regelrette": 6, "doc-2209-uregelrette": 6, "doc-hva-gjorde-du": 6,
    "doc-pret-7a1": 6, "doc-pret-invul": 6, "doc-pret-i-gaar": 6,
    "doc-0924-verb-regel": 6, "doc-0924-verb-uregel": 6, "doc-0924-alex": 6, "doc-0924-igar": 6,
    "doc-0924-stadion": 6, "doc-0929-oppg12-13": 6, "doc-0929-oppg14": 6, "doc-0929-oppg15": 6,

    // Kap. 7: (nog geen lijsten)

    // Litt om Bergen / Vanlige fraser
    "bergen-01": BERGEN, "beb-fraser": BERGEN,

    // Overig van de docent: familie en beroepen (13.10)
    "doc-1013-familieord": OVERIG, "doc-1013-familie-fl": OVERIG, "doc-1013-familie-bfl": OVERIG,
    "doc-1013-katt-mus": OVERIG, "doc-1013-anne": OVERIG, "doc-1013-setninger": OVERIG, "doc-1013-yrker": OVERIG
  };

  var L = window.LIJSTEN;
  if (!Array.isArray(L)) return;

  // Datum uit de titel als dag van het jaar: "Uke 35", "12.09"; z.d. achteraan.
  // ponytail: rekent weken als 2026 (week 1 begint 29 dec); bij een nieuw schooljaar alleen nodig als de volgorde wringt.
  var DAGEN = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  function datum(t) {
    var m = /^Uke (\d+)/.exec(t);
    if (m) return (m[1] - 1) * 7 - 3;
    m = /^(\d\d)\.(\d\d)/.exec(t);
    if (m) return DAGEN[m[2] - 1] + (m[1] - 1);
    return Infinity;
  }
  // binnen een hoofdstuk: 0 = boek, 1 = docent, 2 = voorlopig
  function soort(l) { return /\(provisional\)/.test(l.titel) ? 2 : l.groep === "Teacher materials" ? 1 : 0; }

  var EXAMEN = "Exam (oral)"; // examen.js: groep blijft staan en komt als allereerste
  var info = L.map(function (l, i) {
    if (l.groep === EXAMEN) return { l: l, h: 0, s: 0, d: 0, i: i };
    var h = TABEL[l.id];
    // niet in de tabel: het veld `hoofdstuk` van de lijst zelf (1–7 of "overig", opdrachten-d/e/f.js);
    // opdrachten-f.js ("Byen er Bergen – exercises") telt als boek en komt door de laadvolgorde na de Ordliste-lijsten
    if (!h && l.hoofdstuk) h = l.hoofdstuk === "overig" ? OVERIG : (l.hoofdstuk >= 1 && l.hoofdstuk <= 7 ? +l.hoofdstuk : 0);
    if (!h) {
      if (l.groep === "Learn NoW (textbook)") h = 10;
      else if (l.groep === "Grammar") h = 11;
      else { h = OVERIG; console.warn("indeling.js: lijst zonder hoofdstuk, staat bij Overig:", l.id, l.titel); }
    }
    var r = { l: l, h: h, s: soort(l), d: soort(l) === 1 ? datum(l.titel) : 0, i: i };
    l.groep = HOOFDSTUKKEN[h - 1];
    return r;
  });
  info.sort(function (a, b) { return a.h - b.h || a.s - b.s || (a.d === b.d ? 0 : a.d < b.d ? -1 : 1) || a.i - b.i; });
  window.LIJSTEN = info.map(function (x) { return x.l; });
})();
