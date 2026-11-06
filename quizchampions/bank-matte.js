/* Quiz Champions – matte & logik (genereras med fröad slump så att frågorna är desamma varje gång) */
(function () {
  const { q, rand } = window.QKB;
  const B = window.QK_BANK;
  const ri = (a, b) => a + Math.floor(rand() * (b - a + 1));
  const seen = new Set(B.filter(x => x.c === 'matte').map(x => x.q));
  const fmt = n => (Math.round(n * 1000) / 1000).toLocaleString('sv-SE', { useGrouping: n >= 10000 || n <= -10000, maximumFractionDigits: 3 }).replace('-', '−');
  const near = (ans, steps, allowNeg) => {
    const out = new Set(); let g = 0;
    while (out.size < 3 && g++ < 200) { const v = ans + steps[Math.floor(rand() * steps.length)]; if (v !== ans && (allowNeg || v >= 0)) out.add(Math.round(v * 1000) / 1000); }
    return [...out];
  };
  const add = (a, d, g, text, ok, wrong) => {
    if (seen.has(text)) return false;
    const w = [...new Set(wrong.map(String))].filter(x => x !== String(ok)).slice(0, 3);
    if (w.length < 3) return false;
    seen.add(text); B.push({ c: 'matte', a, d, g, q: text, o: [String(ok), ...w] }); return true;
  };
  const addN = (a, d, g, text, ans, steps = [1, 2, 3, -1, -2, -3, 10, -10], allowNeg = false, suffix = '') =>
    add(a, d, g, text, fmt(ans) + suffix, near(ans, steps, allowNeg).map(v => fmt(v) + suffix));
  const loop = (n, fn) => { let made = 0, guard = 0; while (made < n && guard++ < n * 20) if (fn()) made++; };

  // ── Barn ──
  loop(45, () => { const a = ri(1, 10), b = ri(1, 10); return addN('0', 1, 'plus', `Vad är ${a} + ${b}?`, a + b, [1, 2, -1, -2, 3]); });
  loop(35, () => { const a = ri(5, 20), b = ri(1, a - 1); return addN('0', 1, 'minus', `Vad är ${a} − ${b}?`, a - b, [1, 2, -1, -2, 3]); });
  const EM = ['🍎', '⭐', '🐟', '🎈', '🐞', '🍓', '🚗', '🌸', '🐣', '⚽'];
  loop(15, () => { const e = EM[ri(0, EM.length - 1)], n = ri(3, 9); return addN('0', 1, 'rakna', `Hur många ${e} ser du? ${e.repeat(n)}`, n, [1, -1, 2, -2]); });
  loop(10, () => { const n = ri(2, 15); return addN('01', 1, 'dubbel', `Vad är dubbelt så mycket som ${n}?`, n * 2, [1, -1, 2, -2, n, -n + 1]); });
  loop(8, () => { const n = ri(2, 20) * 2; return addN('01', 1, 'halv', `Vad är hälften av ${n}?`, n / 2, [1, -1, 2, -2, n / 2]); });
  loop(12, () => { const h = ri(2, 10) * 5, p = ri(3, h - 2); return addN('01', 1, 'pengar', `Du har ${h} kr och köper något för ${p} kr. Hur mycket har du kvar?`, h - p, [1, -1, 2, -2, 5, -5, 10]); });
  loop(12, () => { const n = ri(11, 99), t = `Är ${n} ett jämnt eller udda tal?`; if (seen.has(t)) return false; seen.add(t); B.push({ c: 'matte', a: '01', d: 1, g: 'jamnt', q: t, o: n % 2 ? ['Udda', 'Jämnt'] : ['Jämnt', 'Udda'] }); return true; });
  // ── Mellan ──
  loop(70, () => { const a = ri(2, 10), b = ri(2, 10); return addN('12', a * b > 30 ? 2 : 1, 'gange', `Vad är ${a} × ${b}?`, a * b, [a, -a, b, -b, 1, -1, 10]); });
  loop(40, () => { const a = ri(2, 10), b = ri(2, 10); return addN('12', 2, 'delat', `Vad är ${a * b} ÷ ${a}?`, b, [1, -1, 2, -2, a]); });
  loop(25, () => { const a = ri(11, 89), b = ri(11, 89); return addN('12', a + b > 100 ? 2 : 1, 'plus2', `Vad är ${a} + ${b}?`, a + b, [1, -1, 10, -10, 2, -2]); });
  loop(20, () => { const a = ri(200, 999), b = ri(100, a - 50); return addN('123', 2, 'minus3', `Vad är ${a} − ${b}?`, a - b, [1, -1, 10, -10, 100, -100]); });
  loop(20, () => { const s = ri(1, 20), d = ri(2, 9); return addN('12', d > 5 ? 2 : 1, 'foljd', `Vilket tal kommer sedan: ${s}, ${s + d}, ${s + 2 * d}, ${s + 3 * d}, …?`, s + 4 * d, [1, -1, d, -d, 2]); });
  loop(6, () => { const s = ri(1, 5), k = ri(2, 3); return addN('23', 2, 'foljd', `Vilket tal kommer sedan: ${s}, ${s * k}, ${s * k * k}, ${s * k ** 3}, …?`, s * k ** 4, [s * k ** 3, -s * k, s * k ** 2, 1]); });
  loop(10, () => { const l = ri(2, 12), w = ri(2, 9); return addN('123', 2, 'area', `En rektangel är ${l} cm lång och ${w} cm bred. Hur stor är arean?`, l * w, [l + w, -(l * w) + 2 * (l + w), 1, -1, l, w], false, ' cm²'); });
  loop(8, () => { const l = ri(2, 12), w = ri(2, 9); return addN('123', 2, 'omkrets', `En rektangel är ${l} cm lång och ${w} cm bred. Hur lång är omkretsen?`, 2 * (l + w), [-(l + w), l * w - 2 * (l + w), 2, -2], false, ' cm'); });
  loop(8, () => { const h = ri(8, 20), m = [5, 10, 15, 20, 30, 40, 45, 50][ri(0, 7)]; return addN('12', 1, 'klocka', `Hur många minuter är det från ${h}:${String(m).padStart(2, '0')} till ${h + 1}:00?`, 60 - m, [5, -5, 10, -10, 15]); });
  loop(10, () => { const n = ri(101, 999); const r = Math.round(n / 10) * 10; if (n % 10 === 5) return false; return add('12', 2, 'avrunda', `Avrunda ${n} till närmaste tiotal.`, r, [r + 10, r - 10, Math.round(n / 100) * 100, n].filter(x => x !== r)); });
  [2, 4, 5, 6, 10].forEach(n => addN('12', 1, 'tid', `Hur många sekunder är ${n} minuter?`, n * 60, [60, -60, 10, -10, n * 6]));
  [2, 3, 4, 5].forEach(n => addN('12', 1, 'tid', `Hur många minuter är ${n} timmar?`, n * 60, [60, -60, 30, -30, n * 10]));
  // ── Tonår ──
  loop(30, () => { const p = [5, 10, 20, 25, 50, 75, 15, 30, 40, 60][ri(0, 9)], base = ri(1, 20) * 20; const ans = p * base / 100; if (ans !== Math.round(ans)) return false; return addN('23', 2, 'procent', `Vad är ${p} % av ${base}?`, ans, [5, -5, 10, -10, ans, 2]); });
  for (let n = 2; n <= 15; n++) if (n !== 3 && n !== 12) addN('23', n > 10 ? 2 : 1, 'kvadrat', `Vad är ${n}²?`, n * n, [n, -n, 2 * n, 1, -1, 2 * n + 1]);
  for (let n = 4; n <= 15; n++) if (n !== 12) addN('23', 2, 'rot', `Vad är kvadratroten ur ${n * n}?`, n, [1, -1, 2, -2, n]);
  loop(20, () => { const x = ri(2, 30), a = ri(2, 20); return addN('23', 2, 'ekvation', `Om x + ${a} = ${x + a}, vad är x?`, x, [a, -a, 1, -1, 2 * a, 2]); });
  loop(15, () => { const a = ri(2, 9), x = ri(2, 12); return addN('23', 2, 'ekvation', `Om ${a}x = ${a * x}, vad är x?`, x, [1, -1, a, 2, -2]); });
  loop(10, () => { const a = ri(2, 6), x = ri(2, 10), b = ri(1, 15); return addN('3', 3, 'ekvation', `Om ${a}x + ${b} = ${a * x + b}, vad är x?`, x, [1, -1, b, 2, -2]); });
  loop(15, () => { const a = ri(1, 10), b = ri(a + 1, 20); return addN('23', 2, 'negativ', `Vad är ${a} − ${b}?`, a - b, [2 * (b - a), 1, -1, 2, -2, 10], true); });
  loop(15, () => { const a = ri(2, 9), b = ri(2, 9), c = ri(2, 9); return add('23', 2, 'prioritet', `Vad är ${a} + ${b} × ${c}?`, a + b * c, [(a + b) * c, a + b + c, a * b + c, a + b * c + 1]); });
  loop(10, () => { const a = ri(2, 9), b = ri(2, 9), c = ri(2, 5); return add('23', 2, 'prioritet', `Vad är (${a} + ${b}) × ${c}?`, (a + b) * c, [a + b * c, a + b + c, (a + b) * c + c]); });
  loop(25, () => { const a = ri(11, 49), b = ri(3, 9); return addN('23', 2, 'gange2', `Vad är ${a} × ${b}?`, a * b, [b, -b, 10, -10, a, -a]); });
  loop(6, () => { const b = ri(12, 19); return addN('3', 3, 'gange2', `Vad är 11 × ${b}?`, 11 * b, [11, -11, 10, -10, 1]); });
  for (let n = 3; n <= 10; n++) addN('3', 2, 'potens', `Vad är 2 upphöjt till ${n}?`, 2 ** n, [2 ** (n - 1), 2 ** (n + 1) - 2 ** n, 2 * n - 2 ** n, 2]);
  const FR = [['1/2', 0.5], ['1/4', 0.25], ['3/4', 0.75], ['1/5', 0.2], ['2/5', 0.4], ['1/10', 0.1], ['3/10', 0.3], ['1/8', 0.125], ['3/8', 0.375], ['1/20', 0.05]];
  for (const [f, v] of FR) add('23', 2, 'brak', `Hur skrivs bråket ${f} som decimaltal?`, fmt(v), FR.filter(x => x[0] !== f).map(x => fmt(x[1])).sort(() => rand() - 0.5).slice(0, 3));
  const FA = [['1/2 + 1/4', '3/4', ['2/6', '1/6', '2/4']], ['1/3 + 1/3', '2/3', ['2/6', '1/9', '1/3']], ['1/2 + 1/2', '1', ['1/4', '2/4', '1/2']], ['3/4 − 1/4', '1/2', ['2/8', '1/4', '3/16']],
    ['1/2 · 1/2', '1/4', ['1', '1/2', '2/4']], ['2/3 + 1/6', '5/6', ['3/9', '3/6', '2/18']], ['1 − 1/3', '2/3', ['1/3', '0', '1/2']], ['1/4 + 1/4', '1/2', ['2/8', '1/8', '1/16']]];
  for (const [e, ok, w] of FA) add('23', 2, 'brak2', `Vad är ${e}?`, ok, w);
  loop(8, () => { const v = [0.5, 0.45, 0.405, 0.055, 0.6, 0.06, 0.66, 0.606, 1.2, 1.02, 1.002, 0.12].sort(() => rand() - 0.5).slice(0, 4); const mx = Math.max(...v); return add('23', 2, 'jamfor', `Vilket tal är störst: ${v.map(fmt).join(', ')}?`, fmt(mx), v.filter(x => x !== mx).map(fmt)); });
  // ── Vuxen ──
  const R = n => { const m = [[1000,'M'],[900,'CM'],[500,'D'],[400,'CD'],[100,'C'],[90,'XC'],[50,'L'],[40,'XL'],[10,'X'],[9,'IX'],[5,'V'],[4,'IV'],[1,'I']]; let s = ''; for (const [v, r] of m) while (n >= v) { s += r; n -= v; } return s; };
  for (const n of [4, 9, 14, 19, 24, 40, 49, 90, 99, 400, 900, 1990, 2024, 27, 36, 44]) add('3', 3, 'romersk', `Hur skrivs ${n} med romerska siffror?`, R(n), [R(n + 1), R(Math.max(1, n - 1)), R(n + 10), n === 4 ? 'IIII' : R(n + 5)].filter(x => x !== R(n)));
  for (const n of [50, 100, 500, 1000, 40, 90, 400, 14, 19, 1666]) addN('3', 3, 'romersk2', `Vilket tal är ${R(n)} med romerska siffror?`, n, n >= 100 ? [100, -100, 50, -50, 400] : [10, -10, 5, -5, 1, -1]);
  const U = [['Hur många minuter är 2,5 timmar?', 150, [120, 130, 250]], ['Hur många sekunder är en timme?', 3600, [360, 600, 6000]], ['Hur många timmar är 3 dygn?', 72, [36, 60, 48]],
    ['Hur många dagar är 3 veckor?', 21, [14, 30, 18]], ['Hur många meter är 2,5 km?', 2500, [250, 25000, 2050]], ['Hur många gram är 0,75 kg?', 750, [75, 7500, 570]],
    ['Hur många centiliter är en liter?', 100, [10, 1000, 50]], ['Hur många deciliter är 2 liter?', 20, [200, 2, 12]], ['Hur många millimeter är 3 cm?', 30, [300, 3, 13]],
    ['Hur många kvadratmeter är ett rum som är 4 m × 5 m?', 20, [9, 18, 25]], ['Hur många veckor har ett år ungefär?', 52, [48, 50, 56]], ['Hur många minuter har ett dygn?', 1440, [1200, 2400, 720]],
    ['Hur många centimeter är 1,5 meter?', 150, [15, 1500, 105]], ['Hur många kilometer är en mil?', 10, [1, 100, 5]], ['Hur många liter är 1 kubikmeter?', 1000, [100, 10, 10000]],
    ['En bil kör 90 km på en timme. Hur långt kommer den på 20 minuter?', 30, [45, 20, 60]], ['Hur mycket är en tredjedel av 150?', 50, [30, 75, 45]],
    ['Ett äpple kostar 6 kr. Hur mycket kostar 7 äpplen?', 42, [36, 48, 13]], ['Lisa är 9 år. Hennes mamma är 4 gånger så gammal. Hur gammal är mamman?', 36, [32, 40, 13]],
    ['Ett tåg går klockan 14:40 och resan tar 1 timme och 35 minuter. När kommer det fram?', '16:15', ['15:15', '16:05', '16:25']]];
  for (const [t, ok, w] of U) add(/kvadratmeter|tredjedel|äpple|Lisa|tåg|bil/.test(t) ? '123' : '23', 2, 'enheter', t, typeof ok === 'number' ? fmt(ok) : ok, w.map(x => typeof x === 'number' ? fmt(x) : x));
  q('matte','0',1,'Hur många hörn har en kvadrat? 🟥','4','3','5','6');
  q('matte','01',1,'Hur många sidor har en femhörning?','5','4','6','8');
  q('matte','12',1,'Hur många sidor har en åttahörning?','8','6','7','10');
  q('matte','12',1,'Hur många grader är en rät vinkel?','90°','45°','180°','360°');
  q('matte','23',2,'Hur många grader är vinkelsumman i en fyrhörning?','360°','180°','270°','540°');
  q('matte','01',1,'Vilken form har en fotboll om man tittar på den från sidan?','En cirkel','En kvadrat','En triangel','En rektangel');
  q('matte','12',1,'Vad kallas en triangel där alla sidor är lika långa?','Liksidig','Rätvinklig','Trubbvinklig','Spetsig');
  q('matte','23',2,'Vad heter den längsta sidan i en rätvinklig triangel?','Hypotenusa','Katet','Diagonal','Radie');
  q('matte','3',2,'Vad säger Pythagoras sats?','a² + b² = c²','a + b = c','a · b = c²','2a = b + c');
  q('matte','23',2,'Vad kallas avståndet från mitten av en cirkel till kanten?','Radie','Diameter','Omkrets','Area');
  q('matte','3',2,'Hur räknar man ut arean av en cirkel?','π · r²','2 · π · r','r · r · r','π · d²');
  q('matte','23',2,'Vilket är det minsta primtalet?','2','1','3','0');
  q('matte','3',2,'Hur många primtal finns det mellan 1 och 20?','8','6','7','10');
  q('matte','23',1,'Vad kallas resultatet när man adderar tal?','Summa','Produkt','Kvot','Differens');
  q('matte','23',1,'Vad kallas resultatet när man multiplicerar tal?','Produkt','Summa','Kvot','Differens');
  q('matte','23',2,'Vad kallas resultatet när man dividerar tal?','Kvot','Produkt','Summa','Differens');
  q('matte','3',2,'Vad är 0 delat med 5?','0','5','Det går inte','1');
  q('matte','3',2,'Vad är 1 000 000 i tiopotens?','10⁶','10⁵','10⁷','10³');
  q('matte','3',3,'Hur många nollor har en miljard?','9','6','12','8');
  q('matte','12',1,'Hur många nollor har en miljon?','6','3','9','7');
  q('matte','3',2,'Vad blir 7! (7-fakultet)?','5 040','49','720','343');
  q('matte','3',3,'Om du slår två tärningar, vilken summa är vanligast?','7','6','12','8');
  q('matte','23',2,'Hur stor är chansen att få krona när man singlar slant?','50 %','25 %','100 %','33 %');
  q('matte','3',2,'Tre katter fångar tre möss på tre minuter. Hur många katter behövs för att fånga 100 möss på 100 minuter?','3','100','33','300');
  q('matte','3',2,'En snigel klättrar 3 m upp om dagen och glider 2 m ner varje natt. Hur många dagar tar det att nå toppen av en 10 m hög mur?','8','10','5','7');
  q('matte','23',2,'Vilket tal är dubbelt så stort som hälften av 50?','50','25','100','75');
  q('matte','3',2,'Hur många gånger förekommer siffran 9 bland talen 1 till 100?','20','10','11','19');
  q('matte','12',1,'Vad är 1 000 − 1?','999','990','900','9 999');
})();
