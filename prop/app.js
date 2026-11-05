/* Bucinca Kurragömma – menyer, mot datorn, nätverk (wifi + internet), styrning, ritning av huset och sakerna, mörker för sökarna. */
'use strict';
const store = makeStore('bq');
const Q = new URLSearchParams(location.search);
const PORT = 8765;
const REMOTE = (location.protocol === 'http:' && location.port === String(PORT)) || !!NET_ONLINE;
const HOSTPAGE = REMOTE && Q.get('host') === '1';
const CLIENT = REMOTE && !HOSTPAGE;
const APP_HOME = 'https://appassets.androidplatform.net/assets/';
const canHost = () => !!(window.Android && Android.netHost);
const { ITEMS, CS, GW, GH, W: WW, H: WH, grid, ROOMS } = PROP;
const ROLEC = { h: '#FF8A1F', p: '#34C759' }, ROLEN = { h: '🔎 Sökare', p: '🫥 Gömmare' };
const VIS = 620;   // så långt sökarna ser med sin ficklampa

const SFX = Object.assign({}, CORE_SFX, {
  shot: near => { noise(.12, { type: 'bandpass', f: 1600, q: 1.5, vol: .22 * near }); tone(500, .08, { to: 200, type: 'sine', vol: .06 * near }); },
  splash: near => noise(.18, { type: 'bandpass', f: 900, q: 1, vol: .2 * near }),
  hit: () => [880, 660].forEach((f, i) => tone(f, .08, { type: 'square', vol: .07, delay: i * .06 })),
  oops: () => tone(300, .25, { to: 150, type: 'sawtooth', vol: .07 }),
  morph: () => [523, 784, 1047].forEach((f, i) => tone(f, .1, { type: 'triangle', vol: .09, delay: i * .05 })),
  caught: () => [1047, 784, 523, 392].forEach((f, i) => tone(f, .15, { type: 'triangle', vol: .12, delay: i * .08 })),
  taunt: (near, k) => { const songs = [[784, 988, 1175], [659, 523, 659, 784], [1047, 880, 1047], [523, 659, 784, 1047]]; songs[k % songs.length].forEach((f, i) => tone(f, .14, { type: 'square', vol: .09 * near, delay: i * .12 })); },
  tick: () => tone(1200, .04, { type: 'square', vol: .05 }),
  go: () => [523, 659, 784, 1047].forEach((f, i) => tone(f, .18, { type: 'square', vol: .08, delay: i * .1 })),
  sad: () => [392, 330, 262].forEach((f, i) => tone(f, .28, { vol: .12, delay: i * .18 }))
});

/* ---------- jag ---------- */
const ME = { ch: store.get('ch', 0) };
if (Q.get('c') != null && !isNaN(+Q.get('c'))) ME.ch = +Q.get('c');
if (!(ME.ch >= 0 && ME.ch < CHARS.length)) ME.ch = 0;
const myName = () => REMOTE && Q.get('n') && +Q.get('c') === ME.ch ? Q.get('n').slice(0, 14) : charName(ME.ch);
const FACES = CHARS.map((_, i) => { const im = new Image(); im.src = avatarSrc(i); return im; });
const stats = () => Object.assign({ matches: 0, wins: 0, catches: 0 }, store.get('stats', {}) || {});

/* ---------- skärmar ---------- */
let current = 'menu';
function show(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.toggle('on', s.id === id));
  current = id;
  if (id === 'menu') buildMenu();
  if (id === 'quick') buildQuick();
  if (id === 'join') buildJoin();
  if (id === 'lobby') buildLobby();
  if (id === 'game') resize();
  if (window.Android && Android.keepAwake) try { Android.keepAwake(id === 'game' || id === 'lobby'); } catch (e) { }
}
function panel(html) { $('panel').innerHTML = html; $('overlay').classList.add('on'); }
function closePanel() { $('overlay').classList.remove('on'); }
function buildMenu() {
  let k = 0;
  const ln = (w, cls) => `<div class="${cls}">` + [...w].map(ch => ch === ' ' ? '<span class="sp"></span>' :
    `<span style="color:${CHARS[k % 4].c};animation-delay:${(k++) * .1}s">${ch}</span>`).join('') + '</div>';
  $('logo').innerHTML = ln('Kurra', 'l1') + ln('gömma 🫥', 'l2');
  const st = stats();
  $('meCard').setAttribute('style', styleOf(ME.ch));
  $('meCard').innerHTML = `${avHTML(ME.ch)}<div style="text-align:left"><small>Spelare (tryck för att byta)</small><b>${esc(charName(ME.ch))}</b>
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:3px"><span class="chip">🏆 ${st.wins} vinster</span><span class="chip">🔎 ${st.catches} fångade</span></div></div>`;
  $('toHost').classList.toggle('hidden', !canHost());
}
function pickFigure(title, done, back) {
  $('meTitle').textContent = title;
  $('chars').innerHTML = CHARS.map((_, i) => `<button class="char ${i === ME.ch ? 'chosen' : ''}" data-i="${i}" style="${styleOf(i)}">${avHTML(i)}<b>${esc(charName(i))}</b></button>`).join('');
  $('chars').querySelectorAll('.char').forEach(el => el.onclick = () => {
    ME.ch = +el.dataset.i; store.set('ch', ME.ch); SFX.pick(); buzz(12);
    el.classList.add('pick'); setTimeout(done, 220);
  });
  $('meBack').onclick = () => { SFX.tap(); (back || (() => show('menu')))(); };
  show('meScr');
}

/* ---------- mot datorn ---------- */
const QS = Object.assign({ n: 6, diff: 1, rounds: 1 }, store.get('qs', {}));
const DIFF = [{ n: 'Lätt', lv: 2 }, { n: 'Medel', lv: 5 }, { n: 'Svår', lv: 8 }, { n: 'Proffs', lv: 10 }];
const ROUNDS = [3, 4, 6];
const roundsOf = i => ROUNDS[Math.max(0, Math.min(2, i | 0))];
function seg(id, vals, cur, label) { return `<div class="opt"><b>${label}</b><div class="seg" data-s="${id}">${vals.map(v => `<button data-v="${v[0]}" class="${String(v[0]) === String(cur) ? 'on' : ''}">${v[1]}</button>`).join('')}</div></div>`; }
const segVal = b => isNaN(+b.dataset.v) ? b.dataset.v : +b.dataset.v;
function buildQuick() {
  $('qBox').innerHTML = `<div class="card"><h4>Kurragömma i huset 🏠</h4><div class="opts">
    ${seg('n', [[3, '3'], [4, '4'], [6, '6'], [8, '8']], QS.n, '👥 Spelare')}
    ${seg('diff', DIFF.map((d, i) => [i, d.n]), QS.diff, '⭐ Svårighet')}
    ${seg('rounds', ROUNDS.map((v, i) => [i, String(v)]), QS.rounds, '🔁 Ronder')}
    </div><p class="note">Varje rond blir ungefär en av tre <b>sökare</b> – resten är <b>gömmare</b> som förvandlar sig till saker i huset. Alla får vara sökare någon gång. Flest poäng efter alla ronder vinner!</p>
    <button class="btn green" id="qGo">🫥 Spela!</button></div>`;
  $('qBox').querySelectorAll('.seg button').forEach(b => b.onclick = () => { QS[b.parentNode.dataset.s] = segVal(b); store.set('qs', QS); SFX.tap(); buildQuick(); });
  $('qGo').onclick = () => { SFX.tap(); startQuick(); };
}
function fillBots(pl, n, lv) {
  const used = pl.map(p => p.ch); let k = 0;
  while (pl.length < n) {
    const free = CHARS.map((_, i) => i).filter(i => !used.includes(i));
    const ch = free.length ? pick(free) : Math.floor(Math.random() * CHARS.length); used.push(ch);
    pl.push({ id: 'b' + (k++), name: charName(ch), ch, bot: Math.max(1, Math.min(10, lv + (Math.random() < .3 ? -1 : 0))) });
  }
  return pl;
}
function startQuick() {
  const pl = fillBots([{ id: 'me', name: charName(ME.ch), ch: ME.ch, bot: -1 }], QS.n, DIFF[QS.diff].lv);
  G.mode = 'local'; G.kind = 'quick';
  begin(new PROP.Game(pl, { rounds: roundsOf(QS.rounds) }), 'me');
}

/* ================= MATCHEN ================= */
const G = { mode: 'local', kind: 'quick', game: null, snap: null, me: 'me', lastEv: 0, acc: 0, endShown: false, endT: 0, res: null, sendN: 0, disp: {}, evSent: 0, F: [], fv: -1, furT: 0, ripples: [], lastTick: 0 };
function begin(game, me) {
  G.game = game; G.me = me; G.snap = game ? game.snap() : null; G.lastEv = 0; G.endShown = false; G.endT = 0; G.res = null; G.disp = {}; G.evSent = 0; G.fv = -1; G.ripples = [];
  if (game) { G.F = game.F; G.fv = game.fv; FURN.fv = -1; }
  FX.reset(); closePanel(); show('game');
  $('feed').innerHTML = '';
  $('hint').classList.remove('hidden'); setTimeout(() => $('hint').classList.add('hidden'), 6000);
}
let paused = false;

/* ---------- styrning ---------- */
const INP = { mx: 0, my: 0, ax: 0, ay: 0, fire: 0 };
const PRESS = {};
const FIRE = { btn: 0 };
const STK = { m: null, a: null };
const STR = () => Math.max(46, Math.min(80, Math.min(VW, VH) * .12));
const cvEl = $('cv');
cvEl.addEventListener('pointerdown', e => {
  if (current !== 'game') return;
  e.preventDefault();
  if (e.pointerType === 'mouse') { MOUSE.down = true; MOUSE.x = e.clientX; MOUSE.y = e.clientY; MOUSE.used = true; return; }
  const left = e.clientX < VW / 2;
  const s = { id: e.pointerId, ox: e.clientX, oy: e.clientY, x: e.clientX, y: e.clientY, t: performance.now(), far: 0 };
  if (left && !STK.m) STK.m = s; else if (!left && !STK.a) STK.a = s;
  try { cvEl.setPointerCapture(e.pointerId); } catch (er) { }
  updStick();
});
cvEl.addEventListener('pointermove', e => {
  if (e.pointerType === 'mouse') { MOUSE.x = e.clientX; MOUSE.y = e.clientY; MOUSE.used = true; return; }
  for (const k of ['m', 'a']) if (STK[k] && STK[k].id === e.pointerId) { STK[k].x = e.clientX; STK[k].y = e.clientY; if (Math.hypot(STK[k].x - STK[k].ox, STK[k].y - STK[k].oy) > 14) STK[k].far = 1; }
  updStick();
});
const endPtr = e => {
  if (e.pointerType === 'mouse') { MOUSE.down = false; return; }
  for (const k of ['m', 'a']) if (STK[k] && STK[k].id === e.pointerId) {
    // snabbt tryck på höger sida = skjut dit (sökare)
    if (k === 'a' && !STK.a.far && performance.now() - STK.a.t < 300) tapShoot(e.clientX, e.clientY);
    STK[k] = null;
  }
  updStick();
};
cvEl.addEventListener('pointerup', endPtr); cvEl.addEventListener('pointercancel', endPtr);
cvEl.addEventListener('contextmenu', e => e.preventDefault());
const MOUSE = { x: 0, y: 0, down: false, used: false };
const KEYS = {};
addEventListener('keydown', e => {
  if (current !== 'game') return;
  KEYS[e.code] = true;
  if (e.code === 'KeyE') PRESS.morph = 1; else if (e.code === 'KeyR') PRESS.turn = 1; else if (e.code === 'KeyQ') PRESS.taunt = 1; else if (e.code === 'Space') e.preventDefault();
});
addEventListener('keyup', e => { KEYS[e.code] = false; });
function updStick() {
  const R = STR();
  const v = s => { if (!s) return [0, 0, 0]; let dx = s.x - s.ox, dy = s.y - s.oy; const l = Math.hypot(dx, dy); if (l > R) { s.ox = s.x - dx / l * R; s.oy = s.y - dy / l * R; dx = s.x - s.ox; dy = s.y - s.oy; } return [dx / R, dy / R, Math.min(1, l / R)]; };
  const m = v(STK.m), a = v(STK.a);
  INP.mx = m[0]; INP.my = m[1];
  if (STK.a && a[2] > .25) { INP.ax = a[0]; INP.ay = a[1]; }
}
const meOf = s => s && s.P.find(p => p.id === G.me);
function tapShoot(sx, sy) {
  const me = meOf(G.snap); if (!me || !me.al || me.ro !== 'h' || G.snap.ph !== 'seek') return;
  const [wx, wy] = toWorld(sx, sy); PRESS.shoot = { x: Math.round(wx), y: Math.round(wy) };
  INP.ax = wx - me.x; INP.ay = wy - me.y; const l = Math.hypot(INP.ax, INP.ay) || 1; INP.ax /= l; INP.ay /= l;
}
function readInput() {
  let kx = 0, ky = 0;
  if (KEYS.KeyA || KEYS.ArrowLeft) kx -= 1; if (KEYS.KeyD || KEYS.ArrowRight) kx += 1;
  if (KEYS.KeyW || KEYS.ArrowUp) ky -= 1; if (KEYS.KeyS || KEYS.ArrowDown) ky += 1;
  const out = Object.assign({}, INP);
  if (kx || ky) { const l = Math.hypot(kx, ky); out.mx = kx / l; out.my = ky / l; }
  const me = meOf(G.snap);
  if (MOUSE.used && me) {
    const D = G.disp[me.id] || me, [sx, sy] = toScreen(D.x, D.y);
    out.ax = MOUSE.x - sx; out.ay = MOUSE.y - sy; const l = Math.hypot(out.ax, out.ay) || 1; out.ax /= l; out.ay /= l;
    if (MOUSE.down) out.fire = 1;
  }
  if (FIRE.btn || KEYS.Space) out.fire = 1;
  for (const k in PRESS) { out[k] = PRESS[k]; delete PRESS[k]; }
  return out;
}
const tapBtn = (id, fn) => $(id).addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); fn(); buzz(12); });
tapBtn('bMorph', () => PRESS.morph = 1);
tapBtn('bTurn', () => PRESS.turn = 1);
tapBtn('bTaunt', () => PRESS.taunt = 1);
const fireB = $('fireB');
fireB.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); FIRE.btn = 1; fireB.classList.add('on'); try { fireB.setPointerCapture(e.pointerId); } catch (er) { } buzz(10); });
const fireUp = () => { FIRE.btn = 0; fireB.classList.remove('on'); };
fireB.addEventListener('pointerup', fireUp); fireB.addEventListener('pointercancel', fireUp); fireB.addEventListener('lostpointercapture', fireUp);

let lastSent = '', lastSendT = 0;
function pushInput(now) {
  const inp = readInput();
  if (G.mode === 'client') {
    const oneShot = inp.morph || inp.turn || inp.taunt || inp.shoot;
    const key = [inp.mx.toFixed(2), inp.my.toFixed(2), inp.ax.toFixed(2), inp.ay.toFixed(2), inp.fire].join();
    if (oneShot || (key !== lastSent && now - lastSendT > 45) || now - lastSendT > 400) { lastSent = key; lastSendT = now; clSend({ t: 'in', i: inp }); }
  } else if (G.game) G.game.setInput(G.me, inp);
}

/* ---------- huvudloop ---------- */
let lastT = performance.now();
function loop(now) {
  requestAnimationFrame(loop);
  const dt = Math.max(0, Math.min(.1, (now - lastT) / 1000)); lastT = now;
  if (current !== 'game' || !G.snap) return;
  if (!paused) pushInput(now);
  if (G.game && G.mode !== 'client' && !paused) {
    G.acc += dt; let n = 0;
    const every = NET_ONLINE ? 3 : 2;
    while (G.acc >= PROP.DT && n < 8) {
      const fv = G.game.fv;
      G.game.step(); G.acc -= PROP.DT; n++;
      if (G.mode === 'host') {
        if (G.game.fv !== fv) hostAll(Object.assign({ t: 'fur' }, G.game.furniture()));
        if (++G.sendN % every === 0) { hostAll({ t: 's', s: G.game.snap(G.evSent) }); G.evSent = G.game.evSeq; }
      }
    }
    G.snap = G.game.snap(); G.F = G.game.F; G.fv = G.game.fv;
    if (G.mode === 'host' && G.game.over && !G.resSent) { G.resSent = true; hostAll({ t: 's', s: G.game.snap(G.evSent) }); G.evSent = G.game.evSeq; hostAll({ t: 'res', r: G.game.result(), w: G.game.winner }); }
  }
  if (G.mode === 'client' && G.snap.fv !== G.fv && now - G.furT > 1500) { G.furT = now; clSend({ t: 'fur?' }); }
  smooth(dt);
  handleEvents(G.snap);
  updHud(G.snap);
  FX.tick(dt);
  draw(G.snap, now / 1000, dt);
  // nedräkning i göm-fasen
  if (G.snap.ph === 'hide' && G.snap.tm <= 5 && G.snap.tm !== G.lastTick) { G.lastTick = G.snap.tm; if (G.snap.tm > 0) SFX.tick(); }
  if (G.snap.ov && !G.endShown) { G.endT += dt; if (G.endT > 2.6 && (G.mode !== 'client' || G.res)) { G.endShown = true; showResult(); } }
}
requestAnimationFrame(loop);
function smooth(dt) {
  for (const p of G.snap.P) {
    const d = G.disp[p.id] || (G.disp[p.id] = { x: p.x, y: p.y, a: p.a, step: 0 });
    const k = G.mode === 'client' ? Math.min(1, dt * 18) : 1;
    const jump = Math.hypot(p.x - d.x, p.y - d.y) > 200;
    const nx = jump ? p.x : d.x + (p.x - d.x) * k, ny = jump ? p.y : d.y + (p.y - d.y) * k;
    d.step += Math.hypot(nx - d.x, ny - d.y); d.x = nx; d.y = ny;
    d.a += angD(d.a, p.a) * (jump ? 1 : Math.min(1, k * 1.5));
  }
}
const angD = (a, b) => { let d = b - a; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; return d; };

/* ---------- HUD ---------- */
const mm = t => `${Math.floor(t / 60)}:${String(t % 60).padStart(2, '0')}`;
function nearestPick(me) {
  let best = null, bd = 110;
  for (const f of G.F) { if (!ITEMS[f.k] || !ITEMS[f.k].pick) continue; const d = Math.hypot(f.x - me.x, f.y - me.y) - f.r; if (d < bd) { bd = d; best = f; } }
  return best;
}
function updHud(s) {
  const me = meOf(s);
  const props = s.P.filter(p => !p.out && p.al && p.ro === 'p').length;
  if (me) {
    $('mebox').innerHTML = `${avHTML(me.ch)}<div class="bars"><b><span class="roleT" style="background:${ROLEC[me.ro]}">${ROLEN[me.ro]}</span>${me.al ? (me.ro === 'h' ? `❤️ ${me.hp}` : me.d ? ITEMS[me.d].n : 'Inte förvandlad!') : '💤 Ute'}</b><div class="bar"><i style="width:${me.hp}%"></i></div></div>`;
    $('mebox').querySelector('.av').style.borderColor = ROLEC[me.ro];
    const isP = me.ro === 'p' && me.al, isH = me.ro === 'h' && me.al && s.ph === 'seek';
    $('gR').classList.toggle('hidden', !isP);
    fireB.classList.toggle('hidden', !isH || (MOUSE.used && !STK.m && !STK.a && !FIRE.btn));
    if (!isH) fireUp();
    if (isP) {
      const f = nearestPick(me);
      $('morphT').textContent = f ? `Bli ${ITEMS[f.k].n.toLowerCase()}` : 'Gå nära en sak';
      $('bMorph').classList.toggle('dim', !f); $('bMorph').classList.toggle('on2', !me.d && !!f);
      $('bTurn').classList.toggle('dim', !me.d);
      const ready = s.ph === 'seek' && me.tt <= PROP.T_TAUNT - 8;
      $('bTaunt').classList.toggle('dim', !ready); $('tauntN').textContent = s.ph === 'seek' ? (ready ? '+2' : me.tt) : '';
    }
  } else { $('mebox').innerHTML = '<b>👀 Tittar på</b>'; $('gR').classList.add('hidden'); fireB.classList.add('hidden'); }
  $('clock').innerHTML = s.ph === 'hide' ? `🙈 ${s.tm}<small>Göm er! · rond ${s.rd}/${s.rds}</small>` : s.ph === 'seek' ? `🔎 ${mm(s.tm)}<small>🫥 ${props} kvar · rond ${s.rd}/${s.rds}</small>` : `⭐<small>rond ${s.rd}/${s.rds}</small>`;
  const top = s.P.filter(p => !p.out).sort((a, b) => b.sc - a.sc).slice(0, 4);
  $('side').innerHTML = top.map(p => `<div style="${p.id === G.me ? 'color:#FFD23F' : ''}">${esc(p.n)} ${p.sc}</div>`).join('');
  // knapparnas plats
  const land = VW > VH, R = STR();
  const gR = $('gR');
  gR.style.right = `calc(var(--safe-r) + ${land ? 14 : 10}px)`; gR.style.bottom = `calc(var(--safe-b) + ${R * 2 + 56}px)`;
  const fs = fireB.offsetHeight || 90;
  if (land) { fireB.style.right = `calc(var(--safe-r) + ${R * 2 + 52}px)`; fireB.style.bottom = `calc(var(--safe-b) + ${Math.max(10, 30 + R - fs / 2)}px)`; }
  else { fireB.style.right = `calc(var(--safe-r) + ${34 + R - fs / 2}px)`; fireB.style.bottom = `calc(var(--safe-b) + ${R * 2 + 52}px)`; }
}
let bigT = 0;
function big(txt, ms, sub) {
  const el = $('big'); el.innerHTML = txt + (sub ? `<small>${sub}</small>` : ''); el.classList.remove('hidden', 'pop'); void el.offsetWidth; el.classList.add('pop');
  clearTimeout(bigT); bigT = setTimeout(() => el.classList.add('hidden'), ms || 1200);
}
function feed(html, mine) { const d = document.createElement('div'); d.innerHTML = html; if (mine) d.className = 'mine'; $('feed').prepend(d); while ($('feed').children.length > 5) $('feed').lastChild.remove(); setTimeout(() => d.remove(), 5000); }

/* ---------- händelser ---------- */
function nearOf(x, y) { const m = meOf(G.snap) || { x: CAM.x, y: CAM.y }; return Math.max(.06, 1 - Math.hypot(x - m.x, y - m.y) / 1500); }
function handleEvents(s) {
  const P = id => s.P.find(q => q.id === id);
  const nm = id => { const p = P(id); return p ? esc(p.n) : '?'; };
  const me = meOf(s);
  for (const e of s.ev) {
    if (e.id <= G.lastEv) continue;
    G.lastEv = e.id;
    switch (e.e) {
      case 'round': FX.reset(); G.ripples = []; if (me) big(`Rond ${s.rd}`, 2200, me.ro === 'h' ? '🔎 Du är SÖKARE – blunda och räkna!' : '🫥 Du är GÖMMARE – förvandla dig till en sak och göm dig!'); SFX.go(); break;
      case 'seek': SFX.go(); big(me && me.ro === 'h' ? 'Nu söker vi! 🔎' : 'Sökarna kommer! 🙊', 1200, me && me.ro === 'h' ? 'Skjut på saker som är gömmare' : 'Stå still…'); break;
      case 'shot': FX.tracer(e.x, e.y, e.ex, e.ey); SFX.shot(nearOf(e.x, e.y)); FX.splash(e.ex, e.ey); break;
      case 'hit': SFX.hit(); FX.text('💦', e.x, e.y - 30, '#fff', 26); if (e.p === G.me) { FX.red = .4; buzz(40); } break;
      case 'miss': if (e.p === G.me) { SFX.oops(); FX.text(`Oj, riktig ${ITEMS[e.k] ? ITEMS[e.k].n.toLowerCase() : 'sak'}! -4❤️`, e.x, e.y - 20, '#FFB0B0', 18); } break;
      case 'tired': feed(`💤 ${nm(e.p)} sköt för många saker och är ute`); if (e.p === G.me) big('Du är ute 💤', 1500, 'Du sköt för många riktiga saker'); break;
      case 'morph': if (e.p === G.me) { SFX.morph(); FX.puff(e.x, e.y); } break;
      case 'taunt': { const p = P(e.p); G.ripples.push({ x: e.x, y: e.y, t: 0 }); SFX.taunt(nearOf(e.x, e.y), p ? p.ch : 0); if (e.p === G.me && !e.f) FX.text('+2 ⭐', e.x, e.y - 40, '#FFD23F', 20); break; }
      case 'caught': {
        SFX.caught(); FX.puff(e.x, e.y); feed(`🔎 ${nm(e.by)} hittade ${nm(e.p)}${e.k && ITEMS[e.k] ? ` (${ITEMS[e.k].n.toLowerCase()})` : ''}`, e.by === G.me || e.p === G.me);
        if (e.by === G.me) { big('HITTAD! 🎉', 1100, '+10 ⭐'); buzz(60); }
        if (e.p === G.me) { big('Du blev hittad! 😮', 1800, 'Nu är du sökare – hjälp till att leta!'); buzz(150); }
        break;
      }
      case 'rend': { const myWin = me && me.ro === e.w; if (me) { if (myWin) SFX.win(); else SFX.sad(); }
        big(e.w === 'h' ? 'Sökarna vann! 🔎' : 'Gömmarna vann! 🫥', 2600, e.why === 'all' ? 'Alla gömmare hittades' : e.why === 'hunters' ? 'Sökarna orkade inte mer' : 'Tiden tog slut – de som klarade sig får +15'); break; }
      case 'join': feed(`👋 ${nm(e.p)} är med från nästa rond`); break;
      case 'left': feed(`🚪 ${esc(e.n)} lämnade`); break;
    }
  }
}

/* ---------- resultat ---------- */
async function showResult() {
  const R = (G.game ? G.game.result() : G.res.r).filter(r => !r.out).sort((a, b) => b.score - a.score);
  const W = G.game ? G.game.winner : G.res.w;
  const mine = R.find(r => r.id === G.me);
  const won = !!mine && mine.id === W;
  if (mine) { const st = stats(); st.matches++; if (won) st.wins++; st.catches += mine.catches; store.set('stats', st); hsAdd('propCatch', mine.catches); }
  const rank = `<div class="rank">${R.map((r, k) => `<div class="r ${r.id === G.me ? 'mine' : ''}">${k === 0 ? '👑' : (k + 1) + '.'} ${avHTML(r.ch)}<span>${esc(r.name)}${r.bot >= 0 ? ' 🤖' : ''}</span><b>⭐ ${r.score} · 🔎 ${r.catches} · 🫥 ${r.survived}</b></div>`).join('')}</div>`;
  if (won) await celebrate(mine.ch, `${mine.name} vann!`, `${mine.score} poäng`, ['🫥', '🔎', '🪄', '⭐', '🎉', '🏠']);
  if (G.mode === 'local') {
    panel(`<h3>${won ? 'Du vann! 🏆' : 'Matchen är slut'}</h3>${rank}<button class="btn green" id="pAgain">🔄 Spela igen</button><button class="btn white small" id="pMenu">🏠 Meny</button>`);
    $('pAgain').onclick = () => { SFX.tap(); startQuick(); };
    $('pMenu').onclick = () => { SFX.tap(); closePanel(); G.game = null; show('menu'); };
  } else {
    panel(`<h3>Matchen är slut 🏆</h3>${rank}<button class="btn green" id="pLobby">👍 Till lobbyn</button>`);
    $('pLobby').onclick = () => { SFX.tap(); closePanel(); if (G.mode === 'host') { HOST.inGame = false; G.game = null; hostLobby(); } show('lobby'); };
  }
}
$('gBack').onclick = () => {
  SFX.tap();
  const net = G.mode !== 'local';
  if (!net) paused = true;
  panel(`<h3>${net ? (G.mode === 'host' ? 'Avsluta matchen för alla?' : 'Lämna matchen?') : 'Paus ⏸️'}</h3>
    ${net ? '' : '<button class="btn green" id="pNo">▶️ Fortsätt</button>'}
    <button class="btn pink ${net ? '' : 'small'}" id="pYes">🚪 ${net ? 'Ja' : 'Avsluta'}</button>${net ? '<button class="btn white small" id="pNo">Nej</button>' : ''}`);
  $('pYes').onclick = () => {
    SFX.tap(); closePanel(); paused = false;
    if (G.mode === 'host') { G.game = null; G.snap = null; HOST.inGame = false; hostAll({ t: 'abort' }); hostLobby(); show('lobby'); }
    else if (G.mode === 'client') leave();
    else { G.game = null; show('menu'); }
  };
  $('pNo').onclick = () => { SFX.tap(); closePanel(); paused = false; };
};

/* ================= RITNING ================= */
const cv = $('cv'), cx = cv.getContext('2d');
const FOG = document.createElement('canvas'), fx = FOG.getContext('2d');
let VW = 0, VH = 0, DPR = 1, SC = 1;
const CAM = { x: WW / 2, y: WH / 2 };
const SAFE = { t: 14, b: 14, l: 8 };
function resize() {
  VW = innerWidth; VH = innerHeight; DPR = Math.min(2, devicePixelRatio || 1); cv.width = FOG.width = Math.round(VW * DPR); cv.height = FOG.height = Math.round(VH * DPR);
  const cs = getComputedStyle(document.documentElement), v = (k, d) => parseFloat(cs.getPropertyValue(k)) || d;
  SAFE.t = v('--safe-t', 14); SAFE.b = v('--safe-b', 14); SAFE.l = v('--safe-l', 8);
}
addEventListener('resize', () => { if (current === 'game') resize(); });
const toScreen = (x, y) => [VW / 2 + (x - CAM.x) * SC, VH / 2 + (y - CAM.y) * SC];
const toWorld = (x, y) => [CAM.x + (x - VW / 2) / SC, CAM.y + (y - VH / 2) / SC];
function rr(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r); c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath(); }

/* golv och väggar ritas en gång */
const MAPC = document.createElement('canvas'), MS = .75;
(function prepMap() {
  MAPC.width = WW * MS; MAPC.height = WH * MS;
  const g = MAPC.getContext('2d'), r = PROP.RNG(77); g.scale(MS, MS);
  g.fillStyle = '#3A3026'; g.fillRect(0, 0, WW, WH);
  for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) {
    const rm = grid[y * GW + x]; if (!rm) continue;
    const fl = ROOMS[rm].fl, X = x * CS, Y = y * CS;
    if (fl === 'wood' || fl === 'wood2') { g.fillStyle = fl === 'wood' ? '#C99A62' : '#B98C58'; g.fillRect(X, Y, CS, CS); g.strokeStyle = '#00000018'; g.lineWidth = 2; for (let k = 0; k < 4; k++) { g.beginPath(); g.moveTo(X, Y + k * 16 + 8); g.lineTo(X + CS, Y + k * 16 + 8); g.stroke(); } g.beginPath(); g.moveTo(X + ((y * 7) % 4) * 16, Y); g.lineTo(X + ((y * 7) % 4) * 16, Y + CS); g.stroke(); }
    else if (fl === 'tile') { g.fillStyle = (x + y) % 2 ? '#F2EFE6' : '#D9D4C7'; g.fillRect(X, Y, CS, CS); }
    else if (fl === 'bath') { for (let a = 0; a < 2; a++) for (let b = 0; b < 2; b++) { g.fillStyle = (a + b) % 2 ? '#BFE7F2' : '#9ED6E6'; g.fillRect(X + a * 32, Y + b * 32, 32, 32); } }
    else if (fl === 'carpet') { g.fillStyle = '#B7A3D9'; g.fillRect(X, Y, CS, CS); g.fillStyle = '#ffffff14'; g.fillRect(X + (r() * 50), Y + r() * 50, 6, 6); }
    else if (fl === 'concrete') { g.fillStyle = '#A9A7A2'; g.fillRect(X, Y, CS, CS); g.fillStyle = '#00000010'; g.fillRect(X + r() * 40, Y + r() * 40, 18, 12); }
    else if (fl === 'grass') { g.fillStyle = (x + y) % 2 ? '#7CC060' : '#74B858'; g.fillRect(X, Y, CS, CS); g.strokeStyle = '#5E9E46'; g.lineWidth = 1.5; for (let k = 0; k < 6; k++) { const gx = X + r() * CS, gy = Y + r() * CS; g.beginPath(); g.moveTo(gx, gy); g.lineTo(gx + 2, gy - 6); g.stroke(); } }
  }
  // matta i vardagsrummet och sovrummet
  g.fillStyle = '#C0392B55'; rr(g, 200, 250, 200, 180, 20); g.fill(); g.strokeStyle = '#FFE27A88'; g.lineWidth = 6; g.stroke();
  g.fillStyle = '#2F7BFF33'; rr(g, 330, 1150, 220, 160, 80); g.fill();
  // väggar med skugga
  for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) {
    if (grid[y * GW + x]) continue;
    const X = x * CS, Y = y * CS;
    if (y + 1 < GH && grid[(y + 1) * GW + x]) { const gr = g.createLinearGradient(0, Y + CS, 0, Y + CS + 22); gr.addColorStop(0, '#00000055'); gr.addColorStop(1, '#00000000'); g.fillStyle = gr; g.fillRect(X, Y + CS, CS, 22); }
  }
  for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) {
    if (grid[y * GW + x]) continue;
    const X = x * CS, Y = y * CS, outside = x === 0 || y === 0 || x === GW - 1 || y === GH - 1;
    g.fillStyle = outside ? '#4E3B2A' : '#7A6450'; g.fillRect(X, Y, CS + .5, CS + .5);
    if (!outside) { g.fillStyle = '#5E4B3A'; g.fillRect(X, Y + CS - 10, CS + .5, 10); g.fillStyle = '#8E7660'; g.fillRect(X, Y, CS + .5, 6); }
  }
  g.font = 'bold 30px Fredoka, sans-serif'; g.textAlign = 'center'; g.fillStyle = '#00000022';
  for (let rm = 1; rm < ROOMS.length; rm++) { const B = PROP.ROOM_BOX[rm]; g.fillText(ROOMS[rm].n, (B.x0 + B.x1 + 1) / 2 * CS, (B.y1 + .6) * CS); }
})();

/* en sak sedd uppifrån (koordinater runt mitten) */
function drawItem(c, k, x, y, rot) {
  const it = ITEMS[k]; if (!it) return;
  c.save(); c.translate(x, y); c.rotate(rot || 0);
  const sh = () => { c.fillStyle = '#00000030'; };
  const circ = (r, col, ox, oy) => { c.fillStyle = col; c.beginPath(); c.arc(ox || 0, oy || 0, r, 0, 7); c.fill(); };
  const box = (w, h, col, rad) => { c.fillStyle = col; rr(c, -w / 2, -h / 2, w, h, rad || 4); c.fill(); };
  // skugga
  sh(); if (it.w) { if (it.round) { c.beginPath(); c.arc(5, 7, it.w / 2, 0, 7); c.fill(); } else { rr(c, -it.w / 2 + 5, -it.h / 2 + 7, it.w, it.h, 6); c.fill(); } } else { c.beginPath(); c.arc(4, 6, it.r, 0, 7); c.fill(); }
  switch (k) {
    case 'chair': box(32, 30, '#8A5A2B', 5); box(26, 22, '#C08A4E', 4); c.fillStyle = '#6E4520'; c.fillRect(-16, -18, 32, 8); break;
    case 'stool': circ(14, '#7A4E22'); circ(11, '#C08A4E'); break;
    case 'plant': circ(11, '#9A5B2E'); c.fillStyle = '#2E8B3E'; for (let i = 0; i < 6; i++) { c.save(); c.rotate(i * Math.PI / 3); c.beginPath(); c.ellipse(9, 0, 10, 5, 0, 0, 7); c.fill(); c.restore(); } circ(5, '#3FAF4E'); break;
    case 'lamp': circ(15, '#F4E3B5'); circ(10, '#FFF6D5'); circ(4, '#FFD23F'); break;
    case 'box': box(38, 38, '#C89B5E', 3); c.fillStyle = '#E2C08A'; c.fillRect(-3, -19, 6, 38); c.strokeStyle = '#9E7643'; c.lineWidth = 2; c.strokeRect(-19, -19, 38, 38); break;
    case 'barrel': circ(22, '#2F6FB5'); c.strokeStyle = '#1C4A80'; c.lineWidth = 3; c.beginPath(); c.arc(0, 0, 16, 0, 7); c.stroke(); c.beginPath(); c.arc(0, 0, 9, 0, 7); c.stroke(); break;
    case 'ball': circ(13, '#FF3B4E'); c.fillStyle = '#fff'; c.fillRect(-13, -3, 26, 6); circ(4, '#fff', -5, -5); break;
    case 'teddy': circ(13, '#A9713A', 0, 4); circ(10, '#B98048', 0, -8); circ(4, '#8A5A2B', -8, -15); circ(4, '#8A5A2B', 8, -15); circ(2, '#2B2350', -3, -9); circ(2, '#2B2350', 3, -9); break;
    case 'bin': circ(15, '#7D7B77'); circ(12, '#5E5C58'); circ(5, '#E4E0F7', 3, 2); break;
    case 'bucket': circ(15, '#FFD23F'); circ(11, '#7FD8FF'); c.strokeStyle = '#888'; c.lineWidth = 2; c.beginPath(); c.arc(0, 0, 15, Math.PI * 1.1, Math.PI * 1.9); c.stroke(); break;
    case 'tire': circ(21, '#2B2B2B'); circ(9, '#6B6B6B'); c.strokeStyle = '#444'; c.lineWidth = 2; for (let i = 0; i < 10; i++) { const a = i / 10 * 6.28; c.beginPath(); c.moveTo(Math.cos(a) * 14, Math.sin(a) * 14); c.lineTo(Math.cos(a) * 20, Math.sin(a) * 20); c.stroke(); } break;
    case 'vase': circ(12, '#3A9BD9'); circ(4, '#FF6FAE', -4, -3); circ(4, '#FFD23F', 4, -2); circ(4, '#fff', 0, 4); break;
    case 'toilet': box(30, 14, '#EDEDED', 4); c.translate(0, 0); c.fillStyle = '#FAFAFA'; c.beginPath(); c.ellipse(0, 12, 14, 16, 0, 0, 7); c.fill(); c.fillStyle = '#BFE7F2'; c.beginPath(); c.ellipse(0, 13, 8, 10, 0, 0, 7); c.fill(); break;
    case 'armchair': box(54, 50, '#A8323A', 12); box(36, 32, '#D2475A', 8); break;
    case 'bush': c.fillStyle = '#2F7A2E'; for (let i = 0; i < 7; i++) { const a = i / 7 * 6.28; c.beginPath(); c.arc(Math.cos(a) * 13, Math.sin(a) * 13, 14, 0, 7); c.fill(); } circ(15, '#43A040'); circ(4, '#FF6FAE', 6, -6); circ(3, '#FFD23F', -7, 5); break;
    case 'stone': c.fillStyle = '#8C8A86'; c.beginPath(); c.moveTo(-18, -4); c.lineTo(-8, -17); c.lineTo(10, -15); c.lineTo(19, 0); c.lineTo(9, 16); c.lineTo(-12, 14); c.closePath(); c.fill(); c.fillStyle = '#A9A7A2'; c.beginPath(); c.arc(-3, -5, 7, 0, 7); c.fill(); break;
    case 'pumpkin': c.fillStyle = '#FF8A1F'; c.beginPath(); c.ellipse(0, 0, 17, 14, 0, 0, 7); c.fill(); c.strokeStyle = '#D9620A'; c.lineWidth = 2; for (const o of [-8, 0, 8]) { c.beginPath(); c.ellipse(o, 0, 3, 13, 0, 0, 7); c.stroke(); } box(5, 8, '#3E7A2E', 2); break;
    case 'cone': circ(14, '#FF7A12'); circ(9, '#fff'); circ(5, '#FF7A12'); break;
    case 'sofa': box(170, 64, '#3F6FB0', 14); box(150, 36, '#5A8FD6', 10); c.fillStyle = '#2E5590'; c.fillRect(-85, -32, 170, 14); break;
    case 'table': box(130, 84, '#8A5A2B', 10); box(118, 72, '#B5824A', 8); break;
    case 'tv': box(130, 30, '#4A3A2A', 4); box(100, 10, '#222', 2); break;
    case 'shelf': box(40, 150, '#7A4E22', 4); for (let i = 0; i < 6; i++) { c.fillStyle = ['#FF3B4E', '#2F7BFF', '#FFD23F', '#34C759', '#9B5BFF', '#FF8A1F'][i]; c.fillRect(-14, -66 + i * 22, 28, 14); } break;
    case 'stove': box(64, 60, '#EDEDED', 6); for (const [a, b] of [[-14, -13], [14, -13], [-14, 13], [14, 13]]) { c.strokeStyle = '#444'; c.lineWidth = 3; c.beginPath(); c.arc(a, b, 9, 0, 7); c.stroke(); } break;
    case 'fridge': box(70, 64, '#F7F7F7', 6); c.fillStyle = '#ccc'; c.fillRect(-30, 20, 60, 4); break;
    case 'counter': box(200, 54, '#DCCBB0', 4); box(50, 34, '#A9C7D9', 6); break;
    case 'bed': box(130, 190, '#6E4520', 10); box(120, 180, '#FFFFFF', 8); box(120, 110, '#FF8FB8', 8); c.translate(0, 0); c.fillStyle = '#F4F1FF'; rr(c, -50, -86, 44, 28, 8); c.fill(); rr(c, 6, -86, 44, 28, 8); c.fill(); break;
    case 'wardrobe': box(160, 50, '#8A5A2B', 4); c.fillStyle = '#6E4520'; c.fillRect(-2, -25, 4, 50); break;
    case 'desk': box(120, 60, '#B5824A', 6); box(40, 24, '#2B2350', 3); break;
    case 'tub': box(160, 70, '#F7F7F7', 30); box(140, 52, '#9ED6E6', 24); break;
    case 'sink': box(60, 44, '#F7F7F7', 10); c.fillStyle = '#BFE7F2'; c.beginPath(); c.ellipse(0, 4, 20, 13, 0, 0, 7); c.fill(); break;
    case 'car': box(120, 220, '#E53935', 28); box(100, 70, '#9ED6FF', 14); c.fillStyle = '#9ED6FF'; rr(c, -46, 50, 92, 40, 12); c.fill(); c.fillStyle = '#222'; for (const [a, b] of [[-62, -70], [52, -70], [-62, 50], [52, 50]]) c.fillRect(a, b, 10, 26); break;
    case 'bench': box(50, 180, '#7A4E22', 4); c.fillStyle = '#888'; c.fillRect(-12, -60, 24, 18); c.fillRect(-8, 20, 16, 30); break;
    case 'tramp': circ(75, '#2B2350'); circ(68, '#2F7BFF'); circ(56, '#1F1F2E'); break;
    case 'rack': box(110, 34, '#8A5A2B', 4); for (let i = 0; i < 4; i++) { c.fillStyle = ['#FF3B4E', '#2F7BFF', '#FFD23F', '#34C759'][i]; c.fillRect(-48 + i * 26, -8, 18, 16); } break;
  }
  c.restore();
}
/* alla möbler ritas till en egen bild när de ändras (ny rond) */
const FURN = { cv: document.createElement('canvas'), fv: -2 };
function prepFurniture() {
  const C = FURN.cv; C.width = WW * MS; C.height = WH * MS;
  const g = C.getContext('2d'); g.setTransform(MS, 0, 0, MS, 0, 0); g.clearRect(0, 0, WW, WH);
  for (const f of G.F) if (ITEMS[f.k] && ITEMS[f.k].w) drawItem(g, f.k, f.x, f.y, f.rot);
  for (const f of G.F) if (ITEMS[f.k] && !ITEMS[f.k].w) drawItem(g, f.k, f.x, f.y, f.rot);
  FURN.fv = G.fv;
}

const FX = {
  parts: [], texts: [], tracers: [], shake: 0, red: 0,
  reset() { this.parts = []; this.texts = []; this.tracers = []; this.shake = 0; this.red = 0; },
  splash(x, y) { for (let i = 0; i < 8; i++) { const a = Math.random() * 7, v = 40 + Math.random() * 140; this.parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 0, max: .3 + Math.random() * .2, c: '#9FE6FF', r: 3 + Math.random() * 3 }); } },
  puff(x, y) { for (let i = 0; i < 16; i++) { const a = Math.random() * 7, v = 40 + Math.random() * 140; this.parts.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 0, max: .5 + Math.random() * .4, c: pick(['#fff', '#FFD23F', '#C9B6FF', '#FF9CD0']), r: 4 + Math.random() * 6 }); } },
  tracer(x1, y1, x2, y2) { this.tracers.push({ x1, y1, x2, y2, life: 0 }); },
  text(t, x, y, c, s) { this.texts.push({ t, x, y, c, s, life: 0 }); },
  tick(dt) {
    for (const p of this.parts) { p.life += dt; p.x += p.vx * dt; p.y += p.vy * dt; const f = Math.exp(-3 * dt); p.vx *= f; p.vy *= f; }
    this.parts = this.parts.filter(p => p.life < p.max);
    for (const t of this.texts) { t.life += dt; t.y -= 40 * dt; } this.texts = this.texts.filter(t => t.life < 1.2);
    for (const t of this.tracers) t.life += dt; this.tracers = this.tracers.filter(t => t.life < .12);
    for (const r of G.ripples) r.t += dt; G.ripples = G.ripples.filter(r => r.t < 1.6);
    this.red = Math.max(0, this.red - dt);
  }
};

function drawPlayer(p, D, mine) {
  const ch = p.ch % CHARS.length, R = 19;
  cx.save(); cx.translate(D.x, D.y);
  cx.fillStyle = '#00000040'; cx.beginPath(); cx.ellipse(4, 6, R, R * .85, 0, 0, 7); cx.fill();
  if (p.ro === 'h') { cx.save(); cx.rotate(D.a); cx.fillStyle = '#2B2350'; rr(cx, R - 8, -6, 30, 12, 4); cx.fill(); cx.fillStyle = '#2F9BFF'; rr(cx, R - 6, -4, 26, 8, 3); cx.fill(); cx.fillStyle = '#FFD23F'; cx.fillRect(R + 14, -3, 6, 6); cx.restore(); }
  cx.fillStyle = '#2B2350'; cx.beginPath(); cx.arc(0, 0, R + 3, 0, 7); cx.fill();
  cx.fillStyle = ROLEC[p.ro]; cx.beginPath(); cx.arc(0, 0, R, 0, 7); cx.fill();
  const im = FACES[ch], fr = R - 4;
  cx.save(); cx.beginPath(); cx.arc(0, 0, fr, 0, 7); cx.clip();
  if (im.complete && im.naturalWidth) cx.drawImage(im, -fr, -fr, fr * 2, fr * 2);
  cx.restore();
  if (p.ro === 'h') { cx.font = '16px sans-serif'; cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.fillText('🔎', R - 2, -R + 2); }
  cx.restore();
}
function draw(s, time, dt) {
  const me = meOf(s);
  let eye = me && me.al ? me : null;
  if (!eye && me) eye = s.P.find(p => p.al && p.ro === me.ro) || s.P.find(p => p.al);
  const eyeD = eye && (G.disp[eye.id] || eye);
  const land = VW > VH;
  SC = Math.min(VW, VH) / (land ? 760 : 700);
  let fxp = WW / 2, fyp = WH / 2;
  if (eyeD) { fxp = eyeD.x; fyp = eyeD.y; }
  { const hw = VW / 2 / SC, hh = VH / 2 / SC; fxp = hw * 2 >= WW ? WW / 2 : Math.max(hw, Math.min(WW - hw, fxp)); fyp = hh * 2 >= WH ? WH / 2 : Math.max(hh, Math.min(WH - hh, fyp)); }
  CAM.x += (fxp - CAM.x) * Math.min(1, dt * 7); CAM.y += (fyp - CAM.y) * Math.min(1, dt * 7);
  const world = c => c.setTransform(DPR * SC, 0, 0, DPR * SC, DPR * (VW / 2 - CAM.x * SC), DPR * (VH / 2 - CAM.y * SC));
  cx.setTransform(DPR, 0, 0, DPR, 0, 0); cx.fillStyle = '#2A2118'; cx.fillRect(0, 0, VW, VH);
  world(cx);
  cx.drawImage(MAPC, 0, 0, WW, WH);
  if (FURN.fv !== G.fv && G.F.length) prepFurniture();
  cx.drawImage(FURN.cv, 0, 0, WW, WH);
  const myRole = me ? me.ro : 'p';
  const hunterView = me && me.ro === 'h' && me.al;
  // gömmare (förvandlade ritas som saken)
  for (const p of s.P) {
    if (!p.al || p.out || p.ro !== 'p') continue;
    const D = G.disp[p.id] || p;
    if (p.d) {
      drawItem(cx, p.d, D.x, D.y, p.rt);
      // de egna ser vem som är vem
      if (!hunterView) { cx.strokeStyle = p.id === G.me ? '#FFD23F' : '#34C75999'; cx.lineWidth = 3; cx.setLineDash([6, 6]); cx.beginPath(); cx.arc(D.x, D.y, ITEMS[p.d].r + 7, 0, 7); cx.stroke(); cx.setLineDash([]); }
    } else drawPlayer(p, D);
  }
  for (const p of s.P) { if (!p.al || p.out || p.ro !== 'h') continue; drawPlayer(p, G.disp[p.id] || p); }
  // vattenstrålar och stänk
  for (const t of FX.tracers) { cx.globalAlpha = 1 - t.life / .12; cx.strokeStyle = '#7FD8FF'; cx.lineWidth = 5; cx.lineCap = 'round'; cx.beginPath(); cx.moveTo(t.x1, t.y1); cx.lineTo(t.x2, t.y2); cx.stroke(); }
  cx.globalAlpha = 1;
  for (const p of FX.parts) { cx.globalAlpha = Math.max(0, 1 - p.life / p.max); cx.fillStyle = p.c; cx.beginPath(); cx.arc(p.x, p.y, p.r, 0, 7); cx.fill(); }
  cx.globalAlpha = 1;
  // sökarnas mörker (ficklampa) – i göm-fasen ser sökarna ingenting
  if (hunterView) {
    fx.setTransform(1, 0, 0, 1, 0, 0); fx.globalCompositeOperation = 'source-over'; fx.clearRect(0, 0, FOG.width, FOG.height);
    fx.fillStyle = s.ph === 'hide' ? 'rgba(8,6,20,1)' : 'rgba(8,6,20,.82)'; fx.fillRect(0, 0, FOG.width, FOG.height);
    if (s.ph !== 'hide') {
      const D = G.disp[me.id] || me;
      world(fx); fx.globalCompositeOperation = 'destination-out';
      const g = fx.createRadialGradient(D.x, D.y, VIS * .55, D.x, D.y, VIS); g.addColorStop(0, '#000'); g.addColorStop(1, '#0000');
      fx.fillStyle = g; fx.beginPath();
      for (let i = 0; i <= 240; i++) { const a = i / 240 * Math.PI * 2, dx = Math.cos(a), dy = Math.sin(a), d = PROP.rayWall(D.x, D.y, dx, dy, VIS) + 10; if (i === 0) fx.moveTo(D.x + dx * d, D.y + dy * d); else fx.lineTo(D.x + dx * d, D.y + dy * d); }
      fx.closePath(); fx.fill(); fx.globalCompositeOperation = 'source-over';
    }
    cx.setTransform(1, 0, 0, 1, 0, 0); cx.drawImage(FOG, 0, 0); world(cx);
  }
  // läten syns för alla (ringar och noter)
  for (const r of G.ripples) { const k = r.t / 1.6; cx.globalAlpha = 1 - k; cx.strokeStyle = '#FFD23F'; cx.lineWidth = 6; cx.beginPath(); cx.arc(r.x, r.y, 30 + k * 160, 0, 7); cx.stroke(); cx.font = '34px sans-serif'; cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.fillText('🎵', r.x + Math.sin(r.t * 8) * 10, r.y - 40 - k * 50); }
  cx.globalAlpha = 1;
  // namn
  cx.textAlign = 'center'; cx.textBaseline = 'alphabetic';
  for (const p of s.P) {
    if (!p.al || p.out) continue;
    if (hunterView && p.ro === 'p' && p.d) continue;   // sökarna ser bara saken
    if (hunterView && s.ph === 'hide' && p.ro === 'p') continue;
    if (hunterView && p.ro === 'p' && !(Math.hypot(p.x - me.x, p.y - me.y) < VIS && PROP.canSee(me.x, me.y, p.x, p.y))) continue;
    const D = G.disp[p.id] || p, y = D.y - (p.d ? ITEMS[p.d].r : 19) - 12;
    cx.font = 'bold 15px Fredoka, sans-serif'; cx.lineWidth = 4; cx.strokeStyle = '#000a'; const t = p.n + (p.bot >= 0 ? ' 🤖' : '');
    cx.strokeText(t, D.x, y); cx.fillStyle = p.id === G.me ? '#FFD23F' : p.ro === 'h' ? '#FFC58A' : '#A8FFB8'; cx.fillText(t, D.x, y);
  }
  for (const t of FX.texts) { cx.globalAlpha = Math.max(0, 1 - t.life / 1.2); cx.font = `bold ${t.s}px Fredoka, sans-serif`; cx.lineWidth = 5; cx.strokeStyle = '#2B2350'; cx.strokeText(t.t, t.x, t.y); cx.fillStyle = t.c; cx.fillText(t.t, t.x, t.y); }
  cx.globalAlpha = 1;
  // skärmläge
  cx.setTransform(DPR, 0, 0, DPR, 0, 0);
  if (FX.red > 0) { const g = cx.createRadialGradient(VW / 2, VH / 2, Math.min(VW, VH) * .3, VW / 2, VH / 2, Math.max(VW, VH) * .7); g.addColorStop(0, '#ff000000'); g.addColorStop(1, `rgba(255,0,0,${FX.red})`); cx.fillStyle = g; cx.fillRect(0, 0, VW, VH); }
  if (hunterView && s.ph === 'hide') {
    cx.fillStyle = '#fff'; cx.textAlign = 'center'; cx.textBaseline = 'middle';
    cx.font = `bold ${Math.round(Math.min(VW, VH) * .09)}px Fredoka, sans-serif`; cx.fillText(`🙈 ${s.tm}`, VW / 2, VH * .45);
    cx.font = `bold ${Math.round(Math.min(VW, VH) * .045)}px Fredoka, sans-serif`; cx.fillText('Blunda och räkna – gömmarna gömmer sig!', VW / 2, VH * .45 + Math.min(VW, VH) * .09);
  }
  drawSticks(me);
  drawMini(s, me);
}
function drawSticks(me) {
  const R = STR();
  const one = (st, defX, defY) => {
    const ox = st ? st.ox : defX, oy = st ? st.oy : defY;
    cx.globalAlpha = st ? .45 : .16; cx.fillStyle = '#fff'; cx.beginPath(); cx.arc(ox, oy, R, 0, 7); cx.fill();
    cx.globalAlpha = st ? .9 : .28; cx.beginPath(); cx.arc(st ? st.x : ox, st ? st.y : oy, R * .45, 0, 7); cx.fill(); cx.globalAlpha = 1;
  };
  if (MOUSE.used && !STK.m && !STK.a) return;
  const by = VH - R - 30 - SAFE.b;
  one(STK.m, R + 34, by);
  if (me && me.ro === 'h') one(STK.a, VW - R - 34, by);
}
const MINI = document.createElement('canvas'); MINI.width = 0;
function drawMini(s, me) {
  const mw = Math.min(130, VW * .3), k = mw / WW, mh = WH * k, x0 = SAFE.l + 6, y0 = SAFE.t + 56;
  if (!MINI.width) {
    MINI.width = GW * 8; MINI.height = GH * 8; const g = MINI.getContext('2d');
    const col = { 1: '#C99A62', 2: '#E8E3D6', 3: '#B7A3D9', 4: '#9ED6E6', 5: '#B98C58', 6: '#A9A7A2', 7: '#7CC060' };
    g.fillStyle = '#000000aa'; g.fillRect(0, 0, MINI.width, MINI.height);
    for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) { const r = grid[y * GW + x]; if (r) { g.fillStyle = col[r]; g.fillRect(x * 8, y * 8, 8, 8); } }
  }
  cx.globalAlpha = .85; cx.drawImage(MINI, x0, y0, mw, mh); cx.globalAlpha = 1;
  const role = me ? me.ro : 'p';
  for (const p of s.P) {
    if (!p.al || p.out || (p.ro !== role && p.id !== G.me)) continue;
    cx.fillStyle = p.id === G.me ? '#FFD23F' : ROLEC[p.ro]; cx.beginPath(); cx.arc(x0 + p.x * k, y0 + p.y * k, p.id === G.me ? 3.5 : 2.6, 0, 7); cx.fill();
  }
  for (const r of G.ripples) { cx.strokeStyle = '#FFD23F'; cx.globalAlpha = 1 - r.t / 1.6; cx.beginPath(); cx.arc(x0 + r.x * k, y0 + r.y * k, 3 + r.t * 6, 0, 7); cx.stroke(); }
  cx.globalAlpha = 1; cx.strokeStyle = '#fff8'; cx.lineWidth = 1; cx.strokeRect(x0, y0, mw, mh);
}

/* ================= NÄTVERK ================= */
let scanning = false;
function buildJoin() {
  const app = !!window.Android;
  $('joinBox').innerHTML = netJoinCardHTML('card') + `
    ${app ? `<div class="card"><h4>📡 Matcher i wifi:t</h4><div class="found" id="found"></div><button class="btn white small" id="rescan">🔄 Sök igen</button></div>` : ''}
    <div class="card"><h4>🔢 Skriv in adressen</h4>
      <p class="note">${app ? 'Hittas inte matchen? Skriv adressen som står på värdens skärm.' : 'Wifi-matchen startas i Android-appen (📡 Starta nätverksmatch). Skanna QR-koden på värdens skärm med kameran, eller skriv adressen här.'}</p>
      <div class="ipbox"><input id="ipIn" type="text" inputmode="decimal" placeholder="t.ex. 192.168.1.23" value="${esc(store.get('lastIp', ''))}"><button class="btn green small" id="ipGo">Anslut</button></div></div>
    <p class="note" style="text-align:center;color:#fff">Du spelar som ${esc(charName(ME.ch))}.</p>`;
  $('ipGo').onclick = () => {
    let v = $('ipIn').value.trim().replace(/^https?:\/\//, '').replace(/\/.*$/, ''), port = PORT;
    if (v.includes(':')) { port = +v.split(':')[1] || PORT; v = v.split(':')[0]; }
    if (!/^\d+\.\d+\.\d+\.\d+$/.test(v)) { $('ipIn').style.borderColor = '#FF4D6D'; SFX.bonk(); return; }
    store.set('lastIp', v); goJoin(v, port, 'prop.html');
  };
  netBindJoinCard((page, code) => `${page}?online=${encodeURIComponent(code)}&n=${encodeURIComponent(charName(ME.ch))}&c=${ME.ch}&back=${encodeURIComponent(location.href.split('?')[0])}`);
  if (app) { $('rescan').onclick = () => { SFX.tap(); scan(); }; scan(); }
}
function scan() {
  if (!window.Android || !Android.netScan || scanning) return;
  scanning = true;
  $('found').innerHTML = `<p class="note"><span class="spin">🫥</span> Letar efter matcher…</p>`;
  window.onNetScan = list => {
    scanning = false;
    if (current !== 'join' || !$('found')) return;
    $('found').innerHTML = list.length ? list.map(m => { const g = netGameOf(m.name); return `<button class="btn blue" data-ip="${esc(m.ip)}" data-port="${m.port}" data-page="${g.page}">${esc(g.label)}</button>`; }).join('')
      : `<p class="note">Hittade ingen match. Be värden trycka 📡 Starta nätverksmatch – och kolla att ni är på samma wifi.</p>`;
    $('found').querySelectorAll('[data-ip]').forEach(b => b.onclick = () => { SFX.tap(); goJoin(b.dataset.ip, +b.dataset.port, b.dataset.page); });
  };
  try { Android.netScan(); } catch (e) { scanning = false; }
}
function goJoin(ip, port, page) { const back = location.href.split('?')[0]; location.href = `http://${ip}:${port || PORT}/${page}?n=${encodeURIComponent(charName(ME.ch))}&c=${ME.ch}&back=${encodeURIComponent(back)}`; }
function startOnline() { location.href = netOnlineHostURL('prop.html', `n=${encodeURIComponent(charName(ME.ch))}&c=${ME.ch}`); }
function startHosting() {
  let r = null;
  try { r = JSON.parse(Android.netHost('prop:' + charName(ME.ch) + 's hus')); } catch (e) { }
  if (!r || !r.ok) { panel(`<h3>Gick inte 😕</h3><p>Kunde inte starta. Prova att stänga appen och öppna igen.</p><button class="btn" id="pOk">OK</button>`); $('pOk').onclick = closePanel; return; }
  location.href = `http://127.0.0.1:${r.port}/prop.html?host=1&n=${encodeURIComponent(charName(ME.ch))}&c=${ME.ch}`;
}
function leave() {
  if (G.mode === 'host' || HOSTPAGE) { try { HOST.ws && HOST.ws.close(); } catch (e) { } HOST.ws = null; try { Android.netStop(); } catch (e) { } location.href = NET_ONLINE ? 'prop.html' : APP_HOME + 'prop.html'; return; }
  if (CLIENT) {
    CL.closing = true; try { CL.ws && CL.ws.close(); } catch (e) { }
    const back = Q.get('back');
    if (back && /^https?:\/\//.test(back)) location.href = back; else if (NET_ONLINE) location.href = 'prop.html'; else if (window.Android) location.href = APP_HOME + 'prop.html'; else { G.mode = 'local'; show('menu'); }
    return;
  }
  show('menu');
}

/* ----- värd ----- */
const HOST = { ws: null, lobby: [], ok: false, inGame: false, set: Object.assign({ fill: 0, diff: 1, rounds: 1 }, store.get('hostSet', {})) };
function hostStart() { G.mode = 'host'; G.me = 'h'; HOST.lobby = [{ id: 'h', name: myName(), ch: ME.ch }]; hostConnect(); show('lobby'); }
function hostConnect() {
  const ws = netSocket(true); HOST.ws = ws;
  ws.onopen = () => { HOST.ok = true; buildLobby(); };
  ws.onmessage = e => hostRecv(e.data);
  ws.onclose = () => { HOST.ok = false; if (HOST.ws === ws) setTimeout(() => { if (HOST.ws === ws) hostConnect(); }, 1000); };
}
const hostAll = o => { if (HOST.ws && HOST.ws.readyState === 1) HOST.ws.send('*' + JSON.stringify(o)); };
const hostTo = (id, o) => { if (HOST.ws && HOST.ws.readyState === 1) HOST.ws.send('@' + id.slice(1) + '|' + JSON.stringify(o)); };
function hostRecv(d) {
  if (d[0] === '+') return;
  if (d[0] === '-') {
    const id = 'c' + d.slice(1), p = HOST.lobby.find(q => q.id === id);
    HOST.lobby = HOST.lobby.filter(q => q.id !== id);
    if (HOST.inGame && G.game) { G.game.removePlayer(id); if (p) G.game.emit('left', { n: p.name }); }
    return hostLobby();
  }
  const bar = d.indexOf('|'); if (bar < 0) return;
  const id = 'c' + d.slice(0, bar);
  let m; try { m = JSON.parse(d.slice(bar + 1)); } catch (e) { return; }
  if (m.t === 'hi') {
    const p = { id, name: String(m.name || 'Spelare').slice(0, 14), ch: Math.abs(m.ch | 0) % CHARS.length };
    const old = HOST.lobby.find(q => q.id === id);
    if (old) Object.assign(old, p); else { HOST.lobby.push(p); SFX.pick(); buzz(15); }
    hostTo(id, { t: 'welcome', id }); hostLobby();
    if (HOST.inGame && G.game && !G.game.over) {
      const gp = G.game.P.find(q => q.id === id);
      if (!gp) G.game.addPlayer({ id, name: p.name, ch: p.ch, bot: -1 }, false); else gp.out = false;
      hostTo(id, { t: 'start' }); hostTo(id, Object.assign({ t: 'fur' }, G.game.furniture()));
    }
  } else if (m.t === 'in') { if (HOST.inGame && G.game) G.game.setInput(id, m.i); }
  else if (m.t === 'fur?') { if (HOST.inGame && G.game) hostTo(id, Object.assign({ t: 'fur' }, G.game.furniture())); }
}
function lobbyMsg() { return { t: 'lobby', players: HOST.lobby.map(p => ({ id: p.id, name: p.name, ch: p.ch })), inGame: HOST.inGame, host: myName(), set: HOST.set }; }
function hostLobby() { hostAll(lobbyMsg()); if (current === 'lobby') buildLobby(); }
const FILLS = [[0, 'Inga'], [4, 'Till 4'], [6, 'Till 6'], [8, 'Till 8']];
function hostBegin() {
  const S = HOST.set;
  const pl = HOST.lobby.map(p => ({ id: p.id, name: p.id === 'h' ? myName() : p.name, ch: p.id === 'h' ? ME.ch : p.ch, bot: -1 }));
  if (S.fill) fillBots(pl, S.fill, DIFF[S.diff].lv);
  if (pl.length < 2) { panel(`<h3>Minst två spelare</h3><p>Vänta tills någon har gått med – eller fyll på med datorspelare.</p><button class="btn" id="pOk">OK</button>`); $('pOk').onclick = closePanel; return; }
  HOST.inGame = true; G.resSent = false; G.mode = 'host'; G.kind = 'net';
  begin(new PROP.Game(pl, { rounds: roundsOf(S.rounds) }), 'h');
  hostAll({ t: 'start' }); hostAll(Object.assign({ t: 'fur' }, G.game.furniture()));
  hostLobby();
}

/* ----- klient ----- */
const CL = { ws: null, id: null, lobby: null, closing: false, tries: 0 };
function clientStart() { G.mode = 'client'; pickFigure('Vem spelar?', clientConnect, leave); }
function clientConnect() {
  CL.closing = false;
  const ws = netSocket(false); CL.ws = ws;
  panel(`<h3>Ansluter… <span class="spin">🫥</span></h3>`);
  ws.onopen = () => { CL.tries = 0; closePanel(); ws.send(JSON.stringify({ t: 'hi', name: myName(), ch: ME.ch })); if (current !== 'game') show('lobby'); };
  ws.onmessage = e => { let m; try { m = JSON.parse(e.data); } catch (er) { return; } clientRecv(m); };
  ws.onclose = () => {
    if (CL.ws !== ws || CL.closing) return;
    if (CL.tries++ < 3 && CL.id) { setTimeout(clientConnect, 800); return; }
    panel(`<h3>Tappade kontakten 📡</h3><p>Är värden kvar?</p><button class="btn green" id="pRetry">🔄 Försök igen</button><button class="btn white small" id="pLeave">🚪 Lämna</button>`);
    $('pRetry').onclick = () => { SFX.tap(); CL.tries = 0; clientConnect(); };
    $('pLeave').onclick = () => { SFX.tap(); leave(); };
  };
}
const clSend = o => { if (CL.ws && CL.ws.readyState === 1) CL.ws.send(JSON.stringify(o)); };
function clientRecv(m) {
  if (m.t === 'welcome') { CL.id = m.id; }
  else if (m.t === 'lobby') { CL.lobby = m; if (current === 'lobby') buildLobby(); }
  else if (m.t === 'start') { G.mode = 'client'; G.kind = 'net'; G.game = null; G.snap = null; G.me = CL.id; G.lastEv = 0; G.endShown = false; G.endT = 0; G.res = null; G.disp = {}; G.ripples = []; FX.reset(); closePanel(); $('feed').innerHTML = ''; show('game'); }
  else if (m.t === 'fur') { G.F = PROP.unpackF(m.F); G.fv = m.fv; }
  else if (m.t === 's') {
    if (current !== 'game') return;
    const keep = G.snap && G.snap.ev ? G.snap.ev.filter(e => e.id > G.lastEv) : [];
    if (keep.length) m.s.ev = keep.concat(m.s.ev);
    G.snap = m.s;
  }
  else if (m.t === 'res') { G.res = m; }
  else if (m.t === 'abort') { closePanel(); G.snap = null; show('lobby'); }
  else if (m.t === 'hostgone') { CL.closing = true; panel(`<h3>Matchen är slut 👋</h3><p>Värden avslutade.</p><button class="btn green" id="pLeave">OK</button>`); $('pLeave').onclick = () => { SFX.tap(); leave(); }; }
}
function buildLobby() {
  if (current !== 'lobby') return;
  const isHost = G.mode === 'host';
  const L = isHost ? lobbyMsg() : (CL.lobby || { players: [], inGame: false, set: HOST.set });
  const myId = isHost ? 'h' : CL.id, S = L.set || HOST.set;
  const pls = L.players.map(p => `<div class="pl ${p.id === myId ? 'mine' : ''}" style="${styleOf(p.ch)}">${avHTML(p.ch)}<span>${esc(p.name)}${p.id === myId ? ' <small>(du)</small>' : ''}${p.id === 'h' ? ' 👑' : ''}</span></div>`).join('');
  let side = '';
  if (isHost) {
    let ips = []; try { ips = JSON.parse(Android.netIps()); } catch (e) { }
    const url = ips.length ? `http://${ips[0]}:${PORT}/prop.html` : '';
    let qr = ''; if (url && window.qrcode) { try { const q = qrcode(0, 'M'); q.addData(url); q.make(); qr = q.createSvgTag(4, 2); } catch (e) { } }
    side = `<div class="card"><h4>📲 Bjud in familjen</h4>${url ? `<div class="joininfo"><div class="qr">${qr}</div><div><p class="note">iPhone/iPad: skanna med kameran eller öppna i Safari:</p><div class="url">${esc(url.replace(/^http:\/\//, ''))}</div></div></div>
      <p class="note">Android med appen: Kurragömma → 🔗 Gå med.</p>` : `<p class="note">⚠️ Hittar inget wifi. Anslut till wifi (eller slå på surfzon) och tryck 🔄.</p><button class="btn white small" id="reIp">🔄 Uppdatera</button>`}</div>`;
    if (NET_ONLINE) side = netHostCardHTML('prop.html', 'card', HOST.ok);
  }
  const sets = isHost ? `<div class="opts">${seg('fill', FILLS, S.fill, '🤖 Fyll med datorn')}${S.fill ? seg('diff', DIFF.map((d, i) => [i, d.n]), S.diff, '⭐ Datorns nivå') : ''}${seg('rounds', ROUNDS.map((v, i) => [i, String(v)]), S.rounds, '🔁 Ronder')}</div>`
    : `<p class="note">🔁 ${roundsOf(S.rounds)} ronder${S.fill ? ` · 🤖 fylls på till ${S.fill} spelare` : ''}</p>`;
  $('lobbyBox').innerHTML = `<div class="gar"><div class="card"><h4>👥 Spelare (${L.players.length})</h4><div class="plist">${pls || '<p class="note">Ingen här än…</p>'}</div>
      ${sets}
      ${isHost ? `<button class="btn green" id="gStart" ${HOST.ok && !L.inGame ? '' : 'disabled'}>🫥 Starta!</button>` : `<p class="wait" style="text-align:center;font-weight:600">${L.inGame ? 'Matchen pågår… du är med från nästa rond 🫥' : `Väntar på att ${esc(L.host || 'värden')} startar ⏳`}</p>`}
      <p class="note">Varje rond lottas sökare och gömmare. Gömmarna förvandlar sig till saker – sökarna letar med vattenpistol.</p></div>
    <div style="display:flex;flex-direction:column;gap:12px">${side}</div></div>`;
  if (isHost) $('lobbyBox').querySelectorAll('.seg button').forEach(b => b.onclick = () => { HOST.set[b.parentNode.dataset.s] = segVal(b); store.set('hostSet', HOST.set); SFX.tap(); hostLobby(); });
  if ($('gStart')) $('gStart').onclick = () => { SFX.tap(); hostBegin(); };
  if ($('reIp')) $('reIp').onclick = () => { SFX.tap(); buildLobby(); };
}
$('lobbyBack').onclick = () => {
  SFX.tap();
  panel(`<h3>${G.mode === 'host' ? 'Avsluta matchen?' : 'Lämna?'}</h3><button class="btn pink" id="pYes">🚪 ${G.mode === 'host' ? 'Avsluta' : 'Lämna'}</button><button class="btn white small" id="pNo">Stanna kvar</button>`);
  $('pYes').onclick = () => { SFX.tap(); closePanel(); leave(); };
  $('pNo').onclick = () => { SFX.tap(); closePanel(); };
};

/* ---------- hjälp ---------- */
function help() {
  panel(`<h3>Så spelar man 🫥</h3>
    <p style="text-align:left;font-size:16px">Varje rond lottas <b>🔎 sökare</b> (ungefär en av tre) och <b>🫥 gömmare</b>.<br>
    🫥 <b>Gömmare</b>: gå fram till en sak – en stol, en nalle, en buske… – och tryck <b>🪄</b> för att förvandlas till den. 🔄 vrider dig. Stå still så syns du inte!<br>
    📣 ger ett läte och +2 ⭐ – men sökarna hör var du är. Var 30:e sekund låter du av dig själv.<br>
    🔎 <b>Sökare</b>: blunda och räkna i 25 sekunder. Sedan letar du med ficklampa och 💦 vattenpistol – tryck på en sak (eller håll SKJUT) för att spruta. Skjuter du på en riktig sak tappar du lite ❤️.<br>
    Blir en gömmare hittad blir den sökare och hjälper till. Gömmare som klarar sig hela tiden får +15 ⭐. Hittade gömmare ger sökaren +10 ⭐.<br>
    🖥️ Dator: WASD går, musen siktar, klick skjuter, E förvandla, R vrid, Q läte.</p>
    <button class="btn green" id="pClose">👍 Kör!</button>`);
  $('pClose').onclick = () => { SFX.tap(); closePanel(); };
}

/* ================= START ================= */
document.querySelectorAll('[data-back]').forEach(b => b.onclick = () => { SFX.tap(); show('menu'); });
$('meCard').onclick = () => { SFX.tap(); pickFigure('Vem spelar?', () => show('menu')); };
$('toQuick').onclick = () => { SFX.tap(); show('quick'); };
$('toJoin').onclick = () => { SFX.tap(); show('join'); };
$('toHost').onclick = () => { SFX.tap(); startHosting(); };
$('toOnline').onclick = () => { SFX.tap(); startOnline(); };
$('toHelp').onclick = () => { SFX.tap(); help(); };
$('toHub').onclick = () => { SFX.tap(); goHub(); };
window.onBack = function () {
  if ($('party').classList.contains('on')) { $('party').click(); return true; }
  if ($('overlay').classList.contains('on')) { for (const id of ['pClose', 'pNo', 'pMenu', 'pLobby', 'pLeave', 'pOk']) if ($(id)) { $(id).click(); return true; } return true; }
  if (current === 'game') { $('gBack').click(); return true; }
  if (current === 'lobby') { $('lobbyBack').click(); return true; }
  if (current === 'meScr') { $('meBack').click(); return true; }
  if (current === 'menu') { if (REMOTE) { if (window.Android) location.href = APP_HOME + 'index.html'; else leave(); } else goHub(); return true; }
  show('menu'); return true;
};
bubbles();
if (HOSTPAGE) hostStart();
else if (CLIENT) clientStart();
else show('menu');
