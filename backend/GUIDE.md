# Felizardo's Event Place — Backend Guide

Express 4 · TypeScript · MongoDB · Mongoose 8 · JWT Auth

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Folder Structure](#folder-structure)
3. [Installation](#installation)
4. [Environment Variables](#environment-variables)
5. [MongoDB Setup](#mongodb-setup)
6. [Running the Server](#running-the-server)
7. [Seeding the Database](#seeding-the-database)
8. [How the Code Is Organized](#how-the-code-is-organized)
9. [Writing a Model](#writing-a-model)
10. [Writing a Controller](#writing-a-controller)
11. [Writing Routes](#writing-routes)
12. [Authentication Flow](#authentication-flow)
13. [Adding a New Feature (end-to-end)](#adding-a-new-feature-end-to-end)
14. [Connecting to the React Frontend](#connecting-to-the-react-frontend)
15. [Deploying](#deploying)

---

## Prerequisites

- **Node.js** 18 or later — [nodejs.org](https://nodejs.org)
- **npm** (comes with Node)
- A MongoDB instance — either:
  - **Local:** MongoDB Community Server ([mongodb.com/try/download](https://www.mongodb.com/try/download/community))
  - **Cloud:** MongoDB Atlas free tier ([cloud.mongodb.com](https://cloud.mongodb.com)) — recommended

---

## Folder Structure

```
server/
├── .env.example             copy → .env, fill in MONGODB_URI and JWT_SECRET
├── package.json             dependencies + scripts
├── tsconfig.json            TypeScript config
├── GUIDE.md                 ← this file
├── API.md                   complete API endpoint reference
└── src/
    ├── index.ts             ← app entry: registers middleware, mounts routes, starts server
    │
    ├── config/
    │   ├── env.ts           reads .env, validates required variables, exports typed object
    │   ├── db.ts            connects to MongoDB via Mongoose
    │   └── seed.ts          one-time data seeder — run once to populate the database
    │
    ├── types/
    │   └── index.ts         TypeScript interfaces shared across models, controllers, routes
    │
    ├── models/              Mongoose schemas — one file per MongoDB collection
    │   ├── Admin.ts         admins collection
    │   ├── Facility.ts      facilities collection
    │   ├── Schedule.ts      schedules collection
    │   ├── Maintenance.ts   maintenances collection
    │   └── SiteContent.ts   sitecontents collection (singleton)
    │
    ├── middleware/
    │   └── authMiddleware.ts   protect() — verifies JWT, attaches req.admin
    │
    ├── routes/              Express routers — URL paths mapped to controller functions
    │   ├── index.ts         mounts all routers under /api
    │   ├── auth.ts
    │   ├── facilities.ts
    │   ├── schedules.ts
    │   ├── maintenance.ts
    │   └── content.ts
    │
    └── controllers/         Request handlers — query DB, return JSON
        ├── authController.ts
        ├── facilityController.ts
        ├── scheduleController.ts
        ├── maintenanceController.ts
        └── contentController.ts
```

**The rule:** Routes declare *what URL does what*. Controllers do the *actual work*. Models define *data shape*. Middleware runs *before* controllers on protected routes.

---

## Installation

```bash
# From the project root, enter the server directory
cd server

# Install all dependencies
npm install

# Create your environment file
cp .env.example .env
```

Now open `.env` and fill in the two required values (see next section).

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `MONGODB_URI` | ✅ | MongoDB connection string |
| `JWT_SECRET` | ✅ | Long random string for signing tokens |
| `JWT_EXPIRES_IN` | optional | Token lifetime, default `7d` |
| `PORT` | optional | Server port, default `5000` |
| `CLIENT_ORIGIN` | optional | React app URL for CORS, default `http://localhost:5173` |
| `NODE_ENV` | optional | `development` enables request logging |

**Generate a strong JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

**Example `.env`:**
```env
MONGODB_URI=mongodb+srv://felizardoUser:yourPassword@cluster0.xxxxx.mongodb.net/felizardos
JWT_SECRET=a8f3d7e1b9c2f6a4d0e8b3c7f1a9d5e2b6c0f4a8d2e9b7c3f5a1d8e4b0c6f9
JWT_EXPIRES_IN=7d
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
NODE_ENV=development
```

---

## MongoDB Setup

### Option A — MongoDB Atlas (recommended, free)

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com) → Create a free account
2. Build a Cluster → choose the free M0 tier
3. **Database Access** → Add Database User (username + password — save these)
4. **Network Access** → Add IP Address → `0.0.0.0/0` (allow from anywhere)
5. **Connect** → Drivers → copy the connection string
6. Replace `<password>` in the string with your database user's password
7. Add the database name: `...mongodb.net/felizardos?retryWrites=true...`
8. Paste into `MONGODB_URI` in your `.env`

### Option B — Local MongoDB

Install MongoDB Community, then:
```env
MONGODB_URI=mongodb://localhost:27017/felizardos
```

No username/password needed for a default local install.

---

## Running the Server

```bash
# Development — auto-restarts when you save a .ts file
npm run dev

# Build TypeScript → JavaScript (for production)
npm run build

# Start the compiled production build
npm start
```

The dev server runs at **`http://localhost:5000`**.

Test it's alive:
```bash
curl http://localhost:5000/api
# → { "message": "Felizardo's API running" }
```

---

## Seeding the Database

Run once after setting up your `.env`:

```bash
npm run seed
```

This creates:
- Admin user: `admin@felizardos.com` / `felizardos2025`
- 4 facilities (Pavilion, Pool, Andoy Court, Juliet Court)
- Default site content (hero text, contact info)
- Sample bookings and maintenance tasks

It is **safe to run multiple times** — facilities and content use upsert, and schedules/maintenance only insert if the collections are empty.

**To reset everything:**
```bash
# Drop and recreate the database, then re-seed
mongosh felizardos --eval "db.dropDatabase()"
npm run seed
```

---

## How the Code Is Organized

### `src/index.ts` — App entry point

This file creates the Express app, wires up all middleware and routes, connects to MongoDB, then starts listening. It is the only file you need to modify to add global middleware (rate limiting, file uploads, etc.).

```ts
const app = express();

app.use(cors({ origin: env.CLIENT_ORIGIN }));
app.use(express.json());
app.use(morgan("dev"));          // logs every request in development

app.use("/api", apiRoutes);      // all routes are under /api

connectDB().then(() => {
  app.listen(env.PORT, () => console.log(`Server on port ${env.PORT}`));
});
```

### `src/config/env.ts` — Environment variables

Validates that required variables are set at startup (fail-fast), then exports a typed `env` object. Import `env` instead of using `process.env` directly in your code:

```ts
import { env } from "../config/env";

console.log(env.PORT);        // ✅ typed, validated
console.log(process.env.PORT) // ❌ could be undefined, no type info
```

### `src/config/db.ts` — Database connection

Calls `mongoose.connect(env.MONGODB_URI)` and exits the process if the connection fails. Called once from `index.ts` before the server starts.

---

## Writing a Model

A model file defines:
1. A TypeScript interface for the document shape
2. A Mongoose schema with field types, validations, and defaults
3. A compiled Mongoose model exported as default

**Pattern — `src/models/Facility.ts`:**

```ts
import mongoose, { Schema, Document } from "mongoose";
import type { IFacility } from "../types";

// 1. Merge our interface with Mongoose's Document type
export interface FacilityDocument extends IFacility, Document {}

// 2. Define the schema
const FacilitySchema = new Schema<FacilityDocument>(
  {
    id:           { type: String, required: true, unique: true, trim: true },
    name:         { type: String, required: true, trim: true },
    type:         { type: String, required: true, enum: ["Event Hall", "Recreation", "Basketball Court"] },
    capacity:     { type: Number, required: true, min: 1 },
    status:       { type: String, enum: ["active", "maintenance", "inactive"], default: "active" },
    rentalPrice:  { type: Number, required: true, min: 0, default: 0 },
    amenities:    [{ type: String, trim: true }],
    showOnLanding:{ type: Boolean, default: false },
    description:  { type: String, default: "" },
  },
  { timestamps: true }   // automatically adds createdAt and updatedAt
);

// 3. Export the compiled model
export default mongoose.model<FacilityDocument>("Facility", FacilitySchema);
```

**Common field options:**
```ts
{ type: String, required: true }              // must be present
{ type: String, trim: true }                  // strips whitespace
{ type: String, enum: ["a", "b"] }            // only these values
{ type: String, default: "active" }           // value if not provided
{ type: Number, min: 0, max: 100 }            // numeric range
{ type: Boolean, default: false }
{ type: Date, default: Date.now }
{ type: mongoose.Schema.Types.ObjectId, ref: "Facility" }  // reference
```

**Pre-save hook (example: hash password):**
```ts
AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
```

---

## Writing a Controller

Controllers receive `(req, res)`, talk to the database, and return JSON. Every response uses the same envelope:

```json
{ "success": true, "data": <payload> }
{ "success": false, "message": "Error description" }
```

**Full CRUD pattern — `src/controllers/facilityController.ts`:**

```ts
import { Request, Response } from "express";
import Facility from "../models/Facility";

// GET /api/facilities
export const getAll = async (req: Request, res: Response) => {
  try {
    const filter: Record<string, unknown> = {};
    if (req.query.showOnLanding) filter.showOnLanding = req.query.showOnLanding === "true";

    const facilities = await Facility.find(filter).sort({ createdAt: 1 });
    res.json({ success: true, data: facilities });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/facilities/:id
export const getById = async (req: Request, res: Response) => {
  try {
    const facility = await Facility.findOne({ id: req.params.id });
    if (!facility) return res.status(404).json({ success: false, message: "Facility not found" });
    res.json({ success: true, data: facility });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST /api/facilities
export const create = async (req: Request, res: Response) => {
  try {
    const facility = await Facility.create(req.body);
    res.status(201).json({ success: true, data: facility });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// PUT /api/facilities/:id
export const update = async (req: Request, res: Response) => {
  try {
    const facility = await Facility.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }   // return updated doc, run schema validators
    );
    if (!facility) return res.status(404).json({ success: false, message: "Facility not found" });
    res.json({ success: true, data: facility });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE /api/facilities/:id
export const remove = async (req: Request, res: Response) => {
  try {
    const facility = await Facility.findOneAndDelete({ id: req.params.id });
    if (!facility) return res.status(404).json({ success: false, message: "Facility not found" });
    res.json({ success: true, data: null });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
```

**Mongoose query cheatsheet:**
```ts
Model.find({ field: value })              // array of docs
Model.findOne({ field: value })           // single doc or null
Model.findById(id)                        // by MongoDB _id
Model.create(data)                        // insert one
Model.findOneAndUpdate(filter, update, { new: true })   // update + return new
Model.findOneAndDelete(filter)            // delete + return deleted doc
Model.countDocuments(filter)              // count only
Model.find().sort({ date: 1 })           // ascending (−1 for descending)
Model.find().limit(10).skip(20)          // pagination
Model.find({ status: { $in: ["a","b"] }}) // match any of
Model.find({ date: { $gte: startDate }}) // greater than or equal
```

---

## Writing Routes

Route files wire URLs to controller functions and apply middleware.

**Pattern — `src/routes/facilities.ts`:**

```ts
import { Router } from "express";
import { getAll, getById, create, update, remove } from "../controllers/facilityController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

// Public — no auth needed
router.get("/",    getAll);
router.get("/:id", getById);

// Protected — requires Authorization: Bearer <token>
router.post("/",    protect, create);
router.put("/:id",  protect, update);
router.delete("/:id", protect, remove);

// PATCH for single-field updates
router.patch("/:id/status",  protect, updateStatus);
router.patch("/:id/landing", protect, toggleLanding);

export default router;
```

**Mount in `src/routes/index.ts`:**

```ts
import { Router } from "express";
import authRoutes       from "./auth";
import facilityRoutes   from "./facilities";
import scheduleRoutes   from "./schedules";
import maintenanceRoutes from "./maintenance";
import contentRoutes    from "./content";

const router = Router();

router.get("/", (_, res) => res.json({ message: "Felizardo's API running" }));

router.use("/auth",        authRoutes);
router.use("/facilities",  facilityRoutes);
router.use("/schedules",   scheduleRoutes);
router.use("/maintenance", maintenanceRoutes);
router.use("/content",     contentRoutes);

export default router;
```

---

## Authentication Flow

```
Client                              Server
──────                              ──────
POST /api/auth/login
{ email, password }
                            →   Find admin by email
                                bcrypt.compare(password, admin.password)
                                jwt.sign({ id, email }, JWT_SECRET, { expiresIn })
                            ←   { token, admin: { id, email, name } }

Store token in localStorage

Any protected request:
GET /api/schedules
Authorization: Bearer <token>
                            →   authMiddleware.protect()
                                jwt.verify(token, JWT_SECRET)
                                req.admin = decoded payload
                                → next() — controller runs
                            ←   { success: true, data: [...] }

If token missing / expired:
                            ←   401 { success: false, message: "Not authorized" }
```

**`src/middleware/authMiddleware.ts`:**

```ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export const protect = (req: Request, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Not authorized" });
  }

  try {
    const token = auth.split(" ")[1];
    const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string; email: string };
    (req as any).admin = decoded;
    next();
  } catch {
    res.status(401).json({ success: false, message: "Token invalid or expired" });
  }
};
```

---

## Adding a New Feature (end-to-end)

**Example: add a "Payments" collection**

### 1. Add the TypeScript interface — `src/types/index.ts`

```ts
export interface IPayment {
  scheduleId: string;          // references a Schedule
  facilityId: string;
  clientName: string;
  amount: number;
  type: "deposit" | "full" | "balance";
  status: "pending" | "paid" | "overdue";
  dueDate: Date;
  paidAt?: Date;
  notes?: string;
}
```

### 2. Create the model — `src/models/Payment.ts`

```ts
import mongoose, { Schema, Document } from "mongoose";
import type { IPayment } from "../types";

export interface PaymentDocument extends IPayment, Document {}

const PaymentSchema = new Schema<PaymentDocument>(
  {
    scheduleId:  { type: String, required: true },
    facilityId:  { type: String, required: true },
    clientName:  { type: String, required: true, trim: true },
    amount:      { type: Number, required: true, min: 0 },
    type:        { type: String, required: true, enum: ["deposit", "full", "balance"] },
    status:      { type: String, enum: ["pending", "paid", "overdue"], default: "pending" },
    dueDate:     { type: Date, required: true },
    paidAt:      { type: Date },
    notes:       { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<PaymentDocument>("Payment", PaymentSchema);
```

### 3. Create the controller — `src/controllers/paymentController.ts`

```ts
import { Request, Response } from "express";
import Payment from "../models/Payment";

export const getAll = async (req: Request, res: Response) => {
  try {
    const filter: Record<string, unknown> = {};
    if (req.query.scheduleId) filter.scheduleId = req.query.scheduleId;
    if (req.query.status)     filter.status = req.query.status;

    const payments = await Payment.find(filter).sort({ dueDate: 1 });
    res.json({ success: true, data: payments });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const create = async (req: Request, res: Response) => {
  try {
    const payment = await Payment.create(req.body);
    res.status(201).json({ success: true, data: payment });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message });
  }
};

export const markPaid = async (req: Request, res: Response) => {
  try {
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status: "paid", paidAt: new Date() },
      { new: true }
    );
    if (!payment) return res.status(404).json({ success: false, message: "Payment not found" });
    res.json({ success: true, data: payment });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
```

### 4. Create the route — `src/routes/payments.ts`

```ts
import { Router } from "express";
import { getAll, create, markPaid } from "../controllers/paymentController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.get("/",          protect, getAll);
router.post("/",         protect, create);
router.patch("/:id/pay", protect, markPaid);

export default router;
```

### 5. Mount the route — `src/routes/index.ts`

```ts
import paymentRoutes from "./payments";
router.use("/payments", paymentRoutes);
```

### 6. Add to seed (optional) — `src/config/seed.ts`

```ts
// Add sample payments after schedules
await Payment.create({
  scheduleId: "4",
  facilityId: "pavilion",
  clientName: "Jose & Maria Santos",
  amount: 19000,   // 50% deposit of 38000 premium package
  type: "deposit",
  status: "paid",
  dueDate: new Date(),
  paidAt: new Date(),
});
```

### 7. Create the frontend service — `src/app/services/paymentService.ts`

```ts
import { api } from "./api";

export const paymentService = {
  getAll:   (params?: Record<string, string>) => api.get("/payments", { params }),
  create:   (data: Partial<IPayment>)         => api.post("/payments", data),
  markPaid: (id: string)                      => api.patch(`/payments/${id}/pay`),
};
```

---

## Connecting to the React Frontend

1. In the React project root, create `.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

2. Open `src/app/services/api.ts` — it reads this variable as the base URL for all requests.

3. On each admin page, replace `useState(INITIAL_DATA)` with a `useEffect` + service call. See `FRONTEND.md → Connecting to the Backend` for the full step-by-step.

---

## SEO Integration

This project implements a client-side SEO strategy in the React frontend and exposes a simple content API from the backend so site owners can update copy and Open Graph images without code changes.

- **Relevant backend endpoints:**
  - `GET /api/content` — returns the singleton `SiteContent` document. The frontend calls this via `contentService.get()`.
  - `PUT /api/content` — protected (admin) endpoint used by the admin UI to update landing copy, hero images, gallery arrays, and other fields used by Open Graph meta tags.

- **Model:**
  - `src/models/SiteContent.ts` stores the site-wide copy and image URLs. The `contentController` upserts a singleton document on first read.

- **How the frontend uses it:**
  - Pages fetch `/api/content` and pass values into `src/app/components/SEO.tsx` (client-side). That component upserts `<meta>` tags (title, description, `og:*`, `twitter:*`, canonical, robots) at runtime.

- **Server-side recommendations (optional):**
  - For robust SEO and social preview generation (beyond client-side updates), consider:
    - Adding server-side rendering (SSR) or prerendering for public pages so crawlers receive meta tags without executing JavaScript.
    - Generating a `sitemap.xml` and serving a `robots.txt` from the server. Example lightweight `sitemap.xml` route:

```ts
// src/routes/misc.ts
import { Router } from "express";
import Facility from "../models/Facility";
import SiteContent from "../models/SiteContent";

const router = Router();

router.get("/sitemap.xml", async (_req, res) => {
  const host = process.env.CLIENT_ORIGIN?.replace(/\/$/, '') || 'https://example.com';
  const facilities = await Facility.find({});
  const content = await SiteContent.findOne() || {};

  const urls = [
    `${host}/`,
    `${host}/venues/pavilion`,
    `${host}/venues/pool`,
    // optionally include dynamic facility pages
    ...facilities.map(f => `${host}/venues/${f.id}`),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls.map(u => `<url><loc>${u}</loc></url>`).join('\n') +
    `\n</urlset>`;

  res.header('Content-Type', 'application/xml').send(xml);
});

export default router;
```

  - Mount this route (`/sitemap.xml`) in `src/routes/index.ts` and ensure `CLIENT_ORIGIN` is set correctly in `.env` so canonical links and sitemap hostnames are accurate.

- **Robots.txt:**
  - Serve a simple `robots.txt` from the `public/` folder or via a route that returns `User-agent: *` and `Sitemap: <host>/sitemap.xml`.

- **Admin flow:**
  - Admins edit landing copy and hero/OG images via the admin Content page (`/admin/content`), which calls `PUT /api/content`. The frontend reads the updated content and `SEO.tsx` reflects changes immediately on the client.

If you want, I can implement the `sitemap.xml` route and a `robots.txt` endpoint now and wire them into the router.
 
---

## Image uploads for site content

You can upload images via a simple backend endpoint and then save the returned URL into the `SiteContent` document.

- **Endpoint:** `POST /api/uploads` (multipart/form-data with `file` field)
  - Response: `{ success: true, data: { url, filename } }` where `url` is the publicly accessible path (e.g. `http://localhost:5000/uploads/168...-hero.jpg`).
- **Storage:** files are saved to `backend/public/uploads` and served statically at `/uploads`.
- **Frontend helper:** the frontend includes `src/app/services/uploadService.ts` which uploads a `File` and returns the `url` to store in `SiteContent`.

Developer notes:
- The server's `SERVER_ORIGIN` is inferred from requests; if you deploy behind a proxy or need absolute hostnames in responses, set an explicit `SERVER_ORIGIN` environment variable or ensure the `Host` header is preserved.
- Install dependencies before using uploads:

```bash
cd backend
npm install
```

Example flow (admin content page):
1. Admin chooses a local image file and clicks upload.
2. Frontend calls `uploadFile(file)` → gets `url`.
3. Frontend sends `PUT /api/content` with the updated `heroImage` or `pavilionImage` set to the returned `url`.

---

## Deploying

**Recommended free stack:**

| Service | What it hosts |
|---|---|
| [Railway](https://railway.app) or [Render](https://render.com) | Node.js / Express server |
| [MongoDB Atlas](https://cloud.mongodb.com) | Free 512 MB MongoDB cluster |
| [Vercel](https://vercel.com) or [Netlify](https://netlify.com) | React frontend (Vite build) |

**Steps for Railway:**

1. Push `server/` code to a GitHub repository
2. In Railway: New Project → Deploy from GitHub → select the repo
3. Set root directory to `server/` (if it's a monorepo subfolder)
4. Add environment variables in the Railway dashboard:
   - `MONGODB_URI` — your Atlas connection string
   - `JWT_SECRET` — your secret
   - `CLIENT_ORIGIN` — your Vercel/Netlify frontend URL
   - `NODE_ENV=production`
5. Build command: `npm run build`
6. Start command: `npm start`

**Steps for the frontend (Vercel):**

1. Push the root project to GitHub
2. Import in Vercel dashboard
3. Set environment variable: `VITE_API_URL=https://your-railway-server.up.railway.app/api`
4. Deploy
