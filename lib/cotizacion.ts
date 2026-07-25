import type { PedidoFotocopia, PreciosFotocopias } from "@/types";

export function calcularTotalFotocopias(
  hojasTotal: number,
  color: PedidoFotocopia["color"],
  faz: PedidoFotocopia["faz"],
  anillado: boolean,
  precios: PreciosFotocopias,
): number {
  const precioBase = color === "Color" ? precios.precioCopiaColor : precios.precioCopiaByN;
  const subtotal = hojasTotal * precioBase;
  const descuentoDobleFaz =
    faz === "Doble faz" ? subtotal * (precios.descuentoDobleFazPorcentaje / 100) : 0;
  const totalAnillado = anillado ? precios.precioAnillado : 0;

  return Math.max(0, subtotal - descuentoDobleFaz + totalAnillado);
}
