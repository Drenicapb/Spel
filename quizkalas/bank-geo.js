/* Quiz Champions – geografi (faktatabeller + handskrivna frågor) */
(function () {
  const { q, tf, gq } = window.QKB;
  // [land, huvudstad, världsdel (null = hoppa över världsdelsfrågan), nivå 0–3]
  const L = [
    ['Norge','Oslo','Europa',0],['Danmark','Köpenhamn','Europa',0],['Finland','Helsingfors','Europa',0],['Island','Reykjavik','Europa',2],
    ['Tyskland','Berlin','Europa',1],['Frankrike','Paris','Europa',1],['Spanien','Madrid','Europa',1],['Portugal','Lissabon','Europa',2],
    ['Italien','Rom','Europa',1],['Storbritannien','London','Europa',1],['Irland','Dublin','Europa',2],['Nederländerna','Amsterdam','Europa',2],
    ['Belgien','Bryssel','Europa',2],['Schweiz','Bern','Europa',3],['Österrike','Wien','Europa',2],['Polen','Warszawa','Europa',2],
    ['Tjeckien','Prag','Europa',2],['Slovakien','Bratislava','Europa',3],['Ungern','Budapest','Europa',2],['Rumänien','Bukarest','Europa',3],
    ['Bulgarien','Sofia','Europa',3],['Grekland','Aten','Europa',1],['Kroatien','Zagreb','Europa',3],['Slovenien','Ljubljana','Europa',3],
    ['Serbien','Belgrad','Europa',3],['Bosnien och Hercegovina','Sarajevo','Europa',3],['Montenegro','Podgorica','Europa',3],['Albanien','Tirana','Europa',3],
    ['Nordmakedonien','Skopje','Europa',3],['Kosovo','Pristina','Europa',3],['Estland','Tallinn','Europa',2],['Lettland','Riga','Europa',2],
    ['Litauen','Vilnius','Europa',3],['Ukraina','Kyiv','Europa',2],['Belarus','Minsk','Europa',3],['Ryssland','Moskva',null,1],
    ['Moldavien','Chișinău','Europa',3],['Turkiet','Ankara',null,2],['Malta','Valletta','Europa',3],['Cypern','Nicosia',null,3],
    ['Kina','Peking','Asien',1],['Japan','Tokyo','Asien',1],['Sydkorea','Seoul','Asien',2],['Nordkorea','Pyongyang','Asien',3],
    ['Indien','New Delhi','Asien',2],['Pakistan','Islamabad','Asien',3],['Bangladesh','Dhaka','Asien',3],['Thailand','Bangkok','Asien',2],
    ['Vietnam','Hanoi','Asien',2],['Filippinerna','Manila','Asien',3],['Malaysia','Kuala Lumpur','Asien',3],['Nepal','Katmandu','Asien',3],
    ['Afghanistan','Kabul','Asien',3],['Iran','Teheran','Asien',2],['Irak','Bagdad','Asien',2],['Saudiarabien','Riyadh','Asien',3],
    ['Jordanien','Amman','Asien',3],['Libanon','Beirut','Asien',3],['Syrien','Damaskus','Asien',3],['Förenade Arabemiraten','Abu Dhabi','Asien',3],
    ['Qatar','Doha','Asien',3],['Mongoliet','Ulan Bator','Asien',3],['Kazakstan','Astana',null,3],['Kambodja','Phnom Penh','Asien',3],['Laos','Vientiane','Asien',3],
    ['Egypten','Kairo','Afrika',1],['Marocko','Rabat','Afrika',3],['Algeriet','Alger','Afrika',3],['Libyen','Tripoli','Afrika',3],
    ['Nigeria','Abuja','Afrika',3],['Ghana','Accra','Afrika',3],['Kenya','Nairobi','Afrika',2],['Etiopien','Addis Abeba','Afrika',3],
    ['Uganda','Kampala','Afrika',3],['Senegal','Dakar','Afrika',3],['Somalia','Mogadishu','Afrika',3],['Sudan','Khartoum','Afrika',3],
    ['Zimbabwe','Harare','Afrika',3],['Angola','Luanda','Afrika',3],['Madagaskar','Antananarivo','Afrika',3],['Rwanda','Kigali','Afrika',3],
    ['Tanzania','Dodoma','Afrika',3],['Kamerun','Yaoundé','Afrika',3],['Mali','Bamako','Afrika',3],
    ['USA','Washington D.C.','Nordamerika',1],['Kanada','Ottawa','Nordamerika',2],['Mexiko','Mexico City','Nordamerika',2],['Kuba','Havanna','Nordamerika',2],
    ['Jamaica','Kingston','Nordamerika',3],['Costa Rica','San José','Nordamerika',3],['Haiti','Port-au-Prince','Nordamerika',3],['Dominikanska republiken','Santo Domingo','Nordamerika',3],
    ['Brasilien','Brasília','Sydamerika',2],['Argentina','Buenos Aires','Sydamerika',2],['Chile','Santiago','Sydamerika',3],['Peru','Lima','Sydamerika',3],
    ['Colombia','Bogotá','Sydamerika',3],['Venezuela','Caracas','Sydamerika',3],['Ecuador','Quito','Sydamerika',3],['Uruguay','Montevideo','Sydamerika',3],['Paraguay','Asunción','Sydamerika',3],
    ['Australien','Canberra','Oceanien',2],['Nya Zeeland','Wellington','Oceanien',2],['Fiji','Suva','Oceanien',3],['Papua Nya Guinea','Port Moresby','Oceanien',3],
  ];
  const AGE = ['0123', '123', '23', '3'], DIFF = [1, 1, 2, 3];
  const DELAR = ['Europa', 'Asien', 'Afrika', 'Nordamerika', 'Sydamerika', 'Oceanien'];
  const redanFragade = new Set(['Norge', 'Frankrike', 'Italien', 'Spanien', 'Japan', 'Tyskland', 'Australien', 'Island']);
  const capsIn = del => L.filter(r => r[2] === del).map(r => r[1]);
  const landsIn = del => L.filter(r => r[2] === del).map(r => r[0]);
  const allCaps = L.map(r => r[1]), allLands = L.map(r => r[0]);
  for (const [land, cap, del, t] of L) {
    if (!redanFragade.has(land)) gq('geo', AGE[t], DIFF[t], 'huvudstad', `Vad heter huvudstaden i ${land}?`, cap, del ? capsIn(del) : [], allCaps);
    gq('geo', AGE[Math.min(3, t + 1)], Math.min(3, DIFF[t] + 1), 'land-av-stad', `${cap} är huvudstad i vilket land?`, land, del ? landsIn(del) : [], allLands);
    if (del) gq('geo', t <= 1 ? '123' : AGE[t], t <= 1 ? 1 : DIFF[t] - 1, 'varldsdel', `I vilken världsdel ligger ${land}?`, del, DELAR, []);
  }
  // Sevärdheter: [sevärdhet, land, åldrar, svårighet]
  const S = [
    ['Colosseum','Italien','123',1],['Lutande tornet i Pisa','Italien','123',1],['Frihetsgudinnan','USA','0123',1],['Taj Mahal','Indien','23',2],
    ['Machu Picchu','Peru','3',2],['Kristusstatyn i Rio de Janeiro','Brasilien','23',2],['Operahuset i Sydney','Australien','123',1],['Akropolis','Grekland','23',2],
    ['Sagrada Família','Spanien','3',2],['Slottet Neuschwanstein','Tyskland','3',3],['Klippstaden Petra','Jordanien','3',3],['Templet Angkor Wat','Kambodja','3',3],
    ['Burj Khalifa','Förenade Arabemiraten','23',2],['Kreml','Ryssland','23',2],['Golden Gate-bron','USA','23',1],['Taffelberget','Sydafrika','3',3],
    ['Berget Fuji','Japan','23',2],['Stonehenge','Storbritannien','3',2],['Alhambra','Spanien','3',3],['Brandenburger Tor','Tyskland','23',2],
    ['Atomium','Belgien','3',3],['Den lilla sjöjungfrun','Danmark','123',1],['Hagia Sofia','Turkiet','3',2],['Chichén Itzá','Mexiko','3',3],
    ['Uluru (Ayers Rock)','Australien','23',2],['Galápagosöarna','Ecuador','3',3],['Påskön med sina stenstatyer','Chile','3',3],['Kinesiska muren','Kina','0123',1],
    ['Mount Rushmore','USA','3',2],['Tower Bridge','Storbritannien','123',1],['Triumfbågen i Paris','Frankrike','123',1],['Legoland i Billund','Danmark','012',1],
  ];
  const sLand = S.map(s => s[1]);
  for (const [sev, land, a, d] of S) gq('geo', a, d, 'sevardhet', `I vilket land finns ${sev}?`, land, sLand, allLands);
  // Valutor
  const V = [['Japan','Yen'],['Storbritannien','Pund'],['USA','Dollar'],['Schweiz','Franc'],['Ryssland','Rubel'],['Indien','Rupie'],['Kina','Yuan'],['Mexiko','Peso'],
    ['Thailand','Baht'],['Sydkorea','Won'],['Polen','Złoty'],['Turkiet','Lira'],['Brasilien','Real'],['Sydafrika','Rand'],['Ungern','Forint'],['Tyskland','Euro'],['Norge','Norsk krone'],['Danmark','Dansk krone']];
  const vals = V.map(v => v[1]);
  for (const [land, val] of V) gq('geo', ['USA','Storbritannien','Tyskland','Japan'].includes(land) ? '123' : '3', ['USA','Storbritannien','Tyskland','Japan'].includes(land) ? 1 : 2, 'valuta', `Vilken valuta används i ${land}?`, val, vals, []);
  // Floder
  const F = [['Themsen','London'],['Tibern','Rom'],['Spree','Berlin'],['Moldau','Prag'],['Nilen','Kairo'],['Tigris','Bagdad'],['Liffey','Dublin'],['Tejo','Lissabon'],['Wisła','Warszawa'],['Neva','Sankt Petersburg'],['Hudson','New York']];
  const fCities = F.map(f => f[1]);
  for (const [flod, stad] of F) gq('geo', ['Themsen','Nilen'].includes(flod) ? '23' : '3', flod === 'Themsen' || flod === 'Nilen' ? 1 : 3, 'flod', `Vilken stad ligger vid floden ${flod}?`, stad, fCities, []);

  // Handskrivna
  q('geo','01',1,'Vad heter havet öster om Sverige? 🌊','Östersjön','Nordsjön','Medelhavet','Atlanten');
  q('geo','0',1,'Vad kallas land som har vatten runt om sig?','En ö','En sjö','En flod','En dal');
  q('geo','0',1,'Vad kallas vatten som har land runt om sig?','En sjö','En ö','En udde','En kulle');
  q('geo','0',1,'Vad kallas en rund modell av jorden?','Jordglob','Karta','Kompass','Kikare');
  q('geo','01',1,'Åt vilket väderstreck pekar kompassnålen?','Norr','Söder','Öster','Väster');
  q('geo','01',1,'Var finns det mest is på jorden? ❄️','Antarktis','Sahara','Amazonas','Europa');
  q('geo','0',1,'Vad heter det höga berget som kan spruta lava? 🌋','Vulkan','Glaciär','Kulle','Fjäll');
  q('geo','01',1,'Var går solen upp?','I öster','I väster','I norr','I söder');
  q('geo','01',2,'Vad kallas linjen som delar jorden i en norra och en södra halva?','Ekvatorn','Nollmeridianen','Polcirkeln','Datumgränsen');
  q('geo','12',1,'Vilka två länder har landgräns mot Sverige?','Norge och Finland','Danmark och Norge','Finland och Ryssland','Danmark och Tyskland');
  q('geo','23',1,'Vilket land kallas "den uppgående solens land"?','Japan','Kina','Thailand','Sydkorea');
  q('geo','12',1,'Vilket land är känt för sina fjordar?','Norge','Danmark','Nederländerna','Belgien');
  q('geo','123',1,'I vilket land ligger Venedig med sina kanaler?','Italien','Frankrike','Grekland','Kroatien');
  q('geo','23',2,'Vilken stor ö tillhör Danmark men ligger i Nordamerika?','Grönland','Island','Svalbard','Färöarna');
  q('geo','3',2,'Vilken stad ligger både i Europa och Asien?','Istanbul','Moskva','Aten','Kairo');
  q('geo','3',2,'Vilken är världens djupaste sjö?','Bajkalsjön','Victoriasjön','Vänern','Titicacasjön');
  q('geo','3',2,'Vilket är världens största insjö (till ytan)?','Kaspiska havet','Bajkalsjön','Victoriasjön','Övre sjön');
  q('geo','23',2,'Vad heter sundet mellan Sverige och Danmark?','Öresund','Kattegatt','Bosporen','Engelska kanalen');
  q('geo','3',2,'Vilket land har flest invånare i Afrika?','Nigeria','Egypten','Sydafrika','Kenya');
  q('geo','3',3,'Vilket är Nordens högsta berg?','Galdhøpiggen','Kebnekaise','Snøhetta','Hvannadalshnúkur');
  q('geo','12',1,'Vilken världsdel har ingen fast befolkning?','Antarktis','Oceanien','Sydamerika','Afrika');
  q('geo','12',1,'Vad heter världens största regnskog?','Amazonas','Kongo','Borneo','Daintree');
  q('geo','01',1,'Vilken flod rinner genom Egypten?','Nilen','Amazonfloden','Donau','Ganges');
  q('geo','3',3,'Vilket litet land ligger i Pyrenéerna mellan Spanien och Frankrike?','Andorra','Monaco','San Marino','Liechtenstein');
  q('geo','3',2,'Vad heter världens högsta vattenfall?','Angelfallen','Niagarafallen','Victoriafallen','Iguazúfallen');
  q('geo','3',2,'Vilken öken är världens torraste?','Atacamaöknen','Sahara','Gobiöknen','Kalahariöknen');
  q('geo','3',2,'Vilka berg brukar räknas som gränsen mellan Europa och Asien?','Uralbergen','Alperna','Karpaterna','Pyrenéerna');
  q('geo','23',1,'Vilken lång bergskedja finns i Sydamerika?','Anderna','Himalaya','Alperna','Klippiga bergen');
  q('geo','23',1,'I vilken bergskedja ligger Mount Everest?','Himalaya','Anderna','Alperna','Atlasbergen');
  q('geo','3',2,'Vilken huvudstad är världens nordligaste?','Reykjavik','Oslo','Helsingfors','Stockholm');
  q('geo','3',2,'Vilket hav ligger mellan Europa och Afrika?','Medelhavet','Röda havet','Svarta havet','Kaspiska havet');
  q('geo','23',2,'Vilket hav skiljer Afrika från Arabiska halvön?','Röda havet','Svarta havet','Döda havet','Medelhavet');
  q('geo','3',2,'Vilken sjö är så salt att man flyter av sig själv?','Döda havet','Bajkalsjön','Vänern','Victoriasjön');
  q('geo','23',1,'Vilket land är världens största ö-nation med över 17 000 öar?','Indonesien','Japan','Filippinerna','Grekland');
  q('geo','01',1,'Vad kallas den kalla, isiga platsen allra längst upp på jordklotet?','Nordpolen','Sydpolen','Ekvatorn','Sahara');
  q('geo','23',2,'Mount Everest ligger på gränsen mellan Kina och vilket land?','Nepal','Indien','Bhutan','Pakistan');
  q('geo','23',2,'Vad heter kanalen som förbinder Atlanten och Stilla havet?','Panamakanalen','Suezkanalen','Kielkanalen','Göta kanal');
  q('geo','23',2,'Vad heter kanalen som förbinder Medelhavet och Röda havet?','Suezkanalen','Panamakanalen','Korintkanalen','Göta kanal');
  q('geo','3',2,'Vilket land har flest tidszoner på sitt fastland?','Ryssland','USA','Kina','Kanada');
  q('geo','123',1,'Vilken är världens befolkningsrikaste världsdel?','Asien','Afrika','Europa','Nordamerika');
  q('geo','3',3,'Vilket är Europas största land helt inom Europa, till ytan?','Ukraina','Frankrike','Spanien','Sverige');
  q('geo','12',1,'Vad heter havet mellan Sverige och Danmark i väster, norr om Öresund?','Kattegatt','Östersjön','Bottenhavet','Nordsjön');
  tf('geo','123',1,'Australien ligger på södra halvklotet.',true);
  tf('geo','123',1,'Sahara är världens största öken om man räknar med is-öknar.',false);
  tf('geo','23',2,'Ekvatorn går genom Brasilien.',true);
  tf('geo','12',1,'Sverige är större än Norge till ytan.',true);
  tf('geo','3',2,'Kanada har längre kustlinje än något annat land.',true);
})();
