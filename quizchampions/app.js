/* Quiz Champions – ett Kahoot-likt quiz där alla spelar med mobilen.
 * Värdskärmen (TV/dator/surfplatta) skapar ett rum med PIN-kod. Mobilerna ansluter via
 * WebRTC (PeerJS) – inga konton, ingen installation. */
'use strict';
(() => {
// ───────────────────────── Grund ─────────────────────────
const APP_NAME = 'Quiz Champions';
const PEER_PREFIX = 'quizkalas-v1-';
const CATS = window.QK_CATS, BANK = window.QK_BANK, SONGS = window.QK_SONGS, QK_KEY = window.QK_KEY || (q => q.q);
const AGES = {
  '0': { n: 'Barn', s: '6–9 år', e: '🧸', quiz: 'Barnquiz', fr: 'Barnfråga' },
  '1': { n: 'Mellan', s: '10–12 år', e: '🎒', quiz: 'Mellanstadiequiz', fr: 'Mellanstadiefråga' },
  '2': { n: 'Tonåring', s: '13–17 år', e: '🎧', quiz: 'Tonårsquiz', fr: 'Tonårsfråga' },
  '3': { n: 'Vuxen', s: '18+', e: '🧠', quiz: 'Vuxenquiz', fr: 'Vuxenfråga' },
  'f': { n: 'Familj', s: 'blandat, alla åldrar', e: '👨‍👩‍👧‍👦', quiz: 'Familjequiz', fr: 'Familjefråga' },
};
const AVATARS = ['🦊','🐼','🐸','🦁','🐯','🐨','🐵','🦄','🐙','🦖','🐧','🐶','🐱','🐰','🐻','🐲','🦉','🐝','🦋','🐬','🚀','⚽','🎸','🍕','🌈','👑','🤖','👻'];
const SHAPES = [
  '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3.5 29.5 27.5h-27z"/></svg>',
  '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 2 30 16 16 30 2 16z"/></svg>',
  '<svg viewBox="0 0 32 32" aria-hidden="true"><circle cx="16" cy="16" r="13.5"/></svg>',
  '<svg viewBox="0 0 32 32" aria-hidden="true"><rect x="3.5" y="3.5" width="25" height="25" rx="3"/></svg>',
];
const TF_ICONS = ['<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M5 17l7 7L27 8" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
                  '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M7 7l18 18M25 7 7 25" fill="none" stroke="currentColor" stroke-width="5" stroke-linecap="round"/></svg>'];

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const appEl = () => document.getElementById('app');
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
const hash = s => { let h = 2166136261; for (const ch of s) { h ^= ch.codePointAt(0); h = Math.imul(h, 16777619); } return (h >>> 0).toString(36); };
const ordinal = n => `${n}:${(n % 10 === 1 || n % 10 === 2) && n % 100 !== 11 && n % 100 !== 12 ? 'a' : 'e'}`;
const fmt = n => Math.round(n).toLocaleString('sv-SE');
const params = new URLSearchParams(location.search);
const store = {
  get(k, d) { try { const v = localStorage.getItem('qk_' + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { localStorage.setItem('qk_' + k, JSON.stringify(v)); } catch {} },
};
const sess = {
  get(k, d) { try { const v = sessionStorage.getItem('qk_' + k); return v == null ? d : JSON.parse(v); } catch { return d; } },
  set(k, v) { try { sessionStorage.setItem('qk_' + k, JSON.stringify(v)); } catch {} },
  del(k) { try { sessionStorage.removeItem('qk_' + k); } catch {} },
};
const spotifyId = s => { const m = String(s || '').trim().match(/(?:track[/:])([A-Za-z0-9]{22})/) || String(s || '').trim().match(/^([A-Za-z0-9]{22})$/); return m ? m[1] : null; };
const spotifyLink = id => `https://open.spotify.com/track/${id}`;

// ───────────────────────── Nya frågetyper: karta, närmast rätt, ledtrådar ─────────────────────────
// Kartorna (img/map-*.svg) är ritade med x = (lon - lon0) * k, y = lat1 - lat – skriptet finns i tools/maps.py i grenen quiz i Drenicapb/Privat.
const MAPS = {
  world:   { lon0: -180, lon1: 180, lat0: -58, lat1: 84, k: 1, n: 'Världen', ok: 400, far: 3000 },
  europa:  { lon0: -25, lon1: 45, lat0: 34, lat1: 72, k: Math.cos(53 * Math.PI / 180), n: 'Europa', ok: 120, far: 1000 },
  sverige: { lon0: 10, lon1: 25, lat0: 54.8, lat1: 69.4, k: Math.cos(62 * Math.PI / 180), n: 'Sverige', ok: 40, far: 400 },
};
const mapAR = m => (m.lon1 - m.lon0) * m.k / (m.lat1 - m.lat0);
const mapPos = (m, lat, lon) => ({ x: (lon - m.lon0) / (m.lon1 - m.lon0) * 100, y: (m.lat1 - lat) / (m.lat1 - m.lat0) * 100 });
const mapLatLon = (m, fx, fy) => ({ lat: +(m.lat1 - fy * (m.lat1 - m.lat0)).toFixed(4), lon: +(m.lon0 + fx * (m.lon1 - m.lon0)).toFixed(4) });
function distKm(a, b) {
  const R = 6371, r = Math.PI / 180, dLat = (b.lat - a.lat) * r, dLon = (b.lon - a.lon) * r;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}
const fmtKm = d => d < 10 ? `${d.toFixed(1).replace('.', ',')} km` : `${fmt(d)} km`;
function fmtVal(q, v) {
  if (v == null || !isFinite(v)) return '–';
  const s = q.fmt === 'year' ? String(Math.round(v)) : Number(v).toLocaleString('sv-SE', { maximumFractionDigits: (String(q.step).split('.')[1] || '').length });
  return q.unit ? `${s} ${q.unit}` : s;
}
const SPECIAL = new Set(['slider', 'map']);          // frågor utan svarsalternativ
const answerText = q => q.type === 'slider' ? fmtVal(q, q.ans) : q.type === 'map' ? q.place : q.opts[q.correct];
const clueIdx = (q, ms) => Math.min(q.clues.length - 1, Math.max(0, Math.floor(ms / (q.time * 1000 / q.clues.length))));
const cluePts = (q, i) => Math.round(1000 - i * 500 / Math.max(1, q.clues.length - 1));
// Poäng utan svit: rätt/fel, grundpoäng och (för karta/reglage) hur nära
function grade(q, a, ms) {
  if (!a) return { ok: false, base: 0 };
  const speed = clamp(1 - (ms / 1000) / q.time, 0, 1);
  if (q.type === 'slider') {
    const err = Math.abs(a.v - q.ans), range = q.max - q.min, ok = err <= q.tol;
    const acc = clamp(1 - err / (range * 0.25), 0, 1), base = ok ? 1000 : Math.round(850 * acc * acc);
    return { ok, base: Math.round(base * (0.85 + 0.15 * speed)), err };
  }
  if (q.type === 'map') {
    const M = MAPS[q.map], d = distKm(a, q), ok = d <= (q.okKm || M.ok);
    const acc = clamp(1 - d / M.far, 0, 1), base = ok ? 1000 : Math.round(850 * acc * acc);
    return { ok, base: Math.round(base * (0.85 + 0.15 * speed)), km: d };
  }
  const ok = a.c === q.correct;
  if (!ok) return { ok: false, base: 0 };
  if (q.type === 'clue') return { ok, base: cluePts(q, clueIdx(q, ms)) };
  return { ok, base: clamp(Math.round(1000 * (1 - (ms / 1000) / q.time / 2)), 500, 1000) };
}
function gradeDetail(q, a, g) {
  if (!a) return '';
  if (q.type === 'slider') return g.err === 0 ? `Exakt rätt: ${fmtVal(q, q.ans)}` : `Du svarade ${fmtVal(q, a.v)} – rätt svar ${fmtVal(q, q.ans)}`;
  if (q.type === 'map') return `Din nål var ${fmtKm(g.km)} från ${q.place}`;
  return '';
}
// Kartbild med nålar (x/y i procent)
function mapHtml(q, pins = [], cls = '') {
  const M = MAPS[q.map];
  return `<div class="mapbox map-${q.map} ${cls}" style="aspect-ratio:${mapAR(M).toFixed(4)}"><img src="img/map-${q.map}.svg" alt="Karta: ${esc(M.n)}" draggable="false">${pins.map(p => {
    const { x, y } = mapPos(M, p.lat, p.lon);
    return `<span class="mpin ${p.cls || ''}" style="left:${x.toFixed(3)}%;top:${y.toFixed(3)}%">${p.label ? `<b>${esc(p.label)}</b>` : ''}</span>`;
  }).join('')}</div>`;
}
// Tryck på kartan = sätt nål (dra = scrolla). cb({lat, lon})
function bindMapTap(box, q, cb) {
  const M = MAPS[q.map]; let down = null;
  box.addEventListener('pointerdown', e => { down = { x: e.clientX, y: e.clientY }; });
  box.addEventListener('pointerup', e => {
    if (!down || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 10) { down = null; return; }
    down = null; const r = box.getBoundingClientRect();
    const fx = clamp((e.clientX - r.left) / r.width, 0, 1), fy = clamp((e.clientY - r.top) / r.height, 0, 1);
    const ll = mapLatLon(M, fx, fy); let pin = box.querySelector('.mpin.me');
    if (!pin) { pin = document.createElement('span'); pin.className = 'mpin me'; box.appendChild(pin); }
    pin.style.left = (fx * 100).toFixed(3) + '%'; pin.style.top = (fy * 100).toFixed(3) + '%';
    try { navigator.vibrate && navigator.vibrate(15); } catch {}
    cb(ll);
  });
}
function centerMapScroll(scroller, q) {
  const box = scroller.querySelector('.mapbox'); if (!box) return;
  const M = MAPS[q.map], cx = q.map === 'world' ? mapPos(M, 30, 15).x / 100 : 0.5;
  requestAnimationFrame(() => { scroller.scrollLeft = Math.max(0, box.offsetWidth * cx - scroller.clientWidth / 2); });
}
// Reglage för "närmast rätt"
function sliderHtml(q, start) {
  const v = start ?? q.min + Math.round((q.max - q.min) / 2 / q.step) * q.step;
  return `<div class="slider-in"><div class="sv-val" id="svVal">${esc(fmtVal(q, v))}</div>
    <input type="range" id="svRange" min="${q.min}" max="${q.max}" step="${q.step}" value="${v}" aria-label="Ditt svar">
    <div class="sv-ends"><span>${esc(fmtVal(q, q.min))}</span><span>${esc(fmtVal(q, q.max))}</span></div>
    <div class="sv-fine"><button type="button" class="btn ghost" data-sv="-10">−${esc(fmtVal({ ...q, unit: '' }, q.step * 10))}</button><button type="button" class="btn ghost" data-sv="-1">−${esc(fmtVal({ ...q, unit: '' }, q.step))}</button><button type="button" class="btn ghost" data-sv="1">+${esc(fmtVal({ ...q, unit: '' }, q.step))}</button><button type="button" class="btn ghost" data-sv="10">+${esc(fmtVal({ ...q, unit: '' }, q.step * 10))}</button></div></div>`;
}
function bindSlider(root, q) {
  const r = $('#svRange', root), out = $('#svVal', root);
  const set = v => { v = clamp(Math.round(v / q.step) * q.step, q.min, q.max); v = +v.toFixed(6); r.value = v; out.textContent = fmtVal(q, v); };
  r.addEventListener('input', () => set(+r.value));
  $$('[data-sv]', root).forEach(b => b.onclick = () => set(+r.value + +b.dataset.sv * q.step));
  return () => +r.value;
}
// Skala med rätt svar och gissningar (värdens skärm och enspelarläget)
function scaleHtml(q, guesses = [], reveal = false) {
  const pos = v => clamp((v - q.min) / (q.max - q.min) * 100, 0, 100).toFixed(2);
  return `<div class="scale ${reveal ? 'rev' : ''}"><div class="sc-line"></div>
    ${guesses.map((g, i) => `<span class="sc-g" style="left:${pos(g.v)}%;--i:${i % 3}" title="${esc(fmtVal(q, g.v))}">${esc(g.label)}</span>`).join('')}
    ${reveal ? `<span class="sc-ans" style="left:${pos(q.ans)}%"><b>${esc(fmtVal(q, q.ans))}</b></span>` : `<span class="sc-q">?</span>`}
    <div class="sc-ends"><span>${esc(fmtVal(q, q.min))}</span><span>${esc(fmtVal(q, q.max))}</span></div></div>`;
}
function parseAnswer(q, m) {
  if (!m) return null;
  if (q.type === 'slider') { const v = Number(m.v); return isFinite(v) ? { v: clamp(v, q.min, q.max) } : null; }
  if (q.type === 'map') { const lat = Number(m.lat), lon = Number(m.lon); return isFinite(lat) && isFinite(lon) ? { lat: clamp(lat, -90, 90), lon: clamp(lon, -180, 180) } : null; }
  const c = Number(m.c); return c >= 0 && c < q.opts.length ? { c } : null;
}
function spokenOptions(q) {
  const col = ['Röd', 'Blå', 'Gul', 'Grön'];
  if (q.type === 'tf') return 'Sant eller falskt?';
  if (q.type === 'slider') return 'Dra i reglaget och gissa så nära du kan.';
  if (q.type === 'map') return 'Sätt ut nålen på kartan.';
  if (q.type === 'clue') return q.opts.map((o, i) => `${col[i]}: ${o}.`).join(' ');
  return q.opts.map((o, i) => `${col[i]}: ${o}.`).join(' ');
}
function updateClues(q, i) {
  const list = $('#clueBox'); if (list) list.innerHTML = clueListHtml(q, i);
  const v = $('#clueVal'); if (v) { v.textContent = `${fmt(cluePts(q, i))} p`; v.classList.remove('bump'); void v.offsetWidth; v.classList.add('bump'); }
}
function clueListHtml(q, upto, all = false) {
  return `<ol class="clues">${q.clues.map((c, i) => `<li class="${all || i <= upto ? 'on' : ''}" style="--d:${i}">${all || i <= upto ? esc(c) : '<span>Ledtråd ' + (i + 1) + '</span>'}</li>`).join('')}</ol>`;
}

function toast(msg, ms = 2600) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('show'), ms);
}
function dialog(html, buttons) {
  return new Promise(res => {
    const d = document.createElement('div'); d.className = 'modal';
    d.innerHTML = `<div class="modal-box">${html}<div class="modal-btns">${buttons.map((b, i) => `<button class="btn ${b.cls || ''}" data-i="${i}">${esc(b.label)}</button>`).join('')}</div></div>`;
    d.addEventListener('click', e => { const b = e.target.closest('button[data-i]'); if (b) { const ta = d.querySelector('textarea'); dialog.lastText = ta ? ta.value : ''; d.remove(); res(buttons[+b.dataset.i].value); } });
    document.body.appendChild(d);
  });
}
const confirmDlg = (msg, yes = 'Ja', no = 'Avbryt') => dialog(`<p>${esc(msg)}</p>`, [{ label: no, value: false, cls: 'ghost' }, { label: yes, value: true, cls: 'danger' }]);

// ───────────────────────── Ljud & tal ─────────────────────────
const Sound = {
  ctx: null, on: store.get('sound', true),
  ensure() {
    if (!this.ctx) { try { this.ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch { return null; } }
    if (this.ctx.state === 'suspended') this.ctx.resume().catch(() => {});
    return this.ctx;
  },
  tone(freq, dur = 0.15, type = 'sine', vol = 0.15, when = 0) {
    if (!this.on) return; const c = this.ensure(); if (!c) return;
    const t = c.currentTime + Math.max(0, when); const o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(c.destination); o.start(t); o.stop(t + dur + 0.05);
  },
  tick() { this.tone(1046, 0.05, 'square', 0.04); },
  correct() { [523, 659, 784, 1047].forEach((f, i) => this.tone(f, 0.2, 'triangle', 0.17, i * 0.08)); },
  wrong() { this.tone(233, 0.32, 'sawtooth', 0.09); this.tone(175, 0.42, 'sawtooth', 0.08, 0.14); },
  timeUp() { this.tone(392, 0.18, 'square', 0.07); this.tone(262, 0.36, 'square', 0.07, 0.16); },
  join() { this.tone(660, 0.08, 'triangle', 0.12); this.tone(990, 0.14, 'triangle', 0.12, 0.07); },
  fanfare() { [392, 523, 659, 784, 659, 784, 1047].forEach((f, i) => this.tone(f, 0.24, 'triangle', 0.15, i * 0.13)); },
};
const Bgm = {
  timer: null, step: 0,
  start(mode = 'lobby') {
    this.stop(); if (!Sound.on) return; const c = Sound.ensure(); if (!c) return;
    const prog = mode === 'q'
      ? [[220, 262, 330], [196, 247, 294], [175, 220, 262], [196, 247, 330]]
      : [[262, 330, 392], [220, 262, 330], [175, 220, 262], [196, 247, 294]];
    const stepDur = 60 / (mode === 'q' ? 138 : 104) / 2; let next = c.currentTime + 0.06; this.step = 0;
    this.timer = setInterval(() => {
      while (next < c.currentTime + 0.25) {
        const ch = prog[Math.floor(this.step / 8) % 4], s = this.step % 8, w = next - c.currentTime;
        if (s % 2 === 0) Sound.tone(ch[0] / 2, 0.2, 'triangle', 0.075, w);
        Sound.tone(ch[s % 3] * (s >= 4 ? 2 : 1), 0.11, 'sine', 0.035, w);
        this.step++; next += stepDur;
      }
    }, 60);
  },
  stop() { clearInterval(this.timer); this.timer = null; },
};
// Android-appen (WebView) har en egen brygga: uppläsning, spara filer och bakåtknappen
const AppBridge = window.QCApp || null, IN_APP = !!AppBridge;
if (IN_APP) document.documentElement.classList.add('in-app');
const Speech = {
  speak(text) {
    const clean = String(text).replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}]/gu, '').replace(/_+/g, ' ');
    if (IN_APP && AppBridge.speak) { try { AppBridge.speak(clean); } catch {} return; }
    if (!('speechSynthesis' in window)) return;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(clean);
      u.lang = 'sv-SE'; const v = speechSynthesis.getVoices().find(v => /^sv/i.test(v.lang)); if (v) u.voice = v; u.rate = 0.95;
      speechSynthesis.speak(u);
    } catch {}
  },
  stop() { try { if (IN_APP && AppBridge.stopSpeak) AppBridge.stopSpeak(); else speechSynthesis.cancel(); } catch {} },
};
let wakeLock = null;
async function keepAwake() { try { if ('wakeLock' in navigator && document.visibilityState === 'visible') wakeLock = await navigator.wakeLock.request('screen'); } catch {} }
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && wakeLock) keepAwake(); });

// ───────────────────────── Konfetti ─────────────────────────
function confetti(ms = 4500) {
  const cv = $('#confetti'), ctx = cv.getContext('2d'); const dpr = window.devicePixelRatio || 1;
  cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; cv.style.display = 'block';
  const cols = ['#ffd23f', '#3ec7ff', '#2563eb', '#7cf07c', '#ffffff', '#ff9f1c'];
  const ps = Array.from({ length: 170 }, () => ({ x: Math.random() * cv.width, y: -Math.random() * cv.height * 0.6, r: (4 + Math.random() * 6) * dpr, c: cols[Math.floor(Math.random() * cols.length)], vy: (2 + Math.random() * 3.5) * dpr, vx: (Math.random() - 0.5) * 2 * dpr, a: Math.random() * 6, va: (Math.random() - 0.5) * 0.3 }));
  const t0 = performance.now(), run = confetti.run = (confetti.run || 0) + 1;
  (function frame(t) {
    ctx.clearRect(0, 0, cv.width, cv.height);
    if (run !== confetti.run) return;
    for (const p of ps) { p.x += p.vx; p.y += p.vy; p.a += p.va; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.c; ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r); ctx.restore(); }
    if (t - t0 < ms) requestAnimationFrame(frame); else { ctx.clearRect(0, 0, cv.width, cv.height); cv.style.display = 'none'; }
  })(t0);
}
confetti.stop = () => { confetti.run = (confetti.run || 0) + 1; const cv = $('#confetti'); cv.getContext('2d').clearRect(0, 0, cv.width, cv.height); cv.style.display = 'none'; };

// ───────────────────────── Nätverk ─────────────────────────
function peerOptions() {
  const o = { debug: 1 };
  const h = params.get('peerhost');
  if (h) { o.host = h; o.port = +(params.get('peerport') || 443); o.path = params.get('peerpath') || '/'; o.secure = params.get('peersecure') !== '0'; }
  if (params.get('ice') === 'none') o.config = { iceServers: [] };
  return o;
}
const hostPeerId = pin => PEER_PREFIX + pin;
function joinUrl(pin, extra = {}) {
  const p = new URLSearchParams();
  for (const k of ['peerhost', 'peerport', 'peerpath', 'peersecure', 'ice']) if (params.get(k) != null) p.set(k, params.get(k));
  p.set('pin', pin); for (const k in extra) p.set(k, extra[k]);
  return location.origin + location.pathname + '?' + p.toString();
}
const shortUrl = () => (location.host + location.pathname).replace(/index\.html$/, '').replace(/\/$/, '');
function qrSvg(text) {
  try { const qr = qrcode(0, 'M'); qr.addData(text); qr.make(); return qr.createSvgTag({ cellSize: 6, margin: 2, scalable: true }); } catch { return ''; }
}
const send = (conn, msg) => { try { if (conn && conn.open) conn.send(msg); } catch {} };

// ───────────────────────── Quizgenerator ─────────────────────────
const songPool = () => [...SONGS, ...store.get('mysongs', [])];
const bandOf = q => Math.min(...String(q.a || '0123').split('').map(Number));
function autoTime(type, age, setting) {
  const min = { music: 20, clue: 24, map: 15, slider: 15 }[type] || 0;
  if (setting && setting !== 'auto') return Math.max(min, +setting);
  const base = { '0': 30, '1': 25, '2': 20, '3': 20, 'f': 25 }[age] ?? 20;
  if (type === 'music') return Math.max(30, base);
  if (type === 'clue') return 32;
  if (type === 'map') return base + 10;
  if (type === 'slider') return base + 5;
  return type === 'tf' ? Math.max(10, base - 5) : base;
}
// Sprid frågorna så att samma frågemall (q.g) inte kommer tätt efter varandra; handskrivna frågor väger lite tyngre
function spreadGroups(list) {
  const m = new Map();
  for (const q of list) { const k = q.g || ''; if (!m.has(k)) m.set(k, []); m.get(k).push(q); }
  const bs = [...m.entries()].map(([k, a]) => ({ a, w: k ? 1 : 1.6, n: 0 }));
  const out = []; let last = null;
  while (out.length < list.length) {
    const left = bs.filter(b => b.a.length);
    const live = left.length > 1 ? left.filter(b => b !== last) : left;
    const wt = b => b.w * Math.sqrt(b.a.length) / (1 + b.n);
    let r = Math.random() * live.reduce((t, b) => t + wt(b), 0), pick = live[live.length - 1];
    for (const b of live) { r -= wt(b); if (r <= 0) { pick = b; break; } }
    out.push(pick.a.shift()); pick.n++; last = pick;
  }
  return out;
}
function orderPool(list, used, interleaveBands) {
  const fresh = shuffle(list.filter(q => !used.has(hash(QK_KEY(q))))), old = shuffle(list.filter(q => used.has(hash(QK_KEY(q)))));
  let out = [...spreadGroups(fresh), ...spreadGroups(old)];
  if (interleaveBands) {
    const bands = [0, 1, 2, 3].map(b => out.filter(q => bandOf(q) === b));
    out = []; const order = shuffle([0, 1, 2, 3]);
    while (bands.some(b => b.length)) for (const b of order) if (bands[b].length) out.push(bands[b].shift());
  }
  return out;
}
const SONG_FILMS = ['Frost', 'Frost 2', 'Vaiana', 'Lejonkungen', 'Encanto', 'Den lilla sjöjungfrun', 'Aladdin', 'Skönheten och odjuret', 'Trassel', 'Coco',
  'Toy Story', 'Djungelboken', 'Pippi Långstrump', 'Dumma mig', 'Dumma mig 2', 'Trolls', 'Mary Poppins', 'Pocahontas', 'Spider-Man: Into the Spider-Verse', 'Mulan'];
function musicQuestion(s, age, all) {
  const variants = age === '0' ? ['title', 'artist'] : ['artist', 'title', 'artist', 'title'];
  if (s.y && age !== '0') variants.push('decade');
  if (s.fi) variants.push('film', 'film');
  let v = variants[Math.floor(Math.random() * variants.length)];
  // Felsvar: låtar från ungefär samma tid (och helst samma genre) – ett urval räcker även med 20 000 låtar
  const yr = x => x.y || x.yr || 2005;
  const sample = all.length > 600 ? Array.from({ length: 600 }, () => all[Math.floor(Math.random() * all.length)]) : all;
  const near = list => list.map(x => ({ x, k: Math.abs(yr(x) - yr(s)) + Math.random() * 18 + (s.g && x.g && x.g !== s.g ? 12 : 0) + (x.p != null && x.p < 35 ? 8 : 0) })).sort((a, b) => a.k - b.k).map(o => o.x);
  const pickUnique = (key) => { const seen = new Set([String(s[key]).toLowerCase()]); const out = []; for (const x of near(sample)) { const val = String(x[key]); if (!seen.has(val.toLowerCase())) { seen.add(val.toLowerCase()); out.push(val); } if (out.length === 3) break; } return out; };
  let text, right, wrong;
  if (v === 'film') {
    const base = x => String(x).replace(/\s*\d+$/, '').toLowerCase();
    const cands = shuffle([...new Set([...all.map(x => x.fi).filter(Boolean), ...SONG_FILMS])]).filter(f => base(f) !== base(s.fi));
    text = 'Från vilken film kommer låten? 🎬'; right = s.fi; wrong = cands.slice(0, 3);
  } else if (v === 'decade' && s.y) {
    const d = Math.floor(s.y / 10) * 10; const cands = shuffle([d - 30, d - 20, d - 10, d + 10, d + 20].filter(x => x >= 1950 && x <= 2020)).sort((a, b) => Math.abs(a - d) - Math.abs(b - d)).slice(0, 3);
    text = 'Från vilket årtionde är låten? 🎧'; right = `${d}-talet`; wrong = cands.map(x => `${x}-talet`);
  } else if (v === 'title') {
    text = 'Vad heter låten? 🎧'; right = s.t; wrong = pickUnique('t');
  } else {
    v = 'artist'; text = 'Vem sjunger eller spelar låten? 🎧'; right = s.ar; wrong = pickUnique('ar');
  }
  if (wrong.length < 1) return null;
  const opts = shuffle([right, ...wrong]);
  return { id: 'sp:' + s.id, type: 'music', cat: 'spotify', text, opts, correct: opts.indexOf(right), track: { id: s.id, t: s.t, ar: s.ar, y: s.y }, band: bandOf(s) };
}
function buildQuiz(o) {
  if (o.theme) return buildThemeQuiz(o.theme, o.count);
  const used = new Set(store.get('used', []));
  const cats = (o.cats && o.cats.length) ? o.cats : Object.keys(CATS).filter(c => c !== 'spotify');
  const ageOk = q => o.age === 'f' || String(q.a).includes(o.age);
  const diffOk = q => o.diff === 'easy' ? q.d === 1 : o.diff === 'hard' ? q.d >= 2 : true;
  const pools = {};
  for (const c of cats) {
    if (c === 'spotify') {
      // Viktad slumpordning: kända låtar (och egna/handplockade) kommer oftare, oanvända före redan spelade
      const all = songPool();
      const w = s => s.p == null ? 1 : ((s.p + 5) / 105) ** 2 + 0.01;
      const songs = all.filter(s => ageOk({ a: s.a || '0123' }))
        .map(s => ({ s, k: -Math.log(Math.random() || 1e-9) / w(s) + (used.has('sp:' + s.id) ? 1e6 : 0) }))
        .sort((a, b) => a.k - b.k).slice(0, 80).map(x => x.s);
      pools.spotify = songs.map(s => musicQuestion(s, o.age, all)).filter(Boolean);
      continue;
    }
    let p = BANK.filter(q => q.c === c && ageOk(q) && diffOk(q));
    if (p.length < 2) p = BANK.filter(q => q.c === c && ageOk(q));
    pools[c] = orderPool(p, used, o.age === 'f');
  }
  // Musikfrågor: en bestämd andel (minst 20 % när Spotify blandas med annat), resten turas kategorierna om
  const picked = [];
  if (pools.spotify) {
    const others = Object.keys(pools).filter(c => c !== 'spotify' && pools[c].length);
    const share = others.length ? (o.musicShare || Math.max(1 / cats.length, 0.2)) : 1;
    picked.push(...pools.spotify.splice(0, Math.max(1, Math.round(o.count * share))));
    delete pools.spotify;
  }
  const order = shuffle(Object.keys(pools).filter(c => pools[c].length));
  let guard = 0;
  while (picked.length < o.count && order.some(c => pools[c].length) && guard++ < 2000)
    for (const c of order) { if (picked.length >= o.count) break; if (pools[c].length) picked.push(pools[c].shift()); }
  let qs = shuffle(picked);
  const catOf = x => x.c || x.cat;
  for (let i = 1; i < qs.length; i++) if (catOf(qs[i]) === catOf(qs[i - 1])) { const j = qs.findIndex((x, k) => k > i && catOf(x) !== catOf(qs[i - 1])); if (j > 0) [qs[i], qs[j]] = [qs[j], qs[i]]; }
  const runtime = qs.map(q => bankToRuntime(q, o));
  store.set('used', [...used, ...runtime.map(q => q.id)].slice(-2500));
  const catNames = cats.length > 3 ? 'Blandat' : cats.map(c => CATS[c]?.n).join(', ');
  return { title: o.title || `${AGES[o.age].e} ${AGES[o.age].quiz} – ${catNames}`, questions: runtime, age: o.age, gen: o };
}
function bankToRuntime(q, o) {
    if (q.type === 'music') return { ...q, time: autoTime('music', o.age, o.time) };
    const id = hash(QK_KEY(q));
    const base = { id, cat: q.c, band: bandOf(q), text: q.q };
    if (q.type === 'slider') return { ...base, type: 'slider', ans: q.ans, min: q.min, max: q.max, step: q.step || 1, unit: q.unit || '', fmt: q.fmt, tol: q.tol ?? Math.max(q.step || 1, (q.max - q.min) * 0.01), opts: [], correct: -1, time: autoTime('slider', o.age, o.time) };
    if (q.type === 'map') return { ...base, type: 'map', map: q.map, lat: q.lat, lon: q.lon, place: q.place, okKm: q.ok, opts: [], correct: -1, time: autoTime('map', o.age, o.time) };
    if (q.type === 'clue') { const idx = shuffle(q.o.map((_, i) => i)); return { ...base, type: 'clue', clues: q.clues, opts: idx.map(i => q.o[i]), correct: idx.indexOf(0), time: autoTime('clue', o.age, o.time) }; }
    if ('tf' in q) return { id, type: 'tf', cat: q.c, band: bandOf(q), text: q.q, opts: ['Sant', 'Falskt'], correct: q.tf ? 0 : 1, time: autoTime('tf', o.age, o.time) };
    const idx = shuffle(q.o.map((_, i) => i));
    return { id, type: 'mc', cat: q.c, band: bandOf(q), text: q.q, opts: idx.map(i => q.o[i]), correct: idx.indexOf(0), time: autoTime('mc', o.age, o.time) };
}

// ───────────────────────── Musikquiz med tema ─────────────────────────
// Varje tema har en större pott (låtar i tema-songs.js + faktafrågor med tema i bank-musiktema.js).
// Ett quiz tar THEME_COUNT frågor – helst sådana som inte har spelats än – så frågorna roterar mellan omgångarna.
const THEME_COUNT = 50;
const THEMES = [
  { id: 'hiphop', e: '🎤', n: 'Hiphop', d: 'Gissa artist, låt och år – från gangsta rap och södra USA till dagens trap, plus hiphopfakta.' },
  { id: '90tal', e: '📼', n: '90-talet', d: 'Pop, rock, eurodisco och R&B från 1990–1999.' },
  { id: '00tal', e: '💿', n: '00-talet', d: 'Hits från 2000–2009: pop, rock, hiphop och R&B.' },
  { id: 'albansk', e: '🇦🇱', n: 'Albansk musik', d: 'Dua Lipa, Ava Max, Bebe Rexha, Rita Ora med flera – plus Eurovision, Festivali i Këngës och folkmusik.' },
  { id: '2pac', e: '👑', n: '2Pac', d: 'Låtar, album och livet för Tupac Shakur.' },
  { id: 'jul', e: '🎄', n: 'Julmusik', d: 'Julklassiker att lyssna på och frågor om julens låtar – svenska och internationella.' },
];
const TPAC_ALBUMS = ['All Eyez On Me', 'Me Against The World', 'Strictly 4 My N.I.G.G.A.Z...', '2Pacalypse Now', 'The Don Killuminati: The 7 Day Theory', 'R U Still Down? [Remember Me]', 'Until The End Of Time', 'Loyal To The Game', 'Better Dayz'];
function themePool(id) {
  const raw = (window.QK_THEME_SONGS || {})[id] || [];
  return raw.map(([sid, t, ar, y, yok, alb], i) => ({ id: sid, t, ar, y, yok: !!yok, alb, rank: i }));
}
function themeCount(id) {
  const songs = themePool(id).length, facts = BANK.filter(q => q.tema === id).length;
  return { songs, facts, total: songs + facts };
}
function buildThemeQuiz(id, count = THEME_COUNT) {
  const th = THEMES.find(t => t.id === id); if (!th) return null;
  const used = new Set(store.get('used', [])), o = { age: 'f', time: 'auto' };
  const songs = themePool(id), oneArtist = id === '2pac';
  // Låtfrågor: en variant per låt (artist, titel, år eller album) – oanvända varianter först
  const songQ = s => {
    const v = [];
    if (!oneArtist) v.push('artist');
    v.push('title');
    if (s.yok && id !== 'jul') v.push('year');
    if (s.alb && TPAC_ALBUMS.includes(s.alb)) v.push('album');
    const fresh = v.filter(x => !used.has(`sp:${s.id}:${x}`)), pick = (fresh.length ? fresh : v)[Math.floor(Math.random() * (fresh.length || v.length))];
    let q;
    if (pick === 'year') {
      const near = shuffle([-4, -3, -2, 2, 3, 4]).map(d => s.y + d).filter(y => y <= 2020).slice(0, 3);
      const opts = shuffle([s.y, ...near].map(String));
      q = { type: 'music', cat: 'spotify', text: 'Vilket år kom låten? 🎧', opts, correct: opts.indexOf(String(s.y)) };
    } else if (pick === 'album') {
      const opts = shuffle([s.alb, ...shuffle(TPAC_ALBUMS.filter(a => a !== s.alb)).slice(0, 3)]);
      q = { type: 'music', cat: 'spotify', text: 'Från vilket album kommer låten? 🎧', opts, correct: opts.indexOf(s.alb) };
    } else {
      const m = musicQuestion({ ...s, y: null }, '1', songs);
      if (!m) return null;
      // musicQuestion väljer själv titel eller artist – styr om till den variant vi ville ha
      if ((pick === 'title') !== /heter låten/.test(m.text)) {
        const key = pick === 'title' ? 't' : 'ar', seen = new Set([String(s[key]).toLowerCase()]), wrong = [];
        for (const x of shuffle(songs)) { const val = String(x[key]); if (!seen.has(val.toLowerCase())) { seen.add(val.toLowerCase()); wrong.push(val); } if (wrong.length === 3) break; }
        const opts = shuffle([s[key], ...wrong]);
        q = { type: 'music', cat: 'spotify', text: pick === 'title' ? 'Vad heter låten? 🎧' : 'Vem sjunger eller spelar låten? 🎧', opts, correct: opts.indexOf(s[key]) };
      } else q = m;
    }
    if (!q || q.opts.length < 2 || q.correct < 0) return null;
    return { ...q, id: `sp:${s.id}:${pick}`, track: { id: s.id, t: s.t, ar: s.ar, y: s.yok ? s.y : null }, band: null, time: autoTime('music', 'f', 'auto') };
  };
  // Ordning: oanvända först; bland dem kommer kändare låtar (lägre rank) oftare
  const order = list => list.map(x => ({ x, k: (x.fresh ? 0 : 1e6) - Math.log(Math.random() || 1e-9) * (1 + (x.rank || 0) / 40) })).sort((a, b) => a.k - b.k).map(z => z.x);
  const songC = order(songs.map(s => ({ s, rank: s.rank, fresh: !['artist', 'title', 'year', 'album'].every(v => used.has(`sp:${s.id}:${v}`)) })));
  const facts = BANK.filter(q => q.tema === id);
  const factC = order(facts.map(q => ({ q, rank: 0, fresh: !used.has(hash(QK_KEY(q))) })));
  const nFact = Math.min(factC.length, songC.length ? Math.round(count * 0.4) : count);
  const picked = [...factC.slice(0, nFact).map(x => bankToRuntime(x.q, o))];
  for (const c of songC) { if (picked.length >= count) break; const q = songQ(c.s); if (q) picked.push(q); }
  for (const c of factC.slice(nFact)) { if (picked.length >= count) break; picked.push(bankToRuntime(c.q, o)); }
  // Blanda men undvik för många musikfrågor eller faktafrågor i rad
  let qs = shuffle(picked);
  for (let i = 2; i < qs.length; i++) {
    const m = x => x.type === 'music';
    if (m(qs[i]) === m(qs[i - 1]) && m(qs[i]) === m(qs[i - 2])) { const j = qs.findIndex((x, k) => k > i && m(x) !== m(qs[i])); if (j > 0) [qs[i], qs[j]] = [qs[j], qs[i]]; }
  }
  store.set('used', [...used, ...qs.map(q => q.id)].slice(-4000));
  return { title: `${th.e} ${th.n}`, questions: qs, age: 'f', gen: { theme: id, count } };
}
function ensureThemeSongs() {
  if (window.QK_THEME_SONGS) return Promise.resolve();
  return new Promise(res => { const sc = document.createElement('script'); sc.src = 'tema-songs.js'; sc.onload = sc.onerror = () => res(); document.body.appendChild(sc); });
}
function countMatching(o) {
  const cats = (o.cats && o.cats.length) ? o.cats : Object.keys(CATS).filter(c => c !== 'spotify');
  const ageOk = a => o.age === 'f' || String(a).includes(o.age);
  let n = BANK.filter(q => cats.includes(q.c) && ageOk(q.a) && (o.diff === 'easy' ? q.d === 1 : o.diff === 'hard' ? q.d >= 2 : true)).length;
  if (cats.includes('spotify')) n += songPool().filter(s => ageOk(s.a || '0123')).length;
  return n;
}
function customToRuntime(cq) {
  const questions = cq.qs.map((q, i) => {
    const time = q.time && q.time !== 'auto' ? +q.time : null;
    if (q.type === 'tf') return { id: 'c' + i, type: 'tf', cat: 'egen', text: q.q, opts: ['Sant', 'Falskt'], correct: q.c ? 1 : 0, time: time || 20 };
    const opts = q.o.map(s => String(s || '').trim()); const keep = opts.map((s, j) => ({ s, j })).filter(x => x.s);
    const correct = Math.max(0, keep.findIndex(x => x.j === q.c));
    const base = { id: 'c' + i, cat: 'egen', text: q.q, opts: keep.map(x => x.s), correct };
    if (q.type === 'music') { const id = spotifyId(q.track); return { ...base, type: 'music', cat: 'spotify', track: id ? { id, t: q.sTitle || '', ar: q.sArtist || '', y: null } : null, time: time || 30 }; }
    return { ...base, type: 'mc', time: time || 20 };
  });
  return { title: cq.title || 'Mitt quiz', questions, age: 'f', custom: cq.id };
}
const PRESETS = [
  { id: 'familj', e: '👨‍👩‍👧‍👦', n: 'Familjequiz', d: 'Blandade frågor för alla åldrar, plus några musikfrågor.', o: { age: 'f', cats: [...Object.keys(CATS)], count: 15, diff: 'mix', time: 'auto' } },
  { id: 'barn', e: '🧸', n: 'Barnquiz', d: 'Lätta frågor för 6–9 år. Frågorna läses upp.', tts: true, o: { age: '0', cats: ['djur', 'film', 'mat', 'vet', 'sprak', 'matte', 'sverige', 'kropp', 'spotify'], count: 10, diff: 'mix', time: 'auto' } },
  { id: 'mellan', e: '🎒', n: 'Mellanstadiequiz', d: 'För 10–12 år, alla kategorier.', o: { age: '1', cats: [...Object.keys(CATS)], count: 12, diff: 'mix', time: 'auto' } },
  { id: 'musik', e: '🎧', n: 'Musikquiz', d: 'Gissa låt, artist och årtionde via Spotify, plus musikfakta.', o: { age: 'f', cats: ['spotify', 'musik'], count: 12, diff: 'mix', time: 'auto', title: '🎧 Musikquiz', musicShare: 0.7 } },
  { id: 'sverige', e: '🇸🇪', n: 'Sverigequiz', d: 'Allt om Sverige: kungar, landskap, böcker och traditioner.', o: { age: 'f', cats: ['sverige'], count: 12, diff: 'mix', time: 'auto', title: '🇸🇪 Sverigequiz' } },
  { id: 'geni', e: '🧠', n: 'Geniquiz för vuxna', d: 'Svåra frågor för vuxna i alla kategorier.', o: { age: '3', cats: Object.keys(CATS).filter(c => c !== 'spotify'), count: 15, diff: 'hard', time: 'auto', title: '🧠 Geniquiz' } },
  { id: 'karta', e: '📍', n: 'Kartquiz', d: 'Sätt ut nålen på kartan – städer, länder och platser i Sverige, Europa och världen.', o: { age: 'f', cats: ['karta'], count: 10, diff: 'mix', time: 'auto', title: '📍 Kartquiz' } },
  { id: 'ledtradar', e: '🕵️', n: 'Gissa personen', d: 'Personer, länder, djur och figurer – ledtrådarna kommer en i taget. Ju tidigare du svarar, desto mer poäng.', o: { age: 'f', cats: ['ledtrad'], count: 10, diff: 'mix', time: 'auto', title: '🕵️ Gissa personen' } },
  { id: 'narmast', e: '🎯', n: 'Närmast vinner', d: 'Gissa årtal, höjder och antal med reglaget – närmast rätt får mest poäng.', o: { age: 'f', cats: ['narmast'], count: 10, diff: 'mix', time: 'auto', title: '🎯 Närmast vinner' } },
  { id: 'mix', e: '🎪', n: 'Kahoot-mix', d: 'Alla frågetyper blandat: karta, ledtrådar, närmast rätt, musik och vanliga frågor.', o: { age: 'f', cats: ['karta', 'ledtrad', 'narmast', 'spotify', 'geo', 'film', 'sport', 'hist'], count: 16, diff: 'mix', time: 'auto', title: '🎪 Kahoot-mix' } },
  { id: 'snabb', e: '⚡', n: 'Blixtquiz', d: '10 frågor, 10 sekunder per fråga. Snabbast vinner!', o: { age: 'f', cats: Object.keys(CATS).filter(c => c !== 'spotify'), count: 10, diff: 'easy', time: 10, title: '⚡ Blixtquiz' } },
];

// ───────────────────────── Spotify på värdskärmen ─────────────────────────
const Sp = {
  api: null, ctrl: null, loading: null, playing: false, ready: false, hintT: null, track: null,
  dock: () => document.getElementById('spotifyDock'),
  load() {
    if (this.loading) return this.loading;
    this.loading = new Promise(res => {
      window.onSpotifyIframeApiReady = api => { this.api = api; res(api); };
      const s = document.createElement('script'); s.src = 'https://open.spotify.com/embed/iframe-api/v1'; s.async = true;
      s.onerror = () => res(null); document.body.appendChild(s); setTimeout(() => res(this.api), 9000);
    });
    return this.loading;
  },
  makeCtrl(uri) {
    return new Promise(res => {
      const host = document.getElementById('spEmbed'); host.innerHTML = '<div id="spEmbedInner"></div>';
      let done = false; const finish = () => { if (!done) { done = true; res(this.ctrl); } };
      try {
        this.api.createController($('#spEmbedInner'), { uri, width: '100%', height: 152, theme: 'dark' }, ctrl => {
          this.ctrl = ctrl; this.ensureAllow();
          ctrl.addListener('ready', () => { this.ready = true; finish(); });
          ctrl.addListener('playback_update', e => { const p = !(e && e.data && e.data.isPaused); if (p !== this.playing) { this.playing = p; this.dock().classList.toggle('sp-playing', p); if (p) this.hideHint(); } });
          setTimeout(finish, 4000);
        });
      } catch { res(null); }
      setTimeout(finish, 7000);
    });
  },
  ensureAllow() {
    // Säkerställ att iframen får spela upp automatiskt (autoplay + DRM för hela låtar)
    const f = $('#spEmbed iframe'); if (!f) return;
    const need = ['autoplay', 'encrypted-media', 'clipboard-write'];
    const have = (f.getAttribute('allow') || '').split(';').map(x => x.trim()).filter(Boolean);
    const missing = need.filter(n => !have.some(h => h.startsWith(n)));
    if (missing.length) { f.setAttribute('allow', [...have, ...missing].join('; ')); try { const src = f.src; if (src) f.src = src; } catch {} }
  },
  async preload(track) {
    if (!track || this.ctrl) return;
    const api = await this.load(); if (api && !this.ctrl) await this.makeCtrl('spotify:track:' + track.id);
  },
  async play(track) {
    this.track = track; this.playing = false; const d = this.dock();
    d.classList.remove('revealed', 'sp-playing', 'sp-failed', 'sp-hint'); d.classList.add('show');
    $('#spLink').href = spotifyLink(track.id);
    placeDock();
    const api = await this.load();
    if (this.track !== track) return;
    if (!api) { d.classList.add('sp-failed'); return; }
    const uri = 'spotify:track:' + track.id;
    if (!this.ctrl) { await this.makeCtrl(uri); if (!this.ctrl) { d.classList.add('sp-failed'); return; } }
    else { try { this.ctrl.loadUri(uri); } catch {} await new Promise(r => setTimeout(r, 900)); }
    if (this.track !== track) return;
    try { this.ctrl.play(); } catch {}
    clearTimeout(this.hintT); this.hintT = setTimeout(() => { if (!this.playing && this.track === track) d.classList.add('sp-hint'); }, 3500);
  },
  hideHint() { clearTimeout(this.hintT); this.dock().classList.remove('sp-hint'); },
  reveal() { this.dock().classList.add('revealed'); this.hideHint(); },
  stop() { this.track = null; clearTimeout(this.hintT); try { this.ctrl && this.ctrl.pause(); } catch {} const d = this.dock(); d.classList.remove('show', 'revealed', 'sp-hint', 'sp-failed', 'sp-playing'); placeDock(); },
};
function placeDock() {
  const d = Sp.dock(), slot = $('#mediaSlot');
  if (!slot || !d.classList.contains('show')) { Object.assign(d.style, { visibility: 'hidden', left: '-10000px', top: '0px' }); return; }
  const r = slot.getBoundingClientRect(); d.style.visibility = 'visible';
  Object.assign(d.style, { left: (r.left + scrollX) + 'px', top: (r.top + scrollY) + 'px', width: r.width + 'px' });
}
addEventListener('resize', placeDock);

// ═════════════════════════ VÄRD ═════════════════════════
const Host = {
  peer: null, pin: null, quiz: null, players: new Map(), djs: new Set(), phase: 'idle', qi: -1,
  qStart: 0, deadline: 0, answers: new Map(), tickT: null, phaseT: null, hbT: null, settings: null, lastSecond: null,

  defaults() { return Object.assign({ showText: true, tts: false, auto: true, music: 'screen' }, store.get('hostSettings2', {})); },
  saveSettings() { store.set('hostSettings2', { showText: this.settings.showText, auto: this.settings.auto, music: this.settings.music }); },
  // Auto-läge: när alla har svarat (eller tiden är slut) visas svaret, sedan topplistan och nästa fråga – utan att någon trycker
  autoMs() { const q = this.quiz && this.quiz.questions[this.qi]; return this.phase === 'reveal' ? (q && q.type === 'music' ? 7000 : 5000) : 5000; },
  scheduleAuto() {
    clearTimeout(this.phaseT); clearInterval(this.cdT); this.phaseT = this.cdT = null;
    if (!this.settings.auto || !['reveal', 'board'].includes(this.phase)) { updateCountdown(null); return; }
    const ms = this.autoMs(), end = Date.now() + ms, phase = this.phase;
    const upd = () => updateCountdown(Math.max(0, Math.ceil((end - Date.now()) / 1000)), ms);
    upd(); this.cdT = setInterval(upd, 250);
    this.phaseT = setTimeout(() => { clearInterval(this.cdT); if (this.phase !== phase) return; phase === 'reveal' ? this.afterReveal() : this.next(); }, ms);
  },
  toggleAuto() {
    this.settings.auto = !this.settings.auto; this.saveSettings();
    $$('.auto-tog').forEach(b => { b.classList.toggle('on', this.settings.auto); b.innerHTML = autoLabel(); });
    if (['reveal', 'board'].includes(this.phase)) this.scheduleAuto();
    toast(this.settings.auto ? '⏩ Auto på – spelet går vidare när alla har svarat' : '⏸ Auto av – tryck själv för att gå vidare');
  },
  hasMusic() { return this.quiz && this.quiz.questions.some(q => q.type === 'music'); },
  preloadMusic() { if (this.settings.music !== 'screen') return; const q = this.quiz.questions.find(x => x.type === 'music' && x.track); if (q) Sp.preload(q.track); },

  open(quiz, extra = {}) {
    this.quiz = quiz;
    this.settings = Object.assign(this.defaults(), { tts: quiz.age === '0' }, extra);
    if (this.peer && !this.peer.destroyed && this.peer.open) { this.toLobby(true); return; }
    if (this.peer) { try { this.peer.destroy(); } catch {} this.peer = null; }
    this.players.clear(); this.djs.clear();
    renderHostConnecting();
    const tryOpen = (attempt = 0) => {
      this.pin = String(100000 + Math.floor(Math.random() * 900000));
      const peer = new Peer(hostPeerId(this.pin), peerOptions()); this.peer = peer;
      peer.on('open', () => { if (this.peer === peer) { this.toLobby(false); this.startHeartbeat(); } });
      peer.on('connection', c => this.onConn(c));
      peer.on('disconnected', () => { if (this.peer === peer && !peer.destroyed) setTimeout(() => { try { peer.reconnect(); } catch {} }, 1000); });
      peer.on('error', err => {
        if (this.peer !== peer) return;
        if (err.type === 'unavailable-id' && attempt < 5) { peer.destroy(); tryOpen(attempt + 1); return; }
        if (this.phase === 'idle') renderHostError(err);
        else if (['network', 'server-error', 'socket-error', 'socket-closed'].includes(err.type)) toast('Tappade kontakten med servern – försöker igen…');
      });
    };
    tryOpen();
  },
  close() {
    this.stopTimers(); clearInterval(this.hbT); Bgm.stop(); Sp.stop(); Speech.stop();
    for (const p of this.players.values()) send(p.conn, { t: 'bye' });
    for (const c of this.djs) send(c, { t: 'bye' });
    setTimeout(() => { try { this.peer && this.peer.destroy(); } catch {} this.peer = null; }, 200);
    this.players.clear(); this.djs.clear(); this.phase = 'idle'; this.quiz = null;
  },
  stopTimers() { clearInterval(this.tickT); clearTimeout(this.phaseT); clearInterval(this.cdT); this.tickT = this.phaseT = this.cdT = null; },
  toLobby(keepPlayers) {
    this.stopTimers(); Sp.stop(); Speech.stop();
    this.phase = 'lobby'; this.qi = -1;
    if (keepPlayers) for (const p of this.players.values()) Object.assign(p, { score: 0, streak: 0, lastRes: null, lastPts: 0 });
    renderLobby(); Bgm.start('lobby'); keepAwake();
    this.preloadMusic();
    this.broadcast({ t: 'lobby', count: this.onlineCount(), title: this.quiz.title });
    this.sendDj();
  },
  startHeartbeat() {
    clearInterval(this.hbT);
    this.hbT = setInterval(() => {
      const now = Date.now(); let changed = false;
      for (const p of this.players.values()) {
        if (p.conn && p.conn.open) send(p.conn, { t: 'ping' });
        const on = !!(p.conn && p.conn.open && now - p.seen < 11000);
        if (on !== p.online) { p.online = on; changed = true; }
      }
      for (const c of this.djs) { if (c.open) send(c, { t: 'ping' }); else this.djs.delete(c); }
      if (changed) this.refreshPlayers();
    }, 3000);
  },
  onConn(conn) {
    conn.on('data', m => this.onData(conn, m));
    conn.on('close', () => this.onClose(conn));
    conn.on('error', () => this.onClose(conn));
  },
  onClose(conn) {
    if (conn._role === 'dj') { this.djs.delete(conn); updateDjStatus(); return; }
    const p = this.players.get(conn._cid);
    if (p && p.conn === conn) { p.online = false; this.refreshPlayers(); }
  },
  onData(conn, m) {
    if (!m || typeof m !== 'object') return;
    const p = this.players.get(conn._cid);
    if (p) { p.seen = Date.now(); if (!p.online && p.conn === conn) { p.online = true; this.refreshPlayers(); } }
    if (m.t === 'hello') return this.onHello(conn, m);
    if (m.t === 'ans') return this.onAnswer(conn, m);
  },
  onHello(conn, m) {
    if (m.role === 'dj') {
      conn._role = 'dj'; this.djs.add(conn);
      send(conn, { t: 'welcome', role: 'dj', pin: this.pin, title: this.quiz.title });
      this.sendDj(conn); updateDjStatus(); toast('🎧 DJ-mobilen är ansluten'); return;
    }
    const name = String(m.name || '').replace(/\s+/g, ' ').trim().slice(0, 16);
    if (!name) { send(conn, { t: 'err', code: 'name', msg: 'Skriv ett namn.' }); return; }
    const cid = String(m.cid || uid());
    let p = this.players.get(cid);
    if (!p) {
      const same = [...this.players.values()].find(x => x.name.toLowerCase() === name.toLowerCase());
      if (same) {
        if (same.online && same.conn && same.conn.open && same.conn !== conn) { send(conn, { t: 'err', code: 'name', msg: `Namnet "${name}" är redan taget – välj ett annat.` }); return; }
        this.players.delete(same.cid); same.cid = cid; p = same; this.players.set(cid, p);
      }
    }
    const isNew = !p;
    const avatar = String(m.avatar || '🙂').slice(0, 8);
    if (!p) { p = { cid, name, avatar, score: 0, streak: 0, lastRes: null, lastPts: 0 }; this.players.set(cid, p); }
    else { p.name = name; p.avatar = avatar; }
    if (p.conn && p.conn !== conn) { try { p.conn.close(); } catch {} }
    p.conn = conn; p.online = true; p.seen = Date.now(); conn._cid = cid;
    send(conn, { t: 'welcome', role: 'player', pin: this.pin, title: this.quiz.title, total: this.quiz.questions.length, showText: this.settings.showText, you: { name: p.name, avatar: p.avatar, score: p.score } });
    this.syncPlayer(p);
    if (isNew) { Sound.join(); if (this.phase === 'lobby') bumpPlayer(cid); }
    this.refreshPlayers();
  },
  syncPlayer(p) {
    const q = this.quiz.questions[this.qi];
    switch (this.phase) {
      case 'lobby': send(p.conn, { t: 'lobby', count: this.onlineCount(), title: this.quiz.title }); break;
      case 'ready': send(p.conn, this.readyMsg(q)); break;
      case 'question': send(p.conn, this.answers.has(p.cid) ? { t: 'ack', qi: this.qi } : this.questionMsg(q)); break;
      case 'reveal': case 'board': send(p.conn, p.lastRes && p.lastRes.qi === this.qi ? p.lastRes : { t: 'wait' }); break;
      case 'end': send(p.conn, this.endMsg(p)); break;
    }
  },
  onlineCount() { return [...this.players.values()].filter(p => p.online).length; },
  broadcast(msg) { for (const p of this.players.values()) send(p.conn, msg); },
  refreshPlayers() {
    if (this.phase === 'lobby') { updateLobbyPlayers(); this.broadcast({ t: 'lobby', count: this.onlineCount(), title: this.quiz.title }); }
    else if (this.phase === 'question') updateAnswerCount();
  },
  kick(cid) {
    const p = this.players.get(cid); if (!p) return;
    send(p.conn, { t: 'kicked' }); setTimeout(() => { try { p.conn && p.conn.close(); } catch {} }, 300);
    this.players.delete(cid); this.refreshPlayers();
  },
  readyMsg(q) { return { t: 'ready', qi: this.qi, total: this.quiz.questions.length, cat: q.cat, type: q.type, text: q.text, showText: this.settings.showText }; },
  questionMsg(q) {
    const m = { t: 'q', qi: this.qi, total: this.quiz.questions.length, type: q.type, n: q.opts.length, opts: this.settings.showText ? q.opts : null, text: q.text, time: q.time, left: Math.max(0, this.deadline - Date.now()) };
    if (q.type === 'slider') Object.assign(m, { min: q.min, max: q.max, step: q.step, unit: q.unit, fmt: q.fmt });
    if (q.type === 'map') m.map = q.map;
    if (q.type === 'clue') { m.nClues = q.clues.length; if (this.settings.showText) m.clues = q.clues; }
    return m;
  },
  endMsg(p) {
    const ranked = this.ranked(); const r = ranked.find(x => x.p === p);
    return { t: 'end', rank: r ? r.rank : ranked.length, of: ranked.length, score: p.score, top: ranked.slice(0, 3).map(x => ({ name: x.p.name, avatar: x.p.avatar, score: x.p.score })) };
  },
  ranked() {
    const list = [...this.players.values()].sort((a, b) => b.score - a.score);
    let rank = 0, prev = null; return list.map((p, i) => { if (p.score !== prev) { rank = i + 1; prev = p.score; } return { p, rank }; });
  },
  sendDj(only) {
    const q = this.quiz && this.quiz.questions[this.qi];
    let msg = { t: 'dj', state: 'idle', title: this.quiz ? this.quiz.title : '', total: this.quiz ? this.quiz.questions.length : 0, qi: this.qi };
    if (q && q.type === 'music' && q.track && ['ready', 'question'].includes(this.phase)) msg = { ...msg, state: 'play', track: { id: q.track.id } };
    else if (q && q.type === 'music' && q.track && ['reveal', 'board'].includes(this.phase)) msg = { ...msg, state: 'reveal', track: q.track };
    else if (this.phase === 'end') msg.state = 'end';
    if (only) send(only, msg); else for (const c of this.djs) send(c, msg);
  },

  start() {
    if (!this.players.size) { toast('Vänta tills minst en spelare har anslutit 📱'); return; }
    Sound.ensure(); this.qi = -1;
    for (const p of this.players.values()) Object.assign(p, { score: 0, streak: 0, lastRes: null, lastPts: 0 });
    this.next();
  },
  next() {
    this.stopTimers(); Speech.stop();
    this.qi++;
    if (this.qi >= this.quiz.questions.length) return this.finish();
    const q = this.quiz.questions[this.qi];
    this.answers = new Map(); this.phase = 'ready';
    let ms = q.type === 'music' ? 4500 : clamp(1800 + q.text.length * 40, 3000, 7000);
    if (this.settings.tts) ms = Math.max(ms, clamp(q.text.length * 75, 2500, 9500));
    renderHostReady(q, ms);
    this.broadcast(this.readyMsg(q));
    if (q.type === 'music') {
      Bgm.stop();
      if (q.track && this.settings.music === 'screen') Sp.play(q.track); else Sp.stop();
      this.sendDj();
    } else { Sp.stop(); Bgm.start('lobby'); this.sendDj(); }
    if (this.settings.tts) Speech.speak(q.text);
    this.phaseT = setTimeout(() => this.showQuestion(), ms);
  },
  showQuestion() {
    if (this.phase !== 'ready') return;
    this.stopTimers();
    const q = this.quiz.questions[this.qi];
    this.phase = 'question'; this.qStart = performance.now(); this.deadline = Date.now() + q.time * 1000; this.lastSecond = null;
    renderHostQuestion(q);
    if (q.type !== 'music') Bgm.start('q');
    if (this.settings.tts && q.type !== 'music') Speech.speak(spokenOptions(q));
    this.clueShown = -1;
    for (const p of this.players.values()) send(p.conn, this.questionMsg(q));
    this.tickT = setInterval(() => this.tick(), 200); this.tick();
  },
  tick() {
    const left = Math.max(0, this.deadline - Date.now()); const sec = Math.ceil(left / 1000);
    const q = this.quiz.questions[this.qi];
    const el = $('#timerNum'); if (el) el.textContent = sec;
    const ring = $('#timerRing'); if (ring) ring.style.setProperty('--p', (left / (q.time * 1000)).toFixed(4));
    if (q.type === 'clue') {
      const i = clueIdx(q, q.time * 1000 - left);
      if (i !== this.clueShown) {
        this.clueShown = i; updateClues(q, i);
        if (this.settings.tts) Speech.speak(q.clues[i]);
      }
    }
    if (sec !== this.lastSecond) { this.lastSecond = sec; if (sec <= 5 && sec > 0) Sound.tick(); }
    if (left <= 0) this.endQuestion();
  },
  allAnswered() { const on = [...this.players.values()].filter(p => p.online); return on.length > 0 && on.every(p => this.answers.has(p.cid)); },
  endSoon() { if (this.phase === 'question' && !this.phaseT) this.phaseT = setTimeout(() => { this.phaseT = null; this.endQuestion(); }, 500); },
  onAnswer(conn, m) {
    const p = this.players.get(conn._cid);
    if (!p || this.phase !== 'question' || m.qi !== this.qi || this.answers.has(p.cid)) { if (p && m.qi === this.qi && this.answers.has(p.cid)) send(conn, { t: 'ack', qi: this.qi }); return; }
    const q = this.quiz.questions[this.qi];
    const a = parseAnswer(q, m); if (!a) return;
    this.answers.set(p.cid, { ...a, ms: performance.now() - this.qStart });
    send(conn, { t: 'ack', qi: this.qi });
    updateAnswerCount();
    if (this.allAnswered()) this.endSoon();
  },
  endQuestion() {
    if (this.phase !== 'question') return;
    this.stopTimers(); Bgm.stop();
    const q = this.quiz.questions[this.qi];
    this.phase = 'reveal';
    const dist = q.opts.map(() => 0), guesses = [];
    for (const p of this.players.values()) {
      const a = this.answers.get(p.cid), g = grade(q, a, a ? a.ms : 0); let pts = g.base;
      if (a && !SPECIAL.has(q.type)) dist[a.c]++;
      if (a && SPECIAL.has(q.type)) guesses.push({ ...a, ...g, label: p.avatar, name: p.name });
      if (g.ok) { p.streak++; pts += Math.min(p.streak - 1, 5) * 100; } else p.streak = 0;
      p.prev = p.score; p.score += pts; p.lastPts = pts; p.lastOk = g.ok; p.answered = !!a; p.lastDetail = gradeDetail(q, a, g);
    }
    const ranked = this.ranked();
    ranked.forEach(({ p, rank }, i) => {
      const ahead = i > 0 ? ranked[i - 1].p : null;
      p.lastRes = { t: 'res', qi: this.qi, kind: q.type, ok: p.lastOk, answered: p.answered, pts: p.lastPts, score: p.score, streak: p.streak, rank, of: ranked.length,
        ahead: ahead && ahead.score > p.score ? { name: ahead.name, gap: ahead.score - p.score } : null, correctText: answerText(q), detail: p.lastDetail, last: this.qi === this.quiz.questions.length - 1 };
      send(p.conn, p.lastRes);
    });
    if (q.type === 'music') Sp.reveal();
    this.sendDj();
    renderHostQuestion(q, dist, guesses);
    Sound.timeUp(); setTimeout(() => Sound.correct(), 350);
    this.scheduleAuto();
  },
  afterReveal() {
    this.stopTimers();
    if (this.qi >= this.quiz.questions.length - 1) return this.finish();
    this.phase = 'board'; Sp.stop(); renderHostBoard(); Bgm.start('lobby'); this.sendDj();
    this.scheduleAuto();
  },
  finish() {
    this.stopTimers(); Sp.stop(); Speech.stop(); Bgm.stop();
    this.phase = 'end';
    renderPodium();
    for (const p of this.players.values()) send(p.conn, this.endMsg(p));
    this.sendDj();
    Sound.fanfare(); setTimeout(() => confetti(), 1600);
  },
};

// ───────────── Värdens skärmar ─────────────
function setScreen(html, cls = '') { Object.assign(Sp.dock().style, { visibility: 'hidden', left: '-10000px' }); const a = appEl(); a.className = cls; a.innerHTML = html; window.scrollTo(0, 0); }

const APK_URL = '../app/QuizChampions.apk';
const homeFoot = () => `${fmt(BANK.length)} frågor · ${Object.keys(CATS).length - 1} kategorier · ${fmt(songPool().length)} Spotify-låtar`;
function renderHome() {
  Host.phase === 'idle' || Host.close();
  Solo.quit();
  setScreen(`
  <div class="home">
    <h1 class="brand"><img class="brand-logo" src="img/logo.webp" alt="${APP_NAME}" width="900" height="900"></h1>
    <p class="tagline">Quiz för hela familjen – alla spelar med sin mobil.</p>
    <div class="home-grid">
      <button class="home-card host" id="goHost">
        <span class="hc-ico">🖥️</span><b>Starta ett quiz</b><small>Den här skärmen blir spelplanen – visa den på TV:n eller datorn.</small>
      </button>
      <button class="home-card host solo-card" id="goSolo">
        <span class="hc-ico">🎯</span><b>Spela själv</b><small>Enspelarläge – frågor och svar på den här skärmen. Slå ditt rekord!</small>
      </button>
      <form class="home-card joincard" id="joinForm">
        <span class="hc-ico">📱</span><b>Gå med i ett spel</b>
        <input id="pinIn" inputmode="numeric" autocomplete="off" maxlength="7" placeholder="PIN-kod" aria-label="PIN-kod">
        <button class="btn primary" type="submit">Gå med</button>
      </form>
    </div>
    <button class="btn ghost" id="goEdit">✏️ Mina quiz &amp; låtar</button>
    <p class="foot">${homeFoot()}</p>
    ${!IN_APP && /Android/i.test(navigator.userAgent) ? `<a class="btn ghost small" href="${APK_URL}" download>📲 Ladda ner Android-appen</a>` : ''}
  </div>`, 'scr-home');
  $('#goHost').onclick = () => renderSetup('gen', 'host');
  $('#goSolo').onclick = () => renderSetup('gen', 'solo');
  $('#goEdit').onclick = () => Editor.list();
  $('#joinForm').onsubmit = e => { e.preventDefault(); const pin = $('#pinIn').value.replace(/\D/g, ''); if (pin.length !== 6) { toast('PIN-koden har 6 siffror'); return; } renderJoin(pin); };
}

let setupState = store.get('setup', { age: 'f', cats: Object.keys(CATS).filter(c => c !== 'spotify').concat('spotify'), count: 10, diff: 'mix', time: 'auto' });
let setupMode = 'host';
function renderSetup(tab = 'gen', mode = setupMode) {
  setupMode = mode; const solo = mode === 'solo';
  const s = setupState; const keep = !solo && Host.peer && Host.peer.open;
  const go = (quiz, extra = {}) => solo ? Solo.start(quiz, extra) : Host.open(quiz, extra);
  const chip = (on, attrs, label) => `<button class="chip ${on ? 'on' : ''}" ${attrs}>${label}</button>`;
  const tabs = `<div class="tabs">${[['gen', '✨ Skapa quiz'], ['pre', '📦 Färdiga quiz'], ['mine', '✏️ Mina quiz']].map(([k, l]) => `<button class="tab ${tab === k ? 'on' : ''}" data-tab="${k}">${l}</button>`).join('')}</div>`;
  let body = '';
  if (tab === 'gen') {
    const n = countMatching(s);
    body = `
    <section class="opt"><h3>Ålder</h3><div class="chips">${Object.entries(AGES).map(([k, a]) => chip(s.age === k, `data-age="${k}"`, `${a.e} ${a.n}<small>${a.s}</small>`)).join('')}</div></section>
    <section class="opt"><h3>Kategorier <span class="mini"><button class="link" id="allCats">Alla</button> · <button class="link" id="noCats">Inga</button></span></h3>
      <div class="chips">${Object.entries(CATS).map(([k, c]) => chip(s.cats.includes(k), `data-cat="${k}"`, `${c.e} ${c.n}`)).join('')}</div></section>
    <div class="opt-row">
      <section class="opt"><h3>Antal frågor</h3><div class="chips">${[5, 10, 15, 20, 30].map(v => chip(s.count === v, `data-count="${v}"`, v)).join('')}</div></section>
      <section class="opt"><h3>Svårighet</h3><div class="chips">${[['easy', 'Lätt'], ['mix', 'Blandat'], ['hard', 'Svår']].map(([k, l]) => chip(s.diff === k, `data-diff="${k}"`, l)).join('')}</div></section>
      <section class="opt"><h3>Tid per fråga</h3><div class="chips">${[['auto', 'Auto'], [10, '10 s'], [20, '20 s'], [30, '30 s'], [60, '60 s']].map(([k, l]) => chip(String(s.time) === String(k), `data-time="${k}"`, l)).join('')}</div></section>
    </div>
    <div class="setup-go"><span class="match">${n} frågor matchar${s.cats.includes('spotify') ? ' (inkl. musikfrågor)' : ''}${n && n < s.count ? ` – quizet blir ${n} frågor` : ''}</span><button class="btn primary big" id="createBtn" ${n ? '' : 'disabled'}>${solo ? 'Starta ▶' : keep ? 'Byt till det här quizet ▶' : 'Skapa spelrum ▶'}</button></div>`;
  } else if (tab === 'pre') {
    body = `<div class="presets">${PRESETS.map(p => `<button class="preset" data-pre="${p.id}"><span class="pe">${p.e}</span><b>${esc(p.n)}</b><small>${esc(p.d)}</small><span class="pmeta">${p.o.count} frågor</span></button>`).join('')}</div>
      <h3 class="pre-head">🎵 Musikquiz med tema</h3>
      <p class="muted small pre-sub">${THEME_COUNT} frågor per omgång – nya frågor varje gång tills alla har kommit.</p>
      <div class="presets">${THEMES.map(t => { const c = themeCount(t.id); return `<button class="preset theme" data-theme="${t.id}"><span class="pe">${t.e}</span><b>${esc(t.n)}</b><small>${esc(t.d)}</small><span class="pmeta">${THEME_COUNT} frågor${c.songs ? ` · ${fmt(c.total)} i potten` : ''}</span></button>`; }).join('')}</div>`;
  } else {
    const mine = store.get('myquizzes', []);
    body = mine.length ? `<div class="presets">${mine.map(q => `<button class="preset" data-mine="${q.id}"><span class="pe">📝</span><b>${esc(q.title || 'Namnlöst quiz')}</b><small>${q.qs.length} frågor${q.qs.some(x => x.type === 'music') ? ' · med musik' : ''}</small></button>`).join('')}</div>
      <p class="center"><button class="btn ghost" id="toEditor">✏️ Redigera mina quiz</button></p>`
      : `<div class="empty"><p>Du har inga egna quiz ännu.</p><button class="btn primary" id="toEditor">✏️ Skapa ett eget quiz</button></div>`;
  }
  setScreen(`<div class="setup"><header class="bar"><button class="btn icon ghost" id="back" aria-label="Tillbaka">←</button><h2>${solo ? '🎯 Spela själv' : keep ? 'Välj nytt quiz' : 'Starta ett quiz'}</h2><span></span></header>${tabs}<div class="setup-body">${body}</div></div>`, 'scr-setup');
  $('#back').onclick = () => keep ? Host.toLobby(true) : renderHome();
  $$('[data-tab]').forEach(b => b.onclick = () => renderSetup(b.dataset.tab, mode));
  const save = () => { store.set('setup', setupState); renderSetup('gen', mode); };
  $$('[data-age]').forEach(b => b.onclick = () => { s.age = b.dataset.age; save(); });
  $$('[data-cat]').forEach(b => b.onclick = () => { const c = b.dataset.cat; s.cats = s.cats.includes(c) ? s.cats.filter(x => x !== c) : [...s.cats, c]; save(); });
  $$('[data-count]').forEach(b => b.onclick = () => { s.count = +b.dataset.count; save(); });
  $$('[data-diff]').forEach(b => b.onclick = () => { s.diff = b.dataset.diff; save(); });
  $$('[data-time]').forEach(b => b.onclick = () => { s.time = b.dataset.time === 'auto' ? 'auto' : +b.dataset.time; save(); });
  $('#allCats') && ($('#allCats').onclick = () => { s.cats = Object.keys(CATS); save(); });
  $('#noCats') && ($('#noCats').onclick = () => { s.cats = []; save(); });
  $('#createBtn') && ($('#createBtn').onclick = () => { if (!s.cats.length) { toast('Välj minst en kategori'); return; } go(buildQuiz({ ...s })); });
  $$('[data-pre]').forEach(b => b.onclick = () => { const p = PRESETS.find(x => x.id === b.dataset.pre); go(buildQuiz({ ...p.o }), p.tts ? { tts: true } : {}); });
  $$('[data-theme]').forEach(b => b.onclick = async () => { b.disabled = true; await ensureThemeSongs(); go(buildThemeQuiz(b.dataset.theme)); });
  $$('[data-mine]').forEach(b => b.onclick = () => { const q = store.get('myquizzes', []).find(x => x.id === b.dataset.mine); if (!q || !q.qs.length) { toast('Quizet är tomt'); return; } go(customToRuntime(q)); });
  $('#toEditor') && ($('#toEditor').onclick = () => Editor.list());
}

function renderHostConnecting() { setScreen(`<div class="center-screen"><div class="spinner"></div><h2>Skapar spelrum…</h2><p class="muted">Ansluter till servern</p></div>`); }
function renderHostError(err) {
  setScreen(`<div class="center-screen"><div class="big-emoji">📡</div><h2>Kunde inte skapa spelrummet</h2>
  <p class="muted">Kontrollera att du har internet och försök igen.<br><small>(${esc(err && err.type || err)})</small></p>
  <div class="row"><button class="btn ghost" id="back">← Tillbaka</button><button class="btn primary" id="retry">Försök igen</button></div></div>`);
  const quiz = Host.quiz; $('#back').onclick = () => { Host.close(); renderHome(); }; $('#retry').onclick = () => { Host.peer = null; Host.open(quiz); };
}

function renderLobby() {
  const H = Host, s = H.settings, url = joinUrl(H.pin), pinTxt = H.pin.replace(/(\d{3})(\d{3})/, '$1 $2');
  const local = location.protocol === 'file:';
  const music = H.hasMusic();
  const tog = (k, label, on) => `<label class="tog"><input type="checkbox" data-set="${k}" ${on ? 'checked' : ''}><span></span>${label}</label>`;
  setScreen(`
  <div class="lobby">
    <header class="bar"><button class="btn icon ghost" id="leave" aria-label="Avsluta">✕</button>
      <div class="lob-title"><img class="lob-emblem" src="img/emblem.webp" alt=""><div><b>${esc(H.quiz.title)}</b><small>${H.quiz.questions.length} frågor</small></div></div>
      <button class="btn ghost small" id="change">Byt quiz</button></header>
    <div class="lob-main">
      <section class="join-card">
        <p class="join-how">Skanna QR-koden med mobilkameran<br>– eller öppna <b>Quiz Champions</b> och skriv PIN-koden</p>
        <div class="pin" aria-label="PIN-kod">${pinTxt}</div>
        <div class="qr">${qrSvg(url)}</div>
        <button class="link small show-url" id="showUrl">Visa webbadressen</button>
        ${local ? '<p class="warn">⚠️ Sidan är öppnad som fil. Lägg upp den på en webbadress (t.ex. GitHub Pages) så att mobilerna kan öppna den.</p>' : ''}
      </section>
      <section class="lob-players">
        <div class="pcount"><b id="pCount">0</b> spelare <span class="muted small" id="pHint">– tryck på en spelare för att ta bort</span></div>
        <div class="plist" id="pList"></div>
        <div class="waiting" id="pWait"><div class="dots"><i></i><i></i><i></i></div>Väntar på spelare…</div>
        ${music && s.music === 'dj' ? `<aside class="dj-card"><div class="qr small">${qrSvg(joinUrl(H.pin, { dj: 1 }))}</div><div><b>🎧 DJ-mobil</b><p>Skanna med mobilen som har Spotify. Den mobilen spelar låtarna (koppla gärna till en högtalare) och är inte med och tävlar.</p><p class="dj-status" id="djStatus"></p></div></aside>` : ''}
      </section>
    </div>
    <div class="lob-bottom">
      <div class="settings">
        ${tog('showText', 'Visa svarstext på mobilerna', s.showText)}
        ${tog('tts', 'Läs upp frågorna', s.tts)}
        ${tog('auto', 'Auto: gå vidare när alla har svarat', s.auto)}
        ${tog('sound', 'Ljud', Sound.on)}
        ${music ? `<div class="music-mode"><span>🎧 Musiken spelas:</span>
          <button class="chip ${s.music === 'screen' ? 'on' : ''}" data-music="screen">På den här skärmen</button>
          <button class="chip ${s.music === 'dj' ? 'on' : ''}" data-music="dj">I Spotify-appen på en mobil</button></div>` : ''}
      </div>
      <button class="btn primary big" id="startBtn">Starta quizet ▶</button>
    </div>
  </div>`, 'scr-lobby');
  updateLobbyPlayers(); updateDjStatus();
  $('#showUrl').onclick = e => { e.currentTarget.outerHTML = `<p class="join-url">${esc(shortUrl())}</p>`; };
  $('#leave').onclick = async () => { if (!H.players.size || await confirmDlg('Avsluta spelrummet? Alla spelare kopplas bort.', 'Avsluta')) { H.close(); renderHome(); } };
  $('#change').onclick = () => { Bgm.stop(); renderSetup('gen'); };
  $('#startBtn').onclick = () => H.start();
  $$('[data-set]').forEach(i => i.onchange = () => {
    const k = i.dataset.set;
    if (k === 'sound') { Sound.on = i.checked; store.set('sound', Sound.on); if (Sound.on) Bgm.start('lobby'); else Bgm.stop(); return; }
    s[k] = i.checked; H.saveSettings();
    if (k === 'showText') H.broadcast({ t: 'lobby', count: H.onlineCount(), title: H.quiz.title });
  });
  $$('[data-music]').forEach(b => b.onclick = () => { s.music = b.dataset.music; H.saveSettings(); renderLobby(); H.preloadMusic(); });
  $('#pList').onclick = e => {
    const el = e.target.closest('[data-cid]'); if (!el) return;
    if (el.classList.contains('arm')) H.kick(el.dataset.cid);
    else { $$('.pchip.arm').forEach(x => x.classList.remove('arm')); el.classList.add('arm'); setTimeout(() => el.classList.remove('arm'), 2500); }
  };
}
function updateLobbyPlayers() {
  const list = $('#pList'); if (!list) return;
  const ps = [...Host.players.values()];
  list.innerHTML = ps.map(p => `<button class="pchip ${p.online ? '' : 'off'}" data-cid="${esc(p.cid)}"><span class="av">${esc(p.avatar)}</span><span class="nm">${esc(p.name)}</span><span class="x">✕</span></button>`).join('');
  $('#pCount').textContent = ps.length;
  $('#pWait').style.display = ps.length ? 'none' : '';
  $('#pHint').style.display = ps.length ? '' : 'none';
}
function bumpPlayer(cid) { requestAnimationFrame(() => { const el = $(`[data-cid="${CSS.escape(cid)}"]`); if (el) el.classList.add('pop'); }); }
function updateDjStatus() { const el = $('#djStatus'); if (el) el.innerHTML = Host.djs.size ? '✅ DJ-mobil ansluten' : '⏳ Ingen DJ-mobil ansluten ännu'; }

function hostHeader(q) {
  const H = Host, cat = CATS[q.cat] || { e: '📝', n: 'Eget quiz' };
  const age = H.quiz.age === 'f' && q.band != null && q.type !== 'music' ? `<span class="age-badge">${AGES[String(q.band)].e} ${AGES[String(q.band)].fr}</span>` : '';
  return `<header class="hq-top"><span class="qnum">${H.qi + 1}<small>/${H.quiz.questions.length}</small></span><span class="catchip">${cat.e} ${esc(cat.n)}</span>${age}<span class="grow"></span>${autoBtn()}<button class="btn ghost small" id="endGame">Avsluta</button></header>`;
}
const autoLabel = () => Host.settings && Host.settings.auto ? '⏩ Auto på' : '⏸ Auto av';
const autoBtn = () => `<button class="btn ghost small auto-tog ${Host.settings.auto ? 'on' : ''}" title="Gå vidare automatiskt när alla har svarat">${autoLabel()}</button>`;
function bindEndGame() {
  const b = $('#endGame'); if (b) b.onclick = async () => { if (await confirmDlg('Avsluta quizet nu och visa resultatet?', 'Visa resultat')) Host.finish(); };
  $$('.auto-tog').forEach(t => t.onclick = () => Host.toggleAuto());
}
function updateCountdown(sec, ms) {
  const b = $('#nextBtn'); if (!b) return; const cd = b.querySelector('.cd');
  if (sec == null) { b.classList.remove('auto-cd'); if (cd) cd.textContent = ''; return; }
  if (!b.classList.contains('auto-cd')) { b.style.setProperty('--cd', ms + 'ms'); b.classList.add('auto-cd'); }
  if (cd) cd.textContent = sec > 0 ? ` om ${sec} s` : '';
}

function renderHostReady(q, ms) {
  const H = Host;
  setScreen(`
  <div class="hq ready ${q.type === 'music' ? 'is-music' : ''}">
    ${hostHeader(q)}
    <div class="ready-body">
      ${typeBadge(q.type)}
      <h1 class="qtext big">${esc(q.text)}</h1>
      ${q.type === 'music' ? `<div id="mediaSlot" class="media-slot">${musicSlotInner(q)}</div>` : ''}
      <div class="ready-bar"><i></i></div>
    </div>
  </div>`, 'scr-host');
  bindEndGame();
  $('.ready-bar i').style.animationDuration = ms + 'ms';
  $('.ready-body').onclick = () => H.showQuestion();
  if (q.type === 'music') placeDock();
}
const TYPE_BADGE = { music: '🎧 Musikfråga – lyssna!', map: '📍 Kartfråga – sätt ut nålen!', slider: '🎯 Närmast rätt svar vinner', clue: '🕵️ Ledtrådar – svara tidigt för mest poäng' };
const typeBadge = t => TYPE_BADGE[t] ? `<div class="music-badge ${t !== 'music' ? 'kind-badge' : ''}">${TYPE_BADGE[t]}</div>` : '';
function musicSlotInner(q) {
  if (!q.track) return '<div class="dj-wait">⚠️ Ingen Spotify-låt angiven för frågan</div>';
  if (Host.settings.music === 'dj') return `<div class="dj-wait">🎧 DJ-mobilen spelar låten…${Host.djs.size ? '' : `<br><small>Ingen DJ-mobil ansluten – <a href="${spotifyLink(q.track.id)}" target="_blank" rel="noopener">öppna låten i Spotify</a></small>`}</div>`;
  return '';
}
function optionTiles(q, dist, cls = '') {
  const tf = q.type === 'tf';
  return `<div class="opts n${q.opts.length} ${cls}">${q.opts.map((o, i) => {
    const st = dist ? (i === q.correct ? 'right' : 'wrong') : '';
    return `<div class="opt-tile c${tf ? (i === 0 ? 1 : 0) : i} ${st}"><span class="shape">${tf ? TF_ICONS[i] : SHAPES[i]}</span><span class="otext">${esc(o)}</span>${dist ? `<span class="ocount">${dist[i]}</span>${i === q.correct ? '<span class="tick">✓</span>' : ''}` : ''}</div>`;
  }).join('')}</div>`;
}
function nearList(q, guesses) {
  const key = g => q.type === 'map' ? g.km : g.err;
  const top = [...guesses].sort((a, b) => key(a) - key(b)).slice(0, 5);
  if (!top.length) return '<p class="muted center">Ingen hann svara</p>';
  return `<ol class="near-list">${top.map(g => `<li class="${g.ok ? 'ok' : ''}"><span>${esc(g.label)} ${esc(g.name)}</span><b>${q.type === 'map' ? fmtKm(g.km) : esc(fmtVal(q, g.v))}</b></li>`).join('')}</ol>`;
}
function renderHostQuestion(q, dist, guesses = []) {
  const H = Host, reveal = !!dist, last = H.qi >= H.quiz.questions.length - 1;
  const special = SPECIAL.has(q.type);
  const total = H.players.size, answered = reveal ? (special ? guesses.length : dist.reduce((a, b) => a + b, 0)) : H.answers.size;
  const media = q.type === 'music' ? `<div id="mediaSlot" class="media-slot">${musicSlotInner(q)}</div>` : '';
  const songInfo = reveal && q.type === 'music' && q.track && q.track.t ? `<div class="song-info">🎵 <b>${esc(q.track.t)}</b> – ${esc(q.track.ar)}${q.track.y ? ` (${q.track.y})` : ''}</div>` : '';
  let center = media + songInfo, below = optionTiles(q, dist);
  if (q.type === 'clue') {
    const i = reveal ? q.clues.length - 1 : Math.max(0, H.clueShown ?? 0);
    center = `<div class="clue-panel"><div id="clueBox">${clueListHtml(q, i, reveal)}</div>${reveal ? '' : `<div class="clue-val">Rätt svar nu: <b id="clueVal">${fmt(cluePts(q, i))} p</b></div>`}</div>`;
  } else if (q.type === 'slider') {
    center = reveal ? nearList(q, guesses) : '<div class="hq-hint">🎚️ Dra i reglaget på mobilen – närmast vinner!</div>';
    below = `<div class="hq-scale">${scaleHtml(q, reveal ? guesses : [], reveal)}</div>`;
  } else if (q.type === 'map') {
    center = reveal ? `<div class="map-answer">📍 <b>${esc(q.place)}</b></div>${nearList(q, guesses)}` : `<div class="hq-hint">📍 Sätt ut nålen på kartan i mobilen!<small>${esc(MAPS[q.map].n)}</small></div>`;
    const pins = reveal ? [...guesses.map(g => ({ lat: g.lat, lon: g.lon, label: g.label, cls: 'guess' })), { lat: q.lat, lon: q.lon, cls: 'answer', label: '⭐' }] : [];
    below = `<div class="hq-map">${mapHtml(q, pins)}</div>`;
  }
  setScreen(`
  <div class="hq ${reveal ? 'revealed' : ''} ${q.type === 'music' ? 'is-music' : ''} t-${q.type}">
    ${hostHeader(q)}
    <h1 class="qtext">${esc(q.text)}</h1>
    <div class="hq-mid">
      <div class="timer ${reveal ? 'done' : ''}" id="timerRing" style="--p:1"><span id="timerNum">${reveal ? '✓' : q.time}</span></div>
      <div class="hq-media">${center}${!center ? `<div class="hq-deco">${(CATS[q.cat] || { e: '❓' }).e}</div>` : ''}</div>
      <div class="ans-count"><b id="ansNum">${answered}</b><small id="ansOf">av ${total} svar</small></div>
    </div>
    ${below}
    ${reveal ? `<div class="hq-next"><button class="btn primary big" id="nextBtn">${last ? 'Resultatet' : 'Topplistan'}<span class="cd"></span> ${last ? '🏆' : '▶'}</button></div>` : `<div class="hq-next"><button class="btn ghost small" id="skipBtn">Hoppa över tiden ⏭</button></div>`}
  </div>`, 'scr-host');
  bindEndGame();
  if (reveal) $('#nextBtn').onclick = () => H.afterReveal();
  else $('#skipBtn').onclick = () => H.endQuestion();
  if (q.type === 'music') placeDock();
}
function updateAnswerCount() {
  const n = $('#ansNum'); if (!n) return;
  n.textContent = Host.answers.size; $('#ansOf').textContent = `av ${Host.players.size} svar`;
  n.classList.remove('bump'); void n.offsetWidth; n.classList.add('bump');
}
function renderHostBoard() {
  const H = Host, ranked = H.ranked(), top = ranked.slice(0, 5), max = Math.max(1, ...top.map(r => r.p.score));
  setScreen(`
  <div class="board">
    <header class="bar"><span class="muted">Fråga ${H.qi + 1} av ${H.quiz.questions.length}</span><h2>🏆 Topplistan</h2><span class="row">${autoBtn()}<button class="btn ghost small" id="endGame">Avsluta</button></span></header>
    <ol class="ranks">${top.map(({ p, rank }, i) => `
      <li style="--d:${i * 90}ms"><span class="rk">${rank}</span><span class="av">${esc(p.avatar)}</span>
        <span class="nm">${esc(p.name)}${p.streak >= 2 ? ` <span class="streak">🔥${p.streak}</span>` : ''}</span>
        <span class="barw"><i style="--w:${(p.score / max * 100).toFixed(1)}%"></i></span>
        <span class="sc">${fmt(p.score)}${p.lastPts ? `<small>+${fmt(p.lastPts)}</small>` : ''}</span></li>`).join('')}</ol>
    ${ranked.length > 5 ? `<p class="muted center">…och ${ranked.length - 5} till</p>` : ''}
    <div class="hq-next"><button class="btn primary big" id="nextBtn">Nästa fråga<span class="cd"></span> ▶</button></div>
  </div>`, 'scr-host');
  bindEndGame();
  $('#nextBtn').onclick = () => H.next();
}
function renderPodium() {
  const H = Host, ranked = H.ranked(), [a, b, c] = ranked;
  const col = (r, cls, medal) => r ? `<div class="pod ${cls}"><div class="pav">${esc(r.p.avatar)}</div><div class="pname">${esc(r.p.name)}</div><div class="pscore">${fmt(r.p.score)} p</div><div class="pblock"><span>${medal}</span></div></div>` : `<div class="pod ${cls} empty"></div>`;
  setScreen(`
  <div class="podium-screen">
    <img class="pod-emblem" src="img/emblem.webp" alt="">
    <h1 class="win-title">${a ? `${esc(a.p.name)} vinner!` : 'Slut!'}</h1>
    <div class="podium">${col(b, 'p2', '🥈')}${col(a, 'p1', '🥇')}${col(c, 'p3', '🥉')}</div>
    ${ranked.length > 3 ? `<ol class="rest" start="4">${ranked.slice(3).map(r => `<li><span>${esc(r.p.avatar)} ${esc(r.p.name)}</span><b>${fmt(r.p.score)}</b></li>`).join('')}</ol>` : ''}
    <div class="row center">
      <button class="btn primary big" id="again">🔁 Spela igen (nya frågor)</button>
      <button class="btn ghost" id="newQuiz">Välj annat quiz</button>
      <button class="btn ghost" id="home">Avsluta</button>
    </div>
  </div>`, 'scr-host');
  $('#again').onclick = () => {
    const g = H.quiz.gen; const quiz = g ? buildQuiz({ ...g }) : H.quiz;
    H.quiz = quiz; H.toLobby(true);
  };
  $('#newQuiz').onclick = () => { Bgm.stop(); renderSetup('gen'); };
  $('#home').onclick = () => { H.close(); renderHome(); };
}


// ═════════════════════════ ENSPELARLÄGE ═════════════════════════
const Solo = {
  quiz: null, qi: -1, phase: 'idle', score: 0, streak: 0, bestStreak: 0, right: 0, log: [], tts: false,
  t: null, tickT: null, cdT: null, qStart: 0, deadline: 0, lastSecond: null,
  start(quiz, extra = {}) {
    this.stop(); confetti.stop(); if (Host.phase !== 'idle') Host.close();
    Object.assign(this, { quiz, qi: -1, score: 0, streak: 0, bestStreak: 0, right: 0, log: [], tts: !!extra.tts || quiz.age === '0' });
    Sound.ensure(); keepAwake();
    const m = quiz.questions.find(q => q.type === 'music' && q.track); if (m) Sp.preload(m.track);
    this.next();
  },
  stop() { clearTimeout(this.t); clearInterval(this.tickT); clearInterval(this.cdT); this.t = this.tickT = this.cdT = null; },
  quit() { if (this.phase === 'idle') return; this.stop(); this.phase = 'idle'; Sp.stop(); Speech.stop(); Bgm.stop(); },
  next() {
    this.stop(); Speech.stop(); this.qi++;
    if (this.qi >= this.quiz.questions.length) return this.finish();
    const q = this.quiz.questions[this.qi]; this.phase = 'ready';
    let ms = q.type === 'music' ? 3500 : clamp(1200 + q.text.length * 30, 2000, 5000);
    if (this.tts) ms = Math.max(ms, clamp(q.text.length * 75, 2500, 9500));
    renderSoloReady(q, ms);
    if (q.type === 'music') { Bgm.stop(); if (q.track) Sp.play(q.track); else Sp.stop(); } else { Sp.stop(); Bgm.start('lobby'); }
    if (this.tts) Speech.speak(q.text);
    this.t = setTimeout(() => this.show(), ms);
  },
  show() {
    if (this.phase !== 'ready') return; this.stop();
    const q = this.quiz.questions[this.qi];
    this.phase = 'question'; this.qStart = performance.now(); this.deadline = Date.now() + q.time * 1000; this.lastSecond = null;
    renderSoloQuestion(q);
    if (q.type !== 'music') Bgm.start('q');
    if (this.tts && q.type !== 'music') Speech.speak(spokenOptions(q));
    this.clueShown = -1;
    this.tickT = setInterval(() => this.tick(), 100); this.tick();
  },
  tick() {
    const q = this.quiz.questions[this.qi], left = Math.max(0, this.deadline - Date.now()), sec = Math.ceil(left / 1000);
    const bar = $('#sBar'); if (bar) bar.style.transform = `scaleX(${(left / (q.time * 1000)).toFixed(4)})`;
    const num = $('#sSec'); if (num) num.textContent = sec;
    if (sec !== this.lastSecond) { this.lastSecond = sec; if (sec <= 5 && sec > 0) Sound.tick(); }
    if (q.type === 'clue') {
      const i = clueIdx(q, q.time * 1000 - left);
      if (i !== this.clueShown) { this.clueShown = i; updateClues(q, i); if (this.tts) Speech.speak(q.clues[i]); }
    }
    if (left <= 0) this.answer(null);
  },
  answer(a) {
    if (this.phase !== 'question') return;
    this.stop(); Bgm.stop(); Speech.stop();
    const q = this.quiz.questions[this.qi], ms = performance.now() - this.qStart;
    if (typeof a === 'number') a = { c: a };
    const g = grade(q, a, ms), ok = g.ok; let pts = g.base;
    if (ok) { this.streak++; this.right++; this.bestStreak = Math.max(this.bestStreak, this.streak); pts += Math.min(this.streak - 1, 5) * 100; }
    else this.streak = 0;
    const c = a && 'c' in a ? a.c : (a ? -2 : null);
    this.score += pts; this.phase = 'reveal'; this.log.push({ q, c, ok, pts });
    if (q.type === 'music') Sp.reveal();
    renderSoloQuestion(q, { c, ok, pts, a, g });
    if (ok) Sound.correct(); else Sound.wrong();
    try { navigator.vibrate && navigator.vibrate(ok ? [30, 40, 30] : 120); } catch {}
    const wait = q.type === 'music' ? 6500 : SPECIAL.has(q.type) ? 5500 : ok ? 2800 : 4200, end = Date.now() + wait;
    const upd = () => updateCountdown(Math.max(0, Math.ceil((end - Date.now()) / 1000)), wait);
    upd(); this.cdT = setInterval(upd, 250);
    this.t = setTimeout(() => { if (this.phase === 'reveal') this.next(); }, wait);
  },
  hold() { this.stop(); updateCountdown(null); const h = $('#holdBtn'); if (h) h.remove(); },
  finish() {
    this.stop(); Sp.stop(); Speech.stop(); Bgm.stop(); this.phase = 'end';
    const best = store.get('soloBest', {}), k = this.quiz.title, prev = best[k] || 0, rec = this.score > prev && this.score > 0;
    if (rec) { best[k] = this.score; store.set('soloBest', best); }
    renderSoloEnd(prev, rec);
    const n = this.quiz.questions.length;
    if (rec || this.right / n >= 0.7) { Sound.fanfare(); setTimeout(() => confetti(3500), 700); }
  },
  again() { const g = this.quiz.gen; this.start(g ? buildQuiz({ ...g }) : { ...this.quiz, questions: shuffle(this.quiz.questions) }, { tts: this.tts }); },
};
function soloTop(q) {
  const S = Solo, cat = CATS[q.cat] || { e: '📝', n: 'Eget quiz' };
  return `<header class="hq-top solo-top"><button class="btn icon ghost" id="soloQuit" aria-label="Avsluta">✕</button>
    <span class="qnum">${S.qi + 1}<small>/${S.quiz.questions.length}</small></span><span class="catchip">${q.type === 'music' ? '🎧 Musik' : `${cat.e} ${esc(cat.n)}`}</span>
    <span class="grow"></span><span class="solo-score">⭐ <b>${fmt(S.score)}</b>${S.streak >= 2 ? ` <span class="s-streak">🔥${S.streak}</span>` : ''}</span></header>`;
}
function bindSoloQuit() {
  $('#soloQuit').onclick = async () => {
    if (await confirmDlg('Avsluta quizet?', 'Avsluta')) { Solo.quit(); renderSetup('gen', 'solo'); }
  };
}
function renderSoloReady(q, ms) {
  setScreen(`<div class="solo ${q.type === 'music' ? 'is-music' : ''}">${soloTop(q)}
    <div class="ready-body solo-ready">
      ${typeBadge(q.type)}
      <h1 class="qtext">${esc(q.text)}</h1>
      ${q.type === 'music' ? `<div id="mediaSlot" class="media-slot">${q.track ? '' : '<div class="dj-wait">⚠️ Ingen låt angiven</div>'}</div>` : ''}
      <div class="ready-bar"><i></i></div><p class="muted small">Tryck för att börja direkt</p>
    </div></div>`, 'scr-solo');
  bindSoloQuit();
  $('.ready-bar i').style.animationDuration = ms + 'ms';
  $('.solo-ready').onclick = () => Solo.show();
  if (q.type === 'music') placeDock();
}
const longWords = opts => Math.max(...opts.flatMap(o => String(o).split(/[\s–-]+/).map(w => w.length))) >= 13;
function renderSoloQuestion(q, res) {
  const S = Solo, reveal = !!res, tf = q.type === 'tf', last = S.qi >= S.quiz.questions.length - 1;
  const opts = q.opts.map((o, i) => {
    const st = reveal ? (i === q.correct ? 'right' : i === res.c ? 'picked wrong' : 'wrong') : '';
    return `<button class="p-opt c${tf ? (i === 0 ? 1 : 0) : i} ${st}" data-c="${i}"><span class="shape">${tf ? TF_ICONS[i] : SHAPES[i]}</span><span class="ptext">${esc(o)}</span>${reveal && i === q.correct ? '<span class="tick">✓</span>' : ''}</button>`;
  }).join('');
  const songInfo = reveal && q.type === 'music' && q.track && q.track.t ? `<div class="song-info">🎵 <b>${esc(q.track.t)}</b> – ${esc(q.track.ar)}${q.track.y ? ` (${q.track.y})` : ''}</div>` : '';
  const detail = reveal && res.a ? gradeDetail(q, res.a, res.g) : '';
  const banner = !reveal ? '' : res.ok
    ? `<div class="solo-res ok">✓ Rätt! <b>+${fmt(res.pts)}</b>${S.streak >= 2 ? ` · 🔥 ${S.streak} i rad` : ''}${detail ? `<small>${esc(detail)}</small>` : ''}</div>`
    : res.pts >= 200 ? `<div class="solo-res near">Nära! <b>+${fmt(res.pts)}</b><small>${esc(detail)}</small></div>`
    : `<div class="solo-res bad">${res.c == null ? '⏰ Tiden tog slut' : SPECIAL.has(q.type) ? '✕ För långt ifrån' : '✕ Fel svar'}${res.pts > 0 ? ` <b>+${fmt(res.pts)}</b>` : ''}${detail ? `<small>${esc(detail)}</small>` : ''}</div>`;
  let input = `<div class="p-opts solo-opts n${q.opts.length} ${longWords(q.opts) ? 'lw' : ''}">${opts}</div>`, extra = '';
  if (q.type === 'clue') extra = `<div class="clue-panel solo-clues"><div id="clueBox">${clueListHtml(q, reveal ? q.clues.length - 1 : Math.max(0, S.clueShown ?? 0), reveal)}</div>${reveal ? '' : `<div class="clue-val">Rätt svar nu: <b id="clueVal">${fmt(cluePts(q, Math.max(0, S.clueShown ?? 0)))} p</b></div>`}</div>`;
  if (q.type === 'slider') input = reveal ? `<div class="hq-scale solo-scale">${scaleHtml(q, res.a ? [{ v: res.a.v, label: '🙂' }] : [], true)}</div>`
    : `<form class="solo-special" id="spForm">${sliderHtml(q)}<button class="btn primary big" type="submit">Svara ✓</button></form>`;
  if (q.type === 'map') {
    const pins = reveal ? [...(res.a ? [{ lat: res.a.lat, lon: res.a.lon, cls: 'guess', label: '🙂' }] : []), { lat: q.lat, lon: q.lon, cls: 'answer', label: '⭐' }] : [];
    input = `<form class="solo-special map-in" id="spForm"><div class="mapscroll map-${q.map}">${mapHtml(q, pins)}</div>${reveal ? `<div class="map-answer">📍 <b>${esc(q.place)}</b></div>` : '<p class="muted small center">Tryck på kartan där du tror att det ligger. Dra för att flytta kartan.</p><button class="btn primary big" type="submit" disabled>Svara ✓</button>'}</form>`;
  }
  setScreen(`<div class="solo ${reveal ? 'revealed' : ''} ${q.type === 'music' ? 'is-music' : ''}">${soloTop(q)}
    <div class="solo-timer"><div class="p-timer"><i id="sBar" style="transform:scaleX(${reveal ? 0 : 1})"></i></div><span id="sSec">${reveal ? '' : q.time}</span></div>
    <h1 class="qtext">${esc(q.text)}</h1>
    ${q.type === 'music' ? `<div id="mediaSlot" class="media-slot"></div>` : ''}${extra}${songInfo}${banner}
    ${input}
    ${reveal ? `<div class="solo-next"><button class="btn ghost small" id="holdBtn">⏸ Vänta</button><button class="btn primary big" id="nextBtn">${last ? 'Se resultatet' : 'Nästa'}<span class="cd"></span> ${last ? '🏆' : '▶'}</button></div>` : ''}
  </div>`, 'scr-solo');
  bindSoloQuit();
  if (reveal) { $('#nextBtn').onclick = () => Solo.next(); $('#holdBtn').onclick = () => Solo.hold(); }
  else if (q.type === 'slider') { const get = bindSlider($('#spForm'), q); $('#spForm').onsubmit = e => { e.preventDefault(); Solo.answer({ v: get() }); }; }
  else if (q.type === 'map') {
    let ll = null; const f = $('#spForm');
    bindMapTap($('.mapbox', f), q, x => { ll = x; f.querySelector('button[type=submit]').disabled = false; });
    f.onsubmit = e => { e.preventDefault(); if (ll) Solo.answer(ll); };
  }
  else $$('.solo-opts [data-c]').forEach(b => b.addEventListener('pointerdown', e => { e.preventDefault(); Solo.answer(+b.dataset.c); }, { once: true }));
  if (q.type === 'map') centerMapScroll($('.mapscroll'), q);
  if (q.type === 'music') placeDock();
}
function renderSoloEnd(prev, rec) {
  const S = Solo, n = S.quiz.questions.length, pct = S.right / n;
  const msg = pct === 1 ? 'Alla rätt – perfekt! 🏆' : pct >= 0.8 ? 'Riktigt bra jobbat!' : pct >= 0.5 ? 'Bra kämpat!' : 'Öva lite till – du klarar det!';
  const wrong = S.log.filter(r => !r.ok).map(({ q }) => ({ text: q.type === 'music' && q.track && q.track.t ? `🎧 ${q.track.t} – ${q.track.ar}` : q.text, right: answerText(q) }));
  setScreen(`<div class="solo-end">
    <img class="pod-emblem" src="img/emblem.webp" alt="">
    <h1 class="win-title">${msg}</h1>
    <p class="muted">${esc(S.quiz.title)}</p>
    <div class="solo-stats"><div><b>${S.right}/${n}</b><small>rätt</small></div><div><b>${fmt(S.score)}</b><small>poäng</small></div><div><b>🔥 ${S.bestStreak}</b><small>bästa svit</small></div></div>
    ${rec ? '<p class="solo-rec">🎉 Nytt rekord!</p>' : prev ? `<p class="muted">Ditt rekord: ${fmt(prev)} p</p>` : ''}
    ${wrong.length ? `<details class="solo-review"><summary>Se rätt svar på dina missar (${wrong.length})</summary><ol>${wrong.map(r => `<li><span>${esc(r.text)}</span><b>${esc(r.right)}</b></li>`).join('')}</ol></details>` : ''}
    <div class="row center"><button class="btn primary big" id="again">🔁 Spela igen</button><button class="btn ghost" id="other">Välj annat quiz</button><button class="btn ghost" id="home">Startsidan</button></div>
  </div>`, 'scr-solo');
  $('#again').onclick = () => Solo.again();
  $('#other').onclick = () => { Solo.quit(); renderSetup('gen', 'solo'); };
  $('#home').onclick = () => renderHome();
}

// ═════════════════════════ SPELARE ═════════════════════════
const Player = {
  peer: null, conn: null, pin: null, cid: null, name: '', avatar: '', role: 'player', state: 'idle', lastPing: 0, wdT: null, retryT: null, retries: 0,
  showText: true, cur: null, answeredQi: -1, ackT: null,

  begin(pin, name, avatar, role = 'player') {
    Object.assign(this, { pin, name, avatar, role, state: 'connecting', retries: 0 });
    this.cid = sess.get('cid', null) || uid(); sess.set('cid', this.cid);
    if (role === 'player') store.set('me', { name, avatar });
    renderPConnecting(); keepAwake();
    this.ensurePeer();
    clearInterval(this.wdT);
    this.wdT = setInterval(() => { if (this.state === 'joined' && Date.now() - this.lastPing > 10000) this.lost(); }, 3000);
  },
  ensurePeer() {
    if (this.peer && !this.peer.destroyed) { if (this.peer.disconnected) { try { this.peer.reconnect(); } catch {} } else if (this.peer.open) this.dial(); return; }
    const peer = new Peer(peerOptions()); this.peer = peer;
    peer.on('open', () => { if (this.peer === peer) this.dial(); });
    peer.on('disconnected', () => { if (this.peer === peer && !peer.destroyed && this.state !== 'left') setTimeout(() => { try { peer.reconnect(); } catch {} }, 1200); });
    peer.on('error', err => {
      if (this.peer !== peer) return;
      if (err.type === 'peer-unavailable') {
        if (this.state === 'connecting' && this.retries < 2) { this.retries++; setTimeout(() => this.dial(), 1500); }
        else if (this.state === 'connecting') { this.state = 'idle'; renderJoin(this.pin, `Hittade inget spel med PIN ${this.pin}. Kolla koden på storskärmen.`); }
        else this.lost();
      } else if (['network', 'server-error', 'socket-error', 'socket-closed', 'disconnected'].includes(err.type)) this.lost();
    });
  },
  dial() {
    if (this.state === 'left' || this.state === 'kicked') return;
    try { this.conn && this.conn.close(); } catch {}
    const c = this.peer.connect(hostPeerId(this.pin), { reliable: true, serialization: 'json' }); this.conn = c; let opened = false;
    c.on('open', () => { opened = true; this.retries = 0; this.lastPing = Date.now(); send(c, { t: 'hello', cid: this.cid, name: this.name, avatar: this.avatar, role: this.role }); });
    c.on('data', m => { if (this.conn === c) this.onMsg(m); });
    c.on('close', () => { if (this.conn === c) this.lost(); });
    c.on('error', () => { if (this.conn === c) this.lost(); });
    setTimeout(() => { if (!opened && this.conn === c && this.state !== 'idle') this.lost(); }, 9000);
  },
  lost() {
    if (['left', 'kicked', 'idle'].includes(this.state)) return;
    const wasJoined = this.state === 'joined';
    this.state = wasJoined ? 'reconnecting' : this.state;
    document.body.classList.add('reconnecting');
    clearTimeout(this.retryT);
    this.retryT = setTimeout(() => {
      if (['left', 'kicked', 'idle'].includes(this.state)) return;
      if (!this.peer || this.peer.destroyed) { this.peer = null; this.ensurePeer(); }
      else if (this.peer.disconnected) { try { this.peer.reconnect(); } catch { this.peer.destroy(); this.peer = null; this.ensurePeer(); } }
      else this.dial();
    }, 1500);
  },
  leave() {
    this.state = 'left'; clearInterval(this.wdT); clearTimeout(this.retryT); sess.del('session');
    try { this.conn && this.conn.close(); } catch {} try { this.peer && this.peer.destroy(); } catch {}
    this.peer = this.conn = null; document.body.classList.remove('reconnecting');
  },
  answer(c) {
    const m = this.cur; if (!m || m.t !== 'q' || this.answeredQi === m.qi) return;
    const payload = typeof c === 'object' && c ? { t: 'ans', qi: m.qi, ...c } : { t: 'ans', qi: m.qi, c };
    this.answeredQi = m.qi; send(this.conn, payload);
    try { navigator.vibrate && navigator.vibrate(35); } catch {}
    renderPAnswered(m, c);
    clearTimeout(this.ackT); this.ackT = setTimeout(() => { if (this.cur && this.cur.qi === m.qi && !this.acked) send(this.conn, payload); }, 2500);
    this.acked = false;
  },
  onMsg(m) {
    if (!m || !m.t) return;
    if (m.t === 'ping') { this.lastPing = Date.now(); send(this.conn, { t: 'pong' }); return; }
    this.lastPing = Date.now();
    switch (m.t) {
      case 'welcome':
        this.state = 'joined'; document.body.classList.remove('reconnecting'); this.showText = m.showText !== false;
        sess.set('session', { pin: this.pin, name: this.name, avatar: this.avatar, role: this.role });
        if (m.role === 'dj') renderDj({ state: 'idle', title: m.title });
        break;
      case 'err':
        this.state = 'idle'; try { this.conn.close(); } catch {} sess.del('session'); renderJoin(this.pin, m.msg); break;
      case 'lobby': if (this.role === 'player') renderPLobby(m); break;
      case 'ready': this.cur = m; renderPReady(m); break;
      case 'q': this.cur = m; if (this.answeredQi !== m.qi) renderPAnswer(m); break;
      case 'ack': this.acked = true; if (this.answeredQi !== m.qi) { this.answeredQi = m.qi; renderPAnswered(null, null); } break;
      case 'res': this.cur = m; renderPResult(m); break;
      case 'wait': renderPWait(); break;
      case 'end': this.cur = m; renderPEnd(m); break;
      case 'dj': renderDj(m); break;
      case 'kicked': this.leave(); this.state = 'kicked'; renderPMessage('👋', 'Du togs bort från spelet', 'Värden tog bort dig. Du kan gå med igen om du vill.', true); break;
      case 'bye': this.leave(); renderPMessage('🏁', 'Spelet är avslutat', 'Värden har stängt spelrummet. Tack för att du spelade!', true); break;
    }
  },
};

// ───────────── Spelarens skärmar ─────────────
function clearPinParam() { const p = new URLSearchParams(location.search); p.delete('pin'); p.delete('dj'); history.replaceState(null, '', location.pathname + (p.toString() ? '?' + p : '')); }
function pTop() { return `<header class="p-top"><span class="p-me">${esc(Player.avatar)} ${esc(Player.name)}</span><span class="p-pin">PIN ${esc(Player.pin)}</span></header>`; }
function renderJoin(pin, error = '') {
  const me = store.get('me', { name: '', avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)] });
  let av = me.avatar || AVATARS[0];
  setScreen(`
  <div class="join">
    <header class="bar"><button class="btn icon ghost" id="back" aria-label="Tillbaka">←</button><h2>Gå med</h2><span></span></header>
    <img class="join-emblem" src="img/emblem.webp" alt="" width="240" height="240">
    <form id="jf" class="join-form">
      <label class="lbl">PIN-kod<input id="jPin" inputmode="numeric" maxlength="7" value="${esc(pin || '')}" placeholder="123456" autocomplete="off"></label>
      <label class="lbl">Ditt namn<input id="jName" maxlength="16" value="${esc(me.name || '')}" placeholder="t.ex. Leah" autocomplete="nickname" enterkeyhint="go"></label>
      <div class="lbl">Välj en figur</div>
      <div class="avatars">${AVATARS.map(a => `<button type="button" class="avb ${a === av ? 'on' : ''}" data-av="${a}">${a}</button>`).join('')}</div>
      ${error ? `<p class="err">${esc(error)}</p>` : ''}
      <button class="btn primary big" type="submit">Kör! 🚀</button>
    </form>
  </div>`, 'scr-player');
  $('#back').onclick = () => { clearPinParam(); renderHome(); };
  $$('[data-av]').forEach(b => b.onclick = () => { av = b.dataset.av; $$('.avb').forEach(x => x.classList.toggle('on', x === b)); });
  if (!me.name) setTimeout(() => $('#jName').focus(), 50);
  $('#jf').onsubmit = e => {
    e.preventDefault(); Sound.ensure();
    const p = $('#jPin').value.replace(/\D/g, ''), n = $('#jName').value.trim();
    if (p.length !== 6) { toast('PIN-koden har 6 siffror'); return; }
    if (!n) { toast('Skriv ditt namn'); $('#jName').focus(); return; }
    Player.begin(p, n, av);
  };
}
function renderPConnecting() { setScreen(`<div class="center-screen p"><div class="spinner"></div><h2>Ansluter…</h2><p class="muted">PIN ${esc(Player.pin)}</p></div>`, 'scr-player'); }
function renderPLobby(m) {
  setScreen(`<div class="p-screen lobby-p">${pTop()}<div class="p-mid"><div class="big-av bounce">${esc(Player.avatar)}</div><h2>Du är med, ${esc(Player.name)}!</h2>
    <p class="muted">${m.count} spelare i rummet. Titta på storskärmen – quizet startar snart.</p>
    <p class="p-quiz">${esc(m.title || '')}</p></div></div>`, 'scr-player');
}
function renderPReady(m) {
  const cat = CATS[m.cat] || { e: '📝', n: 'Fråga' };
  setScreen(`<div class="p-screen ready-p">${pTop()}<div class="p-mid"><div class="p-qn">Fråga ${m.qi + 1} av ${m.total}</div>
    <div class="p-cat">${TYPE_BADGE[m.type] || `${cat.e} ${esc(cat.n)}`}</div>
    ${m.showText !== false ? `<p class="p-qtext">${esc(m.text)}</p>` : ''}<div class="ready-spin"></div><p class="muted">Gör dig redo…</p></div></div>`, 'scr-player');
}
function pTimerBar(m) {
  const bar = $('#pBar'); if (!bar) return; const frac = clamp(m.left / (m.time * 1000), 0, 1);
  bar.style.transform = `scaleX(${frac})`; requestAnimationFrame(() => requestAnimationFrame(() => { bar.style.transition = `transform ${m.left}ms linear`; bar.style.transform = 'scaleX(0)'; }));
}
function renderPSpecial(m) {
  const q = { ...m, min: m.min, max: m.max, step: m.step || 1 };
  if (m.type === 'slider') {
    setScreen(`<div class="p-screen answer-p special-p">${pTop()}<p class="p-qtext small">${esc(m.text)}</p><div class="p-timer"><i id="pBar"></i></div>
      <form class="p-special" id="psForm">${sliderHtml(q)}<button class="btn primary big" type="submit">Svara ✓</button></form></div>`, 'scr-player');
    const get = bindSlider($('#psForm'), q);
    $('#psForm').onsubmit = e => { e.preventDefault(); Player.answer({ v: get() }); };
  } else {
    setScreen(`<div class="p-screen answer-p special-p">${pTop()}<p class="p-qtext small">${esc(m.text)}</p><div class="p-timer"><i id="pBar"></i></div>
      <form class="p-special map-in" id="psForm"><div class="mapscroll map-${m.map}">${mapHtml(m)}</div>
      <p class="muted small center">Tryck där du tror att det ligger – dra för att flytta kartan.</p>
      <button class="btn primary big" type="submit" disabled>Sätt nålen här ✓</button></form></div>`, 'scr-player');
    let ll = null; const f = $('#psForm');
    bindMapTap($('.mapbox', f), m, x => { ll = x; f.querySelector('button[type=submit]').disabled = false; });
    f.onsubmit = e => { e.preventDefault(); if (ll) Player.answer(ll); };
    centerMapScroll($('.mapscroll'), m);
  }
  pTimerBar(m);
}
function renderPAnswer(m) {
  if (m.type === 'slider' || m.type === 'map') return renderPSpecial(m);
  const tf = m.type === 'tf';
  const opts = Array.from({ length: m.n }, (_, i) => {
    const color = tf ? (i === 0 ? 1 : 0) : i;
    const label = m.opts ? m.opts[i] : (tf ? (i === 0 ? 'Sant' : 'Falskt') : '');
    return `<button class="p-opt c${color}" data-c="${i}"><span class="shape">${tf ? TF_ICONS[i] : SHAPES[i]}</span>${label ? `<span class="ptext">${esc(label)}</span>` : ''}</button>`;
  }).join('');
  const clue = m.type === 'clue';
  setScreen(`<div class="p-screen answer-p ${clue ? 'clue-p' : ''}">${pTop()}
    ${m.opts ? `<p class="p-qtext small">${esc(m.text)}</p>` : ''}
    ${clue ? `<div class="p-clue"><span id="pClueN">🕵️ Ledtråd 1 av ${m.nClues}</span><b id="pClueV"></b></div>${m.clues ? `<p class="p-clue-text" id="pClueT"></p>` : ''}` : ''}
    <div class="p-timer"><i id="pBar"></i></div>
    <div class="p-opts n${m.n} ${m.opts ? (longWords(m.opts) ? 'lw' : '') : 'noText'}">${opts}</div></div>`, 'scr-player');
  pTimerBar(m);
  $$('[data-c]').forEach(b => b.addEventListener('pointerdown', e => { e.preventDefault(); Player.answer(+b.dataset.c); }, { once: true }));
  if (clue) {
    // Visa vilken ledtråd som syns på storskärmen och vad ett rätt svar ger just nu
    const start = Date.now() - (m.time * 1000 - m.left), q = { clues: Array(m.nClues).fill(''), time: m.time };
    clearInterval(renderPAnswer.clueT);
    const upd = () => {
      if (!$('#pClueN')) { clearInterval(renderPAnswer.clueT); return; }
      const i = clueIdx(q, Date.now() - start);
      $('#pClueN').textContent = `🕵️ Ledtråd ${i + 1} av ${m.nClues}`; $('#pClueV').textContent = `${fmt(cluePts(q, i))} p`;
      if (m.clues && $('#pClueT')) $('#pClueT').textContent = m.clues[i];
    };
    upd(); renderPAnswer.clueT = setInterval(upd, 250);
  }
}
function renderPAnswered(m, c) {
  const cur = m || Player.cur; if (cur && cur.t === 'res') return;
  const tf = cur && cur.type === 'tf';
  let shape = c != null && typeof c !== 'object' ? `<div class="chosen c${tf ? (c === 0 ? 1 : 0) : c}">${tf ? TF_ICONS[c] : SHAPES[c]}</div>` : '';
  if (c && typeof c === 'object') shape = `<div class="big-emoji">${'v' in c ? '🎚️' : '📍'}</div>${'v' in c ? `<p class="sent-val">${esc(fmtVal(cur, c.v))}</p>` : ''}`;
  if (c == null && $('.answered-p')) return;
  setScreen(`<div class="p-screen answered-p">${pTop()}<div class="p-mid">${shape}<h2>Svar skickat!</h2><p class="muted">Väntar på de andra… ⏳</p></div></div>`, 'scr-player');
}
function renderPResult(m) {
  const near = !m.ok && m.pts >= 200;
  const cls = m.ok ? 'ok' : near ? 'near' : 'bad';
  const head = m.ok ? 'Rätt!' : near ? 'Nära!' : (m.answered ? (m.kind === 'map' || m.kind === 'slider' ? 'För långt ifrån' : 'Fel svar') : 'Tiden tog slut');
  const rankTxt = m.rank === 1 ? (m.of > 1 ? 'Du leder! 🏆' : 'Du är etta! 🏆') : `Du ligger på ${ordinal(m.rank)} plats` + (m.ahead ? `<br><small>${fmt(m.ahead.gap)} p efter ${esc(m.ahead.name)}</small>` : '');
  setScreen(`<div class="p-screen result-p ${cls}">${pTop()}<div class="p-mid">
    <div class="res-ico">${m.ok ? '✓' : near ? '≈' : '✕'}</div><h1>${head}</h1>
    ${m.pts > 0 ? `<div class="pts">+${fmt(m.pts)}</div>` : ''}${!m.ok ? `<p class="right-was">Rätt svar: <b>${esc(m.correctText)}</b></p>` : ''}
    ${m.detail ? `<p class="res-detail">${esc(m.detail)}</p>` : ''}
    ${m.streak >= 2 ? `<div class="streak-big">🔥 ${m.streak} rätt i rad!</div>` : ''}
    <div class="res-rank">${rankTxt}</div><div class="res-score">Totalt ${fmt(m.score)} p</div></div></div>`, 'scr-player');
  if (m.ok || near) Sound.correct(); else Sound.wrong();
  try { navigator.vibrate && navigator.vibrate(m.ok || near ? [30, 40, 30] : 120); } catch {}
}
function renderPWait() { setScreen(`<div class="p-screen">${pTop()}<div class="p-mid"><div class="big-emoji">👀</div><h2>Titta på storskärmen</h2><p class="muted">Du är med från nästa fråga.</p></div></div>`, 'scr-player'); }
function renderPEnd(m) {
  const medal = ['🥇', '🥈', '🥉'][m.rank - 1] || '🎖️';
  setScreen(`<div class="p-screen end-p ${m.rank <= 3 ? 'top' : ''}">${pTop()}<div class="p-mid">
    <div class="medal">${medal}</div><h1>${m.rank === 1 ? 'Du vann!' : `${ordinal(m.rank)} plats`}</h1>
    <div class="res-score">${fmt(m.score)} poäng</div><p class="muted">av ${m.of} spelare</p>
    <p class="muted small">Stanna kvar – värden kan starta en ny omgång.</p></div></div>`, 'scr-player');
  if (m.rank <= 3) { Sound.fanfare(); confetti(3500); }
}
function renderPMessage(emoji, title, text, home) {
  setScreen(`<div class="center-screen p"><div class="big-emoji">${emoji}</div><h2>${esc(title)}</h2><p class="muted">${esc(text)}</p>${home ? '<button class="btn primary" id="homeBtn">Till startsidan</button>' : ''}</div>`, 'scr-player');
  if (home) $('#homeBtn').onclick = () => { clearPinParam(); renderHome(); };
}
function renderDj(m) {
  let body;
  if (m.state === 'play') body = `<div class="dj-play"><p class="muted">Fråga ${m.qi + 1} av ${m.total} är en musikfråga</p>
      <a class="btn spotify big" href="${spotifyLink(m.track.id)}" target="_blank" rel="noopener">▶ Spela låten i Spotify</a>
      <a class="link small" href="spotify:track:${esc(m.track.id)}">Öppnas inte appen? Tryck här</a>
      <p class="muted small">Tips: titta inte på Spotify-skärmen – där syns svaret 😉</p></div>`;
  else if (m.state === 'reveal') body = `<div class="dj-play"><div class="big-emoji">🎵</div><h2>${esc(m.track.t || 'Låten')}</h2><p>${esc(m.track.ar || '')}</p><p class="muted small">Du kan pausa Spotify nu. Nästa musikfråga dyker upp här.</p></div>`;
  else if (m.state === 'end') body = `<div class="dj-play"><div class="big-emoji">🏁</div><h2>Quizet är slut!</h2><p class="muted">Tack DJ!</p></div>`;
  else body = `<div class="dj-play"><div class="big-emoji bounce">🎧</div><h2>Du är DJ!</h2><p class="muted">När en musikfråga kommer visas en knapp här. Tryck på den så spelas låten i Spotify på den här mobilen – koppla gärna till en högtalare.</p><p class="p-quiz">${esc(m.title || '')}</p></div>`;
  setScreen(`<div class="p-screen dj-screen"><header class="p-top"><span class="p-me">🎧 DJ-mobil</span><span class="p-pin">PIN ${esc(Player.pin)}</span></header><div class="p-mid">${body}</div></div>`, 'scr-player');
}

// ═════════════════════════ REDIGERARE ═════════════════════════
const Editor = {
  cur: null,
  all() { return store.get('myquizzes', []); },
  saveAll(list) { store.set('myquizzes', list); },
  blankQ(type = 'mc') { return { type, q: '', o: ['', '', '', ''], c: 0, time: 'auto', track: '' }; },
  list() {
    const list = this.all(), songs = store.get('mysongs', []);
    setScreen(`
    <div class="editor">
      <header class="bar"><button class="btn icon ghost" id="back" aria-label="Tillbaka">←</button><h2>Mina quiz &amp; låtar</h2><span></span></header>
      <section class="ed-sec"><div class="ed-head"><h3>📝 Mina quiz</h3><button class="btn primary small" id="newQ">+ Nytt quiz</button></div>
        ${list.length ? `<ul class="ed-list">${list.map(q => `<li><div><b>${esc(q.title || 'Namnlöst quiz')}</b><small>${q.qs.length} frågor</small></div><div class="row">
          <button class="btn small primary" data-play="${q.id}">▶ Spela</button><button class="btn small ghost" data-edit="${q.id}">Redigera</button><button class="btn small ghost danger-t" data-del="${q.id}" aria-label="Radera">🗑</button></div></li>`).join('')}</ul>`
          : '<p class="muted">Inga egna quiz än. Skapa ett med dina egna frågor – t.ex. om familjen!</p>'}
      </section>
      <section class="ed-sec"><div class="ed-head"><h3>🎧 Mina låtar</h3><button class="btn primary small" id="addSong">+ Lägg till låt</button></div>
        <p class="muted small">Låtar du lägger till här blandas in i musikfrågorna när quiz skapas automatiskt. Kopiera länken i Spotify (Dela → Kopiera länk).</p>
        ${songs.length ? `<ul class="ed-list">${songs.map((s, i) => `<li><div><b>${esc(s.t)}</b><small>${esc(s.ar)}${s.y ? ' · ' + s.y : ''}</small></div><div class="row"><a class="btn small ghost" href="${spotifyLink(s.id)}" target="_blank" rel="noopener">▶</a><button class="btn small ghost danger-t" data-delsong="${i}" aria-label="Radera">🗑</button></div></li>`).join('')}</ul>` : ''}
      </section>
      <section class="ed-sec"><h3>💾 Spara &amp; dela</h3><p class="muted small">Exportera dina quiz och låtar till en fil som du kan föra över till en annan enhet.</p>
        <div class="row"><button class="btn ghost" id="exp">⬇️ Exportera</button><button class="btn ghost" id="copy">📋 Kopiera som text</button><label class="btn ghost">⬆️ Importera fil<input type="file" id="imp" accept=".json,application/json" hidden></label><button class="btn ghost" id="paste">📥 Klistra in text</button></div>
      </section>
    </div>`, 'scr-editor');
    $('#back').onclick = () => renderHome();
    $('#newQ').onclick = () => { this.cur = { id: uid(), title: '', qs: [this.blankQ()] }; this.edit(); };
    $$('[data-edit]').forEach(b => b.onclick = () => { this.cur = JSON.parse(JSON.stringify(this.all().find(q => q.id === b.dataset.edit))); this.edit(); });
    $$('[data-play]').forEach(b => b.onclick = () => { const q = this.all().find(x => x.id === b.dataset.play); if (!q.qs.length) return toast('Quizet är tomt'); Host.open(customToRuntime(q)); });
    $$('[data-del]').forEach(b => b.onclick = async () => { if (await confirmDlg('Radera quizet?', 'Radera')) { this.saveAll(this.all().filter(q => q.id !== b.dataset.del)); this.list(); } });
    $$('[data-delsong]').forEach(b => b.onclick = async () => { if (await confirmDlg('Ta bort låten?', 'Ta bort')) { const s = store.get('mysongs', []); s.splice(+b.dataset.delsong, 1); store.set('mysongs', s); this.list(); } });
    $('#addSong').onclick = () => this.songForm();
    const payload = () => JSON.stringify({ format: 'quizkalas', version: 1, quizzes: this.all(), songs: store.get('mysongs', []) }, null, 1);
    $('#exp').onclick = () => { if (IN_APP && AppBridge.saveFile) { toast(AppBridge.saveFile('quiz-champions-mina-quiz.json', payload()) ? 'Sparad i Hämtade filer 📁' : 'Kunde inte spara filen'); return; } const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([payload()], { type: 'application/json' })); a.download = 'quiz-champions-mina-quiz.json'; document.body.appendChild(a); a.click(); a.remove(); };
    $('#copy').onclick = async () => { try { await navigator.clipboard.writeText(payload()); toast('Kopierat! 📋'); } catch { dialog(`<p>Kopiera texten:</p><textarea class="ta" rows="8">${esc(payload())}</textarea>`, [{ label: 'Klar', value: 1, cls: 'primary' }]); } };
    $('#imp').onchange = async e => { const f = e.target.files[0]; if (f) this.importText(await f.text()); };
    $('#paste').onclick = async () => {
      const r = await dialog('<p>Klistra in exporterad text:</p><textarea class="ta" rows="8"></textarea>', [{ label: 'Avbryt', value: null, cls: 'ghost' }, { label: 'Importera', value: 'ok', cls: 'primary' }]);
      if (r === 'ok' && dialog.lastText.trim()) this.importText(dialog.lastText);
    };
  },
  importText(txt) {
    try {
      const d = JSON.parse(txt); if (!d || (d.format !== 'quizkalas' && !Array.isArray(d.quizzes))) throw 0;
      const qs = this.all(), ids = new Set(qs.map(q => q.id)); let nq = 0, ns = 0;
      for (const q of d.quizzes || []) { if (!q || !Array.isArray(q.qs)) continue; qs.push({ ...q, id: ids.has(q.id) ? uid() : (q.id || uid()) }); nq++; }
      const songs = store.get('mysongs', []), sid = new Set(songs.map(s => s.id));
      for (const s of d.songs || []) if (s && spotifyId(s.id) && !sid.has(s.id)) { songs.push(s); ns++; }
      this.saveAll(qs); store.set('mysongs', songs); toast(`Importerade ${nq} quiz och ${ns} låtar`); this.list();
    } catch { toast('Kunde inte läsa filen – är det en export från Quiz Champions?'); }
  },
  songForm() {
    setScreen(`
    <div class="editor"><header class="bar"><button class="btn icon ghost" id="back" aria-label="Tillbaka">←</button><h2>Lägg till låt</h2><span></span></header>
    <form class="ed-sec song-form" id="sf">
      <label class="lbl">Spotify-länk<input id="sLink" placeholder="https://open.spotify.com/track/…" autocomplete="off"></label>
      <label class="lbl">Låtens namn<input id="sT" placeholder="t.ex. Dancing Queen"></label>
      <label class="lbl">Artist / grupp<input id="sAr" placeholder="t.ex. ABBA"></label>
      <label class="lbl">År (valfritt)<input id="sY" inputmode="numeric" maxlength="4" placeholder="1976"></label>
      <div class="lbl">Passar för</div>
      <div class="chips">${['0', '1', '2', '3'].map(k => `<label class="chip on"><input type="checkbox" value="${k}" checked hidden>${AGES[k].e} ${AGES[k].n}</label>`).join('')}</div>
      <p class="muted small">Titel och artist används som svarsalternativ – stava dem som du vill att de ska visas.</p>
      <button class="btn primary big" type="submit">Spara låten</button>
    </form></div>`, 'scr-editor');
    $('#back').onclick = () => this.list();
    $$('.song-form .chip input').forEach(i => i.onchange = () => i.parentElement.classList.toggle('on', i.checked));
    $('#sf').onsubmit = e => {
      e.preventDefault();
      const id = spotifyId($('#sLink').value), t = $('#sT').value.trim(), ar = $('#sAr').value.trim(), y = parseInt($('#sY').value, 10) || null;
      const a = $$('.song-form .chip input:checked').map(i => i.value).join('');
      if (!id) return toast('Länken ser inte ut som en Spotify-låt');
      if (!t || !ar) return toast('Fyll i låtens namn och artist');
      const songs = store.get('mysongs', []); songs.push({ id, t, ar, y, a: a || '0123' }); store.set('mysongs', songs);
      toast('Låten sparad 🎵'); this.list();
    };
  },
  edit() {
    const c = this.cur, y = scrollY;
    const qCard = (q, i) => {
      const optInputs = (q.type === 'tf')
        ? `<div class="tf-pick">${['Sant', 'Falskt'].map((l, j) => `<label class="chip ${q.c === j ? 'on' : ''}"><input type="radio" name="c${i}" data-k="c" data-i="${i}" value="${j}" ${q.c === j ? 'checked' : ''} hidden>${j ? '✕' : '✓'} ${l} är rätt</label>`).join('')}</div>`
        : `<div class="ed-opts">${q.o.map((o, j) => `<div class="ed-opt c${j}"><span class="shape">${SHAPES[j]}</span><input data-k="o" data-i="${i}" data-j="${j}" value="${esc(o)}" placeholder="Svar ${j + 1}${j > 1 ? ' (valfritt)' : ''}"><label class="ok-pick" title="Rätt svar"><input type="radio" name="c${i}" data-k="c" data-i="${i}" value="${j}" ${q.c === j ? 'checked' : ''}><span>✓</span></label></div>`).join('')}</div>`;
      return `<div class="ed-q" data-q="${i}">
        <div class="ed-qhead"><b>Fråga ${i + 1}</b>
          <select data-k="type" data-i="${i}"><option value="mc" ${q.type === 'mc' ? 'selected' : ''}>4 alternativ</option><option value="tf" ${q.type === 'tf' ? 'selected' : ''}>Sant / falskt</option><option value="music" ${q.type === 'music' ? 'selected' : ''}>🎧 Musik (Spotify)</option></select>
          <select data-k="time" data-i="${i}" aria-label="Tid">${['auto', 10, 20, 30, 60].map(t => `<option value="${t}" ${String(q.time) === String(t) ? 'selected' : ''}>${t === 'auto' ? 'Tid: auto' : t + ' s'}</option>`).join('')}</select>
          <span class="grow"></span>
          <button type="button" class="btn icon ghost small" data-mv="-1" data-i="${i}" aria-label="Flytta upp">↑</button><button type="button" class="btn icon ghost small" data-mv="1" data-i="${i}" aria-label="Flytta ner">↓</button><button type="button" class="btn icon ghost small danger-t" data-rm="${i}" aria-label="Ta bort">🗑</button>
        </div>
        ${q.type === 'music' ? `<input class="ed-track" data-k="track" data-i="${i}" value="${esc(q.track || '')}" placeholder="Klistra in Spotify-länk till låten">` : ''}
        <textarea data-k="q" data-i="${i}" rows="2" placeholder="${q.type === 'music' ? 'Fråga, t.ex. Vem sjunger låten?' : q.type === 'tf' ? 'Skriv ett påstående…' : 'Skriv frågan…'}">${esc(q.q)}</textarea>
        ${optInputs}
      </div>`;
    };
    setScreen(`
    <div class="editor">
      <header class="bar"><button class="btn icon ghost" id="back" aria-label="Tillbaka">←</button><h2>${this.all().some(q => q.id === c.id) ? 'Redigera quiz' : 'Nytt quiz'}</h2><button class="btn primary small" id="saveQ">Spara</button></header>
      <div class="ed-sec"><input class="ed-title" id="qTitle" value="${esc(c.title)}" placeholder="Quizets namn, t.ex. Familjen Bucinca-quiz" maxlength="60"></div>
      <div id="qs">${c.qs.map(qCard).join('')}</div>
      <div class="row center"><button class="btn ghost" id="addQ">+ Lägg till fråga</button><button class="btn ghost" id="addTf">+ Sant/falskt</button><button class="btn ghost" id="addM">+ Musikfråga</button></div>
      <div class="row center"><button class="btn primary big" id="saveQ2">💾 Spara quizet</button></div>
    </div>`, 'scr-editor');
    $('#qTitle').oninput = e => c.title = e.target.value;
    const root = $('#qs');
    root.addEventListener('input', e => { const t = e.target, i = +t.dataset.i, k = t.dataset.k; if (!k || isNaN(i)) return; const q = c.qs[i];
      if (k === 'o') q.o[+t.dataset.j] = t.value; else if (k === 'q') q.q = t.value; else if (k === 'track') q.track = t.value; });
    root.addEventListener('change', e => { const t = e.target, i = +t.dataset.i, k = t.dataset.k; if (!k || isNaN(i)) return; const q = c.qs[i];
      if (k === 'c') { q.c = +t.value; if (q.type === 'tf') this.edit(); }
      else if (k === 'time') q.time = t.value;
      else if (k === 'type') { q.type = t.value; if (q.type === 'tf') q.c = q.c ? 1 : 0; if (q.type === 'music' && !q.q) q.q = 'Vem sjunger låten? 🎧'; this.edit(); } });
    root.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return;
      if (b.dataset.rm != null) { c.qs.splice(+b.dataset.rm, 1); this.edit(); }
      if (b.dataset.mv != null) { const i = +b.dataset.i, j = i + +b.dataset.mv; if (j >= 0 && j < c.qs.length) { [c.qs[i], c.qs[j]] = [c.qs[j], c.qs[i]]; this.edit(); } } });
    const add = type => { const q = this.blankQ(type); if (type === 'music') q.q = 'Vem sjunger låten? 🎧'; c.qs.push(q); this.edit(); setTimeout(() => { const el = $$('.ed-q').pop(); el && el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 30); };
    $('#addQ').onclick = () => add('mc'); $('#addTf').onclick = () => add('tf'); $('#addM').onclick = () => add('music');
    const save = () => {
      const errs = [];
      c.qs.forEach((q, i) => {
        if (!q.q.trim()) errs.push(`Fråga ${i + 1} saknar text`);
        if (q.type !== 'tf') { const filled = q.o.filter(s => String(s).trim()).length; if (filled < 2) errs.push(`Fråga ${i + 1} behöver minst två svar`); if (!String(q.o[q.c] || '').trim()) errs.push(`Fråga ${i + 1}: det rätta svaret är tomt`); }
        if (q.type === 'music' && !spotifyId(q.track)) errs.push(`Fråga ${i + 1} saknar en giltig Spotify-länk`);
      });
      if (!c.qs.length) errs.push('Lägg till minst en fråga');
      if (errs.length) { toast(errs[0], 3500); return; }
      if (!c.title.trim()) c.title = 'Mitt quiz';
      const all = this.all(), k = all.findIndex(q => q.id === c.id); if (k >= 0) all[k] = c; else all.push(c);
      this.saveAll(all); toast('Quizet är sparat 💾'); this.list();
    };
    $('#saveQ').onclick = save; $('#saveQ2').onclick = save;
    $('#back').onclick = async () => { if (await confirmDlg('Lämna utan att spara?', 'Lämna')) this.list(); };
    window.scrollTo(0, y);
  },
};

// ═════════════════════════ Start ═════════════════════════
addEventListener('beforeunload', e => { if (Host.phase !== 'idle' && Host.players.size) { e.preventDefault(); e.returnValue = ''; } });
document.addEventListener('pointerdown', () => Sound.ensure(), { once: true });
if ('speechSynthesis' in window) { try { speechSynthesis.getVoices(); speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices(); } catch {} }

$('#reconnLeave').onclick = () => { Player.leave(); clearPinParam(); renderHome(); };
function loadSongDb() {
  if (window.QK_SONGS_DB || loadSongDb.started) return; loadSongDb.started = true;
  ensureThemeSongs().then(() => { if ($('[data-theme]')) renderSetup('pre', setupMode); });
  const s = document.createElement('script'); s.src = 'songs-db.js'; s.async = true;
  s.onload = () => {
    const raw = window.QK_SONGS_DB || '', have = new Set(SONGS.map(x => x.id)), seen = new Set(SONGS.map(x => (x.t + '|' + x.ar).toLowerCase()));
    for (const line of raw.split('\n')) {
      const [id, t, ar, yr, p, g] = line.split('\t'); if (!id || !t || !ar || have.has(id)) continue;
      const k = (t + '|' + ar).toLowerCase(); if (seen.has(k)) continue; seen.add(k);
      const pop = +p || 0; SONGS.push({ id, t, ar, yr: +yr || null, p: pop, g, a: pop >= 70 ? '123' : pop >= 40 ? '23' : '3', db: 1 });
    }
    const f = $('.home .foot'); if (f) f.innerHTML = homeFoot();
    const m = $('.setup-go .match'); if (m && setupMode) renderSetup('gen', setupMode);
  };
  document.body.appendChild(s);
}
function boot() {
  const pin = (params.get('pin') || '').replace(/\D/g, '');
  if (pin.length !== 6) setTimeout(loadSongDb, 300);
  if (pin.length === 6) {
    const s = sess.get('session', null);
    if (params.get('dj')) { Player.begin(pin, 'DJ', '🎧', 'dj'); return; }
    if (s && s.pin === pin && s.role === 'player') { Player.begin(pin, s.name, s.avatar); return; }
    renderJoin(pin); return;
  }
  renderHome();
}
// Androids bakåtknapp: stäng dialog, gå ett steg tillbaka – false = lämna appen
window.qcBack = () => {
  const m = $('.modal'); if (m) { const b = m.querySelector('.btn.ghost') || m.querySelector('.btn'); if (b) b.click(); return true; }
  if (appEl().className === 'scr-home') return false;
  if (['joined', 'reconnecting', 'connecting'].includes(Player.state)) { confirmDlg('Lämna spelet?', 'Lämna').then(ok => { if (ok) { Player.leave(); clearPinParam(); renderHome(); } }); return true; }
  const b = ['#soloQuit', '#back', '#leave', '#endGame', '#homeBtn', '#home'].map(x => $(x)).find(Boolean);
  if (b) b.click(); else renderHome();
  return true;
};
window.QK = { Host, Player, Solo, buildQuiz, Sp }; // för felsökning
boot();
})();
