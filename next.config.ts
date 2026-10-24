import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  images: {
    formats: ["image/avif", "image/webp"],
    // Fewer sizes means fewer variants to generate and cache
    deviceSizes: [480, 768, 1080, 1920],
    imageSizes: [128, 256, 400, 640],
    // Optimized images stay cached for 1 year, so the optimizer isn't re-run
    minimumCacheTTL: 31536000,
    // Next 16 only allows the qualities listed here (default is just [75])
    qualities: [60, 70, 75],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"], // only if you use icon/UI libraries like this
  },
  async headers() {
    return [
      {
        // Images in /public: cache a day, revalidate in the background
        source: "/:all*(webp|avif|png|jpg|jpeg|svg|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
      {
        // Audio: cache for a year
        source: "/:all*(mp3)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
