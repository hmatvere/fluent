/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = {
   // Target must be serverless
  future: {
    // use the new `target` property instead of `serverless`
    target: 'experimental-serverless-trace',
  },
  exportPathMap: async function () {
    return {
      "/": { page: "/" },
      "/game-selection": { page: "/game-selection" },
      "/pronounciation-game": { page: "/pronounciation-game" },
    };
  },
  // Tell Next.js to export as static HTML
  exportPathMap: async function () {
    return {
      "/": { page: "/" },
      "/game-selection": { page: "/game-selection" },
      "/pronounciation-game": { page: "/pronounciation-game" },
      "/_error": { page: "/_error" }, // Add a catch-all route for error pages
    };
  },
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  nextConfig
};
  
  
 
