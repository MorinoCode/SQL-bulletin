# 📣 Bulletin – Meddelandeplattform

Bulletin är en webbaserad plattform där användare kan skapa och delta i olika kanaler, posta meddelanden och följa ämnen de är intresserade av. Systemet bygger på rättighetsstyrd åtkomst, där varje användare endast kan läsa och skriva i de kanaler de är medlemmar i.

## 🧩 Funktionalitet

- En användare kan äga noll eller flera kanaler (exempelvis "Filmälskare").
- En användare kan prenumerera på noll eller flera kanaler.
- En användare kan  posta och läsa meddelanden .
- Ett meddelande:
  - kan tillhör fler kanaler
  - skrivs av exakt en användare
- En kanal:
  - har exakt en ägare (en användare)
  - kan innehålla flera meddelanden

## 🛠️ Teknikstack

- **Frontend**: React (Vite)
- **Backend**: Node.js + Express
- **Databas**: PostgreSQL

## 🚀 Kom igång

### 1. Klona projektet

bash
git clone https://github.com/ditt-användarnamn/bulletin.git
cd bulletin

2. Backend – Installation & Start
cd backend
npm install

⚙️ Ändra .env-fil
Skapa en .env-fil i backend/ och lägg till din PostgreSQL-anslutningssträng:
DATABASE_URL=postgresql://<användarnamn>:<lösenord>@localhost:5432/bulletin


🛠️ Skapa databas och tabeller
Skapa en databas med namn bulletin.

Skapa följande tabeller i din databas:

users

channels

messages

subscriptions

message_channels

Se DBdiagram.png eller Postman-exempel för databasstruktur.


 Starta backend-server
npx nodemon server.js

3. Frontend – Installation & Start
cd frontend
npm install
npm run dev

📄 POSTMAN
Du hittar exempel på API-anrop i ExampleAnropPOSTMAN.odt.

📸 DB-diagram
Databasschemat visualiseras i filen DBdiagram.png.
