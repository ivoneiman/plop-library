import type { Metadata } from "next";
import { getCatalogo, getConfig } from "@/lib/notion";
import { CatalogoGrid } from "@/components/CatalogoGrid";
import { SITE_URL } from "@/lib/site";

export const revalidate = 300;

const descripcion =
  "Catálogo de libros nuevos y usados en Plop!, librería de barrio en Manuel B. Gonnet, La Plata. Buscá por nombre o categoría y consultá por WhatsApp.";

export const metadata: Metadata = {
  title: "Catálogo",
  description: descripcion,
  alternates: { canonical: "/catalogo" },
  openGraph: {
    title: "Catálogo de libros | Plop!",
    description: descripcion,
    url: `${SITE_URL}/catalogo`,
    type: "website",
  },
};

export default async function CatalogoPage() {
  const [productos, config] = await Promise.all([getCatalogo(), getConfig()]);
  const libros = productos.filter((producto) => producto.categoria === "Libros");

  return (
    <main className="min-h-screen bg-paper-50 px-4 py-8 text-ink-800 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold text-kraft-800">Catálogo</h1>
        <p className="mt-1 text-ink-500">Encontrá tu próxima lectura</p>
        <CatalogoGrid productos={libros} whatsapp={config.whatsapp} />
      </div>
    </main>
  );
}
