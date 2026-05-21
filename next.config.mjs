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
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/auth/:path*`,
      },
    ];
  },
};

export default nextConfig;