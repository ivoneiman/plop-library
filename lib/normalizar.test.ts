import { describe, expect, it } from "vitest";
import { normalizar } from "./normalizar";

describe("normalizar", () => {
  it("quita tildes", () => {
    expect(normalizar("Dirección")).toBe("direccion");
  });

  it("pasa todo a minúsculas", () => {
    expect(normalizar("WhatsApp")).toBe("whatsapp");
  });

  it("combina tildes y mayúsculas", () => {
    expect(normalizar("Horario Sáb")).toBe("horario sab");
  });

  it("no cambia texto ya normalizado", () => {
    expect(normalizar("regaleria")).toBe("regaleria");
  });
});
