/* Quiz Champions – fler handskrivna frågor (2026-11) */
(function () {
  const { q, tf } = window.QKB;

  // ───────── Djur & natur ─────────
  q('djur','0',1,'Vilket djur säger "nöff"? 🐷','Grisen','Kon','Fåret','Hästen');
  q('djur','0',1,'Vad heter kons unge?','Kalv','Föl','Lamm','Kid');
  q('djur','0',1,'Vad heter fårets unge?','Lamm','Kalv','Kid','Kulting');
  q('djur','01',1,'Vilken färg har en flamingo oftast? 🦩','Rosa','Blå','Gul','Svart');
  q('djur','01',1,'Vilket djur bär sitt hus på ryggen?','Snigeln','Igelkotten','Myran','Ekorren');
  q('djur','01',1,'Vilket djur samlar nötter och bor i träd? 🐿️','Ekorren','Haren','Igelkotten','Räven');
  q('djur','01',1,'Vilket djur har taggar på ryggen och sover på vintern? 🦔','Igelkotten','Ekorren','Haren','Grävlingen');
  q('djur','012',1,'Vad kallas en grupp vargar?','Flock','Hjord','Svärm','Stim');
  q('djur','012',1,'Vad kallas en grupp fiskar som simmar tillsammans?','Stim','Flock','Hjord','Koloni');
  q('djur','12',1,'Vilket djur är känt för att bygga dammar?','Bävern','Uttern','Bisamråttan','Minken');
  q('djur','12',2,'Vilken fågel är Sveriges nationalfågel?','Koltrasten','Örnen','Svanen','Talgoxen');
  q('djur','123',2,'Vad äter en blåval mest av?','Krill','Säl','Tonfisk','Sjögräs');
  q('djur','123',2,'Vilket djur har störst ögon av alla djur?','Jättebläckfisken','Blåvalen','Strutsen','Elefanten');
  q('djur','23',2,'Vad kallas ett djur som är aktivt på natten?','Nattaktivt','Dagaktivt','Kallblodigt','Växelvarmt');
  q('djur','23',2,'Vilket av djuren är INTE ett däggdjur?','Pingvinen','Delfinen','Fladdermusen','Valen');
  q('djur','23',2,'Hur andas fiskar?','Med gälar','Med lungor','Genom huden','Med fenorna');
  q('djur','3',3,'Vad kallas läran om fåglar?','Ornitologi','Entomologi','Zoologi','Botanik');
  q('djur','3',3,'Vad kallas läran om insekter?','Entomologi','Ornitologi','Herpetologi','Mykologi');
  q('djur','123',1,'Vilken svamp är röd med vita prickar och giftig? 🍄','Flugsvamp','Kantarell','Karl Johan','Champinjon');
  q('djur','23',2,'Vilken gul svamp är en populär matsvamp i Sverige?','Kantarell','Flugsvamp','Murkla','Flugsopp');
  tf('djur','012',1,'En spindel är en insekt.',false);
  tf('djur','123',1,'Delfiner andas luft.',true);
  tf('djur','23',2,'Krokodiler kan inte räcka ut tungan.',true);

  // ───────── Kroppen ─────────
  q('kropp','0',1,'Med vad luktar du? 👃','Näsan','Öronen','Ögonen','Munnen');
  q('kropp','0',1,'Hur många fingrar har du på en hand?','5','4','6','10');
  q('kropp','01',1,'Vilket organ pumpar blodet runt i kroppen?','Hjärtat','Lungorna','Magen','Levern');
  q('kropp','01',1,'Vad behöver vi för att andas?','Syre','Koldioxid','Kväve','Helium');
  q('kropp','12',1,'Var sitter lårbenet?','I benet','I armen','I ryggen','I huvudet');
  q('kropp','12',1,'Vad heter kroppens största organ?','Huden','Levern','Lungorna','Hjärnan');
  q('kropp','123',2,'Vad heter de små blodkärlen mellan artärer och vener?','Kapillärer','Senor','Nerver','Lymfkärl');
  q('kropp','123',2,'Vilken del av ögat ger ögonen färg?','Regnbågshinnan','Pupillen','Näthinnan','Linsen');
  q('kropp','23',2,'Vad heter muskeln som hjälper oss att andas?','Diafragman','Biceps','Hjärtmuskeln','Magmuskeln');
  q('kropp','23',2,'Vilken blodgrupp kan ge blod till alla?','0 negativ','AB positiv','A positiv','B negativ');
  q('kropp','23',2,'Vad bildas i benmärgen?','Blodkroppar','Galla','Insulin','Saliv');
  q('kropp','3',3,'Vilket organ tillverkar insulin?','Bukspottkörteln','Levern','Njurarna','Mjälten');
  q('kropp','3',3,'Vad heter kroppens minsta ben?','Stigbygeln','Hammaren','Städet','Svanskotan');
  q('kropp','3',2,'Vilket vitamin bildar huden när solen lyser på den?','D-vitamin','C-vitamin','A-vitamin','B12');
  q('kropp','123',1,'Vad skyddar hjärnan?','Skallen','Revbenen','Bäckenet','Ryggraden');
  q('kropp','12',1,'Hur många sinnen brukar man säga att vi har?','5','3','7','10');
  tf('kropp','123',1,'Naglar och hår växer hela livet.',true);
  tf('kropp','23',2,'Hjärtat sitter exakt mitt i bröstet.',false);

  // ───────── Mat & dryck ─────────
  q('mat','0',1,'Vilken frukt är gul och böjd? 🍌','Banan','Äpple','Päron','Apelsin');
  q('mat','0',1,'Vad gör man popcorn av? 🍿','Majs','Ris','Vete','Potatis');
  q('mat','01',1,'Vad är huvudingrediensen i pommes frites?','Potatis','Morot','Majs','Ris');
  q('mat','01',1,'Vad gör bina som vi äter? 🍯','Honung','Sylt','Sirap','Socker');
  q('mat','012',1,'Vilket land kommer sushi från?','Japan','Kina','Thailand','Korea');
  q('mat','012',1,'Vilket land kommer tacos från?','Mexiko','Spanien','Brasilien','USA');
  q('mat','12',1,'Vad äter man traditionellt på fettisdagen i Sverige?','Semlor','Kanelbullar','Lussekatter','Pepparkakor');
  q('mat','12',1,'Vilken dag firar man kanelbullens dag?','4 oktober','13 december','1 april','6 juni');
  q('mat','12',2,'Vilket kryddigt gult pulver används i curry?','Gurkmeja','Paprika','Kanel','Kardemumma');
  q('mat','123',2,'Vad gör man ost av?','Mjölk','Ägg','Mjöl','Smör');
  q('mat','123',2,'Vad heter den spanska risrätten med skaldjur?','Paella','Risotto','Pilaff','Biryani');
  q('mat','23',2,'Vad heter den italienska efterrätten med mascarpone och kaffe?','Tiramisu','Panna cotta','Cannoli','Gelato');
  q('mat','23',2,'Vilken nöt används i marsipan?','Mandel','Hasselnöt','Valnöt','Jordnöt');
  q('mat','23',2,'Vad heter den grekiska yoghurtsåsen med gurka och vitlök?','Tzatziki','Hummus','Guacamole','Salsa');
  q('mat','3',3,'Vilken druva är vanligast i champagne tillsammans med pinot noir?','Chardonnay','Merlot','Riesling','Syrah');
  q('mat','3',2,'Vad heter det japanska gröna tepulvret?','Matcha','Sencha','Chai','Rooibos');
  q('mat','3',3,'Vad heter den ungerska grytan med paprika?','Gulasch','Stroganoff','Bouillabaisse','Ratatouille');
  q('mat','23',2,'Vad äter man traditionellt till köttbullar i Sverige?','Lingonsylt','Hjortronsylt','Jordgubbssylt','Äppelmos');
  tf('mat','012',1,'Tomaten är egentligen ett bär.',true);
  tf('mat','123',2,'Jordnötter är nötter som växer på träd.',false);

  // ───────── Teknik & internet ─────────
  q('teknik','01',1,'Vad behöver en mobil för att fungera länge?','Ett laddat batteri','Vatten','Solglasögon','En sladd till TV:n');
  q('teknik','01',1,'Vad heter knappen man trycker på för att göra mellanslag?','Mellanslagstangenten','Enter','Shift','Escape');
  q('teknik','12',1,'Vad står "www" för i webbadresser?','World Wide Web','Wide World Window','Web Wire World','World Web Wire');
  q('teknik','12',1,'Vilket företag gör Playstation?','Sony','Nintendo','Microsoft','Sega');
  q('teknik','12',1,'Vilket företag gör Xbox?','Microsoft','Sony','Nintendo','Apple');
  q('teknik','12',1,'Vilket företag gör Switch-konsolen?','Nintendo','Sony','Microsoft','Valve');
  q('teknik','123',2,'Vad heter Apples röstassistent?','Siri','Alexa','Cortana','Google Assistent');
  q('teknik','123',2,'Vad heter Amazons röstassistent?','Alexa','Siri','Cortana','Bixby');
  q('teknik','123',2,'Vilket land kommer Spotify ifrån?','Sverige','USA','Norge','Finland');
  q('teknik','123',2,'Vilket land kommer Nokia ifrån?','Finland','Sverige','Japan','Danmark');
  q('teknik','23',2,'Vad betyder "AI"?','Artificiell intelligens','Automatisk information','Avancerad internet','Allmän indata');
  q('teknik','23',2,'Vad heter Googles mobila operativsystem?','Android','iOS','Windows','Linux');
  q('teknik','23',2,'Vilken svensk uppfinning används för att betala med mobilen i Sverige?','Swish','Klarna','BankID','Zettle');
  q('teknik','23',2,'Vad kallas ett falskt mejl som försöker lura till sig lösenord?','Nätfiske','Spam-fiske','Trål','Dataregn');
  q('teknik','3',3,'Vad står "USB" för?','Universal Serial Bus','United System Board','Universal Speed Bridge','User Serial Box');
  q('teknik','3',3,'Vad står "GPS" för?','Global Positioning System','General Position Service','Global Phone Satellite','Geo Path System');
  q('teknik','3',2,'Vilket svenskt bolag grundade Bluetooth-tekniken?','Ericsson','Volvo','Saab','ABB');
  q('teknik','3',3,'Vilken dansk kung har gett namn åt Bluetooth?','Harald Blåtand','Knut den store','Kristian IV','Gorm den gamle');
  tf('teknik','123',1,'Wi-Fi kan fungera utan internet i huset.',true);
  tf('teknik','23',2,'Den första iPhonen kom 2010.',false);

  // ───────── Film, TV & spel ─────────
  q('film','0',1,'Vad heter snögubben i Frost? ⛄','Olof','Sven','Kristoffer','Hans');
  q('film','0',1,'Vad heter renen i Frost?','Sven','Olof','Rudolf','Bambi');
  q('film','01',1,'Vilken färg har Shrek?','Grön','Blå','Lila','Brun');
  q('film','01',1,'Vad heter cowboyen i Toy Story?','Woody','Buzz','Rex','Jessie');
  q('film','01',1,'Vad heter clownfisken som försvinner i "Hitta Nemo"?','Nemo','Doris','Marlin','Bruce');
  q('film','012',1,'Vilken figur säger "Till oändligheten och vidare!"?','Buzz Lightyear','Woody','Mr. Potatohead','Rex');
  q('film','12',1,'Vad heter skolan i Harry Potter?','Hogwarts','Narnia','Avonlea','Rivendell');
  q('film','12',1,'Vad heter Batmans stad?','Gotham City','Metropolis','Springfield','Star City');
  q('film','12',2,'Vad heter den gröna jätten i Marvel som blir stark när han blir arg?','Hulken','Groot','Thanos','Shrek');
  q('film','123',1,'Vad heter den gula familjen i en tecknad TV-serie från Springfield?','Simpsons','Griffin','Flinta','Belcher');
  q('film','123',2,'Vilket spel går ut på att bygga med kuber och överleva mot creepers?','Minecraft','Roblox','Fortnite','Terraria');
  q('film','123',2,'I vilket spel springer Sonic?','Sonic the Hedgehog','Super Mario','Crash Bandicoot','Spyro');
  q('film','23',2,'Vem regisserade "Titanic" och "Avatar"?','James Cameron','Steven Spielberg','Christopher Nolan','Ridley Scott');
  q('film','23',2,'Vad heter huvudpersonen i "Stranger Things" som har superkrafter?','Elva','Max','Nancy','Robin');
  q('film','3',2,'Vilken film vann Oscar för bästa film 2020 som den första icke-engelskspråkiga?','Parasit','Roma','Amélie','Squid Game');
  q('film','3',3,'Vem spelar Wednesday Addams i Netflix-serien "Wednesday"?','Jenna Ortega','Millie Bobby Brown','Zendaya','Emma Myers');
  q('film','3',2,'Vilken svensk skådespelare spelar Lisbeth Salander i den svenska "Millennium"-filmen?','Noomi Rapace','Rooney Mara','Alicia Vikander','Rebecca Ferguson');
  tf('film','012',1,'Musse Pigg är en katt.',false);
  tf('film','123',2,'Pixar har gjort filmen "Coco".',true);

  // ───────── Sport ─────────
  q('sport','01',1,'Vilken sport spelar man med klubba och puck på is?','Ishockey','Bandy','Curling','Fotboll');
  q('sport','01',1,'Vad heter sporten där man skjuter med pilbåge mot en tavla?','Bågskytte','Dart','Curling','Fäktning');
  q('sport','012',1,'Vad kallas det när en fotbollsspelare gör tre mål i samma match?','Hattrick','Triple','Strike','Ace');
  q('sport','12',1,'Hur många ringar har den olympiska symbolen?','5','4','6','7');
  q('sport','12',1,'I vilken sport kan man få en "strike"?','Bowling','Tennis','Golf','Basket');
  q('sport','12',2,'Vad heter Sveriges mest kända längdskidlopp?','Vasaloppet','Engelbrektsloppet','Birkebeinerrennet','Tjejvasan');
  q('sport','123',2,'Vilket land har vunnit flest fotbolls-VM för herrar?','Brasilien','Tyskland','Italien','Argentina');
  q('sport','123',2,'Var spelas tennisturneringen Wimbledon?','London','Paris','New York','Melbourne');
  q('sport','123',2,'Vad heter världens mest kända cykellopp?','Tour de France','Giro d\'Italia','Vätternrundan','Paris–Roubaix');
  q('sport','23',2,'Vad heter Formel 1-stallet med en röd bil och en springande häst?','Ferrari','Red Bull','McLaren','Mercedes');
  q('sport','23',2,'Hur långt är ett varv på en vanlig friidrottsbana?','400 meter','200 meter','500 meter','1 000 meter');
  q('sport','23',2,'Vilken sport tävlar man i under Wimbledon?','Tennis','Golf','Cricket','Cykel');
  q('sport','3',3,'I vilken stad hölls sommar-OS 2024?','Paris','Los Angeles','Tokyo','London');
  q('sport','3',3,'I vilket land hålls vinter-OS 2026?','Italien','Sverige','Frankrike','Schweiz');
  q('sport','3',2,'Vad heter Sveriges mest kända travlopp?','Elitloppet','Derbyt','Svenskt Travkriterium','Hambletonian');
  q('sport','3',3,'Vilken svensk golfspelare vann flest majortävlingar bland damerna?','Annika Sörenstam','Liselotte Neumann','Anna Nordqvist','Madelene Sagström');
  tf('sport','123',1,'I basket får man studsa bollen medan man springer.',true);
  tf('sport','23',2,'En maratonlöpning är kortare än 40 km.',false);

  // ───────── Vetenskap & rymden ─────────
  q('vet','0',1,'Vad lyser på himlen på natten och ändrar form? 🌙','Månen','Solen','Molnen','Regnbågen');
  q('vet','01',1,'Vilken är den närmaste stjärnan till jorden?','Solen','Polstjärnan','Sirius','Månen');
  q('vet','01',1,'Vilken färg får man om man blandar blått och gult?','Grönt','Lila','Orange','Brunt');
  q('vet','012',1,'Vilken färg får man om man blandar rött och vitt?','Rosa','Lila','Orange','Grått');
  q('vet','12',1,'Vad heter planeten med ringar som är störst i solsystemet?','Saturnus','Jupiter','Uranus','Neptunus');
  q('vet','12',1,'Vad kallas fruset vatten?','Is','Ånga','Dagg','Dimma');
  q('vet','12',2,'Vilken planet kallas "den röda planeten"?','Mars','Venus','Merkurius','Jupiter');
  q('vet','123',2,'Vad kallas vatten i gasform?','Vattenånga','Is','Snö','Dagg');
  q('vet','123',2,'Vilket instrument använder man för att titta på stjärnor?','Teleskop','Mikroskop','Periskop','Kalejdoskop');
  q('vet','123',2,'Vilket instrument använder man för att titta på väldigt små saker?','Mikroskop','Teleskop','Barometer','Kompass');
  q('vet','23',2,'Vad mäter en barometer?','Lufttryck','Temperatur','Vindstyrka','Luftfuktighet');
  q('vet','23',2,'Vad heter kraften som drar saker mot jorden?','Gravitation','Magnetism','Friktion','Elektricitet');
  q('vet','23',2,'Vilken gas finns det mest av i luften?','Kväve','Syre','Koldioxid','Argon');
  q('vet','3',3,'Vad heter den närmaste stjärnan efter solen?','Proxima Centauri','Sirius','Betelgeuse','Vega');
  q('vet','3',2,'Vad heter rymdteleskopet som skickades upp 2021?','James Webb','Hubble','Kepler','Spitzer');
  q('vet','3',3,'Vilket grundämne är vanligast i universum?','Väte','Helium','Syre','Kol');
  tf('vet','012',1,'Solen är en stjärna.',true);
  tf('vet','123',2,'Ljud färdas snabbare än ljus.',false);
})();
