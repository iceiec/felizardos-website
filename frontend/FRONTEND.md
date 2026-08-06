# Felizardo's Event Place — Frontend Setup Guide

React 18 · TypeScript · Vite · Tailwind CSS v4 · react-router v7

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Folder Structure](#folder-structure)
4. [Running the App](#running-the-app)
5. [Environment Variables](#environment-variables)
6. [How Routing Works](#how-routing-works)
7. [How Authentication Works](#how-authentication-works)
8. [Data Flow & API Services](#data-flow--api-services)
9. [API Configuration](#api-configuration)
10. [Adding a New Admin Page](#adding-a-new-admin-page)
11. [Styling Guide](#styling-guide)
12. [Building for Production](#building-for-production)

---

## Prerequisites

- **Node.js** 18 or later — [nodejs.org](https://nodejs.org)
- **pnpm** (preferred) — `npm install -g pnpm`
  - Or use `npm` / `yarn` — adjust commands accordingly

---

## Installation

```bash
# Clone or download the project
git clone <your-repo-url>
cd felizardos

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open `http://localhost:5173` in your browser.

---

## Folder Structure

```
src/
├── app/
│   ├── App.tsx                  Root component — wraps RouterProvider
│   ├── routes.ts                All route definitions (react-router v7)
│   │
│   ├── pages/                   One file per page
│   │   ├── Home.tsx             Public landing page
│   │   ├── PavilionPage.tsx     Public pavilion page
│   │   ├── PoolPage.tsx         Public pool page
│   │   └── admin/
│   │       ├── AdminLayout.tsx  Sidebar + topbar shell for all /admin/* pages
│   │       ├── AdminLogin.tsx   Login form at /admin/login
│   │       ├── Dashboard.tsx    /admin — overview stats + charts
│   │       ├── Facilities.tsx   /admin/facilities
│   │       ├── Schedules.tsx    /admin/schedules
│   │       ├── Maintenance.tsx  /admin/maintenance
│   │       ├── Content.tsx      /admin/content — landing page editor
│   │       ├── Reports.tsx      /admin/reports — print PDF reports
│   │       └── Settings.tsx     /admin/settings
│   │
│   ├── components/              Reusable UI pieces (modals, badges, etc.)
│   │
│   ├── context/
│   │   └── AdminAuth.tsx        Auth state context (isAuthenticated, login, logout)
│   │
│   ├── services/                API call functions — one file per backend resource
│   │   ├── api.ts               Base axios/fetch instance with JWT header injection
│   │   ├── authService.ts       login(), logout()
│   │   ├── facilityService.ts   getAll(), getById(), create(), update(), delete()
│   │   ├── scheduleService.ts   same pattern
│   │   ├── maintenanceService.ts
│   │   └── contentService.ts
│   │
│   ├── types/
│   │   └── index.ts             TypeScript interfaces — Facility, Schedule, etc.
│   │
│   └── utils/
│       └── adminData.ts         Mock initial data for localStorage mode
│
└── styles/
    ├── index.css                @import chain entry
    ├── theme.css                CSS variables / design tokens
    └── fonts.css                Google Fonts @import
```

---

## Running the App

```bash
# Development with hot reload
pnpm dev

# Type-check without running
pnpm tsc --noEmit

# Build for production
pnpm build

# Preview production build locally
pnpm preview
```

---

## Environment Variables

Create a `.env` file at the project root (next to `package.json`):

```env
# URL of your Express backend
VITE_API_URL=http://localhost:5000/api
```

Vite only exposes variables prefixed with `VITE_` to the browser.

In your code, read it as:
```ts
const BASE_URL = import.meta.env.VITE_API_URL;
```

If `VITE_API_URL` is not set, the app runs in **localStorage mock mode** — all data is stored in the browser with no backend required.

---

## How Routing Works

Routes are defined in `src/app/routes.ts` using `createBrowserRouter` from react-router v7:

```ts
export const router = createBrowserRouter([
  // Public pages
  { path: "/", Component: Home },

  // Admin login — standalone, no sidebar
  { path: "/admin/login", Component: AdminLogin },

  // Admin area — AdminLayout wraps all children
  {
    path: "/admin",
    Component: AdminLayout,       // renders <Outlet /> for child pages
    children: [
      { index: true, Component: Dashboard },     // /admin
      { path: "facilities", Component: Facilities },
      { path: "schedules",  Component: Schedules },
      // ...
    ],
  },
]);
```

**To add a new admin page:**
1. Create `src/app/pages/admin/MyPage.tsx`
2. Import it in `routes.ts` and add `{ path: "my-page", Component: MyPage }` under the admin children
3. Add a nav entry in `AdminLayout.tsx`'s `NAV_ITEMS` array

---

## How Authentication Works

`src/app/context/AdminAuth.tsx` provides a context with:
- `isAuthenticated` — boolean, read from localStorage on load
- `login(email, password)` — validates credentials, sets state
- `logout()` — clears state and token

`AdminLayout.tsx` uses this context:
```ts
const { isAuthenticated, logout } = useAdminAuth();

useEffect(() => {
  if (!isAuthenticated) navigate("/admin/login", { replace: true });
}, [isAuthenticated]);
```

**Current mode:** credentials are checked against hardcoded values. When connecting to the backend, replace the `login()` body with a call to `authService.login()` which fetches a JWT.

---

## Data Flow & API Services

The application communicates with the backend API using Axios-based service functions located in `src/app/services/`.

Each page fetches its required data on mount. For example:
```ts
const [facilities, setFacilities] = useState<Facility[]>([]);

useEffect(() => {
  facilityService.getAll()
    .then(res => {
      if (res.success && res.data) setFacilities(res.data);
    })
    .catch(console.error);
}, []);
```

The services available are:
- `authService.ts`: login(), logout()
- `facilityService.ts`: CRUD for facilities
- `scheduleService.ts`: CRUD for schedules
- `maintenanceService.ts`: CRUD for maintenance
- `contentService.ts`: CMS logic for the landing page content

---

## API Configuration

To configure the API connection, ensure you have a `.env` file at the project root:

```env
# URL of your Express backend
VITE_API_URL=http://localhost:5000/api
```

In the code, this is read as:
```ts
const BASE_URL = import.meta.env.VITE_API_URL;
```

The base API instance (`src/app/services/api.ts`) automatically injects the JWT token stored in `localStorage` into the `Authorization` header for all requests to protected endpoints.

---

## Adding a New Admin Page

1. **Create the page file:**
   ```
   src/app/pages/admin/Payments.tsx
   ```

2. **Register the route** in `src/app/routes.ts`:
   ```ts
   import Payments from "./pages/admin/Payments";
   // inside admin children:
   { path: "payments", Component: Payments },
   ```

3. **Add a nav item** in `src/app/pages/admin/AdminLayout.tsx`:
   ```ts
   import { CreditCard } from "lucide-react";

   const NAV_ITEMS = [
     // ...existing items
     { to: "/admin/payments", label: "Payments", Icon: CreditCard },
   ];
   ```

4. **Create a service** in `src/app/services/paymentService.ts`:
   ```ts
   import { api } from "./api";

   export const paymentService = {
     getAll: () => api.get("/payments"),
     create: (data: NewPayment) => api.post("/payments", data),
   };
   ```

---

## Styling Guide

The project uses **Tailwind CSS v4** with a custom theme defined in `src/styles/theme.css`.

**Design tokens (use these everywhere):**
```
bg-background      text-foreground    border-border
bg-[#1E3A1E]       ← dark green (primary)
bg-[#2D5016]       ← medium green (hover states)
bg-[#A8C88A]       ← light green (accents)
bg-[#F4F5F7]       ← page background
```

**Typography classes used throughout:**
```
font-display       ← headings (serif-style display font)
font-sans          ← body text
text-[#111]        ← primary text
text-[#666]        ← secondary text
text-[#999]        ← muted text
text-[#bbb]        ← placeholder text
```

**Component patterns:**
- Cards: `bg-white rounded-2xl border border-[#E5E7EB] p-5`
- Buttons (primary): `bg-[#1E3A1E] text-white px-4 py-2.5 rounded-xl hover:bg-[#2D5016]`
- Inputs: `border border-[#E5E7EB] rounded-xl px-3.5 py-2.5 focus:border-[#2D5016]`
- Modals: wrapped in `motion.div` from `motion/react` with `AnimatePresence`

**Icons:** All from `lucide-react`. Import only what you use:
```ts
import { Building2, CalendarDays, Plus } from "lucide-react";
```

---

## Building for Production

```bash
# Build the React app
pnpm build
# Output: dist/

# The dist/ folder is a static site — deploy to Vercel, Netlify, or any CDN
```

**Vercel (recommended):**
1. Push to GitHub
2. Import in Vercel dashboard
3. Set environment variable: `VITE_API_URL=https://your-server.railway.app/api`
4. Deploy

**Netlify:**
1. Push to GitHub
2. Build command: `pnpm build`
3. Publish directory: `dist`
4. Add env variable `VITE_API_URL` in Site Settings

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `Module not found: lucide-react/...` | Import specific icons: `import { X } from "lucide-react"` |
| White screen after login | Check `localStorage.getItem("felizardos_admin_auth")` is `"true"` |
| Charts not rendering | Wrap in `<ResponsiveContainer width="100%" height={200}>` |
| `Cannot read properties of undefined` on schedules | Courts (`andoy`, `juliet`) omit `title`/`guests` — use `s.title?.trim() \|\| s.clientName` |
| Tailwind classes not applying | Don't use string interpolation for class names; use full class strings |
| CORS error when calling backend | Ensure `CLIENT_ORIGIN` in `backend/.env` matches your frontend URL |
