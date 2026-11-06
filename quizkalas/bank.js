/* Quizkalas – frågebank
 * Åldersgrupper: 0 = Barn (6–9), 1 = Mellan (10–12), 2 = Tonåring (13–17), 3 = Vuxen (18+)
 * q(kategori, åldrar, svårighet 1–3, fråga, RÄTT svar, fel1, fel2, fel3)
 * tf(kategori, åldrar, svårighet, påstående, true/false)
 * Lägg gärna till egna rader – första svaret efter frågan är alltid det rätta.
 */
window.QK_CATS = {
  djur:    { n: 'Djur & natur',        e: '🦁' },
  geo:     { n: 'Geografi',            e: '🌍' },
  sverige: { n: 'Sverige',             e: '🇸🇪' },
  hist:    { n: 'Historia',            e: '🏛️' },
  vet:     { n: 'Vetenskap & rymden',  e: '🔭' },
  kropp:   { n: 'Kroppen',             e: '🫀' },
  sport:   { n: 'Sport',               e: '⚽' },
  film:    { n: 'Film, TV & spel',     e: '🎬' },
  mat:     { n: 'Mat & dryck',         e: '🍕' },
  sprak:   { n: 'Språk & ord',         e: '🔤' },
  matte:   { n: 'Matte & logik',       e: '🧮' },
  musik:   { n: 'Musikfakta',          e: '🎵' },
  teknik:  { n: 'Teknik & internet',   e: '💻' },
  spotify: { n: 'Musikfrågor (Spotify)', e: '🎧' },
};

window.QK_BANK = [];
(function () {
  const B = window.QK_BANK;
  const q = (c, a, d, text, ok, ...wrong) => B.push({ c, a, d, q: text, o: [ok, ...wrong] });
  const tf = (c, a, d, text, ok) => B.push({ c, a, d, q: text, tf: ok });

  // ───────────── DJUR & NATUR ─────────────
  q('djur','0',1,'Vad säger kon? 🐄','Mu','Voff','Mjau','Kvack');
  q('djur','01',1,'Vilket djur är störst av alla djur på jorden?','Blåvalen','Elefanten','Giraffen','Isbjörnen');
  q('djur','0',1,'Vilket djur har längst hals?','Giraffen','Hästen','Strutsen','Kamelen');
  q('djur','01',1,'Hur många ben har en spindel? 🕷️','8','6','10','4');
  q('djur','01',2,'Hur många ben har en insekt?','6','8','4','10');
  tf('djur','01',1,'Pingviner kan flyga.',false);
  q('djur','0',1,'Vad kallas en hundunge?','Valp','Kattunge','Kalv','Föl');
  q('djur','01',1,'Vad kallas hästens unge?','Föl','Kalv','Killing','Lamm');
  q('djur','012',1,'Vilket djur brukar kallas "skogens konung" i Sverige?','Älgen','Björnen','Vargen','Räven');
  q('djur','01',1,'Vad äter pandan mest av? 🐼','Bambu','Fisk','Bananer','Gräs');
  q('djur','01',1,'Vilket djur är snabbast på land?','Geparden','Lejonet','Hästen','Zebran');
  q('djur','0',1,'Vad blir ett grodyngel när det växer upp?','En groda','En fisk','En ödla','En fjäril');
  q('djur','0',1,'Vad blir en larv när den växer upp? 🐛','En fjäril','En groda','En spindel','En mask');
  tf('djur','012',1,'En val är en fisk.',false);
  q('djur','0',1,'Vilket av djuren lägger ägg?','Hönan','Kon','Hunden','Katten');
  q('djur','0',1,'Vilket djur har en snabel?','Elefanten','Noshörningen','Flodhästen','Gorillan');
  q('djur','123',2,'Vilken färg har isbjörnens hud under pälsen?','Svart','Vit','Rosa','Gul');
  q('djur','123',2,'Hur många hjärtan har en bläckfisk? 🐙','3','1','2','8');
  q('djur','012',1,'Vilket är världens största landdjur?','Afrikansk elefant','Noshörning','Flodhäst','Giraff');
  q('djur','12',1,'Vad kallas djur som bara äter växter?','Växtätare','Rovdjur','Allätare','Asätare');
  q('djur','01',1,'Vilket träd har barr och kottar? 🌲','Granen','Björken','Eken','Lönnen');
  q('djur','123',1,'Vilken gas tar träden upp från luften?','Koldioxid','Syre','Kväve','Helium');
  q('djur','23',2,'Vad kallas processen när växter gör socker med hjälp av solljus?','Fotosyntes','Förbränning','Avdunstning','Jäsning');
  q('djur','123',2,'Vilken fågel kan flyga baklänges?','Kolibrin','Örnen','Kråkan','Duvan');
  q('djur','123',2,'Vilket av djuren sover flest timmar per dygn?','Koalan','Hästen','Giraffen','Elefanten');
  q('djur','3',3,'Ungefär hur länge är en elefanthona dräktig?','22 månader','9 månader','12 månader','36 månader');
  tf('djur','23',2,'Hajens skelett består av brosk i stället för ben.',true);
  q('djur','01',1,'Vilket djur är känt för att kunna byta färg?','Kameleonten','Krokodilen','Sköldpaddan','Ormen');
  q('djur','12',1,'Vilken är världens största fågel?','Strutsen','Kondoren','Pelikanen','Albatrossen');
  q('djur','12',2,'Vilket av dessa däggdjur kan flyga på riktigt?','Fladdermusen','Flygekorren','Pingvinen','Strutsen');
  q('djur','01',1,'Hur många armar har en sjöstjärna oftast? ⭐','5','4','6','8');
  q('djur','0',1,'Vad heter ugglans ungar?','Ugglungar','Kycklingar','Valpar','Kalvar');
  q('djur','23',2,'Vilket djur har störst ögon i förhållande till kroppen bland däggdjur?','Spökdjuret (tarsier)','Hästen','Katten','Uggleapan');
  q('djur','3',2,'Vad kallas en hane hos rådjur?','Bock','Tjur','Hingst','Galt');

  // ───────────── GEOGRAFI ─────────────
  q('geo','012',1,'Vad heter Norges huvudstad?','Oslo','Bergen','Köpenhamn','Helsingfors');
  q('geo','01',1,'Vad heter Frankrikes huvudstad?','Paris','Lyon','Marseille','Bryssel');
  q('geo','123',1,'Vilket är världens största hav?','Stilla havet','Atlanten','Indiska oceanen','Norra ishavet');
  q('geo','123',2,'Vilken flod brukar räknas som världens längsta?','Nilen','Mississippi','Donau','Jangtsefloden');
  q('geo','012',1,'Vilket är världens högsta berg? 🏔️','Mount Everest','K2','Kilimanjaro','Mont Blanc');
  q('geo','0',1,'I vilket land står Eiffeltornet?','Frankrike','Italien','Spanien','Tyskland');
  q('geo','01',1,'I vilket land finns pyramiderna i Giza?','Egypten','Mexiko','Grekland','Indien');
  q('geo','12',1,'Vilken världsdel är störst till ytan?','Asien','Afrika','Europa','Nordamerika');
  q('geo','23',2,'Vilket land har flest invånare?','Indien','Kina','USA','Indonesien');
  q('geo','123',1,'Vilket är världens största land till ytan?','Ryssland','Kanada','Kina','USA');
  q('geo','01',1,'Vad heter Italiens huvudstad?','Rom','Milano','Venedig','Neapel');
  q('geo','23',3,'Vad heter Australiens huvudstad?','Canberra','Sydney','Melbourne','Perth');
  q('geo','123',2,'Vilken är världens största varma öken?','Sahara','Gobi','Kalahari','Atacama');
  q('geo','01',1,'Vilket land har formen av en stövel?','Italien','Grekland','Spanien','Portugal');
  q('geo','12',1,'Vad heter Spaniens huvudstad?','Madrid','Barcelona','Sevilla','Lissabon');
  q('geo','01',1,'I vilken stad står klocktornet Big Ben?','London','Paris','Dublin','Edinburgh');
  q('geo','23',2,'Vilken flod rinner genom Paris?','Seine','Themsen','Rhen','Donau');
  q('geo','23',3,'Vilket land har flest sjöar i världen?','Kanada','Finland','Sverige','Ryssland');
  q('geo','12',1,'Vad heter Japans huvudstad?','Tokyo','Kyoto','Osaka','Peking');
  q('geo','3',3,'Vilken är Europas längsta flod?','Volga','Donau','Rhen','Loire');
  q('geo','23',1,'Vilket av dessa länder använder euro?','Finland','Norge','Danmark','Storbritannien');
  q('geo','123',2,'Vilket är världens minsta land?','Vatikanstaten','Monaco','San Marino','Liechtenstein');
  q('geo','23',2,'Vilken stad kallas "The Big Apple"?','New York','Los Angeles','Chicago','London');
  q('geo','12',1,'I vilken världsdel ligger Kenya?','Afrika','Asien','Sydamerika','Oceanien');
  q('geo','012',1,'Vilket land har ett lönnlöv på flaggan? 🍁','Kanada','USA','Schweiz','Japan');
  q('geo','12',1,'Vad heter Tysklands huvudstad?','Berlin','München','Hamburg','Wien');
  q('geo','23',2,'Vad heter havsviken mellan Sverige och Finland i norr?','Bottniska viken','Nordsjön','Kattegatt','Skagerrak');
  q('geo','23',2,'Vilket är Afrikas högsta berg?','Kilimanjaro','Mount Kenya','Atlasbergen','Mont Blanc');
  q('geo','23',2,'Vad heter Islands huvudstad?','Reykjavik','Tórshavn','Nuuk','Bergen');
  q('geo','012',1,'Vilket land är känt för tulpaner och väderkvarnar? 🌷','Nederländerna','Belgien','Danmark','Schweiz');
  q('geo','23',2,'Vilken är världens största ö?','Grönland','Madagaskar','Borneo','Island');
  q('geo','3',2,'Vilket land har flest invånare i Sydamerika?','Brasilien','Argentina','Colombia','Peru');
  q('geo','0',1,'Var bor pingviner mest? 🐧','Vid Sydpolen','I Sahara','I regnskogen','I Stockholm');

  // ───────────── SVERIGE ─────────────
  q('sverige','01',1,'Vad heter Sveriges huvudstad?','Stockholm','Göteborg','Malmö','Uppsala');
  q('sverige','0',1,'Vilka färger har Sveriges flagga?','Blått och gult','Rött och vitt','Blått och vitt','Grönt och gult');
  q('sverige','123',1,'Vilket datum är Sveriges nationaldag?','6 juni','24 juni','1 maj','17 maj');
  q('sverige','123',1,'Vad heter Sveriges största sjö?','Vänern','Vättern','Mälaren','Siljan');
  q('sverige','123',1,'Vilket är Sveriges högsta berg?','Kebnekaise','Åreskutan','Sarektjåkkå','Helagsfjället');
  q('sverige','123',1,'Vilken är Sveriges största ö?','Gotland','Öland','Orust','Hisingen');
  q('sverige','012',1,'Vem skrev böckerna om Pippi Långstrump?','Astrid Lindgren','Selma Lagerlöf','Elsa Beskow','Gunilla Bergström');
  q('sverige','23',2,'Vem skrev "Nils Holgerssons underbara resa genom Sverige"?','Selma Lagerlöf','Astrid Lindgren','August Strindberg','Vilhelm Moberg');
  q('sverige','123',1,'Vilken kung blev Sveriges kung år 1973?','Carl XVI Gustaf','Gustaf V','Oscar II','Karl XII');
  q('sverige','123',1,'Vad heter Sveriges kronprinsessa?','Victoria','Madeleine','Estelle','Silvia');
  q('sverige','12',1,'Vilket landskap ligger längst söderut i Sverige?','Skåne','Blekinge','Halland','Småland');
  q('sverige','123',1,'Vad heter bron mellan Malmö och Köpenhamn?','Öresundsbron','Ölandsbron','Högakustenbron','Västerbron');
  q('sverige','123',1,'Vilken är Sveriges näst största stad?','Göteborg','Malmö','Uppsala','Örebro');
  q('sverige','012',1,'Vad firar vi i Sverige den 13 december? 🕯️','Lucia','Midsommar','Valborg','Nationaldagen');
  q('sverige','01',1,'Vad dansar man runt på midsommar?','Midsommarstången','Julgranen','Brasan','Flaggstången');
  q('sverige','23',1,'Vilket företag grundades av Ingvar Kamprad?','IKEA','Volvo','H&M','Spotify');
  q('sverige','3',2,'Vilket år gick Sverige med i EU?','1995','1991','2000','1986');
  q('sverige','23',2,'Hur många landskap har Sverige?','25','21','29','20');
  q('sverige','3',3,'Hur många län har Sverige?','21','25','18','24');
  q('sverige','3',2,'Vilket år blev Sverige medlem i Nato?','2024','2022','2023','1995');
  q('sverige','123',1,'Vad heter Sveriges nationalsång?','Du gamla, du fria','Kungssången','Ja, vi elsker','Vårt land');
  q('sverige','123',1,'Vem uppfann dynamiten och instiftade Nobelpriset?','Alfred Nobel','Anders Celsius','Carl von Linné','Gustaf de Laval');
  q('sverige','23',2,'Vilken svensk forskare gav växter och djur latinska namn i ett system?','Carl von Linné','Anders Celsius','Alfred Nobel','Jöns Jacob Berzelius');
  q('sverige','123',2,'Vad heter bröderna i "Bröderna Lejonhjärta"?','Jonatan och Karl','Emil och Ida','Mio och Jum-Jum','Rasmus och Oskar');
  q('sverige','012',1,'Var bor Emil i Lönneberga?','Katthult','Villa Villekulla','Bullerbyn','Junibacken');
  q('sverige','01',1,'Vad heter Pippi Långstrumps häst?','Lilla Gubben','Herr Nilsson','Ture','Bamse');
  q('sverige','01',1,'Vad heter Pippi Långstrumps apa? 🐒','Herr Nilsson','Lilla Gubben','Kalle','Bamse');
  q('sverige','01',1,'Vad heter Pippis grannar och bästa vänner?','Tommy och Annika','Emil och Ida','Lisa och Lasse','Mio och Jum-Jum');
  q('sverige','0',1,'Vilken björn blir världens starkaste av dunderhonung? 🐻','Bamse','Nalle Puh','Paddington','Baloo');
  q('sverige','3',3,'Vilken svensk stad kallas ibland "Lilla London"?','Göteborg','Malmö','Västerås','Norrköping');
  q('sverige','3',3,'I vilket landskap ligger Kiruna?','Lappland','Norrbotten','Jämtland','Västerbotten');
  tf('sverige','23',2,'Sverige har haft en kvinnlig statsminister.',true);
  q('sverige','12',1,'Vad heter Sveriges stora vinter-skidlopp från Sälen till Mora?','Vasaloppet','Lidingöloppet','Vätternrundan','Göteborgsvarvet');
  q('sverige','0',1,'Vad äter man på Lucia? 😋','Lussekatter','Semlor','Tårta med ljus','Pannkakor');

  // ───────────── HISTORIA ─────────────
  q('hist','01',1,'Vilka seglade långt över haven i drakskepp?','Vikingarna','Romarna','Egyptierna','Grekerna');
  q('hist','123',1,'Vem var den första människan på månen?','Neil Armstrong','Buzz Aldrin','Jurij Gagarin','Michael Collins');
  q('hist','23',2,'Vilket år landade människan på månen för första gången?','1969','1959','1975','1981');
  q('hist','123',1,'Vem målade Mona Lisa?','Leonardo da Vinci','Michelangelo','Pablo Picasso','Vincent van Gogh');
  q('hist','23',2,'Vilket år började andra världskriget?','1939','1914','1945','1929');
  q('hist','3',2,'Vilket år föll Berlinmuren?','1989','1991','1961','1979');
  q('hist','123',1,'Vad hette fartyget som sjönk på sin första resa 1912?','Titanic','Vasa','Lusitania','Bismarck');
  q('hist','123',2,'Vad heter regalskeppet som sjönk i Stockholm 1628 och nu står på museum?','Vasa','Kronan','Titanic','Svärdet');
  q('hist','01',1,'Vilka byggde pyramiderna i Giza?','De gamla egyptierna','Romarna','Vikingarna','Aztekerna');
  q('hist','23',2,'Vem var USA:s första president?','George Washington','Abraham Lincoln','Thomas Jefferson','John Adams');
  q('hist','23',2,'Vilken kejsare styrde Frankrike i början av 1800-talet?','Napoleon Bonaparte','Ludvig XIV','Karl den store','Julius Caesar');
  q('hist','01',1,'Vad heter den långa muren som byggdes i Kina?','Kinesiska muren','Hadrianus mur','Berlinmuren','Klagomuren');
  q('hist','3',2,'Vilken uppfinning av Johannes Gutenberg förändrade världen på 1400-talet?','Boktryckarkonsten','Ångmaskinen','Glödlampan','Kompassen');
  q('hist','23',2,'Vilket år kom Columbus till Amerika?','1492','1066','1620','1776');
  q('hist','12',1,'Vad kallas tiden med riddare och borgar i Europa?','Medeltiden','Stenåldern','Renässansen','Industrialismen');
  q('hist','23',2,'Vilken stad begravdes av vulkanen Vesuvius år 79?','Pompeji','Rom','Aten','Venedig');
  q('hist','3',3,'Vilken svensk kung dog i slaget vid Lützen 1632?','Gustav II Adolf','Karl XII','Gustav Vasa','Karl XIV Johan');
  q('hist','23',2,'Vem blev Sveriges kung 1523 och kallas ofta "landsfader"?','Gustav Vasa','Gustav II Adolf','Karl XII','Erik XIV');
  q('hist','3',2,'I vilket land började den industriella revolutionen?','Storbritannien','USA','Tyskland','Frankrike');
  q('hist','23',2,'I vilket land blev Nelson Mandela president 1994?','Sydafrika','Kenya','Nigeria','Zimbabwe');
  q('hist','12',1,'Vad skrev man på i det gamla Egypten?','Papyrus','Plast','Aluminiumfolie','Glas');
  q('hist','3',2,'Vilket folk byggde Machu Picchu i Peru?','Inkafolket','Mayafolket','Aztekerna','Romarna');
  q('hist','01',1,'Vilken av uppfinningarna är äldst?','Hjulet','Telefonen','Bilen','Datorn');
  q('hist','3',2,'Vilket år tog första världskriget slut?','1918','1914','1945','1920');
  q('hist','23',2,'Vem höll talet "I have a dream" år 1963?','Martin Luther King Jr.','Barack Obama','Malcolm X','John F. Kennedy');
  q('hist','0',1,'När levde dinosaurierna? 🦖','För miljontals år sedan','För 2 000 år sedan','På medeltiden','För 100 år sedan');
  tf('hist','123',2,'Vikingarna hade horn på sina hjälmar.',false);
  q('hist','3',3,'I vilken grekisk ort hölls de antika olympiska spelen?','Olympia','Aten','Sparta','Troja');
  q('hist','12',1,'Vad kallades vikingarnas skrivtecken?','Runor','Hieroglyfer','Bokstavstecken','Emojis');

  // ───────────── VETENSKAP & RYMDEN ─────────────
  q('vet','123',1,'Vilken planet ligger närmast solen?','Merkurius','Venus','Mars','Jorden');
  q('vet','012',1,'Vilken planet kallas "den röda planeten"?','Mars','Jupiter','Venus','Saturnus');
  q('vet','12',1,'Vilken är den största planeten i vårt solsystem?','Jupiter','Saturnus','Neptunus','Jorden');
  q('vet','12',1,'Hur många planeter finns det i vårt solsystem?','8','9','7','10');
  q('vet','01',1,'Vilken planet har de mest kända ringarna? 🪐','Saturnus','Mars','Merkurius','Venus');
  q('vet','0',1,'Vad blir vatten när det fryser?','Is','Ånga','Regn','Dimma');
  q('vet','012',1,'Vid hur många grader kokar vatten (vid havsytan)?','100 °C','50 °C','0 °C','200 °C');
  q('vet','01',1,'Vid hur många grader fryser vatten till is?','0 °C','10 °C','-10 °C','100 °C');
  q('vet','01',1,'Vilken gas behöver vi andas in för att leva?','Syre','Koldioxid','Helium','Väte');
  q('vet','23',1,'Vilken är den kemiska formeln för vatten?','H₂O','CO₂','O₂','NaCl');
  q('vet','3',2,'Vilket grundämne har kemiska tecknet Au?','Guld','Silver','Aluminium','Koppar');
  q('vet','23',2,'Vad kallas den innersta delen av en atom?','Kärnan','Elektronen','Skalet','Molekylen');
  q('vet','012',1,'Hur lång tid tar det för jorden att snurra ett varv runt sig själv?','Ett dygn','En vecka','En månad','Ett år');
  q('vet','012',1,'Hur lång tid tar det för jorden att åka ett varv runt solen?','Ett år','Ett dygn','En månad','Tio år');
  q('vet','0',1,'Vad är solen? ☀️','En stjärna','En planet','En komet','En måne');
  q('vet','23',2,'Ungefär hur lång tid tar det för solljuset att nå jorden?','8 minuter','8 sekunder','8 timmar','8 dagar');
  q('vet','23',1,'Vem tog fram relativitetsteorin?','Albert Einstein','Isaac Newton','Nikola Tesla','Galileo Galilei');
  q('vet','12',1,'Vilken kraft gör att saker faller ner mot marken?','Tyngdkraften','Magnetism','Friktion','Elektricitet');
  q('vet','123',2,'Vilket är det hårdaste naturliga materialet?','Diamant','Järn','Granit','Guld');
  q('vet','01',1,'Vad mäter en termometer? 🌡️','Temperatur','Vikt','Längd','Tid');
  q('vet','01',1,'Vilka färger blandar man för att få grönt?','Blått och gult','Rött och gult','Rött och blått','Svart och vitt');
  q('vet','0',1,'Vilken färg får man om man blandar rött och blått?','Lila','Grönt','Orange','Brunt');
  q('vet','3',3,'Vilken stjärna ligger närmast oss efter solen?','Proxima Centauri','Polstjärnan','Sirius','Betelgeuse');
  q('vet','23',2,'Vad heter stjärnbilden som ser ut som en stor slev eller vagn?','Karlavagnen','Orion','Skorpionen','Kassiopeja');
  tf('vet','123',1,'Ljud färdas snabbare än ljus.',false);
  q('vet','3',3,'Vilket grundämne är vanligast i universum?','Väte','Syre','Kol','Helium');
  q('vet','3',3,'Vem var den första svensken i rymden (2006)?','Christer Fuglesang','Marcus Wandt','Tim Peake','Alexander Gerst');
  q('vet','0',1,'Vad behöver en växt för att växa? 🌱','Vatten och ljus','Mjölk och mörker','Sand och salt','Bara mörker');
  q('vet','12',2,'Vad kallas det när vatten blir till ånga?','Avdunstning','Kondensation','Frysning','Smältning');
  q('vet','0',1,'Vad syns på himlen efter regn när solen lyser? 🌈','En regnbåge','En komet','Norrsken','En blixt');
  q('vet','23',2,'Vad kallas ljusfenomenet på himlen som ofta syns i norra Sverige på vintern?','Norrsken','Regnbåge','Halo','Stjärnfall');

  // ───────────── KROPPEN ─────────────
  q('kropp','23',2,'Hur många tänder har en vuxen människa normalt (med visdomständer)?','32','28','24','36');
  q('kropp','01',1,'Vilket organ pumpar runt blodet i kroppen? ❤️','Hjärtat','Lungorna','Magen','Hjärnan');
  q('kropp','01',1,'Vilka organ använder vi för att andas?','Lungorna','Levern','Njurarna','Hjärtat');
  q('kropp','01',1,'Hur många sinnen brukar man säga att vi har?','5','3','7','10');
  q('kropp','23',2,'Vilket är kroppens största organ?','Huden','Levern','Hjärnan','Lungorna');
  q('kropp','23',2,'Vilket är kroppens längsta ben?','Lårbenet','Överarmsbenet','Skenbenet','Nyckelbenet');
  q('kropp','3',2,'Ungefär hur många ben har en vuxen människa?','206','106','306','56');
  q('kropp','3',3,'Var sitter kroppens minsta ben, stigbygeln?','I örat','I näsan','I lillfingret','I lilltån');
  q('kropp','12',1,'Vad heter rören som blodet färdas i?','Blodkärl','Nerver','Senor','Muskler');
  q('kropp','0',1,'Vilken färg har blodet?','Rött','Blått','Grönt','Gult');
  q('kropp','23',2,'Vilket vitamin bildar huden när solen lyser på den?','D-vitamin','C-vitamin','A-vitamin','B12');
  q('kropp','23',2,'Hur många kammare har människans hjärta?','4','2','3','6');
  q('kropp','01',1,'Vad skyddar hjärnan?','Skallen','Bröstkorgen','Bäckenet','Knäskålen');
  q('kropp','0',1,'Vad ska man göra innan man äter? 🧼','Tvätta händerna','Springa ett varv','Sova','Borsta håret');
  q('kropp','3',2,'Ungefär hur stor del av en vuxens kropp är vatten?','60 %','20 %','90 %','40 %');
  q('kropp','3',3,'Vilken del av ögat ger ögat dess färg?','Regnbågshinnan','Pupillen','Näthinnan','Linsen');
  q('kropp','0',1,'Med vilken kroppsdel känner vi smak? 👅','Tungan','Örat','Armbågen','Ögat');
  tf('kropp','12',1,'Hjärtat är en muskel.',true);
  q('kropp','3',3,'Vilket är kroppens största inre organ?','Levern','Hjärtat','Mjälten','Njurarna');
  q('kropp','12',2,'Hur många mjölktänder har ett barn normalt?','20','32','10','24');
  q('kropp','12',2,'Vad hjälper kalcium kroppen att bygga?','Skelett och tänder','Hår','Blod','Ögon');
  q('kropp','0',1,'Vad använder vi öronen till? 👂','Att höra','Att se','Att lukta','Att smaka');
  q('kropp','12',1,'Vad kallas de vita delarna i munnen som vi tuggar med?','Tänder','Tandkött','Gommen','Läppar');

  // ───────────── SPORT ─────────────
  q('sport','012',1,'Hur många spelare har ett fotbollslag på planen? ⚽','11','10','9','12');
  q('sport','12',1,'Hur ofta hålls sommar-OS?','Vart fjärde år','Varje år','Vartannat år','Vart tionde år');
  q('sport','01',1,'I vilken sport använder man en puck? 🏒','Ishockey','Fotboll','Tennis','Golf');
  q('sport','012',1,'Hur många ringar finns det i OS-symbolen?','5','4','6','7');
  q('sport','23',2,'Vilket land vann herrarnas fotbolls-VM 2022?','Argentina','Frankrike','Brasilien','Kroatien');
  q('sport','3',3,'Vilket land vann herrarnas fotbolls-VM 2018?','Frankrike','Kroatien','Tyskland','Brasilien');
  q('sport','3',2,'I vilken klubb började Zlatan Ibrahimović sin proffskarriär?','Malmö FF','AIK','IFK Göteborg','Djurgården');
  q('sport','23',2,'Vad heter den berömda tennisturneringen på gräs i London?','Wimbledon','US Open','Roland Garros','Australian Open');
  q('sport','23',2,'Hur långt är ett maratonlopp?','42,195 km','21,1 km','50 km','10 km');
  q('sport','12',1,'I vilken sport kan man slå en "strike"? 🎳','Bowling','Simning','Tennis','Golf');
  q('sport','3',3,'Hur många poäng ger en touchdown i amerikansk fotboll?','6','3','7','1');
  q('sport','3',2,'Vilken svensk vann herrsingeln i Wimbledon fem år i rad 1976–1980?','Björn Borg','Stefan Edberg','Mats Wilander','Robin Söderling');
  q('sport','3',2,'Hur lång är Vasaloppets klassiska sträcka?','90 km','42 km','60 km','120 km');
  q('sport','123',1,'I vilken gren tävlar Armand "Mondo" Duplantis?','Stavhopp','Höjdhopp','Längdhopp','Spjut');
  q('sport','23',2,'Hur många hål spelar man på en vanlig golfrunda?','18','9','12','24');
  q('sport','12',1,'Vilken sport spelar man i NBA? 🏀','Basket','Ishockey','Fotboll','Baseboll');
  q('sport','12',1,'Hur många perioder har en ishockeymatch?','3','2','4','5');
  q('sport','23',2,'Från vilket land kommer kampsporten judo?','Japan','Kina','Korea','Thailand');
  q('sport','12',2,'Hur många spelare per lag är på planen samtidigt i basket?','5','6','7','11');
  q('sport','0',1,'Vilken av bollarna är störst?','Basketbollen','Tennisbollen','Golfbollen','Pingisbollen');
  q('sport','12',1,'I vilken sport kan man göra en "hole in one"? ⛳','Golf','Fotboll','Bowling','Basket');
  tf('sport','012',1,'I fotboll får målvakten ta bollen med händerna i sitt eget straffområde.',true);
  q('sport','123',1,'I vilken stad hölls sommar-OS 2024?','Paris','London','Tokyo','Los Angeles');
  q('sport','3',2,'Vinter-OS 2026 hölls i Milano och vilken annan ort?','Cortina d\'Ampezzo','Turin','Chamonix','St. Moritz');
  q('sport','0',1,'Vad använder man för att åka utför en snöig backe? ⛷️','Slalomskidor','Rullskridskor','Simfötter','Cykel');
  q('sport','12',2,'Vad kallas det i fotboll när en spelare gör tre mål i samma match?','Hattrick','Hole in one','Strike','Grand slam');

  // ───────────── FILM, TV & SPEL ─────────────
  q('film','01',1,'Vad heter snögubben i filmen Frost? ⛄','Olof','Sven','Kristoffer','Hans');
  q('film','01',2,'Vad heter renen i filmen Frost?','Sven','Olof','Rudolf','Bamse');
  q('film','01',1,'Vilken färg har trollet Shrek?','Grön','Blå','Röd','Lila');
  q('film','0',1,'Vad heter Disneys mest kända mus? 🐭','Musse Pigg','Kalle Anka','Långben','Pluto');
  q('film','012',1,'Vad heter Kalle Ankas tre brorsöner?','Knatte, Fnatte och Tjatte','Pip, Pop och Pyp','Snipp, Snapp och Snut','Kalle, Olle och Pelle');
  q('film','012',1,'I vilket spel bygger man med block och akta sig för Creepers?','Minecraft','Fortnite','Roblox','Tetris');
  q('film','012',1,'Vad heter Marios bror i Nintendos spel?','Luigi','Wario','Toad','Yoshi');
  q('film','01',1,'Vad heter den gröna dinosaurien som Mario rider på?','Yoshi','Bowser','Koopa','Donkey Kong');
  q('film','01',1,'Vilken gul Pokémon säger "Pika pika"? ⚡','Pikachu','Charmander','Bulbasaur','Squirtle');
  q('film','123',1,'Vad heter trolldomsskolan i Harry Potter?','Hogwarts','Narnia','Mordor','Neverland');
  q('film','123',2,'Vad heter Harry Potters uggla?','Hedwig','Krumben','Scabbers','Fawkes');
  q('film','3',2,'Vem regisserade den första Jurassic Park-filmen (1993)?','Steven Spielberg','George Lucas','James Cameron','Christopher Nolan');
  q('film','123',1,'Vad heter skurken i Star Wars som andas tungt i svart mask?','Darth Vader','Yoda','Han Solo','Chewbacca');
  q('film','012',1,'I vilken film säger Buzz Lightyear "Mot oändligheten och vidare!"?','Toy Story','Bilar','Monsters, Inc.','Hitta Nemo');
  q('film','01',1,'Vad är Nemo för slags fisk? 🐠','Clownfisk','Guldfisk','Haj','Tonfisk');
  q('film','01',1,'I vilken film finns lejonungen Simba? 🦁','Lejonkungen','Djungelboken','Madagaskar','Zootropolis');
  q('film','3',3,'Vilket år hade den första Toy Story-filmen premiär?','1995','2001','1989','2005');
  q('film','23',2,'Vilket är världens mest sålda tv-spel genom tiderna?','Minecraft','Tetris','GTA V','Wii Sports');
  q('film','23',1,'Vad heter den gula familjen från Springfield i den tecknade tv-serien?','Simpsons','Griffin','Flinta','Belcher');
  q('film','3',3,'Vem skapade Minecraft?','Markus Persson','Daniel Ek','Niklas Zennström','Ingvar Kamprad');
  q('film','0',1,'Vilket spel går ut på att få fyra brickor på rad?','Fyra i rad','Schack','Fia','Monopol');
  q('film','12',2,'Vilken schackpjäs får bara gå ett steg i taget, men åt alla håll?','Kungen','Drottningen','Tornet','Löparen');
  q('film','12',2,'Vilken schackpjäs rör sig i ett "L"?','Springaren (hästen)','Löparen','Tornet','Bonden');
  q('film','12',1,'Vad heter flickan som ramlar ner i ett kaninhål till Underlandet?','Alice','Dorothy','Wendy','Ronja');
  q('film','123',2,'Vad heter Ronja Rövardotters pappa?','Mattis','Borka','Birk','Skalle-Per');
  q('film','0',1,'Vad heter sköldpaddan som är Bamses smarta kompis? 🐢','Skalman','Lille Skutt','Vargen','Nalle Puh');
  q('film','0',1,'Vad heter kaninen som är Bamses kompis? 🐰','Lille Skutt','Skalman','Krösus Sork','Pippi');
  q('film','12',2,'Vad heter skurken i Super Mario som är en stor sköldpaddsdrake?','Bowser','Ganon','Eggman','Wario');
  q('film','23',2,'Vad heter spelet där man ska vara sist kvar på en ö som krymper?','Fortnite','Minecraft','FIFA','Tetris');

  // ───────────── MAT & DRYCK ─────────────
  q('mat','0',1,'Vilken frukt är gul och böjd? 🍌','Banan','Äpple','Päron','Kiwi');
  q('mat','0',1,'Vad görs pommes frites av? 🍟','Potatis','Morötter','Ris','Majs');
  q('mat','01',1,'Från vilket land kommer pizzan? 🍕','Italien','USA','Frankrike','Grekland');
  q('mat','23',1,'Vad är huvudingrediensen i guacamole? 🥑','Avokado','Tomat','Gurka','Ärtor');
  q('mat','12',1,'Vad heter den japanska rätten med ris och fisk? 🍣','Sushi','Tacos','Paella','Kebab');
  q('mat','012',1,'Vilken bulle äter man på fettisdagen?','Semla','Kanelbulle','Lussekatt','Prinsesstårta');
  q('mat','123',2,'Vilken krydda gör lussekatter gula?','Saffran','Kanel','Kardemumma','Ingefära');
  q('mat','3',3,'Vilket datum är kanelbullens dag?','4 oktober','13 december','1 april','6 juni');
  q('mat','0',1,'Från vilket djur kommer mjölken i affären oftast? 🥛','Kon','Hönan','Grisen','Hästen');
  q('mat','12',1,'Från vilket land kommer tacos? 🌮','Mexiko','Spanien','Italien','Brasilien');
  q('mat','01',1,'Vilken grönsak är orange och sägs vara bra för synen? 🥕','Moroten','Gurkan','Broccolin','Potatisen');
  q('mat','123',1,'Vad äter man traditionellt på midsommar i Sverige?','Sill och färskpotatis','Pizza','Sushi','Kalkon');
  q('mat','3',2,'Vilken schweizisk ost har stora hål?','Emmentaler','Brie','Parmesan','Fetaost');
  q('mat','123',1,'Vad heter rätten med pastaplattor, köttfärssås och ostsås i lager?','Lasagne','Risotto','Gnocchi','Paella');
  q('mat','012',1,'Vad är russin gjorda av? 🍇','Vindruvor','Plommon','Körsbär','Äpplen');
  q('mat','23',2,'Vad är tofu gjort av?','Sojabönor','Ris','Mjölk','Vete');
  q('mat','12',1,'Vad får bröddegen att jäsa?','Jäst','Salt','Socker','Smör');
  q('mat','23',2,'Vilket bär kallas "Norrlands guld"?','Hjortron','Lingon','Blåbär','Jordgubbar');
  q('mat','012',1,'Vilken sylt äter man traditionellt till köttbullar?','Lingonsylt','Jordgubbssylt','Hallonsylt','Blåbärssylt');
  q('mat','12',1,'Vilket land förknippas mest med croissanter? 🥐','Frankrike','Spanien','Tyskland','Danmark');
  q('mat','23',2,'Vilken nöt görs marsipan av?','Mandel','Jordnöt','Hasselnöt','Valnöt');
  tf('mat','23',2,'Botaniskt sett är tomaten en frukt.',true);
  q('mat','123',1,'Vilken italiensk ost rivs ofta över pasta?','Parmesan','Cheddar','Brie','Gouda');
  q('mat','12',1,'Från vilken växt kommer choklad? 🍫','Kakaoträdet','Kaffebusken','Sockerröret','Teplantan');
  q('mat','0',1,'Vilken av dessa är en frukt?','Äpple','Morot','Potatis','Lök');
  q('mat','0',1,'Vad gör bina som vi kan äta? 🐝','Honung','Sylt','Godis','Smör');
  q('mat','3',2,'Vad heter den spanska risrätten med skaldjur och saffran?','Paella','Risotto','Pilaff','Biryani');
  q('mat','12',2,'Vad heter det italienska ordet för pasta som är "lagom" kokt?','Al dente','Bon appétit','Ciao','Prego');

  // ───────────── SPRÅK & ORD ─────────────
  q('sprak','12',1,'Hur många bokstäver har det svenska alfabetet?','29','26','28','30');
  q('sprak','01',1,'Vilken är den sista bokstaven i det svenska alfabetet?','Ö','Z','Å','Ä');
  q('sprak','01',1,'Vad heter "hund" på engelska? 🐶','Dog','Cat','Horse','Bird');
  q('sprak','01',1,'Vad betyder "thank you" på svenska?','Tack','Hej','Förlåt','Hejdå');
  q('sprak','0',1,'Vad är motsatsen till "varm"?','Kall','Het','Ljum','Snabb');
  q('sprak','0',1,'Vad är motsatsen till "stor"?','Liten','Lång','Bred','Tung');
  q('sprak','12',1,'Vilket av orden är ett verb?','Springa','Bord','Glad','Under');
  q('sprak','12',1,'Vilket av orden är ett adjektiv?','Röd','Hoppa','Stol','Under');
  q('sprak','12',1,'Vilket av orden är ett substantiv?','Bil','Springa','Snabb','Och');
  q('sprak','23',2,'Vad heter "äpple" på spanska?','Manzana','Naranja','Pera','Fresa');
  q('sprak','123',1,'Vad betyder franskans "merci"?','Tack','Hej','Ja','God natt');
  q('sprak','123',2,'Vilket språk talar man i Brasilien?','Portugisiska','Spanska','Brasilianska','Italienska');
  q('sprak','3',2,'Vilket språk har flest som talar det som modersmål?','Mandarin (kinesiska)','Engelska','Spanska','Hindi');
  q('sprak','23',2,'Vad kallas ett ord som blir samma baklänges, som "kajak"?','Palindrom','Synonym','Anagram','Homonym');
  q('sprak','12',1,'Vilket ord betyder ungefär samma sak som "glad"?','Lycklig','Ledsen','Arg','Trött');
  q('sprak','12',1,'Vad heter "måndag" på engelska?','Monday','Sunday','Tuesday','Friday');
  q('sprak','23',2,'Hur många vokaler finns det i svenska alfabetet?','9','5','6','7');
  q('sprak','0',1,'Vad heter "katt" på engelska? 🐱','Cat','Dog','Cow','Rat');
  q('sprak','12',1,'Vad betyder engelskans "butterfly"? 🦋','Fjäril','Smörblomma','Fluga','Nyckelpiga');
  q('sprak','0',1,'Vilket ord rimmar på "katt"?','Hatt','Hund','Mus','Fisk');
  q('sprak','0',1,'Vilket ord rimmar på "sol"?','Stol','Måne','Bord','Säng');
  q('sprak','12',1,'Vad betyder spanskans "hola"?','Hej','Hejdå','Tack','Snälla');
  q('sprak','23',2,'Från vilket språk kommer ordet "smörgåsbord" som används på engelska?','Svenska','Danska','Tyska','Norska');
  q('sprak','3',2,'Vad betyder uttrycket "att ana ugglor i mossen"?','Att misstänka något lurt','Att vara trött','Att gå vilse i skogen','Att vara rädd för mörker');
  q('sprak','3',2,'Vad betyder "att glida in på en räkmacka"?','Att få det lätt utan att anstränga sig','Att halka på golvet','Att äta för mycket','Att komma för sent');
  q('sprak','12',2,'Vad heter "jordgubbe" på engelska? 🍓','Strawberry','Raspberry','Blueberry','Cherry');

  // ───────────── MATTE & LOGIK ─────────────
  q('matte','0',1,'Vad är 2 + 3?','5','4','6','7');
  q('matte','01',1,'Vad är 7 + 8?','15','14','16','13');
  q('matte','12',1,'Vad är 6 × 7?','42','36','48','49');
  q('matte','12',2,'Vad är 9 × 8?','72','64','81','63');
  q('matte','12',1,'Vad är 100 − 37?','63','73','67','57');
  q('matte','0',1,'Hur många hörn har en triangel? 🔺','3','4','5','6');
  q('matte','12',2,'Hur många sidor har en hexagon?','6','5','7','8');
  q('matte','01',1,'Vad är hälften av 50?','25','20','30','15');
  q('matte','01',1,'Hur många minuter är en timme? ⏰','60','100','30','24');
  q('matte','12',1,'Hur många sekunder är 3 minuter?','180','120','300','160');
  q('matte','23',2,'Vad är 15 % av 200?','30','15','20','45');
  q('matte','23',2,'Vad är kvadratroten ur 144?','12','14','11','16');
  q('matte','12',1,'Vilket tal kommer sedan: 2, 4, 8, 16, …?','32','24','20','18');
  q('matte','23',2,'Vilket tal kommer sedan: 1, 1, 2, 3, 5, 8, …?','13','11','12','10');
  q('matte','12',1,'Hur många dagar har ett skottår?','366','365','364','360');
  q('matte','23',1,'Vad är 3²?','9','6','8','12');
  q('matte','23',1,'Vad är π (pi) ungefär?','3,14','2,71','1,62','4,13');
  q('matte','23',2,'Vilket av talen är ett primtal?','7','9','15','21');
  q('matte','0',1,'Du har 3 äpplen och äter upp 1. Hur många har du kvar? 🍎','2','1','3','4');
  q('matte','0',2,'Hur många hjul har tre cyklar tillsammans? 🚲','6','3','9','8');
  q('matte','12',1,'Hur mycket är 1 000 gram?','1 kilo','1 liter','1 meter','1 ton');
  q('matte','12',1,'Hur många centimeter är en meter?','100','10','1 000','50');
  q('matte','23',2,'En bonde har 17 får. Alla utom 9 springer iväg. Hur många är kvar?','9','8','17','0');
  q('matte','23',2,'Hur många av årets månader har 28 dagar?','Alla 12','1','2','6');
  q('matte','23',2,'Vad är 0,5 + 0,25?','0,75','0,30','0,55','1');
  q('matte','23',2,'Hur många grader är vinkelsumman i en triangel?','180°','360°','90°','270°');
  q('matte','23',2,'Vad är 12 × 12?','144','124','142','132');
  q('matte','12',1,'Vad är klockan när den är "kvart över tre" på eftermiddagen?','15:15','15:45','14:45','13:15');
  q('matte','0',1,'Vilket tal är störst?','10','7','3','9');
  q('matte','0',1,'Hur många fingrar har du på båda händerna tillsammans? 🖐️','10','8','5','12');
  q('matte','3',3,'Ett bat och en boll kostar 110 kr tillsammans. Batet kostar 100 kr mer än bollen. Vad kostar bollen?','5 kr','10 kr','1 kr','15 kr');

  // ───────────── MUSIKFAKTA ─────────────
  q('musik','123',1,'Vilken svensk grupp vann Eurovision 1974 med "Waterloo"?','ABBA','Roxette','Europe','Ace of Base');
  q('musik','12',1,'Hur många strängar har en vanlig gitarr? 🎸','6','4','5','8');
  q('musik','01',1,'Vilket instrument har svarta och vita tangenter? 🎹','Piano','Gitarr','Trumma','Flöjt');
  q('musik','3',3,'Hur många tangenter har ett vanligt piano?','88','76','100','64');
  q('musik','23',1,'Vem kallas "The King of Pop"?','Michael Jackson','Elvis Presley','Prince','Justin Bieber');
  q('musik','3',2,'Vem kallas "The King of Rock and Roll"?','Elvis Presley','Michael Jackson','Mick Jagger','Chuck Berry');
  q('musik','3',2,'Från vilken stad kom The Beatles?','Liverpool','London','Manchester','Birmingham');
  q('musik','3',3,'Hur många gånger hade Sverige vunnit Eurovision till och med 2025?','7','6','5','8');
  q('musik','23',1,'Vilken svensk artist vann Eurovision både 2012 och 2023?','Loreen','Carola','Måns Zelmerlöw','Zara Larsson');
  q('musik','23',1,'Vilken svensk DJ gjorde låten "Levels"?','Avicii','Alesso','Axwell','Basshunter');
  q('musik','01',1,'Vilket av instrumenten blåser man i? 🎺','Trumpet','Fiol','Trumma','Piano');
  q('musik','12',1,'Vad kallas en stor grupp musiker som spelar klassisk musik med en dirigent?','Orkester','Kör','Band','Duo');
  q('musik','3',2,'Vem komponerade pianostycket "Für Elise"?','Ludwig van Beethoven','Wolfgang Amadeus Mozart','Johann Sebastian Bach','Frédéric Chopin');
  q('musik','23',2,'Hur många musiker spelar i en kvartett?','4','3','5','2');
  q('musik','123',1,'Vilken musiktjänst startades i Sverige 2006?','Spotify','Klarna','Mojang','Tidal');
  q('musik','12',1,'Vilket instrument spelar man med en stråke? 🎻','Fiol','Gitarr','Piano','Saxofon');
  q('musik','23',2,'Vad hette Taylor Swifts rekordturné 2023–2024?','The Eras Tour','Reputation Tour','1989 World Tour','Lover Fest');
  q('musik','3',2,'Vilken svensk grupp hade en världshit med "The Sign" 1993?','Ace of Base','Roxette','The Cardigans','Europe');
  q('musik','3',3,'Med vilken låt vann Carola Eurovision 1991?','Fångad av en stormvind','Främling','Evighet','Invincible');
  q('musik','0',1,'Vilket instrument slår man på med pinnar? 🥁','Trumma','Fiol','Flöjt','Piano');
  q('musik','12',2,'Vad heter Sveriges stora tävling där vi väljer låt till Eurovision?','Melodifestivalen','Idol','Allsång på Skansen','Musikhjälpen');

  // ───────────── TEKNIK & INTERNET ─────────────
  q('teknik','23',1,'Vad står "www" för i webbadresser?','World Wide Web','World Web Wide','Wide World Web','Web World Wide');
  q('teknik','12',1,'Vilket företag gör iPhone? 📱','Apple','Samsung','Google','Microsoft');
  q('teknik','12',1,'Vilket företag gör Galaxy-mobilerna?','Samsung','Apple','Nokia','Sony');
  q('teknik','123',1,'Vad heter Googles operativsystem för mobiler?','Android','iOS','Windows','macOS');
  q('teknik','23',2,'Vem grundade Microsoft tillsammans med Paul Allen?','Bill Gates','Steve Jobs','Elon Musk','Mark Zuckerberg');
  q('teknik','123',1,'Vad står förkortningen "AI" för?','Artificiell intelligens','Automatisk information','Avancerat internet','Allmän idé');
  q('teknik','23',2,'Vem brukar kopplas ihop med uppfinningen av glödlampan?','Thomas Edison','Nikola Tesla','Alexander Graham Bell','Isaac Newton');
  q('teknik','3',2,'Vem räknas som telefonens uppfinnare?','Alexander Graham Bell','Thomas Edison','Lars Magnus Ericsson','Guglielmo Marconi');
  q('teknik','123',1,'Vad heter tekniken som kopplar trådlösa hörlurar till mobilen?','Bluetooth','USB','HDMI','Ethernet');
  q('teknik','3',3,'Bluetooth är uppkallat efter en dansk vikingakung. Vad hette han?','Harald Blåtand','Knut den store','Sven Tveskägg','Gorm den gamle');
  q('teknik','12',1,'Vilket lösenord är säkrast? 🔐','K8#vR!q2pZ','123456','lösenord','qwerty');
  q('teknik','3',2,'Hur många bitar är en byte?','8','4','16','10');
  q('teknik','3',2,'Vilket år kom den första iPhonen?','2007','2005','2010','2001');
  q('teknik','12',1,'Vilket av dessa är en webbläsare?','Chrome','Excel','Spotify','Word');
  q('teknik','3',3,'Vad står USB för?','Universal Serial Bus','United System Board','Universal Super Battery','Ultra Speed Bus');
  q('teknik','3',2,'Vilket svenskt teknikföretag grundades av Lars Magnus Ericsson?','Ericsson','Volvo','Saab','Electrolux');
  q('teknik','23',2,'Vad kallas falska mejl som försöker lura till sig ditt lösenord?','Nätfiske (phishing)','Streaming','Bloggning','Kodning');
  tf('teknik','01',1,'Man ska aldrig berätta sitt lösenord för främlingar på nätet.',true);
  q('teknik','0',1,'Vad behöver en mobil när batteriet är slut? 🔋','Laddas','Vattnas','Matas','Tvättas');
  q('teknik','12',2,'Vad kallas den lilla bilden man trycker på för att öppna en app?','Ikon','Pixel','Fil','Mapp');
})();

/* Spotify-låtar till musikfrågorna. id = Spotify-låt-ID (från open.spotify.com/track/ID).
 * a = åldrar som låten passar. Egna låtar läggs till i appen under "Mina låtar". */
window.QK_SONGS = [
  { id:'4vSuothg7NLVAeKNY3oSw4', t:'Dancing Queen',            ar:'ABBA',                  y:1976, a:'0123' },
  { id:'0qcr5FMsEO85NAQjrlDRKo', t:'Let It Go',                ar:'Idina Menzel',          y:2013, a:'012'  },
  { id:'6NPVjNh8Jhru9xOmyQigds', t:'Happy',                    ar:'Pharrell Williams',     y:2013, a:'0123' },
  { id:'294vBlXfZYspeI29SXZaON', t:'Wake Me Up',               ar:'Avicii',                y:2013, a:'123'  },
  { id:'1DmW5Ep6ywYwxc2HMT5BG6', t:'Tattoo',                   ar:'Loreen',                y:2023, a:'123'  },
  { id:'0VjIjW4GlUZAMYd2vXMi3b', t:'Blinding Lights',          ar:'The Weeknd',            y:2019, a:'123'  },
  { id:'3MrRksHupTVEQ7YbA0FsZK', t:'The Final Countdown',      ar:'Europe',                y:1986, a:'123'  },
  { id:'1KRpJeeB2JEG6AW6Uri3QX', t:'Bohemian Rhapsody',        ar:'Queen',                 y:1975, a:'23'   },
  { id:'7J1uxwnxfQLu4APicE5Rnj', t:'Billie Jean',              ar:'Michael Jackson',       y:1982, a:'123'  },
  { id:'7qiZfU4dY1lWllzX7mPBI3', t:'Shape of You',             ar:'Ed Sheeran',            y:2017, a:'123'  },
  { id:'32OlwWuMpZ6b0aN2RZOeMS', t:'Uptown Funk',              ar:'Mark Ronson & Bruno Mars', y:2014, a:'0123' },
  { id:'367xWyOrpCoBOuxYGTybFc', t:'bad guy',                  ar:'Billie Eilish',         y:2019, a:'123'  },
  { id:'7DSAEUvxU8FajXtRloy8M0', t:'Flowers',                  ar:'Miley Cyrus',           y:2023, a:'123'  },
  { id:'4PB8ogrqkzwg90cqPk06xP', t:'Heroes',                   ar:'Måns Zelmerlöw',        y:2015, a:'123'  },
  { id:'6qB7YcFpeBEQa0D6QO482y', t:'It Must Have Been Love',   ar:'Roxette',               y:1990, a:'23'   },
  { id:'34k2uDVZqj0jnxEO6CVBtQ', t:'Wannabe',                  ar:'Spice Girls',           y:1996, a:'23'   },
  { id:'3m1U5hxuhIZS5O1xMZgPaE', t:'Baby Shark',               ar:'Pinkfong',              y:2016, a:'01'   },
  { id:'1WkMMavIMc4JZ8cfMmxHkI', t:"Can't Stop the Feeling!",  ar:'Justin Timberlake',     y:2016, a:'0123' },
  { id:'7CUYHcu0RnbOnMz4RuN07w', t:'Despacito',                ar:'Luis Fonsi & Daddy Yankee', y:2017, a:'123' },
  { id:'2qSkIjg1o9h3YT9RAgYN75', t:'Espresso',                 ar:'Sabrina Carpenter',     y:2024, a:'123'  },
  { id:'2374M0fQpWi3dLnB54qaLX', t:'Africa',                   ar:'Toto',                  y:1982, a:'23'   },
  { id:'0r4SsYcwvd8URat6AS2m6f', t:'Lush Life',                ar:'Zara Larsson',          y:2015, a:'123'  },
  { id:'2V65y3PX4DkRhy1djlxd9p', t:"Don't You Worry Child",    ar:'Swedish House Mafia',   y:2012, a:'123'  },
];
