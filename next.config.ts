/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/chenzetong',
  images: {
    unoptimized: true,
  },
  experimental: {
    // 启用构建缓存
    turbotrace: {
      logLevel: 'error',
    },
    // 启用并行构建
    parallelServerBuildTraces: true,
  },
};

export default nextConfig;
