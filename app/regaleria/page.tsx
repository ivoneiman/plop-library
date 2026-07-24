import type { Metadata } from "next";
import { getCatalogo, getConfig } from "@/lib/notion";
import { RegaleriaGallery } from "@/components/RegaleriaGallery";
import { SITE_URL } from "@/lib/site";

export const revalidate = 300;

const descripcion =
  "Regalería en Manuel B. Gonnet, La Plata: objetos y regalos para todas las ocasiones en Plop!, tu librería de barrio.";

export const metadata: Metadata = {
  title: "Regalería",
  description: descripcion,
  alternates: { canonical: "/regaleria" },
  openGraph: {
    title: "Regalería | Plop!",
    description: descripcion,
    url: `${SITE_URL}/regaleria`,
    type: "website",
  },
};

export default async function RegaleriaPage() {
  const [productos, config] = await Promise.all([getCatalogo(), getConfig()]);
  const regaleria = productos.filter((producto) => producto.categoria === "Regalería");

  return (
    <main className="min-h-screen bg-paper-50 px-4 py-8 text-ink-800 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold text-kraft-800">Regalería</h1>
        <p className="mt-1 text-ink-500">Objetos y regalos para todas las ocasiones</p>
        <RegaleriaGallery productos={regaleria} whatsapp={config.whatsapp} />
      </div>
    </main>
  );
}
