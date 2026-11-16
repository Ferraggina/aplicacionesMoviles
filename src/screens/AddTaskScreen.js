import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  Switch,
  Alert,
  ScrollView,
  StyleSheet,
} from "react-native";
import AppInput from "../components/AppInput";
import AppButton from "../components/AppButton";
import { useTaskStore } from "../store/useTaskStore";
import {
  validateTaskTitle,
  validateReminderMinutes,
} from "../utils/validators";
import { formatLocation, formatContact } from "../utils/formatters";
import { buildEventDates } from "../utils/dates";
import {
  ensureNotificationPermission,
  scheduleTaskReminder,
  notificationsSupported,
} from "../services/notifications";
import { takePhoto, pickFromGallery } from "../services/photos";
import { getCurrentPlace } from "../services/location";
import { pickContact } from "../services/contacts";
import { createTaskEvent } from "../services/calendar";

export default function AddTaskScreen({ navigation }) {
  const addTask = useTaskStore((s) => s.addTask);
  const [title, setTitle] = useState("");
  const [minutes, setMinutes] = useState("");
  const [photoUri, setPhotoUri] = useState(null);
  const [location, setLocation] = useState(null);
  const [locating, setLocating] = useState(false);
  const [contact, setContact] = useState(null);
  const [addToCalendar, setAddToCalendar] = useState(false);
  const [errors, setErrors] = useState({});

  const handleTakePhoto = async () => {
    const uri = await takePhoto();
    if (uri) setPhotoUri(uri);
  };

  const handlePickPhoto = async () => {
    const uri = await pickFromGallery();
    if (uri) setPhotoUri(uri);
  };

  const handleGetLocation = async () => {
    setLocating(true);
    const place = await getCurrentPlace();
    setLocating(false);
    if (place) setLocation(place);
  };

  const handlePickContact = async () => {
    const picked = await pickContact();
    if (picked) setContact(picked);
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
      location,
      contact,
      calendarEventId: null,
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

    if (addToCalendar) {
      const { startDate, endDate } = buildEventDates(minutes);
      task.calendarEventId = await createTaskEvent({
        title: task.title,
        startDate,
        endDate,
        location: formatLocation(location),
        notes: contact ? `Responsable: ${formatContact(contact)}` : undefined,
      });
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

      <Text style={styles.section}>Lugar (opcional)</Text>
      {location ? (
        <Text style={styles.info}>📍 {formatLocation(location)}</Text>
      ) : null}
      <AppButton
        title={
          locating ? "Obteniendo ubicación..." : "Usar mi ubicación actual"
        }
        variant="secondary"
        onPress={handleGetLocation}
      />
      {location ? (
        <AppButton
          title="Quitar ubicación"
          variant="secondary"
          onPress={() => setLocation(null)}
        />
      ) : null}

      <Text style={styles.section}>Responsable (opcional)</Text>
      {contact ? (
        <Text style={styles.info}>👤 {formatContact(contact)}</Text>
      ) : null}
      <AppButton
        title="Elegir de mis contactos"
        variant="secondary"
        onPress={handlePickContact}
      />
      {contact ? (
        <AppButton
          title="Quitar responsable"
          variant="secondary"
          onPress={() => setContact(null)}
        />
      ) : null}

      <Text style={styles.section}>Calendario (opcional)</Text>
      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Agregar al calendario</Text>
        <Switch value={addToCalendar} onValueChange={setAddToCalendar} />
      </View>
      <Text style={styles.hint}>
        El evento empieza a la hora del recordatorio (o en 1 hora si no pusiste
        minutos) y dura 30 minutos.
      </Text>

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
  info: { fontSize: 14, color: "#0066cc", marginVertical: 4 },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 4,
  },
  switchLabel: { fontSize: 16, color: "#222" },
});
