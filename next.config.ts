// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
//   experimental: {
//     serverComponentsExternalPackages: ['@prisma/client'],
//   },
//   typescript: {
//     ignoreBuildErrors: true,
//   },
// };

// export default nextConfig;


import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client"],

  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;