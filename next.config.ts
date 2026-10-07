import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Proteger contra XSS
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          // Proteger contra clickjacking
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          // Proteger contra referrer leaks
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // Forçar HTTPS
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          },
          // Content Security Policy
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'",
          },
          // Proteger contra MIME-type sniffing
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

