import Image from "next/image";
import type { Producto } from "@/types";
import { FotoPlaceholder } from "@/components/FotoPlaceholder";
import { buildWhatsAppUrl, construirMensajeConsultaProducto } from "@/lib/whatsapp";

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
  const linkWhatsapp = buildWhatsAppUrl(whatsapp, construirMensajeConsultaProducto(producto));
  const esGaleria = variant === "gallery";
  const ultimasUnidades = producto.stock > 0 && producto.stock <= 3;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border-2 border-kraft-100 bg-white p-3 shadow-soft transition-all duration-300 md:border-kraft-500 md:shadow-sticker md:hover:-translate-y-1 md:hover:shadow-sticker-hover">
      {(producto.destacado || ultimasUnidades) && (
        <div className="absolute right-4 top-4 z-10 flex flex-col items-end gap-1">
          {producto.destacado && (
            <span className="rotate-3 rounded-full bg-accent-pink-500 px-3 py-1 text-xs font-bold text-white shadow-md">
              Destacado
            </span>
          )}
          {ultimasUnidades && (
            <span className="rounded-full bg-green-accent px-3 py-1 text-xs font-bold text-white shadow-sm">
              ¡Últimas unidades!
            </span>
          )}
        </div>
      )}
      <div
        className={`relative w-full overflow-hidden rounded-lg bg-paper-100 ${esGaleria ? "aspect-square" : "aspect-square"}`}
      >
        {producto.fotoUrl ? (
          <Image
            src={producto.fotoUrl}
            alt={producto.nombre}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <FotoPlaceholder categoria={producto.categoria} />
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between pt-3">
        <h3 className="font-display line-clamp-2 text-lg font-bold text-mustard-500">
          {producto.nombre}
        </h3>
        {!esGaleria && (
          <p className="mt-2 mb-3 font-display text-lg font-bold text-kraft-900">
            {formatoPrecio.format(producto.precio)}
          </p>
        )}
        <a
          href={linkWhatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-flex items-center justify-center gap-1.5 rounded-xl bg-mustard-500 py-2.5 text-sm font-bold text-mustard-900 transition hover:brightness-95"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" stroke="currentColor" strokeWidth={2}>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5Z"
            />
          </svg>
          Consultar por WhatsApp
        </a>
      </div>
    </article>
  );
}
