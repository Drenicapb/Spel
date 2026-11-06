/* Quiz Champions – sport, film/TV/spel, mat & dryck, musikfakta */
(function () {
  const { q, tf, gq } = window.QKB;

  // ═════════ SPORT ═════════
  const OS = [[1908,'London'],[1920,'Antwerpen'],[1924,'Paris'],[1928,'Amsterdam'],[1936,'Berlin'],[1948,'London'],[1952,'Helsingfors'],[1960,'Rom'],[1964,'Tokyo'],
    [1968,'Mexico City'],[1972,'München'],[1976,'Montréal'],[1980,'Moskva'],[1984,'Los Angeles'],[1988,'Seoul'],[1992,'Barcelona'],[1996,'Atlanta'],[2000,'Sydney'],
    [2004,'Aten'],[2008,'Peking'],[2012,'London'],[2016,'Rio de Janeiro']];
  const osSt = [...new Set(OS.map(o => o[1]))];
  for (const [y, s] of OS) gq('sport', y >= 2000 ? '23' : '3', y >= 2000 ? 2 : 3, 'os', `I vilken stad hölls sommar-OS ${y}?`, s, osSt, []);
  gq('sport', '23', 2, 'os', 'Vilken stad ska arrangera sommar-OS 2028?', 'Los Angeles', osSt, []);
  gq('sport', '3', 3, 'os', 'Vilken stad ska arrangera sommar-OS 2032?', 'Brisbane', osSt, []);
  const VOS = [[1924,'Chamonix'],[1952,'Oslo'],[1980,'Lake Placid'],[1984,'Sarajevo'],[1988,'Calgary'],[1992,'Albertville'],[1994,'Lillehammer'],[1998,'Nagano'],
    [2002,'Salt Lake City'],[2006,'Turin'],[2010,'Vancouver'],[2014,'Sotji'],[2018,'Pyeongchang'],[2022,'Peking']];
  const vSt = VOS.map(v => v[1]);
  for (const [y, s] of VOS) gq('sport', y >= 2010 ? '23' : '3', y >= 2010 ? 2 : 3, 'vos', `Var hölls vinter-OS ${y}?`, s, vSt, []);
  const VM = [[1930,'Uruguay'],[1934,'Italien'],[1950,'Uruguay'],[1954,'Västtyskland'],[1958,'Brasilien'],[1966,'England'],[1970,'Brasilien'],[1974,'Västtyskland'],
    [1978,'Argentina'],[1982,'Italien'],[1986,'Argentina'],[1990,'Västtyskland'],[1994,'Brasilien'],[1998,'Frankrike'],[2002,'Brasilien'],[2006,'Italien'],[2010,'Spanien'],[2014,'Tyskland']];
  const vmL = [...new Set([...VM.map(v => v[1]), 'Nederländerna', 'Sverige', 'Kroatien', 'Portugal'])];
  for (const [y, l] of VM) gq('sport', y >= 2006 ? '23' : '3', y >= 2006 ? 2 : 3, 'vm', `Vilket land vann herrarnas fotbolls-VM ${y}?`, l, vmL, []);
  const VMV = [[1958,'Sverige'],[1994,'USA'],[2002,'Sydkorea och Japan'],[2006,'Tyskland'],[2010,'Sydafrika'],[2014,'Brasilien'],[2018,'Ryssland'],[2022,'Qatar']];
  const vmV = VMV.map(v => v[1]);
  for (const [y, l] of VMV) gq('sport', y >= 2010 ? '23' : '3', 2, 'vmvard', `Vilket land arrangerade herrarnas fotbolls-VM ${y}?`, l, vmV, ['Frankrike','Italien','England']);
  const LAG = [['ishockey','6'],['volleyboll','6'],['handboll','7'],['bandy','11'],['rugby (union)','15'],['vattenpolo','7'],['innebandy','6'],['amerikansk fotboll','11'],['baseboll','9']];
  for (const [sp, n] of LAG) gq('sport', ['ishockey','handboll','innebandy'].includes(sp) ? '123' : '3', 2, 'spelare', `Hur många spelare per lag är på planen samtidigt i ${sp} (inklusive målvakt)?`, n, ['5','6','7','8','9','10','11','12','13','15'], []);
  const TERM = [['slam dunk','Basket'],['birdie','Golf'],['schack matt','Schack'],['icing','Ishockey'],['home run','Baseboll'],['try','Rugby'],['fjäderboll','Badminton'],
    ['deuce','Tennis'],['knockout','Boxning'],['pole position','Formel 1'],['depåstopp','Formel 1'],['bom','Gymnastik'],['spare','Bowling'],['kast med sten mot en tavla på isen','Curling']];
  const sporter = [...new Set(TERM.map(t => t[1]))];
  for (const [t, s] of TERM) gq('sport', ['slam dunk','schack matt','fjäderboll','knockout'].includes(t) ? '123' : '23', 2, 'term', `I vilken sport förekommer "${t}"?`, s, sporter, []);
  const ATL = [['Lionel Messi','Fotboll',1],['Cristiano Ronaldo','Fotboll',1],['Pelé','Fotboll',0],['Usain Bolt','Löpning',1],['Michael Phelps','Simning',1],['Serena Williams','Tennis',1],
    ['Roger Federer','Tennis',1],['Rafael Nadal','Tennis',0],['Novak Djokovic','Tennis',0],['Tiger Woods','Golf',1],['Annika Sörenstam','Golf',0],['Ingemar Stenmark','Alpin skidåkning',0],
    ['Anja Pärson','Alpin skidåkning',0],['Mikaela Shiffrin','Alpin skidåkning',0],['Pernilla Wiberg','Alpin skidåkning',0],['Sarah Sjöström','Simning',1],['Stefan Holm','Höjdhopp',0],
    ['Kajsa Bergqvist','Höjdhopp',0],['Christian Olsson','Tresteg',0],['Carolina Klüft','Sjukamp',0],['Daniel Ståhl','Diskus',0],['Peter Forsberg','Ishockey',0],['Mats Sundin','Ishockey',0],
    ['Nicklas Lidström','Ishockey',0],['Wayne Gretzky','Ishockey',0],['LeBron James','Basket',1],['Michael Jordan','Basket',1],['Muhammad Ali','Boxning',1],['Lewis Hamilton','Formel 1',1],
    ['Max Verstappen','Formel 1',1],['Michael Schumacher','Formel 1',0],['Charlotte Kalla','Längdskidåkning',0],['Frida Karlsson','Längdskidåkning',0],['Gunde Svan','Längdskidåkning',0],
    ['Marit Bjørgen','Längdskidåkning',0],['Magnus Carlsen','Schack',0],['Simone Biles','Gymnastik',0],['Jan-Ove Waldner','Bordtennis',0],['Magnus Wislander','Handboll',0],
    ['Hanna Öberg','Skidskytte',0],['Johannes Thingnes Bø','Skidskytte',0],['Kylian Mbappé','Fotboll',1],['Erling Haaland','Fotboll',1],['Henrik Larsson','Fotboll',0],['Kosovare Asllani','Fotboll',0],
    ['Mats Wilander','Tennis',0],['Stefan Edberg','Tennis',0]];
  const atlS = [...new Set(ATL.map(a => a[1]))];
  for (const [vem, s, k] of ATL) gq('sport', k ? '123' : '3', k ? 1 : 2, 'idrottare', `I vilken sport är ${vem} känd?`, s, atlS, []);
  const UR = [['Ishockey','Kanada'],['Basket','USA'],['Golf','Skottland'],['Taekwondo','Sydkorea'],['Karate','Japan'],['Sumobrottning','Japan'],['Curling','Skottland'],['Volleyboll','USA'],['Snowboard','USA'],['Cricket','England']];
  const urL = [...new Set(UR.map(u => u[1]))];
  for (const [s, l] of UR) gq('sport', '3', 3, 'ursprung', `I vilket land uppstod sporten ${s.toLowerCase()}?`, l, urL, ['Frankrike','Kina']);

  q('sport','12',1,'Hur lång är en vanlig fotbollsmatch (utan förlängning)?','90 minuter','60 minuter','45 minuter','120 minuter');
  q('sport','12',1,'Hur lång är en halvlek i fotboll?','45 minuter','30 minuter','40 minuter','60 minuter');
  q('sport','23',2,'Hur långa är perioderna i en ishockeymatch?','20 minuter','15 minuter','30 minuter','25 minuter');
  q('sport','23',2,'Från hur många meter slås en straffspark i fotboll?','11','9','16','20');
  q('sport','3',2,'Hur högt sitter en basketkorg?','3,05 meter','2,50 meter','3,50 meter','4 meter');
  q('sport','12',1,'Vad kallas det när en spelare gör mål i sitt eget lag mål?','Självmål','Hattrick','Straff','Offside');
  q('sport','23',1,'Vilket land har vunnit herrarnas fotbolls-VM flest gånger?','Brasilien','Tyskland','Italien','Argentina');
  q('sport','3',2,'Vilket land har tagit flest olympiska guld genom tiderna?','USA','Sovjetunionen','Kina','Tyskland');
  q('sport','23',1,'Vad heter Sveriges herrlandslag i ishockey?','Tre Kronor','Blågult','Damkronorna','Lejonen');
  q('sport','3',2,'Vad heter Sveriges damlandslag i ishockey?','Damkronorna','Tre Kronor','Blågult','Lejoninnorna');
  q('sport','23',1,'Vilken cykeltävling körs varje sommar i Frankrike?','Tour de France','Giro d\'Italia','Vätternrundan','Paris–Dakar');
  q('sport','3',2,'På vilket underlag spelas tennisturneringen Roland Garros?','Grus','Gräs','Hardcourt','Matta');
  q('sport','3',2,'Vilken sport kallas ibland "den vita sporten"?','Tennis','Skidor','Golf','Konståkning');
  q('sport','12',1,'Vilken racketsport spelas på en bana med glasväggar och har blivit jättepopulär i Sverige?','Padel','Squash','Badminton','Bordtennis');
  q('sport','3',2,'Vilka färger har ringarna i OS-flaggan?','Blå, gul, svart, grön och röd','Röd, vit och blå','Guld, silver och brons','Alla regnbågens färger');
  q('sport','3',2,'I vilken stad hölls vinter-OS två gånger: 1928 och 1948?','S:t Moritz','Oslo','Innsbruck','Lake Placid');
  q('sport','3',2,'Hur många hål har en golfbana i en vanlig runda?','18','9','12','27');
  q('sport','23',2,'Vad heter Sveriges högsta fotbollsliga för herrar?','Allsvenskan','Superettan','SHL','Premier League');
  q('sport','23',2,'Vad heter Sveriges högsta ishockeyliga?','SHL','Allsvenskan','NHL','KHL');
  q('sport','23',2,'I vilken nordamerikansk liga spelar man professionell ishockey?','NHL','NBA','NFL','MLB');
  q('sport','3',2,'I vilken liga spelar man amerikansk fotboll i USA?','NFL','NBA','NHL','MLS');
  q('sport','3',2,'Vad heter finalen i amerikansk fotboll?','Super Bowl','World Series','Stanley Cup','Grand Final');
  q('sport','3',2,'Vad heter pokalen man vinner i NHL?','Stanley Cup','Super Bowl','Ryder Cup','Davis Cup');
  q('sport','3',2,'Vilken sport tävlar man i Davis Cup?','Tennis','Golf','Segling','Ishockey');
  q('sport','3',2,'Vilken sport tävlar man i Ryder Cup?','Golf','Tennis','Segling','Cricket');
  q('sport','3',2,'Vad heter Sveriges största löptävling i Göteborg?','Göteborgsvarvet','Stockholm Marathon','Lidingöloppet','Vasaloppet');
  q('sport','3',2,'Vad heter världens största terränglopp, som springs på Lidingö?','Lidingöloppet','Göteborgsvarvet','Vasaloppet','Tjejmilen');
  q('sport','3',2,'Vilken av tävlingarna ingår i "En svensk klassiker"?','Vätternrundan','Göteborgsvarvet','Stockholm Marathon','Tjejvasan');
  q('sport','0',1,'Vad behöver man på fötterna för att åka på isen? ⛸️','Skridskor','Simfötter','Sandaler','Stövlar');
  q('sport','0',1,'Vilken sport spelar man med en rund boll och sparkar på mål? ⚽','Fotboll','Tennis','Golf','Simning');
  q('sport','0',1,'Vilken sport utövar man i en bassäng? 🏊','Simning','Fotboll','Skidåkning','Cykling');
  q('sport','0',1,'Vad har man på huvudet för att skydda sig när man cyklar? 🚲','Hjälm','Mössa','Keps','Krona');
  q('sport','01',1,'Vilken färg har medaljen man får när man vinner? 🥇','Guld','Silver','Brons','Röd');
  q('sport','01',1,'Vilken medalj får den som kommer tvåa?','Silver','Guld','Brons','Ingen');
  q('sport','01',1,'Vilken sport spelar man med racket över ett nät och en fjäderboll?','Badminton','Tennis','Bordtennis','Volleyboll');
  q('sport','12',1,'I vilken sport kan man göra en "hattrick" genom att göra tre mål?','Fotboll','Simning','Golf','Schack');
  tf('sport','23',1,'En maraton är längre än 40 kilometer.',true);
  tf('sport','12',1,'I tennis kallas noll poäng för "love".',true);
  tf('sport','3',2,'Sverige har aldrig vunnit något OS-guld i fotboll.',false);
  tf('sport','23',2,'Vinter-OS och sommar-OS hålls samma år.',false);

  // ═════════ FILM, TV & SPEL ═════════
  const FIG = [['Simba','Lejonkungen','0'],['Timon och Pumbaa','Lejonkungen','0'],['Mufasa','Lejonkungen','0'],['Woody och Buzz','Toy Story','0'],['Dory','Hitta Nemo','0'],
    ['Marlin','Hitta Nemo','1'],['Blixten McQueen','Bilar','0'],['Bärgarn','Bilar','0'],['Sulley och Mike','Monsters, Inc.','0'],['Remy','Råttatouille','1'],['Carl Fredricksen','Upp','1'],
    ['Elsa och Anna','Frost','0'],['Kristoffer','Frost','1'],['Maui','Vaiana','0'],['Ariel','Den lilla sjöjungfrun','0'],['Belle','Skönheten och odjuret','0'],['Rapunzel','Trassel','0'],
    ['Mirabel','Encanto','0'],['Judy Hopps','Zootropolis','1'],['Baymax','Big Hero 6','1'],['Mowgli och Baloo','Djungelboken','0'],['Stitch','Lilo & Stitch','0'],
    ['Hicke och Tandlöse','Draktränaren','1'],['Åsnan','Shrek','0'],['prinsessan Fiona','Shrek','0'],['Po','Kung Fu Panda','0'],['Gru och minionerna','Dumma mig','0'],
    ['Alex och Marty','Madagaskar','1'],['Manny och Sid','Ice Age','1'],['Glädje och Ledsen','Insidan ut','0'],['Miguel','Coco','1'],['Tingeling','Peter Pan','0'],
    ['Kapten Krok','Peter Pan','0'],['Merida','Modig','1'],['Mr. Incredible','Superhjältarna','1'],['Raya','Raya och den sista draken','1'],['Aladdin och Jasmine','Aladdin','0']];
  const filmer = [...new Set(FIG.map(f => f[1]))];
  for (const [f, film, a] of FIG) gq('film', a === '0' ? '0123' : '123', a === '0' ? 1 : 2, 'figur', `I vilken film finns ${f}?`, film, filmer, []);
  const HJ = [['Spider-Man','Peter Parker'],['Batman','Bruce Wayne'],['Stålmannen (Superman)','Clark Kent'],['Iron Man','Tony Stark'],['Hulken','Bruce Banner'],
    ['Wonder Woman','Diana Prince'],['Captain America','Steve Rogers'],['Black Panther','T\'Challa'],['Flash','Barry Allen'],['Black Widow','Natasha Romanoff']];
  const hjNamn = HJ.map(h => h[1]);
  for (const [h, n] of HJ) gq('film', ['Spider-Man','Batman','Stålmannen (Superman)','Iron Man'].includes(h) ? '123' : '23', 2, 'hjalte', `Vad heter ${h} egentligen?`, n, hjNamn, []);
  const ROLL = [['Daniel Radcliffe','Harry Potter'],['Emma Watson','Hermione Granger'],['Johnny Depp','Jack Sparrow'],['Robert Downey Jr.','Iron Man'],['Harrison Ford','Indiana Jones'],
    ['Hugh Jackman','Wolverine'],['Tom Hanks','Forrest Gump'],['Sylvester Stallone','Rocky'],['Arnold Schwarzenegger','Terminator'],['Keanu Reeves','Neo i The Matrix'],
    ['Margot Robbie','Barbie'],['Jenna Ortega','Wednesday Addams'],['Tom Holland','Spider-Man'],['Chris Hemsworth','Thor'],['Sean Connery','Den förste James Bond på film'],
    ['Leonardo DiCaprio','Jack i Titanic'],['Timothée Chalamet','Paul Atreides i Dune'],['Mark Hamill','Luke Skywalker']];
  const roller = ROLL.map(r => r[1]);
  for (const [vem, r] of ROLL) gq('film', ['Daniel Radcliffe','Tom Holland','Margot Robbie','Jenna Ortega','Emma Watson'].includes(vem) ? '123' : '23', 2, 'skadis', `Vilken känd rollfigur har ${vem} spelat?`, r, roller, []);
  const REG = [['Titanic','James Cameron'],['E.T.','Steven Spielberg'],['Star Wars (1977)','George Lucas'],['Pulp Fiction','Quentin Tarantino'],['Oppenheimer','Christopher Nolan'],
    ['Gudfadern','Francis Ford Coppola'],['Psycho','Alfred Hitchcock'],['Sagan om ringen','Peter Jackson'],['Barbie (2023)','Greta Gerwig'],['Det sjunde inseglet','Ingmar Bergman'],
    ['Shining','Stanley Kubrick'],['tv-serien Pippi Långstrump (1969)','Olle Hellbom'],['Mitt liv som hund','Lasse Hallström']];
  const regs = [...new Set(REG.map(r => r[1]))];
  for (const [f, r] of REG) gq('film', '3', 3, 'regissor', `Vem regisserade ${f}?`, r, regs, []);
  const SPEL = [['Link','The Legend of Zelda'],['Steve','Minecraft'],['Lara Croft','Tomb Raider'],['Master Chief','Halo'],['Kratos','God of War'],['prinsessan Peach','Super Mario'],
    ['Ellie och Joel','The Last of Us'],['Geralt','The Witcher'],['Isabelle och Tom Nook','Animal Crossing'],['Ash Ketchum','Pokémon'],['Samus','Metroid']];
  const spel = SPEL.map(s => s[1]);
  for (const [f, s] of SPEL) gq('film', ['Steve','prinsessan Peach','Ash Ketchum','Isabelle och Tom Nook'].includes(f) ? '123' : '23', 2, 'spelfigur', `I vilket spel finns ${f}?`, s, spel, []);
  const SPL = [['Minecraft','Sverige'],['Candy Crush','Sverige'],['Battlefield','Sverige'],['Angry Birds','Finland'],['Clash of Clans','Finland'],['Tetris','Sovjetunionen'],
    ['Super Mario','Japan'],['Fortnite','USA'],['Among Us','USA'],['Pokémon','Japan']];
  const splL = [...new Set(SPL.map(s => s[1]))];
  for (const [s, l] of SPL) gq('film', ['Minecraft','Super Mario','Pokémon'].includes(s) ? '123' : '23', 2, 'spelland', `Från vilket land kommer spelet ${s}?`, l, splL, ['Kanada','Storbritannien']);
  const KON = [['PlayStation','Sony'],['Xbox','Microsoft'],['Switch','Nintendo'],['Game Boy','Nintendo'],['Wii','Nintendo']];
  for (const [k, f] of KON) gq('film', '123', 1, 'konsol', `Vilket företag gör spelkonsolen ${k}?`, f, ['Sony','Microsoft','Nintendo','Sega','Apple'], []);

  q('film','0',1,'Vilket djur är Peppa? 🐷','En gris','En hund','En kanin','En ko');
  q('film','0',1,'Vilket djur är Bluey?','En hund','En katt','En räv','En björn');
  q('film','0',1,'Var bor Svampbob Fyrkant?','I en ananas','I ett slott','I en båt','I ett träd');
  q('film','0',1,'Vad heter Svampbobs bästa vän, sjöstjärnan?','Patrik','Krabban','Snäckan','Pelle');
  q('film','0',1,'Vad heter pojken som leder hundarna i Paw Patrol?','Ryder','Chase','Marshall','Rubble');
  q('film','0',1,'Vad heter Musse Piggs flickvän?','Mimmi','Kajsa','Klarabella','Långben');
  q('film','0',1,'Vad heter Kalle Ankas flickvän?','Kajsa','Mimmi','Joakim','Alexander');
  q('film','01',1,'Vad heter Kalle Ankas rika farbror?','Joakim von Anka','Alexander Lukas','Oppfinnar-Jocke','Björnligan');
  q('film','0',1,'Vad heter Musse Piggs hund?','Pluto','Långben','Bamse','Snobben');
  q('film','0',1,'Vilken färg har smurfarna?','Blå','Gröna','Röda','Gula');
  q('film','01',1,'Vad heter trollkarlen som jagar smurfarna?','Gargamel','Gandalf','Merlin','Dumbledore');
  q('film','0',1,'Vad heter katten i Tom & Jerry?','Tom','Jerry','Gustav','Findus');
  q('film','0',1,'Vilket djur är Scooby-Doo?','En hund','En katt','En häst','En mus');
  q('film','0',1,'Vilken färg har Hulken?','Grön','Röd','Blå','Lila');
  q('film','01',1,'Vad heter barnprogrammet på SVT med en draksymbol?','Bolibompa','Babblarna','Barnkanalen','Mamma Mu');
  q('film','12',1,'Vad heter Harry Potters bästa vänner?','Ron och Hermione','Draco och Neville','Fred och George','Luna och Ginny');
  q('film','12',1,'Vad heter rektorn på Hogwarts i de första böckerna?','Albus Dumbledore','Severus Snape','Rubeus Hagrid','Minerva McGonagall');
  q('film','12',2,'Vilket elevhem hamnar Harry Potter i?','Gryffindor','Slytherin','Hufflepuff','Ravenclaw');
  q('film','12',2,'Vad heter hobbiten som bär ringen i Sagan om ringen?','Frodo','Sam','Bilbo','Pippin');
  q('film','12',1,'Vad heter trollkarlen i Sagan om ringen?','Gandalf','Dumbledore','Merlin','Saruman den vite');
  q('film','12',1,'I vilken stad bor Batman?','Gotham City','Metropolis','New York','Springfield');
  q('film','12',1,'Vad heter den lilla gröna jedimästaren i Star Wars?','Yoda','Chewbacca','R2-D2','Jabba');
  q('film','23',2,'Vilket kodnummer har James Bond?','007','001','700','999');
  q('film','3',2,'Vad heter James Bonds chef?','M','Q','Moneypenny','Felix');
  q('film','23',2,'Vilken film har sången "My Heart Will Go On"?','Titanic','Avatar','Pretty Woman','Top Gun');
  q('film','23',2,'Vilken film handlar om Dorothy och den gula tegelstensvägen?','Trollkarlen från Oz','Alice i Underlandet','Narnia','Peter Pan');
  q('film','3',2,'I vilken serie finns familjerna Stark och Lannister?','Game of Thrones','The Crown','Vikings','Stranger Things');
  q('film','3',2,'Vilken serie handlar om kemiläraren Walter White?','Breaking Bad','Better Call Saul','Ozark','Narcos');
  q('film','23',2,'Vilken serie utspelar sig i staden Hawkins med en mörk parallellvärld?','Stranger Things','Wednesday','Dark','Riverdale');
  q('film','3',2,'I vilken serie finns kaféet Central Perk?','Vänner','Seinfeld','How I Met Your Mother','The Office');
  q('film','3',2,'Vilken serie handlar om det brittiska kungahuset?','The Crown','Downton Abbey','Bridgerton','Victoria');
  q('film','23',2,'Vad heter tv-programmet där kändisar tävlar i dans på TV4?','Let\'s Dance','Idol','Talang','Så mycket bättre');
  q('film','3',2,'Vilket år hade den första Star Wars-filmen premiär?','1977','1983','1969','1990');
  q('film','3',2,'Vilken animerad film blev 1937 Disneys första långfilm?','Snövit och de sju dvärgarna','Askungen','Pinocchio','Bambi');
  q('film','23',2,'Vad heter Gotham Citys clown-skurk som är Batmans ärkefiende?','Jokern','Gåtan','Pingvinen','Bane');
  q('film','3',2,'Vilken svensk skådespelerska vann en Oscar för "The Danish Girl"?','Alicia Vikander','Noomi Rapace','Ingrid Bergman','Rebecca Ferguson');
  q('film','3',2,'Vilken svensk skådespelerska spelade i "Casablanca"?','Ingrid Bergman','Greta Garbo','Anita Ekberg','Liv Ullmann');
  q('film','23',2,'Vad heter staden där familjen Simpson bor?','Springfield','Quahog','South Park','Riverdale');
  tf('film','12',1,'Shrek är ett grönt troll.',true);
  tf('film','23',2,'Pixar har gjort filmen "Lejonkungen".',false);
  tf('film','3',2,'Den svenska julkalendern på SVT har sänts varje år sedan 1960.',true);

  // ═════════ MAT & DRYCK ═════════
  const RATT = [['Paella','Spanien'],['Croissant','Frankrike'],['Gyros','Grekland'],['Moussaka','Grekland'],['Pad thai','Thailand'],['Kimchi','Sydkorea'],['Pho','Vietnam'],
    ['Butter chicken','Indien'],['Gulasch','Ungern'],['Wienerschnitzel','Österrike'],['Fish and chips','Storbritannien'],['Bratwurst','Tyskland'],['Surströmming','Sverige'],
    ['Smørrebrød','Danmark'],['Pierogi','Polen'],['Ceviche','Peru'],['Feijoada','Brasilien'],['Poutine','Kanada'],['Fondue','Schweiz'],['Tapas','Spanien'],['Risotto','Italien'],
    ['Carbonara','Italien'],['Dim sum','Kina'],['Pekinganka','Kina'],['Ramen','Japan'],['Tempura','Japan'],['Bibimbap','Sydkorea'],['Tzatziki','Grekland'],['Churros','Spanien'],
    ['Crème brûlée','Frankrike'],['Macarons','Frankrike'],['Tiramisu','Italien'],['Pastel de nata','Portugal'],['Stroopwafel','Nederländerna'],['Nachos','Mexiko'],
    ['Quesadilla','Mexiko'],['Hamburgare med pommes','USA'],['Köttbullar med lingonsylt','Sverige'],['Kebab (döner)','Turkiet']];
  const rLand = [...new Set(RATT.map(r => r[1]))];
  const lattR = new Set(['Pizza','Croissant','Tacos','Köttbullar med lingonsylt','Carbonara','Nachos','Hamburgare med pommes','Churros']);
  for (const [r, l] of RATT) gq('mat', lattR.has(r) ? '0123' : '23', lattR.has(r) ? 1 : 2, 'ratt', `Från vilket land kommer ${r} ursprungligen?`, l, rLand, []);
  const ING = [['Pesto','Basilika'],['Hummus','Kikärtor'],['Ketchup','Tomater'],['Popcorn','Majs'],['Chips','Potatis'],['Vin','Druvor'],
    ['Cider','Äpplen'],['Ost','Mjölk'],['Smör','Grädde'],['Falafel','Kikärtor'],['Baba ganoush','Aubergine'],['Surkål','Vitkål'],['Risgrynsgröt','Ris'],['Polenta','Majsmjöl'],
    ['Couscous','Vete'],['Tahini','Sesamfrön'],['Miso','Sojabönor'],['Pasta','Vete'],['Sushiris','Ris'],['Guacamole','Avokado'],['Gazpacho','Tomater']];
  const ingr = [...new Set(ING.map(i => i[1]))];
  for (const [p, i] of ING) gq('mat', ['Ketchup','Popcorn','Chips','Ost','Smör','Pasta'].includes(p) ? '0123' : '23', ['Ketchup','Popcorn','Chips','Ost'].includes(p) ? 1 : 2, 'ingrediens', `Vad är ${p.toLowerCase()} främst gjort av?`, i, ingr, []);
  const SORT = [['Äpple','Frukt'],['Päron','Frukt'],['Banan','Frukt'],['Apelsin','Frukt'],['Morot','Grönsak'],['Broccoli','Grönsak'],['Lök','Grönsak'],['Blåbär','Bär'],
    ['Lingon','Bär'],['Hallon','Bär'],['Hasselnöt','Nöt'],['Valnöt','Nöt'],['Spenat','Grönsak'],['Krusbär','Bär'],['Paranöt','Nöt']];
  for (const [s, t] of SORT) gq('mat', '01', 1, 'sortera', `Är ${s.toLowerCase()} en frukt, grönsak, bär eller nöt?`, t, ['Frukt','Grönsak','Bär','Nöt'], []);
  const FARG = [['en mogen banan','Gul'],['en mogen tomat','Röd'],['en gurka','Grön'],['en aubergine','Lila'],['en morot','Orange'],['ett blåbär','Blå'],['en citron','Gul'],
    ['insidan av en vattenmelon','Röd'],['insidan av en kiwi','Grön'],['ett lingon','Röd']];
  for (const [s, f] of FARG) gq('mat', '0', 1, 'farg', `Vilken färg har ${s}?`, f, ['Gul','Röd','Grön','Lila','Orange','Blå','Brun','Vit'], []);

  q('mat','0',1,'Vad gör man popcorn av?','Majs','Ris','Potatis','Mjöl');
  q('mat','0',1,'Vilket djur ger oss ägg? 🥚','Hönan','Kon','Grisen','Hästen');
  q('mat','0',1,'Vad dricker man ofta till frukost som kommer från kon?','Mjölk','Juice','Te','Vatten');
  q('mat','0',1,'Vad heter maten som är rund, har tomatsås och ost och kommer från Italien?','Pizza','Tacos','Sushi','Pannkaka');
  q('mat','0',1,'Var förvarar man glass så att den inte smälter?','I frysen','I skåpet','I ugnen','På bordet');
  q('mat','01',1,'Vad äter man traditionellt på torsdagar i Sverige tillsammans med pannkakor?','Ärtsoppa','Fiskpinnar','Pizza','Gröt');
  q('mat','12',1,'Vad heter den svenska fikabullen med kanel?','Kanelbulle','Semla','Lussekatt','Mazarin');
  q('mat','12',1,'Vad kallas en svensk kaffepaus med något gott?','Fika','Brunch','Mys','Lunch');
  q('mat','12',2,'Vad är huvudingrediensen i Janssons frestelse?','Potatis och ansjovis','Ris och lax','Pasta och skinka','Kött och lök');
  q('mat','12',2,'Vad heter den gröna tårtan med marsipan och vaniljkräm?','Prinsesstårta','Sachertårta','Ostkaka','Schwarzwaldtårta');
  q('mat','3',2,'Från vilket landskap kommer ostkaka traditionellt?','Småland','Skåne','Norrland','Gotland');
  q('mat','3',2,'Vad kallas en smörgåstårta?','En tårta av bröd med pålägg','En tårta av smör','En kaka med sylt','En glasstårta');
  q('mat','23',2,'Vad heter kryddan som ger curry sin gula färg?','Gurkmeja','Saffran','Paprika','Kanel');
  q('mat','3',2,'Vilken krydda är dyrast i världen räknat per gram?','Saffran','Vanilj','Kardemumma','Svartpeppar');
  q('mat','3',2,'Från vilken sorts växt får man vanilj?','En orkidé','Ett barrträd','En kaktus','En svamp');
  q('mat','23',2,'Vilket land är världens största producent av kaffe?','Brasilien','Colombia','Etiopien','Vietnam');
  q('mat','3',2,'Vilket land kommer teet Earl Grey från?','Storbritannien','Kina','Indien','Japan');
  q('mat','23',2,'Vad heter det japanska gröna tepulvret?','Matcha','Chai','Rooibos','Sencha-sås');
  q('mat','3',2,'Vad heter den italienska kaffedrycken med mycket mjölkskum?','Cappuccino','Espresso','Americano','Ristretto');
  q('mat','3',2,'Vilken av dessa är en stark mexikansk chilipeppar?','Jalapeño','Paprika','Kapris','Oliv');
  q('mat','12',1,'Vilken vitamin finns det mycket av i apelsiner?','C-vitamin','D-vitamin','B12','K-vitamin');
  q('mat','12',1,'Vilken av dessa är en citrusfrukt?','Lime','Äpple','Banan','Plommon');
  q('mat','12',1,'Vad heter det gula som finns inuti ett ägg?','Gula','Vita','Skal','Hinna');
  q('mat','23',2,'Vilken mat brukar förknippas med Neapel i Italien?','Pizza','Lasagne','Risotto','Tiramisu');
  q('mat','3',2,'Vad heter den franska bakelsen med lager av smördeg och vaniljkräm?','Napoleonbakelse','Mazarin','Budapestbakelse','Biskvi');
  q('mat','3',2,'Vilken sorts mat är "brie" och "camembert"?','Ostar','Korvar','Brödsorter','Kakor');
  q('mat','3',2,'Vad är prosciutto?','Lufttorkad skinka','En ost','En pasta','En sås');
  q('mat','23',2,'Vad heter den japanska rätten med grillade spett?','Yakitori','Sushi','Ramen','Tempura');
  q('mat','3',2,'Vilket land kommer champagne från?','Frankrike','Italien','Spanien','Tyskland');
  q('mat','12',1,'Vad kallas mat utan kött, fisk och andra produkter från djur?','Vegansk','Vegetarisk','Glutenfri','Laktosfri');
  q('mat','23',2,'Vad heter proteinet i vete som en del människor inte tål?','Gluten','Laktos','Kasein','Fruktos');
  q('mat','23',2,'Vilket socker finns i mjölk?','Laktos','Fruktos','Sackaros','Glukos');
  tf('mat','12',1,'Jordnötter är egentligen inte nötter utan baljväxter.',true);
  tf('mat','23',2,'Bananer växer på träd.',false);
  tf('mat','3',2,'Honung kan hålla i tusentals år utan att bli dålig.',true);
  tf('mat','12',1,'Potatis kommer ursprungligen från Sydamerika.',true);

  // ═════════ MUSIKFAKTA ═════════
  const FAM = [['Fiol','Stråkinstrument'],['Cello','Stråkinstrument'],['Kontrabas','Stråkinstrument'],['Trumpet','Bleckblåsinstrument'],['Trombon','Bleckblåsinstrument'],
    ['Tuba','Bleckblåsinstrument'],['Valthorn','Bleckblåsinstrument'],['Flöjt','Träblåsinstrument'],['Klarinett','Träblåsinstrument'],['Oboe','Träblåsinstrument'],['Fagott','Träblåsinstrument'],
    ['Saxofon','Träblåsinstrument'],['Xylofon','Slagverk'],['Pukor','Slagverk'],['Triangel','Slagverk'],['Virveltrumma','Slagverk'],['Piano','Tangentinstrument'],['Orgel','Tangentinstrument'],['Cembalo','Tangentinstrument']];
  const fam = [...new Set(FAM.map(f => f[1]))];
  for (const [i, f] of FAM) gq('musik', ['Fiol','Trumpet','Flöjt','Piano','Triangel'].includes(i) ? '123' : '23', ['Fiol','Trumpet','Piano'].includes(i) ? 1 : 2, 'familj', `Vilken instrumentgrupp hör ${i.toLowerCase()} till?`, f, fam, []);
  const INL = [['Didgeridoo','Australien'],['Balalajka','Ryssland'],['Sitar','Indien'],['Säckpipa','Skottland'],['Nyckelharpa','Sverige'],['Ukulele','Hawaii'],['Bouzouki','Grekland'],['Kantele','Finland'],['Alphorn','Schweiz']];
  const inl = INL.map(i => i[1]);
  for (const [i, l] of INL) gq('musik', '3', 2, 'instrland', `Var kommer instrumentet ${i.toLowerCase()} ifrån?`, l, inl, []);
  const ART = [['ABBA','Sverige'],['Roxette','Sverige'],['Avicii','Sverige'],['Robyn','Sverige'],['The Cardigans','Sverige'],['Ghost','Sverige'],['Måneskin','Italien'],['Rammstein','Tyskland'],
    ['a-ha','Norge'],['Kygo','Norge'],['Alan Walker','Norge'],['Aurora','Norge'],['Björk','Island'],['U2','Irland'],['The Beatles','Storbritannien'],['Queen','Storbritannien'],
    ['Coldplay','Storbritannien'],['Adele','Storbritannien'],['Ed Sheeran','Storbritannien'],['Shakira','Colombia'],['Rosalía','Spanien'],['BTS','Sydkorea'],['Blackpink','Sydkorea'],
    ['Céline Dion','Kanada'],['Justin Bieber','Kanada'],['Drake','Kanada'],['The Weeknd','Kanada'],['Kylie Minogue','Australien'],['AC/DC','Australien'],['Daft Punk','Frankrike'],
    ['David Guetta','Frankrike'],['Bob Marley','Jamaica'],['Rihanna','Barbados'],['Andrea Bocelli','Italien'],['Lordi','Finland'],['Taylor Swift','USA'],['Beyoncé','USA'],['Elvis Presley','USA']];
  const artL = [...new Set(ART.map(a => a[1]))];
  const lattA = new Set(['ABBA','Avicii','The Beatles','Taylor Swift','Justin Bieber','Ed Sheeran','Elvis Presley','Shakira']);
  for (const [a, l] of ART) gq('musik', lattA.has(a) ? '123' : '23', lattA.has(a) ? 1 : 2, 'artistland', `Vilket land kommer ${a} från?`, l, artL, []);
  const LAT = [['Thriller','Michael Jackson'],['Like a Prayer','Madonna'],['Hello','Adele'],['Purple Rain','Prince'],['Imagine','John Lennon'],['Yesterday','The Beatles'],
    ['Wonderwall','Oasis'],['Halo','Beyoncé'],['Rehab','Amy Winehouse'],['Umbrella','Rihanna'],['Poker Face','Lady Gaga'],['Shake It Off','Taylor Swift'],['Euphoria','Loreen'],
    ['Listen to Your Heart','Roxette'],['Dancing On My Own','Robyn'],['Lovefool','The Cardigans'],['Gangnam Style','PSY'],['Dynamite','BTS'],['Waka Waka','Shakira'],
    ['Levitating','Dua Lipa'],['drivers license','Olivia Rodrigo'],['As It Was','Harry Styles'],['Take On Me','a-ha'],['Faded','Alan Walker'],['Diggi-Loo Diggi-Ley','Herreys'],
    ['Take Me to Your Heaven','Charlotte Nilsson'],['Främling','Carola'],['Hey Jude','The Beatles'],['Livin\' on a Prayer','Bon Jovi'],['Sweet Child O\' Mine','Guns N\' Roses'],
    ['Bad Romance','Lady Gaga'],['Rolling in the Deep','Adele'],['Single Ladies','Beyoncé'],['Firework','Katy Perry'],['Believer','Imagine Dragons'],['Viva La Vida','Coldplay'],
    ['Seven Nation Army','The White Stripes'],['Smells Like Teen Spirit','Nirvana'],['Hotel California','Eagles'],['Africa','Toto']];
  const latA = [...new Set(LAT.map(l => l[1]))];
  const lattL = new Set(['Shake It Off','Gangnam Style','Waka Waka','Thriller','Faded','Firework','Believer']);
  for (const [l, a] of LAT) gq('musik', lattL.has(l) ? '123' : '23', lattL.has(l) ? 1 : 2, 'lat', `Vem sjunger "${l}"?`, a, latA, []);
  const ESC = [[1984,'Sverige','Herreys'],[1999,'Sverige','Charlotte Nilsson'],[2015,'Sverige','Måns Zelmerlöw'],[2023,'Sverige','Loreen'],[1985,'Norge','Bobbysocks'],
    [1995,'Norge','Secret Garden'],[2009,'Norge','Alexander Rybak'],[2006,'Finland','Lordi'],[2000,'Danmark','Olsen Brothers'],[2013,'Danmark','Emmelie de Forest'],
    [2014,'Österrike','Conchita Wurst'],[2016,'Ukraina','Jamala'],[2017,'Portugal','Salvador Sobral'],[2019,'Nederländerna','Duncan Laurence'],[2021,'Italien','Måneskin'],
    [2022,'Ukraina','Kalush Orchestra'],[2024,'Schweiz','Nemo'],[2025,'Österrike','JJ'],[1988,'Schweiz','Céline Dion']];
  const escL = [...new Set(ESC.map(e => e[1]))];
  for (const [y, l, a] of ESC) gq('musik', l === 'Sverige' ? '23' : '3', l === 'Sverige' ? 2 : 3, 'esc', `Vilket land vann Eurovision ${y} med ${a}?`, l, escL, ['Irland','Frankrike','Storbritannien']);
  const KOMP = [['Wolfgang Amadeus Mozart','Österrike'],['Ludwig van Beethoven','Tyskland'],['Johann Sebastian Bach','Tyskland'],['Frédéric Chopin','Polen'],['Pjotr Tjajkovskij','Ryssland'],
    ['Antonio Vivaldi','Italien'],['Edvard Grieg','Norge'],['Jean Sibelius','Finland'],['Giuseppe Verdi','Italien'],['Claude Debussy','Frankrike'],['Carl Michael Bellman','Sverige']];
  const kompL = [...new Set(KOMP.map(k => k[1]))];
  for (const [k, l] of KOMP) gq('musik', '3', 2, 'kompland', `Från vilket land kom kompositören ${k}?`, l, kompL, []);
  const VERK = [['De fyra årstiderna','Antonio Vivaldi'],['I bergakungens sal','Edvard Grieg'],['Finlandia','Jean Sibelius'],['Svansjön','Pjotr Tjajkovskij'],['Nötknäpparen','Pjotr Tjajkovskij'],
    ['Månskenssonaten','Ludwig van Beethoven'],['Trollflöjten','Wolfgang Amadeus Mozart'],['Eine kleine Nachtmusik','Wolfgang Amadeus Mozart'],['An der schönen blauen Donau','Johann Strauss d.y.'],
    ['Aida','Giuseppe Verdi'],['Messias','Georg Friedrich Händel'],['Brandenburgkonserterna','Johann Sebastian Bach'],['Boléro','Maurice Ravel'],['Carmen','Georges Bizet'],['Fredmans epistlar','Carl Michael Bellman']];
  const verkK = [...new Set(VERK.map(v => v[1]))];
  for (const [v, k] of VERK) gq('musik', '3', 3, 'verk', `Vem komponerade "${v}"?`, k, verkK, []);
  const MTERM = [['forte','Starkt'],['piano','Svagt'],['allegro','Snabbt'],['adagio','Långsamt'],['crescendo','Allt starkare'],['a cappella','Sång utan instrument']];
  const tB = MTERM.map(t => t[1]);
  for (const [t, b] of MTERM) gq('musik', '3', 2, 'term', `Vad betyder "${t}" i musik?`, b, tB, []);
  const ANT = [['duett','2'],['trio','3'],['kvintett','5'],['solo','1'],['oktett','8']];
  for (const [t, n] of ANT) gq('musik', '23', 2, 'antal', `Hur många musiker är det i en ${t}?`, n, ['1','2','3','4','5','6','7','8'], []);

  q('musik','0',1,'Vilken sång sjunger man i Sverige när någon fyller år? 🎂','Ja, må hon/han leva','Små grodorna','Bä, bä, vita lamm','Nu är det jul igen');
  q('musik','0',1,'Vilken sång dansar man till kring midsommarstången?','Små grodorna','Ja, må hon leva','Blinka lilla','Lucia');
  q('musik','0',1,'Vilken sång handlar om ett får som har ull?','Bä, bä, vita lamm','Imse vimse spindel','Mors lilla Olle','Huvud, axlar, knä och tå');
  q('musik','0',1,'Vilken sång handlar om en spindel som klättrar upp för en tråd?','Imse vimse spindel','Blinka lilla stjärna','Små grodorna','Björnen sover');
  q('musik','0',1,'Vilket djur sover i sången "… sover, … sover i sitt lugna bo"?','Björnen','Haren','Räven','Katten');
  q('musik','01',1,'Vad sjunger man när Lucia kommer?','Sankta Lucia','Nu är det jul igen','Små grodorna','Du gamla, du fria');
  q('musik','12',1,'Hur många linjer har ett notsystem?','5','4','6','7');
  q('musik','12',1,'Hur många toner finns det i en vanlig skala (do-re-mi-fa-so-la-ti)?','7','5','8','12');
  q('musik','12',1,'Vad heter tecknet i början av ett notsystem för höga toner?','G-klav','F-klav','Paus','Taktstreck');
  q('musik','23',2,'Hur många strängar har en fiol?','4','5','6','3');
  q('musik','23',2,'Hur många strängar har en vanlig elbas?','4','6','5','3');
  q('musik','3',2,'Vilket instrument spelar man med en pedal för baskaggen?','Trumset','Piano','Orgel','Harpa');
  q('musik','23',1,'Vad heter ledaren som står framför en orkester och viftar med en pinne?','Dirigent','Kapellmästare','Solist','Konsertmästare');
  q('musik','3',2,'Vad heter pinnen som en dirigent använder?','Taktpinne','Stråke','Plektrum','Klubba');
  q('musik','3',2,'Vad heter det lilla platta föremålet man knäpper på gitarrsträngar med?','Plektrum','Stråke','Capo','Stämgaffel');
  q('musik','23',2,'Vilket svenskt band sjöng "The Final Countdown"?','Europe','Roxette','Ghost','Ace of Base');
  q('musik','3',2,'Vad heter Sveriges största musikgala med priser till artister?','Grammisgalan','Melodifestivalen','Polarpriset','Allsång på Skansen');
  q('musik','3',2,'Vilket internationellt musikpris delas ut i Sverige av kungen?','Polarpriset','Grammis','Nobelpriset','Guldbaggen');
  q('musik','3',2,'Vem grundade Polarpriset?','Stig Anderson','Benny Andersson','Max Martin','Björn Ulvaeus');
  q('musik','23',2,'Vilka två män i ABBA skrev låtarna?','Benny och Björn','Max och Avicii','Per och Marie','Agnetha och Frida');
  q('musik','3',2,'Vad heter musikalen med ABBA-låtar som blev film 2008?','Mamma Mia!','Chess','Grease','Kristina från Duvemåla');
  q('musik','3',2,'Vilken svensk producent har skrivit flest listettor i USA efter Paul McCartney och John Lennon?','Max Martin','Avicii','Benny Andersson','Shellback');
  q('musik','3',2,'Vad heter Sveriges största sommarfestival för allsång?','Allsång på Skansen','Lotta på Liseberg','Melodifestivalen','Sommarkrysset');
  tf('musik','12',1,'Ett piano har både svarta och vita tangenter.',true);
  tf('musik','23',2,'Saxofonen räknas som ett träblåsinstrument fast den är gjord av metall.',true);
  tf('musik','3',2,'Beethoven blev döv men fortsatte att komponera.',true);
  tf('musik','23',1,'ABBA vann Eurovision med låten "Dancing Queen".',false);
})();
