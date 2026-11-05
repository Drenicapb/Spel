/* Bucinca Kurragömma – Prop Hunt-likt spel uppifrån. Gömmarna förvandlar sig till saker i huset, sökarna letar.
   Huset, möblerna, förvandling, skott, ronder, poäng och datorspelare. Körs lokalt eller hos värden (60 steg/s). Fungerar i Node. */
(function (root) {
  'use strict';
  const DT = 1 / 60, CS = 64, PR = 17;
  const GW = 34, GH = 26, W = GW * CS, H = GH * CS;

  /* ================= HUSET ================= */
  // rum: 0 vägg, 1 vardagsrum, 2 kök, 3 sovrum, 4 badrum, 5 hall, 6 garage, 7 trädgård
  const ROOMS = [null,
    { n: 'Vardagsrummet', fl: 'wood' }, { n: 'Köket', fl: 'tile' }, { n: 'Sovrummet', fl: 'carpet' }, { n: 'Badrummet', fl: 'bath' },
    { n: 'Hallen', fl: 'wood2' }, { n: 'Garaget', fl: 'concrete' }, { n: 'Trädgården', fl: 'grass' }];
  function roomAt(x, y) {
    if (x <= 0 || y <= 0 || x >= GW - 1 || y >= GH - 1) return 0;
    if (x === 24) return (y === 5 || y === 6) ? 2 : (y === 20 || y === 21) ? 5 : 0;
    if (x >= 25) { if (y === 12) return (x === 28 || x === 29) ? 7 : 0; return y < 12 ? 6 : 7; }
    if (y === 11) return (x === 5 || x === 6) ? 1 : (x === 20 || x === 21) ? 2 : 0;
    if (y <= 10) { if (x === 14) return (y === 5 || y === 6) ? 1 : 0; return x < 14 ? 1 : 2; }
    if (x === 11) return (y === 19 || y === 20) ? 3 : 0;
    if (x <= 10) return 3;
    if (x >= 12 && x <= 17 && y === 17) return (x === 14 || x === 15) ? 4 : 0;
    if (x === 18 && y >= 12 && y <= 16) return 0;
    if (x >= 12 && x <= 17 && y >= 12 && y <= 16) return 4;
    return 5;
  }
  const grid = new Uint8Array(GW * GH);
  for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) grid[y * GW + x] = roomAt(x, y);
  const solidAt = (cx, cy) => cx < 0 || cy < 0 || cx >= GW || cy >= GH || grid[cy * GW + cx] === 0;
  const solidXY = (x, y) => solidAt(Math.floor(x / CS), Math.floor(y / CS));
  const roomOf = (x, y) => { const cx = Math.floor(x / CS), cy = Math.floor(y / CS); return cx < 0 || cy < 0 || cx >= GW || cy >= GH ? 0 : grid[cy * GW + cx]; };
  const ROOM_BOX = {};
  for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) { const r = grid[y * GW + x]; if (!r) continue; const b = ROOM_BOX[r] || (ROOM_BOX[r] = { x0: x, y0: y, x1: x, y1: y }); b.x0 = Math.min(b.x0, x); b.y0 = Math.min(b.y0, y); b.x1 = Math.max(b.x1, x); b.y1 = Math.max(b.y1, y); }
  const SPAWN_H = [1980, 1480], SPAWN_P = [1100, 1350];   // sökarna i trädgården, gömmarna i hallen

  /* ================= SAKER ================= */
  // pick = går att förvandla sig till. Runda saker har r, stora möbler är rektanglar (w×h).
  const ITEMS = {
    chair: { n: 'Stol', r: 18, pick: 1 }, stool: { n: 'Pall', r: 14, pick: 1 }, plant: { n: 'Krukväxt', r: 19, pick: 1 }, lamp: { n: 'Golvlampa', r: 15, pick: 1 },
    box: { n: 'Kartong', r: 20, pick: 1 }, barrel: { n: 'Tunna', r: 22, pick: 1 }, ball: { n: 'Boll', r: 13, pick: 1 }, teddy: { n: 'Nalle', r: 16, pick: 1 },
    bin: { n: 'Papperskorg', r: 15, pick: 1 }, bucket: { n: 'Hink', r: 15, pick: 1 }, tire: { n: 'Däck', r: 21, pick: 1 }, vase: { n: 'Vas', r: 13, pick: 1 },
    toilet: { n: 'Toalett', r: 20, pick: 1 }, armchair: { n: 'Fåtölj', r: 27, pick: 1 }, bush: { n: 'Buske', r: 27, pick: 1 }, stone: { n: 'Sten', r: 19, pick: 1 },
    pumpkin: { n: 'Pumpa', r: 17, pick: 1 }, cone: { n: 'Kon', r: 14, pick: 1 },
    sofa: { n: 'Soffa', w: 170, h: 64 }, table: { n: 'Bord', w: 130, h: 84 }, tv: { n: 'TV-bänk', w: 130, h: 30 }, shelf: { n: 'Bokhylla', w: 40, h: 150 },
    stove: { n: 'Spis', w: 64, h: 60 }, fridge: { n: 'Kylskåp', w: 70, h: 64 }, counter: { n: 'Bänk', w: 200, h: 54 }, bed: { n: 'Säng', w: 130, h: 190 },
    wardrobe: { n: 'Garderob', w: 160, h: 50 }, desk: { n: 'Skrivbord', w: 120, h: 60 }, tub: { n: 'Badkar', w: 160, h: 70 }, sink: { n: 'Handfat', w: 60, h: 44 },
    car: { n: 'Bil', w: 120, h: 220 }, bench: { n: 'Arbetsbänk', w: 50, h: 180 }, tramp: { n: 'Studsmatta', w: 150, h: 150, round: 1 }, rack: { n: 'Skohylla', w: 110, h: 34 }
  };
  const PICKABLE = Object.keys(ITEMS).filter(k => ITEMS[k].pick);
  const ANCHORS = [
    ['sofa', 300, 140], ['table', 300, 330], ['tv', 300, 650], ['shelf', 100, 420], ['armchair', 560, 150],
    ['stove', 1010, 104], ['fridge', 1110, 104], ['counter', 1360, 98], ['table', 1250, 400], ['chair', 1160, 400], ['chair', 1340, 400], ['chair', 1250, 330], ['chair', 1250, 470],
    ['bed', 200, 930], ['wardrobe', 500, 806], ['desk', 520, 1520], ['chair', 520, 1468],
    ['tub', 900, 820], ['toilet', 1100, 1030], ['sink', 810, 1050],
    ['rack', 900, 1220],
    ['car', 1780, 330], ['bench', 2060, 330],
    ['tramp', 1880, 1180]
  ];
  const SMALL = {
    1: [['plant', 2], ['lamp', 2], ['ball', 1], ['vase', 2], ['box', 1], ['bin', 1], ['teddy', 1], ['stool', 1], ['chair', 1]],
    2: [['stool', 2], ['bin', 1], ['plant', 1], ['box', 1], ['bucket', 1], ['vase', 1]],
    3: [['teddy', 2], ['ball', 2], ['lamp', 1], ['plant', 1], ['box', 2], ['bin', 1]],
    4: [['bin', 1], ['bucket', 1], ['plant', 1]],
    5: [['plant', 2], ['box', 2], ['ball', 1], ['stool', 1], ['lamp', 1], ['bin', 1], ['vase', 1]],
    6: [['barrel', 3], ['tire', 3], ['box', 2], ['bucket', 1], ['cone', 2], ['ball', 1]],
    7: [['bush', 4], ['stone', 3], ['ball', 1], ['bucket', 1], ['pumpkin', 3], ['barrel', 1], ['cone', 1]]
  };

  function RNG(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ t >>> 15, t | 1); t ^= t + Math.imul(t ^ t >>> 7, t | 61); return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
  const angDiff = (a, b) => { let d = b - a; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI; return d; };

  // möblerna för en rond: fasta + slumpade småsaker
  function makeFurniture(seed) {
    const r = RNG(seed), F = [];
    for (const [k, x, y] of ANCHORS) { const it = ITEMS[k]; F.push({ k, x, y, rot: it.pick ? Math.floor(r() * 8) * Math.PI / 4 : 0, w: it.w || 0, h: it.h || 0, r: it.r || 0 }); }
    const free = (x, y, rad) => {
      for (let a = 0; a < 8; a++) { const dx = Math.cos(a * Math.PI / 4) * (rad + 6), dy = Math.sin(a * Math.PI / 4) * (rad + 6); if (solidXY(x + dx, y + dy)) return false; }
      for (const f of F) {
        if (f.w) { const hw = f.w / 2 + rad + 14, hh = f.h / 2 + rad + 14; if (Math.abs(x - f.x) < hw && Math.abs(y - f.y) < hh) return false; }
        else if (Math.hypot(x - f.x, y - f.y) < f.r + rad + 16) return false;
      }
      if (Math.hypot(x - SPAWN_H[0], y - SPAWN_H[1]) < 120) return false;
      // inte i dörröppningar (rutor intill väggar på båda sidor)
      const cx = Math.floor(x / CS), cy = Math.floor(y / CS);
      if ((solidAt(cx - 1, cy) && solidAt(cx + 1, cy)) || (solidAt(cx, cy - 1) && solidAt(cx, cy + 1))) return false;
      return true;
    };
    for (const room in SMALL) {
      const B = ROOM_BOX[room];
      for (const [k, n] of SMALL[room]) for (let i = 0; i < n; i++) {
        const it = ITEMS[k];
        for (let t = 0; t < 60; t++) {
          const x = (B.x0 + r() * (B.x1 - B.x0 + 1)) * CS, y = (B.y0 + r() * (B.y1 - B.y0 + 1)) * CS;
          if (roomOf(x, y) !== +room || !free(x, y, it.r)) continue;
          F.push({ k, x: Math.round(x), y: Math.round(y), rot: Math.floor(r() * 8) * Math.PI / 4, w: 0, h: 0, r: it.r }); break;
        }
      }
    }
    return F;
  }

  /* stråle genom rutnätet: avstånd till första vägg */
  function rayWall(x, y, dx, dy, len) {
    let cx = Math.floor(x / CS), cy = Math.floor(y / CS);
    const sx = dx > 0 ? 1 : -1, sy = dy > 0 ? 1 : -1;
    const tdx = dx !== 0 ? Math.abs(CS / dx) : 1e9, tdy = dy !== 0 ? Math.abs(CS / dy) : 1e9;
    let tx = dx !== 0 ? ((dx > 0 ? (cx + 1) * CS - x : x - cx * CS) / Math.abs(dx)) : 1e9;
    let ty = dy !== 0 ? ((dy > 0 ? (cy + 1) * CS - y : y - cy * CS) / Math.abs(dy)) : 1e9;
    let t = 0;
    while (t < len) {
      if (tx < ty) { t = tx; tx += tdx; cx += sx; } else { t = ty; ty += tdy; cy += sy; }
      if (solidAt(cx, cy)) return Math.min(t, len);
    }
    return len;
  }
  const rayCircle = (x, y, ux, uy, cx, cy, R) => { const fx = x - cx, fy = y - cy, b = fx * ux + fy * uy, c = fx * fx + fy * fy - R * R; if (c < 0) return 0; const d = b * b - c; if (d < 0) return -1; const t = -b - Math.sqrt(d); return t >= 0 ? t : -1; };
  const rayRect = (x, y, ux, uy, f) => {
    const x0 = f.x - f.w / 2, x1 = f.x + f.w / 2, y0 = f.y - f.h / 2, y1 = f.y + f.h / 2;
    let tmin = -1e9, tmax = 1e9;
    if (Math.abs(ux) < 1e-9) { if (x < x0 || x > x1) return -1; } else { let a = (x0 - x) / ux, b = (x1 - x) / ux; if (a > b) [a, b] = [b, a]; tmin = Math.max(tmin, a); tmax = Math.min(tmax, b); }
    if (Math.abs(uy) < 1e-9) { if (y < y0 || y > y1) return -1; } else { let a = (y0 - y) / uy, b = (y1 - y) / uy; if (a > b) [a, b] = [b, a]; tmin = Math.max(tmin, a); tmax = Math.min(tmax, b); }
    if (tmax < Math.max(0, tmin)) return -1; return Math.max(0, tmin);
  };
  function canSee(x1, y1, x2, y2) { const dx = x2 - x1, dy = y2 - y1, d = Math.hypot(dx, dy); if (d < 1) return true; return rayWall(x1, y1, dx / d, dy / d, d) >= d - 1; }

  const T_HIDE = 25, T_SEEK = 150, T_END = 5, T_TAUNT = 30;
  const GUN = { dmg: 25, rate: .28, range: 560, spread: .03, miss: 4 };

  /* ================= MATCHEN ================= */
  // spelare: { id, name, ch, bot: nivå 1–10 eller -1 }
  class Game {
    constructor(players, opt = {}) {
      this.opt = Object.assign({ rounds: 4, seek: T_SEEK, convert: true }, opt);
      this.rng = RNG(opt.seed || ((Math.random() * 1e9) | 0));
      this.P = []; this.ev = []; this.evSeq = 0; this.round = 0; this.over = false; this.fv = 0; this.F = []; this.flow = {};
      for (const p of players) this.addPlayer(p, true);
      this.newRound();
    }
    emit(e, o) { this.ev.push(Object.assign({ id: ++this.evSeq, e }, o || {})); if (this.ev.length > 120) this.ev.shift(); }
    addPlayer(p, initial) {
      const q = { id: p.id, name: p.name || '', ch: p.ch | 0, bot: p.bot == null ? -1 : p.bot, role: 'h', x: SPAWN_H[0], y: SPAWN_H[1], vx: 0, vy: 0, a: 0, hp: 100, alive: false, out: false,
        dis: '', rot: 0, score: 0, catches: 0, hunts: 0, survived: 0, tauntT: 0, fireT: 0, movedT: 0, in: { mx: 0, my: 0, ax: 0, ay: 0, fire: 0 }, press: {}, ai: {} };
      this.P.push(q);
      if (!initial) { q.alive = false; q.role = 'h'; this.emit('join', { p: q.id }); }
      return q;
    }
    removePlayer(id) { const p = this.P.find(q => q.id === id); if (p) { p.alive = false; p.out = true; } }
    setInput(id, inp) {
      const p = this.P.find(q => q.id === id); if (!p || !inp) return;
      const n = v => (typeof v === 'number' && isFinite(v)) ? clamp(v, -1, 1) : 0;
      p.in = { mx: n(inp.mx), my: n(inp.my), ax: n(inp.ax), ay: n(inp.ay), fire: inp.fire ? 1 : 0 };
      for (const k of ['morph', 'turn', 'taunt', 'shoot']) if (inp[k]) p.press[k] = inp[k];
    }
    /* ---------- ronder ---------- */
    newRound() {
      this.round++;
      this.phase = 'hide'; this.t = 0; this.time = T_HIDE;
      this.F = makeFurniture(Math.floor(this.rng() * 1e9)); this.fv++;
      const act = this.P.filter(p => !p.out);
      // sökare: ungefär en av tre, de som sökt minst först
      const nH = Math.max(1, Math.round(act.length / 3));
      const order = act.slice().sort((a, b) => a.hunts - b.hunts || this.rng() - .5);
      const hunters = new Set(order.slice(0, Math.min(nH, act.length - 1 || 1)).map(p => p.id));
      let ih = 0, ip = 0;
      for (const p of act) {
        p.role = hunters.has(p.id) ? 'h' : 'p'; if (p.role === 'h') p.hunts++;
        p.alive = true; p.hp = 100; p.dis = ''; p.rot = 0; p.vx = p.vy = 0; p.tauntT = T_TAUNT * (.5 + this.rng() * .5); p.fireT = 0; p.ai = {}; p.press = {};
        const [bx, by] = p.role === 'h' ? SPAWN_H : SPAWN_P, k = p.role === 'h' ? ih++ : ip++;
        p.x = bx + (k % 3 - 1) * 46; p.y = by + (Math.floor(k / 3) - .5) * 46; p.a = -Math.PI / 2;
      }
      this.emit('round', { r: this.round, fv: this.fv });
    }
    endRound(win, why) {
      if (this.phase === 'end') return;
      this.phase = 'end'; this.t = 0; this.lastWin = win; this.lastWhy = why;
      for (const p of this.P) if (!p.out && p.alive && p.role === 'p') { p.score += 15; p.survived++; }
      this.emit('rend', { w: win, why });
      if (this.round >= this.opt.rounds) { this.over = true; const top = this.P.filter(p => !p.out).sort((a, b) => b.score - a.score)[0]; this.winner = top ? top.id : null; this.emit('end', { w: this.winner }); }
    }
    step() {
      const dt = DT; this.t += dt;
      if (this.phase === 'hide') { this.time -= dt; if (this.time <= 0) { this.phase = 'seek'; this.time = this.opt.seek; this.emit('seek'); } }
      else if (this.phase === 'seek') {
        this.time -= dt;
        if (Math.floor(this.time + dt) !== Math.floor(this.time) && Math.floor(this.time) % 15 === 0) for (const p of this.P) if (p.alive && p.role === 'p') p.score += 1;
        if (this.time <= 0) this.endRound('p', 'time');
      } else if (this.phase === 'end') { if (this.t > T_END && !this.over) this.newRound(); }
      for (const p of this.P) if (p.alive && p.bot >= 0) this.botThink(p, dt);
      for (const p of this.P) this.playerStep(p, dt);
      this.collidePlayers();
      if (this.phase === 'seek') {
        const props = this.P.filter(p => !p.out && p.role === 'p' && p.alive), hunters = this.P.filter(p => !p.out && p.role === 'h' && p.alive);
        if (!props.length) this.endRound('h', 'all');
        else if (!hunters.length) this.endRound('p', 'hunters');
      }
    }
    radius(p) { return p.dis ? ITEMS[p.dis].r : PR; }
    playerStep(p, dt) {
      if (!p.alive) return;
      const I = p.in, pr = p.press; p.press = {};
      const frozen = p.role === 'h' && this.phase === 'hide';
      let mx = I.mx, my = I.my; const ml = Math.hypot(mx, my); if (ml > 1) { mx /= ml; my /= ml; }
      const sp = frozen ? 0 : p.role === 'h' ? 215 : p.dis ? 165 : 205;
      p.vx = mx * sp; p.vy = my * sp;
      const ox = p.x, oy = p.y;
      this.move(p, p.vx * dt, p.vy * dt);
      const moved = Math.hypot(p.x - ox, p.y - oy) / dt;
      p.movedT = moved > 30 ? .8 : Math.max(0, p.movedT - dt);
      if (Math.hypot(I.ax, I.ay) > .2) p.a = Math.atan2(I.ay, I.ax); else if (ml > .2 && !p.dis) p.a = Math.atan2(my, mx);
      if (p.role === 'p') {
        if (pr.morph) this.morph(p);
        if (pr.turn && p.dis) { p.rot = (p.rot + Math.PI / 4) % (Math.PI * 2); }
        if (this.phase === 'seek') {
          p.tauntT -= dt;
          if (pr.taunt && p.tauntT < T_TAUNT - 8) this.taunt(p, false);
          else if (p.tauntT <= 0) this.taunt(p, true);
        }
      } else {
        p.fireT -= dt;
        if (!frozen && this.phase === 'seek') {
          if (pr.shoot && typeof pr.shoot === 'object') { p.a = Math.atan2(pr.shoot.y - p.y, pr.shoot.x - p.x); if (p.fireT <= 0) this.fire(p); }
          if (I.fire && p.fireT <= 0) this.fire(p);
        }
      }
    }
    nearestPick(p) {
      let best = null, bd = 110;
      for (const f of this.F) { if (!ITEMS[f.k].pick) continue; const d = Math.hypot(f.x - p.x, f.y - p.y) - f.r; if (d < bd) { bd = d; best = f; } }
      return best;
    }
    morph(p) {
      if (p.role !== 'p' || !p.alive || this.phase === 'end') return;
      const f = this.nearestPick(p); if (!f) return;
      if (p.dis === f.k) { p.rot = f.rot; return; }
      p.dis = f.k; p.rot = f.rot;
      this.move(p, 0, 0);
      this.emit('morph', { p: p.id, k: f.k, x: Math.round(p.x), y: Math.round(p.y) });
    }
    taunt(p, forced) {
      p.tauntT = T_TAUNT; if (!forced) p.score += 2;
      this.emit('taunt', { p: p.id, x: Math.round(p.x), y: Math.round(p.y), f: forced ? 1 : 0 });
    }
    // rörelse med kollision mot väggar och möbler
    move(p, dx, dy) {
      const R = this.radius(p);
      const blocked = (x, y) => { for (const [ox, oy] of [[-1, -1], [1, -1], [-1, 1], [1, 1], [0, -1.2], [0, 1.2], [-1.2, 0], [1.2, 0]]) if (solidXY(x + ox * R * .8, y + oy * R * .8)) return true; return false; };
      if (!blocked(p.x + dx, p.y)) p.x += dx;
      if (!blocked(p.x, p.y + dy)) p.y += dy;
      for (const f of this.F) {
        if (f.w) {
          const qx = clamp(p.x, f.x - f.w / 2, f.x + f.w / 2), qy = clamp(p.y, f.y - f.h / 2, f.y + f.h / 2);
          const ddx = p.x - qx, ddy = p.y - qy, d = Math.hypot(ddx, ddy);
          if (f.k === 'tramp') { const d2 = Math.hypot(p.x - f.x, p.y - f.y), rr = f.w / 2 + R; if (d2 < rr && d2 > .01) { const nx = (p.x - f.x) / d2, ny = (p.y - f.y) / d2; const tx = f.x + nx * rr, ty = f.y + ny * rr; if (!blocked(tx, ty)) { p.x = tx; p.y = ty; } } continue; }
          if (d < R) {
            let nx, ny;
            if (d > .01) { nx = ddx / d; ny = ddy / d; }
            else { const l = p.x - (f.x - f.w / 2), rgt = f.x + f.w / 2 - p.x, t = p.y - (f.y - f.h / 2), b = f.y + f.h / 2 - p.y, m = Math.min(l, rgt, t, b); nx = m === l ? -1 : m === rgt ? 1 : 0; ny = m === t ? -1 : m === b ? 1 : 0; }
            const tx = qx + nx * R, ty = qy + ny * R; if (!blocked(tx, ty)) { p.x = tx; p.y = ty; }
          }
        } else {
          const d = Math.hypot(p.x - f.x, p.y - f.y), rr = f.r + R;
          if (d < rr && d > .01) { const nx = (p.x - f.x) / d, ny = (p.y - f.y) / d, tx = f.x + nx * rr, ty = f.y + ny * rr; if (!blocked(tx, ty)) { p.x = tx; p.y = ty; } }
        }
      }
    }
    collidePlayers() {
      const A = this.P.filter(p => p.alive);
      for (let i = 0; i < A.length; i++) for (let j = i + 1; j < A.length; j++) {
        const a = A[i], b = A[j], dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy) || .01, R = this.radius(a) + this.radius(b);
        if (d < R) { const k = (R - d) / 2, nx = dx / d, ny = dy / d; this.move(a, -nx * k, -ny * k); this.move(b, nx * k, ny * k); }
      }
    }
    fire(p) {
      p.fireT = GUN.rate;
      const a = p.a + (this.rng() - .5) * 2 * GUN.spread, ux = Math.cos(a), uy = Math.sin(a);
      const sx = p.x + ux * (PR + 4), sy = p.y + uy * (PR + 4);
      let len = rayWall(sx, sy, ux, uy, GUN.range), hit = null, hf = null;
      for (const f of this.F) { const t = f.w ? (f.k === 'tramp' ? rayCircle(sx, sy, ux, uy, f.x, f.y, f.w / 2) : rayRect(sx, sy, ux, uy, f)) : rayCircle(sx, sy, ux, uy, f.x, f.y, f.r); if (t >= 0 && t < len) { len = t; hf = f; hit = null; } }
      for (const q of this.P) { if (!q.alive || q === p || q.role === 'h') continue; const t = rayCircle(sx, sy, ux, uy, q.x, q.y, this.radius(q)); if (t >= 0 && t < len) { len = t; hit = q; hf = null; } }
      const ex = Math.round(sx + ux * len), ey = Math.round(sy + uy * len);
      this.emit('shot', { p: p.id, x: Math.round(sx), y: Math.round(sy), ex, ey, h: hit ? 1 : hf ? 2 : 0 });
      if (hit) {
        hit.hp -= GUN.dmg; hit.ai.hurt = 1.2; hit.ai.hurtBy = p.id;
        this.emit('hit', { p: hit.id, by: p.id, x: Math.round(hit.x), y: Math.round(hit.y), hp: Math.max(0, hit.hp) });
        if (hit.hp <= 0) this.catchProp(hit, p);
      } else if (hf && ITEMS[hf.k]) {
        // fel – det var en riktig sak: sökaren tappar lite liv
        p.hp -= GUN.miss;
        this.emit('miss', { p: p.id, x: ex, y: ey, k: hf.k, hp: Math.max(0, p.hp) });
        if (p.hp <= 0) { p.alive = false; p.hp = 0; this.emit('tired', { p: p.id, x: Math.round(p.x), y: Math.round(p.y) }); }
      }
    }
    catchProp(q, by) {
      by.score += 10; by.catches++;
      this.emit('caught', { p: q.id, by: by.id, x: Math.round(q.x), y: Math.round(q.y), k: q.dis });
      if (this.opt.convert) { q.role = 'h'; q.dis = ''; q.hp = 100; q.fireT = 1; q.ai = {}; }   // fångad: blir sökare
      else { q.alive = false; }
    }

    /* ================= DATORSPELARE ================= */
    flowTo(gx, gy) {
      const key = gy * GW + gx; if (this.flow[key]) return this.flow[key];
      const d = new Int16Array(GW * GH).fill(-1), q = [key]; d[key] = 0;
      for (let h = 0; h < q.length; h++) {
        const k = q[h], x = k % GW, y = (k / GW) | 0;
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = x + dx, ny = y + dy; if (solidAt(nx, ny)) continue; const nk = ny * GW + nx; if (d[nk] >= 0) continue; d[nk] = d[k] + 1; q.push(nk); }
      }
      return this.flow[key] = d;
    }
    pathDir(p, tx, ty) {
      const gx = clamp(Math.floor(tx / CS), 0, GW - 1), gy = clamp(Math.floor(ty / CS), 0, GH - 1);
      const cx = Math.floor(p.x / CS), cy = Math.floor(p.y / CS);
      if ((cx === gx && cy === gy) || solidAt(gx, gy)) return [tx - p.x, ty - p.y];
      const d = this.flowTo(gx, gy);
      let best = null, bv = d[cy * GW + cx] >= 0 ? d[cy * GW + cx] : 1e9;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const nx = cx + dx, ny = cy + dy; if (solidAt(nx, ny)) continue; const v = d[ny * GW + nx]; if (v >= 0 && v < bv) { bv = v; best = [nx, ny]; } }
      if (!best) return [tx - p.x, ty - p.y];
      return [(best[0] + .5) * CS - p.x, (best[1] + .5) * CS - p.y];
    }
    randomSpot(room) {
      const rooms = room ? [room] : [1, 2, 3, 4, 5, 6, 7];
      for (let i = 0; i < 40; i++) {
        const rm = rooms[Math.floor(this.rng() * rooms.length)], B = ROOM_BOX[rm];
        const x = (B.x0 + .5 + this.rng() * (B.x1 - B.x0)) * CS, y = (B.y0 + .5 + this.rng() * (B.y1 - B.y0)) * CS;
        if (roomOf(x, y) === rm && !solidXY(x, y)) return [x, y];
      }
      return [SPAWN_P[0], SPAWN_P[1]];
    }
    botThink(p, dt) {
      const A = p.ai, L = clamp(p.bot, 1, 10), r = this.rng;
      let mx = 0, my = 0, ax = Math.cos(p.a), ay = Math.sin(p.a), fire = 0;
      const go = (tx, ty, stopAt) => { const d = Math.hypot(tx - p.x, ty - p.y); if (d < (stopAt || 24)) return true; const v = this.pathDir(p, tx, ty), l = Math.hypot(v[0], v[1]) || 1; mx = v[0] / l; my = v[1] / l; return false; };
      // fast? kliv åt sidan
      const unstick = () => {
        if (A.dodgeT > 0) { A.dodgeT -= dt; const sx = -my * A.dodge, sy = mx * A.dodge; mx = mx * .3 + sx; my = my * .3 + sy; return; }
        if (Math.hypot(mx, my) > .3) { A.stuckT = Math.hypot(p.x - (A.lx || 0), p.y - (A.ly || 0)) < 1 ? (A.stuckT || 0) + dt : 0; if (A.stuckT > .5) { A.stuckT = 0; A.dodgeT = .5; A.dodge = r() < .5 ? 1 : -1; } }
        A.lx = p.x; A.ly = p.y;
      };
      if (p.role === 'p') {
        if (!A.goal) {
          // välj en sak att likna, gärna långt från sökarna, och en plats nära den
          const cands = this.F.filter(f => ITEMS[f.k].pick && Math.hypot(f.x - SPAWN_H[0], f.y - SPAWN_H[1]) > 350);
          const f = cands[Math.floor(r() * cands.length)] || this.F[0];
          let spot = null;
          for (let i = 0; i < 20 && !spot; i++) { const a = r() * 7, d = f.r + ITEMS[f.k].r + 10 + r() * 50, x = f.x + Math.cos(a) * d, y = f.y + Math.sin(a) * d; if (!solidXY(x, y) && roomOf(x, y) && !this.F.some(o => o !== f && (o.w ? Math.abs(x - o.x) < o.w / 2 + 25 && Math.abs(y - o.y) < o.h / 2 + 25 : Math.hypot(x - o.x, y - o.y) < o.r + 25))) spot = [x, y]; }
          A.goal = spot || [f.x + 50, f.y]; A.src = f; A.settled = false;
        }
        if (A.hurt > 0) { A.hurt -= dt; if (!A.flee) { A.flee = this.randomSpot(); A.settled = false; } }
        if (A.flee) { if (go(A.flee[0], A.flee[1], 40) || A.hurt <= -2) { A.flee = null; A.settled = false; this.morph(p); } }
        else if (!A.settled) {
          const there = go(A.goal[0], A.goal[1], 20);
          if (there || (this.phase === 'seek' && this.t > 3 && !p.dis)) { mx = my = 0; if (A.src && Math.hypot(A.src.x - p.x, A.src.y - p.y) < 110) { p.dis = A.src.k; p.rot = A.src.rot; this.emit('morph', { p: p.id, k: p.dis, x: Math.round(p.x), y: Math.round(p.y) }); } else this.morph(p); A.settled = true; }
        }
        if (this.phase === 'seek' && p.tauntT < T_TAUNT - 8 && r() < .002 * (11 - L)) p.press.taunt = 1;
        unstick();
      } else {
        if (this.phase !== 'seek') { p.in = { mx: 0, my: 0, ax, ay, fire: 0 }; return; }
        A.think = (A.think || 0) - dt;
        // hörde ett läte: gå dit
        const lastTaunt = this.ev.length && this.ev.filter(e => e.e === 'taunt' && e.id > (A.heard || 0)).pop();
        if (lastTaunt) { A.heard = lastTaunt.id; if (Math.hypot(lastTaunt.x - p.x, lastTaunt.y - p.y) < 1200) A.goal = [lastTaunt.x, lastTaunt.y]; }
        if (A.target) {
          const T = A.target;
          if (T.dead || (T.pl && (!T.pl.alive || T.pl.role !== 'p'))) A.target = null;
          else {
            const tx = T.pl ? T.pl.x : T.f.x, ty = T.pl ? T.pl.y : T.f.y, d = Math.hypot(tx - p.x, ty - p.y);
            if (d > 380) go(tx, ty); else { mx = my = 0; }
            const aim = Math.atan2(ty - p.y, tx - p.x) + (r() - .5) * Math.max(.04, .3 - L * .025);
            ax = Math.cos(aim); ay = Math.sin(aim);
            if (d < GUN.range * .9 && Math.abs(angDiff(p.a, aim)) < .25) { fire = 1; T.shots = (T.shots || 0) + dt / GUN.rate; }
            if (T.shots > T.max) A.target = null;
          }
        } else {
          if (!A.goal || go(A.goal[0], A.goal[1], 60)) A.goal = this.randomSpot();
          if (A.think <= 0) {
            A.think = 1.4 - L * .08 + r() * .8;
            // vad syns i närheten?
            const vis = [];
            for (const f of this.F) if (ITEMS[f.k].pick && Math.hypot(f.x - p.x, f.y - p.y) < 450 && canSee(p.x, p.y, f.x, f.y)) vis.push({ f });
            const props = this.P.filter(q => q.alive && q.role === 'p' && Math.hypot(q.x - p.x, q.y - p.y) < 450 && canSee(p.x, p.y, q.x, q.y));
            const plain = props.find(q => !q.dis || q.movedT > 0);
            if (plain && r() < .5 + L * .05) A.target = { pl: plain, max: 8 };
            else if ((vis.length || props.length) && p.hp > 25 && r() < .4) {
              // gissa: en riktig sak eller en gömmare – en duktig sökare gissar lite oftare rätt
              const wP = .6 + L * .1, tot = vis.length + props.length * wP;
              let k = r() * tot;
              if (k < props.length * wP) A.target = { pl: props[Math.floor(k / wP)], max: 3 + Math.floor(L / 3) };
              else A.target = { f: vis[Math.floor(r() * vis.length)].f, max: 1 + Math.floor(r() * 2) };
            }
          }
          const ml = Math.hypot(mx, my); if (ml > 0 && !A.target) { ax = mx / ml; ay = my / ml; }
        }
        unstick();
      }
      p.in = { mx, my, ax, ay, fire };
    }

    /* läge för ritning och nätverk */
    snap(evAfter) {
      const R = Math.round;
      return {
        ph: this.phase, tm: Math.max(0, Math.ceil(this.time)), rd: this.round, rds: this.opt.rounds, ov: this.over ? 1 : 0, w: this.winner, lw: this.lastWin, why: this.lastWhy, fv: this.fv,
        P: this.P.map(p => ({ id: p.id, n: p.name, ch: p.ch, ro: p.role, x: R(p.x), y: R(p.y), a: Math.round(p.a * 100) / 100, hp: Math.max(0, R(p.hp)), al: p.alive ? 1 : 0, out: p.out ? 1 : 0, bot: p.bot,
          d: p.dis, rt: Math.round(p.rot * 100) / 100, sc: p.score, c: p.catches, tt: Math.max(0, Math.ceil(p.tauntT)), mv: p.movedT > 0 ? 1 : 0 })),
        ev: evAfter == null ? this.ev.slice(-40) : this.ev.filter(e => e.id > evAfter)
      };
    }
    furniture() { return { fv: this.fv, F: this.F.map(f => [f.k, Math.round(f.x), Math.round(f.y), Math.round(f.rot * 100) / 100]) }; }
    result() { return this.P.map(p => ({ id: p.id, name: p.name, ch: p.ch, bot: p.bot, score: p.score, catches: p.catches, survived: p.survived, out: p.out })); }
  }
  // klienter: bygg möbellistan från värdens kompakta form
  const unpackF = F => F.map(([k, x, y, rot]) => { const it = ITEMS[k] || ITEMS.box; return { k, x, y, rot, w: it.w || 0, h: it.h || 0, r: it.r || 0 }; });

  const PROP = { DT, CS, PR, GW, GH, W, H, grid, ROOMS, ROOM_BOX, ITEMS, PICKABLE, GUN, T_HIDE, T_SEEK, T_TAUNT, SPAWN_H, SPAWN_P, solidAt, solidXY, roomOf, rayWall, canSee, makeFurniture, unpackF, Game, RNG };
  if (typeof module !== 'undefined' && module.exports) module.exports = PROP; else root.PROP = PROP;
})(this);
