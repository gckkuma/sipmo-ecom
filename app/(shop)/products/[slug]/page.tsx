import { Check, ShoppingBag, Star, X } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatLKR } from "../../../../lib/format";
import { addToCartUrl } from "../../../../lib/wp";
import { fetchProductBySlug } from "../../../../lib/catalog";

export const revalidate = 300;

type Params = { slug: string };

export async function generateMetadata({
  params
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug).catch(() => null);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.shortDescription
      ? product.shortDescription.replace(/<[^>]*>/g, " ").trim().slice(0, 160)
      : undefined
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug).catch(() => null);
  if (!product) notFound();

  const hasDiscount = product.comparePrice !== null && product.comparePrice > product.basePrice;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="text-xs text-stone" aria-label="Breadcrumb">
        <Link href="/" className="transition hover:text-brand">
          Home
        </Link>
        <span className="px-1.5">/</span>
        <Link href="/products" className="transition hover:text-brand">
          Products
        </Link>
        {product.category.name ? (
          <>
            <span className="px-1.5">/</span>
            <Link
              href={`/products?category=${encodeURIComponent(product.category.slug)}`}
              className="transition hover:text-brand"
            >
              {product.category.name}
            </Link>
          </>
        ) : null}
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-2 lg:gap-12">
        {/* Gallery */}
        <div>
          <div className="relative aspect-square overflow-hidden rounded-lg border border-black/10 bg-brand-100">
            {product.images[0] ? (
              <Image
                src={product.images[0].url}
                alt={product.images[0].altText ?? product.name}
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
              />
            ) : (
              <span className="grid h-full w-full place-items-center text-brand/30">
                <ShoppingBag className="h-16 w-16" aria-hidden="true" />
              </span>
            )}
            {hasDiscount ? (
              <span className="absolute left-4 top-4 rounded-full bg-accent-magenta px-3 py-1 text-xs font-bold text-white">
                Sale
              </span>
            ) : null}
          </div>
          {product.images.length > 1 ? (
            <div className="mt-3 grid grid-cols-5 gap-2">
              {product.images.slice(0, 5).map((image) => (
                <div
                  key={image.id}
                  className="relative aspect-square overflow-hidden rounded-md border border-black/10 bg-brand-100"
                >
                  <Image
                    src={image.url}
                    alt={image.altText ?? product.name}
                    fill
                    sizes="20vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {/* Info */}
        <div>
          {product.category.name ? (
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-stone/70">
              {product.category.name}
            </p>
          ) : null}
          <h1 className="mt-1.5 text-2xl font-bold text-ink sm:text-3xl">{product.name}</h1>

          {product.reviewCount > 0 && product.avgRating ? (
            <div className="mt-2 flex items-center gap-1.5 text-sm text-stone">
              <span className="flex items-center gap-0.5 text-accent-amber">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4"
                    fill={i < Math.round(product.avgRating!) ? "currentColor" : "none"}
                    aria-hidden="true"
                  />
                ))}
              </span>
              <span>({product.reviewCount})</span>
            </div>
          ) : null}

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-bold text-brand-deep">{formatLKR(product.basePrice)}</span>
            {hasDiscount ? (
              <span className="text-lg font-medium text-stone/60 line-through">
                {formatLKR(product.comparePrice!)}
              </span>
            ) : null}
          </div>

          <p
            className={`mt-3 inline-flex items-center gap-1.5 text-sm font-medium ${
              product.inStock ? "text-accent-green" : "text-danger"
            }`}
          >
            {product.inStock ? (
              <>
                <Check className="h-4 w-4" aria-hidden="true" /> In stock
              </>
            ) : (
              <>
                <X className="h-4 w-4" aria-hidden="true" /> Out of stock
              </>
            )}
          </p>

          {product.shortDescription ? (
            <div
              className="prose-sipmo mt-5 text-sm leading-6 text-stone [&_strong]:text-ink"
              dangerouslySetInnerHTML={{ __html: product.shortDescription }}
            />
          ) : null}

          {/* Add to cart — hands off to the WooCommerce cart */}
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={product.inStock ? addToCartUrl(product.id, 1) : "#"}
              aria-disabled={!product.inStock}
              className={`inline-flex h-12 items-center justify-center gap-2 rounded-md px-8 text-sm font-semibold shadow-sm transition ${
                product.inStock
                  ? "bg-accent-green text-white hover:bg-accent-green/90"
                  : "pointer-events-none cursor-not-allowed bg-black/10 text-stone"
              }`}
            >
              <ShoppingBag className="h-4 w-4" aria-hidden="true" />
              {product.inStock ? "Add to Cart" : "Unavailable"}
            </a>
            <a
              href={product.permalink}
              className="inline-flex h-12 items-center justify-center rounded-md border-2 border-brand/40 px-8 text-sm font-semibold text-brand transition hover:bg-brand/5"
            >
              Buy Now
            </a>
          </div>
          <p className="mt-2 text-xs text-stone/70">
            Secure checkout is handled on sipmo.lk (PayHere, Cash on Delivery or Bank Transfer).
          </p>

          {/* Full description */}
          {product.description ? (
            <div
              className="prose-sipmo mt-8 border-t border-black/10 pt-6 text-sm leading-6 text-stone [&_strong]:text-ink"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          ) : null}

          {/* Attributes */}
          {product.attributes.length > 0 ? (
            <table className="mt-6 w-full text-sm">
              <tbody>
                {product.attributes.map((attr) => (
                  <tr key={attr.key} className="border-b border-black/5">
                    <th className="py-2 pr-4 text-left font-medium text-ink">{attr.key}</th>
                    <td className="py-2 text-stone">{attr.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : null}
        </div>
      </div>
    </main>
  );
}
