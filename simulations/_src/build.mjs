// Builds self-contained HTML packages: one per (use case × format).
// Usage: node simulations/_src/build.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SRC = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(SRC, '..');
const read = f => fs.readFileSync(path.join(SRC, f), 'utf8');

const FORMATS = {
  mission:  { dir: 'mission-control',         title: 'Mission Control' },
  compiler: { dir: 'double-diamond-compiler', title: 'Diamond Compiler' },
  swarm:    { dir: 'agent-swarm',             title: 'Agent Swarm' }
};
const CASES = {
  rqi:        { name: 'RQI',        desc: 'Quarterly RQI CPR practice redesigned to fit a nursing shift' },
  simcapture: { name: 'SimCapture', desc: 'AI-assisted simulation debriefing in SimCapture' }
};
const FDESC = {
  mission: 'Six UX disciplines run in parallel through a 2-minute Double Diamond sprint with live KPIs and telemetry.',
  compiler: 'The sprint as a compiler build log while the options in play draw the double diamond live.',
  swarm: 'AI agents run the sprint with guardrails and a human design lead approving every phase.'
};

const css = read('core.css'), core = read('core.js'), shared = read('shared.html');
const built = [];
for (const [ck, c] of Object.entries(CASES)) {
  for (const [fk, f] of Object.entries(FORMATS)) {
    const storyFile = path.join('stories', ck, fk + '.js');
    if (!fs.existsSync(path.join(SRC, storyFile))) continue;
    const title = `${c.name} ${f.title}`;
    const desc = `${c.desc}. ${FDESC[fk]} Concept study with simulated data.`;
    const body = read(`formats/${fk}.html`).replace('{{SHARED}}', shared);
    const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="author" content="Puneet Arora">
<meta name="description" content="${desc}">
<title>${title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&family=Roboto+Mono:wght@300;400;500&display=swap">
<style>
${css}
</style>
</head>
<body>
<!-- Generated from simulations/_src by build.mjs. Edit the sources, not this file. -->
${body}
<script>
${core}
${read(`stories/${ck}/meta.js`)}
${read(storyFile)}
${read(`formats/${fk}.js`)}
</script>
</body>
</html>
`;
    const dir = path.join(OUT, ck, f.dir);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), html);
    built.push({ ck, fk, title, desc, rel: `${ck}/${f.dir}/index.html`, kb: (html.length / 1024).toFixed(0) });
  }
}
built.forEach(b => console.log(`built ${b.rel} (${b.kb} KB)`));

// Gallery landing page for GitHub Pages: simulations/index.html
const card = b => `      <a class="card" href="${b.rel.replace('index.html', '')}">
        <span class="k">${FORMATS[b.fk].title}</span>
        <span class="d">${FDESC[b.fk]}</span>
        <span class="go">open ▸</span>
      </a>`;
const section = ck => `  <section>
    <div class="eyebrow">${CASES[ck].name}</div>
    <h2>${CASES[ck].desc}</h2>
    <div class="cards">
${built.filter(b => b.ck === ck).map(card).join('\n')}
    </div>
  </section>`;
const gallery = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="author" content="Puneet Arora">
<meta name="description" content="Six 2-minute simulations of UX sprints for two Laerdal concept studies: RQI CPR practice and AI-assisted debriefing in SimCapture.">
<title>UX Sprint Simulations</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&family=Roboto+Mono:wght@400;500&display=swap">
<style>
${css}
main{position:relative;z-index:1;max-width:1100px;margin:0 auto;display:flex;flex-direction:column;gap:28px;padding-block:24px}
header h1{margin:6px 0 8px;font:500 30px/1.2 var(--mono);text-wrap:balance}
header p{margin:0;max-width:68ch;color:var(--cream-2);font-size:15px}
section h2{margin:4px 0 12px;font:400 18px/1.35 var(--ui);color:var(--cream)}
.cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
.card{display:flex;flex-direction:column;gap:6px;padding:14px 16px;border:1px solid var(--line);border-radius:var(--r);background:var(--panel);color:var(--cream);text-decoration:none;min-width:0}
.card:hover{border-color:var(--phos);box-shadow:0 0 18px rgba(77,255,145,.15)}
.card .k{font:500 15px var(--mono);color:var(--phos)}
.card .d{font-size:13px;color:var(--cream-2)}
.card .go{margin-top:auto;font:500 12px var(--mono);color:var(--muted)}
@media (max-width:820px){.cards{grid-template-columns:1fr}}
</style>
</head>
<body>
<canvas id="rain" aria-hidden="true"></canvas>
<main>
  <header>
    <span class="concept">Concept studies · simulated data</span>
    <h1 class="glow">UX sprint simulations</h1>
    <p>Two Laerdal use cases, each shown three ways. Every page runs a full Double Diamond sprint in a 2-minute loop, using real UX methods, clinical guidelines and accessibility thresholds.</p>
  </header>
${Object.keys(CASES).map(section).join('\n')}
  <footer class="foot">
    <p class="disc">Unofficial portfolio concept studies. Not affiliated with or endorsed by Laerdal Medical, RQI Partners or the American Heart Association. Product names belong to their owners.</p>
    <span class="credit">Built by Puneet Arora</span>
  </footer>
</main>
<script>
${core.slice(core.indexOf('/* ============ matrix rain'), core.indexOf('/* ============ clock & transport'))}
const hash = n => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
startRain();
</script>
</body>
</html>
`;
fs.writeFileSync(path.join(OUT, 'index.html'), gallery);
console.log('built index.html (gallery)');
