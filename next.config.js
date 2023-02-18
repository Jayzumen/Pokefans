/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ["raw.githubusercontent.com"],
    unoptimized: true,
  },
};

module.exports = nextConfig;
