import {
  BookOpen,
  Gamepad2,
  Gift,
  HeartPulse,
  Leaf,
  type LucideIcon,
  ShoppingBasket,
  Shirt,
  Sparkles,
  Tag
} from "lucide-react";

type CategoryVisual = {
  Icon: LucideIcon;
  /** Tailwind classes for the round icon tile (kept as full static strings for the JIT). */
  circle: string;
};

const VISUALS: Record<string, CategoryVisual> = {
  "tea-and-spices": { Icon: Leaf, circle: "bg-emerald-100 text-emerald-700" },
  clothing: { Icon: Shirt, circle: "bg-indigo-100 text-indigo-700" },
  "gift-items": { Icon: Gift, circle: "bg-rose-100 text-rose-700" },
  grocery: { Icon: ShoppingBasket, circle: "bg-amber-100 text-amber-700" },
  cosmetics: { Icon: Sparkles, circle: "bg-fuchsia-100 text-fuchsia-700" },
  // WooCommerce drops the "&" in slugs (books-stationery / health-wellness / toys-games);
  // the "-and-" variants are kept for the original catalog too.
  "books-stationery": { Icon: BookOpen, circle: "bg-cyan-100 text-cyan-700" },
  "books-and-stationery": { Icon: BookOpen, circle: "bg-cyan-100 text-cyan-700" },
  "health-wellness": { Icon: HeartPulse, circle: "bg-teal-100 text-teal-700" },
  "health-and-wellness": { Icon: HeartPulse, circle: "bg-teal-100 text-teal-700" },
  "toys-games": { Icon: Gamepad2, circle: "bg-orange-100 text-orange-700" },
  "toys-and-games": { Icon: Gamepad2, circle: "bg-orange-100 text-orange-700" }
};

const FALLBACK: CategoryVisual = { Icon: Tag, circle: "bg-brand/10 text-brand" };

export function categoryVisual(slug: string): CategoryVisual {
  return VISUALS[slug] ?? FALLBACK;
}
