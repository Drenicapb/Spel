/* Quiz Champions – Sverige */
(function () {
  const { q, tf, gq } = window.QKB;
  const REG = {
    Götaland: ['Skåne','Blekinge','Halland','Småland','Öland','Gotland','Östergötland','Västergötland','Bohuslän','Dalsland'],
    Svealand: ['Uppland','Södermanland','Västmanland','Närke','Värmland','Dalarna'],
    Norrland: ['Gästrikland','Hälsingland','Medelpad','Ångermanland','Jämtland','Härjedalen','Västerbotten','Norrbotten','Lappland'],
  };
  const ALLA = Object.values(REG).flat();
  const regOf = l => Object.keys(REG).find(r => REG[r].includes(l));
  // [stad, landskap, känd (1) eller mindre känd (0)]
  const T = [
    ['Malmö','Skåne',1],['Helsingborg','Skåne',1],['Lund','Skåne',1],['Kristianstad','Skåne',0],['Ystad','Skåne',0],['Trelleborg','Skåne',0],['Landskrona','Skåne',0],
    ['Karlskrona','Blekinge',1],['Ronneby','Blekinge',0],['Karlshamn','Blekinge',0],
    ['Halmstad','Halland',1],['Varberg','Halland',0],['Falkenberg','Halland',0],['Kungsbacka','Halland',0],
    ['Jönköping','Småland',1],['Växjö','Småland',1],['Kalmar','Småland',1],['Västervik','Småland',0],['Ljungby','Småland',0],['Värnamo','Småland',0],['Nässjö','Småland',0],['Oskarshamn','Småland',0],
    ['Borgholm','Öland',0],['Visby','Gotland',1],
    ['Linköping','Östergötland',1],['Norrköping','Östergötland',1],['Motala','Östergötland',0],
    ['Borås','Västergötland',1],['Trollhättan','Västergötland',0],['Skövde','Västergötland',0],['Lidköping','Västergötland',0],['Alingsås','Västergötland',0],['Falköping','Västergötland',0],
    ['Uddevalla','Bohuslän',0],['Strömstad','Bohuslän',0],['Lysekil','Bohuslän',0],['Kungälv','Bohuslän',0],
    ['Åmål','Dalsland',0],['Bengtsfors','Dalsland',0],
    ['Uppsala','Uppland',1],['Norrtälje','Uppland',0],['Enköping','Uppland',0],['Sigtuna','Uppland',0],
    ['Eskilstuna','Södermanland',1],['Nyköping','Södermanland',0],['Strängnäs','Södermanland',0],['Katrineholm','Södermanland',0],['Södertälje','Södermanland',0],
    ['Västerås','Västmanland',1],['Köping','Västmanland',0],['Sala','Västmanland',0],
    ['Örebro','Närke',1],['Askersund','Närke',0],['Kumla','Närke',0],
    ['Karlstad','Värmland',1],['Arvika','Värmland',0],['Kristinehamn','Värmland',0],['Torsby','Värmland',0],
    ['Falun','Dalarna',1],['Borlänge','Dalarna',0],['Mora','Dalarna',1],['Ludvika','Dalarna',0],['Leksand','Dalarna',0],['Rättvik','Dalarna',0],
    ['Gävle','Gästrikland',1],['Sandviken','Gästrikland',0],
    ['Hudiksvall','Hälsingland',0],['Söderhamn','Hälsingland',0],['Bollnäs','Hälsingland',0],
    ['Sundsvall','Medelpad',1],
    ['Härnösand','Ångermanland',0],['Örnsköldsvik','Ångermanland',0],['Kramfors','Ångermanland',0],
    ['Östersund','Jämtland',1],['Åre','Jämtland',1],
    ['Sveg','Härjedalen',0],['Funäsdalen','Härjedalen',0],
    ['Umeå','Västerbotten',1],['Skellefteå','Västerbotten',0],
    ['Luleå','Norrbotten',1],['Piteå','Norrbotten',0],['Haparanda','Norrbotten',0],['Boden','Norrbotten',0],
    ['Gällivare','Lappland',0],['Jokkmokk','Lappland',0],['Arjeplog','Lappland',0],['Lycksele','Lappland',0],
  ];
  for (const [stad, land, k] of T) gq('sverige', k ? '23' : '3', k ? 2 : 3, 'landskap', `I vilket landskap ligger ${stad}?`, land, REG[regOf(land)], ALLA);
  // Län och residensstäder
  const LAN = [['Södermanlands','Nyköping'],['Östergötlands','Linköping'],['Kronobergs','Växjö'],['Blekinge','Karlskrona'],['Skåne','Malmö'],['Hallands','Halmstad'],
    ['Dalarnas','Falun'],['Gävleborgs','Gävle'],['Västernorrlands','Härnösand'],['Jämtlands','Östersund'],['Västerbottens','Umeå'],['Norrbottens','Luleå'],
    ['Värmlands','Karlstad'],['Västmanlands','Västerås'],['Västra Götalands','Göteborg'],['Gotlands','Visby']];
  const resid = LAN.map(l => l[1]);
  for (const [lan, stad] of LAN) gq('sverige', '3', 3, 'residens', `Vilken stad är residensstad i ${lan} län?`, stad, resid, []);
  // Kända svenskar
  const P = [
    ['Astrid Lindgren','Barnboksförfattare'],['Greta Thunberg','Klimataktivist'],['Zlatan Ibrahimović','Fotbollsspelare'],['Alfred Nobel','Uppfann dynamiten'],
    ['Anders Celsius','Skapade en temperaturskala'],['Carl von Linné','Gav växter och djur vetenskapliga namn'],['Selma Lagerlöf','Första kvinnan som fick Nobelpriset i litteratur'],
    ['August Strindberg','Författare och dramatiker'],['Ingmar Bergman','Filmregissör'],['Greta Garbo','Hollywoodskådespelerska'],['Björn Borg','Tennisspelare'],
    ['Ingemar Stenmark','Slalomåkare'],['Sarah Sjöström','Simmerska'],['Armand Duplantis','Stavhoppare'],['Peter Forsberg','Ishockeyspelare'],
    ['Ingvar Kamprad','Grundade IKEA'],['Daniel Ek','Grundade Spotify'],['Evert Taube','Visdiktare och sångare'],['Carl Larsson','Konstnär som målade hemmiljöer'],
    ['Raoul Wallenberg','Räddade tusentals judar under andra världskriget'],['Dag Hammarskjöld','FN:s generalsekreterare'],['Jenny Lind','Operasångerska kallad "den svenska näktergalen"'],
    ['Avicii','DJ och musikproducent'],['Alicia Vikander','Oscarsbelönad skådespelerska'],['Christer Fuglesang','Sveriges första astronaut'],['Anja Pärson','Alpin skidåkare'],
    ['Henrik Lundqvist','Ishockeymålvakt'],['Annika Sörenstam','Golfspelare'],['Jan-Ove Waldner','Bordtennisspelare'],['Charlotte Kalla','Längdskidåkare'],
    ['Elsa Beskow','Barnboksillustratör'],['Lars Magnus Ericsson','Grundade telefonföretaget Ericsson'],['Max Martin','Låtskrivare åt världsstjärnor'],
  ];
  const kand = P.map(p => p[1]);
  const lattare = new Set(['Astrid Lindgren','Greta Thunberg','Zlatan Ibrahimović','Alfred Nobel','Ingvar Kamprad','Armand Duplantis','Avicii','Björn Borg']);
  for (const [vem, vad] of P) gq('sverige', lattare.has(vem) ? '123' : '3', lattare.has(vem) ? 1 : 2, 'svensk', `Vad är ${vem} mest känd för?`, vad, kand, []);
  // Högtider
  const H = [['Valborgsmässoafton','30 april'],['Lucia','13 december'],['Julafton','24 december'],['Våffeldagen','25 mars'],['Alla hjärtans dag','14 februari'],
    ['Halloween','31 oktober'],['Mårtensafton','10 november'],['Tjugondag Knut','13 januari'],['Nyårsafton','31 december'],['Trettondedag jul','6 januari'],['FN-dagen','24 oktober']];
  const dat = H.map(h => h[1]);
  for (const [dag, d] of H) gq('sverige', ['Julafton','Lucia','Alla hjärtans dag','Nyårsafton','Halloween'].includes(dag) ? '0123' : '23', ['Julafton','Nyårsafton'].includes(dag) ? 1 : 2, 'hogtid', `Vilket datum är ${dag}?`, d, dat, []);
  // Barnböcker: figur → bok
  const BOK = ['Karlsson på taket','Madicken','Mio, min Mio','Ronja Rövardotter','Bröderna Lejonhjärta','Emil i Lönneberga','Pippi Långstrump','Barnen i Bullerbyn',
    'Lotta på Bråkmakargatan','Pettson och Findus','Mamma Mu','Bamse','Alfons Åberg','Pelle Svanslös'];
  const FIG = [['Lillebror','Karlsson på taket','012'],['Fröken Bock','Karlsson på taket','123'],['Lisabet','Madicken','123'],['Jum-Jum','Mio, min Mio','123'],
    ['Riddar Kato','Mio, min Mio','123'],['Birk','Ronja Rövardotter','123'],['rumpnissarna','Ronja Rövardotter','123'],['Tengil','Bröderna Lejonhjärta','123'],
    ['draken Katla','Bröderna Lejonhjärta','123'],['drängen Alfred','Emil i Lönneberga','012'],['Krösa-Maja','Emil i Lönneberga','123'],['Lasse, Bosse och Lisa','Barnen i Bullerbyn','123'],
    ['Mia-Maria och Jonas','Lotta på Bråkmakargatan','123'],['gubben som har katten Findus','Pettson och Findus','012'],['Kråkan','Mamma Mu','01'],['Krösus Sork','Bamse','012'],
    ['Mållgan, en låtsaskompis','Alfons Åberg','012'],['katten Måns','Pelle Svanslös','123'],['Maja Gräddnos','Pelle Svanslös','123']];
  for (const [fig, bok, a] of FIG) gq('sverige', a, a.startsWith('0') ? 1 : 2, 'barnbok', `I vilken berättelse finns ${fig}?`, bok, BOK, []);
  const FORF = [['Pettson och Findus','Sven Nordqvist'],['Alfons Åberg','Gunilla Bergström'],['Mamma Mu','Jujja Wieslander'],['Bamse','Rune Andréasson'],
    ['Pelle Svanslös','Gösta Knutsson'],['Tomtebobarnen','Elsa Beskow'],['Mulle Meck','George Johansson'],['LasseMajas detektivbyrå','Martin Widmark'],
    ['Mumintrollen','Tove Jansson'],['Kulla-Gulla','Martha Sandwall-Bergström'],['Lilla spöket Laban','Inger och Lasse Sandberg'],['Emil i Lönneberga','Astrid Lindgren']];
  const forf = FORF.map(f => f[1]);
  for (const [bok, vem] of FORF) gq('sverige', ['Emil i Lönneberga','Mumintrollen'].includes(bok) ? '123' : '3', 2, 'forfattare', `Vem skapade "${bok}"?`, vem, forf, []);

  // Handskrivna
  q('sverige','0',1,'Vad heter Sveriges kung?','Carl Gustaf','Olle','Bamse','Pippi');
  q('sverige','01',1,'Vilket djur är vanligt i svenska skogar och har stora horn? 🫎','Älgen','Kängurun','Zebran','Giraffen');
  q('sverige','0',1,'Vad äter man på påsken som är målat i fina färger? 🥚','Ägg','Äpplen','Bullar','Glass');
  q('sverige','01',1,'Vad dansar man som små grodorna kring på midsommar?','Midsommarstången','Julgranen','Brasan','En bil');
  q('sverige','12',1,'Vad tänder man på valborgsmässoafton?','En stor brasa','Adventsljus','Lussekatter','Tomtebloss');
  q('sverige','123',1,'Vad äter man traditionellt på mårtensafton?','Gås','Kräftor','Sill','Skinka');
  q('sverige','123',1,'Vad äter man på en kräftskiva i augusti?','Kräftor','Gås','Lutfisk','Semlor');
  q('sverige','01',1,'Vad klär barnen ut sig till på påsken i Sverige?','Påskkärringar','Tomtar','Spöken','Lucior');
  q('sverige','23',2,'Vem uppfann säkerhetständstickan?','Johan Edvard Lundström','Alfred Nobel','Anders Celsius','Lars Magnus Ericsson');
  q('sverige','3',2,'Vilken svensk uppfann skiftnyckeln?','Johan Petter Johansson','Gustaf Dalén','Baltzar von Platen','Carl Edvard Johansson');
  q('sverige','3',2,'Vilken svensk ingenjör på Volvo uppfann trepunktsbältet?','Nils Bohlin','Ruben Rausing','Gustaf Larson','Assar Gabrielsson');
  q('sverige','3',2,'Vilket svenskt företag gjorde förpackningen för mjölk i papp känd i hela världen?','Tetra Pak','IKEA','Ericsson','Electrolux');
  q('sverige','23',1,'Vilket svenskt företag gör bilar och grundades i Göteborg 1927?','Volvo','Saab','Scania','Koenigsegg');
  q('sverige','3',2,'Vilket svenskt klädföretag grundades i Västerås 1947?','H&M','Lindex','KappAhl','Acne');
  q('sverige','23',2,'På vilken ö i Stockholm ligger riksdagshuset?','Helgeandsholmen','Djurgården','Södermalm','Kungsholmen');
  q('sverige','3',2,'Hur många ledamöter sitter i Sveriges riksdag?','349','300','251','400');
  q('sverige','23',1,'I vilket slott bor kungen och drottningen?','Drottningholms slott','Kalmar slott','Gripsholms slott','Läckö slott');
  q('sverige','3',2,'Vilket år blev Sverige ett land med allmän rösträtt även för kvinnor i riksdagsval (första valet)?','1921','1866','1945','1909');
  q('sverige','23',1,'Vilket djur finns i Sveriges riksvapen?','Lejon','Örn','Björn','Älg');
  q('sverige','12',1,'Hur många kronor finns i Sveriges riksvapen (det lilla riksvapnet)?','Tre','En','Två','Fyra');
  q('sverige','3',2,'Vilken av Sveriges sjöar är näst störst?','Vättern','Vänern','Mälaren','Hjälmaren');
  q('sverige','3',3,'Vilken är Sveriges största nationalpark till ytan?','Padjelanta','Sarek','Abisko','Tyresta');
  q('sverige','123',1,'Vad kallas Sveriges ursprungsfolk i norr?','Samer','Vikingar','Kelter','Inuiter');
  q('sverige','23',2,'Vilka djur föder många samer upp?','Renar','Älgar','Kor','Hästar');
  q('sverige','3',2,'Hur många officiella minoritetsspråk har Sverige?','Fem','Två','Tre','Sju');
  q('sverige','12',1,'Vad heter Stockholms stora nöjespark på Djurgården?','Gröna Lund','Liseberg','Furuvik','Kolmården');
  q('sverige','12',1,'I vilken stad ligger nöjesparken Liseberg?','Göteborg','Stockholm','Malmö','Uppsala');
  q('sverige','01',1,'I vilken stad ligger Astrid Lindgrens Värld? 🎠','Vimmerby','Kiruna','Malmö','Visby');
  q('sverige','12',1,'Var ligger djurparken med delfinshow – Kolmården – nära?','Norrköping','Göteborg','Luleå','Helsingborg');
  q('sverige','23',2,'Vad heter Sveriges högsta byggnad (2026)?','Karlatornet','Turning Torso','Kaknästornet','Victoria Tower');
  q('sverige','23',2,'I vilken stad står den vridna skyskrapan Turning Torso?','Malmö','Göteborg','Stockholm','Västerås');
  q('sverige','3',2,'Vilken svensk stad kallas "Rosornas och ruinernas stad"?','Visby','Ystad','Kalmar','Sigtuna');
  q('sverige','3',2,'Vilken stad brukar räknas som Sveriges äldsta stad?','Sigtuna','Uppsala','Lund','Visby');
  q('sverige','3',2,'Vilken kanal går från Vänern till Östersjön och byggdes 1810–1832?','Göta kanal','Dalslands kanal','Strömsholms kanal','Södertälje kanal');
  q('sverige','23',1,'Vad heter tv-programmet där svenska folket väljer bidrag till Eurovision?','Melodifestivalen','Idol','Talang','Let\'s Dance');
  q('sverige','0',1,'Vem kommer med julklappar på julafton? 🎅','Tomten','Påskharen','Lucia','Spöket');
  q('sverige','01',1,'Vad tittar många på i tv klockan tre på julafton?','Kalle Anka','Melodifestivalen','Nyheterna','Fotboll');
  q('sverige','23',2,'Vilket år började man köra på höger sida av vägen i Sverige?','1967','1955','1980','1945');
  q('sverige','3',2,'Vad kallas dagen då Sverige bytte till högertrafik?','Dagen H','D-dagen','Dag X','Dagen V');
  q('sverige','3',2,'Vilket år kom Sveriges första kvinnliga statsminister till makten?','2021','2006','2014','1994');
  q('sverige','3',2,'Hur många invånare har Sverige ungefär?','10,5 miljoner','5 miljoner','25 miljoner','15 miljoner');
  q('sverige','23',2,'Vilken ö är Sveriges näst största?','Öland','Gotland','Orust','Värmdö');
  q('sverige','3',3,'Vilken är Sveriges sydligaste punkt?','Smygehuk','Falsterbo','Kullaberg','Sandhammaren');
  q('sverige','3',3,'Vilken är Sveriges nordligaste punkt nära?','Treriksröset','Kebnekaise','Abisko','Haparanda');
  q('sverige','123',1,'Vilken ö ligger i Kalmarsund och nås via en lång bro?','Öland','Gotland','Visingsö','Tjörn');
  q('sverige','12',1,'Vad heter Sveriges största stad?','Stockholm','Göteborg','Malmö','Uppsala');
  q('sverige','23',2,'Från vilket landskap kommer den röda Dalahästen?','Dalarna','Värmland','Småland','Jämtland');
  q('sverige','3',2,'Vad heter Sveriges nationalfågel enligt en omröstning 2015?','Koltrasten','Gråsparven','Kungsörnen','Talgoxen');
  q('sverige','3',2,'Vilken är Sveriges nationalblomma?','Linnea','Prästkrage','Blåklint','Maskros');
  tf('sverige','123',1,'Stockholm är byggt på flera öar.',true);
  tf('sverige','23',2,'Sverige har euro som valuta.',false);
  tf('sverige','12',1,'Midnattssolen kan ses i norra Sverige på sommaren.',true);
  tf('sverige','3',2,'Sverige var med i andra världskriget som krigförande land.',false);
  tf('sverige','23',1,'Gotland är Sveriges största ö.',true);
})();
