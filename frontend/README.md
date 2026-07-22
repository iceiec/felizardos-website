# Felizardo's Event Place

Full-stack event venue management system — React frontend + Express/MongoDB backend.

---

## Project Structure

```
felizardos/
│
├── 📁 src/                          ← FRONTEND (React + Vite + TypeScript)
│   ├── app/
│   │   ├── App.tsx                  entry component
│   │   ├── routes.ts                react-router route definitions
│   │   ├── pages/
│   │   │   ├── Home.tsx             public landing page
│   │   │   ├── PavilionPage.tsx     pavilion detail page
│   │   │   ├── PoolPage.tsx         pool detail page
│   │   │   └── admin/
│   │   │       ├── AdminLayout.tsx  sidebar shell (wraps all admin pages)
│   │   │       ├── AdminLogin.tsx   login form
│   │   │       ├── Dashboard.tsx    overview + analytics
│   │   │       ├── Facilities.tsx   facility management
│   │   │       ├── Schedules.tsx    booking calendar + management
│   │   │       ├── Maintenance.tsx  maintenance task tracker
│   │   │       ├── Content.tsx      landing page editor
│   │   │       ├── Reports.tsx      printable PDF reports
│   │   │       └── Settings.tsx     venue config + account settings
│   │   ├── components/              shared UI components
│   │   ├── context/
│   │   │   └── AdminAuth.tsx        authentication context
│   │   ├── services/                API call functions (connect to backend)
│   │   ├── types/
│   │   │   └── index.ts             shared TypeScript interfaces
│   │   └── utils/
│   │       └── adminData.ts         mock data (replace with API calls)
│   └── styles/
│       ├── index.css                Tailwind base imports
│       ├── theme.css                design tokens (colors, fonts)
│       └── fonts.css                Google Fonts imports
│
├── 📁 backend/                       ← BACKEND (Express + MongoDB + TypeScript)
│   ├── .env.example                 copy to .env and fill in values
│   ├── package.json                 backend dependencies
│   ├── tsconfig.json                TypeScript config
│   ├── GUIDE.md                     ← full backend development guide
│   ├── API.md                       ← complete API reference
│   └── src/
│       ├── index.ts                 Express app entry point
│       ├── config/
│       │   ├── env.ts               validates environment variables
│       │   ├── db.ts                MongoDB connection
│       │   └── seed.ts              database seeder
│       ├── models/                  Mongoose schemas
│       ├── controllers/             request handlers
│       ├── routes/                  URL → controller mappings
│       ├── middleware/              JWT auth middleware
│       └── types/
│           └── index.ts             shared TypeScript interfaces
│
├── package.json                     frontend dependencies (Vite, React, etc.)
├── vite.config.ts                   Vite build config
├── FRONTEND.md                      ← frontend setup guide
└── README.md                        ← this file
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 · TypeScript · Vite · Tailwind CSS v4 |
| Routing | react-router v7 |
| Charts | Recharts |
| Animation | Motion (Framer) |
| Backend | Node.js · Express 4 · TypeScript |
| Database | MongoDB · Mongoose 8 |
| Auth | JWT (jsonwebtoken) · bcryptjs |
| Package manager | pnpm (frontend) · npm (backend) |

---

## Quick Start

**Terminal 1 — Frontend:**
```bash
pnpm install
pnpm dev
# → http://localhost:5173
```

**Terminal 2 — Backend:**
```bash
cd server
npm install
cp .env.example .env
# Edit .env: set MONGODB_URI and JWT_SECRET
npm run seed
npm run dev
# → http://localhost:5000
```

**Admin login:** `admin@felizardos.com` / `felizardos2025`

---

## Setup Guides

| Guide | Location | Contents |
|---|---|---|
| Frontend setup | [`FRONTEND.md`](./FRONTEND.md) | Install, run, folder guide, connecting to backend |
| Backend setup | [`backend/GUIDE.md`](./backend/GUIDE.md) | MongoDB, env vars, seeding, auth flow, adding features |
| API reference | [`backend/API.md`](./backend/API.md) | All endpoints, request/response shapes, error codes |

---

## Admin Routes

| URL | Page |
|---|---|
| `/admin` | Dashboard / Overview |
| `/admin/facilities` | Facility management |
| `/admin/schedules` | Booking calendar |
| `/admin/maintenance` | Maintenance tracker |
| `/admin/content` | Landing page editor |
| `/admin/reports` | Print PDF reports |
| `/admin/settings` | Account & venue settings |

---

## Current Data State

The frontend currently uses **localStorage mock data** (`src/app/utils/adminData.ts`).
When the backend is running, swap each page's `useState(INITIAL_*)` with API service calls.
See `FRONTEND.md → Connecting to the Backend` for the step-by-step migration.
