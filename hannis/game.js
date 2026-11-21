/* Hannis – kör ut bilarna ur parkeringen och fyll dem med Hannisar i samma färg.
   All grafik ritas med canvas (ingen bildfil behövs). */
'use strict';

// ---------- Värld ----------
const W = 400, H = 780;
const PARK_Y = 300;                    // grästomtens nederkant = stationens överkant
const ST = { y0: 300, y1: 408, slotY: 346 };
const LOT = { x0: 8, y0: 418, x1: 392, y1: 774 };
const SLOT_N = 8;                      // 0 = VIP, 1–5 öppna, 6–7 låsta
const ROW = 14;                      // avstånd mellan rader i kön

const PAL = [
  { n: 'röd', c: '#f2433a' }, { n: 'blå', c: '#3d8bff' }, { n: 'gul', c: '#ffcf1f' }, { n: 'grön', c: '#79d42a' },
  { n: 'rosa', c: '#ff4fb4' }, { n: 'lila', c: '#9a4dff' }, { n: 'orange', c: '#ff8f1f' }, { n: 'turkos', c: '#4fd6e8' },
  { n: 'brun', c: '#9a5a2c' }
];
const HID = { c: '#33304a' };
const TYPES = {
  car: { L: 40, Wd: 22, cap: 4, cols: 2 },
  van: { L: 52, Wd: 24, cap: 6, cols: 3 },
  bus: { L: 68, Wd: 26, cap: 10, cols: 5 }
};
const PRICE = { slot: 60, shuffle: 40, vip: 80 };

function hex2rgb(h) { h = h.replace('#', ''); return [0, 2, 4].map(i => parseInt(h.substr(i, 2), 16)); }
function mix(h, t, f) { const a = hex2rgb(h), b = hex2rgb(t); return 'rgb(' + a.map((v, i) => Math.round(v + (b[i] - v) * f)).join(',') + ')'; }
for (const p of [...PAL, HID]) {
  p.lt = mix(p.c, '#ffffff', .38); p.lt2 = mix(p.c, '#ffffff', .62);
  p.dk = mix(p.c, '#1a1030', .38); p.dk2 = mix(p.c, '#1a1030', .6);
}
HID.lt = '#4a4664'; HID.dk = '#1f1d2e';

// ---------- Hjälpare ----------
const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
const lerp = (a, b, t) => a + (b - a) * t;
const ease = t => t < .5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
function rng(seed) { let a = seed >>> 0; return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function shuffle(arr, r = Math.random) { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; }
const $ = id => document.getElementById(id);

// ---------- Sparat ----------
const SAVE_KEY = 'hannis-v1';
let S = { level: 1, coins: 100, boost: { slot: 1, shuffle: 1, vip: 1 }, snd: true };
try { const s = JSON.parse(localStorage.getItem(SAVE_KEY)); if (s && s.level) S = Object.assign(S, s); } catch (e) { }
function save() { try { localStorage.setItem(SAVE_KEY, JSON.stringify(S)); } catch (e) { } }

// ---------- Ljud ----------
let AC = null;
function tone(f, d, type = 'sine', vol = .12, f2 = null, delay = 0) {
  if (!S.snd) return;
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    if (AC.state === 'suspended') AC.resume();
    const t = AC.currentTime + delay, o = AC.createOscillator(), g = AC.createGain();
    o.type = type; o.frequency.setValueAtTime(f, t); if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + d);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + .01); g.gain.exponentialRampToValueAtTime(.001, t + d);
    o.connect(g).connect(AC.destination); o.start(t); o.stop(t + d + .02);
  } catch (e) { }
}
const SFX = {
  tap: () => tone(480, .08, 'triangle', .1, 720),
  bump: () => { tone(170, .16, 'triangle', .18, 80); buzz(25); },
  park: () => { tone(620, .07, 'sine', .1); tone(880, .1, 'sine', .1, null, .07); },
  pop: k => tone(420 + k * 60, .06, 'sine', .07, 600 + k * 60),
  go: () => { tone(392, .12, 'square', .05); tone(494, .16, 'square', .05, null, .13); },
  err: () => { tone(200, .14, 'sawtooth', .06, 150); buzz(40); },
  win: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, .22, 'triangle', .12, null, i * .11)),
  lose: () => [392, 330, 262].forEach((f, i) => tone(f, .25, 'triangle', .12, null, i * .16)),
  coin: () => { tone(988, .06, 'square', .05); tone(1319, .12, 'square', .05, null, .06); }
};
function buzz(ms) { try { navigator.vibrate && navigator.vibrate(ms); } catch (e) { } }

// ---------- Vägarna och rondellen ----------
// Två vägar matar in Hannisar i rondellen. I rondellen snurrar de tills en bil i rätt färg står vid hållplatsen.
const RING = { cx: 200, cy: 206, rx: 100, ry: 56 };
const RING_V = 80;                     // px/s
const LANES = [-12.5, 0, 12.5];
const ENTRY_DEG = [212, 328];          // vänster och höger infart (medurs från höger, y nedåt)
const ringPt = deg => [RING.cx + RING.rx * Math.cos(deg * Math.PI / 180), RING.cy + RING.ry * Math.sin(deg * Math.PI / 180)];
const LEFT_PTS = [[46, -420], [46, -120], [46, 20], [60, 80], [92, 128], ringPt(ENTRY_DEG[0])];
const RIGHT_PTS = LEFT_PTS.map(([x, y], i) => i === LEFT_PTS.length - 1 ? ringPt(ENTRY_DEG[1]) : [400 - x, y]);

function makePath(pts, closed) {
  const out = [];
  const n = pts.length, segs = closed ? n : n - 1;
  const P = i => closed ? pts[(i + n) % n] : pts[clamp(i, 0, n - 1)];
  for (let i = 0; i < segs; i++) {
    const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
    for (let k = 0; k < 40; k++) {
      const t = k / 40, t2 = t * t, t3 = t2 * t;
      out.push([0, 1].map(j => .5 * ((2 * p1[j]) + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3)));
    }
  }
  out.push(closed ? pts[0] : pts[n - 1]);
  return resample(out);
}
function resample(out) {
  const X = [], Y = [], TX = [], TY = [];
  let acc = 0, next = 0;
  for (let i = 1; i < out.length; i++) {
    const [ax, ay] = out[i - 1], [bx, by] = out[i], l = Math.hypot(bx - ax, by - ay);
    if (!l) continue;
    while (next <= acc + l) {
      const f = (next - acc) / l; X.push(ax + (bx - ax) * f); Y.push(ay + (by - ay) * f); TX.push((bx - ax) / l); TY.push((by - ay) / l); next++;
    }
    acc += l;
  }
  return { X, Y, TX, TY, len: X.length - 1, total: acc, raw: out };
}
const ROADS = [makePath(LEFT_PTS), makePath(RIGHT_PTS)];
const RINGP = (() => {
  const out = [];
  for (let i = 0; i <= 720; i++) out.push(ringPt(i / 2));
  return resample(out);
})();
const RING_L = RINGP.total;
const CELLS = Math.floor(RING_L / ROW);
const CELL_SP = RING_L / CELLS;
const ringArcOf = deg => { const [x, y] = ringPt(deg); let bi = 0, bd = 1e9; for (let i = 0; i <= RINGP.len; i++) { const d = (RINGP.X[i] - x) ** 2 + (RINGP.Y[i] - y) ** 2; if (d < bd) { bd = d; bi = i; } } return bi; };
const ENTRY_S = ENTRY_DEG.map(ringArcOf);
const PICK_S = ringArcOf(90);
function pathAt(P, s, lat) {
  const i = clamp(Math.round(s), 0, P.len);
  return [P.X[i] - P.TY[i] * lat, P.Y[i] + P.TX[i] * lat];
}
function ringAt(s, lat) {
  s = ((s % RING_L) + RING_L) % RING_L;
  return pathAt(RINGP, Math.min(s, RINGP.len), lat);
}
const crossed = (s0, s1, t) => { const d = ((t - s0) % RING_L + RING_L) % RING_L; return d > 0 && d <= s1 - s0; };

// ---------- Geometri (roterade rektanglar) ----------
function obbOf(v, dx = 0, dy = 0) { return { x: v.x + dx, y: v.y + dy, a: v.a, hl: v.L / 2, hw: v.Wd / 2 }; }
function overlap(A, B, pad = 0) {
  const dx = A.x - B.x, dy = A.y - B.y, rr = Math.hypot(A.hl, A.hw) + Math.hypot(B.hl, B.hw) + pad;
  if (dx * dx + dy * dy > rr * rr) return false;
  const ca = Math.cos(A.a), sa = Math.sin(A.a), cb = Math.cos(B.a), sb = Math.sin(B.a);
  const axes = [[ca, sa], [-sa, ca], [cb, sb], [-sb, cb]];
  for (const [nx, ny] of axes) {
    const ra = A.hl * Math.abs(ca * nx + sa * ny) + A.hw * Math.abs(-sa * nx + ca * ny) + pad;
    const rb = B.hl * Math.abs(cb * nx + sb * ny) + B.hw * Math.abs(-sb * nx + cb * ny);
    if (Math.abs(dx * nx + dy * ny) > ra + rb) return false;
  }
  return true;
}
function extents(o) { const c = Math.abs(Math.cos(o.a)), s = Math.abs(Math.sin(o.a)); return [o.hl * c + o.hw * s, o.hl * s + o.hw * c]; }
function outsideLot(o) { const [ex, ey] = extents(o); return o.x + ex < LOT.x0 || o.x - ex > LOT.x1 || o.y + ey < LOT.y0 || o.y - ey > LOT.y1; }
function insideLot(o, m) { const [ex, ey] = extents(o); return o.x - ex > LOT.x0 + m && o.x + ex < LOT.x1 - m && o.y - ey > LOT.y0 + m && o.y + ey < LOT.y1 - m; }
// Kör framåt tills något träffas eller bilen lämnat parkeringen.
function sweep(o, obstacles, step = 3) {
  const c = Math.cos(o.a), s = Math.sin(o.a);
  for (let d = step; d < 1400; d += step) {
    const m = { x: o.x + c * d, y: o.y + s * d, a: o.a, hl: o.hl, hw: o.hw };
    for (const b of obstacles) if (overlap(m, b)) return { hit: b, d: d - step };
    if (outsideLot(m)) return { free: true, d };
  }
  return { free: true, d: 1400 };
}

// ---------- Banor ----------
function genLevel(level) {
  const r = rng(level * 7919 + 1013);
  const hard = level % 5 === 0;
  const nCol = Math.min(3 + Math.floor((level + 1) / 2), PAL.length);
  const nVeh = Math.min(Math.floor(8 + level * 1.1 + (hard ? 4 : 0)), 28);
  const typesAllowed = level < 3 ? ['car', 'van'] : ['car', 'van', 'van', 'bus'];
  const hiddenP = level >= 4 ? Math.min(.08 + level * .012, .3) : 0;
  const nGar = level >= 6 ? (level >= 14 ? 2 : 1) : 0;
  const cols = shuffle([...Array(PAL.length).keys()], r).slice(0, nCol);
  const placed = [];   // {o, kind, ref}
  const vehicles = [], garages = [];
  const angleFor = () => {
    const q = r();
    if (q < .55) return [0, 90, 180, 270][Math.floor(r() * 4)] * Math.PI / 180;
    if (q < .8) return (45 + 90 * Math.floor(r() * 4)) * Math.PI / 180 + (r() - .5) * .25;
    return r() * Math.PI * 2;
  };
  const obstacles = () => placed.map(p => p.o);

  // Garage först (de töms sist)
  for (let g = 0; g < nGar; g++) {
    for (let tr = 0; tr < 300; tr++) {
      const a = [0, 90, 180, 270][Math.floor(r() * 4)] * Math.PI / 180;
      const sp = { x: lerp(LOT.x0 + 50, LOT.x1 - 50, r()), y: lerp(LOT.y0 + 50, LOT.y1 - 50, r()), a, hl: 34, hw: 13 };
      const gb = { x: sp.x - Math.cos(a) * 49, y: sp.y - Math.sin(a) * 49, a, hl: 13, hw: 19 };
      if (!insideLot(sp, 4) || !insideLot(gb, 2)) continue;
      if (placed.some(p => overlap(sp, p.o, 4) || overlap(gb, p.o, 4))) continue;
      if (!sweep(sp, obstacles(), 4).free) continue;
      const list = [];
      const n = 2 + Math.floor(r() * (level >= 12 ? 3 : 2));
      for (let i = 0; i < n; i++) list.push({ type: typesAllowed[Math.floor(r() * typesAllowed.length)], col: 0 });
      const gar = { x: gb.x, y: gb.y, a, hl: 13, hw: 19, sp: { x: sp.x, y: sp.y }, list, cur: null, timer: 0 };
      garages.push(gar);
      placed.push({ o: gb, kind: 'gar' }, { o: sp, kind: 'zone' });
      break;
    }
  }
  // Vanliga bilar – varje ny bil har fri väg ut förbi de tidigare, så omvänd ordning går alltid att lösa.
  for (let k = 0; k < nVeh; k++) {
    let best = null;
    for (let tr = 0; tr < 70; tr++) {
      const type = typesAllowed[Math.floor(r() * typesAllowed.length)], T = TYPES[type];
      const o = { x: lerp(LOT.x0 + 20, LOT.x1 - 20, r()), y: lerp(LOT.y0 + 20, LOT.y1 - 20, r()), a: angleFor(), hl: T.L / 2, hw: T.Wd / 2 };
      if (!insideLot(o, 4)) continue;
      if (placed.some(p => overlap(o, p.o, 3.5))) continue;
      if (!sweep(o, obstacles(), 4).free) continue;
      // Poäng: hur många tidigare bilar den här blockerar + hur tätt den står
      let score = r() * .8;
      for (const p of placed) if (p.kind === 'veh') { const s = sweep(p.o, [o], 4); if (!s.free) score += 1; }
      for (const p of placed) { const d = Math.hypot(p.o.x - o.x, p.o.y - o.y); if (d < 60) score += .15; }
      if (!best || score > best.score) best = { o, type, score };
    }
    if (!best) continue;
    placed.push({ o: best.o, kind: 'veh' });
    vehicles.push({ type: best.type, x: best.o.x, y: best.o.y, a: best.o.a });
  }
  // Färger – jämnt fördelade
  const order = [...vehicles].reverse();         // lösningsordning
  for (const g of garages) for (const it of g.list) order.push(it);
  const colSeq = [];
  while (colSeq.length < order.length) colSeq.push(...shuffle([...cols], r));
  order.forEach((v, i) => { v.col = colSeq[i]; });
  for (const v of vehicles) v.hidden = r() < hiddenP;
  // Kön: bilarnas passagerare i lösningsordning, lite omblandade
  const win = Math.min(.6 + level * .07, 2.2) + (hard ? .6 : 0);
  const chunks = [];
  order.forEach((v, idx) => {
    let rem = TYPES[v.type].cap;
    while (rem > 0) {
      const sz = Math.min(rem, 1 + Math.floor(r() * 3) + (rem >= 6 ? 1 : 0));
      chunks.push({ k: idx + r() * win, c: v.col, n: sz }); rem -= sz;
    }
  });
  chunks.sort((a, b) => a.k - b.k);
  const queue = [], roads = [[], []];
  chunks.forEach((ch, k) => { const rd = roads[(k + (r() < .25 ? 1 : 0)) % 2]; for (let i = 0; i < ch.n; i++) { queue.push(ch.c); rd.push(ch.c); } });
  return { hard, vehicles, garages, queue, roads };
}

// ---------- Spelstatus ----------
let G = null;
let uid = 1;
function makeVeh(type, col, x, y, a, hidden) {
  const T = TYPES[type];
  return { id: uid++, type, col, x, y, a, L: T.L, Wd: T.Wd, cap: T.cap, hidden: !!hidden, revealed: !hidden,
    state: 'park', filled: 0, inc: 0, slot: null, garage: null, anim: null, sc: 1, wob: 0, alpha: 1, pulse: 0, leaveT: 0 };
}
function slotX(i) { return 200 + (i - 3.5) * 46; }
function startLevel(n) {
  const L = genLevel(n);
  G = {
    level: n, hard: L.hard, time: 0, boardT: 0, stuckT: 0, over: false, won: false, paused: false, vipSel: false,
    vehicles: L.vehicles.map(v => makeVeh(v.type, v.col, v.x, v.y, v.a, v.hidden)),
    garages: L.garages.map(g => Object.assign({}, g, { list: g.list.map(x => Object.assign({}, x)) })),
    roads: L.roads.map((q, ri) => q.map((c, i) => ({ c, ds: roadTarget(ri, i), dl: LANES[i % 3], hop: Math.random() * 6 }))),
    ring: { off: 0, cells: Array.from({ length: CELLS }, () => [null, null, null]) },
    total: L.queue.length,
    slots: Array.from({ length: SLOT_N }, (_, i) => ({ i, x: slotX(i), y: ST.slotY, vip: i === 0, locked: i >= 6, veh: null })),
    flyers: [], parts: []
  };
  for (const g of G.garages) spawnFromGarage(g, true);
  // fyll rondellen innan start
  for (let t = 0; t < RING_L / RING_V * 1.6; t += .05) { stepRing(.05, true); }
  for (const f of ringFigs()) f.ent = 1;
  updateReveal();
  $('lvlN').textContent = 'NIVÅ ' + n;
  $('hard').classList.toggle('on', G.hard);
  updateBar();
}
function spawnFromGarage(g, instant) {
  if (!g.list.length) { g.cur = null; return; }
  const it = g.list.shift();
  const v = makeVeh(it.type, it.col, g.sp.x, g.sp.y, g.a, false);
  v.garage = g; g.cur = v;
  if (!instant) v.anim = { kind: 'spawn', t: 0, dur: .35, fx: g.x, fy: g.y };
  G.vehicles.push(v);
}
const parked = () => G.vehicles.filter(v => v.state === 'park');
function obstaclesFor(v) {
  const o = [];
  for (const u of G.vehicles) if (u !== v && u.state === 'park') o.push(obbOf(u));
  for (const g of G.garages) o.push(g);
  return o;
}
function updateReveal() {
  for (const v of G.vehicles) if (v.state === 'park' && v.hidden && !v.revealed && !v.anim) {
    if (sweep(obbOf(v), obstaclesFor(v)).free) { v.revealed = true; v.pulse = 1; }
  }
}

// ---------- Rörelser ----------
function buildExitPath(v, d, slot) {
  const c = Math.cos(v.a), s = Math.sin(v.a);
  const pts = [];
  const ex = v.x + c * (d + 8), ey = v.y + s * (d + 8);
  for (let i = 0; i <= 10; i++) pts.push([lerp(v.x, ex, i / 10), lerp(v.y, ey, i / 10)]);
  const b0 = [ex, ey], b1 = [ex + c * 80, ey + s * 80], b3 = [slot.x, slot.y], b2 = [slot.x, slot.y + 110];
  for (let i = 1; i <= 40; i++) {
    const t = i / 40, u = 1 - t;
    pts.push([0, 1].map(j => u * u * u * b0[j] + 3 * u * u * t * b1[j] + 3 * u * t * t * b2[j] + t * t * t * b3[j]));
  }
  return polyline(pts);
}
function polyline(pts) {
  const cum = [0];
  for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  return { pts, cum, len: cum[cum.length - 1] };
}
function polyAt(P, s) {
  s = clamp(s, 0, P.len);
  let i = 1; while (i < P.cum.length - 1 && P.cum[i] < s) i++;
  const a = P.pts[i - 1], b = P.pts[i], seg = P.cum[i] - P.cum[i - 1] || 1, f = (s - P.cum[i - 1]) / seg;
  return [lerp(a[0], b[0], f), lerp(a[1], b[1], f), Math.atan2(b[1] - a[1], b[0] - a[0])];
}
function freeSlot() { return G.slots.find(s => !s.vip && !s.locked && !s.veh); }
function sendToSlot(v, slot, P, kind = 'exit') {
  slot.veh = v; v.slot = slot; v.state = 'move';
  if (v.garage) { v.garage.cur = null; v.garage.timer = .45; v.garage = null; }
  v.revealed = true;
  v.anim = { kind, t: 0, dur: Math.max(.45, P.len / 620), P };
}

function tapVehicle(v) {
  if (v.anim) return;
  if (G.vipSel) {
    const slot = G.slots[0];
    if (slot.veh) { G.vipSel = false; return; }
    if (!payBoost('vip')) { G.vipSel = false; updateBar(); return; }
    G.vipSel = false;
    const pts = []; const sx = v.x, sy = v.y;
    for (let i = 0; i <= 30; i++) { const t = i / 30; pts.push([lerp(sx, slot.x, t), lerp(sy, slot.y, t) - Math.sin(t * Math.PI) * 60]); }
    const P = polyline(pts);
    sendToSlot(v, slot, P, 'fly');
    v.anim.dur = .8; v.anim.a0 = v.a;
    SFX.coin(); updateBar(); updateReveal();
    return;
  }
  const sw = sweep(obbOf(v), obstaclesFor(v));
  if (!sw.free) {
    v.anim = { kind: 'bump', t: 0, dur: .18 + sw.d / 700, d: sw.d, x0: v.x, y0: v.y };
    const hitV = G.vehicles.find(u => u.state === 'park' && Math.abs(u.x - sw.hit.x) < .01 && Math.abs(u.y - sw.hit.y) < .01);
    v.anim.hitV = hitV || null;
    SFX.tap();
    return;
  }
  const slot = freeSlot();
  if (!slot) { v.wob = 1; SFX.err(); toast('Inga lediga platser!'); return; }
  SFX.tap();
  sendToSlot(v, slot, buildExitPath(v, sw.d, slot));
  updateReveal();
}

// ---------- Boosters ----------
function payBoost(k) {
  if (S.boost[k] > 0) { S.boost[k]--; save(); return true; }
  if (S.coins >= PRICE[k]) { S.coins -= PRICE[k]; save(); return true; }
  toast(`Du behöver ${PRICE[k]} 🪙`); SFX.err(); return false;
}
function useSlot() {
  if (!G || G.over || G.won) return;
  const s = G.slots.find(x => x.locked);
  if (!s) { toast('Alla platser är redan öppna'); return; }
  if (!payBoost('slot')) return;
  s.locked = false; s.pop = 1; SFX.coin(); updateBar(); G.stuckT = 0;
}
function useShuffle() {
  if (!G || G.over || G.won) return;
  const ps = parked();
  if (ps.length < 2) { toast('För få bilar att blanda'); return; }
  if (!payBoost('shuffle')) return;
  const byType = {};
  for (const v of ps) (byType[v.type] = byType[v.type] || []).push(v);
  for (const t in byType) { const cs = shuffle(byType[t].map(v => v.col)); byType[t].forEach((v, i) => { v.col = cs[i]; v.pulse = 1; }); }
  SFX.coin(); updateBar(); G.stuckT = 0;
}
function useVip() {
  if (!G || G.over || G.won) return;
  if (G.vipSel) { G.vipSel = false; toast('VIP avbrutet'); return; }
  if (G.slots[0].veh) { toast('VIP-platsen är upptagen'); return; }
  if (!parked().length) return;
  if (S.boost.vip <= 0 && S.coins < PRICE.vip) { toast(`Du behöver ${PRICE.vip} 🪙`); SFX.err(); return; }
  G.vipSel = true; toast('Tryck på valfri bil – den lyfts till VIP!');
}
function updateBar() {
  for (const [id, k] of [['bSlot', 'slot'], ['bShuffle', 'shuffle'], ['bVip', 'vip']]) {
    const el = $(id).querySelector('.cnt'); const n = S.boost[k];
    el.textContent = n > 0 ? n : '+'; el.classList.toggle('buy', n <= 0);
  }
  $('bSlot').classList.toggle('dis', !!G && !G.slots.some(s => s.locked));
  $('coinN').textContent = S.coins;
  $('mCoins').textContent = '🪙 ' + S.coins;
}

// ---------- Uppdatering ----------
function update(dt) {
  if (!G || G.paused) return;
  G.time += dt;
  stepRing(dt, false);
  // fordon
  for (const v of G.vehicles) {
    v.wob = Math.max(0, v.wob - dt * 3); v.pulse = Math.max(0, v.pulse - dt * 2);
    const A = v.anim;
    if (A) {
      A.t += dt; const f = clamp(A.t / A.dur, 0, 1);
      if (A.kind === 'bump') {
        const k = f < .6 ? (f / .6) ** 1.6 : 1 - ease((f - .6) / .4);
        v.x = A.x0 + Math.cos(v.a) * A.d * k; v.y = A.y0 + Math.sin(v.a) * A.d * k;
        if (f >= .6 && !A.hitDone) { A.hitDone = true; if (A.hitV) A.hitV.wob = 1; v.wob = .6; SFX.bump(); }
        if (f >= 1) { v.x = A.x0; v.y = A.y0; v.anim = null; }
      } else if (A.kind === 'exit' || A.kind === 'fly') {
        const e = A.kind === 'exit' ? (f < .25 ? 2 * f * f / .5 : f) : ease(f);
        const [x, y, a] = polyAt(A.P, e * A.P.len);
        v.x = x; v.y = y;
        if (A.kind === 'exit') v.a = a;
        else { v.a = lerpAng(A.a0, -Math.PI / 2, f); v.sc = 1 + Math.sin(f * Math.PI) * .35; }
        if (f >= 1) { v.anim = null; v.state = 'dock'; v.x = v.slot.x; v.y = v.slot.y; v.a = -Math.PI / 2; v.sc = 1; v.pulse = 1; SFX.park(); G.stuckT = 0; }
      } else if (A.kind === 'spawn') {
        v.x = lerp(A.fx, v.garage ? v.garage.sp.x : v.x, ease(f)); v.y = lerp(A.fy, v.garage ? v.garage.sp.y : v.y, ease(f)); v.sc = .4 + .6 * ease(f);
        if (f >= 1) { v.anim = null; v.sc = 1; updateReveal(); }
      } else if (A.kind === 'leave') {
        v.y = A.y0 - 160 * f * f; v.alpha = 1 - f; v.sc = 1 + f * .2;
        if (f >= 1) { v.anim = null; v.state = 'gone'; }
      }
    }
    if (v.state === 'dock' && v.filled >= v.cap && v.inc === 0) {
      v.leaveT += dt;
      if (v.leaveT > .25) {
        v.state = 'leave'; v.slot.veh = null; v.slot = null; v.anim = { kind: 'leave', t: 0, dur: .6, y0: v.y };
        SFX.go(); burst(v.x, v.y, PAL[v.col].c, 18);
      }
    }
  }
  G.vehicles = G.vehicles.filter(v => v.state !== 'gone');
  // garage
  let spawned = false;
  for (const g of G.garages) if (!g.cur && g.list.length) {
    g.timer -= dt;
    if (g.timer <= 0) {
      const probe = { x: g.sp.x, y: g.sp.y, a: g.a, hl: 34, hw: 13 };
      if (!parked().some(u => overlap(probe, obbOf(u)))) { spawnFromGarage(g, false); spawned = true; }
    }
  }
  if (spawned) updateReveal();
  for (const f of G.flyers) {
    f.t += dt;
    if (f.t >= f.dur) { f.v.inc--; f.v.filled++; f.v.pulse = .6; SFX.pop(f.v.filled % 8); f.done = true; }
  }
  G.flyers = G.flyers.filter(f => !f.done);
  // partiklar
  for (const p of G.parts) { p.t += dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 420 * dt; p.r += p.vr * dt; }
  G.parts = G.parts.filter(p => p.t < p.life);
  // vinst / förlust
  if (!G.won && !G.over) {
    if (!waiting() && !G.flyers.length && !G.vehicles.length) win();
    else checkStuck(dt);
  }
  $('left').textContent = '🙂 ' + waiting();
}
function lerpAng(a, b, t) { let d = ((b - a + Math.PI * 3) % (Math.PI * 2)) - Math.PI; return a + d * t; }
function roadTarget(ri, i) { return ROADS[ri].len - 4 - Math.floor(i / 3) * ROW; }
function ringFigs() { const o = []; for (const c of G.ring.cells) for (const f of c) if (f) o.push(f); return o; }
function waiting() { return G.roads[0].length + G.roads[1].length + ringFigs().length; }
function cellS(i, off) { return i * CELL_SP + off; }
function dockFor(c) { return G.slots.map(s => s.veh).find(u => u && u.state === 'dock' && u.col === c && u.filled + u.inc < u.cap); }
function stepRing(dt, pre) {
  const R = G.ring, d = RING_V * dt, off0 = R.off;
  R.off = (R.off + d) % RING_L;
  // vägarna rycker fram
  G.roads.forEach((q, ri) => {
    for (let i = 0; i < q.length; i++) {
      const p = q[i], ts = roadTarget(ri, i), tl = LANES[i % 3];
      if (pre || i > 300) { p.ds = ts; p.dl = tl; continue; }
      p.ds += (ts - p.ds) * Math.min(1, dt * 9);
      p.dl += (tl - p.dl) * Math.min(1, dt * 7);
    }
  });
  R.cells.forEach((cell, i) => {
    const s0 = cellS(i, off0);
    for (const f of cell) if (f && f.ent < 1) f.ent = Math.min(1, f.ent + dt / .35);
    // hållplatsen: kliv på bilen med samma färg
    if (!pre && crossed(s0, s0 + d, PICK_S)) {
      for (let l = 0; l < 3; l++) {
        const f = cell[l]; if (!f || f.ent < 1) continue;
        const v = dockFor(f.c);
        if (!v) continue;
        const [x, y] = ringAt(s0 + d, LANES[l]);
        cell[l] = null; v.inc++;
        G.flyers.push({ c: f.c, x0: x, y0: y - 4, v, t: 0, dur: .3 + l * .04 });
      }
    }
    // infarterna: släpp in nya när det finns plats
    ENTRY_S.forEach((es, ri) => {
      if (!crossed(s0, s0 + d, es)) return;
      const q = G.roads[ri], other = G.roads[1 - ri];
      // jämn matning: den längre kön får företräde
      let room = cell.filter(f => !f).length;
      if (other.length > q.length) room = Math.floor(room / 2);
      for (let l = 0; l < 3 && q.length && room > 0; l++) {
        if (cell[l]) continue;
        room--;
        const p = q.shift();
        const [fx, fy] = pathAt(ROADS[ri], p.ds, p.dl);
        cell[l] = { c: p.c, ent: pre ? 1 : 0, fx, fy, hop: p.hop };
      }
    });
  });
}
function checkStuck(dt) {
  const busy = G.flyers.length || G.vehicles.some(v => v.anim || v.state === 'move' || v.state === 'leave' || (v.state === 'dock' && v.filled >= v.cap));
  if (!waiting() || busy || freeSlot()) { G.stuckT = 0; return; }
  const figs = ringFigs();
  const full = figs.length >= CELLS * 3, roadsEmpty = !G.roads[0].length && !G.roads[1].length;
  if (figs.some(f => f.ent < 1) || figs.some(f => dockFor(f.c)) || !(full || roadsEmpty)) { G.stuckT = 0; return; }
  G.stuckT += dt;
  if (G.stuckT > .9) lose();
}
function burst(x, y, col, n) {
  const cs = [col, '#ffffff', '#ffd21f', '#ff4fb4', '#4fd6e8'];
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2, sp = 80 + Math.random() * 200;
    G.parts.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 150, t: 0, life: .7 + Math.random() * .5, c: cs[i % cs.length], r: Math.random() * 6, vr: (Math.random() - .5) * 12, s: 3 + Math.random() * 3 });
  }
}
function win() {
  G.won = true;
  const gain = G.hard ? 25 : 10;
  S.coins += gain; S.level = G.level + 1; save(); updateBar();
  for (let i = 0; i < 4; i++) setTimeout(() => G && burst(80 + Math.random() * 240, 380 + Math.random() * 150, PAL[Math.floor(Math.random() * PAL.length)].c, 26), i * 160);
  SFX.win();
  setTimeout(() => {
    $('winT').textContent = `Nivå ${G.level} klar!`;
    $('winC').textContent = `+${gain} 🪙`;
    open('win');
  }, 800);
}
function lose() {
  G.over = true; SFX.lose(); buzz(120);
  const hasLock = G.slots.some(s => s.locked), vipFree = !G.slots[0].veh;
  const bs = $('bLoseSlot'), bv = $('bLoseVip');
  bs.style.display = hasLock ? '' : 'none';
  bs.textContent = '+1 plats ' + (S.boost.slot > 0 ? `(${S.boost.slot} kvar)` : `(${PRICE.slot} 🪙)`);
  bv.style.display = vipFree && parked().length ? '' : 'none';
  bv.textContent = '👑 VIP-bil ' + (S.boost.vip > 0 ? `(${S.boost.vip} kvar)` : `(${PRICE.vip} 🪙)`);
  $('loseP').textContent = `Ingen i rondellen kan kliva på. ${waiting()} Hannisar väntar fortfarande.`;
  open('lose');
}

// ---------- Rendering ----------
const cv = $('cv');
let cx = cv.getContext('2d');
let DPR = 1, CW = 0, CH = 0, SC = 1, OX = 0, OY = 0, BAR = 100;
let staticLayer = null;
const SPR = {};       // figurer per färg

function rr(c, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
}
function makePersonSprites() {
  const K = 4;
  for (let i = 0; i < PAL.length; i++) {
    const p = PAL[i], c = document.createElement('canvas'); c.width = 22 * K; c.height = 24 * K;
    const g = c.getContext('2d'); g.scale(K, K); g.translate(11, 13);
    g.fillStyle = 'rgba(50,30,90,.22)'; g.beginPath(); g.ellipse(1, 7.5, 7, 3.2, 0, 0, 7); g.fill();
    // kropp
    let gr = g.createRadialGradient(-2, 1, 1, 0, 3, 8); gr.addColorStop(0, p.lt); gr.addColorStop(.6, p.c); gr.addColorStop(1, p.dk);
    g.fillStyle = gr; g.beginPath(); g.ellipse(0, 3.5, 6.4, 5.6, 0, 0, 7); g.fill();
    // huvud
    gr = g.createRadialGradient(-2.2, -5.5, .5, 0, -3, 7); gr.addColorStop(0, p.lt2); gr.addColorStop(.45, p.c); gr.addColorStop(1, p.dk);
    g.fillStyle = gr; g.beginPath(); g.arc(0, -3, 6, 0, 7); g.fill();
    g.fillStyle = 'rgba(255,255,255,.75)'; g.beginPath(); g.ellipse(-2.4, -6, 2, 1.3, -.5, 0, 7); g.fill();
    // ögon
    g.fillStyle = '#231a3d'; g.beginPath(); g.ellipse(-2, -2.2, .95, 1.25, 0, 0, 7); g.ellipse(2, -2.2, .95, 1.25, 0, 0, 7); g.fill();
    g.fillStyle = '#fff'; g.beginPath(); g.arc(-1.7, -2.6, .38, 0, 7); g.arc(2.3, -2.6, .38, 0, 7); g.fill();
    SPR[i] = c;
  }
}
function drawPerson(c, col, x, y, s = 1) { s *= 1.3; c.drawImage(SPR[col], x - 11 * s, y - 13 * s, 22 * s, 24 * s); }

function drawTree(c, x, y, r, pink) {
  c.fillStyle = 'rgba(60,90,20,.28)'; c.beginPath(); c.ellipse(x + r * .25, y + r * .55, r * 1.05, r * .6, 0, 0, 7); c.fill();
  const base = pink ? '#f4a6c8' : '#6cbf3a', lt = pink ? '#ffd3e6' : '#9be060', dk = pink ? '#d877a2' : '#4a9a28';
  const blobs = [[0, 0, 1], [-.55, .2, .7], [.55, .2, .7], [0, -.45, .7], [-.3, .5, .6], [.35, .5, .6]];
  for (const [bx, by, br] of blobs) { c.fillStyle = dk; c.beginPath(); c.arc(x + bx * r, y + by * r + 2, br * r * .72, 0, 7); c.fill(); }
  for (const [bx, by, br] of blobs) {
    const gx = x + bx * r, gy = y + by * r;
    const gr = c.createRadialGradient(gx - br * r * .3, gy - br * r * .35, 1, gx, gy, br * r * .75);
    gr.addColorStop(0, lt); gr.addColorStop(1, base); c.fillStyle = gr; c.beginPath(); c.arc(gx, gy, br * r * .7, 0, 7); c.fill();
  }
  if (pink) { c.fillStyle = '#fff6'; for (let i = 0; i < 6; i++) { c.beginPath(); c.arc(x + Math.cos(i * 2.1) * r * .5, y + Math.sin(i * 2.1) * r * .45, 1.3, 0, 7); c.fill(); } }
}
function drawBush(c, x, y, r) {
  c.fillStyle = 'rgba(60,90,20,.25)'; c.beginPath(); c.ellipse(x + 2, y + r * .6, r * 1.2, r * .5, 0, 0, 7); c.fill();
  for (const [bx, by] of [[-.6, .1], [.6, .1], [0, -.2]]) {
    const gx = x + bx * r, gy = y + by * r, gr = c.createRadialGradient(gx - 2, gy - 3, 1, gx, gy, r * .8);
    gr.addColorStop(0, '#a9e86a'); gr.addColorStop(1, '#58a830'); c.fillStyle = gr; c.beginPath(); c.arc(gx, gy, r * .72, 0, 7); c.fill();
  }
}

function buildStatic() {
  const c = document.createElement('canvas'); c.width = cv.width; c.height = cv.height;
  const g = c.getContext('2d');
  const toY = y => (OY + y * SC) * DPR;
  // band i hela bredden
  g.fillStyle = '#ece7f4'; g.fillRect(0, 0, c.width, c.height);
  g.fillStyle = '#afd254'; g.fillRect(0, 0, c.width, toY(ST.y0));
  g.fillStyle = '#a69fc2'; g.fillRect(0, toY(ST.y0), c.width, toY(ST.y1) - toY(ST.y0));
  g.setTransform(DPR * SC, 0, 0, DPR * SC, DPR * OX, DPR * OY);
  const xl = -OX / SC - 10, xr = (CW - OX) / SC + 10, yt = -OY / SC - 10;
  // gräsfläckar
  const r = rng(42);
  for (let i = 0; i < 160; i++) {
    const x = lerp(xl, xr, r()), y = lerp(yt, PARK_Y, r());
    g.fillStyle = r() < .5 ? 'rgba(255,255,200,.10)' : 'rgba(60,120,20,.08)';
    g.beginPath(); g.ellipse(x, y, 10 + r() * 26, 6 + r() * 12, 0, 0, 7); g.fill();
  }
  // väg
  const road = (w, col) => {
    g.strokeStyle = col; g.lineWidth = w; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath();
    for (const P of [ROADS[0], ROADS[1], RINGP]) P.raw.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y));
    g.moveTo(RING.cx, RING.cy + RING.ry); g.lineTo(RING.cx, ST.y0 + 4);
    g.stroke();
  };
  g.save(); g.translate(2, 5); road(60, 'rgba(60,90,20,.25)'); g.restore();
  road(60, '#f6f4fb'); road(51, '#8f89a6');
  g.save(); g.globalAlpha = .18; g.translate(0, -1.5); road(45, '#ffffff'); g.restore();
  road(47, '#8f89a6');
  // träd & buskar
  // rondellens mitt: liten blomsterrabatt
  g.fillStyle = '#9fcb48'; g.beginPath(); g.ellipse(RING.cx, RING.cy, RING.rx - 26, RING.ry - 26, 0, 0, 7); g.fill();
  g.strokeStyle = '#fff'; g.lineWidth = 3; g.stroke();
  for (const [x, y, s, p] of [[200, 206, 15, 1], [160, 210, 9, 0], [240, 210, 9, 0], [200, 60, 18, 1], [140, 40, 12, 0], [260, 40, 12, 0], [130, 105, 13, 1], [270, 105, 13, 1],
    [30, 196, 16, 1], [370, 196, 16, 1], [42, 262, 13, 0], [358, 262, 13, 0], [100, 284, 10, 0], [300, 284, 10, 0], [-20, 120, 18, 0], [420, 120, 18, 1], [-25, 250, 16, 1], [425, 250, 16, 0]]) {
    if (s < 12) drawBush(g, x, y, s); else drawTree(g, x, y, s, p);
  }
  // station
  g.fillStyle = '#fff'; g.fillRect(xl, ST.y0 - 2, xr - xl, 4);
  g.fillStyle = '#b6b0d0'; g.fillRect(xl, ST.y0 + 2, xr - xl, 3);
  g.fillStyle = '#8c84ab'; g.fillRect(xl, ST.y1 - 4, xr - xl, 4);
  // parkering
  g.fillStyle = '#ddd6ea'; g.fillRect(xl, ST.y1, xr - xl, 6);
  const lg = g.createLinearGradient(0, ST.y1 + 6, 0, ST.y1 + 30); lg.addColorStop(0, 'rgba(120,100,170,.18)'); lg.addColorStop(1, 'rgba(120,100,170,0)');
  g.fillStyle = lg; g.fillRect(xl, ST.y1 + 6, xr - xl, 24);
  g.fillStyle = 'rgba(140,120,190,.12)';
  for (let y = LOT.y0 + 14; y < H + 400; y += 22) for (let x = Math.floor(xl / 22) * 22 + 11; x < xr; x += 22) { g.beginPath(); g.arc(x, y, 1.2, 0, 7); g.fill(); }
  return c;
}
function drawSlots(c) {
  for (const s of G.slots) {
    const x = s.x - 20, y = ST.slotY - 38;
    const pop = s.pop ? 1 + Math.sin(s.pop * Math.PI) * .12 : 1;
    c.save(); c.translate(s.x, ST.slotY); c.scale(pop, pop); c.translate(-s.x, -ST.slotY);
    if (s.vip) {
      rr(c, x, y, 40, 76, 9); c.fillStyle = '#d99b1c'; c.fill();
      rr(c, x + 2, y + 2, 36, 72, 8); c.fillStyle = G.vipSel ? '#ffe680' : '#f2bb2e'; c.fill();
      if (!s.veh) {
        c.save(); c.translate(s.x, ST.slotY); c.rotate(-Math.PI / 2); c.fillStyle = '#9a6400'; c.font = '700 15px Fredoka'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('VIP', 0, 1); c.restore();
      }
    } else {
      rr(c, x, y, 40, 76, 9); c.fillStyle = '#7f779f'; c.fill();
      rr(c, x + 2, y + 3, 36, 71, 8); c.fillStyle = '#958db6'; c.fill();
      if (s.locked) {
        rr(c, s.x - 11, ST.slotY - 11, 22, 22, 7); c.fillStyle = '#3d9b54'; c.fill();
        rr(c, s.x - 11, ST.slotY - 12, 22, 21, 7); c.fillStyle = '#5ed873'; c.fill();
        c.strokeStyle = '#fff'; c.lineWidth = 3.5; c.lineCap = 'round'; c.beginPath(); c.moveTo(s.x, ST.slotY - 7); c.lineTo(s.x, ST.slotY + 4); c.moveTo(s.x - 5.5, ST.slotY - 1.5); c.lineTo(s.x + 5.5, ST.slotY - 1.5); c.stroke();
      }
    }
    c.restore();
    if (s.pop) { s.pop += .04; if (s.pop >= 1) s.pop = 0; }
    const v = s.veh;
    if (v && v.state === 'dock') {
      const rem = v.cap - v.filled - v.inc + v.inc; // visa platser kvar
      const left = v.cap - v.filled;
      const P = PAL[v.col];
      rr(c, s.x - 13, 388, 26, 15, 6); c.fillStyle = '#fff'; c.fill();
      rr(c, s.x - 11.5, 389.5, 23, 12, 5); c.fillStyle = P.c; c.fill();
      c.fillStyle = '#fff'; c.font = '700 10.5px Fredoka'; c.textAlign = 'center'; c.textBaseline = 'middle';
      c.lineWidth = 2.5; c.strokeStyle = P.dk; c.strokeText(left, s.x, 396); c.fillText(left, s.x, 396);
      void rem;
    }
  }
}
function drawGarage(c, g) {
  const ca = Math.cos(g.a), sa = Math.sin(g.a);
  c.save(); c.translate(g.x + 2, g.y + 5); c.rotate(g.a); rr(c, -14, -20, 28, 40, 8); c.fillStyle = 'rgba(60,40,110,.2)'; c.fill(); c.restore();
  c.save(); c.translate(g.x, g.y + 6); c.rotate(g.a); rr(c, -13, -19, 26, 38, 8); c.fillStyle = '#8f86bd'; c.fill(); c.restore();
  c.save(); c.translate(g.x, g.y); c.rotate(g.a);
  rr(c, -13, -19, 26, 38, 8); const gr = c.createLinearGradient(-12, 0, 12, 0); gr.addColorStop(0, '#ddd8f6'); gr.addColorStop(1, '#bbb3e6'); c.fillStyle = gr; c.fill();
  rr(c, 4, -15, 10, 30, 4); c.fillStyle = '#4a4370'; c.fill();
  c.fillStyle = 'rgba(255,255,255,.5)'; for (let i = -9; i <= 9; i += 6) { c.fillRect(-8, i - 1, 9, 2); }
  c.restore();
  // räknare
  const bx = g.x - ca * 14 + 16, by = g.y - sa * 14 + 16;
  rr(c, bx - 8, by - 8, 16, 16, 5); c.fillStyle = '#fff'; c.fill(); rr(c, bx - 6.5, by - 6.5, 13, 13, 4); c.fillStyle = '#e8743a'; c.fill();
  c.fillStyle = '#fff'; c.font = '700 10px Fredoka'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(g.list.length, bx, by + .5);
}

function drawVehicle(c, v, opt = {}) {
  const T = TYPES[v.type];
  const hid = v.hidden && !v.revealed;
  const P = hid ? HID : PAL[v.col];
  const sc = v.sc * (1 + v.pulse * .08 * Math.sin(v.pulse * 12));
  const L = T.L * sc, w = T.Wd * sc, r = v.type === 'car' ? w * .42 : w * .32;
  const wob = v.wob ? Math.sin(G ? G.time * 50 : 0) * v.wob * .09 : 0;
  const a = v.a + wob;
  const lift = opt.lift || (v.anim && v.anim.kind === 'fly' ? (v.sc - 1) * 30 : 0);
  c.save(); c.globalAlpha = v.alpha;
  // skugga
  c.save(); c.translate(v.x + 3 + lift * .3, v.y + 8 + lift); c.rotate(a); rr(c, -L / 2 - 1, -w / 2 - 1, L + 2, w + 2, r); c.fillStyle = 'rgba(55,35,110,.22)'; c.fill(); c.restore();
  // sida + hjul
  c.save(); c.translate(v.x, v.y + 6.5 * sc); c.rotate(a);
  c.fillStyle = '#26232f';
  for (const fx of v.type === 'bus' ? [-.32, .3] : [-.28, .28]) { rr(c, fx * L - L * .09, -w / 2 - 1.6, L * .18, w + 3.2, 2.5); c.fill(); }
  rr(c, -L / 2, -w / 2, L, w, r); c.fillStyle = P.dk; c.fill();
  c.restore();
  // ovansida
  c.save(); c.translate(v.x, v.y); c.rotate(a);
  rr(c, -L / 2, -w / 2, L, w, r);
  const gr = c.createLinearGradient(0, -w / 2, 0, w / 2); gr.addColorStop(0, P.lt); gr.addColorStop(.5, P.c); gr.addColorStop(1, P.c); c.fillStyle = gr; c.fill();
  // fönsterband
  const front = v.type === 'car' ? 7 : 5, back = v.type === 'car' ? 4 : 3;
  rr(c, -L / 2 + back * sc, -w / 2 + 2.3 * sc, L - (back + 2.5) * sc, w - 4.6 * sc, r * .7);
  c.fillStyle = hid ? '#585470' : '#c6efff'; c.fill();
  if (v.type === 'bus' || v.type === 'van') {
    c.strokeStyle = P.c; c.lineWidth = 1.3 * sc;
    const n = v.type === 'bus' ? 6 : 3;
    for (let i = 1; i < n; i++) { const x = -L / 2 + back * sc + (L - (back + front) * sc) * i / n; c.beginPath(); c.moveTo(x, -w / 2 + 2); c.lineTo(x, w / 2 - 2); c.stroke(); }
  }
  // tak
  rr(c, -L / 2 + (back + 1.6) * sc, -w / 2 + 4 * sc, L - (back + front + 1.6) * sc, w - 8 * sc, r * .5);
  const rg = c.createLinearGradient(0, -w / 2, 0, w / 2); rg.addColorStop(0, P.lt2 || P.lt); rg.addColorStop(1, P.lt); c.fillStyle = rg; c.fill();
  c.fillStyle = 'rgba(255,255,255,.35)'; rr(c, -L / 2 + (back + 3) * sc, -w / 2 + 4.8 * sc, L - (back + front + 5) * sc, 2 * sc, 1); c.fill();
  // strålkastare
  c.fillStyle = '#fff6c0'; c.beginPath(); c.arc(L / 2 - 1.6 * sc, -w / 2 + 3 * sc, 1.4 * sc, 0, 7); c.arc(L / 2 - 1.6 * sc, w / 2 - 3 * sc, 1.4 * sc, 0, 7); c.fill();
  const docked = v.state === 'dock' || v.state === 'leave';
  if (docked) {
    // säten med Hannisar
    const cols = T.cols, rows = 2, x0 = -L / 2 + (back + 4) * sc, x1 = L / 2 - (front + 3) * sc;
    for (let i = 0; i < v.cap; i++) {
      const ci = Math.floor(i / rows), ri = i % rows;
      const x = x1 - (cols === 1 ? 0 : (x1 - x0) * ci / (cols - 1)), y = (ri ? 1 : -1) * (w * .2);
      if (i < v.filled) {
        c.save(); c.translate(x, y); c.rotate(-a); drawPerson(c, v.col, 0, 0, .62); c.restore();
      } else { c.fillStyle = P.c; c.globalAlpha = v.alpha * .55; c.beginPath(); c.arc(x, y, 2.6 * sc, 0, 7); c.fill(); c.globalAlpha = v.alpha; }
    }
  } else {
    // pil
    const al = L * .5, x0 = -al * .55, x1 = al * .5;
    c.lineCap = 'round'; c.lineJoin = 'round';
    for (const [col, lw, oy] of [['rgba(30,20,60,.3)', 4.4, 1], ['#ffffff', 3.4, 0]]) {
      c.strokeStyle = col; c.lineWidth = lw * sc; c.beginPath();
      c.moveTo(x0 - front * .3, oy); c.lineTo(x1 - front * .3, oy);
      c.moveTo(x1 - front * .3 - 5 * sc, oy - 4.5 * sc); c.lineTo(x1 - front * .3, oy); c.lineTo(x1 - front * .3 - 5 * sc, oy + 4.5 * sc); c.stroke();
    }
  }
  c.restore();
  if (hid) {
    c.save(); c.translate(v.x, v.y - 1);
    c.beginPath(); c.arc(0, 0, 7.5, 0, 7); c.fillStyle = '#fff'; c.fill();
    c.fillStyle = '#33304a'; c.font = '700 12px Fredoka'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('?', 0, 1); c.restore();
  }
  if (opt.glow) {
    c.save(); c.translate(v.x, v.y); c.rotate(a); rr(c, -L / 2 - 3, -w / 2 - 3, L + 6, w + 6, r + 2);
    c.strokeStyle = `rgba(255,210,31,${.5 + .5 * Math.sin(G.time * 8)})`; c.lineWidth = 3; c.stroke(); c.restore();
  }
  c.restore();
}

function render() {
  cx = cv.getContext('2d');
  const c = cx;
  c.setTransform(1, 0, 0, 1, 0, 0);
  if (staticLayer) c.drawImage(staticLayer, 0, 0);
  if (!G) return;
  c.setTransform(DPR * SC, 0, 0, DPR * SC, DPR * OX, DPR * OY);
  // kön (bakifrån och fram)
  const vis = [];
  const top = -OY / SC - 20;
  G.roads.forEach((q, ri) => {
    const n = Math.min(q.length, 330);
    for (let i = 0; i < n; i++) {
      const p = q[i];
      if (p.ds < 0) continue;
      const [x, y] = pathAt(ROADS[ri], p.ds, p.dl);
      if (y < top) continue;
      vis.push([y + Math.sin(G.time * 5 + p.hop) * .6, x, p.c]);
    }
  });
  G.ring.cells.forEach((cell, i) => {
    const s = cellS(i, G.ring.off);
    cell.forEach((f, l) => {
      if (!f) return;
      let [x, y] = ringAt(s, LANES[l]);
      if (f.ent < 1) { const e = ease(f.ent); x = lerp(f.fx, x, e); y = lerp(f.fy, y, e) - Math.sin(f.ent * Math.PI) * 10; }
      vis.push([y + Math.sin(G.time * 7 + f.hop) * .8, x, f.c]);
    });
  });
  vis.sort((a, b) => a[0] - b[0]);
  for (const [y, x, col] of vis) drawPerson(c, col, x, y);
  drawSlots(c);
  for (const g of G.garages) drawGarage(c, g);
  const vs = G.vehicles.filter(v => v.state === 'park' || v.state === 'dock').sort((a, b) => a.y - b.y);
  for (const v of vs) drawVehicle(c, v, { glow: G.vipSel && v.state === 'park' });
  for (const v of G.vehicles) if (v.state === 'move' || v.state === 'leave') drawVehicle(c, v);
  // flygande Hannisar
  for (const f of G.flyers) {
    const t = clamp(f.t / f.dur, 0, 1), v = f.v;
    const tx = v.x, ty = v.y;
    const x = lerp(f.x0, tx, t), y = lerp(f.y0, ty, t) - Math.sin(t * Math.PI) * 28;
    drawPerson(c, f.c, x, y, 1 - t * .35);
  }
  for (const p of G.parts) {
    c.save(); c.globalAlpha = clamp(1 - p.t / p.life, 0, 1) ; c.translate(p.x, p.y); c.rotate(p.r); c.fillStyle = p.c; c.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); c.restore();
  }
}

function resize() {
  DPR = Math.min(window.devicePixelRatio || 1, 2.5);
  CW = innerWidth; CH = innerHeight;
  cv.width = Math.round(CW * DPR); cv.height = Math.round(CH * DPR);
  const bar = $('bar').getBoundingClientRect();
  BAR = CH - bar.top + 12;
  SC = Math.min(CW / W, (CH - BAR) / H);
  OX = (CW - W * SC) / 2;
  OY = Math.max(0, CH - BAR - H * SC);
  staticLayer = buildStatic();
}

// ---------- Inmatning ----------
cv.addEventListener('pointerdown', e => {
  if (!G || G.paused || G.over || G.won) return;
  const x = (e.clientX - OX) / SC, y = (e.clientY - OY) / SC;
  // låsta platser
  for (const s of G.slots) if (s.locked && Math.abs(x - s.x) < 22 && Math.abs(y - ST.slotY) < 40) { useSlot(); return; }
  if (Math.abs(x - G.slots[0].x) < 22 && Math.abs(y - ST.slotY) < 40 && !G.slots[0].veh) { useVip(); return; }
  // fordon – översta först
  const vs = G.vehicles.filter(v => v.state === 'park').sort((a, b) => b.y - a.y);
  let best = null, bd = 1e9;
  for (const v of vs) {
    const dx = x - v.x, dy = y - v.y, c = Math.cos(-v.a), s = Math.sin(-v.a);
    const lx = dx * c - dy * s, ly = dx * s + dy * c;
    if (Math.abs(lx) < v.L / 2 + 5 && Math.abs(ly) < v.Wd / 2 + 6) { const d = Math.hypot(lx, ly); if (d < bd) { bd = d; best = v; } }
  }
  if (best) tapVehicle(best);
});

// ---------- UI ----------
let toastT = 0;
function toast(t) { const el = $('toast'); el.textContent = t; el.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('on'), 1500); }
function open(id) { document.querySelectorAll('.ov').forEach(o => o.classList.toggle('on', o.id === id)); }
function closeAll() { document.querySelectorAll('.ov').forEach(o => o.classList.remove('on')); }
function play() { closeAll(); startLevel(S.level); }
function setHud(on) { for (const id of ['hud', 'bar', 'left']) $(id).style.visibility = on ? '' : 'hidden'; }

$('bPlay').onclick = () => { SFX.tap(); setHud(true); play(); };
$('bHow').onclick = () => open('how');
document.querySelectorAll('[data-close]').forEach(b => b.onclick = () => open(G ? '' : 'menu'));
$('bSnd').onclick = () => { S.snd = !S.snd; save(); $('bSnd').textContent = S.snd ? '🔊' : '🔇'; };
$('bSnd').textContent = S.snd ? '🔊' : '🔇';
$('bRestart').onclick = () => { if (G && !G.won) { SFX.tap(); startLevel(G.level); closeAll(); } };
$('bPause').onclick = () => { if (G && !G.won && !G.over) { G.paused = true; open('pause'); } };
$('bResume').onclick = () => { G.paused = false; closeAll(); };
$('bRetry2').onclick = () => { startLevel(G.level); closeAll(); };
$('bMenu').onclick = () => { G = null; setHud(false); showMenu(); };
$('bNext').onclick = () => { SFX.tap(); play(); };
$('bRetry').onclick = () => { startLevel(G.level); closeAll(); };
$('bLoseSlot').onclick = () => { G.over = false; closeAll(); useSlot(); };
$('bLoseVip').onclick = () => { G.over = false; G.stuckT = -3; closeAll(); useVip(); };
$('bSlot').onclick = useSlot;
$('bShuffle').onclick = useShuffle;
$('bVip').onclick = useVip;
$('bCoins').onclick = () => toast(`Du har ${S.coins} 🪙 – klara nivåer för fler!`);

function showMenu() {
  open('menu');
  $('bPlay').textContent = '▶ Spela – nivå ' + S.level;
  updateBar();
  drawMenuArt();
}
function buildLogo() {
  const cols = ['#ff4fb4', '#ff8f1f', '#ffcf1f', '#79d42a', '#3d8bff', '#9a4dff'];
  $('logo').innerHTML = [...'Hannis'].map((ch, i) => `<span style="--c:${cols[i]};animation-delay:${i * .12}s">${ch}</span>`).join('');
}
function drawMenuArt() {
  const m = $('menuArt'), d = Math.min(devicePixelRatio || 1, 2.5), r = m.getBoundingClientRect();
  if (!r.width) return;
  m.width = r.width * d; m.height = r.height * d;
  const c = m.getContext('2d'), s = Math.min(r.width / 280, r.height / 110);
  c.setTransform(d * s, 0, 0, d * s, d * (r.width - 280 * s) / 2, d * (r.height - 110 * s) / 2);
  const road = (w, col) => { c.strokeStyle = col; c.lineWidth = w; c.lineCap = 'round'; c.beginPath(); c.moveTo(-60, 78); c.lineTo(190, 78); c.quadraticCurveTo(222, 78, 222, 50); c.stroke(); };
  road(52, '#f6f4fb'); road(44, '#8f89a6');
  const seq = [0, 0, 3, 3, 3, 1, 1, 4, 4, 2, 2, 2, 5, 5, 6, 6];
  const items = [];
  for (let i = 0; i < 14; i++) for (let l = 0; l < 3; l++) items.push([176 - i * 13, 64 + l * 13, seq[(i + l) % seq.length]]);
  items.sort((a, b) => a[1] - b[1]).forEach(([x, y, col]) => drawPerson(c, col, x, y));
  const bus = makeVeh('bus', 0, 238, 26, Math.PI, false); bus.state = 'dock'; bus.filled = 6;
  const van = makeVeh('van', 1, 40, 22, -0.25, false);
  const car = makeVeh('car', 3, 110, 18, 0.35, false);
  const car2 = makeVeh('car', 7, 262, 88, -Math.PI / 2 - 0.3, false);
  for (const v of [car, van, bus, car2]) drawVehicle(c, v);
  uid = 1;
}

// ---------- Snabbspola ----------
let FF = 1;
function setFF(n) { FF = n; $('ffN').textContent = n + '×'; $('bFF').classList.toggle('on', n > 1); }
$('bFF').onclick = () => { setFF(FF >= 3 ? 1 : FF + 1); SFX.tap(); };
setFF(1);

// ---------- Huvudloop ----------
let last = performance.now();
function frame(now) {
  const dt = Math.min(.05, (now - last) / 1000); last = now;
  for (let k = 0; k < FF; k++) update(dt);
  render();
  requestAnimationFrame(frame);
}
addEventListener('resize', () => { resize(); if ($('menu').classList.contains('on')) drawMenuArt(); });
document.addEventListener('visibilitychange', () => { if (document.hidden && G && !G.over && !G.won && !G.paused) { G.paused = true; open('pause'); } });

(async function init() {
  try { await document.fonts.load('700 14px Fredoka'); } catch (e) { }
  makePersonSprites();
  buildLogo();
  resize();
  setHud(false);
  showMenu();
  requestAnimationFrame(frame);
})();

// för tester
window.__hannis = { get G() { return G; }, S, startLevel, genLevel, tapVehicle, sweep, obbOf, obstaclesFor, drawVehicle, drawPerson, makeVeh, rr };
