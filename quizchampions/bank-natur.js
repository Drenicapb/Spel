/* Quiz Champions – djur & natur, vetenskap & rymden, kroppen */
(function () {
  const { q, tf, gq } = window.QKB;

  // ═════════ DJUR ═════════
  const KLASS = ['Däggdjur','Fåglar','Fiskar','Kräldjur','Groddjur','Insekter','Spindeldjur','Blötdjur','Kräftdjur'];
  // [namn, klass, föda (V växtätare, K köttätare, A allätare, null = fråga inte), världsdel (null = fråga inte), åldrar för klassfrågan]
  const D = [
    ['lejonet','Däggdjur','K',null,'01'],['tigern','Däggdjur','K','Asien','01'],['giraffen','Däggdjur','V','Afrika','0'],['zebran','Däggdjur','V','Afrika','0'],
    ['flodhästen','Däggdjur','V','Afrika','01'],['gorillan','Däggdjur','V','Afrika','01'],['schimpansen','Däggdjur','A','Afrika','12'],['orangutangen','Däggdjur',null,'Asien','12'],
    ['jättepandan','Däggdjur','V','Asien','01'],['koalan','Däggdjur','V','Oceanien','01'],['kängurun','Däggdjur','V','Oceanien','01'],['näbbdjuret','Däggdjur',null,'Oceanien','23'],
    ['isbjörnen','Däggdjur','K',null,'01'],['brunbjörnen','Däggdjur','A',null,'01'],['vargen','Däggdjur','K',null,'01'],['räven','Däggdjur','A',null,'01'],
    ['älgen','Däggdjur','V',null,'0'],['rådjuret','Däggdjur','V',null,'0'],['delfinen','Däggdjur','K',null,'12'],['blåvalen','Däggdjur','K',null,'12'],
    ['sälen','Däggdjur','K',null,'12'],['valrossen','Däggdjur','K',null,'12'],['bävern','Däggdjur','V',null,'01'],['haren','Däggdjur','V',null,'0'],
    ['kamelen','Däggdjur','V',null,'01'],['laman','Däggdjur','V','Sydamerika','12'],['sengångaren','Däggdjur','V',null,'12'],['jaguaren','Däggdjur','K',null,'12'],
    ['geparden','Däggdjur','K',null,'01'],['hyenan','Däggdjur','K',null,'12'],['bisonoxen','Däggdjur','V',null,'12'],['tvättbjörnen','Däggdjur','A','Nordamerika','12'],
    ['fladdermusen','Däggdjur',null,null,'12'],['grisen','Däggdjur','A',null,'0'],['kon','Däggdjur','V',null,'0'],['hästen','Däggdjur','V',null,'0'],
    ['pingvinen','Fåglar','K',null,'01'],['strutsen','Fåglar',null,'Afrika','01'],['örnen','Fåglar','K',null,'0'],['ugglan','Fåglar','K',null,'0'],
    ['papegojan','Fåglar',null,null,'0'],['pelikanen','Fåglar','K',null,'01'],['kiwin','Fåglar',null,'Oceanien','23'],['emun','Fåglar',null,'Oceanien','23'],
    ['kråkan','Fåglar','A',null,'0'],['hönan','Fåglar','A',null,'0'],['svanen','Fåglar','V',null,'0'],['kolibrin','Fåglar',null,null,'01'],
    ['hajen','Fiskar','K',null,'01'],['laxen','Fiskar','K',null,'01'],['gäddan','Fiskar','K',null,'01'],['sjöhästen','Fiskar',null,null,'23'],
    ['ålen','Fiskar',null,null,'12'],['rockan','Fiskar',null,null,'12'],['clownfisken','Fiskar',null,null,'01'],
    ['krokodilen','Kräldjur','K',null,'12'],['ormen','Kräldjur','K',null,'12'],['ödlan','Kräldjur',null,null,'12'],['sköldpaddan','Kräldjur',null,null,'12'],
    ['huggormen','Kräldjur','K',null,'12'],['komodovaranen','Kräldjur','K','Asien','23'],['alligatorn','Kräldjur','K',null,'12'],['kameleonten','Kräldjur','K',null,'12'],
    ['grodan','Groddjur','K',null,'12'],['paddan','Groddjur','K',null,'12'],['salamandern','Groddjur',null,null,'23'],['axolotln','Groddjur',null,'Nordamerika','23'],
    ['biet','Insekter',null,null,'01'],['myran','Insekter',null,null,'01'],['fjärilen','Insekter',null,null,'01'],['nyckelpigan','Insekter','K',null,'01'],
    ['myggan','Insekter',null,null,'12'],['gräshoppan','Insekter',null,null,'12'],['trollsländan','Insekter',null,null,'12'],
    ['spindeln','Spindeldjur','K',null,'12'],['skorpionen','Spindeldjur','K',null,'23'],['fästingen','Spindeldjur',null,null,'23'],
    ['snigeln','Blötdjur',null,null,'23'],['bläckfisken','Blötdjur','K',null,'23'],['musslan','Blötdjur',null,null,'23'],
    ['krabban','Kräftdjur',null,null,'23'],['hummern','Kräftdjur',null,null,'23'],['räkan','Kräftdjur',null,null,'23'],
  ];
  const KOST = { V: 'Växtätare', K: 'Köttätare', A: 'Allätare' };
  const DELAR = ['Afrika','Asien','Oceanien','Sydamerika','Nordamerika','Europa'];
  const cap = s => s[0].toUpperCase() + s.slice(1);
  for (const [n, kl, kost, del, a] of D) {
    gq('djur', '0123'.slice(+a[0]), a.startsWith('0') ? 1 : 2, 'klass', `Vilken djurgrupp hör ${n} till?`, kl, KLASS, []);
    if (kost) q('djur', a.startsWith('0') ? '0123' : '123', kost === 'A' ? 2 : 1, `Är ${n} växtätare, köttätare eller allätare?`, KOST[kost], ...Object.values(KOST).filter(x => x !== KOST[kost]));
    if (del) gq('djur', a.startsWith('0') ? '0123' : '123', a.startsWith('0') ? 1 : 2, 'varldsdel', `I vilken världsdel lever ${n} naturligt?`, del, DELAR, []);
  }
  window.QK_BANK.filter(x => x.c === 'djur' && !x.g && x.q.startsWith('Är ')).forEach(x => x.g = 'kost');
  // Ungar
  const U = [['kon','Kalv'],['fåret','Lamm'],['geten','Killing'],['grisen','Kulting'],['katten','Kattunge'],['rådjuret','Kid'],['grodan','Grodyngel'],
    ['fjärilen','Larv'],['hönan','Kyckling'],['gåsen','Gässling'],['sälen','Kut'],['älgen','Kalv'],['ålen','Glasål']];
  const ungar = [...new Set(U.map(u => u[1])), 'Valp', 'Föl'];
  for (const [d, u] of U) gq('djur', ['sälen','ålen','gåsen'].includes(d) ? '23' : '012', ['sälen','ålen','gåsen'].includes(d) ? 2 : 1, 'unge', `Vad kallas ungen till ${d}?`, u, ungar, []);
  // Läten
  const LJ = [['hunden','Skäller'],['katten','Jamar'],['kon','Råmar'],['hästen','Gnäggar'],['fåret','Bräker'],['grisen','Grymtar'],['lejonet','Ryter'],['vargen','Ylar'],['ormen','Väser'],['biet','Surrar'],['ankan','Snattrar']];
  const ljud = LJ.map(l => l[1]);
  for (const [d, l] of LJ) gq('djur', '01', 1, 'lat', `Vad gör ${d} när det låter?`.replace('det låter', d.endsWith('n') ? 'den låter' : 'det låter'), l, ljud, []);

  // Handskrivna djur & natur
  q('djur','12',2,'Vilken fågel är snabbast i världen när den dyker?','Pilgrimsfalken','Örnen','Strutsen','Svalan');
  q('djur','12',2,'Vilken är världens största fisk?','Valhajen','Vithajen','Blåvalen','Laxen');
  q('djur','0',1,'Vilket djur är längst av alla djur på land? 🦒','Giraffen','Elefanten','Hästen','Björnen');
  q('djur','23',2,'Vilken är världens minsta fågel?','Bikolibrin','Kungsfågeln','Gråsparven','Blåmesen');
  q('djur','3',3,'Vilket ryggradsdjur kan bli äldst – flera hundra år?','Grönlandshajen','Elefanten','Papegojan','Krokodilen');
  q('djur','12',1,'Vad har kamelen i sin puckel?','Fett','Vatten','Luft','Mat');
  q('djur','12',2,'Hur långt kan en uggla vrida huvudet?','Ungefär tre fjärdedels varv','Ett helt varv','Inte alls','Ett kvarts varv');
  q('djur','23',2,'Vad är speciellt med näbbdjurets ungar?','De kläcks ur ägg','De föds i vattnet','De har fjädrar','De föds blinda och döva i flera år');
  q('djur','12',1,'Hur hittar fladdermöss i mörkret?','Med ekon av ljud','Med lysande ögon','Med luktsinnet','De flyger bara på dagen');
  q('djur','12',2,'Varför är flamingos rosa?','Av maten de äter','De föds rosa','Av solen','De målar sig');
  q('djur','23',2,'Vilken färg har giraffens tunga?','Mörkt blålila','Rosa','Grön','Gul');
  q('djur','01',1,'Vad gör björnen på vintern?','Går i ide och sover','Flyttar söderut','Bygger bo i träd','Simmar i havet');
  q('djur','01',1,'Vad kallas fåglar som flyger söderut på hösten?','Flyttfåglar','Stannfåglar','Sjöfåglar','Rovfåglar');
  q('djur','12',1,'Vilken av fåglarna är en flyttfågel?','Ladusvalan','Talgoxen','Gråsparven','Skatan');
  q('djur','12',1,'Vilken är Sveriges enda giftorm?','Huggormen','Snoken','Kopparödlan','Hasselsnoken');
  q('djur','23',2,'Vilket är Sveriges största rovdjur?','Brunbjörnen','Vargen','Lodjuret','Järven');
  q('djur','3',2,'Vilken är Sveriges största rovfågel?','Havsörnen','Kungsörnen','Berguven','Duvhöken');
  q('djur','12',1,'Vad kallas lodjurets och lejonets djurfamilj?','Kattdjur','Hunddjur','Mårddjur','Hjortdjur');
  q('djur','12',1,'Vilket djur hör till hunddjuren?','Vargen','Lodjuret','Bävern','Igelkotten');
  q('djur','12',1,'Vilket djur kan tappa svansen för att fly?','Ödlan','Musen','Katten','Ekorren');
  q('djur','23',2,'Hur andas fiskar?','Med gälar','Med lungor','Genom huden','Genom munnen bara');
  q('djur','23',2,'Hur andas valar?','Med lungor genom ett blåshål','Med gälar','Genom huden','De andas inte');
  q('djur','01',1,'Vad gör bina av nektar? 🐝','Honung','Vax','Mjölk','Socker');
  q('djur','12',2,'Hur berättar bin för varandra var maten finns?','De dansar','De sjunger','De ritar','De luktar på varandra');
  q('djur','12',2,'Med vad smakar fjärilar på saker?','Fötterna','Vingarna','Antennerna','Ögonen');
  q('djur','23',2,'Varför har elefanter så stora öron?','För att svalka sig','För att flyga','För att gömma sig','För att höra under vatten');
  q('djur','01',1,'Vad heter det som en spindel spinner? 🕸️','Spindelnät','Bikupa','Myrstack','Fågelbo');
  q('djur','0',1,'Var bor bina?','I en bikupa','I ett myrbo','I en håla','I vattnet');
  q('djur','0',1,'Vilket djur har ett skal på ryggen?','Sköldpaddan','Kaninen','Grodan','Fisken');
  q('djur','0',1,'Vilket djur hoppar och har en pung för sin unge?','Kängurun','Grodan','Haren','Ekorren');
  q('djur','0',1,'Vilken fågel kan inte flyga men simmar jättebra?','Pingvinen','Örnen','Svalan','Ugglan');
  q('djur','0',1,'Vilket djur har ränder? 🦓','Zebran','Lejonet','Elefanten','Björnen');
  q('djur','0',1,'Vilket djur har en lång snabel och stora öron?','Elefanten','Giraffen','Noshörningen','Flodhästen');
  q('djur','0',1,'Vad äter kaninen helst?','Morötter och gräs','Fisk','Kött','Godis');
  q('djur','0',1,'Var bor fiskar?','I vatten','I träd','I sand','I luften');
  q('djur','01',1,'Vad har fåglar som inga andra djur har?','Fjädrar','Ben','Ögon','Svans');
  q('djur','01',1,'Vilket djur bygger dammar i bäckar?','Bävern','Uttern','Älgen','Grävlingen');
  q('djur','12',2,'Vad kallas en hona till älgen?','Älgko','Hind','Sugga','Sto');
  q('djur','12',2,'Vad kallas en hona till hästen?','Sto','Ko','Tacka','Hind');
  q('djur','12',2,'Vad kallas en hane till grisen?','Galt','Bock','Tjur','Hingst');
  q('djur','12',2,'Vad kallas en hane till hästen?','Hingst','Galt','Bagge','Tupp');
  q('djur','12',2,'Vad kallas en hane till fåret?','Bagge','Bock','Galt','Tjur');
  q('djur','12',1,'Vilket trädslag har ollon?','Ek','Björk','Gran','Tall');
  q('djur','0',1,'Vilket träd har vit stam med svarta fläckar?','Björken','Granen','Eken','Tallen');
  q('djur','01',1,'Vilken svamp är giftig och röd med vita prickar? 🍄','Röd flugsvamp','Kantarell','Karljohan','Champinjon');
  q('djur','12',1,'Vilken gul svamp är populär att plocka och äta?','Kantarell','Röd flugsvamp','Vit flugsvamp','Gallsopp');
  q('djur','01',1,'Vilken blomma kommer tidigt på våren och är vit?','Vitsippan','Rosen','Solrosen','Tulpanen');
  q('djur','12',2,'Vad kallas regeln som ger alla rätt att vistas i naturen i Sverige?','Allemansrätten','Naturlagen','Friluftsregeln','Skogsrätten');
  q('djur','12',1,'Vilken årstid fäller många träd sina löv?','Hösten','Våren','Sommaren','Ingen');
  q('djur','23',2,'Vad kallas det när djur sover hela vintern?','Vinterdvala','Vintersömn','Flytt','Ruggning');
  q('djur','3',2,'Hur många ben har en hummer (gångben)?','10','8','6','12');
  q('djur','3',3,'Vilket däggdjur har tätast päls av alla?','Havsuttern','Isbjörnen','Myskoxen','Chinchillan');
  q('djur','3',2,'Vilket djur har störst hjärna av alla?','Kaskeloten','Elefanten','Människan','Blåvalen');
  q('djur','23',2,'Vad betyder ordet "orangutang" ungefär?','Skogens människa','Röd apa','Trädklättrare','Stor kusin');
  q('djur','3',2,'Vilken fågel lägger störst ägg?','Strutsen','Emun','Albatrossen','Kungsörnen');
  q('djur','23',1,'Vilket djur är känt för att sova hängande upp och ned?','Fladdermusen','Sengångaren','Ugglan','Apan');
  q('djur','12',2,'Hur många ögon har de flesta spindlar?','8','2','4','6');
  tf('djur','12',1,'Zebrans ränder är unika – ingen zebra har exakt samma mönster.',true);
  tf('djur','23',1,'Sjöhästen är en fisk.',true);
  tf('djur','23',2,'Hos sjöhästar är det hanen som bär ungarna.',true);
  tf('djur','12',1,'Spindlar är insekter.',false);
  tf('djur','01',1,'Delfiner andas luft.',true);
  tf('djur','23',2,'Strutsar gömmer huvudet i sanden när de blir rädda.',false);
  tf('djur','12',1,'Pingviner lever på Nordpolen.',false);
  tf('djur','3',2,'Bläckfiskar har blått blod.',true);

  // ═════════ VETENSKAP & RYMDEN ═════════
  const E = [['H','Väte',1],['He','Helium',1],['C','Kol',1],['N','Kväve',1],['O','Syre',1],['Na','Natrium',0],['Mg','Magnesium',0],['Al','Aluminium',0],
    ['Si','Kisel',0],['P','Fosfor',0],['S','Svavel',0],['Cl','Klor',0],['K','Kalium',0],['Ca','Kalcium',0],['Fe','Järn',1],['Cu','Koppar',1],['Zn','Zink',0],
    ['Ag','Silver',1],['Au','Guld',1],['Hg','Kvicksilver',0],['Pb','Bly',0],['Sn','Tenn',0],['U','Uran',0],['Ne','Neon',0],['Ni','Nickel',0],['Ti','Titan',0],
    ['I','Jod',0],['F','Fluor',0],['Li','Litium',0],['Pt','Platina',0],['Co','Kobolt',0],['Mn','Mangan',0],['Cr','Krom',0],['Ar','Argon',0],['Ra','Radium',0]];
  const namn = E.map(e => e[1]), sym = E.map(e => e[0]);
  for (const [s, n, lätt] of E) {
    if (s !== 'Au') gq('vet', lätt ? '23' : '3', lätt ? 2 : 3, 'amne', `Vilket grundämne har kemiska tecknet ${s}?`, n, namn, []);
    gq('vet', lätt ? '23' : '3', lätt ? 2 : 3, 'tecken', `Vilket kemiskt tecken har ${n.toLowerCase()}?`, s, sym, []);
  }
  const EN = [['ampere','Elektrisk ström'],['volt','Elektrisk spänning'],['watt','Effekt'],['newton','Kraft'],['joule','Energi'],['hertz','Frekvens'],['kelvin','Temperatur'],
    ['pascal','Tryck'],['decibel','Ljudnivå'],['knop','Fart till sjöss'],['ljusår','Avstånd i rymden'],['kilogram','Massa'],['sekund','Tid']];
  const storh = EN.map(e => e[1]);
  for (const [e, s] of EN) gq('vet', ['kilogram','sekund','decibel','ljusår'].includes(e) ? '123' : '3', ['kilogram','sekund'].includes(e) ? 1 : 2, 'enhet', `Vad mäts i enheten ${e}?`, s, storh, []);
  const IN = [['en barometer','Lufttryck'],['en seismograf','Jordbävningar'],['ett mikroskop','Mycket små saker'],['ett teleskop','Stjärnor och planeter'],['en hygrometer','Luftfuktighet'],
    ['en vindmätare','Vindens hastighet'],['en våg','Vikt'],['ett stoppur','Tid'],['ett stetoskop','Ljud från hjärta och lungor'],['en kompass','Väderstreck']];
  const anv = IN.map(i => i[1]);
  for (const [i, a] of IN) { const lätt = /våg|stoppur|kompass|mikroskop|teleskop/.test(i); gq('vet', lätt ? '0123' : '23', /våg|stoppur|kompass/.test(i) ? 1 : 2, 'instrument', `Vad använder man ${i} till?`, a, anv, []); }
  const PL = ['Merkurius','Venus','Jorden','Mars','Jupiter','Saturnus','Uranus','Neptunus'];
  const ORD = ['första','andra','tredje','fjärde','femte','sjätte','sjunde','åttonde'];
  PL.forEach((p, i) => { if (i !== 0) gq('vet', i === 2 ? '123' : '3', i === 2 ? 1 : 2, 'planetordning', `Vilken planet är den ${ORD[i]} från solen?`, p, PL, []); });

  q('vet','12',1,'Vilken planet är den varmaste i vårt solsystem?','Venus','Merkurius','Mars','Jupiter');
  q('vet','23',2,'Vilken planet ligger längst bort från solen?','Neptunus','Uranus','Pluto','Saturnus');
  q('vet','23',2,'Vad kallas Pluto numera?','Dvärgplanet','Planet','Måne','Komet');
  q('vet','3',2,'Vad heter Mars två månar?','Phobos och Deimos','Io och Europa','Titan och Rhea','Luna och Sol');
  q('vet','23',2,'Vad heter vår galax?','Vintergatan','Andromeda','Orion','Solsystemet');
  q('vet','3',2,'Vilken stor galax är vår närmaste stora granne?','Andromedagalaxen','Magellanska molnet','Sombrerogalaxen','Virvelgalaxen');
  q('vet','12',1,'Vad kallas det när månen hamnar framför solen så att det blir mörkt mitt på dagen?','Solförmörkelse','Månförmörkelse','Norrsken','Fullmåne');
  q('vet','01',1,'Vad kallas det när månen är helt rund och lyser?','Fullmåne','Nymåne','Halvmåne','Solnedgång');
  q('vet','12',1,'Vad heter den stora rymdstationen där astronauter bor?','ISS','NASA','Apollo','Sputnik');
  q('vet','23',2,'Vad hette den första satelliten i rymden (1957)?','Sputnik 1','Apollo 11','Hubble','Vostok');
  q('vet','23',2,'Vem var den första människan i rymden?','Jurij Gagarin','Neil Armstrong','Buzz Aldrin','Valentina Teresjkova');
  q('vet','3',2,'Vem var den första kvinnan i rymden?','Valentina Teresjkova','Sally Ride','Marie Curie','Christina Koch');
  q('vet','12',1,'Varför har vi årstider på jorden?','Jordaxeln lutar','Solen blir större och mindre','Månen skymmer solen','Jorden snurrar fortare');
  q('vet','23',2,'Vad är ett svart hål?','Ett område där inte ens ljus kan ta sig ut','En mörk planet','Ett hål i atmosfären','En utslocknad måne');
  q('vet','12',1,'Vad är en komet mest gjord av?','Is och damm','Guld','Eld','Glas');
  q('vet','01',1,'Vad kallas en stjärna som "faller" över himlen?','Stjärnfall','Regnbåge','Komet','Norrsken');
  q('vet','3',2,'Vilket teleskop skickades upp 2021 och tar bilder i infrarött ljus?','James Webb','Hubble','Kepler','Galileo');
  q('vet','0',1,'Vad behöver man ha på sig för att andas i rymden? 👩‍🚀','Rymddräkt','Regnjacka','Badbyxor','Mössa');
  q('vet','0',1,'Vad heter fordonet som åker ut i rymden? 🚀','Raket','Ubåt','Tåg','Buss');
  q('vet','01',1,'Vilka är de tre formerna vatten kan finnas i?','Is, vatten och ånga','Sand, vatten och luft','Snö, regn och sol','Is, eld och luft');
  q('vet','12',1,'Vad händer med is när den värms upp?','Den smälter','Den fryser','Den växer','Den blir hårdare');
  q('vet','12',1,'Vilka poler har en magnet?','Nordpol och sydpol','Plus och minus','Topp och botten','Varm och kall');
  q('vet','12',1,'Dras två magneters nordpoler till varandra?','Nej, de stöter bort varandra','Ja, de fastnar','Bara under vatten','Bara om de är av guld');
  q('vet','3',2,'Ungefär hur snabbt färdas ljuset?','300 000 km per sekund','300 km per sekund','3 000 km per timme','300 000 km per timme');
  q('vet','23',2,'Kan ljud färdas genom tomma rymden?','Nej, det behövs luft eller något annat','Ja, ännu snabbare','Ja, men långsammare','Bara högt ljud');
  q('vet','01',1,'Hur många färger brukar man säga att regnbågen har? 🌈','7','3','5','10');
  q('vet','12',1,'Vilka är de tre grundfärgerna i målarfärg?','Rött, gult och blått','Rött, grönt och blått','Svart, vitt och grått','Lila, orange och grönt');
  q('vet','12',1,'Vilket material leder elektricitet bäst?','Koppar','Gummi','Trä','Plast');
  q('vet','12',1,'Vilket material isolerar och skyddar mot elektricitet?','Gummi','Koppar','Järn','Aluminium');
  q('vet','23',2,'Vad är pH-värdet på rent vatten?','7','0','14','1');
  q('vet','23',1,'Är citronsaft surt eller basiskt?','Surt','Basiskt','Neutralt','Salt');
  q('vet','23',2,'Vad är kemiska formeln för vanligt bordssalt?','NaCl','H₂O','CO₂','O₂');
  q('vet','23',1,'Vilken gas andas vi ut och växterna tar upp?','Koldioxid','Syre','Väte','Helium');
  q('vet','12',1,'Varför flyter is på vatten?','Is är lättare än samma mängd vatten','Is är tyngre','Is innehåller salt','Vatten trycker upp allt');
  q('vet','01',1,'Vad behövs för att det ska bli en regnbåge?','Sol och regn','Snö och mörker','Vind och moln','Månsken');
  q('vet','01',1,'Vad kommer först – blixten eller åskan?','Blixten','Åskan','De kommer exakt samtidigt','Regnet');
  q('vet','12',2,'Hur många hörn (spetsar) har en snöflinga oftast?','6','4','5','8');
  q('vet','01',1,'Vad kallas regn som har frusit till iskulor?','Hagel','Dimma','Dagg','Snöblandat');
  q('vet','12',1,'Vad kallas moln som ligger nere vid marken?','Dimma','Åska','Dagg','Frost');
  q('vet','23',2,'Vad heter jordens innersta del?','Kärnan','Manteln','Skorpan','Atmosfären');
  q('vet','23',2,'Vad heter jordens yttersta, fasta lager?','Jordskorpan','Manteln','Kärnan','Ozonlagret');
  q('vet','3',2,'Vilken skala används för att mäta jordbävningars styrka?','Richterskalan','Beaufortskalan','Celsiusskalan','Mohs skala');
  q('vet','3',2,'Vad mäter Beaufortskalan?','Vindstyrka','Jordbävningar','Temperatur','Hårdhet');
  q('vet','3',2,'Vad mäter Mohs skala?','Mineralers hårdhet','Ljusstyrka','Ljudnivå','Lufttryck');
  q('vet','12',1,'Vilken dinosaurie hade jättestora tänder och korta armar?','Tyrannosaurus rex','Triceratops','Stegosaurus','Brachiosaurus');
  q('vet','12',1,'Vilken dinosaurie hade tre horn på huvudet?','Triceratops','Tyrannosaurus rex','Velociraptor','Diplodocus');
  q('vet','3',2,'För ungefär hur länge sedan dog dinosaurierna ut?','66 miljoner år','6 600 år','660 000 år','6 miljarder år');
  q('vet','23',2,'Vad tror forskarna orsakade att dinosaurierna dog ut?','En stor asteroid','En istid utan sol','Människor','Ett virus');
  q('vet','12',1,'Vad kallas rester av djur och växter som blivit sten?','Fossiler','Kristaller','Mineraler','Grottor');
  q('vet','23',2,'Vad innehåller DNA?','Arvsanlag (gener)','Vitaminer','Blodtyp','Muskler');
  q('vet','3',2,'Vem upptäckte penicillinet 1928?','Alexander Fleming','Louis Pasteur','Marie Curie','Robert Koch');
  q('vet','3',2,'Vem upptäckte radioaktiviteten tillsammans med makarna Curie?','Henri Becquerel','Albert Einstein','Niels Bohr','Isaac Newton');
  q('vet','23',2,'Vem upptäckte att jorden snurrar runt solen (inte tvärtom)?','Nikolaus Kopernikus','Aristoteles','Isaac Newton','Galileo Galilei');
  q('vet','12',1,'Vilken forskare sägs ha fått ett äpple i huvudet och funderat på tyngdkraften?','Isaac Newton','Albert Einstein','Charles Darwin','Galileo Galilei');
  q('vet','23',2,'Vem skrev om evolutionen i boken "Om arternas uppkomst"?','Charles Darwin','Carl von Linné','Gregor Mendel','Isaac Newton');
  q('vet','3',2,'Vilken temperatur är absoluta nollpunkten?','−273 °C','−100 °C','0 °C','−459 °C');
  q('vet','23',2,'Vad kallas en blandning av metaller, som brons?','Legering','Molekyl','Lösning','Kristall');
  q('vet','3',3,'Vilka två metaller blandas till mässing?','Koppar och zink','Järn och kol','Koppar och tenn','Guld och silver');
  q('vet','3',2,'Vilka metaller blandas till brons?','Koppar och tenn','Järn och kol','Koppar och zink','Aluminium och bly');
  q('vet','3',2,'Vad blandas järn med för att bli stål?','Kol','Guld','Zink','Aluminium');
  tf('vet','12',1,'Solen är en stjärna.',true);
  tf('vet','23',2,'Månen lyser med eget ljus.',false);
  tf('vet','12',1,'Jorden är rund som ett klot.',true);
  tf('vet','3',2,'Venus snurrar åt motsatt håll mot de flesta andra planeter.',true);
  tf('vet','23',2,'Det finns ingen tyngdkraft alls på den internationella rymdstationen.',false);
  tf('vet','3',2,'Diamant och grafit är båda gjorda av kol.',true);

  // ═════════ KROPPEN ═════════
  const OR = [['hjärtat','Pumpa runt blodet'],['lungorna','Ta in syre när vi andas'],['magsäcken','Bryta ner maten'],['njurarna','Rena blodet och göra urin'],
    ['levern','Rena blodet från gifter'],['hjärnan','Styra hela kroppen'],['tarmarna','Ta upp näring från maten'],['huden','Skydda kroppen'],
    ['urinblåsan','Samla urin'],['musklerna','Få kroppen att röra sig'],['skelettet','Hålla upp och skydda kroppen'],['bukspottkörteln','Tillverka insulin']];
  const funk = OR.map(o => o[1]);
  for (const [o, f] of OR) gq('kropp', ['hjärtat','lungorna','hjärnan','musklerna','skelettet','magsäcken'].includes(o) ? '0123' : '23', ['hjärtat','lungorna','hjärnan'].includes(o) ? 1 : 2, 'organ', `Vad är det viktigaste jobbet för ${o}?`, f, funk, []);
  const BEN = [['skallbenet','Huvudet'],['revbenen','Bröstkorgen'],['lårbenet','Låret'],['skenbenet','Underbenet'],['nyckelbenet','Mellan axeln och halsen'],
    ['bäckenet','Höften'],['ryggraden','Ryggen'],['käkbenet','Ansiktet vid munnen'],['knäskålen','Knät'],['skulderbladet','Övre delen av ryggen'],['hälbenet','Foten']];
  const plats = BEN.map(b => b[1]);
  for (const [b, p] of BEN) gq('kropp', ['skallbenet','revbenen','knäskålen','ryggraden'].includes(b) ? '123' : '23', 2, 'ben', `Var i kroppen sitter ${b}?`, p, plats, []);
  const VIT = [['C-vitamin','Apelsiner och paprika'],['D-vitamin','Fet fisk och solljus'],['A-vitamin','Morötter'],['järn','Rött kött och bönor'],['kalcium','Mjölk och ost'],['B12-vitamin','Kött, fisk och mejeriprodukter']];
  const kalla = VIT.map(v => v[1]);
  for (const [v, k] of VIT) gq('kropp', '23', 2, 'vitamin', `Var kan man få i sig mycket ${v}?`, k, kalla, []);

  q('kropp','0',1,'Hur många ögon har vi? 👀','2','1','3','4');
  q('kropp','0',1,'Hur många fingrar har vi på en hand? ✋','5','4','6','10');
  q('kropp','0',1,'Hur många tår har vi på båda fötterna tillsammans?','10','5','8','12');
  q('kropp','0',1,'Med vilken kroppsdel luktar vi? 👃','Näsan','Örat','Knät','Handen');
  q('kropp','0',1,'Med vilken kroppsdel ser vi?','Ögonen','Öronen','Näsan','Fötterna');
  q('kropp','0',1,'Vad ska man göra med tänderna varje morgon och kväll? 🪥','Borsta dem','Måla dem','Klippa dem','Tvätta dem med tvål');
  q('kropp','0',1,'Vad behöver kroppen mycket av varje natt för att orka? 😴','Sömn','Godis','Tv','Läsk');
  q('kropp','01',1,'Vilket nummer ringer man i Sverige om det är en nödsituation?','112','911','999','1177');
  q('kropp','12',1,'Vilket nummer ringer man i Sverige för sjukvårdsrådgivning?','1177','112','118 118','90 000');
  q('kropp','23',1,'Vad står HLR för?','Hjärt-lungräddning','Hjälp-livräddning','Hälsa-liv-ro','Hjärnans livsrytm');
  q('kropp','12',1,'Hur många lungor har vi?','2','1','3','4');
  q('kropp','12',1,'Hur många njurar har de flesta människor?','2','1','3','4');
  q('kropp','23',2,'Hur många revben har en människa normalt?','24','12','20','32');
  q('kropp','01',1,'Hur varm är kroppen normalt ungefär?','37 °C','30 °C','40 °C','25 °C');
  q('kropp','12',1,'Var kan man känna pulsen lätt?','På handleden','På knät','På näsan','På armbågen');
  q('kropp','23',2,'Vilka blodkroppar transporterar syre?','Röda blodkroppar','Vita blodkroppar','Blodplättar','Plasma');
  q('kropp','23',2,'Vilka blodkroppar bekämpar infektioner?','Vita blodkroppar','Röda blodkroppar','Blodplättar','Galla');
  q('kropp','23',2,'Vad gör blodplättarna?','Får blodet att levra sig när man skadar sig','Transporterar syre','Bekämpar virus','Gör blodet rött');
  q('kropp','3',2,'Vilka är de fyra vanligaste blodgrupperna?','A, B, AB och 0','A, B, C och D','1, 2, 3 och 4','X, Y, Z och 0');
  q('kropp','23',2,'Vilka sjukdomar fungerar antibiotika mot?','Bakterieinfektioner','Virusinfektioner','Allergier','Brutna ben');
  q('kropp','12',1,'Vad heter sprutan som skyddar mot sjukdomar?','Vaccin','Antibiotika','Plåster','Gips');
  q('kropp','3',2,'Vilken är kroppens största muskel?','Stora sätesmuskeln','Hjärtat','Tungan','Bicepsen');
  q('kropp','23',2,'Vad heter muskeln på framsidan av överarmen?','Biceps','Triceps','Quadriceps','Vad');
  q('kropp','3',2,'Ungefär hur många muskler har människokroppen?','Över 600','Ungefär 50','Ungefär 200','Över 5 000');
  q('kropp','12',1,'Vilka växer snabbast – fingernaglar eller tånaglar?','Fingernaglar','Tånaglar','Lika snabbt','Ingen av dem växer');
  q('kropp','12',1,'Varför svettas vi?','För att kyla ner kroppen','För att bli starkare','För att växa','För att sova');
  q('kropp','23',2,'Vilken muskel gör att vi får hicka när den krampar?','Mellangärdet','Hjärtat','Magmuskeln','Tungan');
  q('kropp','23',2,'Hur många grundsmaker kan tungan känna?','5','3','4','10');
  q('kropp','3',2,'Vad heter den femte grundsmaken förutom sött, surt, salt och beskt?','Umami','Kryddigt','Starkt','Fett');
  q('kropp','3',2,'Ungefär hur stor del av kroppens energi använder hjärnan?','20 %','2 %','50 %','80 %');
  q('kropp','23',2,'Vad heter cellerna som skickar signaler i hjärnan och nerverna?','Nervceller','Blodceller','Hudceller','Muskelceller');
  q('kropp','23',2,'Vad gör adrenalin i kroppen?','Gör oss redo för fara','Gör oss sömniga','Bygger skelett','Smälter maten');
  q('kropp','3',2,'Vilket hormon reglerar blodsockret?','Insulin','Adrenalin','Melatonin','Östrogen');
  q('kropp','3',2,'Vilket hormon gör oss sömniga när det blir mörkt?','Melatonin','Insulin','Adrenalin','Testosteron');
  q('kropp','23',2,'Vad heter de små luftblåsorna i lungorna?','Lungblåsor (alveoler)','Luftbubblor','Bronker','Gälar');
  q('kropp','12',1,'Vad finns i magsäcken som hjälper till att bryta ner maten?','Magsyra','Vatten','Blod','Luft');
  q('kropp','01',1,'Vad heter vätskan i munnen som hjälper oss att svälja?','Saliv','Svett','Tårar','Blod');
  q('kropp','12',1,'Vad heter tänderna längst fram i munnen?','Framtänder','Kindtänder','Hörntänder','Visdomständer');
  q('kropp','3',2,'Vilket är kroppens hårdaste ämne?','Tandemaljen','Skallbenet','Naglarna','Lårbenet');
  q('kropp','12',1,'Varför blinkar vi?','För att fukta och skydda ögonen','För att se bättre i mörker','För att vila hjärnan','För att höra bättre');
  q('kropp','12',1,'Vad heter den svarta pricken mitt i ögat?','Pupillen','Iris','Linsen','Näthinnan');
  q('kropp','23',2,'Vad hjälper glasögon mot om man är närsynt?','Att se saker långt bort','Att se saker nära','Att se färger','Att se i mörker');
  q('kropp','12',1,'Hur mycket bör ett barn i skolåldern sova per natt?','Ungefär 9–11 timmar','3 timmar','5 timmar','15 timmar');
  q('kropp','12',1,'Vad är bäst att dricka när man är törstig?','Vatten','Läsk','Saft','Energidryck');
  q('kropp','01',1,'Vad gör kroppen starkare och friskare?','Röra på sig','Sitta stilla hela dagen','Äta bara godis','Sova för lite');
  q('kropp','23',2,'Vad heter röret som maten åker ner genom till magen?','Matstrupen','Luftstrupen','Tarmen','Halsmandeln');
  q('kropp','3',2,'Hur lång är tunntarmen ungefär hos en vuxen?','Cirka 6 meter','Cirka 50 cm','Cirka 2 meter','Cirka 20 meter');
  q('kropp','23',2,'Vilket organ ligger under revbenen till höger och är kroppens största inre organ?','Levern','Mjälten','Magsäcken','Hjärtat');
  q('kropp','3',2,'Vad kallas ämnet som ger huden och håret dess färg?','Melanin','Keratin','Kollagen','Hemoglobin');
  q('kropp','3',2,'Vilket ämne i blodet gör det rött och binder syre?','Hemoglobin','Melanin','Insulin','Kalcium');
  q('kropp','3',2,'Vad består hår och naglar mest av?','Keratin','Kalcium','Kollagen','Järn');
  q('kropp','23',2,'Var i kroppen sitter balanssinnet?','I innerörat','I hälen','I magen','I ögat');
  tf('kropp','12',1,'Hjärtat sitter mitt i bröstet, lite åt vänster.',true);
  tf('kropp','23',2,'Tungan har olika zoner för sött, surt, salt och beskt.',false);
  tf('kropp','12',1,'Man ska tvätta händerna efter toalettbesök.',true);
  tf('kropp','3',2,'Vi använder bara 10 % av hjärnan.',false);
  tf('kropp','23',2,'Ett nyfött barn har fler ben än en vuxen.',true);
  tf('kropp','12',1,'Benen i kroppen är levande och kan läka.',true);
})();
