/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [{ source: '/promo', destination: '/home', permanent: true }, { source: '/promo/:path*', destination: '/home/:path*', permanent: true }]
  },
};

export default nextConfig;
