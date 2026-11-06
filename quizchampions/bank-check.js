/* Quiz Champions – kontroll av frågebanken: tar bort dubbletter och trasiga frågor */
(function () {
  const cats = window.QK_CATS || {}, seen = new Set(), out = [], bad = [];
  const norm = t => String(t).toLowerCase().replace(/\s+/g, ' ').trim();
  for (const q of window.QK_BANK || []) {
    const key = norm(q.q);
    if (!q.q || !cats[q.c] || !/^[0-3]+$/.test(String(q.a)) || ![1, 2, 3].includes(q.d)) { bad.push(q); continue; }
    if (seen.has(key)) { bad.push(q); continue; }
    if ('tf' in q) { if (typeof q.tf !== 'boolean') { bad.push(q); continue; } }
    else {
      const o = [], low = new Set();
      for (const x of q.o || []) { const s = String(x ?? '').trim(); if (s && !low.has(s.toLowerCase())) { low.add(s.toLowerCase()); o.push(s); } }
      if (o.length < 2 || String(q.o[0]).trim() !== o[0]) { bad.push(q); continue; }
      q.o = o.slice(0, 4);
    }
    seen.add(key); out.push(q);
  }
  window.QK_BANK.length = 0; window.QK_BANK.push(...out);
  const ids = new Set();
  window.QK_SONGS = (window.QK_SONGS || []).filter(s => s && s.id && s.t && s.ar && !ids.has(s.id) && ids.add(s.id));
  window.QK_STATS = { questions: out.length, songs: window.QK_SONGS.length, removed: bad.length };
  if (/[?&]debug\b/.test(location.search)) console.info('Frågebank', window.QK_STATS, bad);
})();
