import React, { useState } from "react";
import { View, Text, Image, Alert, ScrollView, StyleSheet } from "react-native";
import AppInput from "../components/AppInput";
import AppButton from "../components/AppButton";
import { useTaskStore } from "../store/useTaskStore";
import {
  validateTaskTitle,
  validateReminderMinutes,
} from "../utils/validators";
import {
  ensureNotificationPermission,
  scheduleTaskReminder,
  notificationsSupported,
} from "../services/notifications";
import { takePhoto, pickFromGallery } from "../services/photos";

export default function AddTaskScreen({ navigation }) {
  const addTask = useTaskStore((s) => s.addTask);
  const [title, setTitle] = useState("");
  const [minutes, setMinutes] = useState("");
  const [photoUri, setPhotoUri] = useState(null);
  const [errors, setErrors] = useState({});

  const handleTakePhoto = async () => {
    const uri = await takePhoto();
    if (uri) setPhotoUri(uri);
  };

  const handlePickPhoto = async () => {
    const uri = await pickFromGallery();
    if (uri) setPhotoUri(uri);
  };

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
      photoUri,
    };

    if (minutes.trim() !== "" && !notificationsSupported) {
      Alert.alert(
        "Aviso",
        "Las notificaciones no están disponibles en Expo Go. La tarea se guardó sin recordatorio.",
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
            "La tarea se guardó, pero sin recordatorio porque no permitiste las notificaciones.",
          );
        }
      } catch (e) {
        console.error("Error programando notificación", e);
        Alert.alert(
          "Aviso",
          "No se pudo programar el recordatorio. La tarea se guardó igual.",
        );
      }
    }

    await addTask(task);
    navigation.goBack();
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
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

      <Text style={styles.section}>Foto (opcional)</Text>
      {photoUri ? (
        <Image source={{ uri: photoUri }} style={styles.preview} />
      ) : null}
      <AppButton
        title="Tomar foto"
        variant="secondary"
        onPress={handleTakePhoto}
      />
      <AppButton
        title="Elegir de la galería"
        variant="secondary"
        onPress={handlePickPhoto}
      />
      {photoUri ? (
        <AppButton
          title="Quitar foto"
          variant="secondary"
          onPress={() => setPhotoUri(null)}
        />
      ) : null}

      <AppButton title="Guardar tarea" onPress={handleSave} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: "#f5f5f5" },
  container: { padding: 24, paddingBottom: 48 },
  hint: { fontSize: 12, color: "#666", marginBottom: 8 },
  section: { fontSize: 14, color: "#333", marginTop: 12, marginBottom: 4 },
  preview: { width: "100%", height: 180, borderRadius: 8, marginVertical: 8 },
});
