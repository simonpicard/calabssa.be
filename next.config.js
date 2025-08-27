const { withPlausibleProxy } = require('next-plausible')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
  // Remove 'output: export' for dynamic routes to work with Vercel
  trailingSlash: true,
}

module.exports = withPlausibleProxy()(nextConfig)