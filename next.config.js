/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  redirects() {
    return [
      {
        source: '/',
        destination: '/dashboard/projects',
        permanent: true,
      },
      {
        source: '/dashboard',
        destination: '/dashboard/projects',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
