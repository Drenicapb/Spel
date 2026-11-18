/* Quiz Champions – flaggfrågor (bildfrågor) och nya kategorier.
 * Flaggorna kommer från flag-icons (MIT-licens, https://github.com/lipis/flag-icons) och ligger i img/flags/.
 * Bilden börjar suddig på storskärmen och blir skarpare – snabbt rätt svar ger mest poäng.
 * [landskod, namn, region, nivå]  nivå 1 = alla åldrar, 2 = från 10 år, 3 = från 13 år */
(function () {
  // nya kategorier före Spotify-musiken
  const C = window.QK_CATS, sp = C.spotify; delete C.spotify;
  C.flagga = { n: 'Flaggor', e: '🏳️' };
  C.ordning = { n: 'Sortera i rätt ordning', e: '🔢' };
  C.spotify = sp;
  // en flaggfrågas identitet är bilden (texten är densamma för alla), en sorteringsfrågas även alternativen
  const key = window.QK_KEY; window.QK_KEY = q => q.img ? q.q + ' | ' + q.img : q.items ? q.q + ' | ' + q.items.join(' · ') : key(q);

  const F = [
    ['se', 'Sverige', 'eu', 1], ['no', 'Norge', 'eu', 1], ['dk', 'Danmark', 'eu', 1], ['fi', 'Finland', 'eu', 1], ['is', 'Island', 'eu', 2],
    ['de', 'Tyskland', 'eu', 1], ['fr', 'Frankrike', 'eu', 1], ['gb', 'Storbritannien', 'eu', 1], ['ie', 'Irland', 'eu', 2], ['es', 'Spanien', 'eu', 1],
    ['pt', 'Portugal', 'eu', 2], ['it', 'Italien', 'eu', 1], ['gr', 'Grekland', 'eu', 2], ['nl', 'Nederländerna', 'eu', 2], ['be', 'Belgien', 'eu', 2],
    ['lu', 'Luxemburg', 'eu', 3], ['ch', 'Schweiz', 'eu', 1], ['at', 'Österrike', 'eu', 2], ['pl', 'Polen', 'eu', 2], ['cz', 'Tjeckien', 'eu', 2],
    ['sk', 'Slovakien', 'eu', 3], ['hu', 'Ungern', 'eu', 2], ['ro', 'Rumänien', 'eu', 3], ['bg', 'Bulgarien', 'eu', 3], ['hr', 'Kroatien', 'eu', 2],
    ['si', 'Slovenien', 'eu', 3], ['rs', 'Serbien', 'eu', 3], ['ba', 'Bosnien och Hercegovina', 'eu', 3], ['me', 'Montenegro', 'eu', 3], ['mk', 'Nordmakedonien', 'eu', 3],
    ['al', 'Albanien', 'eu', 1], ['xk', 'Kosovo', 'eu', 1], ['ee', 'Estland', 'eu', 2], ['lv', 'Lettland', 'eu', 3], ['lt', 'Litauen', 'eu', 3],
    ['ua', 'Ukraina', 'eu', 2], ['by', 'Belarus', 'eu', 3], ['md', 'Moldavien', 'eu', 3], ['ru', 'Ryssland', 'eu', 2], ['tr', 'Turkiet', 'eu', 1],
    ['cy', 'Cypern', 'eu', 3], ['mt', 'Malta', 'eu', 3], ['mc', 'Monaco', 'eu', 3], ['ad', 'Andorra', 'eu', 3], ['sm', 'San Marino', 'eu', 3],
    ['li', 'Liechtenstein', 'eu', 3], ['va', 'Vatikanstaten', 'eu', 3],
    ['cn', 'Kina', 'as', 1], ['jp', 'Japan', 'as', 1], ['kr', 'Sydkorea', 'as', 2], ['kp', 'Nordkorea', 'as', 3], ['in', 'Indien', 'as', 2],
    ['pk', 'Pakistan', 'as', 3], ['bd', 'Bangladesh', 'as', 3], ['lk', 'Sri Lanka', 'as', 3], ['np', 'Nepal', 'as', 2], ['th', 'Thailand', 'as', 2],
    ['vn', 'Vietnam', 'as', 2], ['ph', 'Filippinerna', 'as', 3], ['id', 'Indonesien', 'as', 3], ['my', 'Malaysia', 'as', 3], ['sg', 'Singapore', 'as', 3],
    ['mn', 'Mongoliet', 'as', 3], ['kz', 'Kazakstan', 'as', 3], ['af', 'Afghanistan', 'as', 3], ['ir', 'Iran', 'as', 3], ['iq', 'Irak', 'as', 3],
    ['sa', 'Saudiarabien', 'as', 2], ['ae', 'Förenade Arabemiraten', 'as', 3], ['qa', 'Qatar', 'as', 3], ['il', 'Israel', 'as', 2], ['lb', 'Libanon', 'as', 2],
    ['sy', 'Syrien', 'as', 3], ['jo', 'Jordanien', 'as', 3], ['tw', 'Taiwan', 'as', 3], ['kw', 'Kuwait', 'as', 3], ['ge', 'Georgien', 'as', 3],
    ['am', 'Armenien', 'as', 3], ['az', 'Azerbajdzjan', 'as', 3],
    ['eg', 'Egypten', 'af', 2], ['ma', 'Marocko', 'af', 2], ['dz', 'Algeriet', 'af', 3], ['tn', 'Tunisien', 'af', 3], ['ng', 'Nigeria', 'af', 2],
    ['gh', 'Ghana', 'af', 3], ['za', 'Sydafrika', 'af', 2], ['ke', 'Kenya', 'af', 2], ['et', 'Etiopien', 'af', 3], ['so', 'Somalia', 'af', 3],
    ['sn', 'Senegal', 'af', 3], ['cm', 'Kamerun', 'af', 3], ['ci', 'Elfenbenskusten', 'af', 3], ['tz', 'Tanzania', 'af', 3], ['ug', 'Uganda', 'af', 3],
    ['rw', 'Rwanda', 'af', 3], ['cd', 'Kongo-Kinshasa', 'af', 3], ['ao', 'Angola', 'af', 3], ['mz', 'Moçambique', 'af', 3], ['zw', 'Zimbabwe', 'af', 3],
    ['ly', 'Libyen', 'af', 3], ['sd', 'Sudan', 'af', 3], ['mg', 'Madagaskar', 'af', 3], ['er', 'Eritrea', 'af', 3],
    ['us', 'USA', 'am', 1], ['ca', 'Kanada', 'am', 1], ['mx', 'Mexiko', 'am', 2], ['br', 'Brasilien', 'am', 1], ['ar', 'Argentina', 'am', 2],
    ['cl', 'Chile', 'am', 3], ['co', 'Colombia', 'am', 3], ['pe', 'Peru', 'am', 3], ['ve', 'Venezuela', 'am', 3], ['uy', 'Uruguay', 'am', 3],
    ['py', 'Paraguay', 'am', 3], ['bo', 'Bolivia', 'am', 3], ['ec', 'Ecuador', 'am', 3], ['cu', 'Kuba', 'am', 3], ['jm', 'Jamaica', 'am', 2],
    ['ht', 'Haiti', 'am', 3], ['do', 'Dominikanska republiken', 'am', 3], ['pa', 'Panama', 'am', 3], ['cr', 'Costa Rica', 'am', 3], ['gt', 'Guatemala', 'am', 3],
    ['au', 'Australien', 'oc', 2], ['nz', 'Nya Zeeland', 'oc', 2], ['fj', 'Fiji', 'oc', 3], ['pg', 'Papua Nya Guinea', 'oc', 3],
  ];
  window.QK_FLAGS = F;
  const { pick } = window.QKB, B = window.QK_BANK;
  const AGE = { 1: '0123', 2: '123', 3: '23' };
  const all = F.map(f => f[1]);
  for (const [iso, name, reg, lv] of F) {
    // felsvar helst från samma världsdel och ungefär lika kända länder – svårare flaggor får svårare felsvar
    const near = F.filter(f => f[1] !== name && f[2] === reg && Math.abs(f[3] - lv) <= 1).map(f => f[1]);
    const easy = F.filter(f => f[1] !== name && f[3] <= Math.max(2, lv)).map(f => f[1]);
    const wrong = pick(name, near, lv === 1 ? easy : all);
    B.push({ c: 'flagga', a: AGE[lv], d: lv, g: 'flag', type: 'flag', img: 'img/flags/' + iso + '.svg', q: 'Vilket land har den här flaggan?', o: [name, ...wrong] });
  }
})();
