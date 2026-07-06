import { ChevronLeft, ChevronRight, SearchX } from "lucide-react";
import Link from "next/link";
import { ProductCard } from "../../../components/product-card";
import { ProductFilters } from "../../../components/product-filters";
import { fetchCategories, fetchProducts, type CategoryNode } from "../../../lib/catalog";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 12;

type SearchParams = Record<string, string | string[] | undefined>;

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function toPositiveNumber(value: string | undefined): number | undefined {
  if (value === undefined || value.trim() === "") {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
}

/** Builds a /products URL that preserves the current filters but swaps the page. */
function buildPageHref(params: SearchParams, page: number): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    const single = firstValue(value);
    if (key !== "page" && single) {
      search.set(key, single);
    }
  }
  if (page > 1) {
    search.set("page", String(page));
  }
  const queryString = search.toString();
  return queryString ? `/products?${queryString}` : "/products";
}

export default async function ProductsPage({
  searchParams
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const category = firstValue(params.category);
  const query = firstValue(params.q)?.trim() || undefined;
  const min = toPositiveNumber(firstValue(params.min));
  const max = toPositiveNumber(firstValue(params.max));
  const inStock = firstValue(params.inStock) === "true";
  const featured = firstValue(params.featured) === "true";
  const page = Math.max(1, Number(firstValue(params.page) ?? "1") || 1);

  const [productsResult, categoriesResult] = await Promise.allSettled([
    fetchProducts({ category, search: query, min, max, inStock, featured, page, limit: PAGE_SIZE }),
    fetchCategories()
  ]);

  const products = productsResult.status === "fulfilled" ? productsResult.value.data : [];
  const meta =
    productsResult.status === "fulfilled"
      ? productsResult.value.meta
      : { page, limit: PAGE_SIZE, total: 0, totalPages: 0 };
  const categories: CategoryNode[] =
    categoriesResult.status === "fulfilled" ? categoriesResult.value : [];

  const activeCategoryName = category
    ? categories
        .flatMap(function flatten(node): CategoryNode[] {
          return [node, ...node.children.flatMap(flatten)];
        })
        .find((node) => node.slug === category)?.name
    : undefined;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="border-b border-black/10 pb-6">
        <nav className="text-xs text-stone" aria-label="Breadcrumb">
          <Link href="/" className="transition hover:text-brand">
            Home
          </Link>
          <span className="px-1.5">/</span>
          <span className="font-medium text-ink">{query ? "Search" : "Products"}</span>
        </nav>
        <h1 className="mt-3 text-2xl font-bold text-ink sm:text-3xl">
          {query ? `Results for “${query}”` : (activeCategoryName ?? "All Products")}
        </h1>
        <p className="mt-1 text-sm text-stone">
          {meta.total} {meta.total === 1 ? "product" : "products"} found
        </p>
      </header>

      <div className="mt-8 grid gap-10 lg:grid-cols-[260px_1fr]">
        <ProductFilters categories={categories} />

        <section>
          {productsResult.status === "rejected" ? (
            <div className="rounded-md border border-dashed border-danger/30 bg-danger/10 px-6 py-16 text-center">
              <p className="text-sm font-semibold text-danger">Couldn&apos;t load products</p>
              <p className="mt-1 text-sm text-danger">
                Please make sure the API is running and try again.
              </p>
            </div>
          ) : products.length === 0 ? (
            <div className="grid place-items-center rounded-md border border-dashed border-black/15 bg-white px-6 py-20 text-center">
              <div>
                <SearchX className="mx-auto h-10 w-10 text-stone/40" aria-hidden="true" />
                <p className="mt-4 text-base font-semibold text-ink">No products match</p>
                <p className="mt-1 text-sm text-stone">Try adjusting or clearing your filters.</p>
                <Link
                  href="/products"
                  className="mt-5 inline-flex h-10 items-center rounded-md bg-brand px-5 text-sm font-semibold text-white transition hover:bg-brand-hover"
                >
                  Clear filters
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 xl:grid-cols-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {meta.totalPages > 1 ? (
                <nav
                  className="mt-10 flex items-center justify-center gap-1"
                  aria-label="Pagination"
                >
                  <PageLink
                    href={buildPageHref(params, meta.page - 1)}
                    disabled={meta.page <= 1}
                    label="Previous page"
                  >
                    <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                  </PageLink>

                  {Array.from({ length: meta.totalPages }, (_, index) => index + 1).map(
                    (pageNumber) => (
                      <Link
                        key={pageNumber}
                        href={buildPageHref(params, pageNumber)}
                        aria-current={pageNumber === meta.page ? "page" : undefined}
                        className={`grid h-10 min-w-10 place-items-center rounded-md px-3 text-sm font-semibold transition ${
                          pageNumber === meta.page
                            ? "bg-brand text-white"
                            : "border border-black/10 bg-white text-ink hover:border-brand hover:text-brand"
                        }`}
                      >
                        {pageNumber}
                      </Link>
                    )
                  )}

                  <PageLink
                    href={buildPageHref(params, meta.page + 1)}
                    disabled={meta.page >= meta.totalPages}
                    label="Next page"
                  >
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </PageLink>
                </nav>
              ) : null}
            </>
          )}
        </section>
      </div>
    </main>
  );
}

function PageLink({
  href,
  disabled,
  label,
  children
}: {
  href: string;
  disabled: boolean;
  label: string;
  children: React.ReactNode;
}) {
  if (disabled) {
    return (
      <span
        aria-disabled="true"
        className="grid h-10 w-10 cursor-not-allowed place-items-center rounded-md border border-black/10 bg-black/5 text-black/30"
      >
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      aria-label={label}
      className="grid h-10 w-10 place-items-center rounded-md border border-black/10 bg-white text-ink transition hover:border-brand hover:text-brand"
    >
      {children}
    </Link>
  );
}
