import type { Producto } from "@/types";

export function buildWhatsAppUrl(numero: string, mensaje: string): string {
  const numeroLimpio = numero.replace(/[^\d]/g, "");
  return `https://wa.me/${numeroLimpio}?text=${encodeURIComponent(mensaje)}`;
}

const formatoPrecio = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });

export function construirMensajeConsultaProducto(
  producto: Pick<Producto, "nombre" | "precio" | "categoria">,
): string {
  const emoji = producto.categoria === "Regalería" ? "🎁" : "📚";

  return `¡Hola! 👋 Quiero consultar por este producto:

${emoji} ${producto.nombre}
💰 $${formatoPrecio.format(producto.precio)}

¿Está disponible?`;
}

type DatosMensajeFotocopias = {
  nombreArchivo: string;
  urlArchivo: string;
  cantidad: number;
  color: "Color" | "Blanco y negro";
  dobleFaz: boolean;
  anillado: boolean;
  total: number;
  nombre: string;
};

export function construirMensajeFotocopias(datos: DatosMensajeFotocopias): string {
  return `¡Hola! 👋 Quiero hacer un pedido de fotocopias:

📄 Archivo: ${datos.nombreArchivo}
🔗 Ver archivo: ${datos.urlArchivo}
🖨️ Cantidad: ${datos.cantidad} copias
🎨 Impresión: ${datos.color}
📑 Doble faz: ${datos.dobleFaz ? "Sí" : "No"}
📎 Anillado: ${datos.anillado ? "Sí" : "No"}
💰 Cotización estimada: $${formatoPrecio.format(datos.total)}

Mi nombre: ${datos.nombre}

Quedo atento para confirmar antes de que lo impriman. ¡Gracias!`;
}
