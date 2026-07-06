import type { Metadata } from "next";
import "./globals.css";

const BASE_URL = process.env.NEXT_PUBLIC_WEB_URL ?? "https://sipmo.lk";
const DESCRIPTION =
  "Sri Lanka's trusted online shopping destination. Islandwide delivery, easy payments — PayHere, Cash on Delivery & Bank Transfer.";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "SIPMO.lk — Shop Smarter",
    template: "%s · SIPMO.lk"
  },
  description: DESCRIPTION,
  applicationName: "SIPMO.lk",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "SIPMO.lk",
    title: "SIPMO.lk — Shop Smarter",
    description: DESCRIPTION,
    url: BASE_URL,
    locale: "en_LK",
    images: [{ url: "/logo/sipmo-logo.png", alt: "SIPMO.lk" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "SIPMO.lk — Shop Smarter",
    description: DESCRIPTION,
    images: ["/logo/sipmo-logo.png"]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
