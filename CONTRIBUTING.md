# Contributing to CCRC IT CLUB Website

Thank you for helping maintain the club site. This guide keeps changes consistent for anyone editing the repo later.

## Prerequisites

- Node.js 20+
- PostgreSQL database
- Supabase project (admin login + `media` storage bucket)

Copy environment variables:

```bash
cp .env.example .env.local
# Fill in DATABASE_URL and Supabase keys
```

Optional: `NEXT_PUBLIC_SITE_URL` for correct canonical/OG URLs on preview hosts (defaults to production URL in `site-config.ts`).

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run dev` | Local dev server |
| `npm run build` | Production build (Webpack; see `package.json`) |
| `npm run start` | Run production build |
| `npm run lint` | ESLint (Google style + Next.js rules) |
| `npm run lint:fix` | ESLint with auto-fix |
| `npm run format` | Same as `lint:fix` (Google style formatting) |
| `npm run verify` | Lint + production build (also runs on `git push` via Husky) |
| `npm run check` | Lint + build |
| `npm run db:push` | Apply Drizzle schema |
| `npm run db:seed` | Seed teams, members, events |
| `npm run db:seed-thumbs` | Generate missing `-thumb.avif` files for seed member photos |

## Repository layout

```
src/
  app/              # Routes (App Router)
    admin/          # Dashboard — auth required (layout + proxy)
    api/            # JSON CRUD for admin forms
    events/         # Public events
    team/           # Public team roster + member profiles
    sitemap.ts      # Dynamic sitemap
    robots.ts       # Crawler rules
  components/       # Shared public UI (Navbar, Hero, Footer, MediaImage, …)
  db/               # Drizzle schema, migrations, seed.ts
  lib/              # Domain helpers (config, media, env, years, team-order, seo, revalidate)
  types/            # Shared TS types (mostly Drizzle infer)
  utils/            # Infrastructure (Supabase clients, image compression)
  proxy.ts          # Supabase session refresh + /api auth guard
```

### Where to put new code

- **New public page** → `src/app/<route>/page.tsx`; extract client UI to `<Route>Client.tsx` if needed.
- **New admin screen** → `src/app/admin/<section>/` next to existing tables/forms.
- **Reusable public widget** → `src/components/`.
- **Admin-only widget** → `src/components/admin/` or co-located under `src/app/admin/`.
- **DB column** → `src/db/schema.ts`, then `npm run db:push`; types update via `@/types` automatically.
- **Config / constants** → `src/lib/`, not scattered in components.

## Code style

- **TypeScript** strict; avoid `any`.
- **Imports:** `@/` alias only (see `tsconfig.json`).
- **Formatting:** ESLint auto-fix (`npm run format`). Google JavaScript Style Guide via `eslint-config-google`.
- **React:** Default export for pages and single-purpose components is fine; named exports for icon bundles (`Icons.tsx`).
- **Server vs client:** Fetch data in Server Components; use `useState` / `fetch` in client files (`"use client"`).

## Database & types

- Schema lives in `src/db/schema.ts`.
- App types: `import type { Event, Member, Team } from "@/types"`.
- Do not maintain parallel interfaces for table rows.

## Supabase

- Browser (login, uploads): `createBrowserSupabaseClient()` from `@/utils/supabase/client`.
- Server (admin layout, logout): `createServerSupabaseClient()` from `@/utils/supabase/server`.
- Session refresh and API auth: `src/proxy.ts` on `/admin/*`, `/login`, and `/api/*`.
- **API routes** (`/api/*`) require a logged-in Supabase user (401 if not). Admin forms must send the session cookie.

## Team & member URLs

- Slugs: `memberSlugFromName()` in `@/lib/member-slug`.
- Profile path: `/team/{memberYear}/{slug}` via `memberProfilePath()`.
- Sorting: `@/lib/team-order` (advisors → mentors → executives; senior college year first).

## SEO & cache

- Page metadata: `createPageMetadata()` from `@/lib/seo`.
- OG images: add `opengraph-image.tsx` beside the route (see existing examples).
- After admin mutations, call helpers from `@/lib/revalidate` so public pages and `/sitemap.xml` update.

## Media

- **Bootstrap only:** `public/_seed/` (see `public/_seed/README.md`) — delete when DB uses Supabase URLs.
- **Permanent:** logos, favicon, `scripts/` at `public/` root.
- Uploaded files: Supabase `media` bucket (auto-created on first admin upload); store full URL in DB. Requires `SUPABASE_SERVICE_ROLE_KEY` in `.env.local` (Dashboard → API Keys → **Legacy anon, service_role** tab → `service_role`, not the new publishable/secret keys).
- Seed paths use `seedAssetPath()` from `@/lib/seed-assets` (prefix `/_seed`).
- Member uploads store **two** URLs: `photo` (full AVIF) and `photoThumb` (64px AVIF). Admin lists use `getMemberThumbnailUrl()` — never the full photo.
- Always normalize URLs with `resolveMediaUrl()` before rendering.
- Image fallbacks: client `MediaImage` only — never `onError` on `<img>` in Server Components.

## Pull requests

1. Branch from `main`.
2. `npm run verify` must pass (lint + build). Husky runs this on `git push`.
3. Describe what pages you tested in the PR body.
4. Do not commit `.env.local`, `.env`, or secrets.

## License

By contributing, you agree that your contributions will be licensed under the [Apache License 2.0](./LICENSE).

## Questions

Club contact: ccrcitclub2077@gmail.com
