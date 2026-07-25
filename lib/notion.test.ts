import { describe, expect, it } from "vitest";
import { buscarCampoConfig } from "./notion";

describe("buscarCampoConfig", () => {
  const campos = [
    { campo: "Dirección", valor: "Calle Falsa 123" },
    { campo: "Horario Sáb", valor: "9 a 13" },
  ];

  it("encuentra el campo con coincidencia exacta", () => {
    expect(buscarCampoConfig(campos, "Dirección")).toBe("Calle Falsa 123");
  });

  it("encuentra el campo aunque el nombre buscado no tenga tilde", () => {
    expect(buscarCampoConfig(campos, "Direccion")).toBe("Calle Falsa 123");
  });

  it("encuentra el campo aunque cambien mayúsculas y tildes en Notion", () => {
    expect(buscarCampoConfig(campos, "horario sab")).toBe("9 a 13");
  });

  it("devuelve undefined si el campo no existe", () => {
    expect(buscarCampoConfig(campos, "Instagram")).toBeUndefined();
  });
});
