/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/auth/login",
        permanent: true,
      },
    ];
  },
  compiler: {
    ...(process.env.NODE_ENV === "production" && {
      removeConsole: {
        exclude: ["error"],
      },
    }),
  },
};

module.exports = nextConfig;
