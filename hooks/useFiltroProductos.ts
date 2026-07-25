import { useMemo, useState } from "react";
import type { Producto } from "@/types";
import { normalizar } from "@/lib/normalizar";

export function useFiltroProductos(productos: Producto[]) {
  const [busqueda, setBusqueda] = useState("");
  const [subcategoriasElegidas, setSubcategoriasElegidas] = useState<string[]>([]);

  const subcategorias = useMemo(
    () =>
      Array.from(
        new Set(
          productos
            .map((producto) => producto.subcategoria)
            .filter((subcategoria): subcategoria is string => Boolean(subcategoria)),
        ),
      ).sort((a, b) => a.localeCompare(b)),
    [productos],
  );

  const alternarSubcategoria = (subcategoria: string) => {
    setSubcategoriasElegidas((actuales) =>
      actuales.includes(subcategoria)
        ? actuales.filter((valor) => valor !== subcategoria)
        : [...actuales, subcategoria],
    );
  };

  const coincideProducto = (producto: Producto) => {
    const coincideNombre = normalizar(producto.nombre).includes(normalizar(busqueda));
    const coincideSubcategoria =
      subcategoriasElegidas.length === 0 ||
      (producto.subcategoria !== null && subcategoriasElegidas.includes(producto.subcategoria));
    return coincideNombre && coincideSubcategoria;
  };

  return {
    busqueda,
    setBusqueda,
    subcategorias,
    subcategoriasElegidas,
    alternarSubcategoria,
    coincideProducto,
  };
}
