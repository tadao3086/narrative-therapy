import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/narrative-therapy',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
