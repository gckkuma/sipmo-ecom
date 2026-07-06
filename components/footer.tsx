import Link from "next/link";
import { CreditCard, HandCoins, Landmark, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "./layout/Logo";
import { accountUrl, cartUrl } from "../lib/wp";

type FooterLink = { label: string; href: string; external?: boolean };

const shopLinks: FooterLink[] = [
  { label: "All Products", href: "/products" },
  { label: "Deals", href: "/products?featured=true" },
  { label: "New Arrivals", href: "/products" },
  { label: "Tea & Spices", href: "/products?category=tea-and-spices" }
];

const accountLinks: FooterLink[] = [
  { label: "My Account", href: accountUrl(), external: true },
  { label: "My Cart", href: cartUrl(), external: true },
  { label: "Track Order", href: accountUrl(), external: true }
];

export function Footer() {
  return (
    <footer className="bg-brand text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1.2fr] lg:px-8">
        <div>
          <Logo variant="full" theme="dark" height={32} />
          <p className="mt-5 max-w-sm text-sm leading-6 text-white/70">
            Sri Lanka&apos;s trusted online marketplace — tea &amp; spices, clothing, gifts, grocery
            and more, with local payments and dependable islandwide delivery.
          </p>
        </div>

        <FooterLinkGroup title="Shop" links={shopLinks} />
        <FooterLinkGroup title="Account" links={accountLinks} />

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-accent-amber">
            Contact
          </h2>
          <div className="mt-4 space-y-3 text-sm text-white/75">
            <a href="tel:+94763198442" className="flex items-center gap-3 transition hover:text-white">
              <Phone className="h-4 w-4 text-accent-amber" aria-hidden="true" />
              +94 76 319 8442
            </a>
            <a
              href="mailto:info@sipmo.lk"
              className="flex items-center gap-3 transition hover:text-white"
            >
              <Mail className="h-4 w-4 text-accent-amber" aria-hidden="true" />
              info@sipmo.lk
            </a>
            <p className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-accent-amber" aria-hidden="true" />
              Colombo, Sri Lanka
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 text-sm text-white/70 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>Prices are shown in Rs. Payments: PayHere | COD | Bank Transfer.</p>
          <div className="flex items-center gap-3" aria-label="Payment methods">
            <span
              className="grid h-9 w-9 place-items-center rounded-full bg-white/10"
              title="PayHere"
            >
              <CreditCard className="h-4 w-4 text-accent-amber" aria-hidden="true" />
            </span>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-white/10" title="COD">
              <HandCoins className="h-4 w-4 text-accent-amber" aria-hidden="true" />
            </span>
            <span
              className="grid h-9 w-9 place-items-center rounded-full bg-white/10"
              title="Bank Transfer"
            >
              <Landmark className="h-4 w-4 text-accent-amber" aria-hidden="true" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLinkGroup({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-accent-amber">
        {title}
      </h2>
      <ul className="mt-4 space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            {link.external ? (
              <a href={link.href} className="text-sm text-white/75 transition hover:text-white">
                {link.label}
              </a>
            ) : (
              <Link href={link.href} className="text-sm text-white/75 transition hover:text-white">
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
