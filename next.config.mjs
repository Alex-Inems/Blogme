/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
      domains: [
        'firebasestorage.googleapis.com', // Firebase Storage domain
        'img.clerk.com' // Clerk's image domain
      ],
    },
  }
  
  export default nextConfig; // or export default nextConfig if using .mjs
  