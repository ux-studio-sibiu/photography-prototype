import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/images/dt64fsks/production/**",
      },
    ],
  },
  productionBrowserSourceMaps: false,
};

export default nextConfig;
