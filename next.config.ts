import type { NextConfig } from "next";

// GitHub Pages serves the project site from https://<user>.github.io/<repo>/,
// so the build needs a base path. Local `npm run dev` stays at the root.
const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  // GitHub Pages only serves static files: emit a fully static site to `out/`.
  output: "export",
  basePath: isGitHubPages ? "/jiran-connect" : undefined,
  // The Next.js image optimizer needs a server; static hosting can't run it.
  images: { unoptimized: true },
  // Emit `route/index.html` so Pages resolves clean URLs without rewrites.
  trailingSlash: true,
  // Cache Components implies PPR, which the static exporter rejects, so it is
  // only enabled for the server build (local dev / Vercel).
  cacheComponents: !isGitHubPages,
  partialPrefetching: !isGitHubPages,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
