/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Las fotos de productos vienen de Notion (S3 firmado o URLs externas cargadas por el local).
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
};

export default nextConfig;
