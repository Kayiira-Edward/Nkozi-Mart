/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'res.cloudinary.com',
      'placehold.co',
      // Add your Firebase Storage domain here, e.g., 'firebasestorage.googleapis.com'
    ],
    // 🟢 CHANGE HERE: Allow SVGs from configured domains
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;