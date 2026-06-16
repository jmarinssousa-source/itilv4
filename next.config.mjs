/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.GITHUB_PAGES === "true";

const nextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: isGitHubPages ? "/itilv4" : "",
  assetPrefix: isGitHubPages ? "/itilv4/" : "",
  typedRoutes: true
};

export default nextConfig;
