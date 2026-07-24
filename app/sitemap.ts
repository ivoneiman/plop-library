import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const rutas: Array<{ ruta: string; prioridad: number }> = [
    { ruta: "", prioridad: 1 },
    { ruta: "/catalogo", prioridad: 0.8 },
    { ruta: "/regaleria", prioridad: 0.8 },
    { ruta: "/fotocopias", prioridad: 0.8 },
  ];

  const lastModified = new Date();

  return rutas.map(({ ruta, prioridad }) => ({
    url: `${SITE_URL}${ruta}`,
    lastModified,
    changeFrequency: "daily",
    priority: prioridad,
  }));
}
