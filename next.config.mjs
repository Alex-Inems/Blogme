/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'firebasestorage.googleapis.com', // Firebase Storage domain
      'img.clerk.com', // Clerk's image domain
      'images.unsplash.com' // Unsplash images for blog posts
    ],
  },
}

export default nextConfig; // or export default nextConfig if using .mjs
