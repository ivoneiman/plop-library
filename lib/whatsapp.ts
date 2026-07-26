import type { Producto } from "@/types";

export function buildWhatsAppUrl(numero: string, mensaje?: string): string {
  const numeroLimpio = numero.replace(/[^\d]/g, "");
  const base = `https://wa.me/${numeroLimpio}`;
  return mensaje ? `${base}?text=${encodeURIComponent(mensaje)}` : base;
}

const formatoPrecio = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });

export function construirMensajeConsultaProducto(
  producto: Pick<Producto, "nombre" | "precio">,
): string {
  return `¡Hola! Quiero consultar por este producto:

${producto.nombre}
$${formatoPrecio.format(producto.precio)}

¿Está disponible?`;
}

type DatosMensajeFotocopias = {
  nombreArchivo: string;
  urlArchivo: string;
  paginasArchivo: number;
  cantidadCopias: number;
  hojasTotal: number;
  color: "Color" | "Blanco y negro";
  dobleFaz: boolean;
  anillado: boolean;
  total: number;
  nombre: string;
};

export function construirMensajeFotocopias(datos: DatosMensajeFotocopias): string {
  return `¡Hola! Quiero hacer un pedido de fotocopias:

Archivo: ${datos.nombreArchivo} (${datos.paginasArchivo} páginas)
Ver archivo: ${datos.urlArchivo}
Copias: ${datos.cantidadCopias}
Total de hojas: ${datos.hojasTotal}
Impresión: ${datos.color}
Doble faz: ${datos.dobleFaz ? "Sí" : "No"}
Anillado: ${datos.anillado ? "Sí" : "No"}
Cotización estimada: $${formatoPrecio.format(datos.total)}

Mi nombre: ${datos.nombre}

Quedo atento para confirmar antes de que lo impriman. ¡Gracias!`;
}
