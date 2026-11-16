import * as Contacts from "expo-contacts/legacy";
import { Alert } from "react-native";
import { handlePermission } from "./permissions";

// Devuelve { id, name, phone }
export const pickContact = async () => {
  const allowed = await handlePermission(
    Contacts.requestPermissionsAsync,
    "los contactos",
  );
  if (!allowed) return null;

  try {
    const contact = await Contacts.presentContactPickerAsync();
    if (!contact) return null;

    const name =
      contact.name ||
      [contact.firstName, contact.lastName].filter(Boolean).join(" ") ||
      "Sin nombre";
    const phone = contact.phoneNumbers?.[0]?.number ?? null;

    return { id: contact.id, name, phone };
  } catch (e) {
    Alert.alert(
      "Contactos",
      "No se pudo abrir la agenda de contactos. Intentá de nuevo.",
    );
    return null;
  }
};
