import type { Metadata } from "next";
import { getConfig, getPreciosFotocopias } from "@/lib/notion";
import { FotocopiasForm } from "@/components/FotocopiasForm";
import { SITE_URL } from "@/lib/site";

export const revalidate = 300;

const descripcion =
  "Fotocopiadora en Manuel B. Gonnet, La Plata: fotocopias blanco y negro, color, anillado, impresión y escaneo de documentos.";

export const metadata: Metadata = {
  title: "Fotocopias",
  description: descripcion,
  alternates: { canonical: "/fotocopias" },
  openGraph: {
    title: "Fotocopias | Plop!",
    description: descripcion,
    url: `${SITE_URL}/fotocopias`,
    type: "website",
  },
};

const servicios = [
  "Fotocopias blanco y negro",
  "Fotocopias a color",
  "Anillado",
  "Impresión de archivos digitales",
  "Escaneo de documentos",
];

export default async function FotocopiasPage() {
  const [config, precios] = await Promise.all([getConfig(), getPreciosFotocopias()]);

  return (
    <main className="min-h-screen bg-paper-50 px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <header className="mb-8 text-center">
          <h1 className="font-display text-3xl font-black text-mustard-500 sm:text-4xl">
            Pedidos de Impresión
          </h1>
          <p className="mt-2 text-lg font-medium text-kraft-600">
            Subí tus archivos y configuralos. Te avisamos cuando estén listos para retirar.
          </p>
        </header>

        <ul className="mb-6 flex flex-wrap justify-center gap-2">
          {servicios.map((servicio) => (
            <li
              key={servicio}
              className="rounded-full border border-kraft-100 bg-white px-4 py-1.5 text-xs font-bold text-kraft-700"
            >
              {servicio}
            </li>
          ))}
        </ul>

        <FotocopiasForm whatsapp={config.whatsapp} precios={precios} />
      </div>
    </main>
  );
}
