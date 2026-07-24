import { getCatalogo, getConfig } from "@/lib/notion";
import { RegaleriaGallery } from "@/components/RegaleriaGallery";

export const revalidate = 300;

export default async function RegaleriaPage() {
  const [productos, config] = await Promise.all([getCatalogo(), getConfig()]);
  const regaleria = productos.filter((producto) => producto.categoria === "Regalería");

  return (
    <main className="min-h-screen bg-paper-50 px-4 py-8 text-ink-800 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold text-wood-800">Regalería</h1>
        <p className="mt-1 text-ink-500">Objetos y regalos para todas las ocasiones</p>
        <RegaleriaGallery productos={regaleria} whatsapp={config.whatsapp} />
      </div>
    </main>
  );
}
