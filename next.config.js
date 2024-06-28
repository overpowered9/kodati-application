/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    serverComponentsExternalPackages: ['sequelize'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'salla-dev.s3.eu-central-1.amazonaws.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.salla.sa',
      },
      {
        protocol: 'https',
        hostname: 'd1upatzsvnpphr.cloudfront.net'
      },
      {
        protocol: 'https',
        hostname: 'media.zid.store'
      },
    ],
  },
}

module.exports = nextConfig