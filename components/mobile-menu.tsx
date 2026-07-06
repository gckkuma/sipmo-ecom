"use client";

import { ChevronRight, Menu, ShoppingCart, Sparkles, Tag, UserRound, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { categoryVisual } from "./category-icon";
import type { CategoryNode } from "../lib/catalog";
import { accountUrl, cartUrl } from "../lib/wp";

const quickLinks = [
  { label: "Deals", href: "/products?featured=true", icon: Tag, external: false },
  { label: "New Arrivals", href: "/products", icon: Sparkles, external: false },
  { label: "My Cart", href: cartUrl(), icon: ShoppingCart, external: true },
  { label: "My Account", href: accountUrl(), icon: UserRound, external: true }
];

export function MobileMenu({ categories }: { categories: CategoryNode[] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="-ml-1 grid h-9 w-9 place-items-center rounded-md text-white transition hover:bg-white/10 lg:hidden"
      >
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} aria-hidden="true" />

          <div className="absolute left-0 top-0 flex h-full w-80 max-w-[85%] flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between bg-brand px-4 py-4 text-white">
              <span className="text-sm font-semibold uppercase tracking-[0.14em]">Menu</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="grid h-8 w-8 place-items-center rounded-md transition hover:bg-white/10"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {categories.length > 0 ? (
                <div className="px-2 py-3">
                  <p className="px-3 pb-1 text-xs font-semibold uppercase tracking-[0.12em] text-stone">
                    Categories
                  </p>
                  <ul>
                    {categories.map((category) => {
                      const { Icon, circle } = categoryVisual(category.slug);
                      return (
                        <li key={category.id}>
                          <Link
                            href={`/products?category=${encodeURIComponent(category.slug)}`}
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm text-ink transition hover:bg-brand/5 hover:text-brand"
                          >
                            <span
                              className={`grid h-8 w-8 place-items-center overflow-hidden rounded-full ${circle}`}
                            >
                              {category.imageUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={category.imageUrl} alt="" className="h-full w-full object-cover" />
                              ) : (
                                <Icon className="h-4 w-4" aria-hidden="true" />
                              )}
                            </span>
                            {category.name}
                            <ChevronRight className="ml-auto h-4 w-4 text-stone" aria-hidden="true" />
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : null}

              <div className="border-t border-black/10 px-2 py-3">
                <ul>
                  {quickLinks.map(({ label, href, icon: Icon, external }) => (
                    <li key={label}>
                      {external ? (
                        <a
                          href={href}
                          className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-ink transition hover:bg-brand/5 hover:text-brand"
                        >
                          <Icon className="h-4 w-4 text-brand" aria-hidden="true" />
                          {label}
                        </a>
                      ) : (
                        <Link
                          href={href}
                          onClick={() => setOpen(false)}
                          className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-ink transition hover:bg-brand/5 hover:text-brand"
                        >
                          <Icon className="h-4 w-4 text-brand" aria-hidden="true" />
                          {label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
