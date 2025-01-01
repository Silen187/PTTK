/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
}

// module.exports = {
//   webpack: (config, { isServer }) => {
//     if (!isServer) {
//       config.resolve.fallback = {
//         fs: false,
//         net: false,
//         tls: false,
//         dns: false,
//         path: false, 
//         os: false 
//       };
//     }
//     config.resolve.alias = {
//       ...config.resolve.alias,
//       'pg-hstore': false 
//     };
//     return config;
//   }
// };


module.exports = nextConfig
