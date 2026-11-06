/* Quiz Champions – historia */
(function () {
  const { q, tf, gq, rand } = window.QKB;
  // Årtalsfrågor: felsvaren är år nära det rätta
  const yearQ = (a, d, text, y) => {
    const steps = y < 1000 ? [10, 20, 50, 100, 200] : y < 1800 ? [5, 10, 20, 30, 50, 100] : [1, 2, 3, 5, 7, 10, 15, 20];
    const wrong = new Set();
    let guard = 0;
    while (wrong.size < 3 && guard++ < 50) {
      const v = y + (rand() < 0.5 ? -1 : 1) * steps[Math.floor(rand() * steps.length)];
      if (v !== y && v > 0 && v <= 2026) wrong.add(String(v));
    }
    window.QK_BANK.push({ c: 'hist', a, d, g: 'artal', q: text, o: [String(y), ...wrong] });
  };
  const AR = [
    ['3',2,'Vilket år började franska revolutionen?',1789],['3',2,'Vilket år skrev USA under sin självständighetsförklaring?',1776],
    ['23',2,'Vilket år började första världskriget?',1914],['23',1,'Vilket år tog andra världskriget slut?',1945],['3',2,'Vilket år byggdes Berlinmuren?',1961],
    ['3',2,'Vilket år återförenades Väst- och Östtyskland?',1990],['3',2,'Vilket år upplöstes Sovjetunionen?',1991],['3',2,'Vilket år var Jurij Gagarin den förste i rymden?',1961],
    ['3',3,'Vilket år skrevs Magna Carta i England?',1215],['3',3,'Vilket år var slaget vid Hastings?',1066],['3',3,'Vilket år brukar räknas som slutet för Västromerska riket?',476],
    ['3',3,'Vilket år kröntes Karl den store till kejsare?',800],['3',2,'Vilket år spikade Martin Luther upp sina 95 teser?',1517],['3',3,'Vilket år började amerikanska inbördeskriget?',1861],
    ['3',2,'Vilket år blev Indien självständigt?',1947],['3',3,'Vilket år utropades Folkrepubliken Kina?',1949],['23',2,'Vilket år bildades FN?',1945],
    ['3',2,'Vilket år började man använda eurosedlar och euromynt?',2002],['3',2,'Vilket år flög bröderna Wright för första gången?',1903],
    ['3',3,'Vilket år gav Charles Darwin ut "Om arternas uppkomst"?',1859],['3',2,'Vilket år var slaget vid Waterloo?',1815],['3',3,'Vilket år kom skeppet Mayflower till Amerika?',1620],
    ['3',2,'Vilket år delades det första Nobelpriset ut?',1901],['3',2,'Vilket år hölls de första moderna olympiska spelen?',1896],['23',2,'Vilket år hölls sommar-OS i Stockholm?',1912],
    ['3',2,'Vilket år stod Eiffeltornet klart?',1889],['3',3,'Vilket år invigdes Frihetsgudinnan i New York?',1886],['3',3,'Vilket år öppnade Panamakanalen?',1914],['3',3,'Vilket år öppnade Suezkanalen?',1869],
    ['23',2,'Vilket år blev Gustav Vasa kung?',1523],['3',2,'Vilket år inträffade Stockholms blodbad?',1520],['3',3,'Vilket år blev Skåne svenskt genom freden i Roskilde?',1658],
    ['3',2,'Vilket år var slaget vid Poltava?',1709],['3',2,'Vilket år dog Karl XII?',1718],['3',3,'Vilket år grundades Uppsala universitet?',1477],
    ['3',3,'Vilket år blev Sverige medlem i FN?',1946],['23',2,'Vilket år öppnade Öresundsbron?',2000],['3',2,'Vilket år släpptes Nelson Mandela ur fängelset?',1990],
    ['3',2,'Vilket år höll Martin Luther King Jr. talet "I have a dream"?',1963],['23',1,'Vilket år förklarade WHO att covid-19 var en pandemi?',2020],
    ['3',2,'Vilket år hölls det första fotbolls-VM?',1930],['3',2,'Ungefär vilket år kom Leif Eriksson till Nordamerika?',1000],
    ['3',3,'Vilket år plundrade vikingar klostret Lindisfarne – vikingatidens början?',793],['3',2,'Vilket år avskaffades slaveriet i hela USA?',1865],
    ['3',2,'Vilket år anföll Japan Pearl Harbor?',1941],['3',2,'Vilket år var D-dagen i Normandie?',1944],['3',3,'Vilket år var Kubakrisen?',1962],
    ['3',2,'Vilket år inträffade kärnkraftsolyckan i Tjernobyl?',1986],['3',2,'Vilket år lämnade Storbritannien EU?',2020],['3',3,'Vilket år grundades Svenska Akademien?',1786],
    ['3',3,'Vilket år bildades Kalmarunionen?',1397],['3',2,'Vilket år förlorade Sverige Finland till Ryssland?',1809],['3',2,'Vilket år upplöstes unionen mellan Sverige och Norge?',1905],
    ['3',3,'Vilket år var Sveriges senaste krig?',1814],['3',3,'Vilket år deltog Sverige första gången i Eurovision?',1958],['3',3,'Vilket år blev riksdagen en enkammarriksdag?',1971],
    ['3',2,'Vilket år började Sveriges Television sända regelbundet?',1956],['23',2,'Vilket år kom den första Harry Potter-boken?',1997],['3',2,'Vilket år föddes kronprinsessan Victoria?',1977],
  ];
  for (const [a, d, t, y] of AR) yearQ(a, d, t, y);
  // Personer
  const P = [
    ['Kleopatra','Drottning i det gamla Egypten'],['Julius Caesar','Romersk fältherre och diktator'],['Alexander den store','Kung av Makedonien som erövrade ett jätterike'],
    ['Djingis khan','Grundade Mongolriket'],['Jeanne d\'Arc','Ung fransk hjältinna under hundraårskriget'],['Michelangelo','Målade taket i Sixtinska kapellet'],
    ['William Shakespeare','Skrev "Romeo och Julia"'],['Wolfgang Amadeus Mozart','Österrikisk kompositör och underbarn'],['Marie Curie','Fick Nobelpriset i både fysik och kemi'],
    ['Galileo Galilei','Studerade himlen med teleskop'],['Ferdinand Magellan','Ledde den första resan jorden runt'],['Vasco da Gama','Hittade sjövägen till Indien'],
    ['Roald Amundsen','Först till sydpolen'],['Mahatma Gandhi','Ledde Indien mot självständighet utan våld'],['Abraham Lincoln','USA-president som avskaffade slaveriet'],
    ['Florence Nightingale','Grundade det moderna sjuksköterskeyrket'],['Henry Ford','Massproducerade bilar på löpande band'],['Walt Disney','Skapade Musse Pigg'],
    ['Charles Lindbergh','Flög ensam över Atlanten 1927'],['Rosa Parks','Vägrade lämna sin plats på bussen'],['Anne Frank','Skrev en dagbok när hon gömde sig under kriget'],
    ['Tutankhamon','Farao vars grav hittades nästan orörd'],['Hannibal','Gick över Alperna med elefanter'],['Marco Polo','Reste till Kina på 1200-talet'],
    ['Christofer Columbus','Seglade till Amerika 1492'],['Leonardo da Vinci','Målade Mona Lisa'],['Nelson Mandela','Sydafrikas första svarta president'],
    ['Napoleon Bonaparte','Fransk kejsare'],['Martin Luther','Startade reformationen'],['Johannes Gutenberg','Uppfann boktryckarkonsten i Europa'],
    ['Karl Marx','Skrev "Kommunistiska manifestet"'],['Winston Churchill','Brittisk premiärminister under andra världskriget'],['Neil Armstrong','Först på månen'],
    ['Malala Yousafzai','Kämpar för flickors rätt till skola'],['Albert Einstein','Relativitetsteorin'],['Isaac Newton','Gravitationslagen'],
  ];
  const kand = P.map(p => p[1]);
  const latt = new Set(['Leonardo da Vinci','Christofer Columbus','Neil Armstrong','Albert Einstein','Walt Disney','Napoleon Bonaparte','Kleopatra','Anne Frank','William Shakespeare']);
  for (const [vem, vad] of P) gq('hist', latt.has(vem) ? '123' : '3', latt.has(vem) ? 1 : 2, 'person', `Vad är ${vem} känd för?`, vad, kand, []);
  // Gudar
  const NG = [['Åskans gud med hammaren Mjölner','Tor'],['Den högste guden med en enda öga','Oden'],['Lurendrejaren som ställde till problem','Loke'],
    ['Kärlekens och fruktbarhetens gudinna','Freja'],['Skördens och fruktbarhetens gud','Frej'],['Ljusets och godhetens gud','Balder'],['Väktaren av regnbågsbron Bifrost','Heimdall'],
    ['Gudinnan med äpplena som höll gudarna unga','Idun'],['Havets och vindarnas gud','Njord']];
  const nord = NG.map(n => n[1]);
  for (const [vad, gud] of NG) gq('hist', ['Tor','Oden','Loke'].includes(gud) ? '123' : '3', ['Tor','Oden'].includes(gud) ? 1 : 2, 'nordgud', `Vilken gud i nordisk mytologi var: ${vad.toLowerCase()}?`, gud, nord, []);
  const GG = [['Himlens och åskans gud, den högste','Zeus'],['Havets gud med treudd','Poseidon'],['Dödsrikets gud','Hades'],['Visdomens gudinna','Athena'],
    ['Kärlekens gudinna','Afrodite'],['Krigets gud','Ares'],['Gudarnas budbärare med vingar på fötterna','Hermes'],['Jaktens gudinna','Artemis'],['Solens och musikens gud','Apollon']];
  const grek = GG.map(g => g[1]);
  for (const [vad, gud] of GG) gq('hist', ['Zeus','Poseidon'].includes(gud) ? '123' : '3', ['Zeus','Poseidon'].includes(gud) ? 1 : 2, 'grekgud', `Vilken grekisk gud var: ${vad.toLowerCase()}?`, gud, grek, []);
  const ROM = [['Zeus','Jupiter'],['Poseidon','Neptunus'],['Ares','Mars'],['Afrodite','Venus'],['Hermes','Merkurius'],['Athena','Minerva']];
  const rom = ROM.map(r => r[1]);
  for (const [g, r] of ROM) gq('hist', '3', 3, 'romgud', `Vad hette den grekiska guden ${g} hos romarna?`, r, rom, []);
  // Svenska regenter
  const K = [['valdes till kung 1523 och bröt Kalmarunionen','Gustav Vasa'],['förlorade slaget vid Poltava','Karl XII'],['abdikerade 1654 och flyttade till Rom','Drottning Kristina'],
    ['grundade Svenska Akademien','Gustav III'],['var fransk marskalk innan han blev kung 1818','Karl XIV Johan'],['var kung när unionen med Norge upplöstes 1905','Oscar II'],
    ['var arkeolog och kung 1950–1973','Gustaf VI Adolf'],['dog i slaget vid Lützen 1632','Gustav II Adolf'],['blev kung 1973','Carl XVI Gustaf']];
  const reg = K.map(k => k[1]);
  for (const [vad, vem] of K) if (vem !== 'Gustav II Adolf' && vem !== 'Carl XVI Gustaf') gq('hist', '3', 2, 'regent', `Vilken svensk regent ${vad}?`, vem, reg, []);

  // Handskrivna
  q('hist','01',1,'Vad kallas tiden då människor använde verktyg av sten?','Stenåldern','Järnåldern','Medeltiden','Vikingatiden');
  q('hist','12',1,'Vad kallas ett vikingahus där hela familjen bodde?','Långhus','Slott','Igloo','Torn');
  q('hist','12',1,'Vad kallas stenar med vikingarnas skrift?','Runstenar','Gravstenar','Milstolpar','Hällristningar');
  q('hist','12',2,'Vart trodde vikingarna att krigare kom när de dog?','Valhall','Midgård','Utgård','Asgård');
  q('hist','23',2,'Vad hette människornas värld i nordisk mytologi?','Midgård','Valhall','Asgård','Jotunheim');
  q('hist','23',2,'Vad hette världsträdet i nordisk mytologi?','Yggdrasil','Bifrost','Mjölner','Sleipner');
  q('hist','23',2,'Vad hette Odens åttafota häst?','Sleipner','Mjölner','Gungner','Fenrir');
  q('hist','01',1,'Vad bodde riddare och kungar i på medeltiden? 🏰','Borgar och slott','Skyskrapor','Igloos','Tält');
  q('hist','12',1,'Vad kallades kungarna i det gamla Egypten?','Faraoner','Kejsare','Sultaner','Tsarer');
  q('hist','23',2,'Vad gjorde egyptierna med sina döda faraoner?','Balsamerade dem till mumier','Brände dem','Begravde dem i havet','Frös ner dem');
  q('hist','23',2,'Vad kallas egyptiernas bildskrift?','Hieroglyfer','Runor','Kilskrift','Latin');
  q('hist','3',2,'Vilket folk skrev med kilskrift på lertavlor?','Sumererna','Romarna','Vikingarna','Inkafolket');
  q('hist','23',2,'Vilket språk talade de gamla romarna?','Latin','Grekiska','Italienska','Spanska');
  q('hist','23',2,'Vad hette den stora arenan i Rom där gladiatorer slogs?','Colosseum','Pantheon','Forum','Akropolis');
  q('hist','3',2,'Vad kallas pesten som dödade en stor del av Europas befolkning på 1300-talet?','Digerdöden','Spanska sjukan','Koleran','Smittkoppor');
  q('hist','3',2,'Vad kallas tiden när Sverige var en stormakt?','Stormaktstiden','Frihetstiden','Medeltiden','Vasatiden');
  q('hist','3',2,'Vad kallas perioden 1719–1772 då riksdagen hade stor makt i Sverige?','Frihetstiden','Stormaktstiden','Gustavianska tiden','Karolinska tiden');
  q('hist','3',2,'Vad kallas den konst- och kulturperiod som började i Italien på 1400-talet?','Renässansen','Barocken','Romantiken','Medeltiden');
  q('hist','3',2,'Vad kallas konflikten mellan USA och Sovjetunionen 1947–1991?','Kalla kriget','Hundraårskriget','Trettioåriga kriget','Stora nordiska kriget');
  q('hist','3',2,'Vilket krig pågick i Europa 1618–1648?','Trettioåriga kriget','Hundraårskriget','Napoleonkrigen','Krimkriget');
  q('hist','3',3,'Vad hette kriget mellan England och Frankrike som pågick i över hundra år?','Hundraårskriget','Trettioåriga kriget','Rosornas krig','Sjuårskriget');
  q('hist','23',2,'Vem var Sovjetunionens ledare under andra världskriget?','Josef Stalin','Lenin','Michail Gorbatjov','Vladimir Putin');
  q('hist','3',2,'Vem var USA:s president under största delen av andra världskriget?','Franklin D. Roosevelt','Abraham Lincoln','John F. Kennedy','George Washington');
  q('hist','3',2,'Vem var USA:s förste svarte president?','Barack Obama','Joe Biden','Martin Luther King Jr.','Colin Powell');
  q('hist','23',2,'Vad hette skeppet som tog Charles Darwin på hans berömda resa?','Beagle','Mayflower','Titanic','Endeavour');
  q('hist','3',2,'Vad hette den första människan som nådde toppen av Mount Everest tillsammans med Tenzing Norgay?','Edmund Hillary','Roald Amundsen','George Mallory','Reinhold Messner');
  q('hist','3',2,'Vad hette den svenska ballongfararen som försökte flyga till Nordpolen 1897?','S. A. Andrée','Sven Hedin','Otto Nordenskjöld','Fridtjof Nansen');
  q('hist','3',2,'Vilken svensk upptäcktsresande utforskade Centralasien och Tibet?','Sven Hedin','S. A. Andrée','Carl Linnaeus','Adolf Erik Nordenskiöld');
  q('hist','12',1,'Vad var Titanic?','Ett stort passagerarfartyg','Ett flygplan','Ett tåg','Ett slott');
  q('hist','3',2,'Vad hette staden som grekerna enligt sägnen intog med en trähäst?','Troja','Sparta','Aten','Rom');
  q('hist','23',2,'Vilken stad grundades enligt sägnen av tvillingarna Romulus och Remus?','Rom','Aten','Paris','Kartago');
  q('hist','3',2,'Vilken stad var huvudstad i Bysantinska riket?','Konstantinopel','Rom','Aten','Alexandria');
  q('hist','12',2,'Vad hette de stora stenmonumenten i England som byggdes för tusentals år sedan?','Stonehenge','Colosseum','Pyramiderna','Akropolis');
  q('hist','3',2,'Vilken civilisation byggde städer som Tenochtitlan i Mexiko?','Aztekerna','Inkafolket','Mayafolket','Olmekerna');
  q('hist','3',2,'Vilket rike erövrades av Francisco Pizarro?','Inkariket','Aztekriket','Mayariket','Mongolriket');
  q('hist','3',2,'Vilket land gav USA Frihetsgudinnan i present?','Frankrike','Storbritannien','Spanien','Nederländerna');
  q('hist','3',2,'Vilket land köpte USA Alaska av 1867?','Ryssland','Kanada','Storbritannien','Frankrike');
  q('hist','3',3,'Vilket land sålde Louisiana till USA 1803?','Frankrike','Spanien','Storbritannien','Mexiko');
  q('hist','23',2,'Vilken mur delade Berlin i öst och väst?','Berlinmuren','Kinesiska muren','Hadrianus mur','Klagomuren');
  q('hist','3',2,'Vilka sex länder grundade det som blev EU genom Romfördraget 1957?','Frankrike, Västtyskland, Italien, Belgien, Nederländerna och Luxemburg','Sverige, Norge, Danmark, Finland, Island och Tyskland','Storbritannien, Frankrike, Spanien, Portugal, Italien och Grekland','Polen, Tjeckien, Ungern, Österrike, Schweiz och Tyskland');
  q('hist','3',3,'Hur många kvinnor valdes in i riksdagen 1921, första valet med kvinnlig rösträtt?','Fem','En','Tio','Tjugo');
  tf('hist','23',1,'Pyramiderna i Giza byggdes av slavar enligt dagens forskning.',false);
  tf('hist','3',2,'Napoleon var mycket kort för sin tid.',false);
  tf('hist','12',1,'Dinosaurier och människor levde samtidigt.',false);
  tf('hist','23',2,'Kinesiska muren syns tydligt med blotta ögat från månen.',false);
  tf('hist','3',2,'Vikingarna kom till Nordamerika före Columbus.',true);
  tf('hist','3',2,'Sverige har varit i krig med Danmark många gånger.',true);
})();
