import { getConfig } from "@/lib/notion";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const revalidate = 300;

const servicios = [
  "Fotocopias blanco y negro",
  "Fotocopias a color",
  "Anillado",
  "Impresión de archivos digitales",
  "Escaneo de documentos",
];

export default async function FotocopiasPage() {
  const config = await getConfig();
  const linkWhatsapp = buildWhatsAppUrl(config.whatsapp, "Hola! Quiero consultar por fotocopias");

  return (
    <main className="min-h-screen bg-paper-50 px-4 py-8 text-ink-800 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold text-wood-800">Fotocopias</h1>
        <p className="mt-1 text-ink-500">Traé tu archivo o documento y lo resolvemos en el local.</p>

        <ul className="mt-6 space-y-2">
          {servicios.map((servicio) => (
            <li
              key={servicio}
              className="rounded-lg border border-wood-100 bg-white px-4 py-3 text-sm text-ink-700"
            >
              {servicio}
            </li>
          ))}
        </ul>

        <a
          href={linkWhatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-flex items-center justify-center rounded-lg bg-gold-400 px-5 py-3 font-medium text-ink-900 transition hover:bg-gold-500"
        >
          Consultar por WhatsApp
        </a>
      </div>
    </main>
  );
}
