// Examen (mondeling, HVL Bergen A1): oefenlijsten samengesteld uit BESTAANDE lijsten.
// Laden na opdrachten-e.js en vóór indeling.js. Items worden bij het laden opgezocht
// op lijst-id + exacte vraagtekst; ontbreekt een bron of item, dan wordt het overgeslagen.
(function () {
  var L = window.LIJSTEN = window.LIJSTEN || [];
  var perId = {};
  L.forEach(function (l) { perId[l.id] = l; });

  // [id, titel, taal, instructie, vast, [[bron-id, [vragen] | "*"] | [null, [[vraag, antwoord]...], bronnaam], ...]]
  var EXAMEN = [
    ["ex-1-meg-selv", "1. Presentasjon: meg selv (navn, land, språk, studier, bo)", "Engels", "", false, [
      ["beb-fraser", ["Hei, mitt navn er ..."]],
      ["beb-1-gram", ["å hete", "heter", "å komme", "kommer", "å bo", "bor", "å snakke", "snakker", "å være", "er"]],
      ["beb-1-tekst1", ["fra"]],
      ["beb-1-kurs1", ["et morsmål (—; -ene)", "morsmålet mitt", "et universitet (-er; -ene)", "Universitetet i Bergen"]],
      ["beb-1-kurs2", ["en student (-er; -ene)", "å studere (-r; -te; har -t)", "et språk (—; -ene)", "hvilke språk", "flytende (—; —)", "litt", "å like (-r; -te; har -t)"]],
      ["beb-1-kurs3", ["å forstå (-r; forsto; har forstått)", "ikke så mye", "å lære (-r; -te; har -t)", "å ha lyst til"]],
      ["doc-2209-hverdagen-uttrykk", ["jeg er på utveksling", "en utvekslingsstudent"]],
      ["lnboek-3a", ["å jobbe"]]
    ]],
    ["ex-2-sporsmal", "2. Spørsmål du kan stille", "Engels", "", false, [
      ["beb-1-gram", ["hva", "hvor", "hvor gammel", "hvor ofte", "hvor mange", "hvem", "hvordan", "hvorfor", "hvilken (m) / hvilket (n) / hvilke (pl)", "når"]],
      ["beb-fraser", ["Hvordan går det?", "Går det bra?", "Har du det bra?", "Hvordan går det med deg?", "Hvordan har du det?"]],
      ["beb-1-kurs2", ["Hva med dere?"]],
      ["doc-d-2-fritid", ["Har du noen hobbyer?"]],
      ["doc-d-3-familie-yrker", ["Hva jobber din mor med?"]],
      ["doc-d-2-vaer", ["Hva slags vær er det?"]],
      ["doc-e-5-ord", ["Savner dere familie og venner?"]],
      ["doc-e-7-fraser", ["Hva ønsker du deg?"]]
    ]],
    ["ex-3-familie", "3. Familie", "Engels", "", false, [
      ["doc-1013-familieord", ["en familie", "en mor", "en far", "en forelder", "en bror", "en søster", "et søsken", "en sønn", "en datter", "et barn", "en mann", "en kone", "en kjæreste", "en samboer", "en onkel", "en tante", "en fetter", "en kusine", "et søskenbarn", "en venn", "en gutt", "en jente"]],
      ["doc-d-3-familie-yrker", ["foreldre", "tvillinger", "et enebarn", "en bestemor", "en bestefar", "en mormor", "en morfar", "en farmor", "en farfar", "eldste", "yngste"]]
    ]],
    ["ex-4-bolig", "4. Bolig og rom", "Engels", "", false, [
      ["doc-e-5-bolig", "*"],
      ["doc-sub-fantoft-1", ["en studentbolig", "en hybel", "i nærheten"]],
      ["doc-sub-fantoft-2", ["en leilighet"]],
      ["doc-e-5-rom", "*"],
      ["doc-e-5-mobler", ["en seng", "et spisebord", "en lenestol", "et skap", "et kjøleskap", "en dusj"]]
    ]],
    ["ex-5-vaer", "5a. Livet i Norge: været og årstidene", "Engels", "", false, [
      ["doc-d-2-vaer", "*"],
      ["doc-e-rep-5-vaer", ["Det er sol. / Solen skinner.", "Det er delvis skyet.", "Det lyner og tordner.", "oppholdsvær", "yr", "kjølig"]]
    ]],
    ["ex-5-bergen", "5b. Livet i Norge: Bergen, transport og mat", "Engels", "", false, [
      ["bergen-01", ["en by", "et sentrum", "en fjord", "et fjell", "en utsikt", "et fiskemarked", "en båt", "en severdighet", "vakker"]],
      ["bergen-06", ["en bybane", "en buss", "en holdeplass", "en billett", "en sykkel", "å sykle", "å kjøre"]],
      ["bergen-05", ["en fiskesuppe", "en skillingsbolle", "en brunost", "en vaffel", "en matpakke", "en middag", "å lage mat"]],
      ["doc-2209-mat-ord", ["ei brødskive", "kveldsmat"]]
    ]],
    ["ex-6-fritid", "6. Fritid og hobbyer", "Engels", "", false, [
      ["doc-d-2-fritid", ["Jeg pleier å …", "Jeg synes å reise er gøy.", "Jeg har lyst til å …", "fritiden"]],
      ["doc-e-rep-4-fritid", ["å sykle", "å stå på ski", "å jogge", "å løpe", "å reise", "å høre på musikk", "å gå på kafé", "å lese bøker", "å fotografere / å ta bilder", "å gå på tur (på fjellet)", "å gå på konsert", "å danse", "å gå på kino", "å se på tv", "å spille dataspill", "å lage mat", "å slappe av", "å være med venner", "å synge i kor", "å trene / å gå på treningssenter"]],
      ["doc-2209-fritid", ["i fritiden", "i helgene", "i ferien", "ofte", "av og til", "nesten aldri"]]
    ]],
    ["ex-7-dag", "7a. En vanlig dag: fra morgen til kveld", "Engels", "", false, [
      ["doc-1209-dag-ord", ["å pleie å", "å stå opp", "å dusje", "å pusse tennene", "jeg legger meg", "hjemmefra", "en forelesning", "et bibliotek", "å møte", "noen venner", "en middag", "å se på nyheter", "først", "så", "etterpå", "til slutt"]],
      ["doc-2209-fra-morgen", ["å våkne", "å kle på seg", "å skynde seg", "å gjøre lekser", "å handle mat", "å vaske opp", "å slappe av", "å kose seg", "å legge seg", "å sovne"]],
      ["doc-a-ukedager", ["en frokost", "en lunsj", "en kvelds"]]
    ]],
    ["ex-7-tid", "7b. En vanlig dag: tidsuttrykk og hvor ofte", "Engels", "", false, [
      ["doc-1209-tidsuttrykk", ["i morges", "i dag", "i formiddag", "i ettermiddag", "i kveld", "i natt", "om morgenen", "om dagen", "om formiddagen", "om ettermiddagen", "om kvelden", "om natten", "i går", "i helgen", "i helgene"]],
      ["doc-a-ukedager", ["en hverdag", "en helg / ei helg"]],
      ["doc-e-rep-4-om-frekvens", ["alltid", "vanligvis", "ofte", "noen ganger", "av og til", "sjelden", "aldri", "deretter", "før", "etter"]]
    ]],
    ["ex-7-klokka", "7c. En vanlig dag: hva er klokka?", "Noors", "What time is it? Write it in Norwegian", true, [
      ["doc-e-rep-4-klokken", ["13:00", "13:05", "13:10", "13:15", "13:20", "13:25", "13:30", "13:35", "13:40", "13:45", "13:50", "13:55"]],
      ["doc-1209-klokka", ["06:50", "07:10", "07:15", "07:40", "08:10", "11:30", "16:50", "17:30", "19:30", "22:30"]]
    ]],
    ["ex-8-pret-verb", "8a. Preteritum: de vanligste verbene", "Noors", "Put into the preteritum (past tense)", true, [
      ["doc-2209-uregelrette", "*"],
      ["doc-2209-regelrette", ["å spise", "å lese", "å spille", "å lage", "å studere", "å like", "å jobbe", "å snakke", "å ha", "å bo", "å lære"]],
      ["doc-pret-7a1", ["å kjøpe", "å treffe", "å finne"]]
    ]],
    ["ex-8-pret-igaar", "8b. Preteritum: hva gjorde du i går?", "Noors", "Put the verb in brackets into the preteritum", true, [
      ["doc-hva-gjorde-du", "*"],
      ["doc-d-3-preteritum", "*"]
    ]],
    ["ex-9-futurum", "9. Futurum og planer (skal, har lyst til, i morgen …)", "Engels", "", false, [
      ["lnboek-3a", ["skal (å skulle)"]],
      ["doc-e-7-fraser", ["Skal du feire?", "Skal du ha fest?"]],
      ["doc-d-3-butikk", ["Det skal jeg."]],
      ["doc-d-2-fritid", ["Jeg har lyst til å …"]],
      ["doc-2209-fra-morgen", ["å glede seg", "snart"]],
      ["doc-e-rep-4-tidsuttrykk", ["i morgen", "i morgen tidlig", "i morgen formiddag", "i morgen ettermiddag", "i morgen kveld", "neste år"]],
      ["doc-1209-tidsuttrykk", ["neste uke"]],
      ["doc-d-3-tidsuttrykk", ["i helgen", "i ferien"]]
    ]],
    ["ex-10-fraser", "10. Nyttige fraser i en samtale", "Engels", "", false, [
      ["beb-fraser", ["God morgen!", "God dag!", "Ha en god dag!", "Tusen takk!", "Du også!", "Takk, i like måte!", "Takk for sist!", "Lenge siden sist!", "Takk, det går bra!", "Sånn passe!", "Ikke så verst!", "Jeg har det bra!", "Bare bra, takk!", "Så hyggelig! / Så koselig!"]],
      ["beb-1-oppg", ["Hyggelig å hilse på deg!", "I like måte!", "Så kult!"]],
      ["beb-1-kurs2", ["Så spennende!"]],
      ["beb-1-kurs3", ["Jeg også!", "Så gøy!", "forresten"]],
      ["lnboek-2b", ["unnskyld", "vær så god!"]],
      ["lnboek-5d", ["sakte"]],
      ["doc-e-7-fraser", ["Det var hyggelig å prate med deg.", "Så fint å se deg."]],
      ["lnboek-2c", ["ha det bra!", "ha det!"]],
      // staan niet in een bestaande lijst: letterlijk uit het boek (vertaling uit het boek)
      [null, [["Unnskyld, kan du gjenta det?", "Sorry, can you repeat that?"], ["Hva sa du?", "What did you say?"], ["Hvordan staver du det?", "How do you spell that?"]], "Byen er Bergen kap. 1, oppgave 4 (Intervju: Nyttige fraser)"]
    ]]
  ];

  EXAMEN.forEach(function (e) {
    var woorden = [], gezien = {}, bronnen = [];
    e[5].forEach(function (b) {
      var src = b[0] === null ? { titel: b[2], woorden: b[1] } : perId[b[0]];
      if (!src) return; // bron ontbreekt: overslaan
      var n = 0;
      src.woorden.forEach(function (w) {
        if ((b[1] === "*" || b[0] === null || b[1].indexOf(w[0]) >= 0) && !gezien[w[0]] && w[0] && w[1]) {
          gezien[w[0]] = true; woorden.push([w[0], w[1]]); n++;
        }
      });
      if (n) bronnen.push(src.titel);
    });
    if (woorden.length < 5) return; // ponytail: te weinig over (bronnen weg) → lijst niet tonen
    var l = { id: e[0], groep: "Exam (oral)", titel: e[1], bron: "Compiled from: " + bronnen.join("; "), taal: e[2], woorden: woorden };
    if (e[3]) l.instructie = e[3];
    if (e[4]) l.vast = true;
    L.push(l);
  });
})();
