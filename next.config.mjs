/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'res.cloudinary.com',
      'placehold.co',
      // Add your Firebase Storage domain here, e.g., 'firebasestorage.googleapis.com'
    ],
  },
};

export default nextConfig;