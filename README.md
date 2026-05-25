# SHIO VZW — Website

Official website for **SHIO VZW** (Sudanese Hausa International Organization), a Belgian non-profit based in Turnhout that finances and carries out humanitarian and development projects in Sudan and Chad.

Built with Next.js 16, TypeScript, Tailwind CSS, Prisma (SQLite), and next-intl.

---

## Table of Contents

- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Database](#database)
- [Admin Panel](#admin-panel)
- [API Reference](#api-reference)
- [Multilingual Support](#multilingual-support)
- [Image Uploads](#image-uploads)
- [SEO](#seo)
- [Production Build](#production-build)
- [Deployment Notes](#deployment-notes)

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Generate the Prisma client
npx prisma generate

# 3. Run database migrations (creates prisma/dev.db)
npx prisma migrate dev --name init

# 4. Seed the database with sample achievements and admin user
npm run seed

# 5. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — redirects automatically to `/nl` (default locale).

---

## Project Structure

```
shiovzw/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.ts                # Seed script (achievements + admin user)
│   └── dev.db                 # SQLite database (created on first migrate)
├── prisma.config.ts           # Prisma datasource config
├── public/
│   ├── images/                # Static images (copied from original project)
│   └── uploads/               # Admin-uploaded images (created at runtime)
├── src/
│   ├── app/
│   │   ├── [locale]/          # All public pages (nl, en, fr, ar)
│   │   │   ├── layout.tsx     # Locale layout (html lang, dir, fonts, metadata)
│   │   │   ├── page.tsx       # Home page (hero + about + achievements + events + donate + contact)
│   │   │   └── achievements/
│   │   │       ├── page.tsx           # All achievements grid
│   │   │       └── [id]/page.tsx      # Achievement detail + lightbox gallery
│   │   ├── admin/             # Admin panel (no locale prefix)
│   │   │   ├── layout.tsx     # Auth guard — redirects to /admin/login if not authenticated
│   │   │   ├── page.tsx       # Dashboard — lists all achievements
│   │   │   ├── login/page.tsx # Login form
│   │   │   ├── AchievementForm.tsx    # Shared create/edit form component
│   │   │   ├── AdminDeleteButton.tsx  # Delete button with confirmation
│   │   │   └── achievements/
│   │   │       ├── new/page.tsx       # Create achievement
│   │   │       └── [id]/edit/page.tsx # Edit achievement
│   │   ├── api/
│   │   │   ├── achievements/
│   │   │   │   ├── route.ts           # GET (list) · POST (create, admin only)
│   │   │   │   └── [id]/route.ts      # GET (single) · PUT (update, admin) · DELETE (admin)
│   │   │   ├── contact/route.ts       # POST — contact form submission
│   │   │   └── admin/
│   │   │       ├── login/route.ts     # POST — authenticate and set JWT cookie
│   │   │       └── logout/route.ts    # POST — clear JWT cookie
│   │   ├── sitemap.ts         # Dynamic sitemap (all locales + achievement pages)
│   │   └── robots.ts          # robots.txt
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx     # Sticky responsive navbar + language switcher
│   │   │   └── Footer.tsx     # Footer with links and social icons
│   │   ├── sections/          # Home page sections (server components)
│   │   │   ├── HeroSection.tsx
│   │   │   ├── AboutSection.tsx
│   │   │   ├── AchievementsPreview.tsx
│   │   │   ├── EventsSection.tsx
│   │   │   ├── DonateSection.tsx
│   │   │   └── ContactSection.tsx
│   │   ├── achievements/
│   │   │   ├── AchievementCard.tsx    # Card used in grid and preview
│   │   │   └── Lightbox.tsx           # Image lightbox (client component)
│   │   └── ui/
│   │       ├── Tag.tsx                # Tag chip component
│   │       └── LanguageSwitcher.tsx   # Locale dropdown in navbar
│   ├── i18n/
│   │   ├── routing.ts         # Supported locales + default locale
│   │   ├── request.ts         # next-intl server config
│   │   └── navigation.ts      # Locale-aware Link and useRouter
│   ├── lib/
│   │   ├── db.ts              # Prisma client singleton
│   │   ├── auth.ts            # JWT sign/verify, cookie helpers
│   │   └── utils.ts           # Shared utilities (slugify, etc.)
│   ├── messages/              # Translation files
│   │   ├── nl.json            # Dutch (default)
│   │   ├── en.json            # English
│   │   ├── fr.json            # French
│   │   └── ar.json            # Arabic
│   └── proxy.ts               # next-intl middleware (locale routing)
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## Environment Variables

Create a `.env` file in the project root (copy from `.env.example` if present):

```env
# Public site URL — used for sitemap and Open Graph metadata
NEXT_PUBLIC_SITE_URL=https://shio.be

# Secret key used to sign admin JWT tokens
# Change this to a long random string in production!
JWT_SECRET=shio-vzw-secret-key-2024
```

> **Important:** Change `JWT_SECRET` to a strong random value before deploying to production.
> Generate one with: `openssl rand -base64 32`

---

## Database

The project uses **SQLite** via Prisma for development. The database file lives at `prisma/dev.db`.

### Schema

| Model | Fields |
|---|---|
| `Achievement` | `id`, `title`, `slug` (unique), `description`, `tags` (JSON string), `coverImage`, `galleryImages` (JSON string), `createdAt`, `updatedAt` |
| `AdminUser` | `id`, `email` (unique), `passwordHash` (bcrypt) |

### Common Prisma commands

```bash
# Apply migrations
npx prisma migrate dev

# Open Prisma Studio (visual DB browser)
npx prisma studio

# Re-seed the database
npm run seed

# Reset the database and re-seed
npx prisma migrate reset
```

### Switching to PostgreSQL for production

1. In `prisma/schema.prisma`, change `provider = "sqlite"` to `provider = "postgresql"`
2. In `prisma.config.ts`, update the datasource URL to your PostgreSQL connection string
3. Run `npx prisma migrate deploy`

---

## Admin Panel

### Accessing the admin panel

| URL | Description |
|---|---|
| `/admin/login` | Login page |
| `/admin` | Dashboard — lists all achievements |
| `/admin/achievements/new` | Create a new achievement |
| `/admin/achievements/[id]/edit` | Edit an existing achievement |

### Default credentials

```
Email:    admin@shio.be
Password: shio2024admin
```

> **Change these credentials immediately after first login in production.**
> Use Prisma Studio or a seed script update to change the password hash.

### How to change the admin password

1. Generate a new bcrypt hash:
   ```bash
   node -e "const b=require('bcryptjs'); b.hash('yourNewPassword', 12).then(console.log)"
   ```
2. Open Prisma Studio:
   ```bash
   npx prisma studio
   ```
3. Navigate to the `AdminUser` table, find the record, and paste the new hash into the `passwordHash` field.

### Authentication flow

- Login form posts credentials to `POST /api/admin/login`
- The API verifies the password with bcrypt, then issues a **JWT** signed with `JWT_SECRET`
- The JWT is stored in an **httpOnly, SameSite=Lax** cookie named `shio_admin_token` (24-hour expiry)
- Every admin page and protected API route validates this cookie on each request
- Logout hits `POST /api/admin/logout`, which clears the cookie

### What admins can do

- **View** all achievements with cover images on the dashboard
- **Create** achievements — title, description, tags (comma-separated), cover image, and additional gallery images
- **Edit** any field of an existing achievement, including replacing images
- **Delete** achievements (with a confirmation prompt)

All changes are immediately reflected on the public-facing site.

### Image uploads

Uploaded images are saved to `public/uploads/` on the server. Filenames are prefixed with a Unix timestamp to avoid collisions. The directory is created automatically on first upload.

In production, consider storing uploads in a cloud bucket (e.g. S3, Cloudflare R2) and updating the upload handler in `src/app/api/achievements/route.ts` accordingly.

---

## API Reference

All endpoints return JSON. Protected endpoints require the `shio_admin_token` cookie.

### Achievements

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/achievements` | Public | List all achievements (newest first) |
| `POST` | `/api/achievements` | Admin | Create a new achievement (multipart form) |
| `GET` | `/api/achievements/[id]` | Public | Get a single achievement by ID |
| `PUT` | `/api/achievements/[id]` | Admin | Update an achievement (multipart form) |
| `DELETE` | `/api/achievements/[id]` | Admin | Delete an achievement |

**POST / PUT form fields:**

| Field | Type | Description |
|---|---|---|
| `title` | string | Achievement title (required) |
| `description` | string | Full description text (required) |
| `tags` | string | Comma-separated tags e.g. `Education, Sudan, Children` |
| `coverImage` | File | Cover image file |
| `galleryImages` | File[] | One or more additional gallery images |

### Contact

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/contact` | Public | Submit a contact form message |

**POST body (JSON):**

```json
{
  "name": "string",
  "email": "string",
  "message": "string"
}
```

### Admin Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/admin/login` | Public | Authenticate and receive JWT cookie |
| `POST` | `/api/admin/logout` | Public | Clear JWT cookie |

**Login body (JSON):**

```json
{
  "email": "admin@shio.be",
  "password": "shio2024admin"
}
```

---

## Multilingual Support

The site supports four languages, with Dutch as the default:

| Code | Language | Direction |
|---|---|---|
| `nl` | Dutch | LTR |
| `en` | English | LTR |
| `fr` | French | LTR |
| `ar` | Arabic | RTL |

### URL structure

```
/          → redirects to /nl
/nl        → Dutch homepage
/en        → English homepage
/fr        → French homepage
/ar        → Arabic homepage
/nl/achievements       → Dutch achievements page
/en/achievements/3     → English achievement detail (id=3)
```

### Adding or updating translations

Edit the JSON files in `src/messages/`:

```
src/messages/
├── nl.json   ← Dutch
├── en.json   ← English
├── fr.json   ← French
└── ar.json   ← Arabic
```

All four files must contain the same keys. Missing keys fall back to the key name itself.

### Adding a new language

1. Add the locale code to `src/i18n/routing.ts`:
   ```ts
   locales: ["nl", "en", "fr", "ar", "de"],
   ```
2. Create `src/messages/de.json` with all translation keys
3. Add the locale to the language switcher in `src/components/ui/LanguageSwitcher.tsx`

### RTL support

When the locale is `ar`, the `<html>` element receives `dir="rtl"` and the Noto Naskh Arabic font is applied automatically. Tailwind's logical properties (`start-*`, `end-*`, `ms-*`, `me-*`) are used throughout so layout mirrors correctly in RTL.

---

## Image Uploads

- **Location:** `public/uploads/` (created automatically)
- **Naming:** `{timestamp}-{original-filename}` to prevent collisions
- **Served at:** `/uploads/filename.jpg`
- **Optimization:** All images (including uploads) pass through `next/image` which serves AVIF/WebP automatically

For production deployments, the `public/uploads/` directory must be **persistent** across deployments (not wiped on each deploy). Use a persistent volume or migrate to cloud storage.

---

## SEO

- **Structured data:** Organization schema (JSON-LD) on the homepage
- **Metadata:** Per-locale `<title>`, `<description>`, Open Graph, and Twitter card tags
- **Sitemap:** Auto-generated at `/sitemap.xml` — includes all locale variants and all published achievement pages
- **robots.txt:** Generated at `/robots.txt` — blocks `/admin` and `/api` paths
- **Fonts:** Loaded via `next/font/google` (Inter + Noto Naskh Arabic) with `display: swap` — no layout shift
- **Images:** All served via `next/image` with lazy loading, AVIF/WebP conversion, and responsive `srcset`

---

## Production Build

```bash
# Type-check and build
npm run build

# Start the production server
npm run start
```

Before deploying:

1. Set `NEXT_PUBLIC_SITE_URL` to the real domain in your environment
2. Set `JWT_SECRET` to a strong random secret
3. Change the default admin password
4. Ensure `public/uploads/` is on a persistent volume
5. Consider switching the database to PostgreSQL

---

## Deployment Notes

### Vercel

The project deploys to Vercel without extra configuration. Note:

- SQLite works in dev/preview but **not** on Vercel's serverless functions in production due to the ephemeral filesystem. Switch to a hosted database (PlanetScale, Supabase, Neon) before going live.
- Set environment variables in the Vercel dashboard under Project → Settings → Environment Variables.

### Self-hosted (Node.js server)

```bash
npm run build
npm run start   # listens on port 3000 by default
```

Use a reverse proxy (nginx / Caddy) in front and set `PORT` if needed.

### Docker

A `Dockerfile` and `docker-compose.yml` can be added as needed. The build stage runs `npm run build`; the runtime stage copies `.next/`, `public/`, `prisma/`, `node_modules/`, and `package.json`.

---

## Organization Info

| Field | Value |
|---|---|
| Name | SHIO VZW |
| Full name | Sudanese Hausa International Organization |
| Type | Belgian non-profit (VZW) |
| Address | Steenweg op zevendonk 37, 2300 Turnhout, Belgium |
| Email | info@shio.be |
| Phone | +32 499 82 97 61 |
| Bank account | BE26 0882 8844 2629 |
| Facebook | https://www.facebook.com/groups/449667411830119 |
| Twitter / X | https://twitter.com/shioVzw |
| Instagram | https://www.instagram.com/sudanesehausa/ |

---

## Tech Stack

| Package | Version | Purpose |
|---|---|---|
| Next.js | 16.2.6 | Framework (App Router) |
| React | 19.2.4 | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Styling |
| Prisma | 7.x | ORM |
| better-sqlite3 | 12.x | SQLite driver |
| next-intl | 4.x | Internationalization |
| jose | 6.x | JWT signing and verification |
| bcryptjs | 3.x | Password hashing |

---

*Built by [ZOBNEX](https://zobnex.be)*
