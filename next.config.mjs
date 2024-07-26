/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
      // Add other domains you need to allow here
    ],
  },
};

export default nextConfig;
