# CRM – asiakasrekisterijärjestelmä

## Projektin kuvaus

CRM-sovellus asiakastietojen hallintaan. Käyttöliittymä on toteutettu Reactilla, TypeScriptillä ja Vitellä. Express-pohjainen taustapalvelin tarjoaa API-rajapinnan, ja tiedot tallennetaan PostgreSQL-tietokantaan Prisma ORM:n avulla.

Kirjautuminen ja istuntojen hallinta on toteutettu Better Authilla. Aiempi SQLite-tietokanta ja oma JWT-pohjainen kirjautumisratkaisu on korvattu PostgreSQL:llä ja Better Authilla.

## Teknologiat

| Teknologia | Käyttötarkoitus |
|------------|----------------|
| React | Käyttöliittymä |
| TypeScript | Tyypitetty sovelluskoodi |
| Vite | Frontendin kehityspalvelin ja tuotantokokoaminen |
| React Router | Sivujen reititys |
| Tailwind CSS | Käyttöliittymän tyylit |
| Express | Backend ja API-reitit |
| Better Auth | Kirjautuminen, uloskirjautuminen ja istuntojen hallinta |
| Prisma ORM | Tietokantakyselyt ja tietomalli |
| PostgreSQL / Prisma Postgres | Pysyvä tietojen tallennus |
| Vercel | Sovelluksen julkaisu |

Tarkat pakettiversiot löytyvät frontendin ja backendin `package.json`-tiedostoista.

## Projektin rakenne

```text
frontend/
├── src/
│   ├── components/          # Yhteiset käyttöliittymäkomponentit
│   ├── features/            # Asiakashallinnan komponentit
│   ├── lib/                 # Auth-asiakkaan asetukset
│   ├── pages/               # Asiakas-, kirjautumis- ja rekisteröintisivut
│   ├── routes/              # Reititys ja suojatut sivut
│   ├── styles/              # Sovelluksen tyylit
│   ├── App.tsx
│   └── main.tsx
├── package.json
└── vite.config.ts

backend/
├── src/                     # API, autentikointi ja alustus
│   └── init-db.ts           # Ylläpitäjätilin alustaminen
└── package.json

vercel.json                  # Vercel-julkaisun asetukset
```

Tietokannan Prisma-skeema sijaitsee backendin hakemistossa.

## Kirjautuminen ja käyttöoikeudet

- Better Auth hallitsee kirjautumista ja käyttäjäistuntoja.
- Kirjautuminen vaaditaan suojattujen sivujen käyttämiseen.
- Julkinen rekisteröityminen on suljettu. Uusien käyttäjien luominen on rajattu ylläpitäjälle.
- Ylläpitäjän käyttöoikeus määritetään vertaamalla käyttäjän tunnistetta `ADMIN_USER_ID`-ympäristömuuttujaan.
- Käyttäjähallinnan `/api/users`-reitit on suojattu ylläpitäjän oikeuksilla.
- Vanhoja `/api/auth/register`- ja `/api/auth/login`-reittejä ei käytetä tässä ohjeessa: autentikointi tapahtuu Better Authin kautta.

### Better Authin reittejä

| Metodi | Polku | Kuvaus |
|--------|-------|--------|
| `GET` | `/api/auth/get-session` | Nykyisen istunnon tarkistaminen |
| `POST` | `/api/auth/sign-out` | Uloskirjautuminen |
| `POST` | `/api/auth/sign-up/email` | Käyttäjän luominen; käyttö rajattu ylläpitäjälle |

## Asiakkaiden API

Paikallinen backend: `http://localhost:3001`.

| Metodi | Polku | Kuvaus |
|--------|-------|--------|
| `GET` | `/api/customers` | Asiakkaiden hakeminen |
| `POST` | `/api/customers` | Uuden asiakkaan luominen |
| `PUT` | `/api/customers/:id` | Asiakkaan päivittäminen |
| `DELETE` | `/api/customers/:id` | Asiakkaan poistaminen |

Käyttöliittymä tukee asiakkaiden tarkastelua ja lisäämistä. Asiakkaiden muokkaamisen ja poistamisen API-reitit on kuvattu yllä; niiden käyttöliittymätoteutus ei kuulu tähän toimintokuvaukseen.

## Ympäristömuuttujat

Määritä tarvittavat muuttujat backendin paikalliseen ympäristöön ja tuotannossa Vercelin projektiasetuksiin.

| Muuttuja | Kuvaus |
|----------|--------|
| `DATABASE_URL` | PostgreSQL-tietokannan yhteysosoite |
| `BETTER_AUTH_SECRET` | Better Authin salainen avain |
| `BETTER_AUTH_URL` | Autentikointipalvelun perusosoite |
| `FRONTEND_URL` | Frontendin sallittu alkuperäosoite |
| `ADMIN_USER_ID` | Ylläpitäjän käyttäjätunniste tietokannassa |
| `ADMIN_PASSWORD` | Alustusskriptin käyttämä ylläpitäjän salasana |

### Paikallinen kehitys

```dotenv
DATABASE_URL=POSTGRESQL_YHTEYSOSOITE
BETTER_AUTH_SECRET=OMA_PITKA_SATUNNAINEN_SALAINEN_AVAIN
BETTER_AUTH_URL=http://localhost:3001
FRONTEND_URL=http://localhost:5173
ADMIN_PASSWORD=TAYTA_VAHVA_SALASANA
```

Aseta `ADMIN_USER_ID` ylläpitäjätilin luomisen jälkeen.

### Tuotanto

Kun frontend ja API toimivat saman verkkotunnuksen alla:

```dotenv
BETTER_AUTH_URL=https://sampoexample.vercel.app
FRONTEND_URL=https://sampoexample.vercel.app
```

Better Authin `trustedOrigins`-asetuksessa pitää sallia sovelluksen käyttämät alkuperäosoitteet. Pelkkä ympäristömuuttujan lisääminen ei muuta sallittuja osoitteita, ellei palvelimen asetuskoodi käytä sitä.

## Paikallinen käynnistäminen

Suorita komennot repositorion juuresta kahdessa eri terminaalissa.

### Backend

```bash
cd backend
npm install
npm run dev
```

Backend: `http://localhost:3001`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend: `http://localhost:5173`.

Viten kehitysvälityspalvelin ohjaa `/api`-pyynnöt paikalliselle backendille.

### Ylläpitäjätilin alustaminen

Kun tietokantataulut on luotu ja tarvittavat ympäristömuuttujat asetettu, suorita backendin hakemistossa:

```bash
npm run db:init
```

Aseta tämän jälkeen luodun ylläpitäjän tunniste `ADMIN_USER_ID`-muuttujaan.

## Frontendin tuotantokokoaminen

```bash
cd frontend
npm run build
npm run preview
```

`npm run build` luo frontendin tuotantoversion `dist/`-hakemistoon. `npm run preview` on frontendin paikallinen esikatselu; backend on käynnistettävä erikseen.

## Julkaisu Vercelissä

Projektin juuressa oleva `vercel.json` sisältää julkaisun asetukset. Julkaistussa sovelluksessa frontend ja `/api`-rajapinta toimivat saman verkkotunnuksen kautta.

Määritä tuotannon ympäristömuuttujat Vercelissä. Älä lisää salasanoja, tietokantayhteyden tunnuksia tai salaisia avaimia versionhallintaan.

## Lähdekoodi

Sovelluksen lähdekoodi löytyy GitHub-repositoriosta. Lisää tähän ajantasainen linkki repositorion uudelleennimeämisen jälkeen:

`https://github.com/nei4ik/sampo-crm`
