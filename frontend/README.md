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

## Admin Backend Status

The admin UI is mostly wired to the backend API and works for the following live operations:

- **Admin login:** `POST /api/auth/login` authenticates the admin and returns a JWT.
- **Facilities:** `GET /api/facilities`, `POST /api/facilities`, `PUT /api/facilities/:id`, `PATCH /api/facilities/:id/status`, `PATCH /api/facilities/:id/landing`, and `DELETE /api/facilities/:id` are used by `/admin/facilities`.
- **Schedules:** `/admin/schedules` uses `GET /api/schedules`, `POST /api/schedules`, `PUT /api/schedules/:id`, `PATCH /api/schedules/:id/status`, and `DELETE /api/schedules/:id`.
- **Maintenance:** `/admin/maintenance` uses `GET /api/maintenance`, `POST /api/maintenance`, `PUT /api/maintenance/:id`, `PATCH /api/maintenance/:id/status`, and `DELETE /api/maintenance/:id`.
- **Content management:** `/admin/content` uses public `GET /api/content` and protected `PUT /api/content`.
- **Dashboard & Reports:** `/admin` and `/admin/reports` fetch live backend data for facilities, schedules, and maintenance.
- **Settings:** `/admin/settings` now persists venue configuration and notification preferences through the backend via `GET /api/settings` and `PUT /api/settings`.

### Notes

- The backend protects admin write routes with JWT auth. The frontend stores the token in `localStorage` and attaches it automatically in `src/app/services/api.ts`.
- The admin username is `admin@felizardos.com` and password is `felizardos2025`.
- The `/admin/settings` page now saves settings to the database instead of local-only browser storage.
- `src/app/utils/adminData.ts` now exports live default admin and site content values used as initial fallbacks when the backend is unavailable.
- Most admin pages now use backend services when `VITE_API_URL` is configured.

For full backend docs, see `backend/API.md`.

---

## Current Data State

The frontend currently uses **localStorage mock data** (`src/app/utils/adminData.ts`).
When the backend is running, swap each page's `useState(INITIAL_*)` with API service calls.
See `FRONTEND.md → Connecting to the Backend` for the step-by-step migration.

---

## SEO Integration

- **What was added:** a lightweight client-side SEO helper component that updates the page `<title>` and meta tags (Open Graph, Twitter, robots, canonical, theme-color) at runtime.
- **Files:**
	- `src/app/components/SEO.tsx` — the SEO component that upserts meta tags from React.
	- `index.html` — default meta tags and Open Graph fallbacks.
	- `src/app/pages/Home.tsx`, `src/app/pages/PavilionPage.tsx`, `src/app/pages/PoolPage.tsx` — these pages now import and use `SEO` with page-specific values.

- **How it works:**
	- The `SEO` component runs a `useEffect` on the client and performs safe DOM updates: it sets `document.title`, creates/updates `<meta>` tags (description, robots, `og:*`, `twitter:*`), and ensures a `link[rel="canonical"]` exists.
	- Page components pass `title`, `description`, `image`, and `url` props to `SEO` so the right tags appear when users navigate the SPA.
	- The landing `index.html` contains sane defaults for crawlers and social previews when JavaScript is disabled or before hydration.

- **How it ties to the backend:**
	- The frontend reads dynamic copy and images from the backend via `GET /api/content` using `src/app/services/contentService.ts`.
	- When admins update site content (`PUT /api/content`) via the admin UI, the landing pages will fetch and use those values — the `SEO` component will reflect updated text and Open Graph images.

- **Limitations & recommendations:**
	- This implementation updates meta tags client-side only. For the best SEO and social preview reliability (especially for crawlers that don't execute JavaScript), consider server-side rendering (SSR) or prerendering pages, or generate static meta tags at build time for public pages.
	- Add a `sitemap.xml` and `robots.txt` from the backend for better indexing. See the backend guide for an example sitemap route.
	- To provide rich results, add JSON-LD structured data (Organization, Website, LocalBusiness/EventVenue) either in `SEO.tsx` or server-rendered templates.

- **Usage example (already applied):**

	In a page component:

	```tsx
	import SEO from "../components/SEO";

	// inside render
	<SEO
		title={content.heroTitle || "Felizardo's Event Place"}
		description={content.heroSubtitle}
		image={content.heroImage}
		url={typeof window !== 'undefined' ? window.location.href : '/'}
	/>
	```

If you'd like, I can add an automated `sitemap.xml` route to the backend and example JSON-LD snippets for the most important pages.
