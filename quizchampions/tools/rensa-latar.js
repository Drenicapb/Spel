/* Rensar låtdatabasen så att bara kända låtar av kända artister blir kvar.
 * Behåller per artist i tools/kanda-artister.txt de N mest spelade låtarna (Spotify-popularitet) – och bara de som ligger nära artistens största hit.
 * Körs från mappen quizchampions:  node tools/rensa-latar.js
 * Skriptet utgår från filerna som de ligger, så för att få TILLBAKA låtar måste originalen hämtas först:
 *   git show 39f33ca:quizchampions/songs-db.js > songs-db.js && git show 39f33ca:quizchampions/tema-songs.js > tema-songs.js
 * (originalen har alla 21 383 låtar) och sedan köra skriptet igen. */
const fs = require('fs'), path = require('path');
const N = 8, MIN = 25, REL = 0.65; // högst N per artist, minst MIN i popularitet och minst REL × artistens största hit
const dir = path.join(__dirname, '..'), file = path.join(dir, 'songs-db.js');
const W = new Set(fs.readFileSync(path.join(__dirname, 'kanda-artister.txt'), 'utf8').split('\n').map(s => s.trim()).filter(s => s && !s.startsWith('#')));
const src = fs.readFileSync(file, 'utf8');
global.window = {}; eval(src);
const rows = window.QK_SONGS_DB.split('\n').map(l => l.split('\t')).filter(r => r[0]);
// konstiga versioner och sånt som inte passar i ett quiz
const junk = /\b(remix|mix|live|acoustic|instrumental|karaoke|cover|version|edit|demo|interlude|intro|outro|skit|remaster|re-recorded|sped up|slowed|mashup|medley|tribute)\b/i;
const by = new Map();
for (const r of rows) {
  const [id, t, ar, yr, p] = r;
  if (!W.has(ar) || +p < MIN || junk.test(t) || t.length > 60) continue;
  if (!by.has(ar)) by.set(ar, []); by.get(ar).push(r);
}
const keep = [];
for (const list of by.values()) { list.sort((a, b) => b[4] - a[4]); const top = +list[0][4]; keep.push(...list.filter(r => +r[4] >= top * REL).slice(0, N)); }
keep.sort((a, b) => b[4] - a[4]);
const head = `/* Quiz Champions – låtdatabas: ${keep.length} kända Spotify-låtar av ${by.size} kända artister (urval ur TidyTuesday 2020-01-21, spotify_songs.csv).
 * Rad: Spotify-id \\t titel \\t artist \\t år (albumets, kan vara en samlingsskiva) \\t popularitet 0–100 \\t genre.
 * Rensad med tools/rensa-latar.js: bara artister i tools/kanda-artister.txt och högst ${N} låtar per artist. Laddas bara av värdskärmen/enspelarläget. */
window.QK_SONGS_DB = ${JSON.stringify(keep.map(r => r.join('\t')).join('\n'))};
`;
fs.writeFileSync(file, head);
console.log(`Behöll ${keep.length} av ${rows.length} låtar från ${by.size} artister.`);

// Temaquizen 90-tal, 00-tal och hiphop: listorna är sorterade efter hur kända låtarna är.
// Behåll de TOP första plus låtar av artister i listan. (Albansk musik, 2Pac och jul lämnas orörda.)
const TOP = 100, tfile = path.join(dir, 'tema-songs.js');
const tsrc = fs.readFileSync(tfile, 'utf8'); window.QK_THEME_SONGS = null; eval(tsrc);
const T = window.QK_THEME_SONGS, thead = tsrc.slice(0, tsrc.indexOf('window.QK_THEME_SONGS'));
for (const k of ['90tal', '00tal', 'hiphop']) {
  const before = T[k].length;
  T[k] = T[k].filter((s, i) => i < TOP || W.has(s[2])).filter(s => !junk.test(s[1]));
  console.log(`Tema ${k}: behöll ${T[k].length} av ${before}`);
}
fs.writeFileSync(tfile, thead + 'window.QK_THEME_SONGS = {' + Object.entries(T).map(([k, v]) => JSON.stringify(k) + ':[' + v.map(x => JSON.stringify(x)).join(',\n') + ']').join(',\n') + '};\n');
