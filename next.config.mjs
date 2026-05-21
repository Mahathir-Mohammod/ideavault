/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  experimental: {
    globalNotFound: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/auth/:path*`,
      },
    ];
  },
};

export default nextConfig;
