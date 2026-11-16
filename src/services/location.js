import * as Location from "expo-location";
import { Alert } from "react-native";
import { handlePermission } from "./permissions";

// Devuelve { latitude, longitude, address }
export const getCurrentPlace = async () => {
  const allowed = await handlePermission(
    Location.requestForegroundPermissionsAsync,
    "la ubicación",
  );
  if (!allowed) return null;

  try {
    const { coords } = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    const { latitude, longitude } = coords;

    let address = null;
    try {
      const [place] = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      if (place) {
        const street = [place.street, place.streetNumber]
          .filter(Boolean)
          .join(" ");
        address = [street, place.city].filter(Boolean).join(", ") || null;
      }
    } catch (e) {
      console.log("No se pudo obtener la dirección", e?.message);
    }

    return { latitude, longitude, address };
  } catch (e) {
    Alert.alert(
      "Ubicación no disponible",
      "No se pudo obtener la ubicación. Verificá que el GPS esté activado y probá de nuevo.",
    );
    return null;
  }
};
