"use client";

import { useState } from "react";
import type { Producto } from "@/types";
import { ProductoCard } from "@/components/ProductoCard";
import { useFiltroProductos } from "@/hooks/useFiltroProductos";

type Props = {
  productos: Producto[];
  whatsapp: string;
};

export function RegaleriaGallery({ productos, whatsapp }: Props) {
  const { busqueda, setBusqueda, subcategorias, subcategoriasElegidas, alternarSubcategoria, coincideProducto } =
    useFiltroProductos(productos);
  const [sidebarAbierto, setSidebarAbierto] = useState(false);

  const filtrados = productos.filter(coincideProducto);

  const listaSubcategorias = (
    <ul className="space-y-3">
      {subcategorias.map((subcategoria) => (
        <li key={subcategoria}>
          <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-kraft-700 transition-opacity hover:opacity-80">
            <input
              type="checkbox"
              checked={subcategoriasElegidas.includes(subcategoria)}
              onChange={() => alternarSubcategoria(subcategoria)}
              className="h-4 w-4 rounded border-kraft-300 text-turquoise focus:ring-turquoise"
            />
            {subcategoria}
          </label>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="mt-8 lg:flex lg:items-start lg:gap-8">
      {subcategorias.length > 0 && (
        <aside className="mb-6 lg:mb-0 lg:w-64 lg:flex-shrink-0">
          <button
            type="button"
            onClick={() => setSidebarAbierto((abierto) => !abierto)}
            className="flex w-full items-center justify-between rounded-xl border-2 border-kraft-100 bg-white px-4 py-2 text-left text-sm font-bold text-kraft-800 lg:hidden"
          >
            Filtros
            <span aria-hidden>{sidebarAbierto ? "−" : "+"}</span>
          </button>
          <div
            className={`${sidebarAbierto ? "block" : "hidden"} sticky top-24 mt-3 rounded-xl border-2 border-kraft-100 bg-white p-5 lg:mt-0 lg:block`}
          >
            <h2 className="font-display mb-4 hidden text-xl font-black text-mustard-500 lg:block">
              Filtros
            </h2>
            {listaSubcategorias}
          </div>
        </aside>
      )}

      <div className="flex-1">
        <div className="mb-3 flex items-center justify-end">
          <span className="text-sm font-medium text-kraft-500">
            Mostrando {filtrados.length} resultado{filtrados.length === 1 ? "" : "s"}
          </span>
        </div>

        <input
          type="text"
          value={busqueda}
          onChange={(evento) => setBusqueda(evento.target.value)}
          placeholder="Buscar por nombre..."
          className="w-full rounded-xl border-2 border-kraft-100 bg-white px-4 py-2.5 text-kraft-900 placeholder:text-kraft-300 focus:border-turquoise focus:outline-none focus:ring-2 focus:ring-turquoise/30 sm:max-w-sm"
        />

        {filtrados.length === 0 ? (
          <p className="mt-10 text-center text-kraft-400">No encontramos productos con ese criterio.</p>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
            {filtrados.map((producto) => (
              <ProductoCard key={producto.id} producto={producto} whatsapp={whatsapp} variant="gallery" />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
