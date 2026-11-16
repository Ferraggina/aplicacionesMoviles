import { buildEventDates } from "../utils/dates";

describe("buildEventDates", () => {
  const now = new Date(2026, 10, 16, 15, 0, 0);

  it("empieza a los X minutos indicados", () => {
    const { startDate } = buildEventDates("30", now);
    expect(startDate.getTime()).toBe(now.getTime() + 30 * 60 * 1000);
  });

  it("empieza en 1 hora si no se indican minutos", () => {
    const { startDate } = buildEventDates("", now);
    expect(startDate.getTime()).toBe(now.getTime() + 60 * 60 * 1000);
  });

  it("el evento dura 30 minutos", () => {
    const { startDate, endDate } = buildEventDates("10", now);
    expect(endDate.getTime() - startDate.getTime()).toBe(30 * 60 * 1000);
  });
});
