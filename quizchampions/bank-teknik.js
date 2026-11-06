/* Quiz Champions – teknik & internet */
(function () {
  const { q, tf, gq, rand } = window.QKB;
  const FORK = [['PDF','Portable Document Format'],['GPS','Global Positioning System'],['HTML','HyperText Markup Language'],['URL','Uniform Resource Locator'],
    ['CPU','Central Processing Unit'],['RAM','Random Access Memory'],['LED','Light Emitting Diode'],['SMS','Short Message Service'],['PIN','Personal Identification Number'],
    ['QR (i QR-kod)','Quick Response'],['DVD','Digital Versatile Disc'],['HDMI','High-Definition Multimedia Interface'],['VR','Virtual Reality'],['AR','Augmented Reality'],
    ['PC','Personal Computer'],['NFC','Near Field Communication'],['SIM (i SIM-kort)','Subscriber Identity Module'],['HTTP','HyperText Transfer Protocol'],
    ['JPEG','Joint Photographic Experts Group'],['LCD','Liquid Crystal Display'],['DNS','Domain Name System'],['IP (i IP-adress)','Internet Protocol'],['NASA','National Aeronautics and Space Administration']];
  const fB = FORK.map(f => f[1]);
  for (const [f, b] of FORK) gq('teknik', ['SMS','PIN','PC','VR','GPS'].includes(f) ? '23' : '3', ['SMS','PIN','PC','VR'].includes(f) ? 2 : 3, 'forkortning', `Vad står ${f} för?`, b, fB, []);
  const PROD = [['iPhone','Apple'],['Galaxy-mobilerna','Samsung'],['Windows','Microsoft'],['PlayStation','Sony'],['Android','Google'],['webbläsaren Chrome','Google'],
    ['Instagram','Meta'],['WhatsApp','Meta'],['YouTube','Google'],['TikTok','ByteDance'],['Kindle-läsplattan','Amazon'],['röstassistenten Alexa','Amazon'],['röstassistenten Siri','Apple'],
    ['ChatGPT','OpenAI'],['Model 3','Tesla'],['Word och Excel','Microsoft'],['Gmail','Google'],['AirPods','Apple'],['Pixel-mobilerna','Google'],['Snapchat','Snap']];
  const pB = [...new Set(PROD.map(p => p[1]))];
  for (const [p, f] of PROD) gq('teknik', ['iPhone','YouTube','Windows','PlayStation','AirPods'].includes(p) ? '123' : '23', ['iPhone','YouTube'].includes(p) ? 1 : 2, 'produkt', `Vilket företag ligger bakom ${p}?`, f, pB, []);
  const FL = [['Samsung','Sydkorea'],['Sony','Japan'],['Nokia','Finland'],['Ericsson','Sverige'],['Philips','Nederländerna'],['Siemens','Tyskland'],['LEGO','Danmark'],['Huawei','Kina'],
    ['Lenovo','Kina'],['Toyota','Japan'],['BMW','Tyskland'],['Ferrari','Italien'],['Nintendo','Japan'],['Spotify','Sverige'],['Klarna','Sverige'],['Rovio (Angry Birds)','Finland'],
    ['Supercell','Finland'],['Volvo','Sverige'],['IKEA','Sverige'],['Apple','USA'],['Hyundai','Sydkorea'],['Skype','Sverige och Danmark (grundare)']];
  const flL = [...new Set(FL.map(f => f[1]).filter(x => !x.includes('grundare')))];
  for (const [f, l] of FL) if (!l.includes('grundare')) gq('teknik', ['LEGO','IKEA','Volvo','Nintendo','Spotify','Samsung','Sony'].includes(f) ? '123' : '23', ['LEGO','IKEA','Volvo'].includes(f) ? 1 : 2, 'foretagsland', `Från vilket land kommer företaget ${f} ursprungligen?`, l, flL, []);
  const UPP = [['radion','Guglielmo Marconi'],['flygplanet','Bröderna Wright'],['webben (World Wide Web)','Tim Berners-Lee'],['dynamiten','Alfred Nobel'],['penicillinet','Alexander Fleming'],
    ['bensinbilen','Karl Benz'],['pacemakern','Rune Elmqvist'],['absorptionskylskåpet','Baltzar von Platen och Carl Munters'],['Tetra Pak-förpackningen','Ruben Rausing'],
    ['AGA-fyren med solventil','Gustaf Dalén'],['Skype','Niklas Zennström och Janus Friis'],['telegrafen med punkter och streck','Samuel Morse'],['fonografen','Thomas Edison'],
    ['mobiltelefonen','Martin Cooper'],['datormusen','Douglas Engelbart'],['operativsystemet Linux','Linus Torvalds'],['programspråket Python','Guido van Rossum'],['telefonen','Alexander Graham Bell']];
  const uB = UPP.map(u => u[1]);
  for (const [u, v] of UPP) if (u !== 'telefonen') gq('teknik', ['dynamiten','flygplanet'].includes(u) ? '123' : '3', ['dynamiten','flygplanet'].includes(u) ? 1 : 3, 'uppfinnare', `Vem brukar räknas som uppfinnare av ${u}?`, v, uB, []);
  const ar = (a, d, text, y) => { const s = new Set(); let g = 0; while (s.size < 3 && g++ < 60) { const v = y + [-1, 1, -2, 2, -3, 3, -5, 5, -7, 7][Math.floor(rand() * 10)]; if (v !== y && v <= 2026) s.add(String(v)); } window.QK_BANK.push({ c: 'teknik', a, d, g: 'artal', q: text, o: [String(y), ...s] }); };
  [['23',2,'Vilket år startade Facebook?',2004],['23',2,'Vilket år startade YouTube?',2005],['3',2,'Vilket år grundades Google?',1998],['3',2,'Vilket år startade Wikipedia?',2001],
   ['23',2,'Vilket år kom Instagram?',2010],['3',2,'Vilket år lanserades Spotify för allmänheten?',2008],['3',2,'Vilket år kom Windows XP?',2001],['3',3,'Vilket år kom den första PlayStation i Japan?',1994],
   ['3',2,'Vilket år kom Game Boy?',1989],['23',2,'Vilket år kom Nintendo Switch?',2017],['23',2,'Vilket år släpptes ChatGPT?',2022],['3',2,'Vilket år blev webben (WWW) öppen för alla?',1991],
   ['3',3,'Vilket år skickades det första SMS:et?',1992],['3',3,'Vilket år grundades Apple?',1976],['3',3,'Vilket år grundades Microsoft?',1975],['3',3,'Vilket år grundades Amazon?',1994],
   ['3',3,'Vilket år grundades Ericsson?',1876],['3',3,'Vilket år grundades Tesla?',2003]].forEach(([a, d, t, y]) => ar(a, d, t, y));

  q('teknik','01',1,'Vad ska man göra om någon okänd på nätet ber om ditt lösenord?','Inte svara och berätta för en vuxen','Skicka lösenordet','Byta namn','Stänga av datorn för alltid');
  q('teknik','01',1,'Vad är bra att göra innan man lägger upp en bild på en kompis?','Fråga kompisen om det är okej','Ingenting','Lägga upp den direkt','Ändra kompisens namn');
  q('teknik','12',1,'Vad kallas det när någon är elak mot andra på nätet om och om igen?','Nätmobbning','Streaming','Gaming','Bloggning');
  q('teknik','12',1,'Vad är ett bra lösenord?','Långt och med blandade tecken','Ditt namn','123456','Din födelsedag');
  q('teknik','12',2,'Vad är tvåfaktorsautentisering?','Ett extra steg för att logga in, t.ex. en kod i mobilen','Två lösenord på en lapp','Att två personer delar konto','En sorts virus');
  q('teknik','12',1,'Vad heter datorns "hjärna" som gör alla beräkningar?','Processor','Skärm','Tangentbord','Högtalare');
  q('teknik','12',1,'Vilket kortkommando kopierar på en Windows-dator?','Ctrl + C','Ctrl + V','Ctrl + Z','Ctrl + P');
  q('teknik','12',1,'Vilket kortkommando klistrar in?','Ctrl + V','Ctrl + C','Ctrl + X','Ctrl + A');
  q('teknik','12',1,'Vilket kortkommando ångrar det man just gjorde?','Ctrl + Z','Ctrl + Y','Ctrl + S','Ctrl + Q');
  q('teknik','12',1,'Vilken sorts fil är "semester.jpg"?','En bild','En låt','Ett textdokument','Ett program');
  q('teknik','12',1,'Vilken sorts fil är "sommarlåt.mp3"?','Ljud eller musik','En bild','En video','Ett kalkylark');
  q('teknik','23',2,'Vilket är störst?','1 terabyte','1 gigabyte','1 megabyte','1 kilobyte');
  q('teknik','23',2,'Hur många megabyte är ungefär 1 gigabyte?','1 000','100','10','1 000 000');
  q('teknik','23',1,'Vilka två siffror använder datorer i binära tal?','0 och 1','1 och 2','0 och 9','1 och 10');
  q('teknik','12',1,'Vad heter apparaten hemma som skickar ut wifi?','Router','Skrivare','Laddare','Högtalare');
  q('teknik','12',1,'Vad kallas skadliga program som kan förstöra datorn?','Datorvirus','Appar','Spel','Webbläsare');
  q('teknik','23',2,'Vad betyder det att spara något "i molnet"?','På internet, på någon annans servrar','I en flygande dator','I mobilens minne bara','På en usb-sticka');
  q('teknik','0',1,'Vad kallas en flygande leksak eller kamera som styrs med kontroll?','Drönare','Raket','Ballong','Helikopterhatt');
  q('teknik','01',1,'Vad gör en 3D-skrivare?','Bygger saker lager för lager','Skriver ut brev','Spelar musik','Tar bilder');
  q('teknik','12',1,'Vad gör solceller?','Gör el av solljus','Gör solen varmare','Lagrar vatten','Mäter temperatur');
  q('teknik','23',2,'Vilken sorts batteri finns i de flesta mobiler?','Litiumjonbatteri','Blybatteri','Kolbatteri','Saltbatteri');
  q('teknik','12',1,'Vad heter det enkla programmeringsspråket med färgade block för barn?','Scratch','Python','Java','Excel');
  q('teknik','23',2,'Vad kallas en steg-för-steg-instruktion som en dator följer?','Algoritm','Pixel','Router','Bugg');
  q('teknik','12',1,'Vad kallas ett fel i ett datorprogram?','Bugg','Pixel','App','Mus');
  q('teknik','12',1,'Vad kallas de små prickarna som bilden på en skärm består av?','Pixlar','Atomer','Bitar','Kristaller');
  q('teknik','23',2,'I vilken enhet mäts storleken på en skärm, t.ex. "55" på en tv?','Tum','Centimeter','Pixlar','Meter');
  q('teknik','3',2,'Hur skrivs SOS med morsekod?','··· ——— ···','——— ··· ———','·—· ·—· ·—·','·· ·· ··');
  q('teknik','3',2,'Vem knäckte den tyska Enigma-koden och räknas som datavetenskapens fader?','Alan Turing','Bill Gates','Steve Jobs','Tim Berners-Lee');
  q('teknik','3',2,'Vem räknas som världens första programmerare (1840-talet)?','Ada Lovelace','Marie Curie','Grace Hopper','Hedy Lamarr');
  q('teknik','3',2,'Vad hette en av de första elektroniska datorerna, byggd i USA 1945?','ENIAC','IBM PC','Macintosh','Commodore 64');
  q('teknik','3',2,'Vilken skådespelerska uppfann frekvenshoppning, en föregångare till tekniken i wifi och Bluetooth?','Hedy Lamarr','Greta Garbo','Marilyn Monroe','Ingrid Bergman');
  q('teknik','23',2,'Vad betyder "AI-genererad" om en bild?','Att en dator har skapat den','Att den är fotograferad','Att den är målad för hand','Att den är gammal');
  q('teknik','23',1,'Vad heter tekniken för att betala genom att hålla mobilen mot en kortläsare?','NFC','GPS','HDMI','USB');
  q('teknik','3',2,'Vad heter svenska mobil-betalappen som är kopplad till bankerna?','Swish','Klarna','Vipps','MobilePay');
  q('teknik','3',2,'Vilken e-legitimation i mobilen används mest i Sverige?','BankID','Swish','Klarna','Vipps');
  q('teknik','3',2,'Vilket företag gör bilen Model Y?','Tesla','Volvo','BMW','Toyota');
  q('teknik','23',1,'Vad driver en elbil?','En elmotor och batterier','Bensin','Diesel','Ånga');
  q('teknik','3',2,'Vilket svenskt bilmärke är känt för supersnabba sportbilar?','Koenigsegg','Scania','Volvo','Saab');
  q('teknik','0',1,'Vad kan man göra med en kamera? 📷','Ta bilder','Ringa','Laga mat','Tvätta');
  q('teknik','0',1,'Vad använder man en dammsugare till?','Städa','Laga mat','Sova','Lyssna på musik');
  q('teknik','0',1,'Vilken apparat håller maten kall?','Kylskåp','Ugn','Tvättmaskin','Dator');
  q('teknik','01',1,'Vad behöver en robot för att kunna röra sig?','Motorer och ström','Mat','Sömn','Vatten');
  tf('teknik','12',1,'Man kan alltid lita på allt man läser på internet.',false);
  tf('teknik','23',2,'Wifi och Bluetooth använder radiovågor.',true);
  tf('teknik','3',2,'Den första iPhonen hade ingen app-butik när den lanserades.',true);
  tf('teknik','3',2,'Ericsson är ett finskt företag.',false);
  tf('teknik','23',2,'En byte består av åtta bitar.',true);
})();
