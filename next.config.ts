import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  sassOptions: {
    includePaths: ["./src"],
  },
};

export default nextConfig;
