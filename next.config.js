/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  },
  images: {
    domains: [
      'res.cloudinary.com',
      'localhost',
      'digitalent.games.test.shopee.io',
    ],
    remotePatterns: [
      {
        hostname: 'www.static-src.com',
        port: '',
      },
      {
        hostname: 'down-id.img.susercontent.com',
        port: '',
      },
      {
        hostname: 'images.tokopedia.net',
        port: '',
      },
      {
        hostname: 'deo.shopeesz.com',
        port: '',
      },
      {
        hostname: 'down-aka-id.img.susercontent.com',
        port: '',
      },
      {
        hostname: 'www.tikibanjarmasin.com',
        port: '',
      },
      {
        hostname: 'play-lh.googleusercontent.com',
        port: '',
      },
      {
        hostname: 'res.cloudinary.com',
        port: '',
      },
      {
        hostname: 'down-id.img',
        port: '',
      },
      {
        hostname: 'susercontent.com',
        port: '',
      },
      {
        hostname: 'down-id.img.susercontent.com',
        port: '',
      },
      {
        hostname: 'cf.shopee.sg',
      },
      {
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  output: 'standalone',
  basePath: process.env.NODE_ENV === 'production' ? '/vm1' : undefined,
};

module.exports = nextConfig;
