/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  compress: true,

  images: {
    remotePatterns: [],
  },

  headers: async () => [
    {
      source: "/images/(.*)",
      headers: [
        { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
      ],
    },
    {
      source: "/pdf/(.*)",
      headers: [
        { key: "Cache-Control", value: "public, max-age=604800" },
      ],
    },
  ],

  experimental: {
    scrollRestoration: true,
  },

  turbopack: {
    root: __dirname,
  },
};

module.exports = nextConfig;
