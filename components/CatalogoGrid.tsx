"use client";

import { useMemo, useState } from "react";
import type { Producto } from "@/types";
import { ProductoCard } from "@/components/ProductoCard";

type Props = {
  productos: Producto[];
  whatsapp: string;
};

export function CatalogoGrid({ productos, whatsapp }: Props) {
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("Todas");

  const categorias = useMemo(
    () => ["Todas", ...Array.from(new Set(productos.map((producto) => producto.categoria)))],
    [productos],
  );

  const filtrados = productos.filter((producto) => {
    const coincideNombre = producto.nombre.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = categoria === "Todas" || producto.categoria === categoria;
    return coincideNombre && coincideCategoria;
  });

  return (
    <div className="mt-6">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={busqueda}
          onChange={(evento) => setBusqueda(evento.target.value)}
          placeholder="Buscar por nombre..."
          className="w-full rounded-lg border border-wood-200 bg-white px-4 py-2 text-ink-800 placeholder:text-ink-300 focus:border-terracotta-400 focus:outline-none"
        />
        {categorias.length > 2 && (
          <select
            value={categoria}
            onChange={(evento) => setCategoria(evento.target.value)}
            className="rounded-lg border border-wood-200 bg-white px-4 py-2 text-ink-800 focus:border-terracotta-400 focus:outline-none sm:w-48"
          >
            {categorias.map((opcion) => (
              <option key={opcion} value={opcion}>
                {opcion}
              </option>
            ))}
          </select>
        )}
      </div>

      {filtrados.length === 0 ? (
        <p className="mt-10 text-center text-ink-400">No encontramos productos con ese criterio.</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtrados.map((producto) => (
            <ProductoCard key={producto.id} producto={producto} whatsapp={whatsapp} variant="grid" />
          ))}
        </div>
      )}
    </div>
  );
}
