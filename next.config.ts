import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,

  output: 'export',
  
  images: {
    unoptimized: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;