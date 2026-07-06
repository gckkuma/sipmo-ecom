import { Leaf, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatLKR } from "../lib/format";
import { addToCartUrl } from "../lib/wp";
import type { ProductSummary } from "../lib/catalog";

type ProductCardProps = {
  product: ProductSummary;
};

export function ProductCard({ product }: ProductCardProps) {
  const price = product.minVariantPrice;
  const comparePrice = product.comparePrice;
  const hasDiscount = comparePrice !== null && comparePrice > price;
  const isOutOfStock = product.totalStock <= 0;

  return (
    <article className="group flex flex-col overflow-hidden rounded-md border border-black/10 bg-white shadow-sm transition hover:border-brand/40 hover:shadow-md">
      <Link
        href={`/products/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-brand-100"
        aria-label={product.name}
      >
        {product.primaryImage ? (
          <Image
            src={product.primaryImage.url}
            alt={product.primaryImage.altText ?? product.name}
            fill
            sizes="(min-width: 1024px) 16vw, (min-width: 768px) 33vw, 50vw"
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <span className="grid h-full w-full place-items-center text-brand/40">
            <Leaf className="h-12 w-12" aria-hidden="true" />
          </span>
        )}
        {hasDiscount ? (
          <span className="absolute left-3 top-3 rounded-full bg-accent-magenta px-2.5 py-1 text-xs font-bold text-white">
            Sale
          </span>
        ) : null}
        {isOutOfStock ? (
          <span className="absolute right-3 top-3 rounded-full bg-ink/80 px-2.5 py-1 text-xs font-semibold text-white">
            Out of stock
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        {product.category.name ? (
          <p className="text-xs font-medium uppercase tracking-[0.1em] text-stone/70">
            {product.category.name}
          </p>
        ) : null}
        <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-ink">
          <Link href={`/products/${product.slug}`} className="transition hover:text-brand">
            {product.name}
          </Link>
        </h3>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-base font-bold text-brand-deep">{formatLKR(price)}</span>
          {hasDiscount ? (
            <span className="text-sm font-medium text-stone/60 line-through">
              {formatLKR(comparePrice)}
            </span>
          ) : null}
        </div>

        {/* Hand off to the WooCommerce cart (full-page navigation to WordPress). */}
        <a
          href={isOutOfStock ? `/products/${product.slug}` : addToCartUrl(product.id, 1)}
          className={`mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold shadow-sm transition ${
            isOutOfStock
              ? "cursor-not-allowed bg-black/10 text-stone"
              : "bg-accent-green text-white hover:bg-accent-green/90"
          }`}
        >
          <ShoppingBag className="h-4 w-4" aria-hidden="true" />
          {isOutOfStock ? "Unavailable" : "Add to Cart"}
        </a>
      </div>
    </article>
  );
}
