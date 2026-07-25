type Props = {
  totalEstimado: number;
  hayArchivo: boolean;
  paginasArchivo: number;
  cantidad: number;
  hojasTotal: number;
};

const formatoPrecio = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });

export function CotizacionFotocopias({
  totalEstimado,
  hayArchivo,
  paginasArchivo,
  cantidad,
  hojasTotal,
}: Props) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-kraft-200 bg-paper-50 px-4 py-3">
      <p className="font-display text-lg font-bold text-kraft-900">
        Cotización estimada: ${formatoPrecio.format(totalEstimado)}
      </p>
      {hayArchivo && (
        <p className="mt-1 text-xs text-kraft-500">
          {paginasArchivo} páginas × {cantidad} copias = {hojasTotal} hojas
        </p>
      )}
      <p className="mt-1 text-xs text-kraft-400">
        Es una estimación automática, sujeta a confirmación del local. No representa un cobro.
      </p>
    </div>
  );
}
