/* Quiz Champions – "Sortera i rätt ordning"
 * ord(åldrar, svårighet, fråga, [rätt ordning, först → sist], [etikett först, etikett sist])
 * Spelarna trycker på alternativen i den ordning de tror är rätt. Alla rätt = fullt (snabbt ger mest),
 * annars poäng för varje alternativ på rätt plats. */
(function () {
  const B = window.QK_BANK;
  const ord = (a, d, q, items, lab) => B.push({ c: 'ordning', a, d, g: 'ord', type: 'order', q, items, lab });
  const T = ['Tidigast', 'Senast'], S = ['Minst', 'Störst'], L = ['Lägst', 'Högst'], K = ['Kortast', 'Längst'], NS = ['Norr', 'Söder'], VO = ['Väster', 'Öster'];

  // ── Barn ──
  ord('0', 1, 'Sortera djuren efter storlek – minst först', ['Myra', 'Mus', 'Katt', 'Häst'], S);
  ord('01', 1, 'Vem väger minst? Sortera från lättast till tyngst', ['Kolibri', 'Höna', 'Hund', 'Isbjörn'], ['Lättast', 'Tyngst']);
  ord('0', 1, 'Sortera från långsammast till snabbast', ['Snigel', 'Människa', 'Häst', 'Gepard'], ['Långsammast', 'Snabbast']);
  ord('01', 1, 'Hur många ben har djuren? Färst ben först', ['Orm', 'Fågel', 'Hund', 'Spindel'], ['Färst', 'Flest']);
  ord('01', 1, 'Från ägg till groda – sortera i rätt ordning', ['Grodrom (ägg)', 'Grodyngel', 'Grodyngel med ben', 'Groda'], ['Först', 'Sist']);
  ord('01', 1, 'Hur blir en fjäril till? Sortera i rätt ordning', ['Ägg', 'Larv', 'Puppa', 'Fjäril'], ['Först', 'Sist']);
  ord('0', 1, 'Sortera dagen – vad kommer först?', ['Morgon', 'Förmiddag', 'Eftermiddag', 'Kväll'], ['Först', 'Sist']);
  ord('0', 1, 'Sortera årstiderna – börja med våren', ['Vår', 'Sommar', 'Höst', 'Vinter'], ['Först', 'Sist']);
  ord('0', 1, 'Sortera talen – minst först', ['3', '8', '12', '20'], S);
  ord('01', 1, 'Sortera månaderna i rätt ordning', ['Januari', 'April', 'Augusti', 'November'], ['Först', 'Sist']);
  ord('0', 1, 'Sortera frukterna efter storlek – minst först', ['Blåbär', 'Plommon', 'Apelsin', 'Vattenmelon'], S);
  ord('0', 1, 'Sortera mynten – minst värt först', ['1 krona', '2 kronor', '5 kronor', '10 kronor'], ['Minst värt', 'Mest värt']);
  ord('0', 1, 'Sortera orden – kortast först', ['Ö', 'Hus', 'Banan', 'Elefant'], K);
  ord('01', 1, 'Sortera fordonen – långsammast först', ['Gå', 'Cykla', 'Bil på motorväg', 'Flygplan'], ['Långsammast', 'Snabbast']);
  ord('012', 1, 'Sortera från kallast till varmast', ['Frysen', 'Vatten som fryser till is', 'Din kropp', 'Kokande vatten'], ['Kallast', 'Varmast']);
  ord('01', 1, 'Sortera längdmåtten – kortast först', ['Millimeter', 'Centimeter', 'Meter', 'Kilometer'], K);
  ord('0', 1, 'Sortera tiden – kortast först', ['Sekund', 'Timme', 'Vecka', 'År'], K);
  ord('012', 1, 'Sortera planeterna – närmast solen först', ['Merkurius', 'Venus', 'Jorden', 'Mars'], ['Närmast solen', 'Längst bort']);
  ord('12', 2, 'Sortera i bokstavsordning (svenska alfabetet)', ['Zebra', 'Ål', 'Ärta', 'Öra'], ['A', 'Ö']);
  ord('12', 2, 'Sortera i bokstavsordning', ['Kaka', 'Kamel', 'Kanin', 'Katt'], ['A', 'Ö']);
  ord('123', 1, 'Sortera efter storlek – minst först', ['Månen', 'Jorden', 'Jupiter', 'Solen'], S);

  // ── Historia & uppfinningar ──
  ord('123', 1, 'Sortera i tidsordning – tidigast först', ['Pyramiderna i Giza byggs', 'Västromerska riket faller', 'Columbus når Amerika', 'Första månlandningen'], T);
  ord('23', 2, 'Sortera Sveriges historia i tidsordning', ['Vikingatiden börjar', 'Gustav Vasa blir kung', 'Kvinnor röstar för första gången i riksdagsval', 'Sverige går med i EU'], T);
  ord('23', 2, 'Vilken uppfinning kom först? Sortera i tidsordning', ['Gutenbergs boktryckarkonst', 'James Watts ångmaskin', 'Telefonen', 'World Wide Web'], T);
  ord('123', 1, 'Sortera uppfinningarna – äldst först', ['Glödlampan', 'Bröderna Wrights flygplan', 'Tv:n', 'iPhone'], ['Äldst', 'Nyast']);
  ord('23', 1, 'Sortera händelserna i tidsordning', ['Första världskriget börjar', 'Andra världskriget börjar', 'Berlinmuren faller', '11 september-attackerna i USA'], T);
  ord('23', 2, 'Sortera från längst tillbaka i tiden', ['Dinosaurierna dör ut', 'De första moderna människorna', 'Människan börjar odla jorden', 'Skriften uppfinns'], ['Längst tillbaka', 'Närmast i tid']);
  ord('3', 3, 'Rymdkapplöpningen – sortera i tidsordning', ['Sputnik, första satelliten', 'Jurij Gagarin, första människan i rymden', 'Neil Armstrong på månen', 'Första besättningen på rymdstationen ISS'], T);
  ord('3', 2, 'Sortera kungarna efter när de blev kung – tidigast först', ['Gustav Vasa', 'Gustav II Adolf', 'Karl XII', 'Carl XVI Gustaf'], T);
  ord('23', 2, 'Sortera personerna efter när de föddes – tidigast först', ['Platon', 'Leonardo da Vinci', 'Isaac Newton', 'Albert Einstein'], T);
  ord('23', 2, 'Sortera i tidsordning – äldst först', ['Telegrafen', 'Telefonen', 'Radion', 'Tv:n'], ['Äldst', 'Nyast']);
  ord('3', 3, 'Sortera Sveriges historia i tidsordning', ['Stockholms blodbad', 'Regalskeppet Vasa sjunker', 'ABBA bildas', 'Öresundsbron öppnar'], T);

  // ── Geografi ──
  ord('123', 2, 'Sortera länderna efter yta – minst först', ['Danmark', 'Sverige', 'Frankrike', 'Ryssland'], S);
  ord('123', 1, 'Sortera länderna efter antal invånare – färst först', ['Island', 'Sverige', 'Tyskland', 'Indien'], ['Färst', 'Flest']);
  ord('23', 2, 'Sortera länderna efter antal invånare – färst först', ['Norge', 'Sverige', 'Spanien', 'USA'], ['Färst', 'Flest']);
  ord('23', 2, 'Sortera floderna efter längd – kortast först', ['Themsen', 'Rhen', 'Donau', 'Nilen'], K);
  ord('123', 2, 'Sortera bergen efter höjd – lägst först', ['Kebnekaise', 'Mont Blanc', 'Kilimanjaro', 'Mount Everest'], L);
  ord('23', 2, 'Sortera världsdelarna efter yta – minst först', ['Oceanien', 'Europa', 'Afrika', 'Asien'], S);
  ord('23', 2, 'Sortera haven efter storlek – minst först', ['Norra ishavet', 'Indiska oceanen', 'Atlanten', 'Stilla havet'], S);
  ord('123', 1, 'Sortera städerna från norr till söder', ['Kiruna', 'Östersund', 'Stockholm', 'Malmö'], NS);
  ord('123', 2, 'Sortera landskapen från norr till söder', ['Lappland', 'Jämtland', 'Värmland', 'Skåne'], NS);
  ord('123', 2, 'Sortera städerna efter antal invånare – färst först', ['Umeå', 'Uppsala', 'Göteborg', 'Stockholm'], ['Färst', 'Flest']);
  ord('23', 3, 'Sortera sjöarna efter yta – minst först', ['Siljan', 'Storsjön', 'Vättern', 'Vänern'], S);
  ord('23', 2, 'Sortera huvudstäderna från norr till söder', ['Oslo', 'Berlin', 'Rom', 'Valletta'], NS);
  ord('23', 2, 'Sortera huvudstäderna från väster till öster', ['Lissabon', 'Paris', 'Warszawa', 'Moskva'], VO);
  ord('123', 2, 'Sortera efter avstånd från Stockholm – närmast först', ['Uppsala', 'Göteborg', 'London', 'New York'], ['Närmast', 'Längst bort']);
  ord('23', 2, 'Sortera byggnaderna efter höjd – lägst först', ['Turning Torso', 'Eiffeltornet', 'Empire State Building', 'Burj Khalifa'], L);

  // ── Natur & vetenskap ──
  ord('23', 2, 'Sortera efter hur länge de kan leva – kortast först', ['Hamster', 'Hund', 'Människa', 'Grönlandshaj'], ['Kortast liv', 'Längst liv']);
  ord('123', 2, 'Sortera djuren efter vikt – lättast först', ['Giraff', 'Afrikansk elefant', 'Valhaj', 'Blåval'], ['Lättast', 'Tyngst']);
  ord('123', 2, 'Sortera planeterna efter storlek – minst först', ['Merkurius', 'Mars', 'Jorden', 'Jupiter'], S);
  ord('123', 2, 'Sortera planeterna – närmast solen först', ['Jupiter', 'Saturnus', 'Uranus', 'Neptunus'], ['Närmast solen', 'Längst bort']);
  ord('3', 3, 'Sortera grundämnena efter atomnummer – lägst först', ['Väte', 'Kol', 'Syre', 'Järn'], L);
  ord('3', 2, 'Sortera efter fart – långsammast först', ['Gepard', 'Ljudet i luft', 'Rymdstationen ISS', 'Ljuset'], ['Långsammast', 'Snabbast']);
  ord('23', 3, 'Sortera skelettets ben efter längd – kortast först', ['Stigbygeln i örat', 'Ett fingerben', 'Överarmsbenet', 'Lårbenet'], K);

  // ── Matte & teknik ──
  ord('123', 1, 'Sortera datamängderna – minst först', ['Byte', 'Kilobyte', 'Megabyte', 'Gigabyte'], S);
  ord('23', 2, 'Sortera talen – minst först', ['0,5', '¾', '1', '1,25'], S);
  ord('23', 2, 'Sortera talen – minst först', ['−5', '0', '2³', '10'], S);
  ord('23', 2, 'Sortera de romerska siffrorna – minst först', ['IV', 'IX', 'XL', 'C'], S);
  ord('23', 2, 'Sortera lagringen i tidsordning – äldst först', ['Diskett', 'CD-skiva', 'USB-minne', 'Molnlagring'], ['Äldst', 'Nyast']);
  ord('23', 2, 'Sortera apparna efter när de startade – äldst först', ['Facebook', 'YouTube', 'Instagram', 'TikTok'], ['Äldst', 'Nyast']);
  ord('23', 2, 'Sortera spelkonsolerna – äldst först', ['Nintendo NES', 'Sony PlayStation', 'Nintendo Wii', 'Nintendo Switch'], ['Äldst', 'Nyast']);

  // ── Film, musik, sport, mat ──
  ord('123', 2, 'Sortera Disneyfilmerna – äldst först', ['Snövit och de sju dvärgarna', 'Lejonkungen', 'Frost', 'Encanto'], ['Äldst', 'Nyast']);
  ord('123', 2, 'Sortera Pixarfilmerna – äldst först', ['Toy Story', 'Hitta Nemo', 'Bilar', 'Insidan ut'], ['Äldst', 'Nyast']);
  ord('123', 2, 'Sortera Harry Potter-filmerna i rätt ordning', ['De vises sten', 'Hemligheternas kammare', 'Fången från Azkaban', 'Den flammande bägaren'], ['Först', 'Sist']);
  ord('3', 3, 'Sortera Astrid Lindgrens böcker – äldst först', ['Pippi Långstrump', 'Mio, min Mio', 'Bröderna Lejonhjärta', 'Ronja Rövardotter'], ['Äldst', 'Nyast']);
  ord('23', 2, 'Sortera musikhändelserna i tidsordning', ['ABBA vinner Eurovision med Waterloo', 'Michael Jackson släpper Thriller', 'Spotify lanseras', 'Loreen vinner Eurovision med Tattoo'], T);
  ord('3', 2, 'Sortera musikhändelserna i tidsordning', ['Elvis Presley slår igenom', 'The Beatles släpper sin första singel', 'ABBA vinner Eurovision', 'Spice Girls släpper Wannabe'], T);
  ord('123', 2, 'Sortera bollarna efter storlek – minst först', ['Pingisboll', 'Golfboll', 'Tennisboll', 'Fotboll'], S);
  ord('123', 2, 'Sortera sporterna efter antal spelare per lag på planen – färst först', ['Tennis (singel)', 'Basket', 'Ishockey', 'Fotboll'], ['Färst', 'Flest']);
  ord('01', 1, 'Sortera löpdistanserna – kortast först', ['100 meter', '400 meter', '1 500 meter', 'Maraton'], K);
  ord('3', 3, 'Sortera sommar-OS efter när de hölls – tidigast först', ['Stockholm', 'Moskva', 'Sydney', 'Paris'], T);
  ord('3', 3, 'Sortera fotbolls-VM i tidsordning', ['Brasilien vinner VM i Sverige', 'Argentina vinner med Maradona', 'Frankrike vinner på hemmaplan', 'Argentina vinner med Messi'], T);
  ord('23', 2, 'Sortera efter kalorier per 100 gram – minst först', ['Gurka', 'Äpple', 'Bröd', 'Smör'], ['Minst', 'Mest']);
  ord('23', 2, 'Sortera chilin efter styrka – mildast först', ['Paprika', 'Jalapeño', 'Habanero', 'Carolina Reaper'], ['Mildast', 'Starkast']);
})();
