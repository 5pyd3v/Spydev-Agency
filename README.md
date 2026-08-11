# SpyDev — Agency Platform & CMS

A production-grade MERN application for SpyDev: a public marketing site (services, projects, case studies, blog, team, etc.) fully driven by a secure admin CMS, plus a lead-capture pipeline and media library. Nothing on the public site is hardcoded — every section, entity, and setting is editable from `/admin` and reflects on the live site immediately.

## Stack

- **Frontend**: React 18 + Vite + TypeScript, Tailwind CSS v4, React Router, TanStack Query, Framer Motion, React Hook Form + Zod, Tiptap (rich text)
- **Backend**: Node.js + Express + TypeScript, Mongoose (MongoDB), JWT auth (httpOnly cookies) with role-based access control, Cloudinary for media
- **Database**: MongoDB (local or [Atlas](https://www.mongodb.com/atlas))

## 1. Requirements

- Node.js 20+
- npm 10+
- A MongoDB connection string — either:
  - A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) cluster (recommended, works out of the box), or
  - A local MongoDB Community Server instance (`mongodb://127.0.0.1:27017`)
- (Optional but recommended) A free [Cloudinary](https://cloudinary.com/users/register/free) account for image uploads
- (Optional) SMTP credentials for lead-notification emails — the app runs fine without this; it just logs a message instead of sending

## 2. Installation

From the repo root (this installs both `client/` and `server/` as npm workspaces):

```bash
npm install
```

## 3. Environment variables

Copy the example env files and fill them in:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

### `server/.env`

| Variable | Required | Notes |
|---|---|---|
| `MONGO_URI` | Yes | `mongodb://127.0.0.1:27017/spydev` locally, or your Atlas connection string |
| `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` | Yes | Generate with `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"` — use a different value for each |
| `CLIENT_URL` | Yes | The frontend origin, used for CORS and cookie scoping (`http://localhost:5173` in dev) |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | For media uploads | From your Cloudinary dashboard. Uploads return a clear error until these are set — nothing fails silently |
| `SMTP_*` | No | If unset, lead notification emails are skipped (logged instead) |
| `SEED_ADMIN_*` | For seeding | Credentials for the Super Admin account created by `npm run seed` |

### `client/.env`

| Variable | Notes |
|---|---|
| `VITE_API_URL` | Base URL of the API, e.g. `http://localhost:5000/api` |
| `VITE_SITE_URL` | Public site URL, used for SEO/canonical tags |

> ⚠️ A network whose DNS resolver blocks SRV lookups will fail to resolve `mongodb+srv://` Atlas URIs with `ECONNREFUSED`. The server already works around this by pointing its own DNS resolution at `8.8.8.8`/`1.1.1.1` for `mongodb+srv://` URIs (see `server/src/config/db.ts`) — no action needed, but worth knowing if you ever see that error elsewhere.

## 4. MongoDB setup

**Atlas (recommended):** create a free cluster, add a database user, allow your IP (or `0.0.0.0/0` for local dev), and copy the connection string into `MONGO_URI` — include a database name in the path, e.g. `.../spydev?...`.

**Local:** install MongoDB Community Server, ensure it's running on port 27017, and use `MONGO_URI=mongodb://127.0.0.1:27017/spydev`.

## 5. Seed the database

Creates the Super Admin account plus realistic demo content (services, projects, case studies, team, technologies, testimonials, pricing, FAQs, clients, blog posts, navigation, and homepage sections). Safe to re-run — it skips any collection that already has data.

```bash
npm run seed
```

Log in at `/admin/login` with `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` from `server/.env`. **Change this password after first login**, or edit the env vars before seeding.

## 6. Run in development

```bash
npm run dev
```

This runs both apps concurrently:
- Client: http://localhost:5173
- Server: http://localhost:5000 (health check at `/api/health`)

Or run them individually: `npm run dev:client` / `npm run dev:server`.

## 7. Build for production

```bash
npm run build
```

Builds the server to `server/dist` and the client to `client/dist`.

## 8. Project structure

```
client/src/
  api/            Axios client + one module per resource
  components/     ui/ (primitives), layout/, sections/ (homepage), admin/, projects/, services/
  pages/          public/ and admin/ route components
  layouts/        PublicLayout, AdminLayout
  contexts/       AuthContext, ThemeContext
  hooks/          shared hooks + hooks/queries (react-query) + hooks/admin
  routes/         router.tsx, ProtectedRoute

server/src/
  config/         env.ts (zod-validated), db.ts, cloudinary.ts
  models/         one Mongoose model per collection
  controllers/    request handlers (many built on utils/crudFactory.ts)
  routes/         one router per resource (many built on utils/crudRoutes.ts)
  middleware/     auth (JWT + RBAC + CSRF), validate, upload, rateLimiter, errorHandler
  services/       email.service.ts, media.service.ts (Cloudinary)
  validators/     Zod schemas per resource
  seed/           seed.ts — demo data + Super Admin bootstrap
```

The `crudFactory`/`crudRoutes` and `createResourceApi`/`useAdminResource` pairs (backend and frontend, respectively) implement one shared CRUD pattern reused across ~15 resources — reference `services.*` files as the canonical example when extending the app.

## 9. Admin panel

- URL: `/admin` (redirects to `/admin/login` if unauthenticated)
- Roles: **Super Admin** (full access incl. Users), **Admin** (everything except managing other admins), **Editor** (content only, no delete on some resources, no Settings/Appearance/SEO)
- New admin accounts are created from `/admin/users` (Super Admin only) — there is no public registration endpoint by design

## 10. Media storage

Image uploads (Media Library, and any "image URL" field with a picker) go through Cloudinary. Without `CLOUDINARY_*` env vars set, the upload endpoint returns a clear 500 error rather than failing silently — set the three Cloudinary env vars to enable it. To switch providers later (e.g. S3), replace `server/src/services/media.service.ts`; the rest of the app talks to Media through the `/api/media` REST endpoints and isn't coupled to Cloudinary specifically.

## 11. SEO

`GET /sitemap.xml` and `GET /robots.txt` are generated dynamically by the API from live content (services, projects, case studies, published blog posts). In production, if your frontend and backend are on different domains/subdomains, add a rewrite on the frontend host so `yourdomain.com/sitemap.xml` and `/robots.txt` proxy to the API — see `vercel.json` (repo root — must live there since Vercel's Root Directory is set to the repo root, not `client/`) for a ready-made example.

## 12. Deployment

- **Frontend** (`client/`): any static host — Vercel, Netlify, Cloudflare Pages. Build command `npm run build`, output directory `dist`. Set `VITE_API_URL` / `VITE_SITE_URL` in the host's environment variables.
- **Backend** (`server/`): any Node host — Render, Railway, Fly.io, a VPS, AWS/Azure. Build command `npm run build`, start command `npm start`. Set all `server/.env` variables in the host's environment.
- **Database**: MongoDB Atlas.
- Update `CLIENT_URL` (server) and `VITE_API_URL` (client) to the real production URLs — CORS and cookies are scoped to these.
- **Frontend and backend on different domains (e.g. Vercel + Render):** auth cookies must cross an actual different site, which modern Chrome increasingly treats as third-party and blocks outright — no cookie attribute combination fixes that from the browser's side. `vercel.json` in this repo proxies `/api/*` on the frontend's own domain through to the Render backend, so the browser only ever talks to one origin and the auth cookie is genuinely first-party. To use it: set `VITE_API_URL=/api` (a relative path, not the Render URL) in Vercel's environment variables, redeploy the frontend, and the backend's `CLIENT_URL`/CORS config can stay as-is.

## 13. Security notes

RBAC, JWT in httpOnly cookies, double-submit CSRF tokens, bcrypt password hashing, account lockout after repeated failed logins, Helmet, rate limiting (global + stricter on auth/lead endpoints), Mongo query sanitization, HTML sanitization on rich-text content (blog posts, static pages), and file-type/size-validated uploads are all implemented server-side — see `server/src/middleware/` and `server/src/app.ts`. No secrets are ever sent to the frontend.
