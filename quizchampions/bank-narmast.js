/* Quiz Champions – närmast rätt svar (reglage). Den som kommer närmast får mest poäng.
 * num(kategori, åldrar, svårighet, fråga, svar, min, max, steg, enhet, {fmt:'year', tol})
 * tol = hur nära man måste vara för att räknas som "rätt" (annars 1 % av skalan). */
(function () {
  const { num } = window.QKB;
  const N = (a, d, text, ans, min, max, step = 1, unit = '', x = {}) => num('narmast', a, d, text, ans, min, max, step, unit, x);
  const Y = (a, d, text, ans, span = 100, x = {}) => {
    // Årtal: skalan börjar en bit före och slutar en bit efter – inte mitt på
    const off = Math.round(span * (0.25 + ((ans * 7) % 50) / 100));
    const min = Math.max(0, ans - off), max = Math.min(2030, min + span);
    num('narmast', a, d, text, ans, max - span < 0 ? 0 : max - span, max, 1, '', { fmt: 'year', tol: x.tol ?? (span > 300 ? 5 : span > 120 ? 2 : 1), g: 'year' });
  };
  const exact = { tol: 0 };

  // ───────── Höjder, längder och ytor ─────────
  N('123', 2, 'Hur högt är Mount Everest?', 8849, 4000, 12000, 10, 'm', { tol: 100 });
  N('23', 2, 'Hur högt är Kebnekaise, Sveriges högsta berg?', 2097, 1000, 3500, 1, 'm', { tol: 30 });
  N('3', 3, 'Hur högt är Mont Blanc?', 4806, 2500, 7000, 1, 'm', { tol: 60 });
  N('3', 3, 'Hur högt är Kilimanjaro?', 5895, 3000, 8000, 5, 'm', { tol: 80 });
  N('23', 2, 'Hur högt är Eiffeltornet?', 330, 100, 700, 1, 'm', { tol: 10 });
  N('23', 2, 'Hur högt är Burj Khalifa, världens högsta byggnad?', 828, 300, 1400, 1, 'm', { tol: 20 });
  N('23', 2, 'Hur högt är Turning Torso i Malmö?', 190, 50, 400, 1, 'm', { tol: 6 });
  N('3', 3, 'Hur högt är Kaknästornet i Stockholm?', 155, 50, 350, 1, 'm', { tol: 6 });
  N('3', 3, 'Hur hög är Globen (Avicii Arena) i Stockholm?', 85, 20, 200, 1, 'm', { tol: 4 });
  N('23', 2, 'Hur lång är Nilen ungefär?', 6650, 2000, 10000, 50, 'km', { tol: 250 });
  N('3', 3, 'Hur lång är Amazonfloden ungefär?', 6400, 2000, 10000, 50, 'km', { tol: 300 });
  N('3', 2, 'Hur djup är Marianergraven, havets djupaste plats?', 10900, 3000, 16000, 50, 'm', { tol: 300 });
  N('3', 3, 'Hur stor är Vänern?', 5650, 1000, 12000, 50, 'km²', { tol: 250 });
  N('3', 3, 'Hur stor är Sveriges yta?', 450000, 100000, 1000000, 5000, 'km²', { tol: 15000 });
  N('3', 3, 'Hur långt är Sverige från norr till söder?', 1570, 600, 3000, 10, 'km', { tol: 60 });
  N('3', 3, 'Hur lång är Göta kanal?', 190, 40, 500, 1, 'km', { tol: 10 });
  N('3', 3, 'Hur lång är vandringsleden Kungsleden?', 440, 100, 1000, 5, 'km', { tol: 25 });
  N('23', 2, 'Hur lång är Öresundsbron?', 7.8, 1, 20, 0.1, 'km', { tol: 0.4 });
  N('3', 3, 'Hur lång är Ölandsbron?', 6.1, 1, 15, 0.1, 'km', { tol: 0.3 });
  N('3', 2, 'Hur stor är Sahara?', 9, 1, 20, 0.5, 'miljoner km²', { tol: 0.6 });
  N('23', 2, 'Hur lång är jordens omkrets runt ekvatorn?', 40075, 10000, 80000, 100, 'km', { tol: 1000 });
  N('23', 2, 'Hur många öar ligger Stockholms innerstad på?', 14, 1, 40, 1, 'öar', exact);

  // ───────── Antal ─────────
  N('3', 2, 'Hur många medlemsländer har FN?', 193, 100, 260, 1, 'länder', { tol: 2 });
  N('3', 2, 'Hur många kommuner finns det i Sverige?', 290, 100, 500, 1, 'kommuner', { tol: 4 });
  N('123', 1, 'Hur många landskap har Sverige?', 25, 5, 50, 1, 'landskap', exact);
  N('23', 2, 'Hur många län har Sverige?', 21, 5, 40, 1, 'län', exact);
  N('3', 2, 'Hur många länder är med i EU (2025)?', 27, 10, 45, 1, 'länder', exact);
  N('0123', 1, 'Hur många planeter finns det i vårt solsystem?', 8, 1, 15, 1, 'planeter', exact);
  N('0123', 1, 'Hur många ben har en spindel?', 8, 0, 20, 1, 'ben', exact);
  N('0123', 1, 'Hur många ben har en insekt?', 6, 0, 20, 1, 'ben', exact);
  N('0123', 1, 'Hur många armar har en bläckfisk?', 8, 0, 20, 1, 'armar', exact);
  N('123', 2, 'Hur många ben har en vuxen människa?', 206, 50, 400, 1, 'ben', { tol: 3 });
  N('123', 1, 'Hur många tänder har en vuxen människa (med visdomständer)?', 32, 10, 50, 1, 'tänder', exact);
  N('0123', 1, 'Hur många mjölktänder har ett barn?', 20, 5, 40, 1, 'tänder', exact);
  N('3', 2, 'Hur många kromosomer har en människa?', 46, 10, 100, 1, 'st', exact);
  N('0123', 1, 'Hur många rutor har ett schackbräde?', 64, 10, 150, 1, 'rutor', exact);
  N('123', 1, 'Hur många kort finns i en kortlek (utan jokrar)?', 52, 20, 100, 1, 'kort', exact);
  N('123', 2, 'Hur många prickar finns det totalt på en vanlig tärning?', 21, 6, 50, 1, 'prickar', exact);
  N('23', 2, 'Hur många tangenter har ett vanligt piano?', 88, 30, 150, 1, 'tangenter', { tol: 2 });
  N('0123', 1, 'Hur många strängar har en vanlig gitarr?', 6, 1, 15, 1, 'strängar', exact);
  N('0123', 1, 'Hur många bokstäver har det svenska alfabetet?', 29, 15, 40, 1, 'bokstäver', exact);
  N('123', 1, 'Hur många bokstäver har det engelska alfabetet?', 26, 15, 40, 1, 'bokstäver', exact);
  N('0123', 1, 'Hur många stjärnor finns det på EU-flaggan?', 12, 1, 30, 1, 'stjärnor', exact);
  N('123', 1, 'Hur många stjärnor finns det på USA:s flagga?', 50, 10, 100, 1, 'stjärnor', exact);
  N('23', 2, 'Hur många ränder har USA:s flagga?', 13, 1, 30, 1, 'ränder', exact);
  N('123', 1, 'Hur många hål har en vanlig golfbana?', 18, 5, 40, 1, 'hål', exact);
  N('0123', 1, 'Hur många spelare har ett fotbollslag på planen?', 11, 1, 20, 1, 'spelare', exact);
  N('123', 1, 'Hur många spelare har ett ishockeylag på isen (med målvakten)?', 6, 1, 15, 1, 'spelare', exact);
  N('123', 1, 'Hur många spelare har ett basketlag på planen?', 5, 1, 15, 1, 'spelare', exact);
  N('123', 2, 'Hur många spelare har ett handbollslag på planen (med målvakten)?', 7, 1, 15, 1, 'spelare', exact);
  N('0123', 1, 'Hur många Harry Potter-böcker finns det (huvudserien)?', 7, 1, 15, 1, 'böcker', exact);
  N('3', 2, 'Hur många tecken får ett inlägg på X (Twitter) vara som standard?', 280, 50, 500, 10, 'tecken', exact);
  N('123', 1, 'Hur många bitar finns det i en byte?', 8, 1, 20, 1, 'bitar', exact);
  N('3', 3, 'Ungefär hur många ägg kan en värphöna lägga på ett år?', 300, 20, 500, 5, 'ägg', { tol: 30 });

  // ───────── Befolkning ─────────
  N('3', 2, 'Hur många invånare har Sverige ungefär?', 10.5, 3, 25, 0.1, 'miljoner', { tol: 0.3 });
  N('3', 2, 'Hur många människor bor det på jorden ungefär?', 8.1, 2, 15, 0.1, 'miljarder', { tol: 0.3 });
  N('3', 3, 'Ungefär hur många invånare har Kina?', 1410, 300, 2500, 10, 'miljoner', { tol: 50 });
  N('3', 3, 'Ungefär hur många invånare har USA?', 335, 50, 800, 5, 'miljoner', { tol: 15 });
  N('3', 3, 'Ungefär hur många invånare har Norge?', 5.5, 1, 15, 0.1, 'miljoner', { tol: 0.3 });
  N('3', 3, 'Ungefär hur många invånare har Finland?', 5.6, 1, 15, 0.1, 'miljoner', { tol: 0.3 });
  N('3', 3, 'Ungefär hur många invånare har Danmark?', 5.9, 1, 15, 0.1, 'miljoner', { tol: 0.3 });
  N('3', 3, 'Ungefär hur många invånare har Tyskland?', 84, 20, 200, 1, 'miljoner', { tol: 4 });
  N('3', 3, 'Ungefär hur många invånare har Island?', 390, 50, 2000, 10, 'tusen', { tol: 30 });
  N('3', 3, 'Ungefär hur många bor i Stockholms kommun?', 990, 300, 2000, 10, 'tusen', { tol: 40 });
  N('3', 3, 'Ungefär hur många bor i Göteborgs kommun?', 600, 200, 1500, 10, 'tusen', { tol: 30 });
  N('3', 3, 'Ungefär hur många bor i Malmö kommun?', 360, 100, 1000, 5, 'tusen', { tol: 20 });
  N('3', 3, 'Ungefär hur många bodde i Sverige år 1900?', 5.1, 1, 12, 0.1, 'miljoner', { tol: 0.3 });

  // ───────── Rymden & naturvetenskap ─────────
  N('3', 2, 'Hur långt är det till månen?', 384400, 100000, 1000000, 1000, 'km', { tol: 15000 });
  N('3', 2, 'Hur långt är det till solen?', 150, 20, 400, 1, 'miljoner km', { tol: 5 });
  N('3', 2, 'Hur snabbt färdas ljuset?', 300000, 50000, 600000, 1000, 'km/s', { tol: 5000 });
  N('3', 3, 'Hur varmt är det på solens yta?', 5500, 1000, 15000, 100, '°C', { tol: 300 });
  N('3', 3, 'Hur varmt är det på Venus yta?', 465, 0, 1000, 5, '°C', { tol: 25 });
  N('3', 2, 'Vid hur många grader ligger absoluta nollpunkten?', -273, -500, 0, 1, '°C', { tol: 2 });
  N('0123', 1, 'Vid hur många grader kokar vatten (vid havsytan)?', 100, 0, 250, 1, '°C', exact);
  N('0123', 1, 'Vid hur många grader fryser vatten?', 0, -50, 50, 1, '°C', exact);
  N('23', 2, 'Hur många dagar tar det för Mars att gå ett varv runt solen?', 687, 100, 1500, 1, 'dagar', { tol: 20 });
  N('3', 3, 'Hur många timmar är ett dygn på Jupiter?', 10, 1, 50, 1, 'timmar', { tol: 1 });
  N('3', 2, 'Hur gammal är jorden?', 4.5, 0.5, 12, 0.1, 'miljarder år', { tol: 0.2 });
  N('3', 3, 'Hur gammalt är universum?', 13.8, 2, 30, 0.1, 'miljarder år', { tol: 0.5 });
  N('3', 3, 'Hur stor är månens diameter?', 3474, 500, 9000, 10, 'km', { tol: 150 });
  N('23', 2, 'Hur många minuter tar det för solljuset att nå jorden?', 8.3, 0.5, 40, 0.1, 'minuter', { tol: 0.6 });
  N('123', 2, 'Hur många dagar har ett skottår?', 366, 300, 400, 1, 'dagar', exact);
  N('3', 3, 'Vilket atomnummer har syre?', 8, 1, 50, 1, '', exact);
  N('3', 3, 'Vilket atomnummer har kol?', 6, 1, 50, 1, '', exact);
  N('3', 3, 'Vilket atomnummer har järn?', 26, 1, 80, 1, '', exact);
  N('3', 3, 'Vilket atomnummer har guld?', 79, 1, 120, 1, '', { tol: 1 });
  N('3', 3, 'Hur många grundämnen finns i periodiska systemet (2025)?', 118, 50, 200, 1, 'st', { tol: 1 });

  // ───────── Kroppen ─────────
  N('123', 2, 'Hur många liter blod har en vuxen människa ungefär?', 5, 1, 15, 0.5, 'liter', { tol: 0.5 });
  N('0123', 1, 'Vilken kroppstemperatur har en frisk människa ungefär?', 37, 30, 45, 0.1, '°C', { tol: 0.5 });
  N('23', 2, 'Hur många gånger slår hjärtat ungefär per minut i vila hos en vuxen?', 70, 20, 200, 1, 'slag', { tol: 10 });
  N('3', 3, 'Hur lång var världens längsta människa, Robert Wadlow?', 272, 180, 350, 1, 'cm', { tol: 5 });
  N('23', 3, 'Hur många centimeter växer håret ungefär på en månad?', 1.2, 0.1, 5, 0.1, 'cm', { tol: 0.3 });

  // ───────── Djur ─────────
  N('123', 2, 'Hur lång kan en blåval bli?', 30, 5, 60, 1, 'm', { tol: 3 });
  N('0123', 1, 'Hur hög kan en giraff bli?', 5.5, 1, 10, 0.1, 'm', { tol: 0.5 });
  N('23', 2, 'Hur många månader är en elefant dräktig?', 22, 3, 36, 1, 'månader', { tol: 1 });
  N('123', 1, 'Hur snabbt kan en gepard springa?', 110, 30, 200, 1, 'km/h', { tol: 10 });
  N('123', 2, 'Hur snabbt kan en struts springa?', 70, 10, 150, 1, 'km/h', { tol: 8 });
  N('123', 2, 'Hur långt kan en känguru hoppa i ett hopp?', 9, 1, 20, 0.5, 'm', { tol: 1 });
  N('3', 3, 'Hur gammal kan en grönlandshaj bli?', 400, 50, 800, 10, 'år', { tol: 60 });
  N('23', 2, 'Hur många hjärtan har en bläckfisk?', 3, 1, 10, 1, 'hjärtan', exact);
  N('3', 3, 'Ungefär hur många kilo mat äter en vuxen elefant per dag?', 150, 10, 400, 5, 'kg', { tol: 30 });
  N('0123', 1, 'Hur många ben har en hund?', 4, 0, 10, 1, 'ben', exact);

  // ───────── Tid & matte ─────────
  N('123', 1, 'Hur många sekunder är en timme?', 3600, 500, 10000, 10, 's', exact);
  N('123', 1, 'Hur många minuter är ett dygn?', 1440, 200, 3000, 10, 'min', exact);
  N('123', 1, 'Hur många timmar är en vecka?', 168, 50, 300, 1, 'timmar', exact);
  N('0123', 1, 'Hur många veckor har ett år?', 52, 20, 80, 1, 'veckor', exact);
  N('0123', 1, 'Hur många dagar har en vecka?', 7, 1, 15, 1, 'dagar', exact);
  N('123', 1, 'Vad är 12 × 12?', 144, 50, 250, 1, '', exact);
  N('123', 1, 'Vad är 15 % av 200?', 30, 0, 100, 1, '', exact);
  N('23', 2, 'Vad är 25 × 25?', 625, 300, 1000, 5, '', exact);
  N('123', 1, 'Hur många grader har en triangels vinklar tillsammans?', 180, 0, 400, 5, '°', exact);
  N('123', 1, 'Hur många grader är en rät vinkel?', 90, 0, 200, 5, '°', exact);
  N('0123', 1, 'Vad är 7 + 8?', 15, 0, 30, 1, '', exact);
  N('0123', 1, 'Vad är 9 × 9?', 81, 0, 150, 1, '', exact);
  N('23', 2, 'Hur mycket är 2 upphöjt till 10?', 1024, 100, 2000, 2, '', exact);
  N('123', 2, 'Hur mycket väger en liter vatten?', 1, 0, 5, 0.1, 'kg', { tol: 0.1 });

  // ───────── Sport ─────────
  N('23', 2, 'Hur långt är ett maratonlopp?', 42.2, 10, 100, 0.1, 'km', { tol: 0.4 });
  N('123', 2, 'Hur långt är Vasaloppet?', 90, 20, 200, 1, 'km', { tol: 3 });
  N('0123', 1, 'Hur många minuter är en vanlig fotbollsmatch (utan tillägg)?', 90, 30, 150, 5, 'min', exact);
  N('23', 2, 'Hur högt sitter en basketkorg?', 3.05, 1, 5, 0.05, 'm', { tol: 0.1 });
  N('3', 2, 'Hur många OS-guld vann Usain Bolt?', 8, 0, 20, 1, 'guld', exact);
  N('3', 3, 'Hur många världscupsegrar tog Ingemar Stenmark?', 86, 20, 150, 1, 'segrar', { tol: 3 });
  N('3', 3, 'Hur högt är världsrekordet i höjdhopp för herrar (Javier Sotomayor)?', 2.45, 1.5, 3.5, 0.01, 'm', { tol: 0.03 });
  N('3', 3, 'Hur snabbt sprang Usain Bolt 100 meter i sitt världsrekord?', 9.58, 8, 12, 0.01, 's', { tol: 0.05 });

  // ───────── Årtal ─────────
  Y('23', 2, 'Vilket år valdes Gustav Vasa till kung?', 1523);
  Y('3', 3, 'Vilket år var Stockholms blodbad?', 1520);
  Y('23', 2, 'Vilket år sjönk regalskeppet Vasa?', 1628);
  Y('23', 2, 'Vilket år gick Sverige med i EU?', 1995, 60);
  Y('3', 2, 'Vilket år bytte Sverige till högertrafik?', 1967, 60);
  Y('3', 3, 'Vilket år fick kvinnor rösta i ett riksdagsval för första gången i Sverige?', 1921, 80);
  Y('3', 2, 'Vilket år mördades Olof Palme?', 1986, 60);
  Y('3', 2, 'Vilket år sjönk färjan Estonia?', 1994, 60);
  Y('23', 2, 'Vilket år invigdes Öresundsbron?', 2000, 50);
  Y('3', 3, 'Vilket år blev Carl XVI Gustaf kung?', 1973, 60);
  Y('3', 2, 'Vilket år gifte sig kronprinsessan Victoria och Daniel?', 2010, 40);
  Y('123', 2, 'Vilket år vann ABBA Eurovision med "Waterloo"?', 1974, 60);
  Y('3', 3, 'Vilket år kördes det första Vasaloppet?', 1922, 100);
  Y('3', 2, 'Vilket år gick Sverige med i Nato?', 2024, 40);
  Y('3', 3, 'Vilket år bildades Kalmarunionen?', 1397, 200);
  Y('3', 3, 'Vilket år grundades Uppsala universitet?', 1477, 200);
  Y('3', 3, 'Vilket år nämns Stockholm för första gången i ett brev?', 1252, 200);
  Y('3', 3, 'Vilket år dog Karl XII?', 1718, 100);
  Y('3', 3, 'Vilket år slöts freden i Roskilde, då Skåne blev svenskt?', 1658, 100);
  Y('3', 3, 'Vilket år förlorade Sverige Finland till Ryssland?', 1809, 100);
  Y('3', 3, 'Vilket år upplöstes unionen mellan Sverige och Norge?', 1905, 100);
  Y('3', 3, 'Vilket år hölls den första Melodifestivalen?', 1959, 70);
  Y('123', 2, 'Vilket år kom den första boken om Pippi Långstrump?', 1945, 80);
  Y('23', 2, 'Vilket år grundades IKEA?', 1943, 80);
  Y('3', 3, 'Vilket år tillverkade Volvo sin första bil?', 1927, 80);
  Y('23', 2, 'Vilket år grundades Spotify?', 2006, 40);
  Y('123', 1, 'Vilket år kom den första iPhonen?', 2007, 40);
  Y('23', 2, 'Vilket år grundades Google?', 1998, 50);
  Y('23', 2, 'Vilket år startades Facebook?', 2004, 40);
  Y('23', 2, 'Vilket år startades YouTube?', 2005, 40);
  Y('123', 1, 'Vilket år landade människan på månen för första gången?', 1969, 80);
  Y('123', 1, 'Vilket år sjönk Titanic?', 1912, 100);
  Y('123', 1, 'Vilket år föll Berlinmuren?', 1989, 60);
  Y('23', 1, 'Vilket år började andra världskriget?', 1939, 80);
  Y('123', 2, 'Vilket år kom Columbus till Amerika?', 1492, 200);
  Y('123', 1, 'Vilket år kom den första Harry Potter-boken?', 1997, 50);
  Y('23', 2, 'Vilket år hade den första Star Wars-filmen premiär?', 1977, 60);
  Y('123', 2, 'Vilket år kom Toy Story, den första långfilmen helt gjord i dator?', 1995, 50);
  Y('3', 3, 'Vilket år kom Disneys "Snövit och de sju dvärgarna"?', 1937, 100);
  Y('123', 2, 'Vilket år kom det första Pokémon-spelet i Japan?', 1996, 50);
  Y('23', 2, 'Vilket år kom spelet Super Mario Bros.?', 1985, 50);
  Y('23', 2, 'Vilket år skapades spelet Tetris?', 1984, 50);
  Y('3', 2, 'Vilket år spelades fotbolls-VM i Sverige?', 1958, 80);
  Y('3', 3, 'Vilket år hölls de första olympiska vinterspelen?', 1924, 100);
  Y('3', 3, 'Vilket år ringde någon det första samtalet med en mobiltelefon?', 1973, 80);
  Y('3', 3, 'Vilket år blev Greta Thunberg känd för sin skolstrejk?', 2018, 30);
  Y('3', 3, 'Vilket år började man räkna med att jorden har 8 miljarder invånare?', 2022, 40);

  // ───────── Årtalsfrågorna i historia blir också "gissa årtalet" ─────────
  for (const q of window.QK_BANK.filter(x => x.g === 'artal')) {
    const y = +q.o[0]; if (!y) continue;
    if (!/^Vilket år /.test(q.q)) continue;
    Y(q.a, q.d, 'Gissa årtalet: ' + q.q.replace(/^Vilket år /, 'När '), y, y < 1000 ? 600 : y < 1800 ? 200 : 100);
  }
})();
