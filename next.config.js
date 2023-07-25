/** @type {import('next').NextConfig} */

const withPWA = require("next-pwa")({
  dest: "public"
});

const nextConfig = {
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
};

module.exports = withPWA({
  ...nextConfig
})
