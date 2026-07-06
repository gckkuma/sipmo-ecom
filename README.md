# sipmo-ecom — headless WooCommerce storefront

A Next.js (App Router) storefront for **SIPMO** that reuses the SIPMO design and reads
its catalog from the **WooCommerce Store API** on `sipmo.lk` (WordPress on cPanel).
Cart & checkout are handled by WooCommerce — this app is the pretty, fast front end.

## How it works
- **Data**: `lib/catalog.ts` calls the public WooCommerce Store API (`/wp-json/wc/store/v1`,
  no keys) and maps products/categories onto typed shapes the UI expects. ISR caches for 5 min.
- **Cart/checkout**: `lib/wp.ts` builds hand-off links. "Add to Cart" → `?add-to-cart=<id>` on
  WooCommerce; the Cart/Account icons link to the Woo cart / my-account pages.
- **Prices**: shown in `Rs.` via `lib/format.ts`.

## Env (`.env.local`, and Vercel Project → Settings → Environment Variables)
```
NEXT_PUBLIC_WP_URL=https://sipmo.lk
WOO_BASE_URL=https://sipmo.lk/wp-json/wc/store/v1
```

## Develop
```
npm install
npm run dev      # http://localhost:3000
```

## Deploy (Vercel free tier)
1. Push this folder to a new GitHub repo.
2. Import it in Vercel → set the two env vars above → Deploy.
3. (Optional) point a subdomain like `shop.sipmo.lk` at Vercel.

## Managing the shop (in WordPress admin — no code)
- **Add/edit products**: WP admin → Products → Add New (title, price, description, **image**,
  **category**, stock). Assign each product a category so it appears in the storefront filters
  and category circles. Mark a few **Featured** to fill the home "Deals/Featured" row.
- **Delete the WooCommerce sample data** (demo categories like Bags/Music/Posters and any
  sample products) so only real categories/products show on the storefront.
- Product **images live in WordPress media** (cPanel storage) — no Cloudinary needed.
- Currency: WP admin → WooCommerce → Settings → General → LKR, symbol "Rs."
