import * as ImagePicker from "expo-image-picker";
import { handlePermission } from "./permissions";

// Devuelve el URI de la foto, o null si se canceló o no hay permiso
export const takePhoto = async () => {
  const allowed = await handlePermission(
    ImagePicker.requestCameraPermissionsAsync,
    "la cámara",
  );
  if (!allowed) return null;

  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.5,
  });
  return result.canceled ? null : result.assets[0].uri;
};

export const pickFromGallery = async () => {
  const allowed = await handlePermission(
    ImagePicker.requestMediaLibraryPermissionsAsync,
    "la galería",
  );
  if (!allowed) return null;

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [4, 3],
    quality: 0.5,
  });
  return result.canceled ? null : result.assets[0].uri;
};
