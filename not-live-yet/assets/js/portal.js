/* =====================================================================
   Page layer — shared shell (header/footer) + one renderer per page.
   Works from file:// (no modules, no fetch), so the portal can live on
   a shared drive or inside the screensaver wrapper.
   ===================================================================== */
(function () {
  'use strict';
  var U = window.UX, F = window.FX, esc = F.esc;
  var page = document.body.getAttribute('data-page') || 'home';
  var app = document.getElementById('app');

  /* ---------- helpers ---------- */
  function h(html) { var t = document.createElement('template'); t.innerHTML = html.trim(); return t.content; }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function ext(url, label, cls) { return '<a href="' + esc(url) + '" target="_blank" rel="noopener"' + (cls ? ' class="' + cls + '"' : '') + '>' + label + '</a>'; }
  function chip(slug) {
    var m = U.m(slug); if (!m) return '';
    return '<a class="chip" href="' + m.url + '" target="_blank" rel="noopener">' + esc(m.name) + (m.time ? ' <small>' + esc(m.time) + '</small>' : '') + '</a>';
  }
  function cite(keys) {
    return '<p class="cite">Source: ' + keys.map(function (k) { var s = U.SOURCES[k]; return ext(s.url, esc(s.name)); }).join(' · ') + '</p>';
  }
  function store(key, val) {
    try { if (val === undefined) return JSON.parse(localStorage.getItem(key) || 'null'); localStorage.setItem(key, JSON.stringify(val)); } catch (e) { return null; }
  }
  function toast(msg) {
    var t = $('.toast') || document.body.appendChild(Object.assign(document.createElement('div'), { className: 'toast', role: 'status' }));
    t.textContent = msg; t.classList.add('show'); clearTimeout(t._t); t._t = setTimeout(function () { t.classList.remove('show'); }, 2400);
  }

  /* ---------- shell ---------- */
  var NAV = [
    ['home', 'index.html', 'Home'], ['process', 'process.html', 'Process'], ['discovery', 'discovery.html', 'Discovery'],
    ['framing', 'framing.html', 'Framing'], ['delivery', 'delivery.html', 'Delivery'], ['methods', 'methods.html', 'Methods']
  ];
  function header() {
    var modes = U.BOOTLEG.map(function (b) {
      return '<a href="' + b.page + '"' + (page === b.id ? ' aria-current="page"' : '') + '><span class="dot" style="background:' + b.color + '"></span>' + b.name + '</a>';
    }).join('');
    var links = NAV.map(function (n) { return '<a href="' + n[1] + '"' + (page === n[0] ? ' aria-current="page"' : '') + '>' + n[2] + '</a>'; }).join('');
    return '<a class="skip" href="#main">Skip to content</a><header class="site-header"><div class="wrap">' +
      '<a class="brand" href="index.html"><span class="brand-mark" aria-hidden="true">UX</span><b>' + esc(U.CONFIG.org) + '</b><span>UX Discovery</span></a>' +
      '<button class="menu-toggle" aria-expanded="false" aria-controls="nav">Menu</button>' +
      '<nav class="nav" id="nav" aria-label="Main">' + links +
      '<div class="dd"><button class="navbtn" aria-expanded="false">Design Thinking ▾</button><div class="dd-menu">' + modes + '</div></div>' +
      '<a href="checklist.html"' + (page === 'checklist' ? ' aria-current="page"' : '') + '>Checklist</a>' +
      '<a href="screensaver.html">Screensaver ↗</a></nav></div></header>';
  }
  function footer() {
    var S = U.SOURCES;
    return '<footer class="site-footer"><div class="wrap"><div class="cols">' +
      '<div><h4>The standard</h4><ul><li><a href="process.html">Process overview</a></li><li><a href="discovery.html">Problem Discovery</a></li><li><a href="framing.html">Solution Framing</a></li><li><a href="delivery.html">Moving into Delivery</a></li></ul></div>' +
      '<div><h4>Use it</h4><ul><li><a href="methods.html">Methods library</a></li><li><a href="checklist.html">Monthly checklist</a></li><li><a href="sharepoint.html">SharePoint set-up</a></li><li><a href="screensaver.html">Screensaver mode</a></li></ul></div>' +
      '<div><h4>Sources (only these)</h4><ul><li>' + ext(S.labs.url, 'Tanzu Labs — Guide to Product Discovery') + '</li><li>' + ext(S.pdm.url, 'Product Discovery Methods') + '</li><li>' + ext(S.bootleg.url, 'd.school Bootleg (via pdmethods.com)') + '</li></ul></div>' +
      '</div><div class="credit"><span>Built by <b>Puneet Arora</b> · for the ' + esc(U.CONFIG.org) + ' ' + esc(U.CONFIG.team) + '</span>' +
      '<span>Internal resource · visual cues from laerdal.com &amp; the public Life Design System pages · terminal content is illustrative</span></div></div></footer>';
  }
  function mountShell() {
    document.body.insertBefore(h(header()), app);
    app.id = 'main'; app.setAttribute('tabindex', '-1');
    document.body.appendChild(h(footer()));
    var tg = $('.menu-toggle'), nav = $('#nav');
    tg.addEventListener('click', function () { var o = nav.classList.toggle('open'); tg.setAttribute('aria-expanded', o); });
    var dd = $('.dd'), db = $('.dd .navbtn');
    db.addEventListener('click', function (e) { e.stopPropagation(); var o = dd.classList.toggle('open'); db.setAttribute('aria-expanded', o); });
    document.addEventListener('click', function () { dd.classList.remove('open'); db.setAttribute('aria-expanded', 'false'); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { dd.classList.remove('open'); nav.classList.remove('open'); } });
  }

  /* ---------- shared blocks ---------- */
  function rainBand(inner, cls) {
    return '<section class="band-dark ' + (cls || '') + '"><canvas class="rain" aria-hidden="true"></canvas>' + inner + '</section>';
  }
  function startRain(root) { $$('canvas.rain', root).forEach(function (c) { F.CodeRain(c); }); }
  function methodTicker() {
    var names = Object.keys(U.METHODS).map(function (k) { return U.METHODS[k]; });
    var items = names.map(function (m) { return '<span><b>›</b> ' + esc(m.name) + '</span>'; }).join('');
    return '<div class="ticker" aria-hidden="true"><div class="ticker-track">' + items + items + '</div></div>';
  }
  function splitSims(n) {
    var sims = U.allSims(), out = [];
    for (var i = 0; i < n; i++) out.push([]);
    sims.forEach(function (s, i) { out[i % n].push(s); });
    return out;
  }
  function phaseSims(ph) {
    var out = [];
    ph.areas.forEach(function (a) { a.activities.forEach(function (x) { out.push({ title: x.id + '.sim', stage: ph.name, lines: x.sim }); }); });
    return out;
  }
  function countMethods() { return Object.keys(U.METHODS).length; }

  /* ================= HOME ================= */
  function home() {
    var D = U.DISCOVERY, Fr = U.FRAMING;
    var nAct = phaseSims(D).length + phaseSims(Fr).length;
    app.appendChild(h(rainBand(
      '<div class="wrap hero"><div class="statusbar"><span class="live">simulation live</span><span><b>' + nAct + '</b> Discovery &amp; Framing activities</span><span><b>' + countMethods() + '</b> methods</span><span><b>2</b> sources · 0 guesses</span></div>' +
      '<p class="eyebrow">' + esc(U.CONFIG.org) + ' · UX Standard</p>' +
      '<h1>Discovery &amp; Framing, <em>running live.</em></h1>' +
      '<p class="lead">One shared way of working for every UX project: find the problem worth solving, then frame the smallest valuable solution. Built on the Tanzu Labs <i>Guide to Product Discovery</i> and the <i>Product Discovery Methods</i> library.</p>' +
      '<div class="btn-row"><a class="btn btn-primary" href="process.html">Take the process tour →</a><a class="btn btn-dark" href="checklist.html">Open this month’s checklist</a></div></div>' +
      '<div class="wrap" style="padding-bottom:56px"><div class="wall" id="wall"></div></div>' + methodTicker()
    )));
    startRain(app);
    var groups = splitSims(window.innerWidth < 700 ? 2 : 6);
    groups.forEach(function (g, i) { new F.Terminal($('#wall'), { scripts: g, height: 210, delay: i * 350 }); });

    var stages = [
      { n: '01', tag: 'Diverge → converge', cls: 'blue', title: D.name, href: 'discovery.html', body: D.goal, meta: D.duration },
      { n: '02', tag: 'Diverge → converge', cls: '', title: Fr.name, href: 'framing.html', body: Fr.goal, meta: Fr.duration },
      { n: '03', tag: 'Continuous', cls: 'red', title: 'Moving into Delivery', href: 'delivery.html', body: 'Start building with one validated feature and an initial backlog of user stories. Keep researching as you ship.', meta: 'Never “done”' }
    ];
    app.appendChild(h('<section class="section"><div class="wrap"><p class="eyebrow">The standard</p><h2>Three moves. Every project. Every month.</h2>' +
      '<p class="lead">The same rhythm whether we’re improving an existing product or starting from a blank page. Each step links to the activities, the methods to run them, and what “done” looks like.</p>' +
      '<div class="grid g3" style="margin-top:28px">' + stages.map(function (s) {
        return '<a class="card card-link stage-card reveal" href="' + s.href + '"><span class="num">' + s.n + '</span><span class="tag ' + s.cls + '">' + s.tag + '</span><h3>' + esc(s.title) + '</h3><p>' + esc(s.body) + '</p><p class="meta">' + esc(s.meta) + ' →</p></a>';
      }).join('') + '</div>' + cite(['labs']) + '</div></section>'));

    app.appendChild(h('<section class="section" style="padding-top:0"><div class="wrap split">' +
      '<div class="reveal"><p class="eyebrow">Inside every stage</p><h2>Five Design Thinking modes, on tap.</h2><p class="lead">The d.school Bootleg modes — Empathize, Define, Ideate, Prototype, Test — are the toolkits we reach for inside Discovery and Framing.</p><div class="modes">' +
      U.BOOTLEG.map(function (b) { return '<a class="mode-pill" href="' + b.page + '"><span class="dot" style="background:' + b.color + '"></span>' + b.name + '</a>'; }).join('') +
      '</div>' + cite(['bootleg']) + '</div><div class="mode-canvas reveal" style="min-height:320px"><canvas id="home-mode"></canvas><div class="overlay">ideate --flare · going wide before narrowing in</div></div></div></section>'));
    F.ModeCanvas($('#home-mode'), 'ideate');

    app.appendChild(h('<section class="section" style="padding-top:0"><div class="wrap"><div class="card reveal" style="display:grid;gap:24px;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));align-items:center">' +
      '<div><p class="eyebrow">Monthly ritual</p><h2 style="margin-bottom:10px">First working day of the month: run the checklist.</h2><p class="muted">Each project lead ticks off the Discovery &amp; Framing activities completed, links the evidence, and the team reviews progress together. The team’s shared record lives in a SharePoint List.</p><div class="btn-row"><a class="btn btn-primary" href="checklist.html">Open checklist</a><a class="btn btn-ghost" href="sharepoint.html">SharePoint set-up</a></div></div>' +
      '<div id="home-term"></div></div></div></section>'));
    new F.Terminal($('#home-term'), { script: { title: 'monthly-review.sh', stage: 'Checklist', lines: ['$ checklist open --month ' + new Date().toISOString().slice(0, 7), '> 18 activities · 3 projects', '# collecting evidence links|1500', '+ Discovery 7/7 · Framing 4/7', '! Lean experiments not yet run on 1 project', '$ share --brown-bag --friday', '= review booked · learnings shared', '~ 2000'] }, height: 230 });

    var S = U.SOURCES;
    app.appendChild(h('<section class="section" style="padding-top:0"><div class="wrap"><p class="eyebrow">Two sources. Nothing invented.</p><h2>Where every word in this portal comes from</h2><div class="sources" style="margin-top:22px">' +
      '<div class="card source reveal"><span class="s-ico">TL</span><div><h3>' + ext(S.labs.url, 'A Guide to Product Discovery') + '</h3><p class="muted">Tanzu Labs Practices · by ' + esc(S.labs.author) + '. The backbone: the stages, goals, activities, the balanced team, and moving into delivery.</p></div></div>' +
      '<div class="card source reveal"><span class="s-ico">PD</span><div><h3>' + ext(S.pdm.url, 'Product Discovery Methods') + '</h3><p class="muted">The toolbox: ' + countMethods() + ' methods across 9 discovery phases plus the d.school Design Thinking Bootleg, with timeboxes.</p></div></div>' +
      '</div></div></section>'));
  }

  /* ================= PROCESS ================= */
  function diamondSVG() {
    var D = U.DISCOVERY, Fr = U.FRAMING;
    var path = 'M40,210 L270,40 L500,210 L730,40 L960,210 L730,380 L500,210 L270,380 Z';
    return '<svg viewBox="0 0 1000 400" role="img" aria-labelledby="dd-t dd-d"><title id="dd-t">Double diamond</title><desc id="dd-d">Problem Discovery diverges then converges on one problem; Solution Framing diverges then converges on a starting point for delivery.</desc>' +
      '<defs><linearGradient id="gL" x1="0" x2="1"><stop offset="0" stop-color="#2E7FA1" stop-opacity=".25"/><stop offset="1" stop-color="#3FB8A0" stop-opacity=".08"/></linearGradient><linearGradient id="gR" x1="0" x2="1"><stop offset="0" stop-color="#3FB8A0" stop-opacity=".08"/><stop offset="1" stop-color="#5EA45E" stop-opacity=".25"/></linearGradient></defs>' +
      '<polygon points="40,210 270,40 500,210 270,380" fill="url(#gL)"/><polygon points="500,210 730,40 960,210 730,380" fill="url(#gR)"/>' +
      '<path id="ddpath" class="draw" d="' + path + '" fill="none" stroke="#3FB8A0" stroke-width="2.5" stroke-linejoin="round"/>' +
      '<line x1="270" y1="40" x2="270" y2="380" stroke="#1D3D36" stroke-dasharray="4 6"/><line x1="730" y1="40" x2="730" y2="380" stroke="#1D3D36" stroke-dasharray="4 6"/>' +
      '<text class="svg-tiny fade-node" x="270" y="24" text-anchor="middle">' + esc(D.name) + ' · 2–3 weeks</text><text class="svg-tiny fade-node" x="730" y="24" text-anchor="middle">' + esc(Fr.name) + '</text>' +
      '<text class="svg-label fade-node" x="270" y="216" text-anchor="middle" style="font-size:18px">Find the right problem</text><text class="svg-label fade-node" x="730" y="216" text-anchor="middle" style="font-size:18px">Frame the right start</text>' +
      '<circle cx="500" cy="210" r="13" fill="#E42313"/><text class="svg-label fade-node" x="500" y="246" text-anchor="middle">1 problem</text>' +
      '<circle cx="960" cy="210" r="13" fill="#E42313"/><text class="svg-label fade-node" x="985" y="246" text-anchor="end">→ delivery</text>' +
      (F.reduced ? '' : '<circle r="7" fill="#F3F1EA"><animateMotion dur="14s" repeatCount="indefinite" rotate="auto"><mpath href="#ddpath"/></animateMotion></circle><circle r="16" fill="none" stroke="#F3F1EA" stroke-opacity=".35"><animateMotion dur="14s" repeatCount="indefinite"><mpath href="#ddpath"/></animateMotion></circle>') +
      '</svg>';
  }
  function diamondCols() {
    var cols = [['diverge', ['Assumptions', 'Proto-personas', 'User research', 'Journey maps', 'Service blueprints']], ['converge', ['Research synthesis', 'Problem prioritisation']],
      ['diverge', ['Solution brainstorming', 'Design studios', 'Design critique']], ['converge', ['Solution prioritisation', 'Lean experiments', 'Lean business canvas', 'User stories']]];
    return '<div class="dd-cols">' + cols.map(function (c, i) { return '<div class="fade-node" style="transition-delay:' + (0.6 + i * 0.25) + 's"><span>' + c[0] + '</span><ul>' + c[1].map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul></div>'; }).join('') + '</div>';
  }
  function process() {
    var T = U.TEAM;
    app.appendChild(h('<section class="page-hero"><div class="wrap"><p class="eyebrow">Process</p><h1>The double diamond, as our standard.</h1>' +
      '<p class="lead">Product Discovery reduces the risk in a new idea <i>before</i> we build: learn enough to start a product that is valuable, usable and feasible. Two stages, each diverging then converging.</p></div></section>'));
    app.appendChild(h('<section><div class="wrap"><div class="diagram-wrap" data-inview>' + diamondSVG() + diamondCols() + '</div>' + cite(['labs']) + '</div></section>'));
    var path = $('#ddpath'); try { path.style.setProperty('--len', Math.ceil(path.getTotalLength())); } catch (e) { }
    F.reveal();

    app.appendChild(h('<section class="section"><div class="wrap split"><div class="reveal"><p class="eyebrow">Who takes part</p><h2>A balanced team, end to end.</h2><p class="lead">Discovery is a journey for a balanced team — not a hand-off from design to engineering.</p>' +
      '<div class="chips" style="margin:18px 0">' + T.roles.map(function (r) { return '<span class="chip">' + esc(r) + '</span>'; }).join('') + '</div>' +
      '<ul>' + T.why.map(function (w) { return '<li>' + esc(w) + '</li>'; }).join('') + '</ul>' +
      '<div class="callout green" style="margin-top:20px"><strong>' + esc(T.parallel.name) + ':</strong> ' + esc(T.parallel.detail) + ' ' + ext(T.parallel.url, 'Value stream map →') + '</div></div>' +
      '<div id="team-term" class="reveal"></div></div></section>'));
    new F.Terminal($('#team-term'), { script: { title: 'balanced-team.yml', stage: 'Kick-off', lines: ['$ team assemble --balanced', '> + product designer', '> + product manager', '> + engineers', '> + subject-matter experts', '> + technical architect', '> + end users', '+ range of perspectives: ON', '+ usable × feasible: ON', '= whole team aligned on why we build', '~ 2400'] }, height: 300 });

    var rows = U.PDM_PHASES.map(function (p) {
      var st = U.PDM_TO_LABS[p.id];
      return '<tr><td><a href="https://pdmethods.com/' + p.id + '/" target="_blank" rel="noopener">' + esc(p.name) + '</a></td><td><span class="stage ' + st + '" style="font:700 .72rem var(--font);letter-spacing:.1em;text-transform:uppercase;padding:4px 9px;border-radius:999px">' + (st === 'discovery' ? 'Problem Discovery' : 'Solution Framing') + '</span></td><td>' + p.methods.length + '</td></tr>';
    }).join('');
    app.appendChild(h('<section class="section" style="padding-top:0"><div class="wrap"><p class="eyebrow">How the two sources line up</p><h2>PD Methods phases inside our two stages</h2>' +
      '<p class="lead">Product Discovery Methods organises its toolbox into nine phases. This is how this portal places them inside the Tanzu Labs stages, so you know where to look.</p>' +
      '<div class="tbl-wrap reveal" style="margin-top:20px"><table class="tbl"><thead><tr><th>PD Methods phase</th><th>Our stage</th><th>Methods</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
      '<p class="cite">Mapping is this portal’s orientation aid; phase names and methods are from ' + ext(U.SOURCES.pdm.url, 'pdmethods.com') + '.</p></div></section>'));
  }

  /* ================= DISCOVERY / FRAMING ================= */
  function activityCard(a) {
    return '<article class="card activity reveal" id="' + a.id + '"><div class="a-body"><h3>' + esc(a.name) + '</h3>' +
      '<p>' + esc(a.goal) + '</p><dl class="facts"><dt>Who</dt><dd>' + esc(a.who) + '</dd><dt>Done when</dt><dd>' + esc(a.output) + '</dd></dl>' +
      '<p class="meta" style="margin-bottom:8px;font-weight:700;color:var(--ink)">Methods to run it</p><div class="chips">' + a.pdm.map(chip).join('') + '</div>' +
      '<p class="cite" style="margin-top:16px">' + ext(a.url, 'Tanzu Labs practice guide →') + '</p></div><div class="a-term" data-sim="' + a.id + '"></div></article>';
  }
  function stagePage(ph, next, prev, matrixCfg) {
    var acts = phaseSims(ph), mcount = {};
    ph.areas.forEach(function (ar) { ar.activities.forEach(function (a) { a.pdm.forEach(function (s) { mcount[s] = 1; }); }); });
    app.appendChild(h(rainBand('<div class="wrap hero split" style="padding-bottom:64px"><div><p class="eyebrow">' + esc(ph.kicker) + '</p><h1 style="font-size:clamp(2rem,4.6vw,3.6rem)">' + esc(ph.name) + '</h1><p class="lead">' + esc(ph.goal) + '</p>' +
      '<div class="kpis"><div class="kpi"><b style="color:var(--term-hi)">' + acts.length + '</b><span style="color:var(--term-dim)">activities</span></div><div class="kpi"><b style="color:var(--term-hi)">' + Object.keys(mcount).length + '</b><span style="color:var(--term-dim)">linked methods</span></div><div class="kpi"><b style="color:var(--term-hi);font-size:1.1rem;line-height:1.7">' + esc(ph.duration) + '</b><span style="color:var(--term-dim)">duration</span></div></div></div>' +
      '<div id="stage-term"></div></div>')));
    startRain(app);
    new F.Terminal($('#stage-term'), { scripts: acts, height: 300 });

    var body = '<section class="section" style="padding-top:40px"><div class="wrap"><div class="callout"><strong>Common pitfall:</strong> ' + esc(ph.pitfall) + '</div>';
    ph.areas.forEach(function (ar) {
      body += '<div class="area-title"><h2>' + esc(ar.name) + '</h2><span class="count">' + ar.activities.length + ' activit' + (ar.activities.length > 1 ? 'ies' : 'y') + '</span></div><div class="grid" style="gap:22px">' + ar.activities.map(activityCard).join('') + '</div>';
    });
    body += cite(['labs', 'pdm']) + '</div></section>';
    app.appendChild(h(body));
    var map = {}; ph.areas.forEach(function (ar) { ar.activities.forEach(function (a) { map[a.id] = a; }); });
    $$('.a-term').forEach(function (el) { var a = map[el.getAttribute('data-sim')]; new F.Terminal(el, { script: { title: a.id + '.sim', stage: ar0(ph, a), lines: a.sim }, foot: false }); });

    app.appendChild(h('<section class="section" style="padding-top:0"><div class="wrap split"><div class="reveal"><p class="eyebrow">' + esc(matrixCfg.eyebrow) + '</p><h2>' + esc(matrixCfg.title) + '</h2><p class="lead">' + esc(matrixCfg.lead) + '</p>' + cite(['labs']) + '</div><div id="m2"></div></div></section>'));
    F.Matrix2x2($('#m2'), matrixCfg);

    app.appendChild(h('<section class="section" style="padding-top:0"><div class="wrap"><div class="mode-nav"><a class="btn btn-ghost" href="' + prev[0] + '">← ' + prev[1] + '</a><a class="btn btn-primary" href="' + next[0] + '">' + next[1] + ' →</a></div></div></section>'));
  }
  function ar0(ph, a) { var n = ''; ph.areas.forEach(function (ar) { if (ar.activities.indexOf(a) > -1) n = ar.name; }); return n; }
  function discovery() {
    stagePage(U.DISCOVERY, ['framing.html', 'Solution Framing'], ['process.html', 'Process'], {
      eyebrow: 'Problem prioritisation', title: 'Agree on one problem — valuable and feasible.',
      lead: 'Rank problems by business and user value, then by feasibility with engineers in the room. Ruthlessly choosing one problem is a starting point, not a gamble: it ships faster and gives clearer data.',
      q: ['High value · hard', 'High value · feasible', 'Low value · hard', 'Low value · feasible'], y: 'value', x: 'feasibility',
      points: [{ id: 'P1', x: 78, y: 22, win: true }, { id: 'P2', x: 25, y: 18 }, { id: 'P3', x: 74, y: 70 }, { id: 'P4', x: 30, y: 74 }, { id: 'P5', x: 58, y: 38 }, { id: 'P6', x: 18, y: 42 }],
      scoring: 'team scoring value × feasibility…', result: '» P1 selected — highest value, feasible', aria: 'Animated 2 by 2 matrix: problems plotted by value and feasibility; P1 is selected'
    });
  }
  function framing() {
    stagePage(U.FRAMING, ['delivery.html', 'Moving into Delivery'], ['discovery.html', 'Problem Discovery'], {
      eyebrow: 'Solution prioritisation', title: 'Find the high-value, low-complexity start.',
      lead: 'Weigh user and business value against technical complexity. If a complex element is essential and risky, build a proof of concept — the core functionality pared to its simplest form.',
      q: ['High value · complex → PoC?', 'High value · simple', 'Low value · complex', 'Low value · simple'], y: 'value', x: 'simplicity',
      points: [{ id: 'S1', x: 34, y: 66 }, { id: 'S2', x: 80, y: 20, win: true }, { id: 'S3', x: 70, y: 72 }, { id: 'S4', x: 60, y: 36 }, { id: 'S5', x: 22, y: 20 }],
      scoring: 'weighing value × complexity…', result: '» S2 = starting point · S5 → proof of concept', aria: 'Animated 2 by 2 matrix: solutions by value and simplicity; S2 is selected'
    });
  }

  /* ================= DELIVERY ================= */
  function delivery() {
    var Dl = U.DELIVERY;
    app.appendChild(h('<section class="page-hero"><div class="wrap"><p class="eyebrow">Stage 3 · Continuous</p><h1>Moving into Delivery</h1><p class="lead">' + esc(Dl.goal) + ' Enough to start is enough.</p></div></section>'));
    app.appendChild(h('<section><div class="wrap grid g2">' + Dl.entry.map(function (e, i) {
      return '<div class="card reveal"><span class="tag" style="display:inline-block;font:700 .72rem var(--font);letter-spacing:.1em;text-transform:uppercase;padding:4px 9px;border-radius:999px;background:var(--red-tint);color:var(--red-ink);margin-bottom:10px">Entry criterion ' + (i + 1) + '</span><h3>' + esc(e) + '</h3></div>';
    }).join('') + '</div></section>'));
    app.appendChild(h(rainBand('<div class="wrap section split"><div><p class="eyebrow">The loop that never stops</p><h2>Research doesn’t end when delivery starts.</h2><p class="lead">' + esc(Dl.note) + '</p><div class="btn-row">' +
      Dl.links.map(function (l) { return '<a class="btn btn-dark" href="' + l.url + '" target="_blank" rel="noopener">' + esc(l.name) + ' ↗</a>'; }).join('') + '</div>' + '<p class="cite" style="color:var(--term-dim)">Source: ' + ext(U.SOURCES.labs.url, 'Tanzu Labs — Guide to Product Discovery') + '</p></div>' +
      '<div class="loop" id="loop" role="img" aria-label="Continuous loop: ' + Dl.loop.join(', ') + '"><div class="ring"></div><div class="comet"></div><div class="core">validated<br>feature</div></div></div>')));
    startRain(app);
    var loop = $('#loop'), pos = [[50, 10], [84, 50], [50, 90], [16, 50]];
    Dl.loop.forEach(function (t, i) {
      var n = document.createElement('div'); n.className = 'node'; n.textContent = t;
      n.style.left = pos[i][0] + '%'; n.style.top = pos[i][1] + '%';
      loop.appendChild(n);
    });
    if (!F.reduced) { var k = 0, nodes = $$('.node', loop), g = new F.Gate(loop); setInterval(function () { if (!g.on()) return; nodes.forEach(function (n, i) { n.classList.toggle('on', i === k % 4); }); k++; }, 1500); }

    var cols = [['Backbone', ['Prepare session', 'Run scenario', 'Debrief', 'Share summary']], ['Release 1', ['Pick template', 'Auto-capture timeline', 'Guided debrief', 'One-tap share']], ['Release 2', ['Learner self-check', 'Highlight missed steps', 'Confidence slider']], ['Later', ['Team trends', 'Export to LMS']]];
    app.appendChild(h('<section class="section"><div class="wrap split"><div class="reveal"><p class="eyebrow">From framing to backlog</p><h2>An initial backlog of user stories.</h2><p class="lead">The story map turns the validated feature into thin, shippable slices — then user feedback re-orders it.</p><p class="cite">Illustrative example. Practice: ' + ext('https://labspractices.com/practices/user-stories/', 'Tanzu Labs — User Stories') + '</p></div>' +
      '<div class="diagram-wrap" id="sm"><div class="storymap">' + cols.map(function (c, ci) {
        return '<div class="col"><h4>' + esc(c[0]) + '</h4>' + c[1].map(function (s) { return '<div class="story ' + (ci === 0 ? 'r1' : ci === 1 ? '' : 'r2') + '">' + esc(s) + '</div>'; }).join('') + '</div>';
      }).join('') + '</div></div></div></section>'));
    var sm = $('#sm'), gate = new F.Gate(sm), stories = $$('.story', sm);
    if (F.reduced) { stories.forEach(function (s) { s.classList.add('in'); }); }
    else (async function () { while (true) { await gate.wait(); for (var i = 0; i < stories.length; i++) { stories[i].classList.add('in'); await F.sleep(220); } await F.sleep(5000); stories.forEach(function (s) { s.classList.remove('in'); }); await F.sleep(900); } })();
  }

  /* ================= METHODS ================= */
  function methods() {
    var blocks = U.PDM_PHASES.map(function (p) { return { id: p.id, name: p.name, stage: U.PDM_TO_LABS[p.id], methods: p.methods, src: 'https://pdmethods.com/' + p.id + '/' }; })
      .concat(U.BOOTLEG.map(function (b) { return { id: b.id, name: 'Design Thinking · ' + b.name, stage: 'bootleg', methods: b.methods, src: b.src, color: b.color }; }));
    app.appendChild(h('<section class="page-hero"><div class="wrap split"><div><p class="eyebrow">Methods library</p><h1>' + countMethods() + ' methods. One search box.</h1><p class="lead">Every method from Product Discovery Methods, grouped by its nine phases, plus the five Design Thinking Bootleg modes. Each card links to the full how-to.</p></div><div id="search-term"></div></div></section>'));
    var st = new F.Terminal($('#search-term'), { script: { title: 'pdm search', stage: 'Library', lines: ['$ pdm list --phases', '> 9 phases · 5 design-thinking modes', '+ ' + countMethods() + ' unique methods indexed', '$ pdm search --interactive', '~ 600000'] }, height: 180, foot: false, clear: false });
    app.appendChild(h('<section><div class="wrap"><div class="toolbar"><label class="search"><span class="sr-only">Search methods</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg><input id="q" type="search" placeholder="Search e.g. “voting”, “interview”, “prototype”" autocomplete="off"></label>' +
      '<div role="group" aria-label="Filter by stage" style="display:flex;gap:8px;flex-wrap:wrap"><button class="filter" data-f="all" aria-pressed="true">All</button><button class="filter" data-f="discovery" aria-pressed="false">Problem Discovery</button><button class="filter" data-f="framing" aria-pressed="false">Solution Framing</button><button class="filter" data-f="bootleg" aria-pressed="false">Design Thinking</button></div></div>' +
      '<p id="count" class="muted" aria-live="polite"></p><div id="lib"></div>' + cite(['pdm', 'bootleg']) + '</div></section>'));
    var q = $('#q'), lib = $('#lib'), filt = 'all', lastQ = '', tmr;
    function render() {
      var term = q.value.trim().toLowerCase(), total = 0, html = '';
      blocks.forEach(function (b) {
        if (filt !== 'all' && b.stage !== filt) return;
        var ms = b.methods.map(U.m).filter(function (m) { return !term || (m.name + ' ' + m.desc).toLowerCase().indexOf(term) > -1; });
        if (!ms.length) return; total += ms.length;
        var tag = b.stage === 'bootleg' ? '<span class="stage" style="background:#F1ECF7;color:#5B3F86">Design Thinking</span>' : '<span class="stage ' + b.stage + '">' + (b.stage === 'discovery' ? 'Problem Discovery' : 'Solution Framing') + '</span>';
        html += '<div class="phase-block"><div class="phase-head">' + (b.color ? '<span class="dot" style="background:' + b.color + ';width:14px;height:14px"></span>' : '') + '<h2>' + esc(b.name) + '</h2>' + tag + '<a class="muted" style="font-size:.85rem" href="' + b.src + '" target="_blank" rel="noopener">phase guide ↗</a></div><div class="mgrid">' +
          ms.map(function (m, i) { return '<a class="method" style="animation-delay:' + Math.min(i * 30, 400) + 'ms" href="' + m.url + '" target="_blank" rel="noopener"><b>' + esc(m.name) + '</b><p>' + esc(m.desc) + '</p>' + (m.time ? '<span class="time">' + esc(m.time) + '</span>' : '') + '</a>'; }).join('') + '</div></div>';
      });
      lib.innerHTML = html || '<div class="empty">No methods match “' + esc(term) + '”. Try a broader word.</div>';
      var uniq = {}; lib.querySelectorAll('.method b').forEach(function (b) { uniq[b.textContent] = 1; });
      $('#count').textContent = Object.keys(uniq).length + ' unique methods · ' + total + ' cards (some methods appear in several phases)';
      if (term !== lastQ && term) { clearTimeout(tmr); tmr = setTimeout(function () { st.line('cmd', esc('grep -i "' + term + '"')); st.line(total ? 'ok' : 'err', total + ' match' + (total === 1 ? '' : 'es')); }, 350); }
      lastQ = term;
    }
    q.addEventListener('input', render);
    $$('.filter').forEach(function (b) { b.addEventListener('click', function () { filt = b.getAttribute('data-f'); $$('.filter').forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); render(); }); });
    render();
  }

  /* ================= DESIGN THINKING MODES ================= */
  function mode(id) {
    var B = U.BOOTLEG, i = B.findIndex(function (b) { return b.id === id; }), b = B[i];
    var prev = B[(i + B.length - 1) % B.length], next = B[(i + 1) % B.length];
    document.documentElement.style.setProperty('--mode-c', b.color);
    var pills = B.map(function (x) { return '<a class="mode-pill" href="' + x.page + '"' + (x.id === id ? ' aria-current="page"' : '') + '><span class="dot" style="background:' + x.color + '"></span>' + x.name + '</a>'; }).join('');
    app.appendChild(h('<section class="page-hero"><div class="wrap"><nav class="modes" aria-label="Design Thinking modes">' + pills + '</nav><p class="eyebrow" style="color:' + b.color + '">Design Thinking · mode ' + (i + 1) + ' of 5</p><h1>' + esc(b.name) + '</h1><p class="lead">' + esc(b.lead) + '</p>' +
      '<div class="verbs">' + b.verbs.map(function (v) { return '<div class="verb reveal"><b>' + esc(v[0]) + '</b><span class="muted">' + esc(v[1]) + '</span></div>'; }).join('') + '</div></div></section>'));
    var visual = id === 'test' ? '<div class="diagram-wrap" id="viz"></div>' : '<div class="mode-canvas"><canvas id="viz"></canvas><div class="overlay" id="viz-ov"></div></div>';
    app.appendChild(h('<section><div class="wrap split">' + visual + '<div id="mode-term"></div></div></section>'));
    if (id === 'test') {
      F.FeedbackMatrix($('#viz'), [[0, 'clear entry point'], [1, 'show what I missed'], [2, 'who sees this?'], [3, 'confidence slider'], [0, 'fast to share'], [1, 'fewer steps'], [3, 'peer comparison']]);
    } else {
      F.ModeCanvas($('#viz'), id, b.color.indexOf('var(') === 0 ? getComputedStyle(document.documentElement).getPropertyValue(b.color.slice(4, -1)).trim() : b.color);
      var ov = { empathize: ['observe · engage · immerse', '“I never know if they really got it.”', 'capture quotes, behaviours, surprises'], define: ['many findings → one Point of View', 'USER + NEED + INSIGHT', 'How might we…?'], ideate: ['going wide: fluency × flexibility', 'defer judgement · build on others', 'flare first, focus later'], prototype: ['low-res, fast, cheap', 'one variable at a time', 'learn → reshape → repeat'] }[id];
      var ovEl = $('#viz-ov'), k = 0; ovEl.textContent = ov[0];
      if (!F.reduced) setInterval(function () { k = (k + 1) % ov.length; ovEl.textContent = ov[k]; }, 3500);
    }
    new F.Terminal($('#mode-term'), { script: { title: b.id + '.mode', stage: b.name, lines: b.sim }, height: 300 });
    app.appendChild(h('<section class="section" style="padding-top:48px"><div class="wrap"><div class="phase-head"><h2>' + b.methods.length + ' tools &amp; methods</h2><a class="muted" style="font-size:.85rem" href="' + b.src + '" target="_blank" rel="noopener">How to ' + b.name.toLowerCase() + ' ↗</a></div><div class="mgrid">' +
      b.methods.map(U.m).map(function (m, j) { return '<a class="method" style="animation-delay:' + j * 40 + 'ms" href="' + m.url + '" target="_blank" rel="noopener"><b>' + esc(m.name) + '</b><p>' + esc(m.desc) + '</p></a>'; }).join('') + '</div>' + cite(['bootleg']) +
      '<div class="mode-nav"><a class="btn btn-ghost" href="' + prev.page + '">← ' + prev.name + '</a><a class="btn btn-primary" href="' + next.page + '">' + next.name + ' →</a></div></div></section>'));
  }

  /* ================= CHECKLIST ================= */
  function checklist() {
    var items = U.CHECKLIST, now = new Date();
    var defMonth = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
    var meta = store('ux-ck-meta') || {};
    var spUrl = U.CONFIG.sharepointListUrl || store('ux-sp-url') || '';
    app.appendChild(h('<section class="page-hero"><div class="wrap ck-head"><div><p class="eyebrow">Monthly checklist</p><h1>Did we follow the standard this month?</h1>' +
      '<p class="lead">One checklist per project per month. Tick what the team completed, link the evidence, and bring it to the monthly review. The shared record lives in the team’s SharePoint List. This page is your guided working copy (saved in this browser only).</p></div>' +
      '<div class="ring" id="ring"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" fill="none" stroke="#E6E5E4" stroke-width="12"/><circle id="ring-c" cx="60" cy="60" r="52" fill="none" stroke="#5EA45E" stroke-width="12" stroke-linecap="round" stroke-dasharray="326.7" stroke-dashoffset="326.7"/></svg><div class="val"><span><span id="pct">0%</span><small id="frac">0 / 0</small></span></div></div></div></section>'));
    app.appendChild(h('<section><div class="wrap"><div class="ck-controls no-print">' +
      '<label class="field">Month<input type="month" id="month" value="' + (meta.month || defMonth) + '"></label>' +
      '<label class="field">Project<input id="project" placeholder="e.g. Project name" value="' + esc(meta.project || '') + '"></label>' +
      '<label class="field">Owner<input id="owner" placeholder="Your name" value="' + esc(meta.owner || '') + '"></label>' +
      '<div class="btn-row"><button class="btn btn-primary btn-sm" id="csv">Export CSV</button><button class="btn btn-ghost btn-sm" id="print">Print / PDF</button><button class="btn btn-ghost btn-sm" id="team">Open team List ↗</button><button class="btn btn-ghost btn-sm" id="reset">Reset month</button></div></div>' +
      '<details class="no-print card" style="padding:14px 18px;margin-bottom:10px" id="spbox"><summary style="cursor:pointer;font-weight:700">SharePoint List link</summary><p class="muted" style="margin:10px 0">Paste the URL of your team’s “UX Monthly Checklist” List once. It is saved in this browser. To set it for everyone, edit <code>sharepointListUrl</code> in <code>assets/js/data.js</code>. New here? See the ' + '<a href="sharepoint.html">SharePoint set-up guide</a>.</p><div style="display:flex;gap:8px;flex-wrap:wrap"><input id="spurl" style="flex:1 1 320px;padding:10px 12px;border:1px solid var(--line);border-radius:10px;font:inherit" placeholder="https://<tenant>.sharepoint.com/sites/<site>/Lists/UX%20Monthly%20Checklist" value="' + esc(spUrl) + '"><button class="btn btn-primary btn-sm" id="spsave">Save link</button></div></details>' +
      '<div id="groups"></div></div></section>'));

    function key() { return 'ux-ck:' + $('#month').value + ':' + ($('#project').value.trim().toLowerCase() || 'default'); }
    function state() { return store(key()) || {}; }
    function save(s) { store(key(), s); }
    function saveMeta() { store('ux-ck-meta', { month: $('#month').value, project: $('#project').value, owner: $('#owner').value }); }
    function render() {
      var s = state(), groups = {}, order = [];
      items.forEach(function (it) { if (!groups[it.stage]) { groups[it.stage] = []; order.push(it.stage); } groups[it.stage].push(it); });
      $('#groups').innerHTML = order.map(function (g) {
        var done = groups[g].filter(function (it) { return s[it.id] && s[it.id].done; }).length;
        return '<div class="ck-group"><h2>' + esc(g) + ' <span class="count">' + done + '/' + groups[g].length + '</span></h2>' + groups[g].map(function (it) {
          var st = s[it.id] || {};
          return '<div class="ck-item' + (st.done ? ' done' : '') + '" data-id="' + it.id + '"><input type="checkbox" class="ck-box" id="c-' + it.id + '"' + (st.done ? ' checked' : '') + '>' +
            '<div><label class="ck-title" for="c-' + it.id + '">' + esc(it.title) + '</label><div class="ck-sub">' + esc(it.area) + ' · Done when: ' + esc(it.done) + '</div><div class="chips" style="margin-top:6px">' + it.methods.map(chip).join('') + ' <a class="chip" href="' + it.guide + '" target="_blank" rel="noopener">Guide ↗</a></div></div>' +
            '<div class="ck-evidence"><input type="url" placeholder="Evidence link (Miro, Figma, SharePoint…)" aria-label="Evidence link for ' + esc(it.title) + '" value="' + esc(st.evidence || '') + '"></div></div>';
        }).join('') + '</div>';
      }).join('');
      progress();
    }
    function progress() {
      var s = state(), n = items.length, d = items.filter(function (it) { return s[it.id] && s[it.id].done; }).length, p = n ? d / n : 0;
      $('#ring-c').style.strokeDashoffset = 326.7 * (1 - p);
      $('#pct').textContent = Math.round(p * 100) + '%'; $('#frac').textContent = d + ' / ' + n;
      $$('.ck-group').forEach(function (g) { var its = $$('.ck-item', g); $('.count', g).textContent = its.filter(function (x) { return x.classList.contains('done'); }).length + '/' + its.length; });
    }
    $('#groups').addEventListener('change', function (e) {
      var row = e.target.closest('.ck-item'); if (!row) return;
      var s = state(), id = row.getAttribute('data-id'); s[id] = s[id] || {};
      if (e.target.classList.contains('ck-box')) { s[id].done = e.target.checked; row.classList.toggle('done', e.target.checked); if (e.target.checked) toast('✓ ' + row.querySelector('.ck-title').textContent); }
      else { s[id].evidence = e.target.value.trim(); }
      save(s); progress();
    });
    ['month', 'project', 'owner'].forEach(function (id) { $('#' + id).addEventListener('change', function () { saveMeta(); render(); }); });
    $('#print').addEventListener('click', function () { window.print(); });
    $('#reset').addEventListener('click', function () { if (confirm('Clear all ticks and evidence for this month and project?')) { save({}); render(); toast('Month reset'); } });
    $('#spsave').addEventListener('click', function () { var v = $('#spurl').value.trim(); store('ux-sp-url', v); spUrl = v; toast(v ? 'List link saved' : 'List link cleared'); });
    $('#team').addEventListener('click', function () {
      if (spUrl) window.open(spUrl, '_blank', 'noopener'); else { $('#spbox').open = true; $('#spurl').focus(); toast('Paste your SharePoint List link first'); }
    });
    $('#csv').addEventListener('click', function () {
      var s = state(), m = $('#month').value, p = $('#project').value, o = $('#owner').value;
      var rows = [['Title', 'Month', 'Project', 'Owner', 'Stage', 'Area', 'DoneCriteria', 'Status', 'Evidence', 'Guide']];
      items.forEach(function (it) { var st = s[it.id] || {}; rows.push([it.title, m, p, o, it.stage, it.area, it.done, st.done ? 'Done' : 'Not started', st.evidence || '', it.guide]); });
      var csv = '﻿' + rows.map(function (r) { return r.map(function (c) { return '"' + String(c).replace(/"/g, '""') + '"'; }).join(','); }).join('\r\n');
      var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
      a.download = 'ux-checklist-' + m + (p ? '-' + p.replace(/[^\w-]+/g, '_') : '') + '.csv'; document.body.appendChild(a); a.click(); a.remove();
      toast('CSV exported');
    });
    render();
  }

  /* ================= SHAREPOINT GUIDE ================= */
  function sharepoint() {
    var cols = [['Title', 'Single line of text', 'Activity name (built-in column)'], ['Stage', 'Choice', 'Problem Discovery · Solution Framing · Moving into Delivery · Team rituals'], ['Area', 'Single line of text', 'e.g. Understand users'], ['DoneCriteria', 'Multiple lines of text', 'What “done” looks like'], ['Guide', 'Hyperlink', 'Link to the source practice / method'],
      ['Month', 'Single line of text', 'yyyy-MM (Monthly list only)'], ['Project', 'Single line of text', 'Monthly list only'], ['Owner', 'Person', 'Monthly list only'], ['Status', 'Choice', 'Not started · In progress · Done · Not applicable'], ['Evidence', 'Hyperlink', 'Link to Miro / Figma / SharePoint file']];
    app.appendChild(h('<section class="page-hero"><div class="wrap"><p class="eyebrow">SharePoint set-up · ~30 minutes, once</p><h1>Make the checklist a live, shared team record.</h1>' +
      '<p class="lead">A Microsoft List holds everyone’s ticks with Microsoft 365 permissions. A Power Automate flow copies a fresh checklist into it on the 1st of every month. No IT app registration is needed. Standard Microsoft Lists and Power Automate licences are enough.</p>' +
      '<div class="callout" style="margin-top:20px"><strong>Honest note:</strong> these steps follow the standard Microsoft Lists and Power Automate UI. Menu names can differ slightly by tenant and version, and I couldn’t run them in your tenant, so do a test run (step 5) before you rely on it.</div></div></section>'));
    var steps = [
      ['Create the template List from CSV', '<ol><li>Download <a href="sharepoint/ux-checklist-template.csv" download>ux-checklist-template.csv</a> (' + U.CHECKLIST.length + ' activities, from this portal).</li><li>In your UX team SharePoint site: <b>New → List → From CSV</b>, upload the file and name the list <code>UX Checklist Template</code>.</li><li>Check the column types match the table below (set <code>Stage</code> to Choice and <code>Guide</code> to Hyperlink).</li></ol>'],
      ['Create the monthly List', '<ol><li><b>New → List → From existing list</b>, pick <code>UX Checklist Template</code>, and name it <code>UX Monthly Checklist</code>.</li><li>Add the columns <code>Month</code>, <code>Project</code>, <code>Owner</code> (Person), <code>Status</code> (Choice, default “Not started”) and <code>Evidence</code> (Hyperlink).</li><li>Create a view <b>This month</b>: filter <code>Month</code> = the current month, and group by <code>Project</code> then <code>Stage</code>.</li></ol>'],
      ['Build the monthly flow in Power Automate', '<ol><li><b>Create → Scheduled cloud flow</b>: repeat every <b>1 Month</b>, starting on the 1st at 07:00, time zone <b>(UTC+01:00) Oslo</b>.</li><li>Add <b>SharePoint – Get items</b>: your site, List <code>UX Checklist Template</code>.</li><li>Add <b>Apply to each</b> over <code>value</code>, and inside it add <b>SharePoint – Create item</b> in <code>UX Monthly Checklist</code>. Map Title, Stage, Area, DoneCriteria and Guide from the template item. Set <code>Status</code> = Not started and <code>Month</code> to this expression:</li></ol><pre class="code">formatDateTime(convertTimeZone(utcNow(),\'UTC\',\'W. Europe Standard Time\'),\'yyyy-MM\')</pre><p class="muted">One row per activity per month. For several projects, either add an outer <b>Apply to each</b> over an array of project names and set <code>Project</code> from it, or let leads duplicate rows.</p>'],
      ['Point the portal at the List', '<p>Copy the browser URL of <code>UX Monthly Checklist</code>. Either paste it on the <a href="checklist.html">Checklist</a> page (saved per browser), or set <code>sharepointListUrl</code> in <code>assets/js/data.js</code> so everyone’s “Open team List” button works.</p>'],
      ['Test once, then make it a ritual', '<ol><li>In the flow, use <b>Test → Manually</b> and check that ' + U.CHECKLIST.length + ' rows appear with this month’s <code>Month</code>.</li><li>Monthly review: each lead sets <code>Status</code> and links <code>Evidence</code>, then share learnings in a ' + ext('https://pdmethods.com/brown-bag-sharing-session/', 'Brown Bag Sharing Session') + ' and record a ' + ext('https://pdmethods.com/go-no-go-decision/', 'Go/No-Go decision') + '.</li></ol>']
    ];
    app.appendChild(h('<section class="section" style="padding-top:20px"><div class="wrap"><div class="steps">' + steps.map(function (s) { return '<div class="step reveal"><h3>' + s[0] + '</h3>' + s[1] + '</div>'; }).join('') + '</div>' +
      '<h2 style="margin-top:48px">Columns</h2><div class="tbl-wrap"><table class="tbl"><thead><tr><th>Column</th><th>Type</th><th>Notes</th></tr></thead><tbody>' + cols.map(function (c) { return '<tr><td><code>' + c[0] + '</code></td><td>' + c[1] + '</td><td>' + c[2] + '</td></tr>'; }).join('') + '</tbody></table></div></div></section>'));
  }

  /* ================= SCREENSAVER ================= */
  function screensaver() {
    var params = new URLSearchParams(location.search);
    var ss = params.get('ss') === '1';
    var secs = Math.max(10, +params.get('interval') || U.CONFIG.screensaverSceneSeconds);
    var only = params.get('scene');
    document.body.classList.add('ss');
    if (ss) document.body.style.cursor = 'none';
    var quotes = [
      ['Test as if you know you’re wrong.', 'd.school Bootleg · Test'],
      ['Agree on a single problem that is both highly valuable and feasible.', 'Tanzu Labs · Problem Discovery'],
      ['Stay focused on needs, challenges and behaviours.', 'Tanzu Labs · Problem Discovery'],
      ['Validate the riskiest “leap of faith” assumptions — quickest, cheapest way.', 'Tanzu Labs · Lean Experiments'],
      ['Empathy is the foundation of human-centred design.', 'd.school Bootleg · Empathize'],
      ['User research does not stop as you begin delivering software.', 'Tanzu Labs · Moving into Delivery']
    ];
    var html = '<div class="ss-stage">' +
      '<section class="scene" data-s="wall"><canvas class="rain"></canvas><div class="ss-pad"><div class="ss-title">Discovery &amp; Framing — <span>simulation wall</span></div><div class="wall" id="ss-wall"></div></div></section>' +
      '<section class="scene" data-s="diamond"><div class="ss-pad ss-center"><div class="ss-title">The double diamond — <span>our standard</span></div><div class="diagram-wrap is-in" style="width:min(1200px,92vw)">' + diamondSVG() + diamondCols() + '</div></div></section>' +
      '<section class="scene" data-s="matrix"><canvas class="rain"></canvas><div class="ss-pad ss-split"><div><div class="ss-title">Prioritise <span>ruthlessly</span></div><div id="ss-m2"></div></div><div id="ss-mterm"></div></div></section>' +
      '<section class="scene" data-s="ideate"><canvas id="ss-ideate" style="position:absolute;inset:0;width:100%;height:100%"></canvas><div class="ss-pad" style="display:flex;flex-direction:column;justify-content:space-between;align-items:center"><div class="ss-title" style="text-align:center">Ideate — <span>flare before you focus</span></div><div class="ss-modes">' + U.BOOTLEG.map(function (b) { return '<span class="mode-pill"><span class="dot" style="background:' + b.color + '"></span>' + b.name + '</span>'; }).join('') + '</div></div></section>' +
      '<section class="scene" data-s="quote"><canvas class="rain"></canvas><div class="ss-pad ss-center"><blockquote class="ss-quote" id="ss-q"></blockquote></div></section>' +
      '<section class="scene" data-s="test"><div class="ss-pad ss-split"><div><div class="ss-title">Feedback capture <span>matrix</span></div><div id="ss-fcm"></div></div><div id="ss-tterm"></div></div></section>' +
      '</div><div class="ss-brand"><span class="brand-mark">UX</span> ' + esc(U.CONFIG.org) + ' · UX Discovery Standard</div><div class="ss-clock" id="ss-clock"></div>' +
      (ss ? '' : '<div class="ss-hint" id="ss-hint">Preview mode · <b>F11</b> full screen · <b>→</b> next scene · <b>Esc</b> back to portal</div>');
    app.innerHTML = html;
    var dpath = $('#ddpath'); try { dpath.style.setProperty('--len', Math.ceil(dpath.getTotalLength())); } catch (e) { }

    var built = {};
    function build(s) {
      if (built[s]) return; built[s] = true;
      var sc = $('.scene[data-s="' + s + '"]');
      $$('canvas.rain', sc).forEach(function (c) { F.CodeRain(c, { size: 18 }); });
      if (s === 'wall') splitSims(window.innerWidth < 900 ? 2 : 6).forEach(function (g, i) { new F.Terminal($('#ss-wall'), { scripts: g, height: Math.max(120, Math.floor((window.innerHeight - 241) / 2) - 84), delay: i * 300 }); });
      if (s === 'matrix') {
        F.Matrix2x2($('#ss-m2'), { q: ['High value · hard', 'High value · feasible', 'Low value · hard', 'Low value · feasible'], y: 'value', x: 'feasibility', points: [{ id: 'P1', x: 78, y: 22, win: true }, { id: 'P2', x: 25, y: 18 }, { id: 'P3', x: 74, y: 70 }, { id: 'P4', x: 30, y: 74 }, { id: 'P5', x: 58, y: 38 }], result: '» P1 selected — highest value, feasible' });
        new F.Terminal($('#ss-mterm'), { scripts: phaseSims(U.DISCOVERY).concat(phaseSims(U.FRAMING)), height: Math.floor(window.innerHeight * 0.55) });
      }
      if (s === 'ideate') F.ModeCanvas($('#ss-ideate'), 'ideate');
      if (s === 'test') {
        F.FeedbackMatrix($('#ss-fcm'), [[0, 'clear entry point'], [1, 'show what I missed'], [2, 'who sees this?'], [3, 'confidence slider'], [0, 'fast to share'], [1, 'fewer steps'], [3, 'peer comparison']]);
        new F.Terminal($('#ss-tterm'), { scripts: U.BOOTLEG.map(function (b) { return { title: b.id + '.mode', stage: b.name, lines: b.sim }; }), height: Math.floor(window.innerHeight * 0.55) });
      }
    }
    var qi = Math.floor(Math.random() * quotes.length);
    function showQuote() { var q = quotes[qi++ % quotes.length]; $('#ss-q').innerHTML = '<p>' + esc(q[0]) + '</p><cite>— ' + esc(q[1]) + '</cite>'; }
    var scenes = $$('.scene').map(function (s) { return s.getAttribute('data-s'); }), cur = null, bag = [];
    function nextName() {
      if (only && scenes.indexOf(only) > -1) return only;
      if (!bag.length) { bag = scenes.slice().sort(function () { return Math.random() - 0.5; }); if (bag[0] === cur) bag.push(bag.shift()); }
      return bag.shift();
    }
    function show(name) {
      var old = cur && $('.scene[data-s="' + cur + '"]'), nw = $('.scene[data-s="' + name + '"]');
      if (old && old !== nw) { old.classList.remove('on'); setTimeout(function () { if (!old.classList.contains('on')) old.style.display = 'none'; }, 1200); }
      nw.style.display = 'block'; void nw.offsetWidth; build(name);
      window.dispatchEvent(new Event('resize'));
      nw.classList.add('on'); cur = name;
      if (name === 'quote') showQuote();
    }
    show(nextName());
    var timer = setInterval(function () { show(nextName()); }, secs * 1000);
    function clock() { var d = new Date(); $('#ss-clock').innerHTML = '<b>' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + '</b>' + d.toLocaleDateString([], { weekday: 'long', day: 'numeric', month: 'long' }); }
    clock(); setInterval(clock, 15000);

    // Exit handling: in the Windows wrapper (?ss=1) any input closes the screensaver.
    var t0 = Date.now(), origin = null;
    function exit() { if (window.chrome && window.chrome.webview) window.chrome.webview.postMessage('exit'); }
    if (ss) {
      ['keydown', 'mousedown', 'touchstart', 'wheel'].forEach(function (ev) { window.addEventListener(ev, exit, { passive: true }); });
      window.addEventListener('mousemove', function (e) {
        if (Date.now() - t0 < 1500) return;
        if (!origin) { origin = [e.screenX, e.screenY]; return; }
        if (Math.abs(e.screenX - origin[0]) + Math.abs(e.screenY - origin[1]) > 12) exit();
      });
    } else {
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') location.href = 'index.html';
        if (e.key === 'ArrowRight') { clearInterval(timer); show(nextName()); timer = setInterval(function () { show(nextName()); }, secs * 1000); }
      });
      setTimeout(function () { var hn = $('#ss-hint'); if (hn) hn.style.opacity = '0'; }, 6000);
    }
  }

  /* ---------- boot ---------- */
  var routes = { home: home, process: process, discovery: discovery, framing: framing, delivery: delivery, methods: methods, checklist: checklist, sharepoint: sharepoint, screensaver: screensaver };
  try {
    if (page !== 'screensaver') mountShell();
    if (routes[page]) routes[page]();
    else if (U.BOOTLEG.some(function (b) { return b.id === page; })) mode(page);
    F.reveal();
  } catch (err) {
    console.error(err);
    app.insertAdjacentHTML('beforeend', '<div class="wrap section"><div class="callout"><strong>Something went wrong rendering this page.</strong> ' + esc(err.message) + '</div></div>');
  }
})();
