# CLAUDE.md — sipmo-ecom (headless WooCommerce storefront)

Context and working notes for this project. Read this first when starting a session here.

## What this is / why it exists
A **Next.js (App Router) storefront for SIPMO** that reuses the SIPMO visual design but gets
**all catalog data from WooCommerce** running on the owner's cPanel WordPress at `sipmo.lk`.

Decided 2026-06-14 to **cut server costs**: the previous custom backend (NestJS + Prisma +
**Neon** + **Render**) cost money (Neon prompted to upgrade). WordPress + WooCommerce is already
paid for on cPanel, so it becomes the backend (products, cart, checkout, payments, orders,
customer accounts, **image storage**). This app is just the fast, pretty front end on **Vercel free**.

The original full-stack app lives in a **separate** repo `C:\Users\ghckk\project\ecom` (a Turborepo,
kept as-is as a reusable template). **This project does not depend on it.**

## Architecture (the one important seam)
Every UI component reads data through the typed functions in **`lib/catalog.ts`**
(`fetchProducts`, `fetchCategories`, `fetchProductBySlug` → `ProductSummary` / `CategoryNode` /
`ProductDetail`). Those functions call the **public WooCommerce Store API**
(`${WOO_BASE_URL}` = `https://sipmo.lk/wp-json/wc/store/v1`, **no auth keys**) and map the
responses onto the existing shapes, so the copied SIPMO components render unchanged.

- **Cart & checkout are NOT built here** — they hand off to WooCommerce. `lib/wp.ts` builds the
  links: "Add to Cart" → `${NEXT_PUBLIC_WP_URL}/?add-to-cart=<id>&quantity=<n>`; the Cart / Account
  icons link to the Woo cart / my-account pages. There is no local cart, auth, or checkout.
- **Prices** show as `Rs.` via `lib/format.ts` (`formatLKR`).
- Reads use **ISR** (`revalidate: 300`s) — light on cPanel, free-tier friendly on Vercel.

## Key files
- `lib/catalog.ts` — WooCommerce Store API adapter (the data layer).
- `lib/wp.ts` — hand-off links (add-to-cart / cart / account).
- `lib/format.ts` — `Rs.` currency.
- `app/(shop)/page.tsx` — home (hero, category circles, Featured / New Additions / Best Sellers, trust badges).
- `app/(shop)/products/page.tsx` — listing + filters (`components/product-filters.tsx`).
- `app/(shop)/products/[slug]/page.tsx` — product detail.
- `components/` — `navbar`, `mobile-menu`, `footer`, `product-card`, `category-icon`, `layout/Logo`.
- Branding tokens in `app/globals.css` (`@theme`) + `tailwind.config.ts` (SIPMO aubergine/amber/sand).

## Gotchas (learned the hard way)
- **Store API prices are in minor units.** `prices.price = "100000"` with
  `currency_minor_unit = 2` → divide by `10^2` = Rs. 1000.00 (see `toMajor`).
- **Category filtering needs the term ID, not the slug.** `fetchProducts({category: slug})`
  resolves slug → ID via `categoryIdBySlug()` then passes `?category=<id>`.
- **Best Sellers = `orderby=popularity`** (real, from Woo). New Additions = `orderby=date`.
- The Store API **product object has no `featured` field** — you can only *filter* with
  `?featured=true` (that's how the home's Featured/Deals row is built).
- **Product images live in WordPress media** (cPanel). No Cloudinary needed here.
- The Woo site still has **WooCommerce sample/demo data** (categories Bags, Music, Posters,
  Shoes…). `fetchCategories` only returns categories with `count > 0`, but demo cats will show
  until deleted in WP admin. Optional `NEXT_PUBLIC_HOME_CATEGORY_SLUGS` env can whitelist (not
  wired yet).

## Env vars
`.env.local` (and Vercel → Settings → Environment Variables):
```
NEXT_PUBLIC_WP_URL=https://sipmo.lk
WOO_BASE_URL=https://sipmo.lk/wp-json/wc/store/v1
```

## Commands
```
npm install
npm run dev      # http://localhost:3000 (or next free port)
npm run build    # production build
npx tsc --noEmit # typecheck
```

## Owner to-dos in WordPress admin (no code)
1. **Delete WooCommerce sample data** (demo categories/products) so only real ones show.
2. Assign every product a **category**; mark a few **Featured**; add **images** (WP media).
3. WooCommerce → Settings → General: currency **LKR**, symbol **"Rs."**.
4. Once live, the old `ecom` **Neon/Render** services can be paused to stop costs.

## Deploy (Vercel free)
Push to a GitHub repo → import in Vercel → set the two env vars → Deploy. Optionally point
`shop.sipmo.lk` at Vercel. WooCommerce backend stays wherever WordPress lives.
