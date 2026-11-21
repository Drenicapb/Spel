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

Cirka 7 900 frågor i 18 kategorier och 4 åldersgrupper – med kartfrågor (sätt ut nålen), gissa personen med ledtrådar, närmast rätt svar, flaggor som blir skarpare och sortera i rätt ordning – cirka 2 200 kända Spotify-låtar till musikfrågorna, jokrar, dubbla poäng, lagläge, nivåer för barn, statistik, egna quiz och ett enspelarläge. Mobilerna behöver inte vara på samma nät som storskärmen. Android-app: **https://drenicapb.github.io/Spel/app/QuizChampions.apk**. Se `quizchampions/LASMIG.md`.

Mappen `quizchampions/` byggs separat (inte från `Privat`) – låt den vara kvar när Bucinca-filerna kopieras hit.

## Mëso Shqip

Lär dig kosovoalbanska – fraser för vardagen, flashcards, quiz och uttal, med intro-bild och lekfullt tema: **https://drenicapb.github.io/Spel/shqip/**

Android-app: **https://drenicapb.github.io/Spel/app/Shqip.apk** (visar sidan ovan; koden finns i `Privat`, gren `shqip`). Innehållet ligger i `shqip/data.js`.
Ny version: `python3 shqip/bump.py 1.0.1 "Vad som är nytt"` och pusha – appen visar då *🆕 Ny version – Uppdatera*.

## Eltons Planet

Gudasimulator – forma världen, sätt ut människor och djur och se riken växa, bygga slott och kriga: **https://drenicapb.github.io/Spel/eltonsplanet/**

På iPhone/iPad: öppna länken i Safari → Dela → *Lägg till på hemskärmen* (Android: Chrome → ⋮ → *Lägg till på startskärmen*) så startar det i helskärm med egen ikon och fungerar offline. Spelet sparas automatiskt i webbläsaren på enheten.

Mappen `eltonsplanet/` byggs separat (inte från `Privat`) – låt den vara kvar när Bucinca-filerna kopieras hit. Ny version: ändra `eltonsplanet/index.html` och höj `CACHE` i `eltonsplanet/sw.js`.

## Hannis

Färgpussel med bilar: kör ut bilarna ur den fullproppade parkeringen och fyll dem med Hannisar i samma färg: **https://drenicapb.github.io/Spel/hannis/**

Tryck på en bil så kör den åt pilens håll – står något i vägen studsar den tillbaka. Bilar som kommer ut parkerar på stationen. Hannisarna snurrar runt i rondellen, som matas från två vägar, och kliver på bilen med sin färg när den står vid hållplatsen. ⏩ snabbspolar (1×, 2×, 3×). Blir alla platser fulla och ingen kan kliva på är det slut. Svarta ❓-bilar visar sin färg när vägen framför dem är fri, garagen släpper ut fler bilar och var femte nivå är svår. Hjälpmedel: *Ny plats*, *Blanda* och *VIP* (köps med mynt man får för varje klarad nivå). Alla nivåer skapas så att de går att lösa.

På iPhone/iPad: öppna länken i Safari → Dela → *Lägg till på hemskärmen* så startar det i helskärm och fungerar offline. Nivå och mynt sparas i webbläsaren.

Mappen `hannis/` byggs separat (inte från `Privat`) – låt den vara kvar när Bucinca-filerna kopieras hit. Ny version: ändra `hannis/game.js` och höj `CACHE` i `hannis/sw.js`.
