// Calcular cuado empieza y termina el evento en el calendario.

export const buildEventDates = (minutes, now = new Date()) => {
  const offset = Number(minutes) > 0 ? Number(minutes) : 60;
  const startDate = new Date(now.getTime() + offset * 60 * 1000);
  const endDate = new Date(startDate.getTime() + 30 * 60 * 1000);
  return { startDate, endDate };
};
