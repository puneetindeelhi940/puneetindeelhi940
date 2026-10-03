/* ============ shared engine: clock, scripts, ambient activity, logs, live strips, matrix rain ============ */
const DUR = 120;
const $ = s => document.querySelector(s);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmt = s => esc(s).replace(/\{(\w+):([^{}]*)\}/g, '<span class="c-$1">$2</span>');
const plain = s => String(s).replace(/\{\w+:([^{}]*)\}/g, '$1');
const mmss = s => { s = Math.max(0, Math.floor(s)); return String(Math.floor(s/60)).padStart(2,'0') + ':' + String(s%60).padStart(2,'0'); };
const rng = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let x = Math.imul(seed ^ seed >>> 15, 1 | seed); x = x + Math.imul(x ^ x >>> 7, 61 | x) ^ x; return ((x ^ x >>> 14) >>> 0) / 4294967296; };
const hash = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const pick = (r, a) => a[Math.floor(r() * a.length)];
const ri = (r, a, b) => a + Math.floor(r() * (b - a + 1));
const rf = (r, a, b, d = 1) => (a + r() * (b - a)).toFixed(d);

/* script builder: time-anchored lines; warns when a block overruns its anchor */
function script(name, cps = 40){
  const L = []; let t = 0;
  const b = {
    cps,
    at(x){ if (t > x + 0.01) console.warn(`[${name}] overrun: ${t.toFixed(2)} > ${x}`); t = x; return b; },
    cmd(x, p = .35){ L.push({at:t, k:'cmd', x}); t += x.length / cps + p; return b; },
    o(x, d = .45, k = ''){ L.push({at:t, x, k}); t += d; return b; },
    bar(label, d, done){ L.push({at:t, d, k:'bar', label, done}); t += d + .3; return b; },
    lines(){ if (t > DUR - 0.3) console.warn(`[${name}] runs past loop end: ${t.toFixed(2)}`); return L; }
  };
  return b;
}

/* fill quiet gaps with deterministic background activity so no pane ever sits idle */
function ambient(L, pool, seed, {cps = 40, gap = 2.6, step = [1.7, 3.1], from = .9, to = 118.8} = {}){
  const r = rng(seed), out = []; let prev = -1;
  const next = at => { let i; do { i = Math.floor(r() * pool.length); } while (pool.length > 1 && i === prev); prev = i; return pool[i](r, at); };
  const busyEnd = l => l.at + (l.k === 'cmd' ? l.x.length / cps + .3 : l.k === 'bar' ? l.d + .3 : .35);
  const sorted = [...L].sort((a, b) => a.at - b.at);
  let cur = from;
  const fill = until => { let s = cur + step[0] + r() * (step[1] - step[0]) * .5; while (s < until - .7){ out.push({at:s, x:next(s), k:'amb'}); s += step[0] + r() * (step[1] - step[0]); } };
  for (const l of sorted){ if (l.at - cur > gap) fill(l.at); cur = Math.max(cur, busyEnd(l)); }
  if (to - cur > gap) fill(to);
  return [...L, ...out].sort((a, b) => a.at - b.at);
}

const barTxt = (label, p, done, n = 22) => {
  const f = Math.round(p * n);
  return fmt(`${label} {ok:${'█'.repeat(f)}}{dim:${'░'.repeat(n - f)}} ${String(Math.round(p * 100)).padStart(3)}%`) + (p >= 1 && done ? '  ' + fmt(done) : '');
};

class Log {
  constructor(el, lines, {max = 160, cps = 40, prompt = '❯ '} = {}){
    this.el = el; this.s = lines; this.max = max; this.cps = cps; this.prompt = `<span class="ps">${esc(prompt)}</span>`; this.stick = true;
    el.addEventListener('scroll', () => { this.stick = el.scrollHeight - el.scrollTop - el.clientHeight < 28; });
    this.reset();
  }
  reset(){ this.el.innerHTML = ''; this.i = 0; this.live = []; this.lastT = -1; this.lastAt = -99; this.stick = true; }
  render(t){
    if (t < this.lastT) this.reset();
    this.lastT = t; let added = false;
    while (this.i < this.s.length && this.s[this.i].at <= t){
      const ln = this.s[this.i++], d = document.createElement('div');
      d.className = 'ln ' + (ln.k || ''); this.el.appendChild(d); added = true;
      if (ln.k !== 'amb') this.lastAt = ln.at;
      if (ln.k === 'cmd' || ln.k === 'bar') this.live.push({ln, d}); else d.innerHTML = fmt(ln.x);
    }
    this.live = this.live.filter(({ln, d}) => {
      if (ln.k === 'bar'){ const p = clamp((t - ln.at) / ln.d, 0, 1); d.innerHTML = barTxt(ln.label, p, ln.done); return p < 1; }
      const n = Math.floor((t - ln.at) * this.cps);
      if (n >= ln.x.length){ d.innerHTML = this.prompt + esc(ln.x); return false; }
      d.innerHTML = this.prompt + esc(ln.x.slice(0, n)) + '<span class="caret"></span>'; return true;
    });
    while (this.el.children.length > this.max) this.el.firstChild.remove();
    if ((added || this.live.length) && this.stick) this.el.scrollTop = this.el.scrollHeight;
  }
}

/* step lookup: pts = [[t, value], ...] */
const stepIdx = (t, pts) => { let i = -1; pts.forEach((p, j) => { if (p[0] <= t) i = j; }); return i; };

/* ============ live strips (pure functions of sim time) ============ */
const STRIPS = {
  /* CPR depth trace: 110/min, 30:2 cycles; consistency improves after the redesigned flow ships (t ≥ 95) */
  cpr: {
    label: 'live · RQI station telemetry',
    stations: ['4W-02 · RN night · adult','ICU-3 · RN day · adult','PICU-1 · RN · infant','ED-7 · RN night · adult','5E-04 · new grad · adult','L&D-2 · RN · infant'],
    sample(s, t){
      const cyc = 20.4, k = s % cyc, per = 60/110, after = t >= 95;
      if (k >= 30*per) { const b = (k - 30*per) / 2; return {d: b < 2 ? .25*Math.pow(Math.sin(Math.PI*(b % 1)), 2) : 0, vent:true}; }
      const i = Math.floor(k / per), ph = (k % per) / per, n = Math.floor(s / cyc) * 31 + i;
      const base = after ? 5.45 : 5.0, spread = after ? .38 : .85;
      const depth = clamp(base + (hash(n) - .5) * 2 * spread, 3.6, 6.6);
      return {d: depth * Math.pow(Math.sin(Math.PI * ph), 2), depth, vent:false};
    },
    draw(ctx, w, h, t){
      const win = 6, top = 10, bot = h - 16, sy = d => top + d / 7 * (bot - top);
      ctx.fillStyle = 'rgba(77,255,145,.07)'; ctx.fillRect(0, sy(5), w, sy(6) - sy(5));
      ctx.strokeStyle = 'rgba(134,168,146,.35)'; ctx.setLineDash([3,4]); ctx.lineWidth = 1;
      [5,6].forEach(d => { ctx.beginPath(); ctx.moveTo(0, sy(d)); ctx.lineTo(w, sy(d)); ctx.stroke(); }); ctx.setLineDash([]);
      ctx.fillStyle = '#86a892'; ctx.font = '10px "Roboto Mono", monospace';
      ctx.textAlign = 'right'; ctx.fillText('5 cm', w - 4, sy(5) - 3); ctx.fillText('6 cm', w - 4, sy(6) + 11); ctx.textAlign = 'left';
      ctx.beginPath(); ctx.lineWidth = 1.6; ctx.strokeStyle = '#4dff91'; ctx.shadowColor = '#4dff91'; ctx.shadowBlur = 6;
      for (let x = 0; x <= w; x += 1.5){ const s = t - (w - x) / w * win; const v = s < 0 ? {d:0} : this.sample(s, t); const y = sy(v.d); x ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
      ctx.stroke(); ctx.shadowBlur = 0;
    },
    read(t){
      const per = 60/110, cyc = 20.4, after = t >= 95;
      let last = null; for (let s = t; s > t - 3; s -= per/3){ const v = this.sample(s, t); if (!v.vent && v.depth){ last = v.depth; break; } }
      const k = t % cyc, vent = k >= 30*per;
      const st = this.stations[Math.floor(t / cyc) % this.stations.length];
      const inT = last != null && last >= 5 && last <= 6;
      return [
        ['station', st],
        ['depth', vent ? 'ventilating · 30:2' : `<b class="${inT ? 'ok' : 'warn'}">${last ? last.toFixed(1) : '—'} cm</b>`],
        ['rate', `${108 + Math.floor(hash(Math.floor(t)) * 6)}/min`],
        ['recoil', `${after ? 97 + Math.floor(hash(Math.floor(t)+3)*3) : 86 + Math.floor(hash(Math.floor(t)+3)*10)}%`],
        ['in target', `<b class="${after ? 'ok' : 'warn'}">${after ? 79 : 61}%</b>`]
      ];
    }
  },
  /* patient-monitor ECG from the sim room: sinus → VF → shock → CPR → ROSC, 40 s scenario loop */
  ecg: {
    label: 'live · sim room 2 · SimMan monitor',
    phase(sc){ return sc < 12 ? 'sinus' : sc < 19 ? 'vf' : sc < 24.5 ? 'cpr' : 'rosc'; },
    beat(p){ const g = (c, a, w) => a * Math.exp(-Math.pow((p - c) / w, 2)); return g(.18,.12,.03) + g(.3,-.12,.012) + g(.33,1,.012) + g(.36,-.28,.014) + g(.58,.3,.05); },
    sample(s){
      const sc = ((s % 40) + 40) % 40, ph = this.phase(sc);
      if (ph === 'sinus'){ const per = 60/88; return this.beat((sc % per) / per); }
      if (ph === 'vf') return .38 * Math.sin(sc * 31) * Math.sin(sc * 4.3 + 1) + .18 * Math.sin(sc * 19.7);
      if (ph === 'cpr'){ if (sc < 19.25) return sc < 19.08 ? 1.6 : -.6; const per = 60/110; return .55 * Math.sin(2 * Math.PI * (sc - 19.25) / per); }
      const per = 60/112; return .9 * this.beat((sc % per) / per);
    },
    draw(ctx, w, h, t){
      const win = 5, mid = h * .55, amp = h * .34;
      ctx.strokeStyle = 'rgba(134,168,146,.18)'; ctx.lineWidth = 1;
      for (let x = 0; x < w; x += 24){ ctx.beginPath(); ctx.moveTo(x, 8); ctx.lineTo(x, h - 8); ctx.stroke(); }
      ctx.beginPath(); ctx.lineWidth = 1.6; ctx.strokeStyle = '#4dff91'; ctx.shadowColor = '#4dff91'; ctx.shadowBlur = 6;
      for (let x = 0; x <= w; x += 1.2){ const s = t - (w - x) / w * win; const y = mid - this.sample(s) * amp; x ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
      ctx.stroke(); ctx.shadowBlur = 0;
      for (let x = 0; x <= w; x += 2){ const s = t - (w - x) / w * win, sc = ((s % 40) + 40) % 40; if (Math.abs(sc - 19) < .03){ ctx.fillStyle = '#f2c46b'; ctx.font = '11px "Roboto Mono", monospace'; ctx.fillText('⚡ 200 J', x + 4, 16); ctx.fillRect(x, 6, 1.5, h - 12); } }
    },
    read(t){
      const sc = t % 40, ph = this.phase(sc);
      const lbl = {sinus:'sinus 88', vf:'<b class="err">VF</b>', cpr:'<b class="warn">CPR in progress</b>', rosc:'<b class="ok">ROSC · sinus tach</b>'}[ph];
      const hr = {sinus:'88', vf:'—', cpr:'—', rosc:'112'}[ph];
      return [
        ['scenario', `adult IHCA #${Math.floor(t / 40) + 14}`],
        ['rhythm', lbl],
        ['HR', hr],
        ['time to shock', sc >= 19 ? '<b class="ok">01:52</b>' : sc >= 12 ? `<b class="warn">${mmss((sc - 12) * 16)}</b>` : '—'],
        ['events logged', String(Math.floor(sc * 1.7) + 3)]
      ];
    }
  }
};
function mountStrip(host, kind){
  const S = STRIPS[kind];
  host.innerHTML = `<div class="strip-h"><span class="eyebrow"><i class="rec"></i>${S.label}</span><div class="strip-r" aria-live="off"></div></div><canvas aria-label="${S.label}" role="img"></canvas>`;
  const cv = host.querySelector('canvas'), rd = host.querySelector('.strip-r');
  let lastR = -1;
  return t => {
    const dpr = Math.min(2, window.devicePixelRatio || 1), w = cv.clientWidth, h = cv.clientHeight;
    if (!w) return;
    if (cv.width !== Math.round(w * dpr)){ cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
    const ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
    S.draw(ctx, w, h, t);
    const q = Math.floor(t * 4);
    if (q !== lastR){ lastR = q; rd.innerHTML = S.read(t).map(([k, v]) => `<span><em>${k}</em> ${v}</span>`).join(''); }
  };
}

/* ============ matrix rain (decorative, 6% opacity) ============ */
function startRain(){
  const cv = document.getElementById('rain'); if (!cv) return;
  const ctx = cv.getContext('2d'), G = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉ0123456789♥+<>=/'.split('');
  let cols = [], fs = 15, W = 0, H = 0;
  const size = () => { W = cv.width = innerWidth; H = cv.height = innerHeight; cols = Array.from({length: Math.ceil(W / fs)}, (_, i) => hash(i) * H / fs); ctx.fillStyle = '#010c07'; ctx.fillRect(0, 0, W, H); };
  size(); addEventListener('resize', size);
  const draw = () => {
    ctx.fillStyle = 'rgba(1,12,7,.14)'; ctx.fillRect(0, 0, W, H); ctx.font = fs + 'px "Roboto Mono", monospace';
    cols.forEach((y, i) => { const ch = G[Math.floor(Math.random() * G.length)]; ctx.fillStyle = Math.random() < .08 ? '#f3e9d2' : '#4dff91'; ctx.fillText(ch, i * fs, y * fs); cols[i] = y * fs > H && Math.random() > .975 ? 0 : y + 1; });
  };
  if (matchMedia('(prefers-reduced-motion: reduce)').matches){ for (let i = 0; i < 60; i++) draw(); return; }
  let last = 0; const loop = ts => { if (ts - last > 55){ last = ts; draw(); } requestAnimationFrame(loop); }; requestAnimationFrame(loop);
}

/* ============ clock & transport ============ */
function createSim(render, onWrap){
  const sim = {t: 0, speed: 1, playing: true, loops: 0};
  let last = null, scrubbing = false;
  const sc = $('#scrub');
  const draw = force => { render(sim.t, force); $('#clock').textContent = mmss(sim.t) + ' / 02:00'; if (!scrubbing) sc.value = sim.t.toFixed(1); };
  function frame(ts){
    if (last === null) last = ts;
    const dt = Math.min(.1, (ts - last) / 1000); last = ts;
    if (sim.playing && !scrubbing){ sim.t += dt * sim.speed; if (sim.t >= DUR){ sim.t = 0; sim.loops++; onWrap && onWrap(); draw(true); } }
    draw(false); requestAnimationFrame(frame);
  }
  function seek(t){ sim.t = clamp(t, 0, DUR - .01); onWrap && onWrap(); draw(true); }
  function setPlaying(p){ sim.playing = p; const b = $('#play'); b.textContent = p ? '❚❚ Pause' : '▶ Play'; b.setAttribute('aria-label', p ? 'Pause simulation' : 'Play simulation'); $('#app').classList.toggle('paused', !p); $('#liveTxt').textContent = p ? 'live' : 'paused'; }
  function setSpeed(s){ sim.speed = s; document.querySelectorAll('[data-speed]').forEach(x => x.setAttribute('aria-pressed', String(+x.dataset.speed === s))); }
  $('#play').onclick = () => setPlaying(!sim.playing);
  $('#restart').onclick = () => { seek(0); setPlaying(true); };
  document.querySelectorAll('[data-speed]').forEach(x => x.onclick = () => setSpeed(+x.dataset.speed));
  sc.addEventListener('input', () => { scrubbing = true; seek(+sc.value); });
  sc.addEventListener('change', () => { scrubbing = false; });
  sc.addEventListener('pointerup', () => { scrubbing = false; });
  document.addEventListener('keydown', e => {
    if (e.target.closest('input,button,summary') && e.key === ' ') return;
    if (e.key === ' '){ e.preventDefault(); setPlaying(!sim.playing); }
    else if (e.key === 'ArrowRight') seek(sim.t + 5);
    else if (e.key === 'ArrowLeft') seek(sim.t - 5);
    else if (['1','2','4'].includes(e.key)) setSpeed(+e.key);
  });
  window.__sim = {seek, setSpeed, setPlaying, get t(){ return sim.t; }, get loops(){ return sim.loops; }};
  startRain();
  draw(true); requestAnimationFrame(frame);
  return sim;
}

/* shared page furniture from STORY.meta */
function mountMeta(M){
  document.querySelectorAll('[data-meta]').forEach(el => { const v = M[el.dataset.meta]; if (v != null) el.innerHTML = v; });
  const ul = $('#sources'); if (ul) ul.innerHTML = M.sources.map(s => `<li>${s}</li>`).join('');
}
