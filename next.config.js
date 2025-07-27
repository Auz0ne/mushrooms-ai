/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static exports for Netlify deployment
  output: 'export',
  trailingSlash: true,
  // Disable image optimization for static export
  images: {
    unoptimized: true,
    domains: ['images.pexels.com'],
  },
}

module.exports = nextConfig 