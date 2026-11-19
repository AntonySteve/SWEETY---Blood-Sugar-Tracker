# 🍬 Sweety – Blood Glucose Tracker

A small web app where a diabetes patient records up to 4 blood glucose readings a day
and views daily, month-to-date and previous-month reports.

**Stack:** React (Vite) · Node.js + Express · PostgreSQL · JWT auth · bcrypt password hashing

## Project structure

```
sweety/
├── server/            Express API
│   ├── schema.sql     Database tables
│   ├── src/           app, routes, middleware, utils, seed + init scripts
│   └── tests/         Jest unit tests
└── client/            React app (Vite)
```

## 1. Install

Requirements: Node.js 18+ and PostgreSQL.

```bash
cd server && npm install
cd ../client && npm install
```

## 2. Set up the database

Create an empty database (example uses `psql`):

```bash
psql -U postgres -c "CREATE DATABASE sweety;"
```

Create the env file and edit `DATABASE_URL` / `JWT_SECRET` if needed:

```bash
cd server
cp .env.example .env
```

Create the tables and add demo data:

```bash
npm run db:init     # creates the users and readings tables
npm run seed        # creates demo user + about 2 months of sample readings
```

Demo login: **demo@sweety.com / demo1234**

## 3. Run

Server (http://localhost:5000):

```bash
cd server
npm run dev       # or: npm start
```

Client (http://localhost:5173) – in a second terminal:

```bash
cd client
npm run dev
```

The client forwards `/api` calls to the server (see `client/vite.config.js`).

## 4. Run tests

```bash
cd server
npm test
```

The tests cover the reading validation rules and the report date ranges. They do not need a database.

## API summary

All routes except `/auth/*` need the header `Authorization: Bearer <token>`.

| Method | Route | Purpose |
|--------|-------|---------|
| POST | /api/auth/register | Sign up (name, email, password) |
| POST | /api/auth/login | Log in, returns a token |
| GET | /api/readings?date=YYYY-MM-DD | List my readings (date optional) |
| POST | /api/readings | Add a reading `{ date, slot, value }` |
| PUT | /api/readings/:id | Edit a reading |
| DELETE | /api/readings/:id | Delete a reading |
| GET | /api/reports?date=YYYY-MM-DD | Daily, month-to-date and previous-month reports |

Slots: `morning`, `after_breakfast`, `after_lunch`, `after_dinner`.

## Validation rules (checked on the server, shown in the UI)

- Value required → "Please enter a glucose value."
- Whole number 40–600 → "Value must be between 40 and 600 mg/dl."
- One reading per slot per day → "You already have an After lunch reading for this date."
- Max 4 readings per day → "You can add only 4 readings per day."
- No future dates → "Date cannot be in the future."

The database also has `CHECK` and `UNIQUE (user_id, reading_date, slot)` constraints as a safety net.

## Notes

**Assumptions**
- I used `bcryptjs` (pure JavaScript bcrypt) because it installs without native build tools.
- A day with 4 readings shows the "max 4 per day" message first (every slot is already used, so the "duplicate slot" message would never appear otherwise).
- "Previous month" means the whole calendar month before the selected date's month.
- Average is rounded to 1 decimal in SQL (`ROUND(AVG(value), 1)`).
- "Today" is based on the server clock (and the browser clock for the date picker's `max`).
- Reports allow any valid past date; only adding/editing readings blocks future dates.
- The login token is kept in `localStorage` and lasts 7 days.

**What I would improve with more time**
- More tests: API tests with supertest and a test database, and React Testing Library tests for the form.
- Pagination for `GET /readings`, and a chart of readings over the month.
- Rate limiting on login, and refresh tokens instead of a long-lived token.
- Docker Compose for PostgreSQL + app, and a proper migration tool.
- Handle time zones per user instead of using the server's date.

## Git tip

Commit in small steps, for example: "Add database schema", "Add auth routes", "Add readings routes",
"Add reports route", "Add React login page", "Add reading form", "Add reports UI", "Add tests", "Add README".
