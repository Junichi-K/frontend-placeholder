import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com", "files.edgestore.dev"], // ✅ Allow Google profile pictures
  },

  reactStrictMode: false
};

export default nextConfig;