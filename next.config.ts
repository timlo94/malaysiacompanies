import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/malaysiacompanies',
  images: {
    unoptimized: true,
  }
};

export default nextConfig;
