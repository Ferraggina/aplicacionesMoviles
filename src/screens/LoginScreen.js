import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import AppInput from "../components/AppInput";
import AppButton from "../components/AppButton";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    const result = await login(username, password);
    if (!result.ok) setError(result.error);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar sesión</Text>
      <AppInput
        label="Usuario"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <AppInput
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <AppButton title="Entrar" onPress={handleLogin} />
      <AppButton
        title="Crear cuenta"
        variant="secondary"
        onPress={() => navigation.navigate("Register")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  error: { color: "#cc0000", marginBottom: 8, textAlign: "center" },
});
