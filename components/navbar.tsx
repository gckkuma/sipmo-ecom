import Form from "next/form";
import Link from "next/link";
import {
  ChevronDown,
  LayoutGrid,
  Search,
  ShoppingCart,
  Sparkles,
  Tag,
  Truck,
  UserRound
} from "lucide-react";
import { categoryVisual } from "./category-icon";
import { Logo } from "./layout/Logo";
import { MobileMenu } from "./mobile-menu";
import { fetchCategories, type CategoryNode } from "../lib/catalog";
import { accountUrl, cartUrl } from "../lib/wp";

async function loadCategories(): Promise<CategoryNode[]> {
  try {
    return await fetchCategories();
  } catch {
    return [];
  }
}

const stripLinks = [
  { label: "Deals", href: "/products?featured=true", icon: Tag },
  { label: "New Arrivals", href: "/products", icon: Sparkles },
  { label: "Track Order", href: accountUrl(), icon: Truck, external: true }
];

export async function Navbar() {
  const categories = await loadCategories();

  return (
    <header className="sticky top-0 z-30">
      {/* Tier 1 — aubergine bar with logo, search, account, cart */}
      <div className="bg-brand text-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6 lg:gap-6 lg:px-8">
          <MobileMenu categories={categories} />

          <Logo variant="full" theme="dark" height={36} priority className="hidden sm:block" />
          <Logo variant="mark" theme="dark" height={36} priority className="sm:hidden" />

          <Form action="/products" className="relative mx-1 hidden flex-1 md:block lg:mx-3">
            <input
              type="search"
              name="q"
              placeholder="Search for products..."
              className="h-11 w-full rounded-md bg-white pl-4 pr-12 text-sm text-ink outline-none transition focus:ring-2 focus:ring-accent-amber"
            />
            <button
              type="submit"
              aria-label="Search"
              className="absolute right-1.5 top-1.5 grid h-8 w-9 place-items-center rounded-md bg-accent-amber text-brand transition hover:brightness-105"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
            </button>
          </Form>

          <div className="ml-auto flex items-center gap-4 md:ml-0">
            <a
              href={accountUrl()}
              className="flex items-center gap-2 text-sm font-medium text-white transition hover:text-white/80"
              aria-label="Account"
            >
              <UserRound className="h-6 w-6" aria-hidden="true" />
              <span className="hidden sm:inline">Account</span>
            </a>
            <span className="hidden h-6 w-px bg-white/20 sm:block" />
            <a
              href={cartUrl()}
              className="flex items-center gap-2 text-sm font-medium text-white transition hover:text-white/80"
              aria-label="Cart"
            >
              <ShoppingCart className="h-6 w-6" aria-hidden="true" />
              <span className="hidden sm:inline">Cart</span>
            </a>
          </div>
        </div>
      </div>

      {/* Tier 2 — category mega-button + quick links */}
      <div className="hidden border-t border-white/10 border-b border-black/5 bg-cream/95 shadow-sm backdrop-blur lg:block">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-2 px-4 sm:px-6 lg:px-8">
          <div className="group relative mr-2">
            <Link
              href="/products"
              className="flex items-center gap-2 rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-hover group-hover:bg-brand-hover"
            >
              <LayoutGrid className="h-4 w-4" aria-hidden="true" />
              All Categories
              <ChevronDown className="h-4 w-4" aria-hidden="true" />
            </Link>

            {categories.length > 0 ? (
              <div className="invisible absolute left-0 top-full z-40 w-64 pt-2 opacity-0 transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                <ul className="overflow-hidden rounded-md border border-black/10 bg-white py-2 shadow-lg">
                  {categories.map((category) => {
                    const { Icon, circle } = categoryVisual(category.slug);
                    return (
                      <li key={category.id}>
                        <Link
                          href={`/products?category=${encodeURIComponent(category.slug)}`}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-ink transition hover:bg-brand/5 hover:text-brand"
                        >
                          <span
                            className={`grid h-7 w-7 place-items-center overflow-hidden rounded-full ${circle}`}
                          >
                            {category.imageUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={category.imageUrl}
                                alt=""
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <Icon className="h-4 w-4" aria-hidden="true" />
                            )}
                          </span>
                          {category.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ) : null}
          </div>

          <nav className="flex items-center gap-1" aria-label="Primary">
            {stripLinks.map(({ label, href, icon: Icon, external }) =>
              external ? (
                <a
                  key={label}
                  href={href}
                  className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-ink transition hover:bg-brand/5 hover:text-brand"
                >
                  <Icon className="h-4 w-4 text-brand" aria-hidden="true" />
                  {label}
                </a>
              ) : (
                <Link
                  key={label}
                  href={href}
                  className="flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-ink transition hover:bg-brand/5 hover:text-brand"
                >
                  <Icon className="h-4 w-4 text-brand" aria-hidden="true" />
                  {label}
                </Link>
              )
            )}
          </nav>
        </div>
      </div>

      {/* Mobile search row */}
      <div className="bg-brand px-4 pb-3 md:hidden">
        <Form action="/products" className="relative">
          <input
            type="search"
            name="q"
            placeholder="Search for products..."
            className="h-10 w-full rounded-md bg-white pl-4 pr-11 text-sm text-ink outline-none focus:ring-2 focus:ring-accent-amber"
          />
          <button
            type="submit"
            aria-label="Search"
            className="absolute right-1 top-1 grid h-8 w-9 place-items-center rounded-md bg-accent-amber text-brand"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
          </button>
        </Form>
      </div>
    </header>
  );
}
