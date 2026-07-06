import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // WooCommerce hosts product/category images in WordPress media on cPanel.
    remotePatterns: [
      { protocol: "https", hostname: "sipmo.lk" },
      { protocol: "https", hostname: "www.sipmo.lk" },
      { protocol: "https", hostname: "**.sipmo.lk" },
      { protocol: "https", hostname: "secure.gravatar.com" },
      { protocol: "https", hostname: "placehold.co" }
    ]
  }
};

export default nextConfig;
