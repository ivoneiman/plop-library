import { describe, expect, it } from "vitest";
import { calcularTotalFotocopias } from "./cotizacion";
import type { PreciosFotocopias } from "@/types";

const precios: PreciosFotocopias = {
  precioCopiaByN: 10,
  precioCopiaColor: 30,
  descuentoDobleFazPorcentaje: 20,
  precioAnillado: 500,
};

describe("calcularTotalFotocopias", () => {
  it("blanco y negro, simple faz, sin anillado", () => {
    expect(calcularTotalFotocopias(10, "Blanco y negro", "Simple faz", false, precios)).toBe(100);
  });

  it("color, simple faz, sin anillado", () => {
    expect(calcularTotalFotocopias(10, "Color", "Simple faz", false, precios)).toBe(300);
  });

  it("aplica el descuento de doble faz sobre el subtotal", () => {
    expect(calcularTotalFotocopias(10, "Blanco y negro", "Doble faz", false, precios)).toBe(80);
  });

  it("suma el anillado como cargo fijo por pedido", () => {
    expect(calcularTotalFotocopias(10, "Blanco y negro", "Simple faz", true, precios)).toBe(600);
  });

  it("combina doble faz y anillado", () => {
    expect(calcularTotalFotocopias(10, "Blanco y negro", "Doble faz", true, precios)).toBe(580);
  });

  it("hojasTotal ya viene multiplicado (páginas del archivo × cantidad de copias)", () => {
    const paginasArchivo = 5;
    const cantidadCopias = 4;
    const hojasTotal = paginasArchivo * cantidadCopias;
    expect(
      calcularTotalFotocopias(hojasTotal, "Blanco y negro", "Simple faz", false, precios),
    ).toBe(200);
  });

  it("nunca da un total negativo", () => {
    const preciosConDescuentoExagerado: PreciosFotocopias = {
      ...precios,
      descuentoDobleFazPorcentaje: 150,
    };
    expect(
      calcularTotalFotocopias(10, "Blanco y negro", "Doble faz", false, preciosConDescuentoExagerado),
    ).toBe(0);
  });
});
