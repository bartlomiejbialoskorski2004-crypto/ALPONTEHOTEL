# Al Ponte — Hotel landing page

Boutique hotel landing page built with **Next.js 15 (App Router) + TypeScript + Tailwind CSS v4 + Motion + Sanity**, ready to deploy to Vercel.

The current page is intentionally minimal — a sticky header, a hero and a contact section — so content and additional sections (rooms, dining, gallery, booking flow) can be added without refactoring.

## Tech

- Next.js 15 (App Router) + React 19
- TypeScript (strict)
- Tailwind CSS v4 (CSS-first config via `@theme` in `app/globals.css`)
- Motion (`motion/react`) for subtle entrance + scroll animations
- `next-intl` with locales **IT (default), EN, PL, FR, DE**
- Sanity v3 — embedded Studio at `/studio`, content fetched from CDN
- SEO defaults: per-locale metadata, hreflang alternates, `robots.txt`, `sitemap.xml`
- Security headers: `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`

## Quick start (local)

Requires **Node ≥ 20** and **pnpm 10**.

```bash
pnpm install
cp .env.local.example .env.local   # then fill in the values
pnpm dev
```

- Site: <http://localhost:3000>
- Sanity Studio: <http://localhost:3000/studio>

The site works without Sanity configured — it falls back to copy in `messages/*.json`. Once `NEXT_PUBLIC_SANITY_PROJECT_ID` is set and a `hotel` document exists, the site renders Sanity content.

## Deploy on Vercel

### One-time setup

1. Push to GitHub (already done — `main` branch).
2. Go to <https://vercel.com/new> and **Import** the `ALPONTEHOTEL` repository.
3. Vercel auto-detects:
   - Framework: **Next.js**
   - Build command: `next build`
   - Package manager: **pnpm** (from `pnpm-lock.yaml` and the `packageManager` field in `package.json`)
   - Node version: **20.x** (from `.nvmrc` + `engines` in `package.json`)
4. Add **Environment Variables** (copy values from your `.env.local`):

   | Name | Example | Required? |
   |---|---|---|
   | `NEXT_PUBLIC_SANITY_PROJECT_ID` | `abc12345` | optional (build still passes if empty) |
   | `NEXT_PUBLIC_SANITY_DATASET` | `production` | optional |
   | `NEXT_PUBLIC_SANITY_API_VERSION` | `2025-01-01` | optional |
   | `NEXT_PUBLIC_SITE_URL` | `https://alpontehotel.vercel.app` | recommended (used for canonical URLs / sitemap) |

5. Click **Deploy**. First build typically takes ~2 min.

### After first deploy

1. In <https://www.sanity.io/manage> → your project → **API → CORS origins**, add both URLs **with credentials enabled**:
   - `https://<your-project>.vercel.app`
   - your custom domain (if any)
   Without this, `/studio` will fail to authenticate.
2. Visit `/studio` in production, sign in with Google/GitHub, create the singleton `hotel` document — content goes live instantly.
3. Set a custom domain in Vercel (Settings → Domains) and update `NEXT_PUBLIC_SITE_URL` to match.

## Assets

Drop these two files into `public/` to replace the SVG placeholders:

- `public/logo.svg` — circular "AP" monogram
- `public/hero.svg` — main hero background (or swap to `hero.jpg`/`.png` and update [components/Hero.tsx:32](components/Hero.tsx#L32))

Optionally also override `app/icon.svg` (favicon).

Once `heroImage` is set on the `hotel` document in Sanity, it takes precedence over `public/hero.svg`.

## Project structure

```
app/
  [locale]/        # localized pages (IT / EN / PL / FR / DE)
  studio/          # embedded Sanity Studio at /studio
  robots.ts        # robots.txt route
  sitemap.ts       # sitemap.xml route (all locales)
components/        # Header, Hero, Contact, BookNowButton, LocaleSwitcher, MobileMenu
i18n/              # next-intl routing, navigation, request config
messages/          # JSON translations per locale
sanity/            # client, image builder, schema types, GROQ queries
public/            # logo.svg, hero.svg, etc.
```

## Scripts

- `pnpm dev` — dev server
- `pnpm build` — production build
- `pnpm start` — run production build
- `pnpm typecheck` — TypeScript check, no emit
- `pnpm lint` — Next.js lint
