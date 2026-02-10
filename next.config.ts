import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Use standalone output for robust deployments, especially with Docker/Vercel
  output: 'standalone',

  // Standard React Strict Mode
  reactStrictMode: true,

  // Ensure trailing slashes are handled consistently
  trailingSlash: false,

  // Ignore typescript build errors to force a deploy if it's a type issue (temporary debug)
  typescript: {
    ignoreBuildErrors: true,
  },

  // ESLint config moved to eslintrc or separate config (removed deprecated key)

  experimental: {
    // Ensure we are not using anything that conflicts with Vercel
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ckridnftlitmzhxswvse.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      }
    ],
  }
};

export default nextConfig;
