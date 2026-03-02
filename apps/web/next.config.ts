import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@prompit/types"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.r2.cloudflarestorage.com" },
      { protocol: "https", hostname: "*.cloudflare.com" },
    ],
  },
};

export default nextConfig;
