import { Alert, Linking } from "react-native";

export const handlePermission = async (requestFn, resourceName) => {
  const result = await requestFn();
  if (result.granted) return true;

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
