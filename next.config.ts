import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  // Hide the floating Next.js dev badge (errors still show if something breaks)
  devIndicators: false,
  partialPrefetching: true,
  // Old pages: Agency Partner is now /contact, Directory is now /works, Information is now /about
  async redirects() {
    return [
      { source: "/partner", destination: "/contact", permanent: true },
      { source: "/directory", destination: "/works", permanent: true },
      { source: "/information", destination: "/about", permanent: true },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
