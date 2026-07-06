/** Links into the WooCommerce (WordPress) site for cart/checkout hand-off. */
const WP_URL = (process.env.NEXT_PUBLIC_WP_URL ?? "https://sipmo.lk").replace(/\/$/, "");

export function wpUrl(): string {
  return WP_URL;
}

/** Adds a product to the WooCommerce cart and lands the customer on the Woo cart page. */
export function addToCartUrl(productId: string | number, quantity = 1): string {
  return `${WP_URL}/cart/?add-to-cart=${productId}&quantity=${quantity}`;
}

export function cartUrl(): string {
  return `${WP_URL}/cart/`;
}

export function accountUrl(): string {
  return `${WP_URL}/my-account/`;
}
