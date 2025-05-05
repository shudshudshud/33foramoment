/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    
    // Handle environment variables
    env: {
      // Make sure these match your vercel environment variables
      NEXT_PUBLIC_PASSWORD: process.env.NEXT_PUBLIC_PASSWORD,
      NEXT_PUBLIC_PASSWORD_PROTECTION: process.env.NEXT_PUBLIC_PASSWORD_PROTECTION || 'true',
      AUTH_SECRET_KEY: process.env.AUTH_SECRET_KEY,
      NEXT_PUBLIC_PODCAST_DATA_ENDPOINT: process.env.NEXT_PUBLIC_PODCAST_DATA_ENDPOINT || '/api/podcasts',
      NEXT_PUBLIC_FRIEND_DATA_ENDPOINT: process.env.NEXT_PUBLIC_FRIEND_DATA_ENDPOINT || '/api/friends',
    },
    
    // Image configuration for optimization
    images: {
      domains: ['drive.google.com', 'lh3.googleusercontent.com'],
      unoptimized: process.env.NODE_ENV === 'development' ? false : true,
    },
    
    // Static file configuration
    async headers() {
      return [
        {
          // Apply to all routes
          source: '/:path*',
          headers: [
            // Security headers
            {
              key: 'X-DNS-Prefetch-Control',
              value: 'on',
            },
            {
              key: 'X-XSS-Protection',
              value: '1; mode=block',
            },
            {
              key: 'X-Content-Type-Options',
              value: 'nosniff',
            },
            {
              key: 'Referrer-Policy',
              value: 'origin-when-cross-origin',
            },
          ],
        },
      ];
    },
  };
  
  module.exports = nextConfig;