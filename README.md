# Al Ponte — Hotel landing page

Boutique hotel landing page built with **Next.js 15 (App Router) + TypeScript + Tailwind CSS v4 + Motion + Sanity**, ready to deploy to Vercel.

The current page is intentionally minimal — a hero and a contact section — so content and additional sections (rooms, dining, gallery, booking flow) can be added without refactoring.

## Tech

- Next.js 15 (App Router) + React 19
- TypeScript
- Tailwind CSS v4 (CSS-first config via `@theme` in `app/globals.css`)
- Motion (`motion/react`) for subtle entrance + scroll animations
- `next-intl` with locales **IT (default), EN, PL, FR, DE**
- Sanity v3 — embedded Studio at `/studio`, content fetched from CDN

## Quick start

```bash
pnpm install
cp .env.local.example .env.local   # then fill in NEXT_PUBLIC_SANITY_PROJECT_ID
pnpm dev
```

- Site: <http://localhost:3000>
- Sanity Studio: <http://localhost:3000/studio>

The site works without Sanity configured — it falls back to copy in `messages/*.json`. Once `NEXT_PUBLIC_SANITY_PROJECT_ID` is set and a `hotel` document exists, the site renders Sanity content.

## Assets

Drop these two files into `public/` to replace the SVG placeholders:

- `public/logo.svg` — circular "AP" monogram (current placeholder is a rough approximation; replace with the brand mark)
- `public/hero.svg` — main hero background; you can keep `.svg` or swap to a JPG/PNG. If you change the extension, update [components/Hero.tsx:32](components/Hero.tsx#L32).

Optionally, also override `app/icon.svg` (favicon).

Once `heroImage` is set on the `hotel` document in Sanity, it takes precedence over `public/hero.svg`.

## Deploy on Vercel

1. Push to Git, import the repo in Vercel.
2. Set env vars (same three as `.env.local.example`).
3. In <https://www.sanity.io/manage>, add the Vercel preview + production URLs to **CORS origins** (with credentials).

## Project structure

```
app/
  [locale]/        # localized pages (IT / EN / PL / FR / DE)
  studio/          # embedded Sanity Studio at /studio
components/        # Header, Hero, Contact, BookNowButton, LocaleSwitcher, MobileMenu
i18n/              # next-intl routing, navigation, request config
messages/          # JSON translations per locale
sanity/            # client, image builder, schema types, GROQ queries
```

## Scripts

- `pnpm dev` — dev server
- `pnpm build` — production build
- `pnpm start` — run production build
- `pnpm typecheck` — TypeScript check, no emit
