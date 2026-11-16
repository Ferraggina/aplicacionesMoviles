import { Alert, Linking } from "react-native";

// Pide un permiso y, si no lo dan, muestra un mensaje claro.
// requestFn: la función de la librería que pide el permiso.
export const handlePermission = async (requestFn, resourceName) => {
  const result = await requestFn();
  if (result.granted) return true;

  // Si ya no se puede volver a preguntar, solo queda ir a Ajustes
  const buttons =
    result.canAskAgain === false
      ? [
          { text: "Cancelar", style: "cancel" },
          { text: "Abrir ajustes", onPress: () => Linking.openSettings() },
        ]
      : [{ text: "Entendido" }];

  Alert.alert(
    "Permiso denegado",
    `Necesitamos acceso a ${resourceName} para usar esta función. Podés habilitarlo desde los ajustes del celular.`,
    buttons,
  );
  return false;
};
