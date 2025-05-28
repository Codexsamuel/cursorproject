/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/dko5sommz/**',
      },
      {
        protocol: 'https',
        hostname: 'cloudinary.com',
        pathname: '/**',
      }
    ],
  },
}

module.exports = nextConfig 