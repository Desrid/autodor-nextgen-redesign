import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_PAGES === "true";
const githubPagesBasePath =
  process.env.GITHUB_PAGES_BASE_PATH?.replace(/\/+$/, "") ||
  "/autodor-nextgen-redesign";

const securityHeaders = [
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), payment=(), usb=()",
  },
];

const nextConfig: NextConfig = {
  allowedDevOrigins: ["172.18.0.1"],
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    unoptimized: isGitHubPages,
  },
  ...(isGitHubPages
    ? {
        basePath: githubPagesBasePath,
        output: "export" as const,
        trailingSlash: true,
      }
    : {
        compress: true,
        output: "standalone" as const,
        async headers() {
          return [
            {
              source: "/:path*",
              headers: securityHeaders,
            },
          ];
        },
      }),
};

export default nextConfig;
