/* Quiz Champions – jämförelsefrågor (vilket land/vilken kommun har flest invånare, är störst …).
 * Siffrorna är ungefärliga (2023–2024); frågor skapas bara när skillnaden mellan etta och tvåa är tydlig. */
(function () {
  const { q, shuf, rand } = window.QKB;
  // [land, invånare (miljoner), yta (1 000 km²)] – yta null = används inte (t.ex. oklart om ögrupper räknas)
  const C = [
    ['Kina',1410,9597],['Indien',1430,3287],['USA',335,9834],['Indonesien',278,1905],['Pakistan',240,882],['Nigeria',224,924],
    ['Brasilien',216,8516],['Bangladesh',173,148],['Ryssland',144,17098],['Mexiko',129,1964],['Etiopien',127,1104],['Japan',124,378],
    ['Filippinerna',117,300],['Egypten',113,1002],['Kongo-Kinshasa',102,2345],['Vietnam',99,331],['Iran',89,1648],['Turkiet',85,784],
    ['Tyskland',84,357],['Thailand',72,513],['Storbritannien',68,244],['Frankrike',68,null],['Sydafrika',62,1221],['Italien',59,301],
    ['Kenya',55,580],['Colombia',52,1142],['Sydkorea',52,100],['Spanien',48,506],['Argentina',46,2780],['Algeriet',46,2382],
    ['Kanada',40,9985],['Polen',37,313],['Saudiarabien',37,2150],['Peru',34,1285],['Malaysia',34,330],['Australien',27,7692],
    ['Nepal',31,147],['Chile',20,756],['Nederländerna',18,42],['Rumänien',19,238],['Sverige',10.5,450],['Portugal',10.4,92],
    ['Grekland',10.4,132],['Ungern',9.6,93],['Österrike',9.1,84],['Schweiz',8.8,41],['Israel',9.8,22],['Danmark',5.9,43],
    ['Finland',5.6,338],['Norge',5.5,null],['Irland',5.2,70],['Nya Zeeland',5.2,268],['Island',0.39,103],['Estland',1.4,45],
    ['Lettland',1.9,65],['Litauen',2.8,65],['Belgien',11.7,31],['Tjeckien',10.9,79],['Kuba',11,110],['Mongoliet',3.4,1564],
    ['Kazakstan',20,2725],['Bolivia',12,1099],['Madagaskar',30,587],['Irak',45,438],['Afghanistan',42,652],['Tanzania',67,945],
    ['Uganda',48,241],['Ghana',34,239],['Angola',36,1247],['Sudan',48,1886],['Libyen',7,1760],['Luxemburg',0.66,2.6],['Malta',0.53,0.32],
  ];
  const KNOWN = new Set(['Kina','Indien','USA','Brasilien','Ryssland','Japan','Tyskland','Storbritannien','Frankrike','Italien','Spanien','Kanada','Australien','Sverige','Norge','Danmark','Finland','Island','Mexiko','Egypten','Turkiet','Polen','Grekland','Nederländerna','Schweiz','Sydafrika','Argentina']);
  const gen = (list, val, cat, text, n, ratio, most, g) => {
    const seen = new Set(); let tries = 0, made = 0;
    while (made < n && tries++ < n * 60) {
      const four = shuf(list).slice(0, 4); if (four.length < 4) return;
      const s = [...four].sort((a, b) => most ? val(b) - val(a) : val(a) - val(b));
      if (most ? val(s[0]) < val(s[1]) * ratio : val(s[1]) < val(s[0]) * ratio) continue;
      const key = s.map(x => x[0]).sort().join('|'); if (seen.has(key)) continue; seen.add(key);
      const names = four.map(x => x[0]).sort((a, b) => a.localeCompare(b, 'sv'));
      const easy = four.every(x => KNOWN.has(x[0]));
      q(cat, easy ? '23' : '3', easy ? 2 : 3, `${text}: ${names.slice(0, 3).join(', ')} eller ${names[3]}?`, s[0][0], ...s.slice(1).map(x => x[0]));
      made++;
    }
  };
  const pop = C, area = C.filter(x => x[2] != null);
  gen(pop, x => x[1], 'geo', 'Vilket land har flest invånare', 110, 1.3, true, 'pop');
  gen(pop, x => x[1], 'geo', 'Vilket land har minst antal invånare', 50, 1.3, false, 'pop');
  gen(area, x => x[2], 'geo', 'Vilket land är störst till ytan', 110, 1.3, true, 'yta');
  gen(area, x => x[2], 'geo', 'Vilket land är minst till ytan', 50, 1.3, false, 'yta');

  // Svenska kommuner – invånare (tusental)
  const K = [
    ['Stockholm',988],['Göteborg',607],['Malmö',362],['Uppsala',245],['Linköping',167],['Örebro',160],['Västerås',158],['Helsingborg',152],
    ['Norrköping',145],['Jönköping',145],['Umeå',133],['Lund',130],['Borås',115],['Eskilstuna',107],['Gävle',104],['Halmstad',105],
    ['Södertälje',102],['Sundsvall',99],['Karlstad',96],['Växjö',97],['Kristianstad',87],['Kungsbacka',85],['Luleå',80],['Skellefteå',77],
    ['Kalmar',72],['Karlskrona',67],['Varberg',67],['Östersund',65],['Gotland',62],['Trollhättan',60],['Falun',60],['Skövde',57],
    ['Uddevalla',57],['Örnsköldsvik',56],['Borlänge',53],['Motala',43],['Piteå',42],['Ystad',31],['Kiruna',22],['Mora',20],['Åre',12],
  ];
  const kq = (n, ratio) => {
    const seen = new Set(); let tries = 0, made = 0;
    while (made < n && tries++ < n * 60) {
      const four = shuf(K).slice(0, 4), s = [...four].sort((a, b) => b[1] - a[1]);
      if (s[0][1] < s[1][1] * ratio) continue;
      const key = s.map(x => x[0]).sort().join('|'); if (seen.has(key)) continue; seen.add(key);
      const names = four.map(x => x[0]).sort((a, b) => a.localeCompare(b, 'sv'));
      q('sverige', s[0][1] > 140 ? '23' : '3', s[0][1] > 140 ? 2 : 3, `Vilken kommun har flest invånare: ${names.slice(0, 3).join(', ')} eller ${names[3]}?`, s[0][0], ...s.slice(1).map(x => x[0]));
      made++;
    }
  };
  kq(110, 1.3);
  void rand;
})();
