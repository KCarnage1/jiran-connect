# Sanad · Jiran Connect

A privacy-first UAE community platform connecting locals and newcomers through verified majlis, real gatherings and cultural exchange. Arabic-first, fully bilingual, Glass UI.

**Live demo:** https://kcarnage1.github.io/jiran-connect/

## Stack

- **Next.js 16** (App Router, Turbopack, Cache Components) + **React 19** + TypeScript strict
- **Tailwind CSS v4** — CSS-first design tokens (`src/app/globals.css`), no `tailwind.config.ts`
- **Framer Motion**, **Lucide**, **react-day-picker**, **react-leaflet**, **Tiptap**, **Recharts**
- **Supabase** (Auth · PostgreSQL · RLS) via `@supabase/supabase-js` + `@supabase/ssr`

## Run

```bash
npm install
npm run dev     # http://localhost:3000
```

Open the app: the landing page is public, and the app shell starts with a demo session
(`layla@example.ae`, admin role) so every screen is explorable immediately. Sign out to see
the real auth flow.

### Environment

Copy `.env.example` to `.env.local` and fill in what you need:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public anon key (RLS enforced) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only admin operations |
| `UAE_PASS_HASH_PEPPER` | Server-side pepper for Emirates ID hashing (min 16 chars) |
| `NEXT_PUBLIC_UAE_PASS_HASH_PEPPER` | Pepper for the static build, where hashing runs in the browser |
| `AI_API_KEY` | Model key for the assistant (Phase 6 integration point) |

`UAE_PASS_HASH_PEPPER` is required for the verification flow. A random value is already in
`.env.local` for local development; rotate it per environment (bump `pepper_version`). The
static (GitHub Pages) build has no server, so it hashes in the browser and ships
`NEXT_PUBLIC_UAE_PASS_HASH_PEPPER` in the bundle — that value is a demo salt, not a secret.

## Database

The complete schema, indexes, RLS policies and RPCs live in
[`supabase/migrations/0001_sanad_core.sql`](supabase/migrations/0001_sanad_core.sql).

```bash
supabase link --project-ref <your-ref>
supabase db push
```

Highlights:

- Every table has `ENABLE ROW LEVEL SECURITY` with explicit policies; no table is public by default.
- `uae_pass_verifications` stores **only** `sha256(id + pepper)`, status and timestamps. The
  `id_hash` column privilege is revoked from `authenticated`/`anon`, so even a valid JWT cannot read it.
- Staff checks run through `SECURITY DEFINER` helpers (`is_admin`, `is_staff`,
  `can_manage_community`) to avoid RLS recursion; role/status changes are enforced by triggers.
- RSVPs are written through `rsvp_to_event()`, which locks the event row and auto-waitlists at capacity.
- `moderation_actions` is an append-only audit log (no UPDATE/DELETE policy exists).

## Deploy

The site is a static export (`output: "export"`) deployed to GitHub Pages by
[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) on every push to `main`.

```bash
GITHUB_PAGES=true npm run build   # emits out/, with the /jiran-connect base path
```

Locally `npm run dev` and `npm run build` stay at the root path; only the Pages build sets
`GITHUB_PAGES=true`, which adds the `/jiran-connect` base path and disables Cache Components
(PPR is not supported in export mode).

## What is built

| Area | Route |
| --- | --- |
| Landing page (hero, bento grid, how it works, footer) | `/` |
| Auth: login, register, forgot password | `/login`, `/register`, `/forgot-password` |
| App shell: sidebar, mobile bottom nav, AI drawer | all app routes |
| Home dashboard | `/home` |
| Find community (search + emirate/category filters) | `/community` |
| New to town playbook | `/new-to-town` |
| Majlis discovery + detail | `/majlis`, `/majlis/[slug]` |
| Events discovery (GlassCalendar) + detail (GlassMap, RSVP) | `/events`, `/events/[slug]` |
| Cultural exchange + detail (GlassEditor story composer) | `/culture`, `/culture/[slug]` |
| Profile, privacy & data export | `/profile` |
| UAE PASS verification (mocked, hash-only) | `/verify` |
| Admin & moderation (RBAC, bento stats, Recharts, queue, log) | `/admin` |
| Legal pages | `/legal/[slug]` |

## Architecture notes

- **Demo data layer** — `src/lib/data.ts` is the single source of mock content. Every page reads
  from it, so swapping to live Supabase queries is local to that module.
- **State** — locale, theme, session and verification records are external stores consumed with
  `useSyncExternalStore` (`src/lib/browser-store.ts`), which avoids render-cascading effects and
  keeps RTL/theme/dark mode instant.
- **Library overrides** — `GlassCalendar`, `GlassMap`, `GlassEditor` replace every default style
  with the Glass recipe; Leaflet's chrome is overridden in `globals.css`.
- **RTL** — layouts use CSS logical properties only; `dir` flips on `<html>` and every screen
  mirrors without a second stylesheet.
- **Next 16 specifics** — dynamic routes export `generateStaticParams`, so every route is
  prerendered. The document is rendered with Arabic/light defaults and the providers hydrate the
  saved locale, theme and session from cookies on the client, which is what lets the whole app be
  exported statically without a hydration mismatch.

## Known limitations

- Supabase is wired but not connected: no project credentials exist yet, so auth and writes are
  demo-mode (localStorage). The SQL migration has not been executed against a live database.
- The AI assistant streams a local, rule-based answer (`answerFor()` in
  `src/components/shell/AiAssistant.tsx`); replace it with a server-streamed model call.
- UAE PASS is mocked end to end; only the hashing contract is production-shaped.
