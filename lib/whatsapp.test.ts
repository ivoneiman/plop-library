import { describe, expect, it } from "vitest";
import { construirMensajeConsultaProducto, construirMensajeFotocopias } from "./whatsapp";

const formatoPrecio = new Intl.NumberFormat("es-AR", { maximumFractionDigits: 0 });

const SIN_PLACEHOLDERS = /undefined|\$\{|\[object Object\]|NaN/;

describe("construirMensajeFotocopias", () => {
  const datos = {
    nombreArchivo: "apunte.pdf",
    urlArchivo: "https://blob.example.com/apunte.pdf",
    paginasArchivo: 12,
    cantidadCopias: 3,
    hojasTotal: 36,
    color: "Color" as const,
    dobleFaz: true,
    anillado: true,
    total: 4500,
    nombre: "Ana",
  };

  it("no deja placeholders sin reemplazar", () => {
    expect(construirMensajeFotocopias(datos)).not.toMatch(SIN_PLACEHOLDERS);
  });

  it("incluye los datos clave del pedido", () => {
    const mensaje = construirMensajeFotocopias(datos);
    expect(mensaje).toContain("apunte.pdf");
    expect(mensaje).toContain("12 páginas");
    expect(mensaje).toContain("36");
    expect(mensaje).toContain("Ana");
    expect(mensaje).toContain(formatoPrecio.format(datos.total));
  });
});

describe("construirMensajeConsultaProducto", () => {
  const producto = {
    nombre: "Cien años de soledad",
    precio: 25000,
    categoria: "Libros" as const,
  };

  it("no deja placeholders sin reemplazar", () => {
    expect(construirMensajeConsultaProducto(producto)).not.toMatch(SIN_PLACEHOLDERS);
  });

  it("incluye nombre y precio formateado", () => {
    const mensaje = construirMensajeConsultaProducto(producto);
    expect(mensaje).toContain(producto.nombre);
    expect(mensaje).toContain(formatoPrecio.format(producto.precio));
  });
});
