# Fix the WooCommerce cart/checkout & demo mess (for Claude for Chrome)

Paste this into **Claude for Chrome** while logged in at `https://sipmo.lk/wp-admin`.

## Problem
When a customer clicks **Add to cart** on `sipmo.lk`, they land on a messy page: leftover
**Flatsome demo content** (pages full of raw `[ux_slider] [button] [ux_banner]…` shortcodes), a
huge demo menu, and the store is in **"Store coming soon"** mode. The real WooCommerce **Cart /
Checkout / My-account** pages need to load cleanly instead. A separate Next.js storefront is the
customer-facing catalog; WordPress only needs to handle **cart, checkout, and account** — those
must work and look clean.

Work only on themes, pages, menus, posts, widgets and WooCommerce settings. **Do not deactivate or
delete the WooCommerce plugin, and do not delete the ANEW tea products.**

## Task 1 — Turn OFF "Store coming soon"
1. In the top admin bar there is a **"Store coming soon"** badge. Go to **WooCommerce → Settings →
   General** (or **Settings → Site visibility**) and set the site/store to **Live** (turn Coming
   soon **off**). Save.

## Task 2 — Activate a clean theme (Storefront)
The demo pages show raw shortcodes because the Flatsome builder isn't rendering. Use WooCommerce's
own clean theme so cart/checkout look right:
1. **Appearance → Themes → Add New Theme** → search **"Storefront"** (by Automattic/WooCommerce) →
   **Install** → **Activate**.
2. (If the owner prefers to keep Flatsome instead, activate **Flatsome** here rather than
   Storefront — either works, but do NOT leave a broken/half-active theme.)

## Task 3 — Make sure the WooCommerce pages exist and are assigned
1. **WooCommerce → Status → Tools →** run **"Create default WooCommerce pages"** (this recreates
   Cart, Checkout, My account, Shop if missing).
2. **WooCommerce → Settings → Advanced → Page setup**: set **Cart page = Cart**, **Checkout page =
   Checkout**, **My account page = My account**. Save.
3. Open **Pages** and check each of these contains the right block/shortcode; if a page shows demo
   junk, replace its entire content with the shortcode and Update:
   - **Cart** → `[woocommerce_cart]`
   - **Checkout** → `[woocommerce_checkout]`
   - **My account** → `[woocommerce_my_account]`

## Task 4 — Delete the Flatsome demo pages
1. **Pages → All Pages**. Move to Trash every demo page, e.g.: *Classic Shop, Sample Page, test,
   Left Sidebar, Maintenance, Portfolio, Video Cover, Lightbox, Scroll To, Map, Message box,
   Countdown, Accordion, Flip Book, Forms, Hotspot, Price table, Team Member, Testimonials, Tabs,
   Product Categories, Share / follow icons, Size Chart, FAQ, Our Stores, Video Cover*, and any
   other Flatsome demo page whose content is `[…]` shortcodes.
2. **KEEP only**: Cart, Checkout, My account, Shop (and optionally Track your order, Contact).
3. **Empty Trash** (Pages → Trash → Empty).

## Task 5 — Clean the navigation menu
1. **Appearance → Menus**. Remove all the demo items (Blog, Sample Page, test, Left Sidebar,
   Portfolio, Pages, Countdown, Accordion, etc.).
2. Keep a short menu: **Shop, Cart, My account** (Home optional). Save.

## Task 6 — Remove demo posts, comments, widgets
1. **Posts → All Posts**: trash the demo posts (*Hello world!, A Simple Blog Post, A Video Blog
   Post, Just another post…*). Empty trash.
2. **Comments**: delete the demo comment from *"A WordPress Commenter"*.
3. **Appearance → Widgets**: remove demo widgets (Recent Posts, Recent Comments, Tag Cloud,
   Archives, demo Categories) from the sidebar/footer so cart/checkout pages look clean.

## Task 7 — Test the purchase flow
1. Visit a product page on `https://sipmo.lk` (e.g. any ANEW tea) → click **Add to cart**.
2. Confirm the **Cart** page shows a clean cart: the product, quantity, and total in **Rs.**, with
   a **Proceed to checkout** button.
3. Click **Proceed to checkout** → the **Checkout** page loads with the billing form and payment
   options (COD / Bank Transfer / PayHere if configured).

## Acceptance criteria (report back)
- "Store coming soon" is **off** (store is Live).
- A clean theme is active; **no raw `[shortcode]` text** appears on any kept page.
- **Add to cart → Cart → Checkout** all render cleanly, totals in **Rs.**
- Only Cart / Checkout / My account / Shop pages remain (demo pages deleted).
- Menu is short and clean; demo posts/comments/widgets removed.

## Do NOT
- Do not deactivate/delete WooCommerce or its plugin.
- Do not delete the **ANEW Ceylon Tea** products or the **Tea & Spices** category.
- Do not delete the Cart / Checkout / My account / Shop pages.
