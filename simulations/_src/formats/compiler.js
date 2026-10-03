/* ============ Double Diamond Compiler renderer (data comes from STORY) ============ */
(() => {
const S = STORY, P = S.peaks;
const STAGES = [['Discover',0,30],['Define',30,30],['Develop',60,30],['Deliver',90,23]];
const MODES = [['Empathize',3,30],['Define',30,60],['Ideate',60,74.4],['Prototype',74.4,90],['Test',90,108],['Ship',108,113]];
const WARN_AT = S.lines.filter(l => /^\{warn:warning\}/.test(l.x || '')).map(l => l.at);

function options(t){
  const ph = Math.min(3, Math.floor(t/30)), p = (t - ph*30)/30;
  const wob = 1 + .03*Math.sin(t*2.3) + .02*Math.sin(t*5.1);
  let n, unit;
  if (ph === 0){ n = 1 + (P[0]-1)*clamp(p/.97,0,1); unit = S.units[0]; }
  else if (ph === 1){ n = P[0] - (P[0]-1)*clamp(p/.97,0,1); unit = n < 2 ? 'point of view' : S.units[1]; }
  else if (ph === 2){ n = 1 + (P[1]-1)*clamp(p/.97,0,1); unit = S.units[2]; }
  else { n = P[1] - (P[1]-1)*clamp(p/.8,0,1); unit = n < 2 ? 'shipped solution' : S.units[3]; }
  let a = ph < 2 ? n/P[0] : n/P[1];
  if (n > 1.5) a *= wob;
  if (t < 3) return {n:1, a:0, unit:'brief'};
  return {n:Math.round(n), a:clamp(a, 0, 1.06), unit};
}
function vizDD(t){
  const W = 360, H = 168, cy = 84, A = 56, X0 = 8, X1 = W - 8, x = s => X0 + s/DUR*(X1 - X0);
  let top = '', bot = '';
  for (let s = 0; s <= Math.max(.25, t); s += .25){ const o = options(s); top += `${x(s).toFixed(1)},${(cy - o.a*A).toFixed(1)} `; bot = `${x(s).toFixed(1)},${(cy + o.a*A).toFixed(1)} ` + bot; }
  let g = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Double diamond drawn by the number of options in play over time">`;
  g += `<path d="M${x(0)} ${cy} L${x(30)} ${cy-A} L${x(60)} ${cy} L${x(90)} ${cy-A} L${x(120)} ${cy} L${x(90)} ${cy+A} L${x(60)} ${cy} L${x(30)} ${cy+A} Z" fill="none" stroke="var(--line)" stroke-dasharray="3 3"/>`;
  [30,60,90].forEach(s => g += `<line x1="${x(s)}" y1="16" x2="${x(s)}" y2="${H-22}" stroke="var(--line-soft)"/>`);
  g += `<polygon points="${top}${bot}" fill="rgba(77,255,145,.18)" stroke="var(--phos)" stroke-width="1.2" stroke-linejoin="round"/>`;
  g += `<line x1="${x(0)}" y1="${cy}" x2="${x(120)}" y2="${cy}" stroke="var(--line)"/>`;
  g += `<text x="${x(30)}" y="11" font-size="9" fill="var(--muted)" text-anchor="middle">design the right thing</text><text x="${x(90)}" y="11" font-size="9" fill="var(--muted)" text-anchor="middle">design the thing right</text>`;
  ['Discover','Define','Develop','Deliver'].forEach((n, i) => g += `<text x="${x(15+i*30)}" y="${H-6}" font-size="10" fill="${Math.floor(t/30) === i ? 'var(--phos)' : 'var(--cream-2)'}" text-anchor="middle">${n}</text>`);
  g += `<text x="${x(60)}" y="${H-14}" font-size="8" fill="var(--muted)" text-anchor="middle">POV</text>`;
  const o = options(t);
  g += `<line x1="${x(t)}" y1="18" x2="${x(t)}" y2="${H-24}" stroke="var(--amber)" stroke-width="1.2"/><circle cx="${x(t)}" cy="${cy - o.a*A}" r="3" fill="var(--amber)"/><circle cx="${x(t)}" cy="${cy + o.a*A}" r="3" fill="var(--amber)"/>`;
  return g + '</svg>';
}

mountMeta(S.meta);
$('#stages').innerHTML = STAGES.map(([n], i) => `<div class="st" id="st${i}"><span class="nm">${n}</span><span class="tr"><i></i></span><span class="pc">0%</span></div>`).join('');
$('#modes').innerHTML = MODES.map(([n], i) => `<span class="mode" id="md${i}">${n}</span>`).join('');
const log = new Log($('#log'), S.lines, {max: 420, cps: 42, prompt: '$ '});
const strip = mountStrip($('#strip'), S.meta.strip);
let lastViz = -1, filesShown = -1, modeState = [], stageState = [];

function render(t, force){
  log.render(t); strip(t);
  const vt = Math.floor(t*10);
  if (vt !== lastViz || force){ lastViz = vt; $('#dd').innerHTML = vizDD(t); const o = options(t); $('#count').textContent = o.n; $('#unit').textContent = o.unit; }
  STAGES.forEach(([n, s, len], i) => {
    const p = clamp((t - s)/len, 0, 1), el = $('#st'+i), pc = Math.floor(p*100);
    if (stageState[i] === pc) return; stageState[i] = pc;
    el.querySelector('i').style.width = pc + '%'; el.querySelector('.pc').textContent = pc + '%'; el.classList.toggle('on', p > 0 && p < 1);
  });
  MODES.forEach(([n, a, z], i) => {
    const st = t >= z ? 2 : t >= a ? 1 : 0; if (modeState[i] === st) return; modeState[i] = st;
    const el = $('#md'+i); el.classList.toggle('on', st === 1); el.classList.toggle('done', st === 2);
  });
  const nf = S.files.filter(f => f[0] <= t).length;
  if (nf !== filesShown){
    const ul = $('#files');
    if (nf < filesShown || filesShown < 0) ul.innerHTML = '';
    if (nf === 0) ul.innerHTML = '<li class="empty">nothing yet · reading the brief</li>';
    else {
      const em = ul.querySelector('.empty'); if (em) em.remove();
      for (let i = ul.children.length; i < nf; i++){ const [, f, m] = S.files[i]; const li = document.createElement('li'); li.innerHTML = `<span class="p">+</span><span class="f">${esc(f)}</span><span class="m">${esc(m)}</span>`; ul.appendChild(li); }
      ul.scrollTop = ul.scrollHeight;
    }
    filesShown = nf; $('#nfiles').textContent = nf;
  }
  const warns = WARN_AT.filter(w => w <= t).length, ph = Math.min(3, Math.floor(t/30));
  $('#status').innerHTML = `<span>phase <b>${ph+1}/4</b></span><span class="ok">errors <b>0</b></span><span class="wn">warnings <b>${warns}</b></span><span>artifacts <b>${nf}</b></span><span>elapsed <b>${mmss(t)}</b></span>`;
}
createSim(render, () => { stageState = []; modeState = []; filesShown = -1; });
})();
