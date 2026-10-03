/* ============ Mission Control renderer (data comes from STORY) ============ */
(() => {
const S = STORY, W = 320;
const PH_TIMES = ['0:00','0:30','1:00','1:30'];
const DEF_METH = ['interviews · shadowing · survey · baseline','affinity · POV · HMW · HEART','ideate · prototype · test R1, R2','benchmark · pilot · ship'];
const diamond = (shape, on) => `<svg width="16" height="12" viewBox="0 0 16 12" aria-hidden="true"><path d="${shape === 'div' ? 'M1 6 L15 1 L15 11 Z' : 'M1 1 L15 6 L1 11 Z'}" fill="none" stroke="${on ? 'var(--phos)' : 'var(--muted)'}" stroke-width="1.4"/></svg>`;

const VIZ = {
  codes(v, t){
    const done = v.items.filter(iv => iv.at <= t), cum = done.reduce((s, iv) => s + iv.codes, 0);
    const bw = 20, gap = 5.5, x0 = 4, base = 70, k = 44 / Math.max(...v.items.map(i => i.codes));
    let s = `<svg viewBox="0 0 ${W} 94" role="img" aria-label="${v.label}, ${cum} cumulative">`;
    s += `<text x="4" y="10" font-size="9" fill="var(--muted)">${v.label}</text><text x="${W-4}" y="10" font-size="9" fill="var(--cream)" text-anchor="end">Σ ${cum}</text>`;
    s += `<line x1="0" y1="${base}" x2="${W}" y2="${base}" stroke="var(--line)"/>`;
    v.items.forEach((iv, i) => {
      const x = x0 + i*(bw+gap), on = iv.at <= t, h = Math.max(1.5, iv.codes*k);
      s += `<rect x="${x}" y="${on ? base-h : base-1.5}" width="${bw}" height="${on ? h : 1.5}" fill="${on ? (iv.codes <= 2 ? 'var(--phos-3)' : 'var(--phos-2)') : 'var(--line-soft)'}"/>`;
      if (on) s += `<text x="${x+bw/2}" y="${base-h-3}" font-size="8.5" fill="var(--cream-2)" text-anchor="middle">${iv.codes}</text>`;
      s += `<text x="${x+bw/2}" y="${base+11}" font-size="8" fill="${on ? 'var(--cream-2)' : 'var(--line)'}" text-anchor="middle">${iv.id.slice(1)}</text>`;
    });
    const sat = t >= v.items[v.items.length-1].at;
    return s + `<text x="4" y="92" font-size="9" fill="${sat ? 'var(--phos)' : 'var(--muted)'}">${sat ? v.satText : 'listening for saturation…'}</text></svg>`;
  },
  hbars(v, t){
    const max = Math.max(...v.items.map(i => i[1]));
    let s = `<svg viewBox="0 0 ${W} 92" role="img" aria-label="${v.label}"><text x="4" y="10" font-size="9" fill="var(--muted)">${v.label}</text>`;
    v.items.forEach(([name, n, start], i) => {
      const p = clamp((t - start)/13, 0, 1), c = Math.round(n*p), y = 18 + i*12.5;
      s += `<text x="4" y="${y+8}" font-size="8.5" fill="${p > 0 ? 'var(--cream-2)' : 'var(--line)'}">${name}</text>`;
      s += `<rect x="158" y="${y+1}" width="132" height="8" fill="var(--line-soft)"/><rect x="158" y="${y+1}" width="${132*c/max}" height="8" fill="${i === 0 ? 'var(--amber)' : 'var(--phos-2)'}"/>`;
      s += `<text x="${W-4}" y="${y+8}" font-size="8.5" fill="var(--cream)" text-anchor="end">${c}</text>`;
    });
    return s + '</svg>';
  },
  scatter(v, t){
    if (!v._ideas){ const r = rng(v.seed || 14); v._ideas = Array.from({length: v.n}, (_, i) => ({x:.06 + r()*.88, y:.06 + r()*.88, at:v.start + i*v.every}));
      const r2 = rng(7); v._park = Array.from({length: v.park}, (_, i) => ({x:.1 + r2()*.8, y:.1 + r2()*.8, at:v.parkAt + i*.4})); }
    const X = 30, Y = 14, w = 280, h = 72, px = q => X + q*w, py = q => Y + (1-q)*h;
    let s = `<svg viewBox="0 0 ${W} 100" role="img" aria-label="Impact versus effort matrix">`;
    s += `<rect x="${X}" y="${Y}" width="${w}" height="${h}" fill="none" stroke="var(--line)"/><line x1="${X+w/2}" y1="${Y}" x2="${X+w/2}" y2="${Y+h}" stroke="var(--line-soft)"/><line x1="${X}" y1="${Y+h/2}" x2="${X+w}" y2="${Y+h/2}" stroke="var(--line-soft)"/>`;
    [['quick wins',X+4,Y+10],['big bets',X+w/2+4,Y+10],['fill-ins',X+4,Y+h-4],['money pits',X+w/2+4,Y+h-4]].forEach(([l,x,y]) => s += `<text x="${x}" y="${y}" font-size="8" fill="var(--muted)">${l}</text>`);
    s += `<text x="4" y="10" font-size="9" fill="var(--muted)">IMPACT ↑</text><text x="${W-4}" y="97" font-size="9" fill="var(--muted)" text-anchor="end">EFFORT →</text>`;
    v._park.forEach(d => { if (d.at <= t) s += `<circle cx="${px(d.x)}" cy="${py(d.y)}" r="2.6" fill="none" stroke="var(--cream-2)" stroke-width=".8"/>`; });
    const shown = v._ideas.filter(d => d.at <= t);
    shown.forEach(d => s += `<circle cx="${px(d.x)}" cy="${py(d.y)}" r="2.3" fill="var(--phos-2)"/>`);
    v.picks.forEach(p => { if (p.at <= t) s += `<circle cx="${px(p.x)}" cy="${py(p.y)}" r="6" fill="var(--phos)"/><text x="${px(p.x)}" y="${py(p.y)+3}" font-size="8" font-weight="500" fill="var(--bg)" text-anchor="middle">${p.l}</text>`; });
    return s + `<text x="4" y="97" font-size="9" fill="var(--cream)">${shown.length ? shown.length + ' ideas' : v._park.some(d => d.at <= t) ? 'parking lot' : 'awaiting POV'}</text></svg>`;
  },
  curve(v, t){
    const X = 30, Y = 22, w = 270, h = 58, px = n => X + n/8*w, py = q => Y + (1-q)*h;
    let s = `<svg viewBox="0 0 ${W} 104" role="img" aria-label="Share of usability problems found versus participants"><text x="4" y="10" font-size="9" fill="var(--muted)">PROBLEMS FOUND · 1−(1−0.31)ⁿ</text>`;
    [0,.5,1].forEach(q => s += `<line x1="${X}" y1="${py(q)}" x2="${X+w}" y2="${py(q)}" stroke="var(--line-soft)"/><text x="${X-4}" y="${py(q)+3}" font-size="8" fill="var(--muted)" text-anchor="end">${q*100}%</text>`);
    let d = ''; for (let n = 0; n <= 8; n += .1) d += (n ? 'L' : 'M') + px(n).toFixed(1) + ' ' + py(1 - Math.pow(.69, n)).toFixed(1);
    s += `<path d="${d}" fill="none" stroke="var(--teal)" stroke-width="1.4" stroke-dasharray="3 2"/>`;
    for (let n = 1; n <= 8; n++) s += `<text x="${px(n)}" y="${Y+h+11}" font-size="8" fill="var(--muted)" text-anchor="middle">${n}</text>`;
    v.obs.forEach(([n, c, at]) => { if (at <= t) s += `<circle cx="${px(n)}" cy="${py(c/v.est)}" r="3.2" fill="var(--phos)"/>`; });
    return s + `<text x="4" y="102" font-size="9" fill="var(--cream-2)">${t >= v.obs[0][2] ? v.after : v.before}</text></svg>`;
  },
  funnel(v, t){
    const pb = clamp((t - v.baseAt)/3, 0, 1), pv = clamp((t - v.varAt)/v.varDur, 0, 1);
    let s = `<svg viewBox="0 0 ${W} 96" role="img" aria-label="${v.label}"><text x="4" y="10" font-size="9" fill="var(--muted)">${v.label}</text>`;
    s += `<text x="${W-4}" y="10" font-size="9" text-anchor="end" fill="${pv > 0 ? 'var(--teal)' : 'var(--line)'}">■ ${v.legend[1]}</text><text x="${W-78}" y="10" font-size="9" text-anchor="end" fill="var(--amber)">■ ${v.legend[0]}</text>`;
    v.steps.forEach(([l, b, a], i) => {
      const y = 18 + i*12.6, cur = b + (a - b)*pv;
      s += `<text x="4" y="${y+8}" font-size="8.5" fill="var(--cream-2)">${l}</text><rect x="92" y="${y}" width="${180*b/100*pb}" height="4.5" fill="var(--amber)"/>`;
      if (pv > 0) s += `<rect x="92" y="${y+5}" width="${180*cur/100}" height="4.5" fill="var(--teal)"/>`;
      if (pb >= 1) s += `<text x="${W-4}" y="${y+8}" font-size="8.5" text-anchor="end" fill="var(--cream)">${pv > 0 ? cur.toFixed(0) : b}</text>`;
    });
    return s + '</svg>';
  },
  gauges(v, t){
    const after = t >= v.afterAt, before = t >= v.beforeAt;
    let s = `<svg viewBox="0 0 ${W} 92" role="img" aria-label="${v.label}"><text x="4" y="10" font-size="9" fill="var(--muted)">${v.label}</text>`;
    v.rows.forEach(([n, u, max, good, poor, b, a], i) => {
      const y = 22 + i*22, x0 = 70, w = 196, sx = q => x0 + Math.min(q/max, 1)*w;
      s += `<text x="4" y="${y+7}" font-size="8.5" fill="var(--cream)">${n}</text>`;
      s += `<rect x="${x0}" y="${y}" width="${sx(good)-x0}" height="8" fill="#0f5a33"/><rect x="${sx(good)}" y="${y}" width="${sx(poor)-sx(good)}" height="8" fill="#5a4a1c"/><rect x="${sx(poor)}" y="${y}" width="${x0+w-sx(poor)}" height="8" fill="#5a2a22"/>`;
      if (before){ const q = after ? a : b;
        s += `<path d="M${sx(q)-4} ${y-5} L${sx(q)+4} ${y-5} L${sx(q)} ${y} Z" fill="var(--cream)"/><text x="${W-4}" y="${y+7}" font-size="9" text-anchor="end" fill="${after ? 'var(--phos)' : 'var(--amber)'}">${q}${u}</text>`; }
    });
    return s + `<text x="4" y="90" font-size="9" fill="var(--cream-2)">${before ? (after ? v.captionAfter : v.captionBefore) : 'awaiting baseline'}</text></svg>`;
  }
};

mountMeta(S.meta);
$('#phases').innerHTML = S.phases.map((p, i) => `<div class="ph" id="ph${i}"><div class="eyebrow">${PH_TIMES[i]} · ${p.shape === 'div' ? 'diverge' : 'converge'}</div><h3>${diamond(p.shape)}${p.name}</h3><small>d.school: ${p.mode}</small><small class="meth">${p.methods || DEF_METH[i]}</small><div class="fill"><i></i></div></div>`).join('');
$('#kpis').innerHTML = S.kpis.map((k, i) => `<div class="kpi" id="k${i}"><div class="eyebrow">${k.label}</div><div class="v none">—</div><div class="n">not measured yet</div><div class="trail">&nbsp;</div><div class="tg">${k.target}</div></div>`).join('');
$('#grid').innerHTML = S.panes.map(p => `<section class="pane" aria-label="${p.file}"><header><h4>${p.file}</h4><span class="role">${p.role}</span><span class="pill" id="pill-${p.id}">STANDBY</span></header><div class="viz" id="viz-${p.id}"></div><div class="log" id="log-${p.id}"></div></section>`).join('');
$('#card').innerHTML = `<div class="eyebrow">${S.overlay.eyebrow}</div><h2>${S.overlay.title}</h2><dl>${S.overlay.rows.map(([a, b]) => `<dt>${a}</dt><dd>${b}</dd>`).join('')}</dl><p id="restartTxt"></p>`;

const logs = S.panes.map(p => new Log($('#log-' + p.id), p.lines));
const strip = mountStrip($('#strip'), S.meta.strip);
const kpiState = S.kpis.map(() => null);
let lastViz = -1;

function render(t, force){
  logs.forEach((l, i) => {
    l.render(t);
    const act = l.lastAt >= 0 && t - l.lastAt < 3, pill = $('#pill-' + S.panes[i].id);
    if (pill._a !== act){ pill._a = act; pill.textContent = act ? 'ACTIVE' : 'MONITOR'; pill.classList.toggle('act', act); }
  });
  strip(t);
  const vt = Math.floor(t * 8);
  if (vt !== lastViz || force){ lastViz = vt; S.panes.forEach(p => { $('#viz-' + p.id).innerHTML = VIZ[p.viz.type](p.viz, t); }); }
  S.phases.forEach((p, i) => {
    const el = $('#ph' + i), f = clamp((t - i*30)/30, 0, 1), on = f > 0 && f < 1, st = on ? 1 : f >= 1 ? 2 : 0;
    el.querySelector('.fill i').style.width = (f*100) + '%';
    if (el._s !== st){ el._s = st; el.classList.toggle('on', on); el.querySelector('h3 svg').outerHTML = diamond(p.shape, on); }
  });
  S.kpis.forEach((k, i) => {
    const idx = stepIdx(t, k.pts);
    if (idx === kpiState[i]) return;
    const el = $('#k' + i), v = el.querySelector('.v');
    if (idx < 0){ v.className = 'v none'; v.textContent = '—'; el.querySelector('.n').textContent = 'not measured yet'; el.querySelector('.trail').innerHTML = '&nbsp;'; }
    else {
      const cur = k.pts[idx][1];
      v.className = 'v ' + cur.s; v.textContent = cur.v; el.querySelector('.n').textContent = cur.n;
      el.querySelector('.trail').textContent = idx ? k.pts.slice(0, idx+1).map(p => p[1].v).join(' → ') : 'baseline';
      if (kpiState[i] !== null && !force){ el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash'); }
    }
    kpiState[i] = idx;
  });
  const ov = $('#overlay'), show = t >= 114.5;
  if (ov.hidden === show) ov.hidden = !show;
  if (show) $('#restartTxt').textContent = `${S.overlay.note} Next cycle starts in ${Math.max(1, Math.ceil(DUR - t))} s.`;
}
$('#overlay').addEventListener('click', () => window.__sim.seek(0));
createSim(render, () => kpiState.fill(null));
})();
