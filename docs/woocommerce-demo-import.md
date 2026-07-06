# Add the 8-category marketplace demo products (WooCommerce CSV import)

Goal: make the storefront look like a full marketplace (Tea & Spices + Clothing, Gift Items,
Books & Stationery, Grocery, Cosmetics, Health & Wellness, Toys & Games) even though only tea is
real yet — same as the original build. The demo products live in **WooCommerce**; import them once
with the built-in CSV importer (it auto-creates the categories and pulls the placeholder images).

## Import the CSV
1. Download **`docs/woocommerce-demo-products.csv`** from this repo (or GitHub → the file → Download raw).
2. WordPress admin (`https://www.sipmo.lk/wp-admin`) → **Products → Import** → **Choose file** → select the CSV → **Continue**.
3. On the mapping screen, leave the auto-mapped columns as-is → **Run the importer**.
4. Wait — it creates **21 products** across the **7 new categories** and sideloads the placeholder
   images (may take a minute). Tea & Spices is untouched.

## After import — verify
- **Products → Categories** should now list all 8 (Tea & Spices + the 7 new ones).
- Each new category has ~3 products; a few are marked **Featured**.

Then **tell the assistant** — it will read the real category slugs from the Store API and update
the storefront's `NEXT_PUBLIC_HOME_CATEGORY_SLUGS` (on Vercel) so all 8 category circles appear in
the right order.

## Notes
- These are **placeholders** (grey/coloured images, sample copy). Replace them with real products
  and photos in WP admin whenever you add those ranges — or delete a category's demo products if you
  don't stock it yet.
- Prices import in your store currency (Rs.). Sale prices show a "Sale" badge on the storefront.
- If any images fail to sideload (placehold.co occasionally rate-limits), just re-run the import or
  set the image manually on that product.
