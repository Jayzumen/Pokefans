import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== "production";
const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN;

/**
 * Content Security Policy.
 * - Scripts: our own bundle only. 'unsafe-inline' is needed for Next's
 *   inline bootstrap scripts while pages stay static; switch to nonces
 *   (proxy + dynamic rendering) if the site ever needs a stricter policy.
 * - Connections: Firebase Auth + Firestore only. PokeAPI is fetched on
 *   the server, never from the browser.
 * - Images: our own optimizer, plus the PokeAPI sprite host as a fallback.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://raw.githubusercontent.com",
  "font-src 'self'",
  [
    "connect-src 'self'",
    "https://*.googleapis.com",
    "https://*.firebaseio.com",
    "wss://*.firebaseio.com",
    isDev ? "ws://localhost:* http://localhost:*" : "",
  ]
    .filter(Boolean)
    .join(" "),
  `frame-src 'self'${authDomain ? ` https://${authDomain}` : ""}`,
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  isDev ? "" : "upgrade-insecure-requests",
]
  .filter(Boolean)
  .join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    // No runtime image optimizer: the hosted optimizer has a monthly quota
    // that ~1,025 artworks exhaust quickly (requests then fail with 402).
    // Artwork is pre-converted to small WebP files in public/artwork by
    // `pnpm artwork:build` and served as plain static files instead.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "raw.githubusercontent.com",
        pathname: "/PokeAPI/sprites/**",
      },
    ],
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        // Artwork only changes when regenerated; let browsers and the CDN
        // keep it for 30 days and refresh it in the background afterwards.
        source: "/artwork/:file*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
