/* Bucinca Förrådsfejden – sakerna, förråden och slumpen. Används av både värden (game.js) och 3D-vyn (v3.js). */
'use strict';
const rnd = (a, b) => a + Math.random() * (b - a);
const ri = (a, b) => Math.floor(rnd(a, b + 1));
function wpick(arr, wf) { let t = 0; const w = arr.map(x => { const v = wf(x); t += v; return v; }); let r = Math.random() * t; for (let i = 0; i < arr.length; i++) { r -= w[i]; if (r <= 0) return arr[i]; } return arr[arr.length - 1]; }
function gauss() { let u = 0, v = 0; while (!u) u = Math.random(); while (!v) v = Math.random(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
function shuffle(a) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
const r10 = v => v < 100 ? Math.round(v / 5) * 5 : v < 1000 ? Math.round(v / 10) * 10 : Math.round(v / 50) * 50;
const kr = n => String(Math.round(n)).replace('-', '−').replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' kr';
const sgn = n => (n >= 0 ? '+' : '−') + kr(Math.abs(n));
const tierOf = v => v >= 20000 ? 'jack' : v >= 5000 ? 'hi' : v >= 1000 ? 'mid' : v >= 200 ? 'lo' : 'junk';

const FR = (() => {
  const RW = { skrap: 10, vanlig: 6, bra: 3, sallsynt: 1, legend: .25 };
  // e, namn, min, max, sällsynthet, taggar, mystisk (måste värderas), 3D-modell
  const I = (e, n, min, max, r, t, m, k) => ({ e, n, min, max, r, t: t ? t.split(' ') : [], m: !!m, k: k || 'small' });
  const ITEMS = [
    I('🛏️', 'Fläckig madrass', 0, 40, 'skrap', '', 0, 'mattress'), I('📰', 'Låda med gamla tidningar', 0, 30, 'skrap', '', 0, 'openbox'),
    I('🧦', 'Påse med omaka strumpor', 0, 15, 'skrap', '', 0, 'bagLight'), I('🪑', 'Trasig köksstol', 10, 80, 'skrap', '', 0, 'brokenchair'),
    I('🧸', 'Nött gosedjur', 5, 40, 'skrap'), I('👕', 'Säck med gamla kläder', 20, 200, 'skrap', '', 0, 'bagLight'),
    I('📺', 'Gammal tjock-TV', 0, 150, 'skrap', '', 0, 'tv'), I('🖼️', 'Massproducerad tavla', 20, 120, 'skrap', '', 0, 'painting'),
    I('🍽️', 'Kantstött porslin', 20, 200, 'skrap', '', 0, 'openbox'), I('💿', 'Låda med CD-skivor', 20, 300, 'skrap', '', 0, 'openbox'),
    I('🪴', 'Död krukväxt', 0, 10, 'skrap', '', 0, 'plant'), I('🎄', 'Plastgran och julpynt', 30, 250, 'skrap', '', 0, 'xmas'),
    I('🧹', 'Städgrejer', 10, 80, 'skrap', '', 0, 'broom'), I('🪣', 'Halvfulla färgburkar', 0, 60, 'skrap', '', 0, 'paint'),
    I('🥾', 'Slitna kängor', 10, 120, 'skrap'),
    I('🚲', 'Cykel', 300, 3000, 'vanlig', 'garage sport', 0, 'bike'), I('🎮', 'Spelkonsol', 400, 3500, 'vanlig', 'student elektronik'),
    I('💻', 'Laptop', 300, 7000, 'vanlig', 'kontor elektronik student', 0, 'laptop'), I('🔧', 'Verktygslåda', 300, 3000, 'vanlig', 'garage', 0, 'toolbox'),
    I('🪚', 'Motorsåg', 500, 4000, 'vanlig', 'garage', 0, 'chainsaw'), I('🧰', 'Kompressor', 400, 3500, 'vanlig', 'garage', 0, 'compressor'),
    I('🛞', 'Vinterdäck på fälg', 800, 4500, 'vanlig', 'garage', 0, 'tires'), I('🎿', 'Skidor och pjäxor', 200, 3000, 'vanlig', 'sport', 0, 'skis'),
    I('🏒', 'Hockeyutrustning', 300, 2500, 'vanlig', 'sport', 0, 'hockey'), I('🏆', 'Pokalsamling', 50, 1500, 'vanlig', 'sport', 0, 'trophies'),
    I('🖥️', 'Datorskärm', 300, 2500, 'vanlig', 'kontor elektronik', 0, 'monitor'), I('🗄️', 'Arkivskåp', 100, 1200, 'vanlig', 'kontor', 0, 'cabinet'),
    I('🖨️', 'Kontorsskrivare', 0, 600, 'vanlig', 'kontor', 0, 'printer'), I('🎧', 'Hörlurar', 200, 3500, 'vanlig', 'elektronik musik'),
    I('🛋️', 'Skinnsoffa', 500, 9000, 'vanlig', 'dodsbo', 0, 'sofa'), I('📚', 'Bokhylla full med böcker', 100, 2500, 'vanlig', 'dodsbo antik', 0, 'shelf'),
    I('🧥', 'Märkesjacka', 300, 5000, 'vanlig', 'student dodsbo'), I('🎲', 'Hög med brädspel', 50, 1500, 'vanlig', 'student', 0, 'games'),
    I('📼', 'VHS-samling', 50, 900, 'vanlig', 'student dodsbo', 0, 'openbox'), I('📻', 'Retroradio', 100, 3000, 'vanlig', 'antik dodsbo', 0, 'radio'),
    I('🧳', 'Vintageresväska', 200, 6000, 'vanlig', 'dodsbo antik', 0, 'suitcase'),
    I('🎸', 'Elgitarr', 800, 14000, 'bra', 'musik', 0, 'guitar'), I('🥁', 'Trumset', 1500, 10000, 'bra', 'musik', 0, 'drums'),
    I('🎹', 'Synthesizer', 1000, 18000, 'bra', 'musik', 0, 'synth'), I('🎙️', 'Studiomikrofon', 500, 10000, 'bra', 'musik', 0, 'mic'),
    I('📷', 'Systemkamera', 800, 14000, 'bra', 'elektronik antik'), I('🚁', 'Drönare', 800, 9000, 'bra', 'elektronik student'),
    I('⛳', 'Golfbag med klubbor', 500, 9000, 'bra', 'sport', 0, 'golfbag'), I('👟', 'Limiterade sneakers', 500, 9000, 'bra', 'student sport'),
    I('💺', 'Designstol', 500, 16000, 'bra', 'antik dodsbo kontor', 0, 'designchair'), I('🕰️', 'Golvur', 200, 7000, 'bra', 'antik dodsbo', 0, 'clock'),
    I('🦊', 'Pälskappa', 500, 15000, 'bra', 'dodsbo'), I('🚗', 'Veteranbilsdelar', 500, 16000, 'bra', 'garage', 0, 'parts'),
    I('🪖', 'Gammal militärhjälm', 200, 5000, 'bra', 'antik'), I('🏺', 'Porslinsvas', 100, 25000, 'bra', 'antik dodsbo', 1, 'vase'),
    I('🃏', 'Pärm med samlarkort', 100, 50000, 'bra', 'student', 1), I('🪙', 'Myntsamling', 200, 40000, 'bra', 'antik dodsbo', 1),
    I('⌚', 'Armbandsur', 200, 80000, 'bra', 'dodsbo antik hemligt', 1), I('💍', 'Ring i ett skrin', 100, 60000, 'bra', 'dodsbo hemligt', 1, 'chest'),
    I('🎷', 'Saxofon', 2000, 25000, 'sallsynt', 'musik'), I('🛵', 'Moped', 3000, 22000, 'sallsynt', 'garage', 0, 'moped'),
    I('🏎️', 'Gokart', 2000, 15000, 'sallsynt', 'garage sport', 0, 'gokart'), I('⚔️', 'Antik sabel', 1000, 30000, 'sallsynt', 'antik'),
    I('🎨', 'Oljemålning', 100, 150000, 'sallsynt', 'antik dodsbo', 1, 'paintingFancy'), I('🗺️', 'Gammal karta', 100, 30000, 'sallsynt', 'antik', 1),
    I('🍾', 'Vinsamling', 500, 50000, 'sallsynt', 'dodsbo hemligt', 1, 'wine'), I('💌', 'Kuvert med kontanter', 500, 25000, 'sallsynt', 'hemligt dodsbo'),
    I('🥇', 'Gammal OS-medalj', 5000, 200000, 'legend', 'sport hemligt', 1), I('💎', 'Smyckeskrin', 300, 120000, 'legend', 'hemligt dodsbo', 1, 'chest'),
    I('🔐', 'Låst kassaskåp', 0, 100000, 'legend', 'hemligt kontor', 1, 'safe'), I('🏍️', 'Veteranmotorcykel', 15000, 120000, 'legend', 'garage', 0, 'motorcycle')
  ];
  ITEMS.forEach((it, i) => it.id = i);
  const JUNK = ITEMS.filter(i => i.r === 'skrap'), GOODS = ITEMS.filter(i => i.r !== 'skrap');
  const THEMES = [
    { n: 'Garage i Bromma', e: '🔧', tags: ['garage'], junk: .42, vis: 1 },
    { n: 'Studentkorridor i Lund', e: '🎓', tags: ['student', 'elektronik'], junk: .5, vis: 1 },
    { n: 'Dödsbo i Djursholm', e: '🕯️', tags: ['dodsbo', 'antik'], junk: .48, vis: 1 },
    { n: 'Replokal i Göteborg', e: '🎸', tags: ['musik', 'elektronik'], junk: .42, vis: 1 },
    { n: 'Sportfantastens förråd', e: '🏅', tags: ['sport'], junk: .42, vis: 1 },
    { n: 'Antikhandlarens lager', e: '🏺', tags: ['antik'], junk: .38, vis: 1 },
    { n: 'Konkursat kontor', e: '💼', tags: ['kontor', 'elektronik'], junk: .45, vis: 1 },
    { n: 'Mystiskt förråd – ingen info', e: '❓', tags: ['hemligt'], junk: .55, vis: .55 }
  ];
  const SIZES = [{ n: 'Litet', k: 6, fee: 100, w: 3 }, { n: 'Mellanstort', k: 9, fee: 200, w: 4 }, { n: 'Stort', k: 12, fee: 350, w: 3 }];
  const COVERS = [['Kartong', 'cardboard'], ['Svart sopsäck', 'bag'], ['Under presenning', 'tarp'], ['Låst låda', 'crate'], ['Plastback', 'bin'], ['Flyttlåda', 'bigbox'], ['Bakom madrassen', 'mattress']];
  const LEVELS = { latt: { n: 'Lätt', sd: .45, ag: [.45, .98], appr: .45 }, medel: { n: 'Medel', sd: .22, ag: [.55, .78], appr: .8 }, svar: { n: 'Svår', sd: .1, ag: [.62, .76], appr: 1 } };
  const C = { APPR: 150, BULK: .4, START_BID: 100, BID_WINDOW: 4, FIRST_WINDOW: 8, PEEK: 15 };
  const inc = b => b < 1000 ? 100 : b < 5000 ? 250 : b < 20000 ? 500 : 1000;

  function drawValue(it) { const r = Math.random(); let v; if (it.min <= 0) v = it.max * Math.pow(r, 2.4); else v = it.min * Math.pow(it.max / it.min, Math.pow(r, 1.7)); return r10(v); }
  function makeItem(it) { let value = drawValue(it), fake = false; if (it.m && Math.random() < .25) { fake = true; value = r10(Math.max(20, it.min * .3)); } return { id: it.id, value, fake }; }
  function slotTemplate(th) {
    if (Math.random() < th.junk) return JUNK[Math.floor(Math.random() * JUNK.length)];
    return wpick(GOODS, it => RW[it.r] * (it.t.some(t => th.tags.includes(t)) ? 4 : (it.t.includes('hemligt') ? .1 : .35)));
  }
  // förrådet: th/sz = index, items = [{id, value, fake, vis, cover}]
  function genLocker() {
    const th = Math.floor(Math.random() * THEMES.length), szo = wpick(SIZES, s => s.w), sz = SIZES.indexOf(szo), theme = THEMES[th];
    const items = []; for (let i = 0; i < szo.k; i++) items.push(makeItem(slotTemplate(theme)));
    shuffle(items);
    const nVis = Math.max(1, Math.round(szo.k * rnd(.3, .45) * theme.vis));
    items.forEach((it, i) => { it.vis = i < nVis; it.cover = Math.floor(Math.random() * COVERS.length); });
    shuffle(items);
    return { th, sz, items };
  }
  // förväntade värden för datorns gissningar
  const ITEMEXP = [], THEMEEXP = [];
  ITEMS.forEach(it => { let s = 0; for (let i = 0; i < 300; i++) s += makeItem(it).value; ITEMEXP[it.id] = s / 300; });
  THEMES.forEach((th, i) => { let s = 0; for (let j = 0; j < 2500; j++) s += ITEMEXP[slotTemplate(th).id]; THEMEEXP[i] = s / 2500; });

  return { ITEMS, THEMES, SIZES, COVERS, LEVELS, C, inc, genLocker, ITEMEXP, THEMEEXP };
})();
