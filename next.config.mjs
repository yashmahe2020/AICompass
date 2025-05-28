/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.experiments = config.experiments || {};
    config.experiments.asyncWebAssembly = true;
    // Optionally, if you need sync WASM (rare):
    // config.experiments.syncWebAssembly = true;
    return config;
  },
  // Ensure proper handling of redirects
  async redirects() {
    return [];
  },
  // Ensure proper handling of rewrites
  async rewrites() {
    return [];
  },
  // Add explicit domain configuration for production
  env: {
    NEXT_PUBLIC_CLERK_DOMAIN: process.env.NEXT_PUBLIC_CLERK_DOMAIN,
  },
  // Disable automatic static optimization for pages that use Clerk
  experimental: {
    optimizePackageImports: ['@clerk/nextjs'],
  },
};

export default nextConfig;
