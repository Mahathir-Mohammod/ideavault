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
        destination: `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "https://ideavault-ten.vercel.app"}/api/auth/:path*`,
      },
    ];
  },
};

export default nextConfig;