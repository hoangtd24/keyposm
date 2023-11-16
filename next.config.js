/** @type {import('next').NextConfig} */
const env = process.env.NODE_ENV

const nextConfig = {
  reactStrictMode: true,
  compiler: {
    removeConsole: env === 'production' ? true : false,
  },
  images: {
    //unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api-keycheck.tcgh.com.vn',
        //port: '443',
        pathname: '/public/**'
      },
      {
        protocol: 'https',
        hostname: 'api.keycheck.vn',
        //port: '443',
        pathname: '/public/**'
      },
    ],
  },
}

module.exports = nextConfig
