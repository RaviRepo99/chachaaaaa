# CCRCITCLUB Website

Official website for **CITC** (Computer Engineering Innovation & Tech Club) at Nepal College of Information Technology (NCIT).

**Live site:** [ccrcitclub.digital](https://ccrcitclub.digital)  
**Tagline:** Innovate. Connect. Transform.

---

## What this repo is

A full-stack **Next.js 16** app with two parts:

| Area | Who uses it | Purpose |
|------|-------------|---------|
| **Public site** | Students & visitors | Club info, events, team roster, member profiles, join form |
| **Admin dashboard** | CITC organizers | Manage members, teams, and events |

All public content (events, members, teams) is loaded from **PostgreSQL** via Drizzle ORM. Photos and event images can live under `public/` or in **Supabase Storage** (`media` bucket) after upload through admin.

---

## Tech stack

- **Framework:** Next.js 16 (App Router), React 19, React Compiler
- **Styling:** Tailwind CSS v4, brand colors from the CITC logo (`#0052CC`, `#050A18`)
- **Database:** PostgreSQL + [Drizzle ORM](https://orm.drizzle.team/)
- **Auth & storage:** Supabase (admin login, image uploads to `media` bucket)
- **Forms:** Tally embed on `/join` and `/register/ai`
- **Lint/format:** Biome

Production builds use **Webpack** (`--webpack` flag) because Next.js 16’s default Turbopack build currently hangs on this project. See `next.config.ts` and `package.json`.

---

## Project structure

```
src/
  app/
    page.tsx                    # Home (hero + about bento)
    opengraph-image.tsx         # Site-wide OG image
    sitemap.ts                  # Dynamic sitemap from DB
    robots.ts                   # Crawler rules
    events/                     # Events list, detail, OG images
    team/                       # Roster by year + member profile pages
    join/                       # Membership form (Tally)
    register/ai/                # AI competition registration
    login/                      # Admin login
    admin/                      # Dashboard (members, teams, events)
    api/                        # CRUD API routes for admin
  components/                   # Shared public UI (Hero, Footer, MediaImage, …)
  db/                           # Schema, migrations, seed.ts
  lib/                          # env, site-config, seo, media, years, team-order, member-slug, revalidate
  types/                        # Drizzle-inferred Member, Event, Team
  utils/                        # Supabase clients, image compression
  proxy.ts                      # Session refresh + API auth guard (Next.js 16 proxy)
public/
  _seed/                        # Optional bootstrap images — safe to delete later (see public/_seed/README.md)
  CITCLOGOW.webp, …             # Site logos (required)
  favicon/, scripts/            # Icons + theme-init.js
docker-compose.yml              # Local dev (Postgres + Next.js)
docker-compose.prod.yml         # Production (GHCR image + Traefik)
Dockerfile                      # Multi-stage production image
prod-deploy.sh                  # Pull and start production stack
```

---

## Environment variables

Copy `.env.example` to `.env.local` for local development (not committed):

| Variable | Required | Used for |
|----------|----------|----------|
| `DATABASE_URL` | Yes | PostgreSQL connection (Drizzle + seed) |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Yes | Supabase anon/publishable key |
| `NEXT_PUBLIC_SITE_URL` | No | Canonical site URL for SEO/OG (defaults to `https://citc.ncit.edu.np`) |
| `GHCR_USER` / `GHCR_TOKEN` | Deploy only | Pull production image from GitHub Container Registry |
| `LETSENCRYPT_EMAIL` | Deploy only | SSL certificate contact (Traefik) |

Admin auth and storage uploads depend on Supabase being configured correctly.

---

## Getting started

### Local (recommended)

```bash
npm install
cp .env.example .env.local   # fill in DATABASE_URL and Supabase keys
npm run db:push              # apply schema to Postgres
npm run db:seed              # optional: seed teams, members, events
npm run dev                  # http://localhost:3000
```

### Local with Docker

```bash
cp .env.example .env.local   # Supabase keys still required for admin
docker compose up
```

Postgres runs on port `5432` with credentials from `docker-compose.yml`. Apply schema and seed inside the web container or from the host if `DATABASE_URL` points at the container.

### Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local dev server |
| `npm run build` | Production build (Webpack) |
| `npm run start` | Run production build |
| `npm run lint` | ESLint (Google style + Next.js) |
| `npm run format` | ESLint auto-fix |
| `npm run verify` | Lint + build (Husky pre-push hook) |
| `npm run db:push` | Apply Drizzle schema |
| `npm run db:seed` | Seed teams, members, events |
| `npm run db:seed-thumbs` | Generate missing member thumbnail AVIFs for seed paths |

**Contributing:** see [CONTRIBUTING.md](./CONTRIBUTING.md) and [AGENTS.md](./AGENTS.md) for conventions.

---

## Public pages

| Route | Description |
|-------|-------------|
| `/` | Hero + “What we do” bento; events live on `/events` |
| `/events` | All events from DB, filter by academic year |
| `/events/[id]` | Event detail + markdown description + gallery |
| `/team` | Team roster; defaults to latest academic year |
| `/team/[year]` | Roster for a specific academic year |
| `/team/[year]/[slug]` | Individual member profile (shareable URL) |
| `/join` | Tally membership embed |
| `/register/ai` | AI competition page + countdown + Tally |

Team display order: **Patron/Faculty advisors → Mentors → Board of Directors**. Executives are sorted by college year (senior first), then name.

---

## Admin

| Route | Description |
|-------|-------------|
| `/login` | Admin sign-in (Supabase) |
| `/admin` | Dashboard overview |
| `/admin/teams` | Manage team groups per academic year |
| `/admin/members` | Add/edit members, photo upload (AVIF + thumb) |
| `/admin/events` | Add/edit events, image upload to Supabase |

Admin UI uses a separate **botanical** theme (sage/clay) from the public CITC blue/navy brand.

Admin forms call `/api/*` routes with the Supabase session cookie. Unauthenticated API requests return **401** (enforced in `src/proxy.ts`). The admin layout redirects unauthenticated users to `/login`.

---

## SEO

Public pages use `createPageMetadata()` from `@/lib/seo` for titles, descriptions, canonical URLs, Open Graph, and Twitter cards.

| Feature | Location |
|---------|----------|
| Per-page metadata | Route `page.tsx` / `generateMetadata` |
| Dynamic OG images | `opengraph-image.tsx` beside routes |
| Sitemap | `/sitemap.xml` — static routes + all events, team years, member profiles |
| Robots | `/robots.txt` — allows public pages; blocks `/admin/`, `/api/`, `/login` |

After admin changes, API routes call `revalidatePath()` via helpers in `@/lib/revalidate` so public pages and the sitemap stay fresh.

---

## Media & images

| Source | Example path |
|--------|----------------|
| Local seed folder | `/_seed/event/002/top_image.jpg`, `/_seed/media/2025/members/name.avif` |
| Supabase Storage | Full `https://…supabase.co/storage/v1/object/public/media/…` URL in DB |

Helpers in `src/lib/media.ts`:

- `resolveMediaUrl()` — encodes local path segments safely (spaces, special chars).
- `getMemberPhotoUrl()` — full member photo + cache-busting `?v=` from `photoVersion`.
- `getMemberThumbnailUrl()` — small AVIF thumb for admin lists and cards.

Use the client `MediaImage` component for image fallbacks — Server Components cannot use `onError` on `<img>`.

See also [public/README.md](./public/README.md) and [public/_seed/README.md](./public/_seed/README.md).

---

## Deployment

Production runs as a Docker container from **GitHub Container Registry**:

1. Push to `main` triggers [.github/workflows/docker-build.yml](./.github/workflows/docker-build.yml).
2. Image is published to `ghcr.io/citc-club/citc-website:latest`.
3. On the server, copy `.env` (with `DATABASE_URL`, Supabase keys, GHCR credentials) and run:

```bash
./prod-deploy.sh
```

`docker-compose.prod.yml` pulls the image and registers it with **Traefik** for HTTPS at `citc.ncit.edu.np`.

Vercel is also supported (`vercel.json` sets build memory). Set the same env vars in the Vercel project dashboard.

---

## Brand tokens

Defined in `src/lib/site-config.ts` and `src/app/globals.css`:

- **CITC blue:** `#0052CC` (`citc-blue`)
- **CITC navy:** `#050A18` (`citc-navy`)
- **Muted blue:** `#E8F0FC`

Use Tailwind classes: `text-citc-blue`, `bg-citc-navy`, `site-container`, etc.

Social links (GitHub, Facebook, Instagram, LinkedIn) live in `SITE_CONFIG.social`.

---

## Contributing

1. Read [CONTRIBUTING.md](./CONTRIBUTING.md) and [AGENTS.md](./AGENTS.md).
2. Next.js 16 may differ from older docs — check `node_modules/next/dist/docs/` when unsure.
3. Keep public copy aligned with **Innovate. Connect. Transform.**
4. Prefer **dynamic data** from DB/API over hardcoded lists for events, members, and stats.

---

## License

Licensed under the [Apache License, Version 2.0](./LICENSE).

Copyright 2025-2026 [CITC-Club](https://github.com/CITC-Club) (Computer Engineering Innovation & Tech Club, NCIT).

Contact: [citc@ncit.edu.np](mailto:citc@ncit.edu.np)
