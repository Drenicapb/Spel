/* Bucinca Förrådsfejden – spelmotorn. Körs bara hos värden (eller på enheten när alla spelar på samma skärm).
   Allt spelarna ser skickas som ett tillstånd (pub()); klienterna ritar bara upp det och skickar sina knapptryck.
   Faser: peek (kika in) → auction (budgivning) → sold/nosale → reveal (vinnaren öppnar) → summary → … → final */
'use strict';
class ForradGame {
  constructor(players, opt, onChange) {
    this.opt = { rounds: opt.rounds || 6, cash: opt.cash || 15000 };
    this.P = players.map(p => ({ id: p.id, name: p.name, ch: p.ch, bot: p.bot || null, cash: this.opt.cash, start: this.opt.cash, won: 0, profit: 0, best: null, delta: 0, gone: false }));
    this.round = 0; this.ph = 'intro'; this.onChange = onChange; this.t = []; this.iv = null; this.seq = 0;
    this.L = null; this.A = null; this.R = null; this.S = null;
    this.gid = Math.random().toString(36).slice(2, 8);
  }
  later(f, ms) { const id = setTimeout(() => { this.t = this.t.filter(x => x !== id); if (!this.dead) f(); }, ms); this.t.push(id); return id; }
  clear() { this.t.forEach(clearTimeout); this.t = []; clearInterval(this.iv); this.iv = null; }
  stop() { this.clear(); this.dead = true; }
  changed() { this.seq++; if (this.onChange && !this.dead) this.onChange(); }
  pl(id) { return this.P.find(p => p.id === id); }
  fee() { return FR.SIZES[this.L.sz].fee; }
  start() { this.nextRound(); }

  /* ---------- kika in ---------- */
  nextRound() {
    this.clear(); this.round++;
    this.P.forEach(p => p.delta = 0); this.A = this.R = this.S = null;
    if (this.round > this.opt.rounds) { this.ph = 'final'; this.changed(); return; }
    this.L = FR.genLocker(); this.ph = 'peek';
    this.endsAt = Date.now() + FR.C.PEEK * 1000 + 2300;   // 2,3 s för dörren
    this.later(() => this.startAuction(), this.endsAt - Date.now());
    this.changed();
  }
  skipPeek() { if (this.ph === 'peek') this.startAuction(); }

  /* ---------- budgivning ---------- */
  botMax(p) {
    const lv = FR.LEVELS[p.bot] || FR.LEVELS.medel, noise = () => Math.max(.3, 1 + gauss() * lv.sd);
    let vis = 0, hid = 0;
    this.L.items.forEach(it => { if (it.vis) vis += FR.ITEMS[it.id].m ? FR.ITEMEXP[it.id] : it.value; else hid++; });
    const est = vis * noise() + hid * FR.THEMEEXP[this.L.th] * noise();
    return Math.min(est * rnd(...lv.ag) - this.fee(), p.cash - this.fee());
  }
  botDelay(first) { return first ? rnd(1500, 6000) : (Math.random() < .25 ? rnd(2500, 3600) : rnd(450, 2200)); }
  startAuction() {
    this.clear(); const now = Date.now();
    this.ph = 'auction'; this.A = { bid: 0, leader: null, last: now, stage: 0, log: [], bots: {} };
    this.P.forEach(p => { if (p.bot) this.A.bots[p.id] = { max: this.botMax(p), next: now + this.botDelay(true), out: false }; });
    this.iv = setInterval(() => this.tick(), 100);
    this.changed();
  }
  window() { return this.A.leader === null ? FR.C.FIRST_WINDOW : FR.C.BID_WINDOW; }
  nextBid() { const A = this.A; return A.bid === 0 ? FR.C.START_BID : A.bid + FR.inc(A.bid); }
  canBid(id) { const A = this.A, p = this.pl(id); return !!p && !!A && this.ph === 'auction' && !A.ended && A.leader !== id && !p.gone && p.cash >= this.nextBid() + this.fee(); }
  bid(id, amt) {
    if (!this.canBid(id)) return false;
    if (amt && amt !== this.nextBid()) return false;   // någon hann före – samma bud igen gäller inte
    const A = this.A, now = Date.now();
    A.bid = this.nextBid(); A.leader = id; A.last = now; A.stage = 0;
    A.log.unshift({ p: id, b: A.bid }); if (A.log.length > 8) A.log.length = 8;
    for (const k in A.bots) A.bots[k].next = now + this.botDelay(false);
    this.changed(); return true;
  }
  tick() {
    const A = this.A; if (!A || A.ended) return;
    const now = Date.now();
    for (const k in A.bots) {
      const b = A.bots[k]; if (b.out || now < b.next) continue;
      if (A.leader === k) { b.next = Infinity; continue; }
      if (!this.canBid(k) || this.nextBid() > b.max) { b.out = true; this.changed(); continue; }
      const close = this.nextBid() / Math.max(1, b.max);
      if (Math.random() < (close > .85 ? .55 : .92)) this.bid(k); else b.next = now + rnd(300, 900);
    }
    const rem = this.window() - (now - A.last) / 1000;
    if (A.leader !== null) { const st = rem < 1.3 ? 2 : rem < 2.6 ? 1 : 0; if (st > A.stage) { A.stage = st; this.changed(); } }
    if (rem <= 0) this.endAuction();
  }
  endAuction() {
    const A = this.A; A.ended = true; clearInterval(this.iv); this.iv = null;
    if (A.leader === null) { this.ph = 'nosale'; this.changed(); this.later(() => { this.ph = 'summary'; this.S = null; this.changed(); }, 2600); return; }
    this.pl(A.leader).cash -= A.bid;
    this.ph = 'sold'; this.changed();
    this.later(() => this.startReveal(), 2300);
  }

  /* ---------- öppna förrådet ---------- */
  startReveal() {
    const A = this.A, n = this.L.items.length;
    this.ph = 'reveal'; this.R = { owner: A.leader, paid: A.bid, appr: 0, o: Array(n).fill(0), a: Array(n).fill(0), b: Array(n).fill(0) };
    this.changed();
    const p = this.pl(A.leader);
    if (p.bot || p.gone) this.botReveal(!p.bot);
  }
  isOwner(id) { return this.ph === 'reveal' && !!this.R && this.R.owner === id; }
  open(id, k) { const R = this.R; if (!this.isOwner(id) || !(k >= 0 && k < R.o.length) || R.o[k]) return; R.o[k] = 1; this.changed(); }
  openAll(id) {
    if (!this.isOwner(id)) return;
    let i = 0;
    this.R.o.forEach((o, k) => { if (!o) this.later(() => { if (this.ph === 'reveal' && !this.R.o[k]) { this.R.o[k] = 1; this.changed(); } }, (i++) * 380); });
  }
  appraise(id, k) {
    const R = this.R; if (!this.isOwner(id)) return false;
    const it = this.L.items[k], p = this.pl(id);
    if (!it || !R.o[k] || !FR.ITEMS[it.id].m || R.a[k] || R.b[k] || p.cash < FR.C.APPR) return false;
    p.cash -= FR.C.APPR; R.appr += FR.C.APPR; R.b[k] = 1; this.changed();
    this.later(() => { if (this.ph !== 'reveal') return; R.b[k] = 0; R.a[k] = 1; this.changed(); }, 1150);
    return true;
  }
  canSell() { const R = this.R; return this.ph === 'reveal' && R.o.every(x => x) && !R.b.some(x => x); }
  sell(id) {
    if (!this.isOwner(id) || !this.canSell()) return;
    const R = this.R, p = this.pl(R.owner), fee = this.fee();
    const lines = this.L.items.map((it, k) => { const known = !FR.ITEMS[it.id].m || !!R.a[k]; return { k, id: it.id, sold: known ? it.value : r10(it.value * FR.C.BULK), known, fake: known && it.fake ? 1 : 0 }; }).sort((a, b) => b.sold - a.sold);
    const sale = lines.reduce((s, l) => s + l.sold, 0), delta = sale - R.paid - fee - R.appr;
    p.cash += sale - fee; p.delta = delta; p.profit += delta; p.won++;
    if (lines[0] && (!p.best || lines[0].sold > p.best.v)) p.best = { v: lines[0].sold, id: lines[0].id };
    this.clear();
    this.ph = 'summary'; this.S = { owner: R.owner, paid: R.paid, fee, appr: R.appr, sale, delta, lines };
    this.changed();
  }
  botReveal(noAppr) {
    const R = this.R, owner = R.owner, p = this.pl(owner), lv = FR.LEVELS[p.bot] || { appr: 0 };
    let t = 900;
    this.L.items.forEach((it, k) => { this.later(() => { if (this.ph === 'reveal' && !R.o[k]) { R.o[k] = 1; this.changed(); } }, t); t += 650; });
    t += 300;
    if (!noAppr) this.L.items.forEach((it, k) => { if (FR.ITEMS[it.id].m && Math.random() < lv.appr) { this.later(() => this.appraise(owner, k), t); t += 1600; } });
    this.later(() => { this.R.o.fill(1); this.trySell(owner); }, t + 1300);
  }
  trySell(id) { if (this.ph !== 'reveal') return; if (this.canSell()) this.sell(id); else this.later(() => this.trySell(id), 400); }
  next() { if (this.ph === 'summary') this.nextRound(); }

  /* ---------- spelare som försvinner / kommer tillbaka ---------- */
  remove(id) {
    const p = this.pl(id); if (!p || p.bot) return;
    p.gone = true;
    if (this.ph === 'reveal' && this.R && this.R.owner === id) { this.R.o.fill(1); this.later(() => this.trySell(id), 1500); }
    this.changed();
  }
  rejoin(name, ch, newId) {
    const p = this.P.find(q => q.gone && !q.bot && q.name === name && q.ch === ch); if (!p) return false;
    const old = p.id; p.id = newId; p.gone = false;
    if (this.A) { if (this.A.leader === old) this.A.leader = newId; this.A.log.forEach(l => { if (l.p === old) l.p = newId; }); }
    if (this.R && this.R.owner === old) this.R.owner = newId;
    if (this.S && this.S.owner === old) this.S.owner = newId;
    this.changed(); return true;
  }

  /* ---------- det som skickas till alla ---------- */
  pub() {
    const now = Date.now(), s = {
      ph: this.ph, round: this.round, total: this.opt.rounds, seq: this.seq, gid: this.gid,
      P: this.P.map(p => ({ id: p.id, name: p.name, ch: p.ch, bot: p.bot, cash: p.cash, start: p.start, won: p.won, profit: p.profit, delta: p.delta, best: p.best, gone: p.gone }))
    };
    if (this.L && this.ph !== 'final') s.L = { th: this.L.th, sz: this.L.sz, items: this.L.items.map(it => ({ id: it.id, vis: it.vis ? 1 : 0, cover: it.cover })) };
    if (this.ph === 'peek') s.rem = Math.max(0, this.endsAt - now);
    if (this.A && this.ph !== 'final') {
      const A = this.A;
      s.A = { bid: A.bid, leader: A.leader, next: this.nextBid(), stage: A.stage, ended: !!A.ended, log: A.log.slice(0, 6), out: Object.keys(A.bots).filter(k => A.bots[k].out),
        rem: A.ended ? 0 : Math.max(0, this.window() * 1000 - (now - A.last)), win: this.window() * 1000 };
    }
    if (this.R && this.ph !== 'final') {
      const R = this.R;
      s.R = { owner: R.owner, paid: R.paid, appr: R.appr, o: R.o.slice(), a: R.a.slice(), b: R.b.slice(),
        v: R.o.map((o, k) => { const it = this.L.items[k]; return o && (!FR.ITEMS[it.id].m || R.a[k]) ? it.value : null; }),
        f: R.a.map((a, k) => a && this.L.items[k].fake ? 1 : 0) };
    }
    if (this.S && this.ph === 'summary') s.S = this.S;
    return s;
  }
}
