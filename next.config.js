/** @type {import('next').NextConfig} */
const nextConfig = {
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
