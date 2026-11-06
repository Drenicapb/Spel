/* Quiz Champions – språk & ord */
(function () {
  const { q, tf, gq } = window.QKB;
  // [svenska, engelska, nivå 0–2, grupp för liknande felsvar]
  const EN = [
    ['häst','horse',0,'djur'],['ko','cow',0,'djur'],['fisk','fish',0,'djur'],['fågel','bird',0,'djur'],['mus','mouse',0,'djur'],['gris','pig',0,'djur'],['kyckling','chicken',1,'djur'],
    ['äpple','apple',0,'mat'],['banan','banana',0,'mat'],['bröd','bread',0,'mat'],['ost','cheese',1,'mat'],['mjölk','milk',0,'mat'],['vatten','water',0,'mat'],['ägg','egg',0,'mat'],
    ['röd','red',0,'farg'],['blå','blue',0,'farg'],['grön','green',0,'farg'],['gul','yellow',0,'farg'],['svart','black',0,'farg'],['vit','white',0,'farg'],
    ['ett','one',0,'tal'],['två','two',0,'tal'],['tre','three',0,'tal'],['fyra','four',0,'tal'],['fem','five',0,'tal'],['tio','ten',0,'tal'],['tjugo','twenty',1,'tal'],
    ['mamma','mother',0,'familj'],['pappa','father',0,'familj'],['bror','brother',1,'familj'],['syster','sister',1,'familj'],['flicka','girl',0,'familj'],['pojke','boy',0,'familj'],['vän','friend',1,'familj'],
    ['hus','house',0,'sak'],['bil','car',0,'sak'],['boll','ball',0,'sak'],['bok','book',0,'sak'],['stol','chair',1,'sak'],['bord','table',1,'sak'],['säng','bed',0,'sak'],['dörr','door',1,'sak'],
    ['fönster','window',1,'sak'],['nyckel','key',2,'sak'],['väska','bag',1,'sak'],['paraply','umbrella',2,'sak'],['kudde','pillow',2,'sak'],['gaffel','fork',2,'sak'],['sked','spoon',2,'sak'],['kniv','knife',2,'sak'],
    ['sol','sun',0,'natur'],['måne','moon',0,'natur'],['stjärna','star',0,'natur'],['träd','tree',0,'natur'],['blomma','flower',0,'natur'],['regn','rain',1,'natur'],['snö','snow',1,'natur'],
    ['vind','wind',1,'natur'],['hav','sea',1,'natur'],['skog','forest',2,'natur'],['berg','mountain',2,'natur'],
    ['huvud','head',0,'kropp'],['öga','eye',0,'kropp'],['öra','ear',0,'kropp'],['näsa','nose',0,'kropp'],['mun','mouth',1,'kropp'],['fot','foot',1,'kropp'],['ben','leg',1,'kropp'],['tand','tooth',2,'kropp'],
    ['sommar','summer',1,'tid'],['vinter','winter',1,'tid'],['höst','autumn',2,'tid'],['vår','spring',2,'tid'],['morgon','morning',1,'tid'],['kväll','evening',2,'tid'],['natt','night',1,'tid'],['söndag','Sunday',1,'tid'],
    ['flygplan','airplane',1,'fordon'],['cykel','bicycle',1,'fordon'],['tåg','train',1,'fordon'],['båt','boat',0,'fordon'],
    ['glad','happy',0,'adj'],['ledsen','sad',0,'adj'],['stor','big',0,'adj'],['liten','small',0,'adj'],['varm','hot',1,'adj'],['kall','cold',1,'adj'],['snabb','fast',1,'adj'],['trött','tired',2,'adj'],
  ];
  const AGE = ['012', '123', '23'];
  const enBy = g => EN.filter(e => e[3] === g).map(e => e[1]), svBy = g => EN.filter(e => e[3] === g).map(e => e[0]);
  EN.forEach(([sv, en, l, g], i) => {
    if (i % 2 === 0) gq('sprak', AGE[l], l + 1, 'engelska', `Vad heter "${sv}" på engelska?`, en, enBy(g), EN.map(e => e[1]));
    else gq('sprak', AGE[l], l + 1, 'engelska-sv', `Vad betyder engelska ordet "${en}"?`, sv, svBy(g), EN.map(e => e[0]));
  });
  const ES = [['tack','gracias'],['hund','perro'],['katt','gato'],['hus','casa'],['vatten','agua'],['bok','libro'],['röd','rojo'],['svart','negro'],['stor','grande'],
    ['ett','uno'],['två','dos'],['tre','tres'],['fem','cinco'],['måne','luna'],['mamma','madre'],['pappa','padre'],['vän','amigo'],['god morgon','buenos días'],
    ['god natt','buenas noches'],['hejdå','adiós'],['ja','sí'],['apelsin','naranja'],['bröd','pan'],['kyckling','pollo'],['strand','playa'],['kärlek','amor'],['skola','escuela'],
    ['grön','verde'],['blå','azul'],['gul','amarillo'],['vit','blanco'],['stad','ciudad'],['hav','mar'],['kall','frío']];
  const esW = ES.map(e => e[1]);
  for (const [sv, es] of ES) gq('sprak', ['tack','ett','två','tre','ja','hejdå','vän','mamma'].includes(sv) ? '123' : '23', 2, 'spanska', `Vad heter "${sv}" på spanska?`, es, esW, []);
  const FR = [['hej','bonjour'],['hejdå','au revoir'],['ja','oui'],['nej','non'],['hund','chien'],['katt','chat'],['hus','maison'],['vatten','eau'],['bröd','pain'],['äpple','pomme'],
    ['ost','fromage'],['röd','rouge'],['blå','bleu'],['vit','blanc'],['svart','noir'],['en','un'],['två','deux'],['tre','trois'],['fyra','quatre'],['fem','cinq'],['mamma','mère'],
    ['pappa','père'],['vän','ami'],['flicka','fille'],['pojke','garçon'],['kärlek','amour'],['sol','soleil'],['måne','lune'],['stjärna','étoile'],['bok','livre'],['skola','école'],['bil','voiture'],['god natt','bonne nuit']];
  const frW = FR.map(f => f[1]);
  for (const [sv, fr] of FR) gq('sprak', ['hej','hejdå','ja','nej','en','två','tre'].includes(sv) ? '123' : '23', 2, 'franska', `Vad heter "${sv}" på franska?`, fr, frW, []);
  const DE = [['god dag','guten Tag'],['tack','danke'],['hejdå','auf Wiedersehen'],['katt','Katze'],['hus','Haus'],['vatten','Wasser'],['bröd','Brot'],['äpple','Apfel'],['ost','Käse'],
    ['röd','rot'],['blå','blau'],['svart','schwarz'],['vit','weiß'],['en','eins'],['två','zwei'],['tre','drei'],['fyra','vier'],['fem','fünf'],['mamma','Mutter'],['pappa','Vater'],
    ['flicka','Mädchen'],['pojke','Junge'],['kärlek','Liebe'],['sol','Sonne'],['måne','Mond'],['stjärna','Stern'],['bok','Buch'],['skola','Schule'],['bil','Auto'],['kyrka','Kirche'],
    ['ekorre','Eichhörnchen'],['fjäril','Schmetterling'],['sjukhus','Krankenhaus']];
  const deW = DE.map(d => d[1]);
  for (const [sv, de] of DE) gq('sprak', ['tack','en','två','tre'].includes(sv) ? '123' : '23', 2, 'tyska', `Vad heter "${sv}" på tyska?`, de, deW, []);
  // Motsatser
  const MOT = [['snabb','långsam'],['hög','låg'],['lång','kort'],['tung','lätt'],['ljus','mörk'],['ny','gammal'],['våt','torr'],['full','tom'],['öppen','stängd'],['mjuk','hård'],
    ['rik','fattig'],['början','slut'],['upp','ner'],['dag','natt'],['stark','svag'],['ren','smutsig'],['tyst','högljudd'],['först','sist'],['vänster','höger'],['aldrig','alltid'],
    ['många','få'],['gråta','skratta'],['köpa','sälja'],['ge','ta'],['vinna','förlora'],['börja','sluta'],['somna','vakna'],['framför','bakom'],['ung','gammal'],['frisk','sjuk'],['dyr','billig'],['bred','smal']];
  const motW = [...new Set(MOT.map(m => m[1]))];
  for (const [a, b] of MOT) gq('sprak', ['snabb','hög','ljus','våt','full','öppen','upp','dag','ren','vänster','gråta','vinna','frisk','dyr'].includes(a) ? '012' : '123', 1, 'motsats', `Vad är motsatsen till "${a}"?`, b, motW, []);
  // Synonymer
  const SYN = [['arg','ilsken'],['rädd','skrämd'],['snabb','kvick'],['stor','enorm'],['vacker','vacker som en dag – snygg'],['smart','klok'],['trött','utmattad'],['konstig','märklig'],
    ['rolig','kul'],['börja','starta'],['prata','tala'],['titta','se'],['springa','rusa'],['hjälpa','bistå'],['ledsen','nedstämd'],['modig','tapper'],['lat','slö'],['liten','pytteliten'],['dum','korkad'],['tyst','ljudlös']];
  SYN[4] = ['vacker','snygg'];
  const synW = SYN.map(s => s[1]);
  for (const [a, b] of SYN) gq('sprak', ['arg','rolig','börja','prata','titta','liten','tyst','stor'].includes(a) ? '123' : '23', 2, 'synonym', `Vilket ord betyder ungefär samma sak som "${a}"?`, b, synW, []);
  // Rim
  const RIM = [['hund','stund'],['bil','fil'],['hus','mus'],['boll','troll'],['fisk','disk'],['ko','sko'],['sten','ben'],['ros','nos'],['säng','äng'],['björn','hörn'],
    ['sked','led'],['tand','sand'],['gris','is'],['ost','rost'],['kaka','smaka']];
  const ejRim = ['bord','lampa','katt','sol','glass','träd','båt','mössa','pinne','stol','apa','vante','gurka'];
  for (const [a, b] of RIM) gq('sprak', '01', 1, 'rim', `Vilket ord rimmar på "${a}"?`, b, ejRim, []);
  // Uttryck
  const UTT = [['ha en räv bakom örat','Vara listig'],['gå som katten kring het gröt','Undvika att säga något rakt ut'],['slå två flugor i en smäll','Klara två saker på en gång'],
    ['sätta kaffet i halsen','Bli väldigt förvånad'],['det är ingen ko på isen','Det är ingen fara'],['ha is i magen','Vara lugn och inte stressa'],['köpa grisen i säcken','Köpa något utan att kontrollera det'],
    ['ta sig vatten över huvudet','Ta på sig mer än man klarar'],['lägga rabarber på något','Ta något för sig själv'],['vara ute och cykla','Ha helt fel'],['dra alla över en kam','Behandla alla lika utan hänsyn'],
    ['ha många järn i elden','Hålla på med många saker samtidigt'],['gå över ån efter vatten','Krångla till något i onödan'],['ha tummen mitt i handen','Vara klumpig'],
    ['prata i nattmössan','Prata strunt'],['kasta in handduken','Ge upp'],['hålla tummarna','Önska lycka till'],['få kalla fötter','Ångra sig och bli rädd'],
    ['sitta på två stolar','Försöka hålla på båda sidor'],['visa var skåpet ska stå','Bestämma'],['vända kappan efter vinden','Ändra åsikt efter vad som lönar sig'],['vara lugn som en filbunke','Vara mycket lugn']];
  const uttB = UTT.map(u => u[1]);
  for (const [u, b] of UTT) gq('sprak', ['hålla tummarna','kasta in handduken','ha tummen mitt i handen','vara lugn som en filbunke','slå två flugor i en smäll'].includes(u) ? '123' : '23', 2, 'uttryck', `Vad betyder uttrycket "att ${u}"?`, b, uttB, []);
  // Ordklasser
  const OK = [['springa','Verb'],['hoppa','Verb'],['äta','Verb'],['skriva','Verb'],['sova','Verb'],['bil','Substantiv'],['hund','Substantiv'],['stol','Substantiv'],['glädje','Substantiv'],
    ['skola','Substantiv'],['snabb','Adjektiv'],['röd','Adjektiv'],['glad','Adjektiv'],['mjuk','Adjektiv'],['vacker','Adjektiv'],['under','Preposition'],['bakom','Preposition'],['på','Preposition'],
    ['efter','Preposition'],['mellan','Preposition'],['tre','Räkneord'],['tjugo','Räkneord'],['hon','Pronomen'],['vi','Pronomen'],['och','Konjunktion'],['men','Konjunktion']];
  const ordkl = [...new Set(OK.map(o => o[1]))];
  for (const [o, k] of OK) gq('sprak', ['Verb','Substantiv','Adjektiv'].includes(k) ? '123' : '23', ['Verb','Substantiv','Adjektiv'].includes(k) ? 1 : 2, 'ordklass', `Vilken ordklass hör ordet "${o}" till?`, k, ordkl, []);
  // Plural
  const PL = [['en mus','möss','musar','muser','mössar'],['en gås','gäss','gåsar','gåser','gässar'],['en tand','tänder','tandar','tänner','tander'],['en fot','fötter','fotar','föter','fotter'],
    ['en bok','böcker','bokar','boker','böckar'],['en man','män','manar','männer','mannar'],['ett öga','ögon','ögar','ögonen','öger'],['ett öra','öron','örar','öre','örer'],
    ['en hand','händer','handar','hander','händar'],['en bonde','bönder','bondar','bonder','böndar'],['en natt','nätter','nattar','natter','nätt'],['en stad','städer','stadar','stader','städar'],
    ['en bror','bröder','brorar','broder','bröderar'],['en dotter','döttrar','dotterar','döttrer','dottrar'],['ett finger','fingrar','fingerar','fingrer','fingren'],['en ko','kor','koer','kossor','kon']];
  for (const [s, ok, ...w] of PL) q('sprak', ['en mus','en tand','en fot','en bok','en hand','ett öga'].includes(s) ? '0123' : '123', 2, `Vad heter "${s}" i plural (flera)?`, ok, ...w.slice(0, 3));
  window.QK_BANK.filter(x => x.c === 'sprak' && x.q.includes('i plural')).forEach(x => x.g = 'plural');
  // Alfabetet
  const ABC = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ'.split('');
  for (const ch of ['B','D','F','H','K','M','P','R','T','V','X','Å']) {
    const i = ABC.indexOf(ch), ok = ABC[i + 1];
    gq('sprak', '01', 1, 'alfabet', `Vilken bokstav kommer efter ${ch} i alfabetet?`, ok, [ABC[i - 1], ABC[i + 2], ABC[i + 3], ABC[i - 2]].filter(Boolean), ABC);
  }
  // Svåra ord
  const ORD = [['kverulant','Person som klagar mycket'],['flegmatisk','Lugn och lite trög'],['efemär','Kortvarig'],['prokrastinera','Skjuta upp saker'],['pompös','Högtidlig och uppblåst'],
    ['lakonisk','Kortfattad'],['abdikera','Avsäga sig tronen'],['ambivalent','Kluven, åt två håll'],['empati','Förmåga att känna med andra'],['filantrop','Person som skänker pengar till goda ändamål'],
    ['nostalgi','Längtan tillbaka till förr'],['ironi','Att säga motsatsen till det man menar'],['pseudonym','Påhittat namn'],['anonym','Utan namn'],['utopi','Idealsamhälle som inte finns'],
    ['altruism','Osjälviskhet'],['eufemism','Förskönande omskrivning'],['tautologi','Att säga samma sak två gånger'],['onomatopoetisk','Låter som det betyder'],['akronym','Ord bildat av begynnelsebokstäver'],
    ['hypokondriker','Person som ofta tror sig vara sjuk'],['nepotism','Att gynna släkt och vänner'],['ekvivalent','Likvärdig'],['sporadisk','Då och då']];
  const ordB = ORD.map(o => o[1]);
  for (const [o, b] of ORD) gq('sprak', ['empati','nostalgi','ironi','anonym','pseudonym'].includes(o) ? '23' : '3', ['empati','anonym'].includes(o) ? 2 : 3, 'ord', `Vad betyder ordet "${o}"?`, b, ordB, []);
  // Officiella språk
  const SP = [['Mexiko','Spanska'],['Österrike','Tyska'],['Egypten','Arabiska'],['Iran','Persiska'],['Israel','Hebreiska'],['Pakistan','Urdu'],['Argentina','Spanska'],['Angola','Portugisiska'],
    ['Senegal','Franska'],['Moçambique','Portugisiska'],['Jamaica','Engelska'],['Surinam','Nederländska'],['Brasilien','Portugisiska']];
  const spr = [...new Set([...SP.map(s => s[1]), 'Italienska', 'Turkiska'])];
  for (const [l, s] of SP) if (l !== 'Brasilien') gq('sprak', ['Mexiko','Österrike','Argentina'].includes(l) ? '123' : '3', ['Mexiko','Österrike'].includes(l) ? 1 : 2, 'sprakland', `Vilket är det officiella språket i ${l}?`, s, spr, []);

  q('sprak','23',2,'Vilket alfabet använder man för att skriva ryska?','Kyrilliska alfabetet','Latinska alfabetet','Grekiska alfabetet','Arabiska alfabetet');
  q('sprak','3',2,'Vilket språk skrivs med tecknen hangul?','Koreanska','Japanska','Kinesiska','Thailändska');
  q('sprak','23',2,'Vilket av språken skrivs från höger till vänster?','Arabiska','Ryska','Grekiska','Finska');
  q('sprak','3',2,'Vad heter de kinesiska tecknen som används i japansk skrift?','Kanji','Hangul','Emoji','Kana-kod');
  q('sprak','3',2,'Vilket språk ligger närmast svenska?','Norska','Finska','Isländska','Tyska');
  q('sprak','3',2,'Vilket språk är finska släkt med?','Estniska','Svenska','Ryska','Norska');
  q('sprak','3',2,'Hur många officiella språk har Schweiz?','4','2','3','5');
  q('sprak','23',2,'Vilka två officiella språk har Finland?','Finska och svenska','Finska och ryska','Finska och samiska','Svenska och norska');
  q('sprak','23',1,'Vad heter tecknet @ på svenska?','Snabel-a','Kringla','Snurr-a','Apa');
  q('sprak','12',1,'Vad heter tecknet # som används på sociala medier?','Hashtag','Snabel-a','Asterisk','Paragraf');
  q('sprak','3',2,'Vad heter tecknet § ?','Paragraftecken','Et-tecken','Asterisk','Tilde');
  q('sprak','3',2,'Vad heter tecknet & ?','Et-tecken','Paragraf','Snabel-a','Hashtag');
  q('sprak','01',1,'Vilken bokstav börjar ordet "elefant" med?','E','A','L','F');
  q('sprak','0',1,'Vilket ord börjar på samma ljud som "sol"?','Sås','Mås','Bil','Hus');
  q('sprak','0',1,'Hur många bokstäver har ordet "katt"?','4','3','5','2');
  q('sprak','0',1,'Hur många bokstäver har ordet "banan"?','5','4','6','3');
  q('sprak','01',1,'Vilket av orden är ett djur?','Giraff','Gaffel','Gardin','Gurka');
  q('sprak','01',1,'Vilket av orden är en färg?','Lila','Lampa','Lera','Lapp');
  q('sprak','12',1,'Vad kallas ord som betyder samma sak?','Synonymer','Motsatsord','Rim','Verb');
  q('sprak','12',1,'Vad kallas ord med motsatt betydelse?','Antonymer (motsatsord)','Synonymer','Homonymer','Palindromer');
  q('sprak','12',2,'Vad kallas ord som stavas likadant men betyder olika, som "fil" (i trafiken och att äta)?','Homonymer','Synonymer','Antonymer','Akronymer');
  q('sprak','23',2,'Vilket av orden är ett palindrom?','Sirap i Paris','Glass','Banan','Kanal');
  q('sprak','23',2,'Vilket ord är en sammansättning (sammansatt ord)?','Fotboll','Glad','Springa','Under');
  q('sprak','12',1,'Vilket tecken sätter man i slutet av en fråga?','Frågetecken','Punkt','Komma','Kolon');
  q('sprak','12',1,'Vad heter tecknet man sätter efter ett utrop?','Utropstecken','Frågetecken','Semikolon','Punkt');
  q('sprak','3',2,'Vilket är världens mest talade språk om man räknar alla som kan det?','Engelska','Mandarin','Spanska','Hindi');
  q('sprak','3',2,'Vilket språk talas av flest som modersmål i Europa?','Ryska','Tyska','Franska','Engelska');
  q('sprak','23',2,'Från vilket språk kommer ordet "kindergarten"?','Tyska','Engelska','Holländska','Danska');
  q('sprak','23',2,'Från vilket språk kommer ordet "ombudsman" som används i engelskan?','Svenska','Norska','Tyska','Danska');
  q('sprak','3',2,'Vad betyder latinets "carpe diem"?','Fånga dagen','Vi ses snart','Ära åt Gud','Kunskap är makt');
  q('sprak','3',2,'Vad betyder förkortningen "t.ex."?','Till exempel','Text extra','Tack exakt','Till extra');
  q('sprak','3',2,'Vad betyder förkortningen "bl.a."?','Bland annat','Bland alla','Blått allt','Bli av');
  q('sprak','23',2,'Vad betyder förkortningen "OSA" på en inbjudan?','Om svar anhålles','Om sjukdom avstår','Ordna sittplatser alla','Officiell sammankomst');
  q('sprak','3',2,'Vad är ett ordspråk?','Ett känt kort talesätt med en visdom','Ett långt ord','Ett ord på ett annat språk','En sorts dikt med rim');
  q('sprak','3',2,'Vad betyder ordspråket "Borta bra men hemma bäst"?','Det är skönt att komma hem','Man ska aldrig resa','Det är bäst att vara borta','Hemma är tråkigt');
  q('sprak','3',2,'Vad betyder ordspråket "Den som gapar efter mycket mister ofta hela stycket"?','Den som vill ha för mycket kan förlora allt','Man ska äta mycket','Det är bra att gapa','Den som pratar mest vinner');
  q('sprak','3',2,'Vad betyder ordspråket "Lika barn leka bäst"?','Människor som liknar varandra trivs ihop','Barn ska leka','Alla barn är lika','Lek är viktigt');
  q('sprak','3',2,'Vad betyder ordspråket "Ingen ko på isen"?','Ingen fara','Det är halt','Det är vinter','Korna är ute');
  tf('sprak','12',1,'W räknas som en egen bokstav i det svenska alfabetet sedan 2006.',true);
  tf('sprak','23',2,'Isländska är det nordiska språk som har förändrats minst sedan vikingatiden.',true);
  tf('sprak','3',2,'Engelska har fler modersmålstalare än spanska.',false);
})();
