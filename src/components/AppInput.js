import React, { useState } from "react";
import {
  TextInput,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function AppInput({ label, error, secureTextEntry, ...props }) {
  const [hidden, setHidden] = useState(true);
  const isPassword = Boolean(secureTextEntry);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputRow, error && styles.inputError]}>
        <TextInput
          style={styles.input}
          placeholderTextColor="#999"
          secureTextEntry={isPassword && hidden}
          {...props}
        />
        {isPassword ? (
          <TouchableOpacity
            onPress={() => setHidden((h) => !h)}
            accessibilityRole="button"
            accessibilityLabel={
              hidden ? "Mostrar contraseña" : "Ocultar contraseña"
            }
            style={styles.eye}
          >
            <Text style={styles.eyeIcon}>{hidden ? "🙈" : "👁️"}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  label: { fontSize: 14, marginBottom: 4, color: "#333" },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: "#222",
  },
  eye: { paddingHorizontal: 12, paddingVertical: 10 },
  inputError: { borderColor: "#cc0000" },
  error: { color: "#cc0000", fontSize: 12, marginTop: 4 },
  eyeIcon: { fontSize: 20 },
});
