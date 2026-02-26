import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.raiderio.net',
      },
      {
        protocol: 'https',
        hostname: 'render.worldofwarcraft.com',
      },
    ],
  },
};

export default nextConfig;
