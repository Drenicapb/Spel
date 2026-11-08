/* Bucinca Förrådsfejden – menyer, samma skärm, nätverk (wifi + internet) och uppritning.
   Värden (eller enheten vid spel på samma skärm) kör ForradGame; alla ritar upp samma tillstånd (render). */
'use strict';
const store = makeStore('bl');
const Q = new URLSearchParams(location.search);
const PORT = 8765;
const REMOTE = (location.protocol === 'http:' && location.port === String(PORT)) || !!NET_ONLINE;
const HOSTPAGE = REMOTE && Q.get('host') === '1';
const CLIENT = REMOTE && !HOSTPAGE;
const APP_HOME = 'https://appassets.androidplatform.net/assets/';
const canHost = () => !!(window.Android && Android.netHost);
const { ITEMS, THEMES, SIZES, COVERS, LEVELS, C } = FR;

const SFX = Object.assign({}, CORE_SFX, {
  bid: () => { tone(880, .06, { type: 'square', vol: .06 }); tone(1320, .06, { type: 'square', vol: .05, delay: .05 }); },
  tick: () => tone(420, .07, { type: 'sine', vol: .12 }),
  gavel: () => { tone(160, .25, { type: 'triangle', vol: .3, to: 90 }); noise(.12, { f: 500, vol: .25 }); },
  open: v => tone(v >= 5000 ? 880 : v >= 1000 ? 660 : v >= 200 ? 520 : 300, .1, { type: 'triangle', vol: .12 }),
  jackpot: () => [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, .2, { type: 'square', vol: .07, delay: i * .09 })),
  sad: () => [392, 330, 262].forEach((f, i) => tone(f, .28, { vol: .12, delay: i * .18 })),
  cash: () => [1200, 1600, 2000].forEach((f, i) => tone(f, .08, { type: 'square', vol: .05, delay: i * .07 })),
  door: () => { for (let i = 0; i < 14; i++) noise(.1, { f: 500 + Math.random() * 500, q: .8, vol: .13, delay: i * .11 }); },
  poof: () => noise(.25, { f: 1400, vol: .14 }),
  mystery: () => tone(700, .12, { type: 'sine', vol: .1, to: 900 })
});

/* ---------- jag ---------- */
const ME = { ch: store.get('ch', 0) };
if (Q.get('c') != null && !isNaN(+Q.get('c'))) ME.ch = +Q.get('c');
if (!(ME.ch >= 0 && ME.ch < CHARS.length)) ME.ch = 0;
const myName = () => REMOTE && Q.get('n') && +Q.get('c') === ME.ch ? Q.get('n').slice(0, 14) : charName(ME.ch);
const stats = () => Object.assign({ games: 0, wins: 0, best: 0 }, store.get('stats', {}) || {});
function hsMax(k, v) {
  const c = hsCounters(); if ((c[k] | 0) >= v) return;
  c[k] = v | 0;
  try { if (window.Android && Android.profSet) Android.profSet('hs', JSON.stringify(c)); } catch (e) { }
  shared.set('hs', c);
}

/* ---------- skärmar ---------- */
let current = 'menu';
function show(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.toggle('on', s.id === id));
  current = id;
  if (id === 'menu') buildMenu();
  if (id === 'quick') buildQuick();
  if (id === 'join') buildJoin();
  if (id === 'lobby') buildLobby();
  if (window.Android && Android.keepAwake) try { Android.keepAwake(id === 'play' || id === 'lobby'); } catch (e) { }
}
function panel(html) { $('panel').innerHTML = html; $('overlay').classList.add('on'); }
function closePanel() { $('overlay').classList.remove('on'); }
function buildMenu() {
  let k = 0;
  const ln = (w, cls) => `<div class="${cls}">` + [...w].map(ch => ch === ' ' ? '<span class="sp"></span>' :
    `<span style="color:${CHARS[k % 4].c};animation-delay:${(k++) * .1}s">${ch}</span>`).join('') + '</div>';
  $('logo').innerHTML = ln('Förråds', 'l1') + ln('fejden 📦', 'l2');
  const st = stats();
  $('meCard').setAttribute('style', styleOf(ME.ch));
  $('meCard').innerHTML = `${avHTML(ME.ch)}<div style="text-align:left"><small>Spelare (tryck för att byta)</small><b>${esc(charName(ME.ch))}</b>
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:3px"><span class="chip">🏆 ${st.wins} vinster</span>${st.best ? `<span class="chip">💰 ${kr(st.best)}</span>` : ''}</div></div>`;
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
function seg(id, vals, cur, label) { return `<div class="opt"><b>${label}</b><div class="seg" data-s="${id}">${vals.map(v => `<button data-v="${v[0]}" class="${String(v[0]) === String(cur) ? 'on' : ''}">${v[1]}</button>`).join('')}</div></div>`; }
const segVal = b => isNaN(+b.dataset.v) ? b.dataset.v : +b.dataset.v;
const FILLS = [[0, 'Inga'], [2, 'Till 2'], [3, 'Till 3'], [4, 'Till 4'], [6, 'Till 6']];
const DIFFS = [['latt', 'Lätt'], ['medel', 'Medel'], ['svar', 'Svår']];
const ROUNDS = [[4, '4'], [6, '6'], [8, '8'], [10, '10']];
const CASH = [[10000, '10 000'], [15000, '15 000'], [25000, '25 000']];
function setsHTML(S) {
  return `<div class="opts">${seg('fill', FILLS, S.fill, '🤖 Fyll med datorn')}${S.fill ? seg('diff', DIFFS, S.diff, '⭐ Datorns nivå') : ''}
    ${seg('rounds', ROUNDS, S.rounds, '📦 Antal förråd')}${seg('cash', CASH, S.cash, '💰 Startkassa (kr)')}</div>`;
}
function fillBots(pl, n, diff) {
  const used = pl.map(p => p.ch); let k = 0;
  while (pl.length < n) {
    const free = CHARS.map((_, i) => i).filter(i => !used.includes(i));
    const ch = free.length ? pick(free) : Math.floor(Math.random() * CHARS.length); used.push(ch);
    pl.push({ id: 'b' + (k++), name: charName(ch), ch, bot: diff });
  }
  return pl;
}

/* ================= SPELA HÄR (samma skärm) ================= */
const QS = Object.assign({ humans: [ME.ch], fill: 3, diff: 'medel', rounds: 6, cash: 15000 }, store.get('qs', {}));
function buildQuick() {
  QS.humans = (QS.humans || []).filter(i => i >= 0 && i < CHARS.length);
  if (!QS.humans.length) QS.humans = [ME.ch];
  $('qBox').innerHTML = `<div class="card"><h4>👥 Vilka budar på den här skärmen?</h4>
      <p class="note">Tryck på figurerna som är med. Alla får en egen budknapp – håll telefonen eller surfplattan mellan er!</p>
      <div class="figsel" id="figSel">${CHARS.map((_, i) => `<button data-i="${i}" class="${QS.humans.includes(i) ? 'on' : ''}" style="${styleOf(i)}">${avHTML(i)}${esc(charName(i))}</button>`).join('')}</div></div>
    <div class="card">${setsHTML(QS)}</div>
    <button class="btn green bigbtn" id="qGo">🔨 Starta auktionen!</button>`;
  $('figSel').querySelectorAll('button').forEach(b => b.onclick = () => {
    const i = +b.dataset.i, on = QS.humans.includes(i);
    if (on) QS.humans = QS.humans.filter(x => x !== i); else if (QS.humans.length < 6) QS.humans.push(i); else { SFX.bonk(); return; }
    store.set('qs', QS); SFX.tap(); buildQuick();
  });
  $('qBox').querySelectorAll('.seg button').forEach(b => b.onclick = () => { QS[b.parentNode.dataset.s] = segVal(b); store.set('qs', QS); SFX.tap(); buildQuick(); });
  $('qGo').onclick = () => {
    SFX.tap();
    if (!QS.humans.length) { SFX.bonk(); return; }
    const pl = QS.humans.map(ch => ({ id: 'L' + ch, name: charName(ch), ch, bot: null }));
    if (QS.fill) fillBots(pl, Math.max(QS.fill, pl.length), QS.diff);
    if (pl.length < 2) { panel(`<h3>Minst två budgivare</h3><p>Välj fler figurer – eller fyll på med datorn.</p><button class="btn" id="pOk">OK</button>`); $('pOk').onclick = closePanel; return; }
    G.mode = 'local'; G.my = QS.humans.map(ch => 'L' + ch);
    beginGame(pl, { rounds: QS.rounds, cash: QS.cash });
  };
}

/* ================= SPELET ================= */
const G = { mode: 'local', my: [], game: null, st: null, stAt: 0, built: null, ph: null, prev: null, lastBid: 0, stage: 0, recRound: 0, recFinal: false, beat: null };
function beginGame(players, opt) {
  if (G.game) G.game.stop();
  G.game = new ForradGame(players, opt, onHostChange);
  show('play'); mount3D();
  G.game.start();
  clearInterval(G.beat);
  if (G.mode === 'host') G.beat = setInterval(() => { if (G.game && /peek|auction/.test(G.game.ph)) hostAll({ t: 'st', s: G.game.pub() }); }, 1500);
}
function onHostChange() {
  const s = G.game.pub();
  if (G.mode === 'host') hostAll({ t: 'st', s });
  render(s);
}
/* knapptryck: lokalt till motorn – eller till värden */
function act(a) {
  if (G.mode === 'client') { clSend(a); return; }
  const g = G.game; if (!g) return;
  const id = a.p;
  if (a.t === 'bid') g.bid(id, a.amt);
  else if (a.t === 'open') g.open(id, a.k);
  else if (a.t === 'all') g.openAll(id);
  else if (a.t === 'appr') { if (!g.appraise(id, a.k)) toastMsg('Inte råd att värdera'); }
  else if (a.t === 'sell') g.sell(id);
  else if (a.t === 'skip') g.skipPeek();
  else if (a.t === 'next') g.next();
}
const canCtl = () => G.mode !== 'client';
const P = id => G.st && G.st.P.find(p => p.id === id);
const isMine = id => G.my.includes(id);
function toastMsg(t) {
  let el = $('toast'); if (!el) { el = document.createElement('div'); el.id = 'toast'; el.style.cssText = 'position:fixed;left:50%;bottom:calc(var(--safe-b) + 10px);transform:translateX(-50%);background:#2B2350;color:#fff;padding:10px 16px;border-radius:14px;font-weight:600;z-index:60;max-width:90vw;text-align:center;transition:opacity .3s'; document.body.appendChild(el); }
  el.textContent = t; el.style.opacity = 1; clearTimeout(el._t); el._t = setTimeout(() => el.style.opacity = 0, 2000);
}

/* ---------- 3D ---------- */
let has3D = false;
function mount3D() {
  has3D = !!(window.THREE && V3.mount($('stage')));
  $('hint3').classList.toggle('hidden', !has3D);
}
function tapItem(k) {
  const s = G.st; if (!s || !s.L) return;
  const it = s.L.items[k], IT = ITEMS[it.id];
  if (s.ph === 'reveal' && s.R && isMine(s.R.owner) && !s.R.o[k]) { ac(); act({ t: 'open', p: s.R.owner, k }); return; }
  if (s.ph === 'reveal' && s.R && s.R.o[k]) { V3.focus(k); return; }
  if (has3D) V3.label(k, it.vis ? `${IT.e} ${IT.n}` : `📦 ${COVERS[it.cover][0]}`, 'info', 2200);
}
const valText = (s, k) => { const R = s.R, it = s.L.items[k], IT = ITEMS[it.id]; if (R.b[k]) return '🔍 Värderas…'; if (R.v[k] == null) return '?? kr'; return R.f[k] ? 'Kopia! ' + kr(R.v[k]) : (IT.m ? '✨ ' : '') + kr(R.v[k]); };
const valCol = (s, k) => { const R = s.R; if (R.b[k] || R.v[k] == null) return 'q'; return R.f[k] ? 'bad' : tierOf(R.v[k]); };
function flat2D(s) {
  // utan WebGL: enkel ruta med sakerna
  const R = s.R;
  $('stage').querySelectorAll('.flat').forEach(e => e.remove());
  if (has3D || !s.L) return;
  const d = document.createElement('div'); d.className = 'flat';
  d.innerHTML = s.L.items.map((it, k) => { const IT = ITEMS[it.id], op = R && R.o[k]; return `<div data-k="${k}">${op || it.vis ? `<b>${IT.e}</b>${esc(IT.n)}` : `<b>📦</b>${COVERS[it.cover][0]}`}${op ? `<br>${valText(s, k)}` : ''}</div>`; }).join('');
  d.querySelectorAll('[data-k]').forEach(e => e.onclick = () => tapItem(+e.dataset.k));
  $('stage').appendChild(d);
}

/* ---------- uppritning ---------- */
function render(s) {
  if (!s) return;
  if (G.st && s.gid === G.st.gid && s.seq < G.lastSeq) return;   // gammalt meddelande
  if (s.gid !== G.gid) { G.gid = s.gid; G.built = null; G.ph = null; G.prev = null; G.recRound = 0; G.recFinal = false; G.lastSeq = -1; G.stageCls = null; }
  const prev = G.st && G.st.gid === s.gid ? G.st : null;
  G.st = s; G.stAt = Date.now(); G.lastSeq = s.seq;
  if (current !== 'play') { show('play'); mount3D(); }
  $('pTitle').textContent = s.ph === 'final' ? 'Slutresultat 🏆' : `Förråd ${s.round}/${s.total}`;
  const me = G.my.map(P).filter(Boolean);
  $('myCash').classList.toggle('hidden', me.length !== 1);
  if (me.length === 1) $('myCash').textContent = '💰 ' + kr(me[0].cash);
  // ny omgång → bygg förrådet
  if (s.L && G.built !== s.round) {
    G.built = s.round; G.prev = null; G.lastBid = 0; G.stage = 0;
    if (has3D) { V3.build(s.L, { round: s.round, doorOpen: s.ph !== 'peek' }); V3.onTap = tapItem; if (s.ph === 'peek') V3.openDoor(500); }
  }
  const off = s.ph === 'final' || (s.ph === 'summary' && !s.S), short = /auction|sold|nosale/.test(s.ph), cls = (off ? 'off' : '') + (short ? 'short' : '');
  if (cls !== G.stageCls) { G.stageCls = cls; $('stage').classList.toggle('off', off); $('stage').classList.toggle('short', short); if (has3D) setTimeout(V3.resize, 0); }
  const newPh = G.ph !== s.ph;
  if (newPh) {
    G.ph = s.ph;
    if (s.ph === 'sold') { SFX.gavel(); buzz(40); }
    if (s.ph === 'nosale') SFX.sad();
    if (s.ph === 'reveal' && has3D) V3.home();
    if (s.ph === 'summary' && has3D) V3.home();
  }
  if (s.A && s.A.bid !== G.lastBid) { if (s.A.bid > G.lastBid) { SFX.bid(); buzz(10); } G.lastBid = s.A.bid; }
  sync3D(s);
  buildPanel(s, newPh, prev);
  flat2D(s);
  record(s);
}
function sync3D(s) {
  if (!s.R) { G.prev = null; return; }
  const R = s.R, pv = G.prev || { o: R.o.map(() => 0), a: R.a.map(() => 0), b: R.b.map(() => 0) };
  R.o.forEach((o, k) => {
    const it = s.L.items[k], IT = ITEMS[it.id];
    if (o && !pv.o[k]) {
      if (has3D) { V3.reveal(k); V3.focus(k); setTimeout(() => { if (G.st && G.st.R) V3.label(k, valText(G.st, k), valCol(G.st, k)); }, it.vis ? 250 : 650); }
      if (R.v[k] != null) { SFX.open(R.v[k]); if (R.v[k] >= 20000) { SFX.jackpot(); confetti(); if (has3D) V3.glow(k); } } else SFX.mystery();
    }
    if (R.b[k] && !pv.b[k] && has3D) { V3.focus(k); V3.label(k, '🔍 Värderas…', 'q'); }
    if (R.a[k] && !pv.a[k]) {
      if (has3D) V3.label(k, valText(s, k), valCol(s, k));
      if (R.f[k]) { SFX.sad(); toastMsg(`${IT.n}: en kopia! 😬`); }
      else if (R.v[k] >= 20000) { SFX.jackpot(); confetti(); buzz(60); if (has3D) V3.glow(k); toastMsg(`JACKPOT! ${IT.n} värd ${kr(R.v[k])}!`); }
      else SFX.open(R.v[k]);
    }
  });
  G.prev = { o: R.o.slice(), a: R.a.slice(), b: R.b.slice() };
}
function record(s) {
  // topplistan och egen statistik – bara för spelare på den här enheten
  if (s.ph === 'summary' && s.S && G.recRound !== s.round) {
    G.recRound = s.round;
    if (isMine(s.S.owner) && s.S.delta > 0) { const st = stats(); if (s.S.delta > st.best) { st.best = s.S.delta; store.set('stats', st); } hsMax('forradBest', s.S.delta); }
  }
  if (s.ph === 'final' && !G.recFinal) {
    G.recFinal = true;
    const w = [...s.P].sort((a, b) => b.cash - a.cash)[0];
    const st = stats(); if (G.my.some(id => P(id))) st.games++;
    if (w && isMine(w.id)) { st.wins++; hsAdd('forradWins', 1); }
    store.set('stats', st);
  }
}
const themeHTML = s => { const th = THEMES[s.L.th], sz = SIZES[s.L.sz], vis = s.L.items.filter(i => i.vis).length;
  return `<div class="th"><span class="ic">${th.e}</span><div><b>${esc(th.n)}</b><small>${sz.n} förråd · ${s.L.items.length} saker · ${vis} syns · städavgift ${kr(sz.fee)}</small></div></div>`; };
const pcHTML = (p, cls, extra) => `<div class="pc ${cls || ''}" style="${styleOf(p.ch)}">${avHTML(p.ch)}<span><b>${p.bot ? '🤖 ' : ''}${esc(p.name)}</b>${extra}</span></div>`;

function buildPanel(s, newPh, prev) {
  const el = $('pnl');
  if (s.ph === 'peek') {
    if (newPh) {
      el.innerHTML = `<div class="card">${themeHTML(s)}<div class="pbar"><i id="peekBar"></i></div><p class="note" id="peekTxt"></p>
        <div class="chips">${s.L.items.filter(i => i.vis).map(i => `<span class="ichip">${ITEMS[i.id].e} ${esc(ITEMS[i.id].n)}</span>`).join('')}<span class="ichip mut">+ ${s.L.items.filter(i => !i.vis).length} dolda</span></div>
        ${canCtl() ? `<button class="btn green small" id="skipB">🔨 Börja buda nu</button>` : ''}</div>
        <div class="card"><p class="note">👀 Titta noga! Vad är det värt? Visade saker syns, resten ligger i lådor och säckar. Dra i bilden för att titta runt och tryck på en sak.</p></div>`;
      if ($('skipB')) $('skipB').onclick = () => { SFX.tap(); act({ t: 'skip' }); };
    }
    return;
  }
  if (/auction|sold|nosale/.test(s.ph)) {
    const A = s.A; if (!A) return;
    const humans = G.my.map(P).filter(p => p && !p.bot);
    if (newPh && s.ph === 'auction' || !$('amt')) {
      const cols = humans.length <= 1 ? 1 : humans.length === 3 ? 3 : humans.length <= 4 ? 2 : 3;
      el.innerHTML = `<div class="card bidbox"><div class="lab" id="lab"></div><div class="bidamt" id="amt"></div><div class="lead" id="lead"></div>
          <div class="tbar"><i id="tb"></i></div><div class="call" id="call"></div></div>
        ${humans.length ? `<div class="zones" style="--cols:${cols}">${humans.map(h => `<div class="zone" id="z_${h.id}" data-p="${h.id}" style="${styleOf(h.ch)}">${humans.length > 1 ? avHTML(h.ch) : ''}<div class="zn">${esc(h.name)}</div><div class="zb" id="zb_${h.id}">BUDA</div><div class="zc" id="zc_${h.id}"></div></div>`).join('')}</div>`
          : `<p class="wait">👀 Du tittar på – du är med i nästa match.</p>`}
        <div class="prow" id="prow"></div>
        <div class="card">${themeHTML(s)}<div class="log" id="log"></div></div>`;
      el.querySelectorAll('.zone').forEach(z => z.addEventListener('pointerdown', e => {
        e.preventDefault(); ac();
        const st = G.st, id = z.dataset.p, p = P(id); if (!st || !st.A || st.ph !== 'auction') return;
        if (st.A.leader === id) return;
        if (p.cash < st.A.next + SIZES[st.L.sz].fee) { toastMsg(`${p.name} har inte råd (städavgiften räknas med)`); SFX.bonk(); return; }
        act({ t: 'bid', p: id, amt: st.A.next }); buzz(15);
      }));
    }
    updAuction();
    return;
  }
  if (s.ph === 'reveal') {
    const R = s.R, own = P(R.owner), mine = isMine(R.owner);
    if (newPh || !$('rgrid')) {
      el.innerHTML = `<div class="card"><div class="th">${avHTML(own.ch)}<div><b>${own.bot ? '🤖 ' : ''}${esc(own.name)} vann förrådet!</b><small>${THEMES[s.L.th].e} ${esc(THEMES[s.L.th].n)} · köpt för ${kr(R.paid)} · städavgift ${kr(SIZES[s.L.sz].fee)}</small></div></div>
          <div class="tally"><div><span>Kostnad</span><b id="tc"></b></div><div><span>Hittat värde</span><b id="tf"></b></div><div><span>Just nu</span><b id="tr"></b></div></div></div>
        ${mine ? `<div class="row2"><button class="btn white small" id="oaB">📦 Öppna alla</button><button class="btn green small" id="sellB" disabled>💰 Sälj allt</button></div>
          <p class="note" style="text-align:center;color:#fff;text-shadow:0 1px 0 #0006">Tryck på lådorna – i bilden eller här nedanför. Mystiska saker kan värderas för ${C.APPR} kr, annars säljs de för ${C.BULK * 100} %.</p>`
          : `<p class="wait" style="color:#fff;text-shadow:0 1px 0 #0006">🔎 ${esc(own.name)} gräver i förrådet…</p>`}
        <div class="rgrid" id="rgrid"></div>`;
      if (mine) { $('oaB').onclick = () => { SFX.tap(); act({ t: 'all', p: R.owner }); }; $('sellB').onclick = () => { SFX.tap(); act({ t: 'sell', p: R.owner }); }; }
      $('rgrid').onclick = e => {
        const st = G.st; if (!st || !st.R || !isMine(st.R.owner)) return;
        const a = e.target.closest('.appr'); if (a) { ac(); act({ t: 'appr', p: st.R.owner, k: +a.dataset.k }); return; }
        const c = e.target.closest('.rc'); if (c) tapItem(+c.dataset.k);
      };
    }
    updReveal(s, prev);
    return;
  }
  if (s.ph === 'summary') {
    if (!newPh && $('sumDone')) { updStand(); return; }
    let top = '';
    if (s.S) {
      const S = s.S, own = P(S.owner);
      top = `<div class="card"><div class="th">${avHTML(own.ch)}<div><b>${esc(own.name)}s affär</b><small>${THEMES[s.L.th].e} ${esc(THEMES[s.L.th].n)}</small></div></div>
        <div class="result ${S.delta >= 0 ? 'good' : 'bad'}">${sgn(S.delta)}</div>
        <p class="note" style="text-align:center">${S.delta > 20000 ? 'Livet förändrat! 🤑' : S.delta > 5000 ? 'Riktigt bra fynd! 🎉' : S.delta >= 0 ? 'Vinst är vinst 👍' : S.delta > -3000 ? 'Aj, lite minus 😬' : 'Det där gjorde ont… 💸'}</p>
        <div class="lines"><div><span>Försäljning</span><b class="good">${kr(S.sale)}</b></div><div><span>Budet</span><b>−${kr(S.paid)}</b></div><div><span>Städavgift</span><b>−${kr(S.fee)}</b></div>${S.appr ? `<div><span>Värderingar</span><b>−${kr(S.appr)}</b></div>` : ''}</div>
        <div class="ilist">${S.lines.map(l => `<div><span>${ITEMS[l.id].e} ${esc(ITEMS[l.id].n)} ${!l.known ? '<small>(ovärderad, 40 %)</small>' : l.fake ? '<small class="bad">(kopia)</small>' : ''}</span><b class="${tierOf(l.sold)}">${kr(l.sold)}</b></div>`).join('')}</div></div>`;
      if (S.delta >= 0) { SFX.cash(); if (S.delta > 5000) confetti(); } else SFX.sad();
    } else top = `<div class="card"><p style="text-align:center;font-size:18px;font-weight:600;margin:0">🚮 Ingen ville ha förrådet – det går till soptippen.</p></div>`;
    const last = s.round >= s.total;
    el.innerHTML = `${top}<div class="card" id="sumDone"><h4>📊 Ställningen</h4><div id="stand"></div></div>
      ${canCtl() ? `<button class="btn green bigbtn" id="nextB">${last ? '🏆 Se slutresultatet' : `Nästa förråd (${s.round + 1}/${s.total}) →`}</button>` : `<p class="wait" style="color:#fff;text-shadow:0 1px 0 #0006">Väntar på att värden går vidare ⏳</p>`}`;
    if ($('nextB')) $('nextB').onclick = () => { SFX.tap(); act({ t: 'next' }); };
    updStand();
    return;
  }
  if (s.ph === 'final') {
    if (!newPh) { updStand(); return; }
    const sorted = [...s.P].sort((a, b) => b.cash - a.cash), w = sorted[0];
    el.innerHTML = `<div class="card" style="align-items:center;text-align:center">${avHTML(w.ch, 'mini')}<h3 style="margin:4px 0 0;font-size:30px">👑 ${esc(w.name)} vinner!</h3>
        <p class="note">med <b>${kr(w.cash)}</b> (${sgn(w.cash - w.start)})</p></div>
      <div class="card"><h4>📊 Slutställning</h4><div id="stand"></div></div>
      <div class="card"><h4>📈 Statistik</h4><div class="ilist">${sorted.map(p => `<div><span><b>${esc(p.name)}</b><br><small>${p.won} förråd · bästa fynd: ${p.best ? `${ITEMS[p.best.id].e} ${esc(ITEMS[p.best.id].n)} (${kr(p.best.v)})` : '–'}</small></span><b class="${p.profit >= 0 ? 'good' : 'bad'}">${sgn(p.profit)}</b></div>`).join('')}</div></div>
      <div class="row2">${canCtl() ? `<button class="btn green small" id="againB">🔁 Spela igen</button>` : ''}<button class="btn white small" id="menuB">${G.mode === 'local' ? '🏠 Meny' : G.mode === 'host' ? '👥 Till lobbyn' : '🚪 Lämna'}</button></div>`;
    $('stand').innerHTML = standHTML(s);
    if ($('againB')) $('againB').onclick = () => { SFX.tap(); playAgain(); };
    $('menuB').onclick = () => { SFX.tap(); if (G.mode === 'host') backToLobby(); else if (G.mode === 'client') leave(); else { G.game && G.game.stop(); G.game = null; show('menu'); } };
    if (G.my.length) celebrate(w.ch, isMine(w.id) ? 'Du vann!' : w.name + ' vann!', 'Rikast i auktionshallen 💰', ['💰', '📦', '🪙', '💎', '🏆', '✨', '💵', '⭐']);
  }
}
function standHTML(s) {
  const max = Math.max(1, ...s.P.map(p => p.cash));
  return [...s.P].sort((a, b) => b.cash - a.cash).map((p, r) => `<div class="srow ${isMine(p.id) ? 'mine' : ''}" style="${styleOf(p.ch)}"><div class="rk">${r + 1}</div>${avHTML(p.ch)}
    <div><b>${p.bot ? '🤖 ' : ''}${esc(p.name)}${p.gone ? ' 📴' : ''}</b><div class="bar" style="width:${Math.max(3, p.cash / max * 100)}%"></div></div>
    <div class="cash">${kr(p.cash)}${p.delta ? `<small class="${p.delta > 0 ? 'good' : 'bad'}">${sgn(p.delta)}</small>` : ''}</div></div>`).join('');
}
function updStand() { if ($('stand') && G.st) $('stand').innerHTML = standHTML(G.st); }
function updAuction() {
  const s = G.st; if (!s || !s.A || !$('amt')) return;
  const A = s.A, L = P(A.leader), fee = SIZES[s.L.sz].fee;
  $('lab').textContent = A.bid ? 'Högsta bud' : 'Utropspris';
  if ($('amt').textContent !== kr(A.bid || C.START_BID)) { $('amt').textContent = kr(A.bid || C.START_BID); $('amt').classList.remove('pop'); void $('amt').offsetWidth; $('amt').classList.add('pop'); }
  $('lead').innerHTML = L ? `${avHTML(L.ch)}<span style="color:${CHARS[L.ch].d}">${esc(L.name)} leder 👑</span>` : '<span class="note">Vem börjar?</span>';
  const call = $('call');
  if (s.ph === 'sold') { call.className = 'call sold'; call.textContent = 'SÅLT! 🔨'; $('lead').innerHTML = `${avHTML(L.ch)}<span>${esc(L.name)} köper för ${kr(A.bid)}</span>`; }
  else if (s.ph === 'nosale') { call.className = 'call'; call.textContent = 'Inga bud!'; }
  else call.className = 'call';
  $('prow').innerHTML = s.P.map(p => { const lead = A.leader === p.id, out = A.out.includes(p.id);
    return pcHTML(p, lead ? 'lead' : out || p.gone ? 'out' : '', lead ? 'leder! 👑' : p.gone ? 'borta 📴' : out ? 'hoppar av' : kr(p.cash)); }).join('');
  G.my.forEach(id => {
    const z = $('z_' + id); if (!z) return; const p = P(id);
    const lead = A.leader === id, ok = s.ph === 'auction' && !lead && p.cash >= A.next + fee;
    z.classList.toggle('lead', lead); z.classList.toggle('off', !lead && !ok);
    $('zb_' + id).textContent = s.ph !== 'auction' ? (lead ? 'DIN! 🔨' : '—') : lead ? 'DU LEDER 👑' : ok ? `BUDA ${kr(A.next)}` : 'HAR INTE RÅD';
    $('zc_' + id).textContent = 'Kassa ' + kr(p.cash);
  });
  $('log').innerHTML = A.log.map(l => { const p = P(l.p); return p ? `<div><b style="color:${CHARS[p.ch].d}">${esc(p.name)}</b> bjuder ${kr(l.b)}</div>` : ''; }).join('');
}
function rcard(s, k, flip) {
  const R = s.R, it = s.L.items[k], IT = ITEMS[it.id], mine = isMine(R.owner);
  if (!R.o[k]) return `<div class="rc closed" data-k="${k}"><div class="em">${it.vis ? IT.e : '📦'}</div><div class="nm">${it.vis ? esc(IT.n) : COVERS[it.cover][0]}</div>${mine ? '<div class="hint">Tryck för att öppna</div>' : ''}</div>`;
  let body;
  if (R.b[k]) body = `<div class="tag q">Värderaren tittar…</div>`;
  else if (R.v[k] == null) body = `<div class="val q">?? kr</div>${mine ? `<button class="appr" data-k="${k}">Värdera ${C.APPR} kr</button>` : '<div class="tag q">Mystisk</div>'}`;
  else if (R.f[k]) body = `<div class="val bad">${kr(R.v[k])}</div><div class="tag bad">Kopia 😬</div>`;
  else body = `<div class="val ${tierOf(R.v[k])}">${kr(R.v[k])}</div>${IT.m ? '<div class="tag good">Äkta! ✨</div>' : ''}`;
  return `<div class="rc ${flip ? 'flip' : ''} ${R.v[k] >= 20000 && !R.f[k] ? 'jc' : ''} ${R.b[k] ? 'shake' : ''}" data-k="${k}"><div class="em">${IT.e}</div><div class="nm">${esc(IT.n)}</div>${body}</div>`;
}
function updReveal(s, prev) {
  const R = s.R, pr = prev && prev.R && prev.round === s.round ? prev.R : null;
  $('rgrid').innerHTML = s.L.items.map((_, k) => rcard(s, k, R.o[k] && !(pr && pr.o[k]))).join('');
  const cost = R.paid + SIZES[s.L.sz].fee + R.appr, found = R.v.reduce((a, v) => a + (v || 0), 0), unk = R.o.filter((o, k) => o && R.v[k] == null).length;
  $('tc').textContent = kr(cost); $('tf').textContent = kr(found) + (unk ? ` +${unk}?` : '');
  const r = found - cost; $('tr').textContent = sgn(r); $('tr').className = r >= 0 ? 'good' : 'bad';
  if ($('sellB')) $('sellB').disabled = !(R.o.every(x => x) && !R.b.some(x => x));
}
/* klockor (kika / budgivning) – räknas lokalt från senaste tillståndet */
setInterval(() => {
  const s = G.st; if (!s || current !== 'play') return;
  const el = Date.now() - G.stAt;
  if (s.ph === 'peek' && $('peekBar')) {
    const left = Math.max(0, (s.rem || 0) - el), tot = C.PEEK * 1000 + 2300;
    $('peekBar').style.width = Math.min(100, left / tot * 100) + '%';
    $('peekTxt').textContent = `Budgivningen börjar om ${Math.ceil(left / 1000)} s`;
  }
  if (s.ph === 'auction' && s.A && $('tb')) {
    const rem = Math.max(0, s.A.rem - el);
    $('tb').style.width = (rem / s.A.win * 100) + '%';
    const st = s.A.leader === null ? 0 : rem < 1300 ? 2 : rem < 2600 ? 1 : 0;
    if (st !== G.stage) { if (st > G.stage) { SFX.tick(); buzz(8); } G.stage = st; }
    $('call').textContent = s.A.leader === null ? `Vem ger ${kr(C.START_BID)}?` : st === 2 ? 'Andra gången…' : st === 1 ? 'Första gången…' : `${kr(s.A.bid)} – hör jag mer?`;
  }
  if (/sold|nosale/.test(s.ph) && $('tb')) $('tb').style.width = '0%';
}, 120);
function playAgain() {
  const s = G.st; if (!s || !G.game) return;
  const pl = s.P.filter(p => !p.gone).map(p => ({ id: p.id, name: p.name, ch: p.ch, bot: p.bot }));
  if (G.mode === 'host') { const ids = new Set(HOST.lobby.map(p => p.id)); pl.forEach(p => { if (!p.bot && !ids.has(p.id)) p.gone = true; }); }
  beginGame(pl.filter(p => !p.gone), G.game.opt);
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
    store.set('lastIp', v); goJoin(v, port, 'forrad.html');
  };
  netBindJoinCard((page, code) => `${page}?online=${encodeURIComponent(code)}&n=${encodeURIComponent(charName(ME.ch))}&c=${ME.ch}&back=${encodeURIComponent(location.href.split('?')[0])}`);
  if (app) { $('rescan').onclick = () => { SFX.tap(); scan(); }; scan(); }
}
function scan() {
  if (!window.Android || !Android.netScan || scanning) return;
  scanning = true;
  $('found').innerHTML = `<p class="note"><span class="spin">📦</span> Letar efter matcher…</p>`;
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
function startOnline() { location.href = netOnlineHostURL('forrad.html', `n=${encodeURIComponent(charName(ME.ch))}&c=${ME.ch}`); }
function startHosting() {
  let r = null;
  try { r = JSON.parse(Android.netHost('forrad:' + charName(ME.ch) + 's auktion')); } catch (e) { }
  if (!r || !r.ok) { panel(`<h3>Gick inte 😕</h3><p>Kunde inte starta. Prova att stänga appen och öppna igen.</p><button class="btn" id="pOk">OK</button>`); $('pOk').onclick = closePanel; return; }
  location.href = `http://127.0.0.1:${r.port}/forrad.html?host=1&n=${encodeURIComponent(charName(ME.ch))}&c=${ME.ch}`;
}
function leave() {
  if (G.game) { G.game.stop(); G.game = null; }
  if (G.mode === 'host' || HOSTPAGE) { try { HOST.ws && HOST.ws.close(); } catch (e) { } HOST.ws = null; try { Android.netStop(); } catch (e) { } location.href = NET_ONLINE ? 'forrad.html' : APP_HOME + 'forrad.html'; return; }
  if (CLIENT) {
    CL.closing = true; try { CL.ws && CL.ws.close(); } catch (e) { }
    const back = Q.get('back');
    if (back && /^https?:\/\//.test(back)) location.href = back; else if (NET_ONLINE) location.href = 'forrad.html'; else if (window.Android) location.href = APP_HOME + 'forrad.html'; else { G.mode = 'local'; show('menu'); }
    return;
  }
  show('menu');
}

/* ----- värd ----- */
const HOST = { ws: null, lobby: [], ok: false, set: Object.assign({ fill: 0, diff: 'medel', rounds: 6, cash: 15000 }, store.get('hostSet', {})) };
function hostStart() { G.mode = 'host'; G.my = ['h']; HOST.lobby = [{ id: 'h', name: myName(), ch: ME.ch }]; hostConnect(); show('lobby'); }
function hostConnect() {
  const ws = netSocket(true); HOST.ws = ws;
  ws.onopen = () => { HOST.ok = true; buildLobby(); };
  ws.onmessage = e => hostRecv(e.data);
  ws.onclose = () => { HOST.ok = false; if (HOST.ws === ws) setTimeout(() => { if (HOST.ws === ws) hostConnect(); }, 1000); };
}
const hostAll = o => { if (HOST.ws && HOST.ws.readyState === 1) HOST.ws.send('*' + JSON.stringify(o)); };
const hostTo = (id, o) => { if (HOST.ws && HOST.ws.readyState === 1) HOST.ws.send('@' + id.slice(1) + '|' + JSON.stringify(o)); };
const inGame = () => !!(G.game && G.game.ph !== 'final' && current === 'play');
function hostRecv(d) {
  if (d[0] === '+') return;
  if (d[0] === '-') {
    const id = 'c' + d.slice(1);
    HOST.lobby = HOST.lobby.filter(q => q.id !== id);
    if (G.game) G.game.remove(id);
    return hostLobby();
  }
  const bar = d.indexOf('|'); if (bar < 0) return;
  const id = 'c' + d.slice(0, bar);
  let m; try { m = JSON.parse(d.slice(bar + 1)); } catch (e) { return; }
  const g = G.game;
  if (m.t === 'hi') {
    const p = { id, name: String(m.name || 'Spelare').slice(0, 14), ch: Math.abs(m.ch | 0) % CHARS.length };
    const old = HOST.lobby.find(q => q.id === id);
    if (old) Object.assign(old, p); else { HOST.lobby.push(p); SFX.pick(); buzz(15); }
    hostTo(id, { t: 'welcome', id });
    if (g && current === 'play') { g.rejoin(p.name, p.ch, id); hostTo(id, { t: 'st', s: g.pub() }); }
    hostLobby();
    return;
  }
  if (!g) return;
  if (m.t === 'bid') g.bid(id, m.amt | 0);
  else if (m.t === 'open') g.open(id, m.k | 0);
  else if (m.t === 'all') g.openAll(id);
  else if (m.t === 'appr') g.appraise(id, m.k | 0);
  else if (m.t === 'sell') g.sell(id);
}
function lobbyMsg() { return { t: 'lobby', players: HOST.lobby.map(p => ({ id: p.id, name: p.name, ch: p.ch })), inGame: inGame(), host: myName(), set: HOST.set }; }
function hostLobby() { hostAll(lobbyMsg()); if (current === 'lobby') buildLobby(); }
function hostBegin() {
  const S = HOST.set;
  const pl = HOST.lobby.map(p => ({ id: p.id, name: p.id === 'h' ? myName() : p.name, ch: p.id === 'h' ? ME.ch : p.ch, bot: null }));
  if (S.fill) fillBots(pl, Math.max(S.fill, pl.length), S.diff);
  if (pl.length < 2) { panel(`<h3>Minst två budgivare</h3><p>Vänta tills någon har gått med – eller fyll på med datorn.</p><button class="btn" id="pOk">OK</button>`); $('pOk').onclick = closePanel; return; }
  beginGame(pl, { rounds: S.rounds, cash: S.cash });
  hostLobby();
}
function backToLobby() { if (G.game) G.game.stop(); G.game = null; G.st = null; clearInterval(G.beat); hostAll({ t: 'lobbyback' }); show('lobby'); hostLobby(); }

/* ----- klient ----- */
const CL = { ws: null, id: null, lobby: null, closing: false, tries: 0 };
function clientStart() { G.mode = 'client'; pickFigure('Vem spelar?', clientConnect, leave); }
function clientConnect() {
  CL.closing = false;
  const ws = netSocket(false); CL.ws = ws;
  panel(`<h3>Ansluter… <span class="spin">📦</span></h3>`);
  ws.onopen = () => { CL.tries = 0; closePanel(); ws.send(JSON.stringify({ t: 'hi', name: myName(), ch: ME.ch })); if (current !== 'play') show('lobby'); };
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
  if (m.t === 'welcome') { CL.id = m.id; G.my = [m.id]; }
  else if (m.t === 'lobby') { CL.lobby = m; if (current === 'lobby') buildLobby(); }
  else if (m.t === 'st') {
    if (current !== 'play') G.gid = null;
    render(m.s);
  }
  else if (m.t === 'lobbyback') { G.st = null; closePanel(); show('lobby'); }
  else if (m.t === 'hostgone') { CL.closing = true; panel(`<h3>Auktionen är slut 👋</h3><p>Värden avslutade.</p><button class="btn green" id="pLeave">OK</button>`); $('pLeave').onclick = () => { SFX.tap(); leave(); }; }
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
    const url = ips.length ? `http://${ips[0]}:${PORT}/forrad.html` : '';
    let qr = ''; if (url && window.qrcode) { try { const q = qrcode(0, 'M'); q.addData(url); q.make(); qr = q.createSvgTag(4, 2); } catch (e) { } }
    side = `<div class="card"><h4>📲 Bjud in familjen</h4>${url ? `<div class="joininfo"><div class="qr">${qr}</div><div><p class="note">iPhone/iPad: skanna med kameran eller öppna i Safari:</p><div class="url">${esc(url.replace(/^http:\/\//, ''))}</div></div></div>
      <p class="note">Android med appen: Förrådsfejden → 🔗 Gå med.</p>` : `<p class="note">⚠️ Hittar inget wifi. Anslut till wifi (eller slå på surfzon) och tryck 🔄.</p><button class="btn white small" id="reIp">🔄 Uppdatera</button>`}</div>`;
    if (NET_ONLINE) side = netHostCardHTML('forrad.html', 'card', HOST.ok);
  }
  const sets = isHost ? setsHTML(S)
    : `<p class="note">📦 ${S.rounds} förråd · 💰 ${kr(S.cash)} var${S.fill ? ` · 🤖 fylls på till ${S.fill} budgivare` : ''}</p>`;
  $('lobbyBox').innerHTML = `<div class="gar"><div class="card"><h4>👥 Budgivare (${L.players.length})</h4><div class="plist">${pls || '<p class="note">Ingen här än…</p>'}</div>
      ${sets}
      ${isHost ? `<button class="btn green" id="gStart" ${HOST.ok ? '' : 'disabled'}>🔨 Starta auktionen!</button>` : `<p class="wait">${L.inGame ? 'Auktionen pågår… du kan titta på 👀' : `Väntar på att ${esc(L.host || 'värden')} startar ⏳`}</p>`}
      <p class="note">Alla budar från sin egen telefon. Den som vinner förrådet öppnar lådorna – alla ser vad som dyker upp!</p></div>
    <div style="display:flex;flex-direction:column;gap:12px">${side}</div></div>`;
  if (isHost) $('lobbyBox').querySelectorAll('.seg button').forEach(b => b.onclick = () => { HOST.set[b.parentNode.dataset.s] = segVal(b); store.set('hostSet', HOST.set); SFX.tap(); hostLobby(); });
  if ($('gStart')) $('gStart').onclick = () => { SFX.tap(); hostBegin(); };
  if ($('reIp')) $('reIp').onclick = () => { SFX.tap(); buildLobby(); };
}
$('lobbyBack').onclick = () => {
  SFX.tap();
  panel(`<h3>${G.mode === 'host' ? 'Avsluta auktionen?' : 'Lämna?'}</h3><button class="btn pink" id="pYes">🚪 ${G.mode === 'host' ? 'Avsluta' : 'Lämna'}</button><button class="btn white small" id="pNo">Stanna kvar</button>`);
  $('pYes').onclick = () => { SFX.tap(); closePanel(); leave(); };
  $('pNo').onclick = () => { SFX.tap(); closePanel(); };
};
$('pBack').onclick = () => {
  SFX.tap();
  const opts = G.mode === 'local' ? `<button class="btn pink" id="pYes">🚪 Avsluta spelet</button>`
    : G.mode === 'host' ? `<button class="btn white" id="pLobby">👥 Tillbaka till lobbyn</button><button class="btn pink" id="pYes">🚪 Avsluta för alla</button>`
      : `<button class="btn pink" id="pYes">🚪 Lämna auktionen</button>`;
  panel(`<h3>Paus ⏸️</h3>${opts}<button class="btn green small" id="pNo">▶️ Fortsätt</button>`);
  $('pNo').onclick = () => { SFX.tap(); closePanel(); };
  if ($('pLobby')) $('pLobby').onclick = () => { SFX.tap(); closePanel(); backToLobby(); };
  $('pYes').onclick = () => { SFX.tap(); closePanel(); if (G.mode === 'local') { if (G.game) G.game.stop(); G.game = null; G.st = null; show('menu'); } else leave(); };
};

/* ---------- hjälp ---------- */
function help() {
  panel(`<h3>Så spelar man 📦</h3>
    <p style="text-align:left;font-size:16px">👀 <b>Kika:</b> rulldörren åker upp i ${C.PEEK} sekunder. En del saker syns – resten ligger i kartonger, säckar och under presenningar.<br>
    🔨 <b>Buda:</b> tryck på din knapp för att höja. Klubban faller när ingen har budat på ${C.BID_WINDOW} sekunder. Städavgiften måste du också ha råd med!<br>
    📦 <b>Gräv:</b> vinnaren öppnar lådorna. Mystiska fynd (tavlor, ur, smycken, kassaskåp…) kan värderas för ${C.APPR} kr – annars säljs de billigt (${C.BULK * 100} %). Akta förfalskningar!<br>
    💰 <b>Sälj:</b> allt säljs, städavgiften dras. Mest pengar efter sista förrådet vinner.<br>
    🌍 Spela mot familjen: en startar nätverks- eller internetmatch, de andra trycker 🔗 Gå med och budar från sin egen telefon.</p>
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
  if ($('overlay').classList.contains('on')) { for (const id of ['pClose', 'pNo', 'pLeave', 'pOk']) if ($(id)) { $(id).click(); return true; } return true; }
  if (current === 'play') { $('pBack').click(); return true; }
  if (current === 'lobby') { $('lobbyBack').click(); return true; }
  if (current === 'meScr') { $('meBack').click(); return true; }
  if (current === 'menu') { if (REMOTE) { if (window.Android) location.href = APP_HOME + 'index.html'; else leave(); } else goHub(); return true; }
  show('menu'); return true;
};
bubbles();
if (HOSTPAGE) hostStart();
else if (CLIENT) clientStart();
else show('menu');
