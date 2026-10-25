/* KlaarWijs — centrale contentdata.
   Eén bron voor thema's, onderwerpen, situaties en levensfasen.
   Een onderwerp heeft overal hetzelfde ID; thema's, situaties en
   levensfasen verwijzen er alleen naar. Zo bestaat elke tekst maar één keer.

   image: null = nog geen beeld; er verschijnt een zwart vlak op die plek.
           Voeg later een pad toe (image) met een beschrijving (imageAlt).

   status: "demo" = er is een oefenversie te bekijken
           "dev"  = onderwerp staat op de planning, les nog in ontwikkeling

   Bronnen per les (optioneel, per onderwerp). Vul alleen in wat echt is gebeurd:
     sources: [{
       source: "duo",                       // id uit de lijst 'sources' hieronder
       url: "https://duo.nl/...",           // directe link naar de gebruikte pagina
       checkedOn: null,                     // "2026-11-03" pas na een echte controle
       conditions: "",                      // belangrijke voorwaarden, als die er zijn
       review: "niet-gecontroleerd"         // of "gecontroleerd" / "opnieuw-controleren"
     }] */
window.KW_CONTENT = (function () {
  "use strict";

  var topics = {
    /* Geld & betalen */
    "bankrekening": { title: "Een bankrekening", keywords: ["bank", "rekening", "betaalrekening", "pinpas", "bankpas"] },
    "betalen": { title: "Betalen", keywords: ["pinnen", "tikkie", "ideal", "contant", "betaalverzoek"] },
    "sparen": { title: "Sparen", keywords: ["spaarrekening", "spaargeld", "buffer"] },
    "budgetteren": { title: "Budgetteren", keywords: ["budget", "begroting", "huishoudboekje", "overzicht"] },
    "bruto-netto": { title: "Bruto en netto", keywords: ["bruto", "netto", "loon", "inhouding"] },
    "belastingen": { title: "Belastingen", keywords: ["belasting", "aangifte", "belastingaangifte", "belastingdienst", "loonheffing"] },
    "toeslagen": { title: "Toeslagen", keywords: ["toeslag", "huurtoeslag", "dienst toeslagen"] },
    "vaste-variabele-uitgaven": { title: "Vaste en variabele uitgaven", keywords: ["uitgaven", "kosten", "abonnementen"] },
    "financiele-verantwoordelijkheid": { title: "Financiële verantwoordelijkheid", keywords: ["schulden", "lenen", "achterstand", "betalingsachterstand", "geldzaken"] },
    "telefoonabonnement": { title: "Een telefoonabonnement kiezen", keywords: ["telefoon", "abonnement", "sim-only", "prepaid", "databundel", "mobiel"] },

    /* Werk & inkomen */
    "eerste-bijbaan": { title: "Je eerste bijbaan", keywords: ["bijbaan", "baantje", "werken", "vakantiewerk"] },
    "solliciteren": { title: "Solliciteren", keywords: ["sollicitatie", "cv", "motivatiebrief", "vacature", "sollicitatiegesprek"] },
    "arbeidscontract": {
      title: "Een arbeidscontract",
      keywords: ["contract", "arbeidsovereenkomst", "proeftijd", "opzegtermijn", "nulurencontract"],
      summary: "In een arbeidscontract staan afspraken over loon, uren, proeftijd en opzegtermijn."
    },
    "loonstrook": {
      title: "Je loonstrook lezen",
      status: "demo",
      keywords: ["loonstrook", "salarisstrook", "loonspecificatie", "salarisspecificatie", "bruto", "netto", "loonheffing"],
      summary: "Op een loonstrook zie je wat je bruto verdient en wat je netto krijgt. Oefen het verschil tussen die twee bedragen."
    },
    "minimumjeugdloon": { title: "Minimumjeugdloon", keywords: ["minimumloon", "jeugdloon", "uurloon"] },
    "vakantiegeld": { title: "Vakantiegeld", keywords: ["vakantietoeslag", "vakantiedagen"] },
    "arbeidsvoorwaarden": { title: "Arbeidsvoorwaarden", keywords: ["cao", "vakantiedagen", "reiskosten", "werktijden"] },
    "salaris": { title: "Salaris", keywords: ["loon", "inkomen", "verdienen", "salarisonderhandeling"] },
    "pensioen": { title: "Pensioen", keywords: ["pensioenpremie", "aow", "pensioenfonds", "oudedag"] },
    "vragen-werkgever": {
      title: "Vragen die je je werkgever kunt stellen",
      keywords: ["werkgever", "vragen", "uren", "vakantiedagen"],
      summary: "Je mag een werkgever vragen stellen over uren, loon en vakantiedagen."
    },

    /* Studie & toekomst */
    "onderwijsroutes": { title: "Onderwijsroutes", keywords: ["mbo", "hbo", "wo", "universiteit", "havo", "vwo", "vmbo", "opleiding"] },
    "studiekeuze": { title: "Studiekeuze", keywords: ["studie kiezen", "open dag", "meeloopdag", "richting"] },
    "aanmelden-opleiding": { title: "Aanmelden voor een opleiding", keywords: ["aanmelden", "inschrijven", "studielink"] },
    "studiekosten": { title: "Studiekosten", keywords: ["collegegeld", "lesgeld", "boeken", "kosten"] },
    "duo": { title: "DUO", keywords: ["dienst uitvoering onderwijs", "mijn duo", "studieschuld"] },
    "studiefinanciering": { title: "Studiefinanciering", keywords: ["stufi", "basisbeurs", "aanvullende beurs", "lening", "studielening"] },
    "studentenreisproduct": { title: "Studentenreisproduct", keywords: ["ov", "studenten-ov", "ov-chipkaart", "reisproduct"] },
    "stage": { title: "Stage", keywords: ["stagevergoeding", "bpv", "afstuderen"] },
    "stoppen-overstappen": { title: "Stoppen of overstappen", keywords: ["stoppen", "overstappen", "switchen", "uitschrijven"] },
    "student-naar-werkende": { title: "Van student naar werkende", keywords: ["afstuderen", "eerste baan", "terugbetalen", "studieschuld"] },

    /* Wonen & regelen */
    "op-kamers": { title: "Op kamers gaan", keywords: ["kamer", "kamer zoeken", "studentenkamer", "uit huis"] },
    "huurcontract": { title: "Een huurcontract", keywords: ["huur", "huurovereenkomst", "verhuurder", "contract"] },
    "huurprijzen": { title: "Huurprijzen", keywords: ["huur", "kale huur", "huurverhoging"] },
    "borg": { title: "Borg", keywords: ["waarborgsom", "borgsom"] },
    "servicekosten": { title: "Servicekosten", keywords: ["bijkomende kosten", "gwe"] },
    "verhuizen": { title: "Verhuizen", keywords: ["verhuis", "adres wijzigen", "adreswijziging"] },
    "inschrijven-gemeente": { title: "Inschrijven bij de gemeente", keywords: ["brp", "inschrijving", "adres", "gemeente"] },
    "energie-internet": { title: "Energie en internet", keywords: ["energiecontract", "stroom", "gas", "wifi", "internetabonnement"] },
    "vaste-lasten": { title: "Vaste lasten", keywords: ["maandlasten", "huur", "verzekeringen", "abonnementen"] },
    "huurrechten": { title: "Je rechten als huurder", keywords: ["huurcommissie", "rechten", "plichten", "huurder"] },

    /* Zorg & gezondheid */
    "huisarts": { title: "De huisarts", keywords: ["dokter", "huisartsenpraktijk", "inschrijven huisarts"] },
    "zorgafspraken": { title: "Zorgafspraken maken", keywords: ["afspraak", "tandarts", "doorverwijzing", "verwijsbrief"] },
    "zorgverzekering": { title: "Zorgverzekering", keywords: ["basisverzekering", "aanvullende verzekering", "zorgverzekeraar", "verzekering"] },
    "zorgpremie": { title: "Zorgpremie", keywords: ["premie", "maandpremie"] },
    "eigen-risico": { title: "Eigen risico", keywords: ["risico", "zorgkosten"] },
    "vergoedingen": { title: "Vergoedingen", keywords: ["vergoed", "declareren", "declaratie"] },
    "medische-rechten": { title: "Medische rechten", keywords: ["toestemming", "medisch dossier", "geheimhouding", "rechten"] },
    "zorgtoeslag": { title: "Zorgtoeslag", keywords: ["toeslag", "zorg", "dienst toeslagen"] },
    "gezondheid-regelen": { title: "Zelf je gezondheid regelen", keywords: ["gezondheid", "medicijnen", "apotheek"] },

    /* Overheid & digitaal */
    "digid": { title: "DigiD", keywords: ["inloggen", "digid app", "overheid", "aanvragen"] },
    "identiteitsbewijs": { title: "Identiteitsbewijs", keywords: ["id-kaart", "identiteitskaart", "paspoort", "legitimatie"] },
    "bsn": { title: "Je BSN", keywords: ["burgerservicenummer", "sofinummer"] },
    "officiele-websites": { title: "Officiële websites herkennen", keywords: ["website", "nep", "echt", "overheid.nl"] },
    "digitale-post": { title: "Digitale post", keywords: ["berichtenbox", "mijnoverheid", "brieven", "post"] },
    "privacy": { title: "Privacy", keywords: ["gegevens", "persoonsgegevens", "delen", "avg"] },
    "online-veiligheid": { title: "Online veiligheid", keywords: ["wachtwoord", "veilig online", "tweestapsverificatie", "account"] },
    "oplichting": { title: "Oplichting herkennen", keywords: ["phishing", "nepbericht", "scam", "fraude", "oplichters", "whatsappfraude"] },
    "overheid-online": { title: "Zaken online regelen met de overheid", keywords: ["mijnoverheid", "gemeente", "online regelen", "overheid"] }
  };

  var themes = [
    {
      id: "geld-betalen",
      title: "Geld & betalen",
      lead: "Van je eerste bankrekening tot je eigen budget. Ontdek hoe betalen, sparen en belasting werken.",
      intro: "Geld komt overal terug: in je zakgeld, je eerste salaris en je vaste lasten. In dit thema ontdek je hoe je overzicht houdt en bewuste keuzes maakt.",
      image: "assets/themas/zorg-gezondheid.webp",
      imageAlt: "Collage over geld en betalen met een bankpas, munten, een betaalautomaat en een overzicht van inkomsten en uitgaven.",
      topics: ["bankrekening", "betalen", "telefoonabonnement", "sparen", "budgetteren", "bruto-netto", "belastingen", "toeslagen", "vaste-variabele-uitgaven", "financiele-verantwoordelijkheid"]
    },
    {
      id: "werk-inkomen",
      title: "Werk & inkomen",
      lead: "Een bijbaan, een contract en je eerste loonstrook. Wat spreek je af en wat houd je over?",
      intro: "Of het nu je eerste bijbaan is of je eerste vaste baan: werken brengt afspraken, rechten en een loonstrook met zich mee. Hier ontdek je hoe dat werkt.",
      image: "assets/themas/geld-betalen.webp",
      imageAlt: "Collage over werk en inkomen met een laptop, sollicitatie, arbeidscontract, loonstrook en salaris.",
      topics: ["eerste-bijbaan", "solliciteren", "arbeidscontract", "loonstrook", "minimumjeugdloon", "vakantiegeld", "arbeidsvoorwaarden", "salaris", "pensioen"]
    },
    {
      id: "studie-toekomst",
      title: "Studie & toekomst",
      lead: "Welke opleiding past bij jou, wat kost studeren en hoe werkt DUO?",
      intro: "Na school komen er grote keuzes. Welke route past bij je, hoe meld je je aan en hoe betaal je je studie? Ontdek het stap voor stap.",
      image: "assets/themas/werk-inkomen.webp",
      imageAlt: "Collage over studie en toekomst met een leerling, studiekeuzes, boeken, een laptop en richtingen voor later.",
      topics: ["onderwijsroutes", "studiekeuze", "aanmelden-opleiding", "studiekosten", "duo", "studiefinanciering", "studentenreisproduct", "stage", "stoppen-overstappen", "student-naar-werkende"]
    },
    {
      id: "wonen-regelen",
      title: "Wonen & regelen",
      lead: "Op kamers, een huurcontract en vaste lasten. Waar let je op als je zelf gaat wonen?",
      intro: "Je eigen plek is een grote stap. Van kamer zoeken tot inschrijven bij de gemeente: hier ontdek je wat er bij zelfstandig wonen komt kijken.",
      image: "assets/themas/studie-toekomst.webp",
      imageAlt: "Collage over wonen en regelen met een woning, huurovereenkomst, sleutels en verhuisdozen.",
      topics: ["op-kamers", "huurcontract", "huurprijzen", "borg", "servicekosten", "verhuizen", "inschrijven-gemeente", "energie-internet", "vaste-lasten", "huurrechten"]
    },
    {
      id: "zorg-gezondheid",
      title: "Zorg & gezondheid",
      lead: "Van de huisarts tot je zorgverzekering. Ontdek wat je zelf regelt voor je gezondheid.",
      intro: "Steeds meer rond je gezondheid regel je zelf. Hoe werkt een zorgverzekering, wat is eigen risico en hoe maak je een afspraak? Dat ontdek je hier.",
      image: "assets/themas/wonen-regelen.webp",
      imageAlt: "Collage over zorg en gezondheid met een huisarts, zorgverzekeringspas, stethoscoop en agenda.",
      topics: ["huisarts", "zorgafspraken", "zorgverzekering", "zorgpremie", "eigen-risico", "vergoedingen", "medische-rechten", "zorgtoeslag", "gezondheid-regelen"]
    },
    {
      id: "overheid-digitaal",
      title: "Overheid & digitaal",
      lead: "DigiD, je BSN en veilig online. Zo regel je zaken met de overheid en herken je oplichting.",
      intro: "Veel zaken met de overheid regel je online. In dit thema ontdek je hoe DigiD werkt, wat je wel en niet deelt en hoe je nepberichten herkent.",
      image: "assets/themas/overheid-digitaal.webp",
      imageAlt: "Collage over overheid en digitaal met DigiD, een telefoon, identiteitskaart en online veiligheid.",
      topics: ["digid", "identiteitsbewijs", "bsn", "officiele-websites", "digitale-post", "privacy", "online-veiligheid", "oplichting", "overheid-online"]
    }
  ];

  var situations = [
    {
      id: "eerste-bijbaan",
      title: "Mijn eerste bijbaan",
      when: "Vaak tussen 15 en 17",
      lead: "Je gaat voor het eerst werken. Wat spreek je af, en wat staat er straks op je loonstrook?",
      image: null,
      phases: ["15-17"],
      topics: ["solliciteren", "minimumjeugdloon", "arbeidscontract", "loonstrook", "bruto-netto", "vakantiegeld", "vragen-werkgever"]
    },
    {
      id: "bijna-18",
      title: "Ik word bijna 18",
      when: "Rond je 18e verjaardag",
      lead: "Als je 18 wordt, ga je meer zelf regelen. Welke onderwerpen komen er op je af?",
      image: null,
      phases: ["15-17", "18-20"],
      topics: ["zorgverzekering", "eigen-risico", "zorgtoeslag", "digid", "financiele-verantwoordelijkheid"]
    },
    {
      id: "studeren",
      title: "Ik ga studeren",
      when: "Na de middelbare school",
      lead: "Je kiest een opleiding. Hoe zit het met aanmelden, studiekosten en DUO?",
      image: null,
      phases: ["18-20"],
      topics: ["studiekeuze", "aanmelden-opleiding", "studiekosten", "studiefinanciering", "duo", "studentenreisproduct"]
    },
    {
      id: "op-kamers",
      title: "Ik ga op kamers",
      when: "Als je zelf gaat wonen",
      lead: "Je eerste eigen kamer. Waar let je op bij een huurcontract en vaste lasten?",
      image: null,
      phases: ["18-20"],
      topics: ["op-kamers", "huurcontract", "borg", "servicekosten", "inschrijven-gemeente", "energie-internet", "vaste-lasten", "huurrechten"]
    }
  ];

  var phases = [
    {
      key: "12-14",
      image: "assets/levensfases/12-14.webp",
      alt: "Collage van de levensfase 12 tot en met 14 jaar met onderwerpen over een telefoon, geld, DigiD en online veiligheid.",
      age: "12–14 jaar",
      title: "Mijn eerste stappen",
      description: "Je krijgt steeds meer vrijheid en maakt je eerste eigen keuzes. Hoe werkt je bankrekening? Wat kost een telefoonabonnement? En waarom is DigiD belangrijk? Ontdek stap voor stap hoe de wereld om je heen werkt.",
      topics: ["telefoonabonnement", "bankrekening", "betalen", "sparen", "digid", "online-veiligheid", "onderwijsroutes"],
      situations: []
    },
    {
      key: "15-17",
      image: "assets/levensfases/15-17.webp",
      alt: "Collage van de levensfase 15 tot en met 17 jaar met onderwerpen over een bijbaan, loonstrook, contracten en studiekeuze.",
      age: "15–17 jaar",
      title: "Ik regel steeds meer",
      description: "Je eerste bijbaan, je eigen salaris en keuzes over je toekomst. Je krijgt meer mogelijkheden, maar ook nieuwe vragen. Leer hoe je een loonstrook begrijpt en waar je op let bij een contract.",
      topics: ["eerste-bijbaan", "solliciteren", "loonstrook", "arbeidscontract", "minimumjeugdloon", "studiekeuze", "onderwijsroutes"],
      situations: ["eerste-bijbaan", "bijna-18"]
    },
    {
      key: "18-20",
      image: "assets/levensfases/18-20.webp",
      alt: "Collage van de levensfase 18 tot en met 20 jaar met onderwerpen over zorgverzekering, DUO, studeren, geld en op kamers gaan.",
      age: "18–20 jaar",
      title: "Er verandert veel",
      description: "Je wordt meerderjarig en ineens verandert er van alles. Van je zorgverzekering tot DUO en misschien je eerste eigen kamer. Ontdek wat voor jou speelt en hoe je zaken zelf kunt regelen.",
      topics: ["zorgverzekering", "eigen-risico", "zorgtoeslag", "studiefinanciering", "duo", "op-kamers", "huurcontract", "vaste-lasten"],
      situations: ["bijna-18", "studeren", "op-kamers"]
    },
    {
      key: "21-24",
      image: "assets/levensfases/21-24.webp",
      alt: "Collage van de levensfase 21 tot en met 24 jaar met onderwerpen over werk, salaris, wonen, pensioen en vaste lasten.",
      age: "21–24 jaar",
      title: "Op eigen benen",
      description: "Misschien rond je je studie af, begin je aan een nieuwe baan of ga je zelfstandig wonen. Je krijgt meer zaken rond werk, inkomen en je huishouden zelf te regelen.",
      topics: ["salaris", "arbeidsvoorwaarden", "pensioen", "student-naar-werkende", "huurcontract", "belastingen", "vaste-lasten", "budgetteren"],
      situations: []
    }
  ];

  /* Informatiebronnen. Dit zijn bronnen, geen samenwerkingspartners.
     kind: "overheid"      = overheid of publieke uitvoeringsorganisatie
           "onafhankelijk" = onafhankelijke deskundige organisatie */
  var sources = [
    { id: "rijksoverheid", name: "Rijksoverheid", topic: "Rechten en regels", url: "https://www.rijksoverheid.nl/", kind: "overheid" },
    { id: "belastingdienst", name: "Belastingdienst", topic: "Belastingen", url: "https://www.belastingdienst.nl/", kind: "overheid" },
    { id: "duo", name: "DUO", topic: "Studie en studiefinanciering", url: "https://duo.nl/", kind: "overheid" },
    { id: "toeslagen", name: "Dienst Toeslagen", topic: "Zorgtoeslag en andere toeslagen", url: "https://www.belastingdienst.nl/wps/wcm/connect/nl/toeslagen/", kind: "overheid" },
    { id: "uwv", name: "UWV", topic: "Werk en inkomen", url: "https://www.uwv.nl/", kind: "overheid" },
    { id: "nibud", name: "Nibud", topic: "Geldzaken en budgetteren", url: "https://www.nibud.nl/", kind: "onafhankelijk" }
  ];
  var REVIEW_STATES = ["niet-gecontroleerd", "gecontroleerd", "opnieuw-controleren"];

  // Vul elk onderwerp aan met zijn id, standaardstatus en de plekken waar het voorkomt.
  Object.keys(topics).forEach(function (id) {
    var topic = topics[id];
    topic.id = id;
    topic.status = topic.status || "dev";
    topic.keywords = topic.keywords || [];
    topic.sources = topic.sources || [];
    topic.sources.forEach(function (ref) {
      if (!sources.some(function (s) { return s.id === ref.source; })) throw new Error("Onbekende bron: " + ref.source);
      ref.review = ref.review || "niet-gecontroleerd";
      if (REVIEW_STATES.indexOf(ref.review) < 0) throw new Error("Onbekende controlestatus: " + ref.review);
    });
    topic.themes = [];
    topic.situations = [];
    topic.phases = [];
  });

  function link(list, key, owner) {
    list.forEach(function (topicId) {
      var topic = topics[topicId];
      if (!topic) throw new Error("Onbekend onderwerp: " + topicId);
      topic[key].push(owner);
    });
  }
  themes.forEach(function (theme) { link(theme.topics, "themes", theme.id); });
  situations.forEach(function (situation) { link(situation.topics, "situations", situation.id); });
  phases.forEach(function (phase) { link(phase.topics, "phases", phase.key); });

  return { topics: topics, themes: themes, situations: situations, phases: phases, sources: sources };
})();
