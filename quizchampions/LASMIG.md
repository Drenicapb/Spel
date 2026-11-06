# 🏆 Quiz Champions

Ett Kahoot-likt quiz för hela familjen. En skärm (TV, dator eller surfplatta) är spelplanen. Alla andra går med från mobilen med en PIN-kod eller QR-kod, direkt i webbläsaren och utan att installera något.

## Lägg upp spelet (en gång)
Mobilerna måste kunna öppna sidan via en webbadress, så mappen behöver ligga på en webbserver. Enklast är GitHub Pages:

1. Lägg mappen `quizchampions/` i ett GitHub-repo, till exempel `Spel`.
2. I repot: **Settings → Pages → Deploy from a branch → main / (root)**.
3. Efter någon minut finns spelet på `https://<användarnamn>.github.io/<repo>/quizchampions/`.

## Spela
1. Öppna adressen på den stora skärmen och tryck **Starta ett quiz**.
2. Välj ålder, kategorier och antal frågor, eller ta ett **färdigt quiz**.
3. Mobilerna skannar QR-koden (eller går till adressen och skriver in PIN-koden), väljer namn och figur.
4. Tryck **Starta quizet ▶**. Snabbt rätt svar ger mest poäng (500–1 000 p), och flera rätt i rad ger bonus 🔥.

Inställningar i lobbyn:
- **Visa svarstext på mobilerna**: av = bara färger och former på mobilen, som i Kahoot.
- **Läs upp frågorna**: för barn som inte läser ännu. Svaren läses upp med färg ("Röd: Banan").
- **Auto: gå vidare när alla har svarat** (på som standard): när alla har svarat – eller tiden är slut – visas rätt svar, sedan topplistan och nästa fråga, var och en i 5 sekunder. Knappen **⏩ Auto på / ⏸ Auto av** uppe till höger pausar under spelet, och du kan alltid trycka på knappen för att gå vidare direkt.

## Spela själv (enspelarläge)
Tryck **Spela själv** på startsidan. Välj quiz på samma sätt som ovan – frågorna och svarsknapparna visas på samma skärm, så det räcker med en mobil eller surfplatta. Snabba rätt svar och svitar ger mer poäng, rätt svar visas efter varje fråga och spelet går vidare av sig självt (tryck **⏸ Vänta** för att stanna kvar). Efteråt ser du antal rätt, poäng, bästa svit och rätt svar på det du missade. Ditt rekord sparas per quiz. Musikfrågorna spelas i Spotifys spelare på samma skärm.

## Android-appen
Ladda ner **QuizChampions.apk** från https://drenicapb.github.io/Spel/app/QuizChampions.apk (eller tryck *Ladda ner Android-appen* längst ner på startsidan i mobilens webbläsare) och installera. Appen är samma spel utan adressfält – webbadressen syns aldrig – och får alltid de senaste frågorna automatiskt. I appen läses frågorna upp på svenska, skärmen hålls tänd och Spotify-länkar öppnas i Spotify-appen.

## Webbadressen
I lobbyn visas bara PIN-koden och QR-koden; adressen syns först om man trycker *Visa webbadressen*. Den som har appen öppnar den och skriver PIN-koden, alla andra skannar QR-koden med kameran.

## Musikfrågor (Spotify)
Det finns två sätt att spela musiken:
- **På den här skärmen**: Spotifys spelare bäddas in på storskärmen, med titel och omslag suddade tills svaret visas. Utan inloggning spelas ett klipp på 30 sekunder, vilket räcker för en fråga. Om ingen musik hörs, tryck på ▶ i spelaren eller på *Öppna i Spotify*.
- **I Spotify-appen på en mobil (DJ-läge)**: skanna DJ-QR-koden i lobbyn med mobilen som har Spotify. Vid varje musikfråga visas en knapp där som spelar låten i Spotify-appen, gärna kopplad till en högtalare. DJ-mobilen tävlar inte.

## Lägg till egna frågor och låtar
- **I appen**: *Mina quiz & låtar* på startsidan. Där kan du skapa egna quiz med 4 alternativ, sant/falskt eller musikfrågor (klistra in Spotify-länken). Låtar under **Mina låtar** blandas automatiskt in i musikfrågorna. Allt sparas i webbläsaren och kan exporteras och importeras mellan enheter.
- **I frågebanken** (`bank.js`): lägg till rader som
  `q('djur','01',1,'Vilket djur …?','Rätt svar','Fel 1','Fel 2','Fel 3');`
  Åldrar: `0` = 6–9 år, `1` = 10–12, `2` = 13–17, `3` = vuxen. Svårighet 1–3. Det första svaret är alltid det rätta, appen blandar ordningen.
  Låtar läggs i `QK_SONGS` med Spotify-låtens ID (delen efter `/track/` i länken).

## Bra att veta
- Spelet behöver internet. Mobilerna hittar storskärmen via PeerJS gratisserver och pratar sedan direkt med den (WebRTC). Det fungerar både på samma wifi och över mobilnätet.
- Stäng inte fliken på storskärmen under spelets gång. Om en mobil tappar anslutningen eller laddar om sidan kommer den tillbaka automatiskt med sina poäng.
- Spelaren som skapar quizet behöver inget konto någonstans.

Loggan och app-ikonen finns i `img/`. På mobilen kan sidan läggas till på hemskärmen (Dela → *Lägg till på hemskärmen*) och får då ikonen.

Innehåll: cirka 3 680 frågor i 13 kategorier och 4 åldersgrupper, plus 281 Spotify-låtar. Appen minns vilka frågor ni redan har fått och tar nya först, och blandar olika sorters frågor så att samma typ inte kommer många gånger i rad.
