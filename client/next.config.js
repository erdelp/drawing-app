/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration for Next.js
  webpack: (config) => {
    // Handle TensorFlow.js
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      path: false,
      os: false,
    };
    
    return config;
  },
  
  // Allow external content for TensorFlow.js models
  images: {
    domains: ['raw.githubusercontent.com'],
  },
  
  // Headers for TensorFlow.js
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
