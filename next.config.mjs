/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Las fotos de productos vienen de Notion (S3 firmado o URLs externas cargadas por el local).
    remotePatterns: [{ protocol: "https", hostname: "**" }],
    // Las fotos de productos y del local cambian poco: no hace falta revalidarlas cada hora (default de Vercel).
    minimumCacheTTL: 31536000,
  },
};

export default nextConfig;
