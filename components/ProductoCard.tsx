import type { Producto } from "@/types";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

type Props = {
  producto: Producto;
  whatsapp: string;
  variant?: "grid" | "gallery";
};

const formatoPrecio = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  maximumFractionDigits: 0,
});

export function ProductoCard({ producto, whatsapp, variant = "grid" }: Props) {
  const linkWhatsapp = buildWhatsAppUrl(whatsapp, `Hola! Me interesa ${producto.nombre}`);
  const esGaleria = variant === "gallery";

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-wood-100 bg-white shadow-sm">
      <div className={`w-full bg-paper-100 ${esGaleria ? "aspect-square" : "aspect-[3/4]"}`}>
        {producto.fotoUrl ? (
          <img
            src={producto.fotoUrl}
            alt={producto.nombre}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-ink-300">
            Sin foto
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <h3 className="line-clamp-2 text-sm font-semibold text-ink-800">{producto.nombre}</h3>
        {!esGaleria && (
          <p className="font-bold text-terracotta-600">{formatoPrecio.format(producto.precio)}</p>
        )}
        <a
          href={linkWhatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex items-center justify-center rounded-lg bg-gold-400 px-3 py-2 text-sm font-medium text-ink-900 transition hover:bg-gold-500"
        >
          Consultar por WhatsApp
        </a>
      </div>
    </div>
  );
}
