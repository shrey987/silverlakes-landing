/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['pdf-lib', 'bcryptjs'],
  },
};

module.exports = nextConfig;
