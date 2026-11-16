import * as Calendar from "expo-calendar/legacy";
import { Alert } from "react-native";
import { handlePermission } from "./permissions";

const DEFAULT_TIMEZONE = "America/Argentina/Buenos_Aires";

const getTimeZone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || DEFAULT_TIMEZONE;
  } catch (e) {
    return DEFAULT_TIMEZONE;
  }
};

// Busca un calendario donde se pueda escribir (el principal si existe)
const findWritableCalendar = async () => {
  const calendars = await Calendar.getCalendarsAsync(
    Calendar.EntityTypes.EVENT,
  );
  const writable = calendars.filter((c) => c.allowsModifications);
  return writable.find((c) => c.isPrimary) ?? writable[0] ?? null;
};

// Crea el evento. Devuelve el id del evento, o null si no se creó directo
export const createTaskEvent = async ({
  title,
  startDate,
  endDate,
  location,
  notes,
}) => {
  const allowed = await handlePermission(
    Calendar.requestCalendarPermissionsAsync,
    "el calendario",
  );
  if (!allowed) return null;

  const eventData = {
    title,
    startDate,
    endDate,
    timeZone: getTimeZone(),
    location: location ?? undefined,
    notes: notes ?? undefined,
  };

  try {
    const calendar = await findWritableCalendar();

    if (!calendar) {
      await Calendar.createEventInCalendarAsync(eventData);
      return null;
    }

    const eventId = await Calendar.createEventAsync(calendar.id, eventData);
    Alert.alert("Calendario", "Evento agregado a tu calendario.");
    return eventId;
  } catch (e) {
    console.log("No se pudo crear el evento", e?.message);
    Alert.alert("Calendario", "No se pudo crear el evento en el calendario.");
    return null;
  }
};

export const deleteTaskEvent = async (eventId) => {
  try {
    await Calendar.deleteEventAsync(eventId);
  } catch (e) {
    console.log("No se pudo borrar el evento", e?.message);
  }
};
