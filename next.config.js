/** @type {import('next').NextConfig} */

const withPWA = require("next-pwa")
const nextConfig = withPWA({
  async headers() {
    return [
      {
        source: "/api/getDownloadUrl",
        headers: [
          {
            key: "Content-Type",
            value: "application/octet-stream",
          },
        ],
      },
    ];
  },
  pwa: {
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development",
  },
});

module.exports = nextConfig;
