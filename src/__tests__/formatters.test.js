import { formatReminder } from "../utils/formatters";

describe("formatReminder", () => {
  it("devuelve null si no hay recordatorio", () => {
    expect(formatReminder(null)).toBeNull();
  });

  it("devuelve null si la fecha es inválida", () => {
    expect(formatReminder("esto-no-es-una-fecha")).toBeNull();
  });

  it("formatea la fecha como DD/MM HH:mm", () => {
    const date = new Date(2026, 9, 6, 15, 30);
    expect(formatReminder(date.toISOString())).toBe("06/10 15:30");
  });
});
