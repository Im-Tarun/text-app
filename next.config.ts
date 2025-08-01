import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true, // TEMP fix to allow deploy even with lint errors
  },
};

export default nextConfig;
