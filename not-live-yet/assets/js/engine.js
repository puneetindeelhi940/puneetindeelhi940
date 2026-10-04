/* =====================================================================
   Motion engine — code rain, live terminals, 2×2 matrices, mode canvases.
   Everything pauses when off-screen / tab hidden, and respects
   prefers-reduced-motion (renders a calm, static state instead).
   ===================================================================== */
window.FX = (function () {
  'use strict';

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var sleep = function (ms) { return new Promise(function (r) { setTimeout(r, ms); }); };
  var rand = function (a, b) { return a + Math.random() * (b - a); };
  var pick = function (arr) { return arr[Math.floor(Math.random() * arr.length)]; };
  function css(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }

  /* ---------- Visibility gate: resolves when element is on screen & tab visible ---------- */
  function Gate(el) {
    var self = this; this.visible = false; this.waiters = [];
    var flush = function () {
      if (self.visible && !document.hidden) { var w = self.waiters; self.waiters = []; w.forEach(function (f) { f(); }); }
    };
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) { self.visible = es[0].isIntersecting; flush(); }, { threshold: 0.05 }).observe(el);
    } else { this.visible = true; }
    document.addEventListener('visibilitychange', flush);
    this.wait = function () { return (self.visible && !document.hidden) ? Promise.resolve() : new Promise(function (r) { self.waiters.push(r); }); };
    this.on = function () { return self.visible && !document.hidden; };
  }

  /* ---------- Reveal on scroll ---------- */
  function reveal(root) {
    var els = (root || document).querySelectorAll('.reveal, [data-inview]');
    if (!('IntersectionObserver' in window) || reduced) { els.forEach(function (e) { e.classList.add('is-in'); if (e._onIn) e._onIn(); }); return; }
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); if (en.target._onIn) en.target._onIn(); io.unobserve(en.target); }
      });
    }, { threshold: 0.18 });
    els.forEach(function (e) { io.observe(e); });
  }

  /* ---------- Code rain ---------- */
  var GLYPHS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワ0123456789<>/{}[]=+*';
  var WORDS = ['ASSUMPTIONS', 'PROTO-PERSONA', 'INTERVIEW', 'JOURNEY MAP', 'BLUEPRINT', 'SYNTHESIS', 'PRIORITIZE', '2X2', 'BRAINSTORM', 'DESIGN STUDIO', 'CRITIQUE', 'EXPERIMENT', 'CANVAS', 'USER STORY', 'EMPATHIZE', 'DEFINE', 'IDEATE', 'PROTOTYPE', 'TEST', 'HOW MIGHT WE', 'DOT VOTING', 'AFFINITY MAP', 'FIVE WHYS'];
  function CodeRain(canvas, opts) {
    opts = opts || {};
    var ctx = canvas.getContext('2d');
    var size = opts.size || 16, cols = [], w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    var bg = opts.bg || 'rgba(11,31,27,0.085)', solidBg = opts.solid || '#0B1F1B';
    var green = opts.color || '#3FB8A0', head = '#E6FFF7', red = '#E42313';
    var gate = new Gate(canvas), last = 0, fps = opts.fps || 28;
    function resize() {
      var r = canvas.getBoundingClientRect(); w = Math.max(1, r.width); h = Math.max(1, r.height);
      canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.ceil(w / size); cols = [];
      for (var i = 0; i < n; i++) cols.push(newCol(true));
      ctx.fillStyle = solidBg; ctx.fillRect(0, 0, w, h);
    }
    function newCol(init) {
      var word = Math.random() < 0.18 ? pick(WORDS) : null;
      return { y: init ? rand(-h / size, h / size) : rand(-20, 0), speed: rand(0.35, 1.1), word: word, wi: 0, redChance: Math.random() < 0.06 };
    }
    function frame(t) {
      requestAnimationFrame(frame);
      if (!gate.on() || t - last < 1000 / fps) return; last = t;
      ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
      ctx.font = '600 ' + size + 'px ' + (css('--mono') || 'monospace');
      for (var i = 0; i < cols.length; i++) {
        var c = cols[i], x = i * size, y = Math.floor(c.y) * size;
        var ch = c.word ? c.word[c.wi % c.word.length] : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        if (c.word) c.wi++;
        var row = Math.floor(c.y);
        if (row !== c.row) {
          // repaint the previous head as trail colour, then draw the bright new head
          if (c.prev) {
            ctx.fillStyle = solidBg; ctx.fillRect(x, (row - 1) * size - size + 3, size, size);
            ctx.fillStyle = c.redChance && Math.random() < 0.25 ? red : (c.word ? '#CFEDE3' : green);
            ctx.fillText(c.prev, x, (row - 1) * size);
          }
          ctx.fillStyle = head; ctx.fillText(ch, x, y);
          c.prev = ch; c.row = row;
        } else if (c.word) { c.wi--; }
        c.y += c.speed;
        if (y > h + size * 4 && Math.random() > 0.96) cols[i] = newCol(false);
      }
    }
    resize();
    window.addEventListener('resize', debounce(resize, 200));
    if (reduced) { // static texture
      ctx.font = '600 ' + size + 'px monospace'; ctx.fillStyle = green; ctx.globalAlpha = 0.25;
      for (var x = 0; x < w; x += size) for (var y = 0; y < h; y += size * 1.6) if (Math.random() < 0.18) ctx.fillText(GLYPHS[(Math.random() * GLYPHS.length) | 0], x, y);
      return;
    }
    requestAnimationFrame(frame);
  }
  function debounce(fn, ms) { var t; return function () { clearTimeout(t); t = setTimeout(fn, ms); }; }

  /* ---------- Terminal ---------- */
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function Terminal(host, opts) {
    var self = this;
    this.opts = opts || {};
    this.scripts = Array.isArray(this.opts.scripts) ? this.opts.scripts : [this.opts.script];
    this.idx = this.opts.start || 0;
    var term = document.createElement('div'); term.className = 'term';
    if (this.opts.height) term.style.setProperty('--term-h', this.opts.height + 'px');
    term.innerHTML = '<div class="term-bar"><i></i><i></i><i></i><span class="t-title"></span><span class="t-tag"></span></div>' +
      '<div class="term-body" role="log" aria-live="off"></div>' +
      (this.opts.foot === false ? '' : '<div class="term-foot"><span class="t-left">illustrative simulation</span><span class="t-right"></span></div>');
    host.appendChild(term);
    this.el = term; this.body = term.querySelector('.term-body');
    this.titleEl = term.querySelector('.t-title'); this.tagEl = term.querySelector('.t-tag');
    this.rightEl = term.querySelector('.t-right');
    this.gate = new Gate(term);
    this.speed = this.opts.speed || 1;
    this.setHeader();
    if (reduced) { this.renderStatic(); return; }
    // stagger start so walls don't move in lockstep
    sleep(this.opts.delay || rand(0, 900)).then(function () { self.run(); });
  }
  Terminal.prototype.setHeader = function () {
    var s = this.scripts[this.idx];
    this.titleEl.textContent = s.title || 'session';
    this.tagEl.innerHTML = s.stage ? '<span class="live">' + esc(s.stage) + '</span>' : '';
    if (this.rightEl) this.rightEl.textContent = (this.idx + 1) + '/' + this.scripts.length;
  };
  Terminal.prototype.line = function (cls, html) {
    var d = document.createElement('div'); d.className = 'term-line ' + cls; d.innerHTML = html || '';
    this.body.appendChild(d);
    while (this.body.children.length > 40) this.body.removeChild(this.body.firstChild);
    return d;
  };
  Terminal.prototype.parse = function (raw) {
    var k = raw.slice(0, 2), t = raw.slice(2);
    var map = { '$ ': 'cmd', '> ': 'out', '+ ': 'ok', '! ': 'warn', 'x ': 'err', '= ': 'hi', '# ': 'bar', '~ ': 'pause' };
    return { kind: map[k] || 'out', text: map[k] ? t : raw };
  };
  Terminal.prototype.renderStatic = function () {
    var self = this, s = this.scripts[this.idx];
    s.lines.forEach(function (raw) {
      var p = self.parse(raw);
      if (p.kind === 'pause') return;
      if (p.kind === 'bar') { self.line('out', esc(p.text.split('|')[0]) + '  <span class="bar">[' + '█'.repeat(20) + ']</span> 100%'); return; }
      self.line(p.kind, esc(p.text));
    });
  };
  Terminal.prototype.run = async function () {
    var self = this;
    while (true) {
      var s = this.scripts[this.idx];
      this.setHeader();
      for (var i = 0; i < s.lines.length; i++) {
        await this.gate.wait();
        var p = this.parse(s.lines[i]);
        if (p.kind === 'cmd') {
          var d = this.line('cmd', ''), txt = p.text, caret = '<span class="caret"></span>';
          for (var c = 1; c <= txt.length; c++) {
            d.innerHTML = esc(txt.slice(0, c)) + caret;
            await sleep(rand(14, 42) / this.speed);
          }
          await sleep(260 / this.speed); d.innerHTML = esc(txt);
        } else if (p.kind === 'bar') {
          var parts = p.text.split('|'), label = parts[0], ms = +parts[1] || 1200, steps = 20;
          var b = this.line('out', '');
          for (var k = 0; k <= steps; k++) {
            b.innerHTML = esc(label) + '  <span class="bar">[' + '█'.repeat(k) + '░'.repeat(steps - k) + ']</span> ' + Math.round(k / steps * 100) + '%';
            await sleep(ms / steps / this.speed);
          }
        } else if (p.kind === 'pause') {
          await sleep((+p.text || 1200) / this.speed);
        } else {
          await sleep(rand(160, 380) / this.speed);
          this.line(p.kind, esc(p.text));
        }
      }
      await sleep(1400 / this.speed);
      this.line('out', '');
      if (this.scripts.length > 1) this.idx = (this.idx + 1) % this.scripts.length;
      if (this.opts.clear !== false) { await sleep(500); this.body.innerHTML = ''; }
    }
  };

  /* ---------- Animated 2×2 matrix ---------- */
  function Matrix2x2(host, cfg) {
    var el = document.createElement('div'); el.className = 'm2x2';
    el.innerHTML = '<div class="crosshair"></div><div class="crosshair v"></div>' +
      '<div class="q tl">' + esc(cfg.q[0]) + '</div><div class="q tr win">' + esc(cfg.q[1]) + '</div>' +
      '<div class="q bl">' + esc(cfg.q[2]) + '</div><div class="q br">' + esc(cfg.q[3]) + '</div>' +
      '<div class="axis-y">↑ ' + esc(cfg.y) + '</div><div class="axis-x">' + esc(cfg.x) + ' →</div><div class="readout" aria-live="polite"></div>';
    el.setAttribute('role', 'img'); el.setAttribute('aria-label', cfg.aria || '2 by 2 prioritisation matrix');
    host.appendChild(el);
    var ro = el.querySelector('.readout');
    var pts = cfg.points.map(function (p) {
      var d = document.createElement('div'); d.className = 'pt'; d.textContent = p.id; d.title = p.label || p.id;
      d.style.left = '50%'; d.style.top = '50%'; el.appendChild(d); return { p: p, d: d };
    });
    var gate = new Gate(el);
    function place(jitter) {
      pts.forEach(function (o) {
        var x = Math.min(92, Math.max(8, o.p.x + (jitter ? rand(-6, 6) : 0)));
        var y = Math.min(88, Math.max(10, o.p.y + (jitter ? rand(-6, 6) : 0)));
        o.d.style.left = x + '%'; o.d.style.top = y + '%';
      });
    }
    if (reduced) { place(false); pts.forEach(function (o) { if (o.p.win) o.d.classList.add('sel'); }); ro.textContent = cfg.result; return; }
    (async function loop() {
      while (true) {
        await gate.wait();
        pts.forEach(function (o) { o.d.classList.remove('sel'); o.d.style.left = rand(35, 65) + '%'; o.d.style.top = rand(35, 65) + '%'; });
        ro.textContent = cfg.scoring || 'scoring…';
        await sleep(1200); place(true); await sleep(1900); place(false); await sleep(1500);
        pts.forEach(function (o) { if (o.p.win) o.d.classList.add('sel'); });
        ro.textContent = '';
        var txt = cfg.result;
        for (var i = 1; i <= txt.length; i++) { ro.textContent = txt.slice(0, i); await sleep(28); }
        await sleep(4200);
      }
    })();
  }

  /* ---------- Mode canvases (Design Thinking) ---------- */
  function ModeCanvas(canvas, kind, color) {
    var ctx = canvas.getContext('2d'), w, h, dpr = Math.min(window.devicePixelRatio || 1, 1.5), t0 = performance.now();
    var gate = new Gate(canvas), parts = [];
    var C = { teal: '#3FB8A0', ink: '#CFEDE3', dim: 'rgba(143,169,161,', red: '#E42313', mode: color || '#3FB8A0' };
    function resize() {
      var r = canvas.getBoundingClientRect(); w = Math.max(1, r.width); h = Math.max(1, r.height);
      canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); seed();
    }
    function seed() {
      parts = [];
      var n = kind === 'ideate' ? 0 : kind === 'prototype' ? 18 : 90;
      for (var i = 0; i < n; i++) parts.push({ x: rand(0, w), y: rand(0, h), vx: rand(-.4, .4), vy: rand(-.4, .4), r: rand(1, 3), a: rand(.3, 1), tx: 0, ty: 0, k: i });
    }
    function draw(now) {
      var t = (now - t0) / 1000;
      ctx.clearRect(0, 0, w, h);
      if (kind === 'empathize') {
        // concentric "listening" ripples + live waveform
        var cx = w * 0.5, cy = h * 0.42;
        for (var i = 0; i < 6; i++) {
          var rr = ((t * 40 + i * 50) % 300);
          ctx.strokeStyle = 'rgba(63,184,160,' + (1 - rr / 300) * 0.6 + ')'; ctx.lineWidth = 2;
          ctx.beginPath(); ctx.arc(cx, cy, rr, 0, Math.PI * 2); ctx.stroke();
        }
        ctx.strokeStyle = C.mode; ctx.lineWidth = 2.5; ctx.beginPath();
        for (var x = 0; x <= w; x += 4) {
          var env = Math.exp(-Math.pow((x - cx) / (w * 0.22), 2));
          var y = cy + Math.sin(x * 0.05 + t * 6) * 26 * env * (0.6 + 0.4 * Math.sin(t * 1.7)) + Math.sin(x * 0.13 - t * 9) * 8 * env;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.fillStyle = C.ink; ctx.beginPath(); ctx.arc(cx, cy, 7, 0, Math.PI * 2); ctx.fill();
      } else if (kind === 'define') {
        // scattered findings converge into one focused statement line
        var phase = (t % 9) / 9, conv = phase < 0.15 ? 0 : phase < 0.6 ? (phase - 0.15) / 0.45 : phase < 0.85 ? 1 : 1 - (phase - 0.85) / 0.15;
        var ease = conv * conv * (3 - 2 * conv);
        parts.forEach(function (p, i) {
          p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > w) p.vx *= -1; if (p.y < 0 || p.y > h) p.vy *= -1;
          var tx = w * 0.12 + (i / parts.length) * w * 0.76, ty = h * 0.42;
          var x = p.x + (tx - p.x) * ease, y = p.y + (ty - p.y) * ease;
          ctx.fillStyle = i % 9 === 0 ? C.red : 'rgba(207,237,227,' + p.a + ')';
          ctx.beginPath(); ctx.arc(x, y, p.r + ease * 1.2, 0, Math.PI * 2); ctx.fill();
        });
        ctx.strokeStyle = 'rgba(94,164,94,' + ease + ')'; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(w * 0.12, h * 0.42 + 12); ctx.lineTo(w * 0.12 + w * 0.76 * ease, h * 0.42 + 12); ctx.stroke();
      } else if (kind === 'ideate') {
        // flare: idea bursts from centre ("going wide")
        for (var sN = 0, sMax = Math.max(1, Math.round(w / 500)); sN < sMax; sN++) {
          var ang = rand(0, Math.PI * 2), sp = rand(1, 4.2) * Math.max(1, w / 900);
          parts.push({ x: w / 2, y: h * 0.42, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, life: 1, r: rand(1.5, 4), c: Math.random() < 0.12 ? C.red : Math.random() < 0.5 ? '#E9C46A' : C.teal });
        }
        parts = parts.filter(function (p) { return p.life > 0; });
        parts.forEach(function (p) {
          p.x += p.vx; p.y += p.vy; p.vx *= 0.992; p.vy *= 0.992; p.life -= 0.006;
          ctx.globalAlpha = Math.max(0, p.life); ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        });
        ctx.globalAlpha = 1;
        ctx.fillStyle = '#E9C46A'; ctx.beginPath(); ctx.arc(w / 2, h * 0.42, 10 + Math.sin(t * 5) * 2, 0, Math.PI * 2); ctx.fill();
      } else if (kind === 'prototype') {
        // low-fi wireframe blocks snapping into a layout, then reshuffling
        var cyc = Math.floor(t / 4), local = (t % 4) / 4, snap = Math.min(1, local * 2.2), e2 = 1 - Math.pow(1 - snap, 3);
        var layouts = [[[.08, .1, .84, .12], [.08, .27, .4, .32], [.52, .27, .4, .15], [.52, .46, .4, .13], [.08, .63, .84, .1]],
          [[.08, .1, .25, .53], [.37, .1, .55, .2], [.37, .34, .26, .29], [.67, .34, .25, .29], [.08, .67, .84, .06]],
          [[.2, .08, .6, .1], [.2, .22, .6, .22], [.2, .48, .28, .14], [.52, .48, .28, .14], [.2, .66, .6, .07]]];
        var L = layouts[cyc % layouts.length], P = layouts[(cyc + layouts.length - 1) % layouts.length];
        for (var b = 0; b < L.length; b++) {
          var bx = (P[b][0] + (L[b][0] - P[b][0]) * e2) * w, by = (P[b][1] + (L[b][1] - P[b][1]) * e2) * h,
            bw = (P[b][2] + (L[b][2] - P[b][2]) * e2) * w, bh = (P[b][3] + (L[b][3] - P[b][3]) * e2) * h;
          ctx.strokeStyle = b === 1 ? C.red : C.teal; ctx.lineWidth = 2; ctx.setLineDash([6, 5]);
          ctx.strokeRect(bx, by, bw, bh); ctx.setLineDash([]);
          ctx.strokeStyle = 'rgba(143,169,161,.35)'; ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + bw, by + bh); ctx.moveTo(bx + bw, by); ctx.lineTo(bx, by + bh); ctx.stroke();
        }
      }
    }
    function frame(now) { requestAnimationFrame(frame); if (gate.on()) draw(now); }
    resize(); window.addEventListener('resize', debounce(resize, 200));
    if (reduced) { draw(performance.now() + 3500); return; }
    requestAnimationFrame(frame);
  }

  /* ---------- Feedback capture matrix (DOM) ---------- */
  function FeedbackMatrix(host, notes) {
    var el = document.createElement('div'); el.className = 'fcm';
    var heads = ['+', 'Δ', '?', '💡'], labels = ['Likes', 'Wishes', 'Questions', 'Ideas'];
    el.innerHTML = heads.map(function (h, i) { return '<div><h4 aria-label="' + labels[i] + '">' + h + ' <small style="font:700 .72rem var(--font);letter-spacing:.1em;color:var(--term-dim);text-transform:uppercase">' + labels[i] + '</small></h4><div class="slot"></div></div>'; }).join('');
    host.appendChild(el);
    var slots = el.querySelectorAll('.slot'), gate = new Gate(el);
    if (reduced) { notes.forEach(function (n) { slots[n[0]].insertAdjacentHTML('beforeend', '<span class="note">' + esc(n[1]) + '</span>'); }); return; }
    (async function loop() {
      while (true) {
        slots.forEach(function (s) { s.innerHTML = ''; });
        for (var i = 0; i < notes.length; i++) {
          await gate.wait(); await sleep(rand(500, 1100));
          slots[notes[i][0]].insertAdjacentHTML('beforeend', '<span class="note">' + esc(notes[i][1]) + '</span>');
        }
        await sleep(5000);
      }
    })();
  }

  return { reduced: reduced, sleep: sleep, rand: rand, pick: pick, esc: esc, Gate: Gate, reveal: reveal, CodeRain: CodeRain, Terminal: Terminal, Matrix2x2: Matrix2x2, ModeCanvas: ModeCanvas, FeedbackMatrix: FeedbackMatrix };
})();
