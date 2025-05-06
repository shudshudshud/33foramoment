/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    
    // Handle environment variables
    env: {
      // This will be overridden by Vercel's environment variables
      NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://33foramoment.vercel.app',
      
      // Password protection
      NEXT_PUBLIC_PASSWORD_PROTECTION: process.env.NEXT_PUBLIC_PASSWORD_PROTECTION || 'true',
      NEXT_PUBLIC_PASSWORD: process.env.NEXT_PUBLIC_PASSWORD,
      NEXT_PUBLIC_OWNER_PASSWORD: process.env.NEXT_PUBLIC_OWNER_PASSWORD,
      NEXT_PUBLIC_PARTNER_PASSWORD: process.env.NEXT_PUBLIC_PARTNER_PASSWORD,
      
      // Friend passwords
      NEXT_PUBLIC_FRIEND_PASSWORD_MALCOLM: process.env.NEXT_PUBLIC_FRIEND_PASSWORD_MALCOLM,
      NEXT_PUBLIC_FRIEND_PASSWORD_VENESSA: process.env.NEXT_PUBLIC_FRIEND_PASSWORD_VENESSA,
      NEXT_PUBLIC_FRIEND_PASSWORD_FRIEND_EXAMPLE: process.env.NEXT_PUBLIC_FRIEND_PASSWORD_FRIEND_EXAMPLE,
      
      // Drive URLs
      NEXT_PUBLIC_DRIVE_URL_MALCOLM: process.env.NEXT_PUBLIC_DRIVE_URL_MALCOLM,
      NEXT_PUBLIC_DRIVE_URL_VENESSA: process.env.NEXT_PUBLIC_DRIVE_URL_VENESSA,
      NEXT_PUBLIC_DRIVE_URL_FRIEND_EXAMPLE: process.env.NEXT_PUBLIC_DRIVE_URL_FRIEND_EXAMPLE,
      
      // API endpoints
      NEXT_PUBLIC_PODCAST_DATA_ENDPOINT: process.env.NEXT_PUBLIC_PODCAST_DATA_ENDPOINT || '/api/podcasts',
      NEXT_PUBLIC_FRIEND_DATA_ENDPOINT: process.env.NEXT_PUBLIC_FRIEND_DATA_ENDPOINT || '/api/friends',
    },
    
    // Image configuration for optimization
    images: {
      domains: ['drive.google.com'],
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