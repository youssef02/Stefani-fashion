import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  basePath: "/Stefani-fashion",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
