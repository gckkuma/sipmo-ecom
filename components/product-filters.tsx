"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { CategoryNode } from "../lib/catalog";
import { flattenCategories } from "../lib/catalog";

type ProductFiltersProps = {
  categories: CategoryNode[];
};

export function ProductFilters({ categories }: ProductFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get("category") ?? "";
  const inStockOnly = searchParams.get("inStock") === "true";

  const [min, setMin] = useState(searchParams.get("min") ?? "");
  const [max, setMax] = useState(searchParams.get("max") ?? "");

  // Keep local price inputs in sync when the URL changes elsewhere (e.g. Reset).
  useEffect(() => {
    setMin(searchParams.get("min") ?? "");
    setMax(searchParams.get("max") ?? "");
  }, [searchParams]);

  const flatCategories = flattenCategories(categories);

  function applyParams(mutate: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    params.delete("page"); // any filter change returns to the first page
    const queryString = params.toString();
    router.push(queryString ? `/products?${queryString}` : "/products");
  }

  function handleSelectCategory(slug: string) {
    applyParams((params) => {
      if (slug) {
        params.set("category", slug);
      } else {
        params.delete("category");
      }
    });
  }

  function handleToggleInStock() {
    applyParams((params) => {
      if (inStockOnly) {
        params.delete("inStock");
      } else {
        params.set("inStock", "true");
      }
    });
  }

  function handleApplyPrice() {
    applyParams((params) => {
      if (min.trim()) {
        params.set("min", String(Math.max(0, Number(min))));
      } else {
        params.delete("min");
      }
      if (max.trim()) {
        params.set("max", String(Math.max(0, Number(max))));
      } else {
        params.delete("max");
      }
    });
  }

  function handleReset() {
    router.push("/products");
  }

  const hasActiveFilters =
    Boolean(activeCategory) ||
    inStockOnly ||
    Boolean(searchParams.get("min")) ||
    Boolean(searchParams.get("max"));

  return (
    <aside className="space-y-7">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-ink">Filters</h2>
        {hasActiveFilters ? (
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-semibold text-brand transition hover:text-brand-hover"
          >
            Reset all
          </button>
        ) : null}
      </div>

      {/* Category */}
      <section>
        <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-stone">Category</h3>
        <ul className="mt-3 space-y-1">
          <li>
            <button
              type="button"
              onClick={() => handleSelectCategory("")}
              className={`w-full rounded-md px-3 py-2 text-left text-sm transition ${
                activeCategory === ""
                  ? "bg-brand-100 font-semibold text-brand"
                  : "text-stone hover:bg-black/5"
              }`}
            >
              All products
            </button>
          </li>
          {flatCategories.map((category) => (
            <li key={category.id}>
              <button
                type="button"
                onClick={() => handleSelectCategory(category.slug)}
                className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-sm transition ${
                  activeCategory === category.slug
                    ? "bg-brand-100 font-semibold text-brand"
                    : "text-stone hover:bg-black/5"
                } ${category.parentId ? "pl-6" : ""}`}
              >
                <span className="truncate">{category.name}</span>
                <span className="ml-2 shrink-0 text-xs text-stone/60">{category.productCount}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Price range (Rs.) */}
      <section>
        <h3 className="text-xs font-semibold uppercase tracking-[0.12em] text-stone">
          Price range (Rs.)
        </h3>
        <div className="mt-3 flex items-center gap-2">
          <label className="flex-1">
            <span className="sr-only">Minimum price</span>
            <div className="flex items-center rounded-md border border-black/15 bg-white px-2 focus-within:border-brand">
              <span className="text-xs text-stone/70">Rs.</span>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                value={min}
                onChange={(event) => setMin(event.target.value)}
                placeholder="Min"
                className="w-full bg-transparent px-1 py-2 text-sm text-ink outline-none"
              />
            </div>
          </label>
          <span className="text-stone/50">&ndash;</span>
          <label className="flex-1">
            <span className="sr-only">Maximum price</span>
            <div className="flex items-center rounded-md border border-black/15 bg-white px-2 focus-within:border-brand">
              <span className="text-xs text-stone/70">Rs.</span>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                value={max}
                onChange={(event) => setMax(event.target.value)}
                placeholder="Max"
                className="w-full bg-transparent px-1 py-2 text-sm text-ink outline-none"
              />
            </div>
          </label>
        </div>
        <button
          type="button"
          onClick={handleApplyPrice}
          className="mt-3 h-10 w-full rounded-md border border-brand px-4 text-sm font-semibold text-brand transition hover:bg-brand-100"
        >
          Apply price
        </button>
      </section>

      {/* In-stock toggle */}
      <section>
        <button
          type="button"
          role="switch"
          aria-checked={inStockOnly}
          onClick={handleToggleInStock}
          className="flex w-full items-center justify-between rounded-md border border-black/15 bg-white px-3 py-3 text-sm font-medium text-ink transition hover:border-brand"
        >
          <span>In stock only</span>
          <span
            className={`relative h-6 w-11 rounded-full transition ${
              inStockOnly ? "bg-brand" : "bg-black/20"
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                inStockOnly ? "left-[22px]" : "left-0.5"
              }`}
            />
          </span>
        </button>
      </section>
    </aside>
  );
}
