/**
 * @fileoverview Next.js configuration with security headers
 * @module next.config
 */

import type { NextConfig } from "next";

// Bundle analyzer for performance optimization
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

/**
 * Security headers for production deployment
 * Following OWASP recommendations
 */
const securityHeaders = [
  {
    key: "X-DNS-Prefetch-Control",
    value: "on",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self), interest-cohort=()",
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
];

const nextConfig: NextConfig = {
  /**
   * Build directory - using relative path but pointing to F: drive via symlink
   * Alternative: Clean up C: drive space instead
   */
  // distDir: "../.next-build",  // Commented out - causes path issues

  /**
   * React strict mode for development
   */
  reactStrictMode: true,

  /**
   * Compression and performance optimizations
   */
  compress: true,
  generateEtags: true,

  /**
   * Allowed dev origins for cross-origin requests
   * Prevents warning about proxy requests in development
   */
  allowedDevOrigins: ["127.0.0.1:3000", "localhost:3000"],

  /**
   * Powered by header removal for security
   */
  poweredByHeader: false,

  /**
   * Security headers configuration
   */
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // API routes - add CORS and cache headers
        source: "/api/:path*",
        headers: [
          ...securityHeaders,
          {
            key: "Access-Control-Allow-Origin",
            value: process.env.NEXT_PUBLIC_SITE_URL || "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
          {
            key: "Cache-Control",
            value: "no-store, max-age=0",
          },
        ],
      },
      {
        // Local images - enable long-term immutable caching
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Static assets - enable caching
        source: "/lottie/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  /**
   * Image optimization configuration
   */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shadcnstudio.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },

  /**
   * Redirect configuration
   */
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
    ];
  },

  /**
   * Server external packages (moved from experimental)
   */
  serverExternalPackages: ["@supabase/supabase-js"],

  /**
   * Experimental features for performance optimization
   */
  experimental: {
    // Enable optimized package imports for faster dev server
    optimizePackageImports: [
      "lucide-react",
      "recharts",
      "@remixicon/react",
      "framer-motion",
      "@radix-ui/react-icons",
    ],
    // Enable optimized CSS loading
    optimizeCss: true,
  },

  /**
   * Turbopack configuration (for next dev --turbo)
   */
  turbopack: {
    // Resolve aliases for faster module resolution
    resolveAlias: {
      "@": "./",
    },
  },

  /**
   * Webpack configuration for performance optimization
   */
  webpack: (config, { dev, isServer }) => {
    // Performance optimizations for production
    if (!dev) {
      // Enable tree shaking for better bundle size
      config.optimization = {
        ...config.optimization,
        usedExports: true,
        sideEffects: false,
      };

      // Optimize chunks for better caching
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        chunks: "all",
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
          },
          common: {
            name: "common",
            minChunks: 2,
            chunks: "all",
            enforce: true,
          },
        },
      };
    }

    if (dev) {
      // Reduce file watching overhead in development
      config.watchOptions = {
        ...config.watchOptions,
        poll: 1000, // Check for changes every second instead of using inotify
        aggregateTimeout: 300, // Delay rebuild after first change
        ignored: [
          "**/node_modules/**",
          "**/.git/**",
          "**/.next/**",
          "**/dist/**",
          "**/coverage/**",
        ],
      };
    }

    // Optimize imports for better tree shaking
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        "@": require("path").resolve(__dirname),
      };
    }

    return config;
  },

  /**
   * Logging configuration
   */
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === "development",
    },
  },
};

export default withBundleAnalyzer(nextConfig);
