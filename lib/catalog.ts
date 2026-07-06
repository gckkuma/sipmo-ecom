import { cache } from "react";

// ---------------------------------------------------------------------------
// WooCommerce Store API adapter.
// Reads the public Store API (no keys) and maps responses onto the same shapes
// the storefront components already expect, so the UI is unchanged.
// ---------------------------------------------------------------------------

const WP_URL = (process.env.NEXT_PUBLIC_WP_URL ?? "https://sipmo.lk").replace(/\/$/, "");
const BASE = process.env.WOO_BASE_URL ?? `${WP_URL}/wp-json/wc/store/v1`;
const REVALIDATE = 300; // ISR: refresh catalog every 5 min (kind to cPanel, free on Vercel).

// ---- Public types (identical contract to the original NestJS storefront) ----

export type CategorySummary = {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  sortOrder: number;
  isActive: boolean;
};

export type CategoryNode = {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  imageUrl: string | null;
  sortOrder: number;
  isActive: boolean;
  productCount: number;
  createdAt: string;
  updatedAt: string;
  children: CategoryNode[];
};

export type ProductImage = {
  id: string;
  url: string;
  altText: string | null;
  isPrimary: boolean;
  sortOrder: number;
};

export type ProductVariantSummary = {
  id: string;
  name: string;
  sku: string;
  price: number;
  comparePrice: number | null;
  stock: number;
};

export type ProductSummary = {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: CategorySummary;
  basePrice: number;
  comparePrice: number | null;
  featured: boolean;
  isActive: boolean;
  minVariantPrice: number;
  totalStock: number;
  primaryImage: ProductImage | null;
  variants: ProductVariantSummary[];
};

export type ProductDetail = {
  id: string;
  name: string;
  slug: string;
  description: string; // HTML from WooCommerce
  shortDescription: string; // HTML
  category: CategorySummary;
  featured: boolean;
  isActive: boolean;
  basePrice: number;
  comparePrice: number | null;
  onSale: boolean;
  totalStock: number;
  inStock: boolean;
  permalink: string;
  images: ProductImage[];
  attributes: { key: string; value: string }[];
  reviewCount: number;
  avgRating: number | null;
};

export type ProductListParams = {
  category?: string;
  search?: string;
  min?: number;
  max?: number;
  inStock?: boolean;
  featured?: boolean;
  page?: number;
  limit?: number;
  sort?: "date" | "popularity" | "price" | "rating";
};

export type ApiPaginatedResponse<T> = {
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
};

// ---- Raw Woo Store API shapes (only the fields we use) ----

type WooPrices = {
  price: string;
  regular_price: string;
  sale_price: string;
  currency_minor_unit: number;
};

type WooImage = { id: number; src: string; alt: string };
type WooTerm = { id: number; name: string; slug: string };

type WooProduct = {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  short_description: string;
  description: string;
  on_sale: boolean;
  prices: WooPrices;
  average_rating: string;
  review_count: number;
  images: WooImage[];
  categories: WooTerm[];
  attributes: { name: string; terms?: { name: string }[] }[];
  is_in_stock: boolean;
  low_stock_remaining: number | null;
};

type WooCategory = {
  id: number;
  name: string;
  slug: string;
  parent: number;
  count: number;
  image: { src: string } | null;
};

// ---- Helpers ----

function toMajor(value: string, minorUnit: number): number {
  const n = Number(value);
  if (!Number.isFinite(n)) return 0;
  return n / 10 ** (minorUnit ?? 2);
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8217;/g, "’")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

async function wooFetch(path: string): Promise<Response> {
  const res = await fetch(`${BASE}${path}`, { next: { revalidate: REVALIDATE } });
  if (!res.ok) {
    throw new Error(`WooCommerce Store API ${res.status} for ${path}`);
  }
  return res;
}

function mapCategoryTerm(term: WooTerm | undefined): CategorySummary {
  if (!term) {
    return { id: "0", name: "Shop", slug: "", parentId: null, sortOrder: 0, isActive: true };
  }
  return {
    id: String(term.id),
    name: term.name,
    slug: term.slug,
    parentId: null,
    sortOrder: 0,
    isActive: true
  };
}

function mapImages(images: WooImage[]): ProductImage[] {
  return (images ?? []).map((img, index) => ({
    id: String(img.id),
    url: img.src,
    altText: img.alt || null,
    isPrimary: index === 0,
    sortOrder: index
  }));
}

function mapSummary(p: WooProduct): ProductSummary {
  const price = toMajor(p.prices.price, p.prices.currency_minor_unit);
  const regular = toMajor(p.prices.regular_price, p.prices.currency_minor_unit);
  const images = mapImages(p.images);
  return {
    id: String(p.id),
    name: p.name,
    slug: p.slug,
    description: stripHtml(p.short_description || p.description),
    category: mapCategoryTerm(p.categories?.[0]),
    basePrice: price,
    comparePrice: p.on_sale && regular > price ? regular : null,
    featured: false,
    isActive: true,
    minVariantPrice: price,
    totalStock: p.is_in_stock ? (p.low_stock_remaining ?? 999) : 0,
    primaryImage: images[0] ?? null,
    variants: []
  };
}

// ---- Categories ----

const loadCategoriesRaw = cache(async (): Promise<WooCategory[]> => {
  const res = await wooFetch("/products/categories?per_page=100");
  return (await res.json()) as WooCategory[];
});

function buildTree(cats: WooCategory[]): CategoryNode[] {
  const nodes = new Map<number, CategoryNode>();
  for (const c of cats) {
    nodes.set(c.id, {
      id: String(c.id),
      name: c.name,
      slug: c.slug,
      parentId: c.parent ? String(c.parent) : null,
      imageUrl: c.image?.src ?? null,
      sortOrder: 0,
      isActive: true,
      productCount: c.count,
      createdAt: "",
      updatedAt: "",
      children: []
    });
  }
  const roots: CategoryNode[] = [];
  for (const c of cats) {
    const node = nodes.get(c.id);
    if (!node) continue;
    const parent = c.parent ? nodes.get(c.parent) : undefined;
    if (parent) parent.children.push(node);
    else roots.push(node);
  }
  return roots;
}

export async function fetchCategories(): Promise<CategoryNode[]> {
  const cats = await loadCategoriesRaw();
  // Only surface categories that actually have products, sorted by size then name.
  const withProducts = cats.filter((c) => c.count > 0);
  return buildTree(withProducts).sort(
    (a, b) => b.productCount - a.productCount || a.name.localeCompare(b.name)
  );
}

const categoryIdBySlug = cache(async (): Promise<Map<string, number>> => {
  const cats = await loadCategoriesRaw();
  return new Map(cats.map((c) => [c.slug, c.id]));
});

// ---- Products ----

export async function fetchProducts(
  params: ProductListParams = {}
): Promise<ApiPaginatedResponse<ProductSummary>> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 12;
  const search = new URLSearchParams();
  search.set("per_page", String(limit));
  search.set("page", String(page));

  if (params.search) search.set("search", params.search);
  if (params.featured) search.set("featured", "true");
  if (params.inStock) search.set("stock_status", "instock");
  if (params.min !== undefined) search.set("min_price", String(params.min));
  if (params.max !== undefined) search.set("max_price", String(params.max));

  if (params.sort === "popularity") {
    search.set("orderby", "popularity");
  } else if (params.sort === "price") {
    search.set("orderby", "price");
  } else if (params.sort === "rating") {
    search.set("orderby", "rating");
  } else {
    search.set("orderby", "date");
  }

  if (params.category) {
    const id = (await categoryIdBySlug()).get(params.category);
    if (!id) {
      return { data: [], meta: { page, limit, total: 0, totalPages: 0 } };
    }
    search.set("category", String(id));
  }

  const res = await wooFetch(`/products?${search.toString()}`);
  const products = (await res.json()) as WooProduct[];
  const total = Number(res.headers.get("x-wp-total") ?? products.length);
  const totalPages = Number(res.headers.get("x-wp-totalpages") ?? 1);

  return {
    data: products.map(mapSummary),
    meta: { page, limit, total, totalPages }
  };
}

export async function fetchProductBySlug(slug: string): Promise<ProductDetail | null> {
  const res = await wooFetch(`/products?slug=${encodeURIComponent(slug)}`);
  const products = (await res.json()) as WooProduct[];
  const p = products[0];
  if (!p) return null;

  const price = toMajor(p.prices.price, p.prices.currency_minor_unit);
  const regular = toMajor(p.prices.regular_price, p.prices.currency_minor_unit);

  return {
    id: String(p.id),
    name: p.name,
    slug: p.slug,
    description: p.description,
    shortDescription: p.short_description,
    category: mapCategoryTerm(p.categories?.[0]),
    featured: false,
    isActive: true,
    basePrice: price,
    comparePrice: p.on_sale && regular > price ? regular : null,
    onSale: p.on_sale,
    totalStock: p.is_in_stock ? (p.low_stock_remaining ?? 999) : 0,
    inStock: p.is_in_stock,
    permalink: p.permalink,
    images: mapImages(p.images),
    attributes: (p.attributes ?? []).map((a) => ({
      key: a.name,
      value: (a.terms ?? []).map((t) => t.name).join(", ")
    })),
    reviewCount: p.review_count,
    avgRating: Number(p.average_rating) || null
  };
}

/** Flattens the category tree into a single ordered list (parents then children). */
export function flattenCategories(nodes: CategoryNode[]): CategoryNode[] {
  return nodes.flatMap((node) => [node, ...flattenCategories(node.children)]);
}
