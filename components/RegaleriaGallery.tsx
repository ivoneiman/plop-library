"use client";

import { useState } from "react";
import type { Producto } from "@/types";
import { ProductoCard } from "@/components/ProductoCard";

type Props = {
  productos: Producto[];
  whatsapp: string;
};

export function RegaleriaGallery({ productos, whatsapp }: Props) {
  const [busqueda, setBusqueda] = useState("");

  const filtrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(busqueda.toLowerCase()),
  );

  return (
    <div className="mt-6">
      <input
        type="text"
        value={busqueda}
        onChange={(evento) => setBusqueda(evento.target.value)}
        placeholder="Buscar por nombre..."
        className="w-full rounded-lg border border-wood-200 bg-white px-4 py-2 text-ink-800 placeholder:text-ink-300 focus:border-terracotta-400 focus:outline-none sm:max-w-sm"
      />

      {filtrados.length === 0 ? (
        <p className="mt-10 text-center text-ink-400">No encontramos productos con ese criterio.</p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
          {filtrados.map((producto) => (
            <ProductoCard key={producto.id} producto={producto} whatsapp={whatsapp} variant="gallery" />
          ))}
        </div>
      )}
    </div>
  );
}
