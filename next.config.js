/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/chenzetong',
  assetPrefix: '/chenzetong',
  images: {
    unoptimized: true,
  },
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig; 