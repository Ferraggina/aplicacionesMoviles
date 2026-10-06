import React, { useState } from "react";
import { View, Text, Alert, StyleSheet } from "react-native";
import AppInput from "../components/AppInput";
import AppButton from "../components/AppButton";
import { useAuth } from "../context/AuthContext";
import { getTasks, saveTasks } from "../storage/storage";
import {
  validateTaskTitle,
  validateReminderMinutes,
} from "../utils/validators";
import {
  ensureNotificationPermission,
  scheduleTaskReminder,
  notificationsSupported,
} from "../services/notifications";

export default function AddTaskScreen({ navigation }) {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [minutes, setMinutes] = useState("");
  const [errors, setErrors] = useState({});

  const handleSave = async () => {
    const newErrors = {
      title: validateTaskTitle(title),
      minutes: validateReminderMinutes(minutes),
    };
    setErrors(newErrors);
    if (newErrors.title || newErrors.minutes) return;

    const task = {
      id: Date.now().toString(),
      title: title.trim(),
      done: false,
      reminderAt: null,
      notificationId: null,
    };

    if (minutes.trim() !== "" && !notificationsSupported) {
      Alert.alert(
        "Aviso",
        "Las notificaciones no están disponibles en Expo Go por lo que la tarea se guardo sin recordatorio.",
      );
    } else if (minutes.trim() !== "") {
      try {
        const allowed = await ensureNotificationPermission();
        if (allowed) {
          const date = new Date(Date.now() + Number(minutes) * 60 * 1000);
          task.notificationId = await scheduleTaskReminder(task.title, date);
          task.reminderAt = date.toISOString();
        } else {
          Alert.alert(
            "Sin permiso",
            "La tarea se guardo, pero sin recordatorio porque no permitiste las notificaciones.",
          );
        }
      } catch (e) {
        console.error("Error programando notificación", e);
        Alert.alert(
          "Aviso",
          "No se pudo programar el recordatorio. La tarea se guardo igual.",
        );
      }
    }

    const tasks = await getTasks(user);
    await saveTasks(user, [...tasks, task]);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <AppInput
        label="Título"
        value={title}
        onChangeText={setTitle}
        error={errors.title}
        placeholder="Ej: Estudiar para el parcial"
      />
      <AppInput
        label="Recordarme en (minutos, opcional)"
        value={minutes}
        onChangeText={setMinutes}
        error={errors.minutes}
        keyboardType="numeric"
        placeholder="Ej: 1"
      />
      <Text style={styles.hint}>
        Si completás los minutos, vas a recibir una notificación con el título
        de la tarea.
      </Text>
      <AppButton title="Guardar tarea" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#f5f5f5" },
  hint: { fontSize: 12, color: "#666", marginBottom: 8 },
});
