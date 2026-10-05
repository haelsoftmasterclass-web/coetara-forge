import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static site: `npm run build` writes plain HTML/CSS/JS to /out,
  // which can be hosted on Netlify, Vercel, Cloudflare Pages, S3 or any web server.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
