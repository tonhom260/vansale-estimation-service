import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        // เมื่อยิงมาที่ /api/auth/session ในพอร์ต 4000
        source: '/api/auth/:path*',
        // ให้ส่งต่อไปที่พอร์ต 3000
        destination: 'http://localhost:3000/api/auth/:path*',
      },
    ];
  },
};

export default nextConfig;
