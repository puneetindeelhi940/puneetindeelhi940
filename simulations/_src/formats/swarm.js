/* ============ Agent Swarm renderer (data comes from STORY) ============ */
(() => {
const S = STORY, AG = S.agents, A = Object.fromEntries(AG.map(a => [a.id, a]));
const EV = S.events.map(([at, type, from, to, text]) => ({at, type, from, to, text}));
const TYPE_LEAD = .7;
const PHASES = ['Discover · Empathize','Define · POV & HMW','Develop · Ideate, Prototype','Deliver · Test, Ship'];
const fmtS = s => esc(s).replace(/\{(\w+):([^{}]*)\}/g, '<span class="c-$1">$2</span>');

mountMeta(S.meta);
$('#roster').innerHTML = AG.map(a => `<li class="ag${a.human ? ' human' : ''}" id="ag-${a.id}"><span class="av" style="background:${a.c}">${a.ab}</span><span class="nm">${a.human ? '' : '@'}${a.id}</span><span class="st">idle</span><span class="tk">${a.role}</span></li>`).join('');
const count = (t, f) => EV.filter(e => e.at <= t && f(e)).length;
const METRICS = [
  {l:'Messages', f:t => count(t, () => true), n:'agent ↔ agent ↔ human'},
  {l:'Handoffs', f:t => count(t, e => e.to && e.to !== '*'), n:'routed work'},
  {l:'Guardrail catches', f:t => count(t, e => e.type === 'block' || e.type === 'flag'), n:S.catchNote, cls:v => v ? 'warn' : ''},
  {l:'Human gates', f:t => count(t, e => e.type === 'approve') + ' / 4', n:'every phase ends with a person', cls:v => v === '4 / 4' ? 'good' : ''},
  ...S.metrics
];
$('#mstrip').innerHTML = METRICS.map((m, i) => `<div class="m"><div class="eyebrow">${m.l}</div><div class="v" id="mv${i}">0</div><div class="n">${m.n}</div></div>`).join('');
$('#rails').innerHTML = S.rails.map((r, i) => `<li><span class="l">${r.l}</span><span class="r" id="rl${i}">—</span></li>`).join('');
const GATES = EV.filter(e => e.type === 'gate').map((g, i) => ({open:g.at, ok:EV.filter(e => e.type === 'approve')[i].at, name:['Discover','Define','Develop','Deliver'][i]}));
$('#gates').innerHTML = GATES.map((g, i) => `<div class="gt" id="gt${i}">G${i+1}<small>${g.name}</small></div>`).join('');

/* graph: orchestrator centre, human on top, specialists on a ring */
const GW = 320, GH = 220, CX = 160, CY = 116, R = 82;
const ring = AG.filter(a => a.id !== 'orchestrator' && !a.human), human = AG.find(a => a.human);
const POS = {orchestrator:{x:CX, y:CY}}; POS[human.id] = {x:CX, y:16};
ring.forEach((a, i) => { const ang = Math.PI/2 + (i + .5) * 2*Math.PI/ring.length; POS[a.id] = {x:CX + R*1.32*Math.cos(ang), y:CY + R*.98*Math.sin(ang)}; });
const curve = (a, b) => ({mx:(a.x + b.x)/2 + (b.y - a.y)*.18, my:(a.y + b.y)/2 - (b.x - a.x)*.18});
const qpt = (a, b, c, u) => ({x:(1-u)*(1-u)*a.x + 2*(1-u)*u*c.mx + u*u*b.x, y:(1-u)*(1-u)*a.y + 2*(1-u)*u*c.my + u*u*b.y});
function vizGraph(t){
  let s = `<svg viewBox="0 0 ${GW} ${GH}" role="img" aria-label="Handoff graph between agents">`;
  AG.forEach(a => { if (a.id !== 'orchestrator'){ const p = POS[a.id]; s += `<line x1="${CX}" y1="${CY}" x2="${p.x}" y2="${p.y}" stroke="var(--line-soft)"/>`; } });
  /* ambient packets: constant low-level traffic (sync, heartbeats, context) */
  for (let k = 0; k < 5; k++){
    const slot = Math.floor(t / 1.6 + k * .37), u = (t / 1.6 + k * .37) % 1;
    const from = ring[Math.floor(hash(slot * 7 + k) * ring.length)].id, to = hash(slot * 13 + k) < .5 ? 'orchestrator' : ring[Math.floor(hash(slot * 3 + k) * ring.length)].id;
    if (from === to) continue;
    const a = POS[from], b = POS[to], c = curve(a, b), p = qpt(a, b, c, u);
    s += `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="1.8" fill="var(--phos-2)" opacity=".55"/>`;
  }
  const active = new Set();
  EV.forEach(e => {
    if (!e.to || e.at > t || t - e.at > 2) return;
    const targets = e.to === '*' ? ring.map(a => a.id) : [e.to];
    const a = POS[e.from], k = clamp((t - e.at)/1.1, 0, 1), col = A[e.from].c;
    active.add(e.from);
    targets.forEach(to => {
      const b = POS[to], c = curve(a, b); active.add(to);
      s += `<path d="M${a.x} ${a.y} Q${c.mx} ${c.my} ${b.x} ${b.y}" fill="none" stroke="${col}" stroke-width="1.6" opacity="${(1 - (t - e.at)/2).toFixed(2)}"/>`;
      if (k < 1){ const p = qpt(a, b, c, k); s += `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="3.2" fill="${col}"/>`; }
    });
  });
  AG.forEach(a => {
    const p = POS[a.id], on = active.has(a.id), r = a.id === 'orchestrator' ? 15 : 12;
    s += `<circle cx="${p.x}" cy="${p.y}" r="${r}" fill="${on ? a.c : 'var(--panel-solid)'}" stroke="${a.c}" stroke-width="1.4" ${a.human ? 'stroke-dasharray="3 2"' : ''}/>`;
    s += `<text x="${p.x}" y="${p.y + 3.5}" font-size="9.5" font-weight="500" text-anchor="middle" fill="${on ? 'var(--bg)' : a.c}">${a.ab}</text>`;
  });
  return s + '</svg>';
}

const stream = $('#stream'), strip = mountStrip($('#strip'), S.meta.strip);
let shown = 0, stick = true, typingEl = null, lastViz = -1, lastT = -1, lastBg = -1;
stream.addEventListener('scroll', () => { stick = stream.scrollHeight - stream.scrollTop - stream.clientHeight < 30; });
const TAGS = {pass:'<span class="tag pass">PASS</span>', block:'<span class="tag block">BLOCKED</span>', flag:'<span class="tag flag">FLAG</span>', gate:'<span class="tag gate">✋ GATE</span>', approve:'<span class="tag ok">✓ APPROVED</span>'};
function evHTML(e){
  const f = A[e.from], to = e.to === '*' ? 'all' : e.to ? (A[e.to].human ? e.to : '@' + e.to) : '';
  const who = `<b style="color:${f.c}">${f.human ? f.id : '@' + f.id}</b>${to ? ' → ' + to : ''}${e.type === 'tool' ? ' · tool' : e.type === 'think' ? ' · thinking' : ''}`;
  return `<span class="ts">${mmss(e.at)}</span><span class="who">${who}</span><div class="tx">${TAGS[e.type] || ''}${fmtS(e.text)}</div>`;
}
function resetStream(){ stream.innerHTML = ''; shown = 0; typingEl = null; stick = true; }

function render(t, force){
  if (t < lastT) resetStream();
  lastT = t; strip(t);
  let added = false;
  while (shown < EV.length && EV[shown].at <= t){
    const e = EV[shown++], d = document.createElement('div');
    d.className = 'ev ' + e.type; d.innerHTML = evHTML(e);
    if (typingEl){ typingEl.remove(); typingEl = null; }
    stream.appendChild(d); added = true;
  }
  const nx = EV[shown];
  if (nx && nx.type !== 'sys' && t >= nx.at - TYPE_LEAD && !typingEl){
    typingEl = document.createElement('div'); typingEl.className = 'typing';
    typingEl.innerHTML = `<i></i><i></i><i></i> ${A[nx.from].human ? 'design lead is reviewing' : '@' + nx.from + (nx.type === 'tool' ? ' is running a tool' : ' is typing')}`;
    stream.appendChild(typingEl); added = true;
  }
  if (added && stick) stream.scrollTop = stream.scrollHeight;
  const bq = Math.floor(t / 1.4);
  if (bq !== lastBg || force){ lastBg = bq; const r = rng(bq * 31 + 7); $('#bgjob').innerHTML = `<b>bg</b> ${esc(pick(r, AMB.station)(r))}`; }

  const vt = Math.floor(t*12);
  if (vt === lastViz && !force) return;
  lastViz = vt;
  $('#graph').innerHTML = vizGraph(t);
  let working = 0;
  AG.forEach(a => {
    let st = 'idle', task = a.role;
    for (let i = shown - 1; i >= 0; i--){ const e = EV[i]; if (e.from === a.id){ task = plain(e.text); if (t - e.at < 2.6) st = 'working'; break; } }
    if (st === 'idle'){
      const r = EV.slice(0, shown).reverse().find(e => (e.to === a.id || (e.to === '*' && !a.human && a.id !== e.from)) && t - e.at < 2.4);
      if (r) st = r.type === 'block' || r.type === 'flag' ? 'revising' : a.human ? 'reviewing' : 'reading';
    }
    if (nx && nx.from === a.id && t >= nx.at - TYPE_LEAD) st = 'working';
    if (st === 'working') working++;
    const el = $('#ag-' + a.id);
    if (el._st !== st){ el._st = st; el.className = 'ag' + (a.human ? ' human' : '') + ' ' + st; el.querySelector('.st').textContent = st; }
    if (el._tk !== task){ el._tk = task; el.querySelector('.tk').textContent = task; }
  });
  $('#nActive').textContent = working + ' working';
  METRICS.forEach((m, i) => { const v = m.f(t), el = $('#mv'+i); el.textContent = v; el.className = 'v ' + (m.cls ? m.cls(v) : ''); });
  S.rails.forEach((r, i) => { const [v, c] = r.f(t), el = $('#rl'+i); el.textContent = v; el.className = 'r ' + c; });
  GATES.forEach((g, i) => { $('#gt'+i).className = 'gt' + (t >= g.ok ? ' ok' : t >= g.open ? ' wait' : ''); });
  $('#phaseLbl').textContent = PHASES[Math.min(3, Math.floor(t/30))];
}
createSim(render, resetStream);
})();
