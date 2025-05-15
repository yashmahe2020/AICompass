/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.experiments = config.experiments || {};
    config.experiments.asyncWebAssembly = true;
    // Optionally, if you need sync WASM (rare):
    // config.experiments.syncWebAssembly = true;
    return config;
  },
};

export default nextConfig;
