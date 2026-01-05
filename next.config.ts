import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';
const nextConfig: NextConfig = {
  basePath: isProd ? '/estimate' : '', // แปลง basepath เพื่อเข้าถึง assetfile เวลา ทำ proxy ใน server
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
  output: "standalone", // for docker only if no docker remove!
  typescript: {
    ignoreBuildErrors: true,
  },

};

export default nextConfig;
