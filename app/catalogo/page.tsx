import { getCatalogo, getConfig } from "@/lib/notion";
import { CatalogoGrid } from "@/components/CatalogoGrid";

export const revalidate = 300;

export default async function CatalogoPage() {
  const [productos, config] = await Promise.all([getCatalogo(), getConfig()]);
  const libros = productos.filter((producto) => producto.categoria === "Libros");

  return (
    <main className="min-h-screen bg-paper-50 px-4 py-8 text-ink-800 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold text-wood-800">Catálogo</h1>
        <p className="mt-1 text-ink-500">Encontrá tu próxima lectura</p>
        <CatalogoGrid productos={libros} whatsapp={config.whatsapp} />
      </div>
    </main>
  );
}
