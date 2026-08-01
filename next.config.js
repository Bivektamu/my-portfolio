/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [],
  },
  turbopack: {
    root: __dirname,
  },
};

module.exports = nextConfig;
