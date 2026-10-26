/* RegelRoute — router, weergaven, zoeken en Levenskompas.
   Alle inhoud komt uit js/content.js (window.KW_CONTENT). */
(function () {
  "use strict";

  var C = window.KW_CONTENT;
  var topics = C.topics;
  var themes = C.themes;
  var situations = C.situations;
  var phases = C.phases;
  var parentPhases = C.parentPhases;
  var sources = C.sources;

  var themeById = indexBy(themes, "id");
  var situationById = indexBy(situations, "id");
  var phaseByKey = indexBy(phases, "key");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var hasObserver = "IntersectionObserver" in window;
  if (reduceMotion.matches || !hasObserver) document.documentElement.classList.add("no-reveal");

  /* ---------- Hulpfuncties ---------- */

  function indexBy(list, key) {
    var map = {};
    list.forEach(function (item) { map[item[key]] = item; });
    return map;
  }

  function esc(value) {
    return String(value).replace(/[&<>"']/g, function (ch) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[ch];
    });
  }

  function icon(name) {
    return '<svg aria-hidden="true"><use href="#i-' + name + '"/></svg>';
  }

  function pad(n) { return n < 10 ? "0" + n : String(n); }

  // Beeld uit de data, of een zwart vlak zolang er nog geen beeld is.
  function media(src, alt) {
    return src
      ? '<img src="' + src + '" alt="' + esc(alt || "") + '" loading="lazy">'
      : '<span class="media-placeholder" aria-hidden="true"></span>';
  }

  function statusBadge(topic) {
    return topic.status === "demo"
      ? '<span class="status status-demo">Demo beschikbaar</span>'
      : '<span class="status status-dev">In ontwikkeling</span>';
  }

  function topicCountLabel(ids) {
    var demos = ids.filter(function (id) { return topics[id].status === "demo"; }).length;
    var label = ids.length + " onderwerpen";
    if (demos) label += " · " + demos + (demos === 1 ? " oefening" : " oefeningen") + " te bekijken";
    return label;
  }

  function themeIndex(theme) { return themes.indexOf(theme); }

  // Situaties die onderwerpen met dit thema delen.
  function situationsForTheme(theme) {
    return situations.filter(function (s) {
      return s.topics.some(function (id) { return theme.topics.indexOf(id) > -1; });
    });
  }

  // Thema's waar de onderwerpen van een situatie onder vallen, in vaste volgorde.
  function themesForTopics(ids) {
    return themes.filter(function (t) {
      return ids.some(function (id) { return t.topics.indexOf(id) > -1; });
    });
  }

  function chip(href, label) {
    return '<a class="chip" href="' + href + '">' + esc(label) + "</a>";
  }

  function topicRows(ids) {
    return ids.map(function (id) {
      var topic = topics[id];
      return '<a class="topic-row" href="#/onderwerpen/' + id + '">' +
        '<span class="topic-row-title">' + esc(topic.title) + "</span>" +
        statusBadge(topic) +
        '<svg class="topic-row-arrow" aria-hidden="true"><use href="#i-chevron"/></svg>' +
        "</a>";
    }).join("");
  }

  function breadcrumb(items) {
    var html = items.map(function (item, i) {
      var last = i === items.length - 1;
      return (i ? '<span aria-hidden="true">/</span>' : "") +
        (last ? '<span aria-current="page">' + esc(item[0]) + "</span>" : '<a href="' + item[1] + '">' + esc(item[0]) + "</a>");
    }).join("");
    return '<nav class="breadcrumb" aria-label="Kruimelpad">' + html + "</nav>";
  }

  /* ---------- Homepage: thema's vanuit de data ---------- */

  // "Een bankrekening" → "bankrekening"; eigennamen als DigiD en BSN blijven staan.
  function inSentence(title) {
    var t = title.replace(/^(Een|Je|De) /, "");
    return /^(DigiD|DUO|BSN)/.test(t) ? t : t.charAt(0).toLowerCase() + t.slice(1);
  }

  function renderHome() {
    document.getElementById("themeGrid").innerHTML = themes.map(function (theme, i) {
      var preview = theme.topics.slice(0, 3).map(function (id) { return inSentence(topics[id].title); }).join(", ");
      preview = preview.charAt(0).toUpperCase() + preview.slice(1);
      return '<a class="theme-card reveal" href="#/themas/' + theme.id + '">' +
        '<span class="theme-figure">' + media(theme.image, theme.imageAlt) + "</span>" +
        '<span class="theme-meta"><span class="theme-num" aria-hidden="true">' + pad(i + 1) + '</span><h3 class="theme-title">' + esc(theme.title) + "</h3></span>" +
        '<span class="theme-lead">' + esc(theme.lead) + "</span>" +
        '<span class="theme-topics"><strong>' + theme.topics.length + " onderwerpen</strong> · " + esc(preview) + " en meer</span>" +
        '<span class="theme-go">Ontdek dit thema ' + icon("arrow") + "</span>" +
        "</a>";
    }).join("");

    renderSources();

    document.getElementById("eduThemes").innerHTML = themes.map(function (t) {
      return chip("#/themas/" + t.id, t.title);
    }).join("");
  }

  /* ---------- Informatiebronnen ---------- */

  var sourceById = indexBy(sources, "id");
  var NEW_TAB = '<span class="visually-hidden"> (opent in een nieuw tabblad)</span>';

  function externalLink(href, label, cls) {
    return '<a class="' + cls + '" href="' + esc(href) + '" target="_blank" rel="noopener noreferrer">' +
      esc(label) + NEW_TAB + '<svg aria-hidden="true"><use href="#i-external"/></svg></a>';
  }

  // Prikbord: elk papiertje is één gewone tekstlink (onderwerp → bron), geen beeldmerk.
  function renderSources() {
    var KIND = { overheid: "Overheid", onafhankelijk: "Onafhankelijk · geen overheid" };
    document.getElementById("sourcesList").innerHTML = sources.map(function (s) {
      return '<li class="note note-' + s.kind + '">' +
        '<span class="note-tape" aria-hidden="true"></span>' +
        '<a class="note-paper" href="' + esc(s.url) + '" target="_blank" rel="noopener noreferrer">' +
          '<span class="note-kind">' + esc(KIND[s.kind]) + '<span class="visually-hidden">: </span></span>' +
          '<span class="note-topic">' + esc(s.topic) + '<span class="visually-hidden">. </span></span>' +
          '<span class="note-source"><span class="note-via">Lees verder bij<span class="visually-hidden"> </span></span>' +
            '<span class="note-name">' + esc(s.name) + '<svg aria-hidden="true"><use href="#i-external"/></svg></span></span>' +
          '<span class="visually-hidden">, </span><span class="note-domain">' + esc(s.url.replace(/^https?:\/\/(www\.)?/, "").split("/")[0]) + "</span>" +
          NEW_TAB +
        "</a></li>";
    }).join("");
  }

  var REVIEW_LABELS = {
    "niet-gecontroleerd": "Nog niet gecontroleerd",
    "gecontroleerd": "Gecontroleerd",
    "opnieuw-controleren": "Opnieuw te controleren"
  };

  // Bronnen van één les; verschijnt alleen als er in content.js bronnen zijn ingevuld.
  function lessonSources(topic) {
    if (!topic.sources.length) return "";
    return '<div class="lesson-sources"><h2>Bronnen van deze les</h2><ul>' +
      topic.sources.map(function (ref) {
        var source = sourceById[ref.source];
        return "<li>" + externalLink(ref.url || source.url, source.name, "text-link") +
          '<span class="lesson-source-meta">' + esc(REVIEW_LABELS[ref.review]) +
          (ref.checkedOn ? " op " + esc(ref.checkedOn) : "") + "</span>" +
          (ref.conditions ? '<p>' + esc(ref.conditions) + "</p>" : "") +
          "</li>";
      }).join("") +
      '</ul><p class="lesson-sources-note">Dit zijn informatiebronnen, geen samenwerkingspartners.</p></div>';
  }

  /* ---------- Subpagina's ---------- */

  var pageView = document.getElementById("view-page");
  var lessonStore = document.getElementById("lessonStore");
  var lessonLoonstrook = document.getElementById("lessonLoonstrook");

  function pageHead(opts) {
    return '<section class="page-head on-navy"><div class="wrap">' + opts.crumbs +
      '<div class="page-head-grid"><div>' +
        '<p class="kicker">' + esc(opts.kicker) + "</p>" +
        '<h1 class="display" tabindex="-1">' + esc(opts.title) + "</h1>" +
        (opts.lead ? '<p class="lead">' + esc(opts.lead) + "</p>" : "") +
        (opts.meta ? '<div class="meta">' + opts.meta + "</div>" : "") +
      "</div>" +
      (opts.figure ? '<figure class="page-figure' + (opts.photo ? " is-photo" : "") + '">' + media(opts.image, opts.imageAlt) + "</figure>" : "") +
      "</div></div></section>";
  }

  function pager(prev, next) {
    return '<nav class="pager" aria-label="Meer ontdekken">' +
      '<a href="' + prev.href + '"><small>&larr; Vorige</small><strong>' + esc(prev.title) + "</strong></a>" +
      '<a href="' + next.href + '"><small>Volgende &rarr;</small><strong>' + esc(next.title) + "</strong></a>" +
      "</nav>";
  }

  function renderTheme(theme) {
    var i = themeIndex(theme);
    var prev = themes[(i + themes.length - 1) % themes.length];
    var next = themes[(i + 1) % themes.length];
    var related = situationsForTheme(theme);

    return pageHead({
      crumbs: breadcrumb([["RegelRoute", "#/"], ["Thema's", "#/themas"], [theme.title]]),
      kicker: "Thema " + pad(i + 1),
      title: theme.title,
      lead: theme.intro,
      meta: "<span>" + theme.topics.length + " onderwerpen</span><span>Voor iedereen van 12 t/m 24 jaar</span>",
      figure: true,
      image: theme.image,
      imageAlt: theme.imageAlt
    }) +
    '<section class="page-body torn-top"><div class="wrap">' +
      '<div class="page-columns">' +
        '<div class="page-section"><h2>Onderwerpen</h2>' +
          '<p class="sub">Kies een onderwerp. Bij lessen die nog niet klaar zijn, zie je het label ‘In ontwikkeling’.</p>' +
          '<div class="topic-list">' + topicRows(theme.topics) + "</div>" +
        "</div>" +
        "<aside>" +
          (related.length ? '<div class="aside-block"><h2>Speelt dit bij jou?</h2><div class="chips">' +
            related.map(function (s) { return chip("#/situaties/" + s.id, s.title); }).join("") + "</div></div>" : "") +
          '<div class="aside-block"><h2>Liever per levensfase?</h2><p>Blader door het Levenskompas en zie welke onderwerpen vaak in jouw fase spelen.</p>' +
            '<a class="text-link" href="#/levenskompas">Open het Levenskompas ' + icon("arrow") + "</a></div>" +
        "</aside>" +
      "</div>" +
      pager({ href: "#/themas/" + prev.id, title: prev.title }, { href: "#/themas/" + next.id, title: next.title }) +
    "</div></section>";
  }

  function renderSituation(s) {
    var i = situations.indexOf(s);
    var prev = situations[(i + situations.length - 1) % situations.length];
    var next = situations[(i + 1) % situations.length];
    var relatedThemes = themesForTopics(s.topics);

    return pageHead({
      crumbs: breadcrumb([["RegelRoute", "#/"], [s.title]]),
      kicker: "Situatie · " + s.when,
      title: s.title,
      lead: s.lead,
      meta: "<span>" + topicCountLabel(s.topics) + "</span>",
      figure: true,
      image: s.image,
      imageAlt: s.imageAlt,
      photo: true
    }) +
    '<section class="page-body torn-top"><div class="wrap">' +
      '<div class="page-columns">' +
        '<div class="page-section"><h2>Waar begin je?</h2>' +
          '<p class="sub">Deze onderwerpen komen vaak op je af in deze situatie. Begin waar jij vragen over hebt.</p>' +
          '<div class="topic-list">' + topicRows(s.topics) + "</div>" +
        "</div>" +
        "<aside>" +
          '<div class="aside-block"><h2>Hoort bij de thema’s</h2><div class="chips">' +
            relatedThemes.map(function (t) { return chip("#/themas/" + t.id, t.title); }).join("") + "</div></div>" +
          '<div class="aside-block"><h2>In het Levenskompas</h2><div class="chips">' +
            s.phases.map(function (key) { return chip("#/levenskompas/" + key, phaseByKey[key].age); }).join("") + "</div></div>" +
        "</aside>" +
      "</div>" +
      pager({ href: "#/situaties/" + prev.id, title: prev.title }, { href: "#/situaties/" + next.id, title: next.title }) +
    "</div></section>";
  }

  function renderTopic(topic) {
    var primary = themeById[topic.themes[0]];
    var crumbs = primary
      ? [["RegelRoute", "#/"], [primary.title, "#/themas/" + primary.id], [topic.title]]
      : [["RegelRoute", "#/"], [situationById[topic.situations[0]].title, "#/situaties/" + topic.situations[0]], [topic.title]];
    var places = "";

    if (topic.themes.length) {
      places += '<div class="aside-block"><h2>Thema</h2><div class="chips">' +
        topic.themes.map(function (id) { return chip("#/themas/" + id, themeById[id].title); }).join("") + "</div></div>";
    }
    if (topic.situations.length) {
      places += '<div class="aside-block"><h2>Situaties</h2><div class="chips">' +
        topic.situations.map(function (id) { return chip("#/situaties/" + id, situationById[id].title); }).join("") + "</div></div>";
    }
    if (topic.phases.length) {
      places += '<div class="aside-block"><h2>Levensfase</h2><p>Speelt vaak rond deze leeftijd, maar je mag het altijd bekijken.</p><div class="chips" style="margin-top:12px">' +
        topic.phases.map(function (key) { return chip("#/levenskompas/" + key, phaseByKey[key].age); }).join("") + "</div></div>";
    }

    var devText = topic.status === "demo"
      ? "<p>Hieronder kun je alvast een korte oefening proberen. De volledige les over dit onderwerp is nog in ontwikkeling.</p>"
      : "<p>We werken aan uitleg en oefeningen over dit onderwerp. Uitleg over regels en bedragen publiceren we pas als die is gecontroleerd met officiële bronnen. Zo weet je zeker dat wat je hier leest klopt.</p>";

    return pageHead({
      crumbs: breadcrumb(crumbs),
      kicker: primary ? primary.title : "Onderwerp",
      title: topic.title,
      meta: statusBadge(topic)
    }) +
    '<section class="page-body torn-top"><div class="wrap">' +
      '<div class="page-columns">' +
        '<div class="page-section">' +
          (topic.summary ? '<p class="topic-summary">' + esc(topic.summary) + "</p>" : "") +
          '<div class="dev-panel"><h2>' + (topic.status === "demo" ? "Probeer de oefening" : "Deze les is in ontwikkeling") + "</h2>" + devText + "</div>" +
          (topic.status === "demo" ? '<div id="lessonSlot" style="margin-top:28px"></div>' : "") +
          lessonSources(topic) +
        "</div>" +
        '<aside aria-label="Hier vind je dit onderwerp ook">' + places + "</aside>" +
      "</div>" +
    "</div></section>";
  }

  function renderPage(kind, item) {
    // Oefening eerst terugzetten, zodat innerHTML hem niet weggooit.
    lessonStore.appendChild(lessonLoonstrook);

    if (kind === "theme") pageView.innerHTML = renderTheme(item);
    if (kind === "situation") pageView.innerHTML = renderSituation(item);
    if (kind === "topic") {
      pageView.innerHTML = renderTopic(item);
      var slot = document.getElementById("lessonSlot");
      if (slot && item.id === "loonstrook") {
        slot.appendChild(lessonLoonstrook);
        resetExercise();
      }
    }
    pageView.setAttribute("data-title", item.title + " | RegelRoute");
  }

  /* ---------- Voor ouders ---------- */

  var parentPhaseIndex = 0;

  function renderParents() {
    var phase = parentPhases[parentPhaseIndex];
    var tabs = parentPhases.map(function (item, i) {
      return '<button type="button" class="parent-phase-tab' + (i === parentPhaseIndex ? " is-active" : "") +
        '" data-parent-phase="' + i + '" aria-selected="' + (i === parentPhaseIndex ? "true" : "false") + '">' +
        esc(item.age) + "</button>";
    }).join("");

    return '<section class="page-head on-navy parents-head">' +
      '<div class="wrap">' +
        '<nav class="breadcrumb" aria-label="Kruimelpad"><a href="#/">RegelRoute</a><span aria-hidden="true">/</span><span aria-current="page">Voor ouders</span></nav>' +
        '<p class="kicker">Voor ouders en verzorgers</p>' +
        '<h1 class="display" tabindex="-1">Samen op weg naar zelfstandigheid.</h1>' +
        '<p class="lead">Je kind wordt steeds zelfstandiger. Maar wat moet je kind eigenlijk weten en regelen? RegelRoute helpt je overzicht te houden, belangrijke onderwerpen te begrijpen en je kind stap voor stap te begeleiden.</p>' +
        '<div class="meta"><span>Leeftijdsgrenzen zijn een richtlijn</span><span>Zonder accounts of persoonsgegevens</span></div>' +
      "</div>" +
    "</section>" +
    '<section class="page-body on-navy torn-top parents-body"><div class="wrap">' +
      '<div class="parents-intro"><p class="kicker">Samen kiezen</p><h2>In welke levensfase zit jouw kind?</h2><p class="sub">Elke jongere ontwikkelt zich in een eigen tempo. Kies de fase die nu het beste past, of kijk gerust vooruit.</p></div>' +
      '<div class="parent-phase-tabs" role="tablist" aria-label="Kies een levensfase">' + tabs + "</div>" +
      '<div class="parent-phase-panel" role="tabpanel" aria-live="polite">' +
        '<div class="parent-phase-heading"><span class="parent-phase-number">0' + (parentPhaseIndex + 1) + '</span><div><p class="parent-age">' + esc(phase.age) + '</p><h3>' + esc(phase.title) + "</h3></div></div>" +
        '<div class="parent-phase-grid">' +
          '<div><h4>Belangrijke onderwerpen</h4><div class="parent-topics">' + phase.topics.map(function (id) { return '<a href="#/onderwerpen/' + id + '" class="chip">' + esc(topics[id].title) + "</a>"; }).join("") + "</div></div>" +
          '<div><h4>Wat leert en regelt je kind?</h4><p>' + esc(phase.learning) + "</p></div>" +
          "<div><h4>Praktische tips</h4><ul class='parent-list'>" + phase.tips.map(function (tip) { return "<li>" + esc(tip) + "</li>"; }).join("") + "</ul></div>" +
          "<div><h4>Vragen voor een gesprek</h4><ul class='parent-list parent-questions'>" + phase.questions.map(function (question) { return "<li>" + esc(question) + "</li>"; }).join("") + "</ul></div>" +
        "</div>" +
      "</div>" +
      '<p class="parents-note"><svg aria-hidden="true"><use href="#i-open"/></svg> Zie leeftijden als een kompas, niet als vaste regels. Een onderwerp kan eerder of later relevant worden.</p>' +
    "</div></section>";
  }

  function bindParentPhaseTabs() {
    document.querySelectorAll(".parent-phase-tab").forEach(function (tab) {
      tab.addEventListener("click", function () {
        parentPhaseIndex = Number(tab.getAttribute("data-parent-phase"));
        pageViewParents.innerHTML = renderParents();
        bindParentPhaseTabs();
      });
    });
  }

  /* ---------- Levenskompas ---------- */

  var activePhase = 0;
  var compassSwapTimer = null;
  var compassStage = document.getElementById("compassStage");
  var compassCollage = document.getElementById("compassCollage");
  var compassTabs = document.getElementById("compassTabs");

  compassTabs.innerHTML = phases.map(function (phase, i) {
    return '<button type="button" class="compass-tab" data-phase="' + i + '" data-number="' + pad(i + 1) + '" aria-pressed="false">' +
      '<span class="visually-hidden">Levensfase </span>' + phase.key.replace("-", "–") + " jaar</button>";
  }).join("");
  var tabButtons = compassTabs.querySelectorAll(".compass-tab");

  // Alle collages vooraf laden, zodat wisselen nooit op het netwerk wacht.
  phases.forEach(function (phase) {
    var img = new Image();
    img.src = phase.image;
    if (img.decode) img.decode().catch(function () {});
  });

  function fillCompass() {
    var phase = phases[activePhase];
    document.getElementById("compassAge").textContent = phase.age;
    document.getElementById("compassTitle").textContent = phase.title;
    document.getElementById("compassDescription").textContent = phase.description;
    compassCollage.src = phase.image;
    compassCollage.alt = phase.alt;
    document.getElementById("compassTopics").innerHTML = phase.topics.map(function (id) {
      var topic = topics[id];
      return '<a class="compass-topic" href="#/onderwerpen/' + id + '"><span>' + esc(topic.title) + "</span>" + statusBadge(topic) + "</a>";
    }).join("");
    document.getElementById("compassSituations").innerHTML = phase.situations.map(function (id) {
      return '<a class="chip" href="#/situaties/' + id + '">Situatie: ' + esc(situationById[id].title) + "</a>";
    }).join("");
    tabButtons.forEach(function (tab, i) {
      tab.classList.toggle("is-active", i === activePhase);
      tab.setAttribute("aria-pressed", i === activePhase ? "true" : "false");
    });
  }

  function showPhase(index, direction) {
    activePhase = (index + phases.length) % phases.length;
    history.replaceState(null, "", "#/levenskompas/" + phases[activePhase].key);

    if (!direction || reduceMotion.matches) {
      fillCompass();
      return;
    }

    window.clearTimeout(compassSwapTimer);
    compassCollage.style.setProperty("--slide-dir", direction);
    compassCollage.classList.remove("is-entering");
    compassStage.classList.add("is-changing");
    compassCollage.classList.add("is-changing");
    compassSwapTimer = window.setTimeout(function () {
      fillCompass();
      // Zonder transitie naar de andere kant springen, dan inschuiven.
      compassCollage.classList.remove("is-changing");
      compassCollage.classList.add("is-entering");
      void compassCollage.offsetWidth;
      compassCollage.classList.remove("is-entering");
      compassStage.classList.remove("is-changing");
    }, 150);
  }

  tabButtons.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var index = Number(tab.getAttribute("data-phase"));
      if (index !== activePhase) showPhase(index, index > activePhase ? 1 : -1);
    });
  });
  document.getElementById("compassPrevious").addEventListener("click", function () { showPhase(activePhase - 1, -1); });
  document.getElementById("compassNext").addEventListener("click", function () { showPhase(activePhase + 1, 1); });

  document.addEventListener("keydown", function (e) {
    if (currentView !== "view-compass" || e.altKey || e.metaKey || e.ctrlKey) return;
    var tag = (e.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea") return;
    if (e.key === "ArrowLeft") { e.preventDefault(); showPhase(activePhase - 1, -1); }
    if (e.key === "ArrowRight") { e.preventDefault(); showPhase(activePhase + 1, 1); }
  });

  /* ---------- Router ---------- */

  var SECTIONS = ["ontdek", "zo-werkt-het", "themas", "bronnen", "voor-scholen"];

  // Oude adressen blijven werken.
  var ALIASES = [
    [/^top$/, ""],
    [/^leeftijd$/, "levenskompas"],
    [/^leeftijd\/(.+)$/, "levenskompas/$1"],
    [/^situaties\/(\d\d-\d\d)$/, "levenskompas/$1"],
    [/^programma$/, ""],
    [/^programma\/bijbaan$/, "situaties/eerste-bijbaan"],
    [/^programma\/bijbaan\/loonstrook$/, "onderwerpen/loonstrook"],
    [/^programma\/bijbaan\/contract$/, "onderwerpen/arbeidscontract"],
    [/^programma\/bijbaan\/vragen$/, "onderwerpen/vragen-werkgever"],
    [/^programma\/achttien$/, "situaties/bijna-18"],
    [/^programma\/studeren$/, "situaties/studeren"],
    [/^programma\/opmezelf$/, "situaties/op-kamers"]
  ];

  var VIEW_IDS = ["view-home", "view-compass", "view-page", "view-parents", "view-edu"];
  var currentView = null;
  var pageViewParents = document.getElementById("view-parents");

  function currentPath() {
    return decodeURIComponent(location.hash.replace(/^#\/?/, "")).replace(/\/+$/, "");
  }

  function resolveAlias(path) {
    for (var i = 0; i < ALIASES.length; i++) {
      if (ALIASES[i][0].test(path)) {
        var target = path.replace(ALIASES[i][0], ALIASES[i][1]);
        history.replaceState(null, "", "#/" + target);
        return target;
      }
    }
    return path;
  }

  function parseRoute(path) {
    var parts = path.split("/");
    if (path === "") return { view: "view-home" };
    if (SECTIONS.indexOf(path) > -1) return { view: "view-home", section: path };
    if (parts[0] === "levenskompas" && parts.length <= 2) return { view: "view-compass", phase: parts[1] };
    if (parts.length === 2 && parts[0] === "themas" && themeById[parts[1]]) return { view: "view-page", kind: "theme", item: themeById[parts[1]], nav: "themas" };
    if (parts.length === 2 && parts[0] === "situaties" && situationById[parts[1]]) return { view: "view-page", kind: "situation", item: situationById[parts[1]] };
    if (parts.length === 2 && parts[0] === "onderwerpen" && topics[parts[1]]) return { view: "view-page", kind: "topic", item: topics[parts[1]], nav: "themas" };
    if (path === "voor-ouders") return { view: "view-parents", nav: "voor-ouders" };
    if (path === "onderwijs") return { view: "view-edu", nav: "voor-scholen" };
    return null;
  }

  function showView(id) {
    var changed = currentView !== id;
    VIEW_IDS.forEach(function (viewId) {
      document.getElementById(viewId).hidden = viewId !== id;
    });
    var el = document.getElementById(id);
    if (changed && currentView !== null && !reduceMotion.matches) {
      el.classList.remove("is-entering");
      void el.offsetWidth;
      el.classList.add("is-entering");
    }
    currentView = id;
    document.title = el.getAttribute("data-title") || "RegelRoute";
  }

  function focusHeading(el) {
    if (!el) return;
    if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
  }

  // CSS zet scroll-behavior op smooth; bij een directe sprong schakelen we dat even uit.
  function jump(fn) {
    var root = document.documentElement;
    root.style.scrollBehavior = "auto";
    fn();
    root.style.scrollBehavior = "";
  }

  function scrollToSection(id, smooth) {
    var section = document.getElementById(id);
    if (!section) return;
    if (smooth && !reduceMotion.matches) section.scrollIntoView({ behavior: "smooth", block: "start" });
    else jump(function () { section.scrollIntoView({ block: "start" }); });
  }

  function render(moveFocus, sameViewSmooth) {
    var path = resolveAlias(currentPath());
    var route = parseRoute(path);
    if (!route) {
      history.replaceState(null, "", "#/");
      route = { view: "view-home" };
    }
    var previousView = currentView;

    closeMenu();

    if (route.view === "view-page") renderPage(route.kind, route.item);
    if (route.view === "view-parents") {
      pageViewParents.innerHTML = renderParents();
      bindParentPhaseTabs();
    }
    if (route.view === "view-compass") {
      var key = route.phase && phaseByKey[route.phase] ? route.phase : null;
      activePhase = key ? phases.indexOf(phaseByKey[key]) : activePhase;
      if (!key) history.replaceState(null, "", "#/levenskompas/" + phases[activePhase].key);
      fillCompass();
    }

    showView(route.view);
    setNavCurrent(route.section || route.nav || null);

    if (route.view === "view-home") {
      var stayed = previousView === "view-home";
      if (route.section) {
        // Na een weergavewissel eerst laten opbouwen, dan pas scrollen.
        if (stayed) scrollToSection(route.section, true);
        else requestAnimationFrame(function () { scrollToSection(route.section, false); });
        if (moveFocus) focusHeading(document.querySelector("#" + route.section + " h2"));
      } else {
        if (stayed && sameViewSmooth && !reduceMotion.matches) window.scrollTo({ top: 0, behavior: "smooth" });
        else jump(function () { window.scrollTo(0, 0); });
        if (moveFocus && !stayed) focusHeading(document.getElementById("hero-title"));
      }
    } else {
      jump(function () { window.scrollTo(0, 0); });
      if (moveFocus) focusHeading(document.querySelector("#" + route.view + " h1"));
    }
  }

  window.addEventListener("hashchange", function () { render(true, true); });

  // Klik op een link naar de huidige hash: geen hashchange, dus zelf afhandelen.
  document.addEventListener("click", function (e) {
    var link = e.target.closest && e.target.closest('a[href^="#/"]');
    if (!link || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
    var target = link.getAttribute("href").replace(/^#\/?/, "");
    if (target === currentPath()) {
      e.preventDefault();
      render(true, true);
    }
  });

  /* ---------- Navigatie ---------- */

  var header = document.getElementById("siteHeader");
  var menuToggle = document.getElementById("menuToggle");
  var navList = document.getElementById("navList");
  var navLinks = navList.querySelectorAll(".nav-link");

  function setNavCurrent(section) {
    navLinks.forEach(function (link) {
      if (link.getAttribute("data-section") === section) link.setAttribute("aria-current", "true");
      else link.removeAttribute("aria-current");
    });
  }

  function closeMenu() {
    navList.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }

  menuToggle.addEventListener("click", function () {
    var open = !navList.classList.contains("is-open");
    navList.classList.toggle("is-open", open);
    menuToggle.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) navLinks[0].focus();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && navList.classList.contains("is-open")) {
      closeMenu();
      menuToggle.focus();
    }
  });

  document.addEventListener("click", function (e) {
    if (navList.classList.contains("is-open") && !header.contains(e.target)) closeMenu();
  });

  var ticking = false;
  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
      ticking = false;
    });
  }, { passive: true });

  // Op de homepage het navigatie-item van de zichtbare sectie markeren.
  if (hasObserver) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      if (currentView !== "view-home") return;
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setNavCurrent(entry.target.id);
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    SECTIONS.forEach(function (id) { sectionObserver.observe(document.getElementById(id)); });
    // Terug in de hero: geen navigatie-item actief.
    new IntersectionObserver(function (entries) {
      if (currentView === "view-home" && entries[0].isIntersecting) setNavCurrent(null);
    }, { rootMargin: "-45% 0px -50% 0px" }).observe(document.querySelector(".hero"));
  }

  /* ---------- Zoeken ---------- */

  var searchInput = document.getElementById("searchInput");
  var searchClear = document.getElementById("searchClear");
  var searchStatus = document.getElementById("searchStatus");
  var searchResults = document.getElementById("searchResults");
  var SUGGESTIONS = ["Zorgtoeslag", "Loonstrook", "Huurcontract", "DigiD", "Studiefinanciering", "Pensioen"];

  function norm(s) {
    return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
  }

  var searchIndex = []
    .concat(Object.keys(topics).map(function (id) {
      var t = topics[id];
      var where = t.themes.length ? themeById[t.themes[0]].title : situationById[t.situations[0]].title;
      return { kind: 0, type: "Onderwerp · " + where, title: t.title, href: "#/onderwerpen/" + id, topic: t, terms: t.keywords.map(norm) };
    }))
    .concat(situations.map(function (s) {
      return { kind: 1, type: "Situatie", title: s.title, href: "#/situaties/" + s.id, terms: [norm(s.lead)] };
    }))
    .concat(themes.map(function (t) {
      return { kind: 2, type: "Thema", title: t.title, href: "#/themas/" + t.id, terms: [norm(t.lead)] };
    }));
  // Lidwoorden tellen niet mee: "huur" vindt ook "Een huurcontract" als eerste.
  searchIndex.forEach(function (entry) { entry.normTitle = norm(entry.title).replace(/^(een|je|de|het) /, ""); });

  function scoreEntry(entry, q, tokens) {
    var title = entry.normTitle;
    if (title === q) return 120;
    if (title.indexOf(q) === 0) return 100;
    if ((" " + title).indexOf(" " + q) > -1) return 85;
    if (title.indexOf(q) > -1) return 70;
    for (var i = 0; i < entry.terms.length; i++) {
      var term = entry.terms[i];
      if (term === q) return 65;
      if (entry.kind === 0 && term.indexOf(q) === 0) return 55;
      if (entry.kind === 0 && q.length > 3 && term.indexOf(q) > -1) return 40;
    }
    // Meerdere woorden: elk woord moet ergens voorkomen.
    if (tokens.length > 1) {
      var haystack = title + " " + entry.terms.join(" ");
      if (tokens.every(function (tok) { return haystack.indexOf(tok) > -1; })) return 30;
    }
    if (entry.kind > 0 && q.length > 3 && entry.terms[0].indexOf(q) > -1) return 15;
    return 0;
  }

  function highlight(title, raw) {
    var i = title.toLowerCase().indexOf(raw.toLowerCase().trim());
    if (!raw.trim() || i < 0) return esc(title);
    var len = raw.trim().length;
    return esc(title.slice(0, i)) + "<mark>" + esc(title.slice(i, i + len)) + "</mark>" + esc(title.slice(i + len));
  }

  function renderSearch(raw, resultsEl, statusEl) {
    var q = norm(raw);

    if (q.length < 2) {
      resultsEl.innerHTML = "";
      if (statusEl) statusEl.textContent = q.length ? "Typ nog een letter…" : "";
      return;
    }

    var tokens = q.split(" ");
    var hits = searchIndex
      .map(function (entry) { return { entry: entry, score: scoreEntry(entry, q, tokens) }; })
      .filter(function (hit) { return hit.score > 0; })
      .sort(function (a, b) { return b.score - a.score || a.entry.kind - b.entry.kind; })
      .slice(0, 8);

    if (!hits.length) {
      resultsEl.innerHTML = "";
      if (statusEl) statusEl.textContent = "Geen resultaten voor “" + raw.trim() + "”.";
      return;
    }

    var devCount = hits.filter(function (h) { return h.entry.topic && h.entry.topic.status === "dev"; }).length;
    if (statusEl) statusEl.textContent = hits.length + (hits.length === 1 ? " resultaat." : " resultaten.") +
      (devCount ? " Onderwerpen met ‘In ontwikkeling’ kennen we al, maar de les is nog niet beschikbaar." : "");

    resultsEl.innerHTML = hits.map(function (hit) {
      var e = hit.entry;
      return '<a class="result" href="' + e.href + '">' +
        '<span class="result-type">' + esc(e.type) + "</span>" +
        '<span class="result-title">' + highlight(e.title, raw) + "</span>" +
        (e.topic ? statusBadge(e.topic) : "") +
        "</a>";
    }).join("");
  }

  function runSearch() {
    searchClear.hidden = !searchInput.value;
    renderSearch(searchInput.value, searchResults, searchStatus);
  }

  searchInput.addEventListener("input", runSearch);

  searchInput.addEventListener("keydown", function (e) {
    var first = searchResults.querySelector(".result");
    if (e.key === "Enter" && first) { e.preventDefault(); location.hash = first.getAttribute("href"); }
    if (e.key === "ArrowDown" && first) { e.preventDefault(); first.focus(); }
    if (e.key === "Escape" && searchInput.value) { e.preventDefault(); searchInput.value = ""; runSearch(); }
  });

  searchResults.addEventListener("keydown", function (e) {
    var items = Array.prototype.slice.call(searchResults.querySelectorAll(".result"));
    var i = items.indexOf(document.activeElement);
    if (i < 0) return;
    if (e.key === "ArrowDown" && items[i + 1]) { e.preventDefault(); items[i + 1].focus(); }
    if (e.key === "ArrowUp") { e.preventDefault(); (items[i - 1] || searchInput).focus(); }
  });

  searchClear.addEventListener("click", function () {
    searchInput.value = "";
    runSearch();
    searchInput.focus();
  });

  var navSearchInput = document.getElementById("navSearchInput");
  var navSearchResults = document.getElementById("navSearchResults");
  var navSearchClear = document.getElementById("navSearchClear");
  var navSearchForm = document.getElementById("navSearchForm");

  function closeNavSearch() {
    navSearchResults.innerHTML = "";
    navSearchInput.setAttribute("aria-expanded", "false");
  }

  navSearchInput.addEventListener("input", function () {
    navSearchClear.hidden = !navSearchInput.value;
    renderSearch(navSearchInput.value, navSearchResults, null);
    navSearchInput.setAttribute("aria-expanded", navSearchResults.children.length ? "true" : "false");
  });

  navSearchInput.addEventListener("keydown", function (e) {
    var first = navSearchResults.querySelector(".result");
    if (e.key === "Enter" && first) {
      e.preventDefault();
      location.hash = first.getAttribute("href");
      closeNavSearch();
    }
    if (e.key === "Escape") {
      navSearchInput.value = "";
      navSearchClear.hidden = true;
      closeNavSearch();
    }
  });

  navSearchClear.addEventListener("click", function () {
    navSearchInput.value = "";
    navSearchClear.hidden = true;
    closeNavSearch();
    navSearchInput.focus();
  });

  navSearchForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var first = navSearchResults.querySelector(".result");
    if (first) location.hash = first.getAttribute("href");
  });

  var suggest = document.getElementById("searchSuggest");
  SUGGESTIONS.forEach(function (word) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "chip";
    b.textContent = word;
    b.addEventListener("click", function () {
      searchInput.value = word;
      runSearch();
      searchInput.focus();
    });
    suggest.appendChild(b);
  });

  /* ---------- Oefening: loonstrook ---------- */

  var exerciseOptions = lessonLoonstrook.querySelectorAll(".exercise-option");
  var exerciseFeedback = document.getElementById("exerciseFeedback");
  var exerciseRetry = document.getElementById("exerciseRetry");

  function resetExercise() {
    exerciseOptions.forEach(function (opt) {
      opt.disabled = false;
      opt.classList.remove("is-correct", "is-incorrect");
    });
    exerciseFeedback.textContent = "";
    exerciseRetry.hidden = true;
  }

  exerciseOptions.forEach(function (opt) {
    opt.addEventListener("click", function () {
      exerciseOptions.forEach(function (o) { o.disabled = true; });
      var correct = opt.getAttribute("data-answer") === "netto";
      opt.classList.add(correct ? "is-correct" : "is-incorrect");
      if (!correct) lessonLoonstrook.querySelector('[data-answer="netto"]').classList.add("is-correct");
      exerciseFeedback.textContent = correct
        ? "Goed! “Netto loon” is het bedrag dat je daadwerkelijk ontvangt."
        : "Niet helemaal. Het gemarkeerde label is “Netto loon”.";
      exerciseRetry.hidden = false;
      exerciseRetry.focus();
    });
  });

  exerciseRetry.addEventListener("click", function () {
    resetExercise();
    exerciseOptions[0].focus();
  });

  /* ---------- Scroll-reveal ---------- */

  function setupReveal() {
    var items = document.querySelectorAll(".reveal");
    if (reduceMotion.matches || !hasObserver) {
      items.forEach(function (item) { item.classList.add("is-visible"); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
    items.forEach(function (item) { observer.observe(item); });
  }

  /* ---------- Start ---------- */

  renderHome();
  setupReveal();
  render(false, false);
})();
