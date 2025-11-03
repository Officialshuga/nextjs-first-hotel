
// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   images: {
//     remotePatterns:[
//       {
//         protocol: "https",
//         hostname: "utfs.io",
//         port: "",
//         pathname: "/**",
//       },
//     ],
//   },
//   reactCompiler: true,
// };

// export default nextConfig;




import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    proxyPrefetch: "flexible",
  },
  reactCompiler: true,
};

export default nextConfig;
