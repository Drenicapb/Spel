# 🎉 Quizkalas

Ett Kahoot-likt quiz för hela familjen. En skärm (TV, dator eller surfplatta) är spelplanen. Alla andra går med från mobilen med en PIN-kod eller QR-kod, direkt i webbläsaren och utan att installera något.

## Adress
Spelet ligger på **https://drpatri-ai.github.io/Spel/quizkalas/** (GitHub Pages från repot `drpatri-ai/Spel`).
Vill du lägga det någon annanstans fungerar vilken webbserver som helst – mappen är helt fristående.

## Spela
1. Öppna adressen på den stora skärmen och tryck **Starta ett quiz**.
2. Välj ålder, kategorier och antal frågor, eller ta ett **färdigt quiz**.
3. Mobilerna skannar QR-koden (eller går till adressen och skriver in PIN-koden), väljer namn och figur.
4. Tryck **Starta quizet ▶**. Snabbt rätt svar ger mest poäng (500–1 000 p), och flera rätt i rad ger bonus 🔥.

Inställningar i lobbyn:
- **Visa svarstext på mobilerna**: av = bara färger och former på mobilen, som i Kahoot.
- **Läs upp frågorna**: för barn som inte läser ännu. Svaren läses upp med färg ("Röd: Banan").
- **Gå vidare automatiskt**: spelet bläddrar själv mellan frågorna.

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

Innehåll: 365 frågor i 13 kategorier och 4 åldersgrupper, plus 23 Spotify-låtar.
