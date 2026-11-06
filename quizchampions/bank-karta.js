/* Quiz Champions – kartfrågor (sätt ut nålen) + frågor som räknas fram ur koordinaterna
 * [namn, lat, lon, åldrar, svårighet, (valfri fråga), (valfri okKm)] – koordinater i grader (WGS84). */
(function () {
  const { q, pin, num, shuf, rand } = window.QKB;

  // ───────── Sverige ─────────
  const SE = [
    ['Stockholm',59.33,18.07,'0123',1],['Göteborg',57.71,11.97,'0123',1],['Malmö',55.60,13.00,'0123',1],['Uppsala',59.86,17.64,'123',1],
    ['Västerås',59.61,16.55,'123',2],['Örebro',59.27,15.21,'123',2],['Linköping',58.41,15.62,'123',2],['Helsingborg',56.05,12.69,'123',2],
    ['Jönköping',57.78,14.16,'123',1],['Norrköping',58.59,16.18,'123',2],['Lund',55.70,13.19,'123',2],['Umeå',63.83,20.26,'123',2],
    ['Gävle',60.67,17.14,'123',2],['Borås',57.72,12.94,'23',2],['Södertälje',59.20,17.63,'23',3],['Eskilstuna',59.37,16.51,'23',2],
    ['Halmstad',56.67,12.86,'23',2],['Växjö',56.88,14.81,'23',2],['Karlstad',59.38,13.50,'123',2],['Sundsvall',62.39,17.31,'23',2],
    ['Östersund',63.18,14.64,'123',2],['Trollhättan',58.28,12.29,'23',3],['Luleå',65.58,22.15,'123',2],['Kiruna',67.86,20.23,'0123',1],
    ['Gällivare',67.13,20.66,'23',3],['Jokkmokk',66.61,19.82,'23',3],['Haparanda',65.84,24.14,'23',2],['Skellefteå',64.75,20.95,'23',2],
    ['Piteå',65.32,21.48,'23',3],['Örnsköldsvik',63.29,18.72,'23',3],['Härnösand',62.63,17.94,'3',3],['Kalmar',56.66,16.36,'123',2],
    ['Karlskrona',56.16,15.59,'23',2],['Kristianstad',56.03,14.16,'23',3],['Ystad',55.43,13.82,'23',2],['Trelleborg',55.38,13.16,'23',3],
    ['Visby',57.64,18.29,'0123',1],['Falun',60.61,15.63,'23',2],['Mora',61.00,14.54,'123',2],['Borlänge',60.48,15.43,'3',3],
    ['Sälen',61.16,13.27,'123',2],['Åre',63.40,13.08,'123',2],['Strömstad',58.94,11.17,'23',2],['Uddevalla',58.35,11.94,'3',3],
    ['Varberg',57.11,12.25,'23',3],['Falkenberg',56.90,12.49,'3',3],['Kungsbacka',57.49,12.08,'3',3],['Vänersborg',58.38,12.32,'3',3],
    ['Lidköping',58.51,13.16,'3',3],['Skövde',58.39,13.85,'23',3],['Mariestad',58.71,13.82,'3',3],['Motala',58.54,15.04,'3',3],
    ['Nyköping',59.75,17.01,'23',3],['Norrtälje',59.76,18.70,'23',3],['Enköping',59.64,17.08,'3',3],['Sandviken',60.62,16.78,'3',3],
    ['Hudiksvall',61.73,17.10,'3',3],['Söderhamn',61.30,17.06,'3',3],['Sveg',62.03,14.36,'3',3],['Arvidsjaur',65.59,19.17,'3',3],
    ['Arjeplog',66.05,17.89,'3',3],['Pajala',67.21,23.37,'23',3],['Abisko',68.35,18.83,'23',3],['Smögen',58.36,11.22,'23',3],
    ['Marstrand',57.89,11.58,'23',3],['Gränna',58.03,14.47,'123',2],['Vimmerby',57.67,15.86,'0123',2],['Kolmården',58.66,16.40,'123',2],
    ['Borgholm på Öland',56.88,16.66,'23',2],['Fårö',57.92,19.13,'23',3],['Kullaberg',56.30,12.45,'3',3],['Rättvik vid Siljan',60.89,15.12,'23',2],
    ['Leksand',60.73,14.99,'23',3],['Orsa',61.12,14.62,'23',3],['Arvika',59.66,12.59,'3',3],['Kristinehamn',59.31,14.11,'3',3],
    ['Karlskoga',59.33,14.52,'3',3],['Köping',59.51,15.99,'3',3],['Sala',59.92,16.60,'3',3],['Vaxholm',59.40,18.35,'23',3],
    ['Sigtuna',59.62,17.72,'23',3],['Strängnäs',59.38,17.03,'3',3],['Katrineholm',58.99,16.21,'3',3],['Västervik',57.76,16.64,'23',3],
    ['Oskarshamn',57.26,16.45,'3',3],['Nässjö',57.65,14.70,'3',3],['Värnamo',57.19,14.04,'3',3],['Ljungby',56.83,13.94,'3',3],
    ['Älmhult',56.55,14.14,'23',3],['Hässleholm',56.16,13.77,'3',3],['Ängelholm',56.24,12.86,'3',3],['Landskrona',55.87,12.83,'3',3],
    ['Simrishamn',55.56,14.35,'23',3],['Sölvesborg',56.05,14.58,'3',3],['Karlshamn',56.17,14.86,'3',3],['Ronneby',56.21,15.28,'3',3],
    ['Kalix',65.85,23.14,'3',3],['Boden',65.83,21.69,'3',3],['Lycksele',64.60,18.67,'3',3],['Vilhelmina',64.62,16.66,'3',3],
    ['Storuman',65.10,17.11,'3',3],['Tärnaby',65.72,15.26,'23',3],['Funäsdalen',62.54,12.55,'3',3],['Idre',61.86,12.72,'23',3],
    ['Malung',60.69,13.72,'3',3],['Torsby',60.14,13.00,'3',3],['Hemavan',65.81,15.09,'23',3],['Hjo',58.30,14.28,'3',3],
    ['Vadstena',58.45,14.89,'23',3],['Ulricehamn',57.79,13.41,'3',3],['Alingsås',57.93,12.53,'3',3],['Lysekil',58.27,11.44,'3',3],
  ];
  const SE_PLACES = [
    ['Var ligger Kebnekaise, Sveriges högsta berg?','Kebnekaise',67.90,18.52,'123',2],
    ['Var ligger Treriksröset, där Sverige, Norge och Finland möts?','Treriksröset',69.06,20.55,'23',2],
    ['Var ligger Smygehuk, Sveriges sydligaste udde?','Smygehuk',55.34,13.36,'23',2],
    ['Var ligger Astrid Lindgrens Värld?','Astrid Lindgrens Värld (Vimmerby)',57.67,15.86,'0123',1],
    ['Var ligger Liseberg?','Liseberg (Göteborg)',57.70,11.99,'0123',1],
    ['Var ligger Gröna Lund?','Gröna Lund (Stockholm)',59.32,18.10,'0123',1],
    ['Var ligger Ales stenar?','Ales stenar',55.38,14.05,'3',3],
    ['Var ligger Höga kusten?','Höga kusten',63.10,18.40,'23',3],
    ['Var ligger Ishotellet i Jukkasjärvi?','Jukkasjärvi',67.85,20.60,'23',2],
    ['Var ligger Vasaloppets start i Sälen (Berga by)?','Berga by, Sälen',61.17,13.24,'23',3],
    ['Var ligger Ölandsbron?','Ölandsbron',56.67,16.40,'123',2],
    ['Var ligger Öresundsbron?','Öresundsbron',55.58,12.83,'123',1],
    ['Var ligger Dalhalla?','Dalhalla (Rättvik)',60.95,15.02,'3',3],
    ['Var ligger Birka, vikingastaden?','Birka',59.33,17.54,'23',3],
    ['Var ligger Göta kanals mynning i Östersjön (Mem)?','Mem',58.48,16.42,'3',3],
    ['Var ligger Tanumshede med sina hällristningar?','Tanumshede',58.72,11.33,'3',3],
    ['Var ligger Skansen?','Skansen (Stockholm)',59.33,18.10,'0123',1],
    ['Var ligger Kolmårdens djurpark?','Kolmårdens djurpark',58.67,16.39,'0123',1],
    ['Var ligger Glasriket med glasbruken Kosta och Orrefors?','Glasriket',56.80,15.50,'3',3],
    ['Var ligger Sarek nationalpark?','Sarek',67.30,17.70,'3',3,60],
    ['Var ligger Vänerns största stad Karlstad?','Karlstad',59.38,13.50,'23',2],
    ['Var ligger Visingsö?','Visingsö',58.05,14.33,'23',3],
    ['Var ligger Gotlands huvudort Visby?','Visby',57.64,18.29,'123',2],
    ['Var ligger Sveriges största sjö Vänern? Sätt nålen mitt i sjön.','Vänern',58.90,13.30,'123',1,50],
    ['Var ligger Vättern? Sätt nålen mitt i sjön.','Vättern',58.30,14.55,'123',1,40],
    ['Var ligger Siljan? Sätt nålen mitt i sjön.','Siljan',60.88,14.80,'23',2],
    ['Var ligger Öland? Sätt nålen mitt på ön.','Öland',56.75,16.65,'0123',1,50],
    ['Var ligger Gotland? Sätt nålen mitt på ön.','Gotland',57.50,18.55,'0123',1,50],
  ];
  for (const [n, lat, lon, a, d] of SE) pin(a, d, 'sverige', `Var ligger ${n}?`, n, lat, lon);
  for (const [t, n, lat, lon, a, d, ok] of SE_PLACES) pin(a, d, 'sverige', t, n, lat, lon, ok);

  // ───────── Europa ─────────
  const EU = [
    ['Oslo',59.91,10.75,'0123',1],['Köpenhamn',55.68,12.57,'0123',1],['Helsingfors',60.17,24.94,'123',1],['Stockholm',59.33,18.07,'0123',1],
    ['Reykjavik',64.15,-21.94,'123',2],['London',51.51,-0.13,'0123',1],['Dublin',53.35,-6.26,'123',2],['Edinburgh',55.95,-3.19,'23',2],
    ['Paris',48.86,2.35,'0123',1],['Bryssel',50.85,4.35,'123',2],['Amsterdam',52.37,4.90,'123',2],['Berlin',52.52,13.40,'0123',1],
    ['Hamburg',53.55,9.99,'23',2],['München',48.14,11.58,'23',2],['Wien',48.21,16.37,'123',2],['Bern',46.95,7.45,'23',3],
    ['Zürich',47.38,8.54,'23',2],['Genève',46.20,6.14,'23',3],['Rom',41.90,12.50,'0123',1],['Milano',45.46,9.19,'123',2],
    ['Venedig',45.44,12.32,'123',2],['Neapel',40.85,14.27,'23',2],['Madrid',40.42,-3.70,'0123',1],['Barcelona',41.39,2.17,'123',1],
    ['Lissabon',38.72,-9.14,'123',2],['Sevilla',37.39,-5.98,'23',3],['Aten',37.98,23.73,'123',1],['Istanbul',41.01,28.98,'123',2],
    ['Ankara',39.93,32.86,'23',3],['Warszawa',52.23,21.01,'123',2],['Prag',50.08,14.44,'123',2],['Budapest',47.50,19.04,'123',2],
    ['Bratislava',48.15,17.11,'3',3],['Ljubljana',46.06,14.51,'3',3],['Zagreb',45.81,15.98,'3',3],['Belgrad',44.79,20.45,'23',3],
    ['Sarajevo',43.86,18.41,'3',3],['Sofia',42.70,23.32,'3',3],['Bukarest',44.43,26.10,'23',3],['Kyiv',50.45,30.52,'23',2],
    ['Minsk',53.90,27.56,'3',3],['Vilnius',54.69,25.28,'3',3],['Riga',56.95,24.11,'23',2],['Tallinn',59.44,24.75,'23',2],
    ['Moskva',55.76,37.62,'123',1],['S:t Petersburg',59.93,30.34,'23',2],['Valletta',35.90,14.51,'3',3],['Tirana',41.33,19.82,'3',3],
    ['Skopje',42.00,21.43,'3',3],['Podgorica',42.44,19.26,'3',3],['Chișinău',47.01,28.86,'3',3],['Luxemburg',49.61,6.13,'3',3],
    ['Monaco',43.74,7.42,'23',2],['Andorra la Vella',42.51,1.52,'3',3],['Pristina',42.66,21.17,'3',3],['Nicosia',35.17,33.36,'3',3],
    ['Tórshavn på Färöarna',62.01,-6.77,'3',3],['Bergen',60.39,5.32,'23',2],['Tromsø',69.65,18.96,'23',3],['Göteborg',57.71,11.97,'123',1],
    ['Malmö',55.60,13.00,'123',1],['Åbo',60.45,22.27,'23',3],['Kraków',50.06,19.94,'23',3],['Gdańsk',54.35,18.65,'23',3],
    ['Manchester',53.48,-2.24,'123',2],['Liverpool',53.41,-2.98,'23',2],['Marseille',43.30,5.37,'23',2],['Lyon',45.76,4.84,'23',3],
    ['Nice',43.70,7.27,'23',3],['Bordeaux',44.84,-0.58,'3',3],['Porto',41.15,-8.61,'23',3],['Florens',43.77,11.26,'23',2],
    ['Salzburg',47.81,13.06,'3',3],['Frankfurt',50.11,8.68,'23',3],['Köln',50.94,6.96,'23',3],['Dubrovnik',42.65,18.09,'23',3],
    ['Split',43.51,16.44,'23',3],['Palma på Mallorca',39.57,2.65,'123',2],['Palermo på Sicilien',38.12,13.36,'23',3],['Ajaccio på Korsika',41.92,8.74,'3',3],
    ['Gibraltar',36.14,-5.35,'23',2],['Murmansk',68.97,33.08,'3',3],['Trondheim',63.43,10.40,'23',3],['Aarhus',56.16,10.20,'23',3],
  ];
  const EU_PLACES = [
    ['Var ligger Eiffeltornet?','Eiffeltornet (Paris)',48.858,2.294,'0123',1],['Var ligger Colosseum?','Colosseum (Rom)',41.89,12.49,'123',1],
    ['Var ligger Lutande tornet?','Pisa',43.72,10.40,'123',2],['Var ligger Big Ben?','Big Ben (London)',51.50,-0.12,'0123',1],
    ['Var ligger Akropolis?','Akropolis (Aten)',37.97,23.73,'123',2],['Var ligger Sagrada Família?','Sagrada Família (Barcelona)',41.40,2.17,'23',2],
    ['Var ligger Stonehenge?','Stonehenge',51.18,-1.83,'23',2],['Var ligger slottet Neuschwanstein?','Neuschwanstein',47.56,10.75,'23',3],
    ['Var ligger Matterhorn?','Matterhorn',45.98,7.66,'23',3],['Var ligger Mont Blanc, Alpernas högsta berg?','Mont Blanc',45.83,6.86,'23',2],
    ['Var ligger vulkanen Vesuvius?','Vesuvius',40.82,14.43,'23',2],['Var ligger vulkanen Etna?','Etna',37.75,14.99,'23',2],
    ['Var ligger Legoland i Billund?','Billund',55.74,9.13,'0123',1],['Var ligger sjön Loch Ness?','Loch Ness',57.32,-4.42,'123',2],
    ['Var ligger Disneyland Paris?','Disneyland Paris',48.87,2.78,'0123',1],['Var ligger Tjernobyl?','Tjernobyl',51.39,30.10,'3',3],
    ['Var ligger Auschwitz?','Auschwitz (Oświęcim)',50.03,19.20,'3',3],['Var ligger Santiago de Compostela?','Santiago de Compostela',42.88,-8.54,'3',3],
    ['Var ligger Lofoten?','Lofoten',68.20,14.00,'23',3,100],['Var ligger Geirangerfjorden?','Geirangerfjorden',62.10,7.21,'3',3],
    ['Var ligger Nordkap?','Nordkap',71.17,25.78,'123',2],['Var ligger Vatikanstaten?','Vatikanstaten',41.90,12.45,'123',2],
    ['Var ligger Brandenburger Tor?','Brandenburger Tor (Berlin)',52.52,13.38,'23',2],['Var ligger Kreta? Sätt nålen mitt på ön.','Kreta',35.24,24.90,'123',2,100],
    ['Var ligger Island? Sätt nålen mitt på ön.','Island',64.90,-18.60,'0123',1,150],['Var ligger Sardinien? Sätt nålen mitt på ön.','Sardinien',40.10,9.00,'23',2,100],
    ['Var ligger Cypern? Sätt nålen mitt på ön.','Cypern',35.05,33.20,'23',2,100],['Var ligger Rhodos?','Rhodos',36.20,28.00,'23',3],
    ['Var ligger Ålands huvudstad Mariehamn?','Mariehamn',60.10,19.94,'23',2],['Var ligger Bornholm?','Bornholm',55.12,14.92,'23',2],
    ['Var ligger Kanalöarna Jersey och Guernsey?','Jersey',49.21,-2.13,'3',3],['Var ligger Montserrat-klostret?','Montserrat',41.59,1.84,'3',3],
  ];
  for (const [n, lat, lon, a, d] of EU) pin(a, d, 'europa', `Var i Europa ligger ${n}?`, n, lat, lon);
  for (const [t, n, lat, lon, a, d, ok] of EU_PLACES) pin(a, d, 'europa', t, n, lat, lon, ok);

  // ───────── Världen ─────────
  const W = [
    ['New York',40.71,-74.01,'0123',1],['Los Angeles',34.05,-118.24,'0123',1],['Washington D.C.',38.90,-77.04,'123',2],['Chicago',41.88,-87.63,'123',2],
    ['Miami',25.76,-80.19,'123',2],['San Francisco',37.77,-122.42,'123',2],['Las Vegas',36.17,-115.14,'23',2],['Seattle',47.61,-122.33,'23',3],
    ['Toronto',43.65,-79.38,'23',2],['Vancouver',49.28,-123.12,'23',3],['Montréal',45.50,-73.57,'23',3],['Mexico City',19.43,-99.13,'123',2],
    ['Havanna',23.11,-82.37,'23',3],['Panama City',8.98,-79.52,'3',3],['Bogotá',4.71,-74.07,'23',3],['Lima',-12.05,-77.04,'23',3],
    ['Quito',-0.18,-78.47,'3',3],['Caracas',10.49,-66.88,'3',3],['Santiago de Chile',-33.45,-70.67,'23',3],['Buenos Aires',-34.60,-58.38,'123',2],
    ['Montevideo',-34.90,-56.16,'3',3],['Rio de Janeiro',-22.91,-43.17,'0123',1],['São Paulo',-23.55,-46.63,'23',2],['Brasília',-15.79,-47.88,'23',3],
    ['La Paz',-16.50,-68.15,'3',3],['Kairo',30.04,31.24,'123',1],['Kapstaden',-33.92,18.42,'123',2],['Johannesburg',-26.20,28.05,'23',3],
    ['Nairobi',-1.29,36.82,'23',2],['Addis Abeba',9.03,38.74,'3',3],['Lagos',6.52,3.38,'23',3],['Accra',5.60,-0.19,'3',3],
    ['Dakar',14.72,-17.47,'3',3],['Marrakech',31.63,-7.99,'23',2],['Tunis',36.81,10.18,'3',3],['Kinshasa',-4.44,15.27,'3',3],
    ['Dar es-Salaam',-6.79,39.21,'3',3],['Kampala',0.35,32.58,'3',3],['Khartoum',15.50,32.56,'3',3],['Antananarivo på Madagaskar',-18.88,47.51,'3',3],
    ['Moskva',55.76,37.62,'123',1],['Istanbul',41.01,28.98,'123',2],['Dubai',25.20,55.27,'123',1],['Riyadh',24.71,46.68,'3',3],
    ['Mecka',21.42,39.83,'23',2],['Jerusalem',31.77,35.21,'23',2],['Teheran',35.69,51.39,'23',3],['Bagdad',33.31,44.36,'23',3],
    ['Kabul',34.56,69.21,'3',3],['Karachi',24.86,67.01,'3',3],['New Delhi',28.61,77.21,'123',2],['Mumbai',19.08,72.88,'23',2],
    ['Katmandu',27.72,85.32,'23',3],['Dhaka',23.81,90.41,'3',3],['Colombo på Sri Lanka',6.93,79.86,'3',3],['Bangkok',13.76,100.50,'123',1],
    ['Hanoi',21.03,105.85,'23',3],['Singapore',1.35,103.82,'123',2],['Kuala Lumpur',3.14,101.69,'23',3],['Jakarta',-6.21,106.85,'23',3],
    ['Bali',-8.40,115.19,'123',2],['Manila',14.60,120.98,'23',3],['Peking',39.90,116.40,'0123',1],['Shanghai',31.23,121.47,'123',2],
    ['Hongkong',22.32,114.17,'123',2],['Tokyo',35.68,139.69,'0123',1],['Osaka',34.69,135.50,'23',3],['Seoul',37.57,126.98,'123',2],
    ['Ulan Bator',47.89,106.91,'3',3],['Taipei',25.03,121.57,'23',3],['Sydney',-33.87,151.21,'0123',1],['Melbourne',-37.81,144.96,'123',2],
    ['Perth',-31.95,115.86,'23',3],['Canberra',-35.28,149.13,'23',3],['Auckland',-36.85,174.76,'23',2],['Wellington',-41.29,174.78,'3',3],
    ['Honolulu på Hawaii',21.31,-157.86,'123',2],['Nuuk på Grönland',64.18,-51.72,'23',3],['Anchorage i Alaska',61.22,-149.90,'23',3],['Tasjkent',41.30,69.24,'3',3],
  ];
  const W_PLACES = [
    ['Var ligger Frihetsgudinnan?','Frihetsgudinnan (New York)',40.69,-74.04,'0123',1],['Var ligger Grand Canyon?','Grand Canyon',36.10,-112.11,'123',2],
    ['Var ligger Niagarafallen?','Niagarafallen',43.08,-79.07,'23',2],['Var ligger Machu Picchu?','Machu Picchu',-13.16,-72.55,'23',2],
    ['Var ligger Kristusstatyn som blickar ut över Rio de Janeiro?','Kristusstatyn (Rio de Janeiro)',-22.95,-43.21,'123',2],['Var ligger Påskön?','Påskön',-27.11,-109.35,'23',3,600],
    ['Var ligger Galápagosöarna?','Galápagosöarna',-0.95,-90.97,'23',3,600],['Var ligger pyramiderna i Giza?','Pyramiderna i Giza',29.98,31.13,'0123',1],
    ['Var ligger Kilimanjaro?','Kilimanjaro',-3.07,37.36,'23',2],['Var ligger Victoriafallen?','Victoriafallen',-17.92,25.86,'3',3],
    ['Var ligger Mount Everest?','Mount Everest',27.99,86.93,'123',1],['Var ligger Taj Mahal?','Taj Mahal',27.18,78.04,'23',2],
    ['Var ligger Kinesiska muren nära Peking?','Kinesiska muren (Badaling)',40.36,116.02,'123',2],['Var ligger Angkor Wat?','Angkor Wat',13.41,103.87,'3',3],
    ['Var ligger Uluru (Ayers Rock)?','Uluru',-25.34,131.04,'23',2,600],['Var ligger Petra?','Petra',30.33,35.44,'3',3],
    ['Var ligger berget Fuji?','Fuji',35.36,138.73,'23',2],['Var ligger Döda havet?','Döda havet',31.50,35.50,'23',3],
    ['Var ligger Kap Horn?','Kap Horn',-55.98,-67.27,'3',3],['Var ligger Panamakanalen?','Panamakanalen',9.08,-79.68,'23',2],
    ['Var ligger Suezkanalen?','Suezkanalen',30.60,32.33,'23',2],['Var ligger Hollywood?','Hollywood (Los Angeles)',34.10,-118.33,'0123',1],
    ['Var ligger Disney World i Florida?','Disney World (Orlando)',28.39,-81.56,'0123',1],['Var ligger Madagaskar? Sätt nålen mitt på ön.','Madagaskar',-19.00,46.90,'123',2,500],
    ['Var ligger Nya Zeeland? Sätt nålen mitt i landet.','Nya Zeeland',-41.30,173.00,'123',2,700],['Var ligger Grönland? Sätt nålen mitt på ön.','Grönland',72.00,-41.00,'0123',1,900],
    ['Var ligger Australien? Sätt nålen mitt i landet.','Australien',-25.00,134.00,'0123',1,1200],['Var ligger Sri Lanka?','Sri Lanka',7.80,80.70,'3',3,400],
    ['Var ligger Island?','Island',64.90,-18.60,'123',2,500],['Var ligger Mongoliet? Sätt nålen mitt i landet.','Mongoliet',46.90,103.80,'23',3,700],
    ['Var ligger Kenya? Sätt nålen mitt i landet.','Kenya',0.20,37.90,'23',3,500],['Var ligger Peru? Sätt nålen mitt i landet.','Peru',-9.20,-75.00,'23',3,600],
    ['Var ligger Japan? Sätt nålen mitt i landet.','Japan',36.20,138.30,'0123',1,600],['Var ligger Egypten? Sätt nålen mitt i landet.','Egypten',26.80,30.80,'123',2,600],
    ['Var ligger Indien? Sätt nålen mitt i landet.','Indien',22.00,79.00,'123',1,900],['Var ligger Mexiko? Sätt nålen mitt i landet.','Mexiko',23.60,-102.50,'123',2,800],
    ['Var ligger Brasilien? Sätt nålen mitt i landet.','Brasilien',-10.00,-52.00,'0123',1,1200],['Var ligger Sydafrika? Sätt nålen mitt i landet.','Sydafrika',-29.00,24.70,'123',2,700],
    ['Var ligger Kanada? Sätt nålen mitt i landet.','Kanada',58.00,-100.00,'0123',1,1500],['Var ligger Sahara? Sätt nålen mitt i öknen.','Sahara',23.00,12.00,'123',2,1300],
    ['Var ligger Amazonas regnskog? Sätt nålen mitt i skogen.','Amazonas',-4.00,-62.00,'123',2,1100],['Var ligger Himalaya?','Himalaya',28.60,84.00,'23',2,700],
    ['Var ligger Hawaii?','Hawaii',20.80,-156.30,'123',2,500],['Var ligger Maldiverna?','Maldiverna',3.20,73.20,'23',3,500],
    ['Var ligger Kanarieöarna?','Kanarieöarna',28.30,-15.80,'123',2,400],['Var ligger Thailand?','Thailand',15.50,101.00,'123',2,600],
  ];
  for (const [n, lat, lon, a, d] of W) pin(a, d, 'world', `Var i världen ligger ${n}?`, n, lat, lon);
  for (const [t, n, lat, lon, a, d, ok] of W_PLACES) pin(a, d, 'world', t, n, lat, lon, ok);

  // ───────── Frågor som räknas fram ur koordinaterna ─────────
  // "Vilken ligger längst norrut/söderut/österut/västerut?" – bara när skillnaden är tydlig
  const R = Math.PI / 180, km = (a, b) => { const dLa = (b[1] - a[1]) * R, dLo = (b[2] - a[2]) * R, h = Math.sin(dLa / 2) ** 2 + Math.cos(a[1] * R) * Math.cos(b[1] * R) * Math.sin(dLo / 2) ** 2; return 2 * 6371 * Math.asin(Math.sqrt(h)); };
  const DIRS = [['norrut', p => p[1]], ['söderut', p => -p[1]], ['österut', p => p[2]], ['västerut', p => -p[2]]];
  const dirQs = (list, cat, label, n, gap) => {
    const seen = new Set(); let tries = 0;
    while (seen.size < n && tries++ < n * 40) {
      const four = shuf(list).slice(0, 4), [dn, f] = DIRS[Math.floor(rand() * 4)];
      const sorted = [...four].sort((a, b) => f(b) - f(a));
      if (Math.abs(f(sorted[0]) - f(sorted[1])) < gap) continue;
      const key = dn + sorted.map(p => p[0]).sort().join('|'); if (seen.has(key)) continue; seen.add(key);
      const a = sorted.reduce((s, p) => s.split('').filter(c => String(p[3]).includes(c)).join(''), '0123') || '3';
      const age = /[01]/.test(a) ? a : a.includes('2') ? '23' : '3';
      const names = four.map(p => p[0]).sort((x, y) => x.localeCompare(y, 'sv'));
      q(cat, age, Math.max(...four.map(p => p[4])), `Vilken ${label} ligger längst ${dn}: ${names.slice(0, 3).join(', ')} eller ${names[3]}?`, sorted[0][0], ...sorted.slice(1).map(p => p[0]));
    }
  };
  const seCities = SE.filter(p => !p[0].includes(' '));
  dirQs(seCities, 'sverige', 'av orterna', 260, 0.6);
  dirQs(EU.filter(p => !p[0].includes(' ')), 'geo', 'av städerna', 200, 1.5);
  dirQs(W.filter(p => !p[0].includes(' ')), 'geo', 'av världsstäderna', 160, 4);

  // "Hur långt är det fågelvägen …?" (närmast rätt)
  const sthlm = SE[0], gbg = SE[1];
  const farAll = [...EU.filter(p => !['Stockholm', 'Göteborg', 'Malmö'].includes(p[0]) && !p[0].includes(' ')), ...W.filter(p => !p[0].includes(' '))];
  const far = farAll.filter((p, i) => farAll.findIndex(x => x[0] === p[0]) === i);
  shuf(far).slice(0, 70).forEach(p => {
    const d = Math.round(km(sthlm, p) / 10) * 10, top = Math.max(1000, Math.ceil(d * 1.8 / 500) * 500);
    num('narmast', '23', d > 3000 ? 3 : 2, `Ungefär hur långt är det fågelvägen från Stockholm till ${p[0]}?`, d, 0, top, top > 6000 ? 50 : 10, 'km', { tol: Math.max(30, Math.round(d * 0.06)), g: 'dist' });
  });
  shuf(SE.filter(p => !p[0].includes(' ') && p !== sthlm && p !== gbg)).slice(0, 40).forEach(p => {
    const d = Math.round(km(sthlm, p) / 5) * 5, top = Math.max(500, Math.ceil(d * 1.8 / 100) * 100);
    num('narmast', '23', 2, `Ungefär hur långt är det fågelvägen mellan Stockholm och ${p[0]}?`, d, 0, top, 5, 'km', { tol: Math.max(15, Math.round(d * 0.07)), g: 'dist' });
  });
})();
