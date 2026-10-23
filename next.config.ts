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
    minimumCacheTTL: 60 * 60 * 24 * 30,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bach-van-wedding.s3.ap-southeast-2.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react"], // only if you use icon/UI libraries like this
  },
};

export default nextConfig;
