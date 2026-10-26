# Nyponet

Webbplats för Kulturpriset Nyponet, Lars Winnerbäcks Stiftelse. Ersätter på sikt [nyponpriset.se](https://www.nyponpriset.se/).

Sajten är fristående: alla bilder, dokument och typsnitt ligger i det här repot. Den hämtar ingenting från gamla nyponpriset.se, Google eller andra tjänster.

## Ändra innehåll

Allt innehåll ligger i vanliga textfiler i `src/`. Det går att ändra direkt på github.com: öppna filen, klicka på pennan, ändra och spara (Commit changes). Sajten byggs och publiceras automatiskt efter ungefär en minut.

| Vad | Fil |
| --- | --- |
| Nästa prisutdelning (remsa och kalender) | `src/_data/prisutdelning.yml` |
| Stipendiater och motiveringar | `src/_data/stipendiater.yml` |
| Inlägg | `src/inlagg/` (en fil per inlägg) |
| Hantverkare och nypon | `src/_data/hantverkare.yml` |
| Nyponet i media | `src/_data/media.yml` |
| Styrelsen | `src/_data/styrelsen.yml` |
| Övriga texter | `src/_data/texter.yml` |
| Adress och sökmotorer | `src/_data/site.yml` |

Varje datafil har en kort förklaring överst.

**Ny stipendiat:** lägg bilden i `src/bilder/stipendiater/` (till exempel `2026.jpg`), kopiera ett block i `stipendiater.yml`, klistra in det överst och ändra. Den översta stipendiaten visas stort på sidan, och årtalsraden överst uppdateras av sig själv.

**Nästa prisutdelning:** fyll i datum, tid och plats i `prisutdelning.yml`. Då visas en röd remsa överst med en knapp för att lägga in det i kalendern. Remsan försvinner av sig själv dagen efter.

**Glimten i årtalsraden** (foto och nypon när man pekar på ett år) hämtar bilderna från stipendiaterna och hantverkarna och sköter sig själv.

**Nytt inlägg:** skapa en ny fil i `src/inlagg/` som heter till exempel `2026-10-10-rubrik.md`:

```markdown
---
rubrik: Stipendieutdelning 2026
date: 2026-08-20
---

Första stycket.

Andra stycket. Länkar skrivs [så här](https://exempel.se).
```

**Bilder:** håll dem under 1600 pixlar på längsta sidan.

## Byta till riktiga domänen

1. Ändra `url` i `src/_data/site.yml` till `https://www.nyponpriset.se/` och `synlig_i_sok` till `true`.
2. På GitHub: Settings → Pages → Custom domain, skriv `www.nyponpriset.se` och kryssa i Enforce HTTPS.
3. Hos den som har hand om domänen: peka `www` med en CNAME-post till `intealma.github.io`. Gör den nakna domänen till A-poster mot GitHub Pages (185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153).

Sökvägar, delningsbild och sökmotorinställningar följer med automatiskt från `site.yml`.

## Säkerhet

Sajten är statisk HTML. Den har ingen databas, ingen inloggning, ingen PHP och inga tillägg som behöver uppdateras. En säkerhetsregel (Content Security Policy) gör att sidan bara får ladda filer från sin egen adress. Den kör inga skript utifrån och hämtar inga typsnitt från Google.

## Köra lokalt (valfritt)

```bash
npm install
npm start
```

Sidan öppnas på http://localhost:8080/nyponpriset/.

Typsnittet är Libre Franklin (SIL Open Font License).
