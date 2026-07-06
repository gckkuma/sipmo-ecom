import { Headphones, Lock, RotateCcw, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { categoryVisual } from "../../components/category-icon";
import { ProductCard } from "../../components/product-card";
import {
  fetchCategories,
  fetchProducts,
  type CategoryNode,
  type ProductSummary
} from "../../lib/catalog";

export const dynamic = "force-dynamic";

const trustBadges = [
  { icon: Truck, title: "Faster Delivery", subtitle: "Islandwide, 1–5 days" },
  { icon: RotateCcw, title: "Easy Returns", subtitle: "Hassle-free returns" },
  { icon: Lock, title: "Secure Payment", subtitle: "PayHere / COD / Bank" },
  { icon: Headphones, title: "Support 24×7", subtitle: "We're here to help" }
];

async function loadHomeData(): Promise<{
  featured: ProductSummary[];
  newest: ProductSummary[];
  bestSellers: ProductSummary[];
  categories: CategoryNode[];
}> {
  const [featuredResult, newestResult, bestSellersResult, categoriesResult] =
    await Promise.allSettled([
      fetchProducts({ featured: true, limit: 12 }),
      fetchProducts({ limit: 12, sort: "date" }),
      fetchProducts({ limit: 12, sort: "popularity" }),
      fetchCategories()
    ]);

  return {
    featured: featuredResult.status === "fulfilled" ? featuredResult.value.data : [],
    newest: newestResult.status === "fulfilled" ? newestResult.value.data : [],
    bestSellers: bestSellersResult.status === "fulfilled" ? bestSellersResult.value.data : [],
    categories: categoriesResult.status === "fulfilled" ? categoriesResult.value : []
  };
}

function ProductRow({
  eyebrow,
  title,
  href,
  products,
  className
}: {
  eyebrow: string;
  title: string;
  href: string;
  products: ProductSummary[];
  className?: string;
}) {
  if (products.length === 0) return null;
  return (
    <section className={className}>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand">{eyebrow}</p>
            <h2 className="mt-1.5 text-2xl font-bold text-ink sm:text-3xl">{title}</h2>
          </div>
          <Link
            href={href}
            className="hidden shrink-0 text-sm font-semibold text-brand transition hover:text-brand-hover sm:block"
          >
            Browse all &rarr;
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <Link
          href={href}
          className="mt-6 block text-center text-sm font-semibold text-brand transition hover:text-brand-hover sm:hidden"
        >
          Browse all &rarr;
        </Link>
      </div>
    </section>
  );
}

export default async function HomePage() {
  const { featured, newest, bestSellers, categories } = await loadHomeData();

  return (
    <main>
      {/* Hero banner — product photo background with overlaid copy on the left */}
      <section className="relative isolate overflow-hidden bg-cream">
        <div className="absolute inset-0" aria-hidden="true">
          <Image
            src="/hero/hero-home-v2.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-right"
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="min-h-[170px] max-w-lg py-10 sm:min-h-0 sm:py-14 lg:py-16">
            <h1 className="hidden text-3xl font-bold leading-tight text-white [text-shadow:_0_1px_3px_rgb(0_0_0_/_45%)] sm:block sm:text-4xl lg:text-5xl">
              Shop Smarter with{" "}
              <span className="bg-gradient-to-r from-accent-amber to-accent-magenta bg-clip-text text-transparent">
                SIPMO.lk
              </span>
            </h1>
            <p className="mt-4 hidden max-w-md text-sm leading-7 text-white/90 [text-shadow:_0_1px_2px_rgb(0_0_0_/_45%)] sm:block sm:text-base">
              Sri Lanka&apos;s trusted online marketplace — tea &amp; spices, clothing, gifts,
              grocery and more. Islandwide delivery, easy payments, happy shopping.
            </p>

            <div className="hidden flex-wrap gap-3 sm:mt-6 sm:flex">
              <Link
                href="/products"
                className="inline-flex h-11 items-center justify-center rounded-md bg-accent-amber px-7 text-sm font-semibold text-brand shadow-md transition hover:brightness-105"
              >
                Shop Now
              </Link>
              <Link
                href="/products?featured=true"
                className="inline-flex h-11 items-center justify-center rounded-md border-2 border-white/90 bg-white/10 px-7 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                Today&apos;s Deals
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Category circles — prominent, directly under the banner (Kapruka-style) */}
      {categories.length > 0 ? (
        <section className="border-b border-black/5 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex gap-5 overflow-x-auto pb-1 sm:grid sm:grid-cols-4 sm:gap-4 sm:overflow-visible lg:grid-cols-8">
              {categories.map((category) => {
                const { Icon } = categoryVisual(category.slug);
                return (
                  <Link
                    key={category.id}
                    href={`/products?category=${encodeURIComponent(category.slug)}`}
                    className="group flex w-20 shrink-0 flex-col items-center gap-2 text-center sm:w-auto"
                  >
                    <span className="grid h-[72px] w-[72px] place-items-center overflow-hidden rounded-full bg-sand text-brand ring-1 ring-black/5 transition group-hover:bg-brand group-hover:text-white group-hover:shadow-md">
                      {category.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={category.imageUrl}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Icon className="h-8 w-8" aria-hidden="true" />
                      )}
                    </span>
                    <span className="text-xs font-medium leading-tight text-ink group-hover:text-brand">
                      {category.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      {/* Featured products */}
      <ProductRow
        eyebrow="Featured"
        title="Featured Products"
        href="/products?featured=true"
        products={featured}
      />

      {/* New additions */}
      <ProductRow
        eyebrow="Just in"
        title="New Additions"
        href="/products"
        products={newest}
        className="bg-sand"
      />

      {/* Best sellers */}
      <ProductRow
        eyebrow="Popular"
        title="Best Sellers"
        href="/products?featured=true"
        products={bestSellers}
      />

      {/* Store intro */}
      <section className="bg-brand">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">Everything you love, delivered</h2>
          <p className="mt-4 text-sm leading-7 text-white/80 sm:text-base">
            SIPMO.lk brings together authentic Ceylon tea &amp; spices, everyday clothing, thoughtful
            gifts, books &amp; stationery, grocery essentials, cosmetics, health &amp; wellness and
            toys &amp; games — all in one trusted Sri Lankan store. Shop with confidence: genuine
            products, secure payments and dependable islandwide delivery.
          </p>
        </div>
      </section>

      {/* Popular categories — colour tiles */}
      {categories.length > 0 ? (
        <section className="bg-sand">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand">Browse</p>
            <h2 className="mt-1.5 text-2xl font-bold text-ink sm:text-3xl">Popular Categories</h2>

            <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
              {categories.map((category) => {
                const { Icon } = categoryVisual(category.slug);
                return (
                  <Link
                    key={category.id}
                    href={`/products?category=${encodeURIComponent(category.slug)}`}
                    className="group relative flex min-h-36 flex-col justify-end overflow-hidden rounded-md bg-brand-deep p-5 shadow-sm transition hover:shadow-md"
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(160deg,rgba(94,36,99,0.85),rgba(44,12,48,0.95))] transition group-hover:opacity-90" />
                    <Icon className="absolute right-4 top-4 h-8 w-8 text-white/20" aria-hidden="true" />
                    <div className="relative">
                      <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                      <p className="mt-1 text-xs text-white/70">
                        {category.productCount}{" "}
                        {category.productCount === 1 ? "product" : "products"}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      {/* Trust badges */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8">
          {trustBadges.map(({ icon: Icon, title, subtitle }) => (
            <div key={title} className="flex items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand/10 text-brand">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-ink">{title}</p>
                <p className="truncate text-xs text-stone">{subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
