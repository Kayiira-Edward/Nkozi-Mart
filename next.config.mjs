// next.config.mjs
import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'res.cloudinary.com',
      'placehold.co',
      // This is the correct domain for Firebase Storage images
      'firebasestorage.googleapis.com',
    ],
    // Allow SVGs from configured domains
    dangerouslyAllowSVG: true,
  },
};

// Wrap the nextConfig with the PWA configuration
const pwaConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
})(nextConfig);

export default pwaConfig;
