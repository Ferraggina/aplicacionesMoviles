import {
  formatLocation,
  formatContact,
  buildMapsUrl,
} from "../utils/formatters";

describe("formatLocation", () => {
  it("devuelve null si no hay ubicación", () => {
    expect(formatLocation(null)).toBeNull();
  });

  it("prefiere la dirección cuando existe", () => {
    const loc = {
      latitude: -34.9,
      longitude: -58.3,
      address: "Calle 123, Guernica",
    };
    expect(formatLocation(loc)).toBe("Calle 123, Guernica");
  });

  it("usa las coordenadas si no hay dirección", () => {
    const loc = { latitude: -34.9, longitude: -58.3, address: null };
    expect(formatLocation(loc)).toBe("-34.9000, -58.3000");
  });
});

describe("buildMapsUrl", () => {
  it("arma el link de Google Maps con las coordenadas", () => {
    const url = buildMapsUrl({ latitude: -34.9, longitude: -58.3 });
    expect(url).toContain("query=-34.9,-58.3");
  });
});

describe("formatContact", () => {
  it("devuelve null si no hay contacto", () => {
    expect(formatContact(null)).toBeNull();
  });

  it("muestra solo el nombre si no tiene teléfono", () => {
    expect(formatContact({ name: "Ana", phone: null })).toBe("Ana");
  });

  it("muestra nombre y teléfono", () => {
    expect(formatContact({ name: "Ana", phone: "1122334455" })).toBe(
      "Ana · 1122334455",
    );
  });
});
