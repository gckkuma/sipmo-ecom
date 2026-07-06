# WooCommerce setup instructions (for Claude for Chrome)

Paste everything below into the **Claude for Chrome** extension while you have the WordPress
admin (`https://sipmo.lk/wp-admin`) open and are logged in. It cleans up the demo data and
organises the real tea products so the headless storefront (Vercel) looks right.

---

## CURRENT STATE (2026-06-14) — start here
The demo data is already deleted. Live WooCommerce now has **15 products (all "ANEW Ceylon Tea")**
and only the **Uncategorized** category. Three things remain:
1. **Delete 3 duplicate products** (see Task 2b) — there should be **12 unique**, not 15.
2. **Create the "Tea & Spices" category** and **assign all 12 products** to it (Task 3 + Task 4).
   The storefront is set to only show the `tea-and-spices` category, so this is required for the
   home category circle to appear.
3. **Add a product image** to each product (Task 4, step 4).
Tasks 1 (settings) and the demo-deletion parts are already done — you can skip those.

## Context for the agent
`sipmo.lk` runs **WordPress + WooCommerce**. A separate Next.js storefront reads WooCommerce's
public **Store API** and shows the products. Right now WooCommerce still contains **default
sample/demo data** (categories like Bags, Music, Posters, Shoes, and sample products like
T-Shirt, Hoodie, Beanie, Album…). The only **real** products are the ones whose names start with
**"ANEW Ceylon Tea"** (12 tea products). Your job: remove the demo data and organise the real
products. Work carefully; **only touch products/categories** — do not deactivate plugins, delete
WooCommerce pages (Cart/Checkout/My Account), or change themes.

## Task 1 — WooCommerce general settings
1. Go to **WooCommerce → Settings → General**.
2. Set **Currency** = **Sri Lankan rupee (LKR)**.
3. Set **Currency position** = Left, **Thousand separator** = `,`, **Decimal separator** = `.`,
   **Number of decimals** = `2`.
4. If there is a custom currency-symbol option, make it show **Rs.** (otherwise leave default).
5. **Save changes.**
6. Go to **Settings → Permalinks**, choose **Post name**, and **Save** (needed for clean URLs +
   the Store API).

## Task 2 — Delete the demo PRODUCTS
1. Go to **Products → All Products**.
2. Select **every product whose name does NOT start with "ANEW Ceylon Tea"** (these are WooCommerce
   samples: Album, Single, Beanie, Belt, Cap, Hoodie, Long Sleeve Tee, Polo, Sunglasses, T-Shirt,
   V-Neck T-Shirt, WordPress Pennant, etc.).
3. In **Bulk actions**, choose **Move to Trash**, then **Apply**.
4. Open **Products → All Products → Trash** and **Empty trash** (Delete permanently).
5. **Do NOT delete** any product starting with "ANEW Ceylon Tea".

## Task 2b — Delete DUPLICATE tea products
There are 15 products but only 12 are unique. In **Products → All Products**, sort by Name and
find the pairs with identical names. **Delete exactly one copy** of each of these three:
- **ANEW Ceylon Tea – BOPF 100 TB Black Tea 200g** (keep one, trash the other)
- **ANEW Ceylon Tea – Green Tea Premium Fanning's 25 TB** (keep one, trash the other)
- **ANEW Ceylon Tea – Green Tea Fanning's 100 TB** (keep one, trash the other)
Then **empty Trash**. Result: **12** ANEW products remain.
(Note: "BOPF 100 TB Black Tea 200g" and "BOPF 100 TB **Premium** Black Tea 200g" are DIFFERENT
products — keep both of those.)

## Task 3 — Delete the demo CATEGORIES
1. Go to **Products → Categories**.
2. Delete **every category except**: **Tea & Spices** (if present) and the default **Uncategorized**
   (Uncategorized can't be deleted — that's fine). Delete Albums, Bags, Booking, Music, Posters,
   Shoes, Sweaters, Men, Clothing, Decor, Hoodies, Tshirts, Accessories, etc.
3. If a **Tea & Spices** category does **not** exist, create it: **Add new category**, Name =
   `Tea & Spices` (WordPress will set the slug to `tea-and-spices`).

## Task 4 — Organise the 12 ANEW tea products
For **each** product whose name starts with "ANEW Ceylon Tea" (Products → All Products → open it):
1. **Product categories** (right side): tick **Tea & Spices**. Untick anything else.
2. **Product data → General**: confirm a **Regular price** is set. If a product has **no price**,
   set the Regular price to **1000**. (Expected prices are listed in the table below.)
3. **Product data → Inventory**: make sure **Stock status = In stock**.
4. **Product image** (right side): if you have a photo, **Set product image** (upload from the
   catalog). If not, leave it for now.
5. For these **4 products**, tick **Featured** (Products list → hover the star, or in Quick Edit):
   the 1KG black tea, the "100 TB Premium" black tea, the Green Tea 100 TB, and the 500G Loose.
6. **Update** each product.

### Expected prices (Rs.) — set the price if any product is missing one
| Product (name contains) | Price |
|---|---|
| Green Tea … 100 TB … 200g (GTF) | 1000 |
| BOPF … 100 TB Premium … 200g | 1000 |
| BOPF Black Tea 1KG | 2000 |
| BOPF Black Tea 500G (foil) | 1100 |
| BOPF … 200G Loose | 450 |
| BOPF … 500G Loose | 1200 |
| BOPF … 100 TB Catering Pack 200g | 620 |
| BOPF … 100g Loose | 270 |
| BOPF … 100 TB … 200g (standard) | 1000 |
| BOPF … 50g Loose | 140 |
| BOPF … 25 TB Premium … 50g | 370 |
| Green Tea Premium … 25 TB … 50g | 1000 |

## Task 5 — Verify
1. Visit **`https://sipmo.lk/wp-json/wc/store/v1/products/categories`** in the browser — it should
   list **Tea & Spices** (and Uncategorized), **not** the demo categories.
2. Visit **`https://sipmo.lk/wp-json/wc/store/v1/products?per_page=20`** — it should return only the
   ~12 ANEW tea products, each with `categories` containing Tea & Spices and a non-zero `price`.
3. Test a purchase path: open a product on `sipmo.lk`, click **Add to cart**, and confirm the
   WooCommerce **Cart** and **Checkout** pages load.

## Acceptance criteria (report back)
- Only **ANEW Ceylon Tea** products remain; all demo products deleted.
- Only **Tea & Spices** (+ Uncategorized) categories remain; all ANEW products are in Tea & Spices.
- Every product has a price and is **In stock**; ~4 are **Featured**.
- Currency is **LKR** with 2 decimals; permalinks = **Post name**.
- The two Store API URLs above return the clean data.

## Do NOT
- Do not deactivate/delete WooCommerce or any plugin.
- Do not delete the **Cart / Checkout / My Account / Shop** pages.
- Do not switch or delete the active theme.
- Do not delete products that start with "ANEW Ceylon Tea".
