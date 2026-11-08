# Bucinca Spel

Webbversionen av Bucinca Spel – 4 i rad, Schack, Paf!, Block, Tornet och Backracet med Leah, Leon, Patriot och Hanna.

Nytt: **Förrådsfejden** – buda på förråd i 3D mot familjen (samma skärm, wifi eller internet) och gräv fram skatterna: https://drenicapb.github.io/Spel/forrad.html

Spela: **https://drenicapb.github.io/Spel/**

På iPhone/iPad: öppna länken i Safari → Dela → *Lägg till på hemskärmen*. Fungerar även offline efter första besöket.

Källkoden och Android-appen finns i det privata repot `Privat` (gren `spel`); den här sidan är en kopia av
`app/src/main/assets/` därifrån. Ändra där och kopiera hit – inte tvärtom.

## Illyrian Domination

Turbaserat strategispel där du tar över världen: **https://drenicapb.github.io/Spel/illyrian/**

På iPhone/iPad: öppna länken i Safari → Dela → *Lägg till på hemskärmen* så startar det i helskärm med egen ikon och fungerar offline. Spelet sparas i webbläsaren på enheten (tre sparplatser).

Mappen `illyrian/` byggs separat (inte från `Privat`) – låt den vara kvar när Bucinca-filerna kopieras hit.

**Android-app:** **https://drenicapb.github.io/Spel/app/IllyrianDomination.apk** – hela spelet ligger i appen och fungerar utan internet (utom nätverksspel). Appen hämtar nya versioner av spelet själv från `illyrian/version.json`; en ny APK behövs bara när själva appen ändras. Koden finns i det privata repot `Privat` (gren `illyrian`).

**Ny version av Illyrian Domination:** höj `VER` i uppdateringsskriptet längst ner i `illyrian/index.html` och cachenamnet i `illyrian/sw.js` (`illyrian-<version>`), kör sedan `python3 tools/make_version.py illyrian <version> "Vad som är nytt"` (skriptet ligger i Privat, gren `illyrian`) – det skriver `illyrian/version.json` med kontrollsummor så att appen bara laddar ner ändrade filer. Spelet kollar efter nya versioner vid start, när man kommer tillbaka till det och var 30:e minut och visar då *🆕 Ny version – Uppdatera*; man kan också söka själv under ☰ Meny → 🔄 Sök efter uppdatering.

## Quiz Champions

Kahoot-likt quiz för hela familjen – storskärmen visar frågorna och alla svarar med mobilen: **https://drenicapb.github.io/Spel/quizchampions/**

Cirka 7 480 frågor i 16 kategorier och 4 åldersgrupper – med kartfrågor (sätt ut nålen), gissa personen med ledtrådar och närmast rätt svar – cirka 21 600 Spotify-låtar till musikfrågorna, egna quiz och ett enspelarläge. Android-app: **https://drenicapb.github.io/Spel/app/QuizChampions.apk**. Se `quizchampions/LASMIG.md`.

Mappen `quizchampions/` byggs separat (inte från `Privat`) – låt den vara kvar när Bucinca-filerna kopieras hit.
