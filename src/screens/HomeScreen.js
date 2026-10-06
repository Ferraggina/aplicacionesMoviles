import React, { useCallback, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AppButton from "../components/AppButton";
import TaskItem from "../components/TaskItem";
import { useAuth } from "../context/AuthContext";
import { getTasks, saveTasks } from "../storage/storage";
import { cancelReminder } from "../services/notifications";

export default function HomeScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={logout} accessibilityLabel="Cerrar sesión">
          <Text style={{ color: "#cc0000", fontWeight: "600", fontSize: 16 }}>
            Salir
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation, logout]);

  useFocusEffect(
    useCallback(() => {
      getTasks(user).then(setTasks);
    }, [user]),
  );

  const persist = async (updated) => {
    setTasks(updated);
    await saveTasks(user, updated);
  };

  const toggleTask = (id) =>
    persist(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const deleteTask = async (id) => {
    const task = tasks.find((t) => t.id === id);
    if (task?.notificationId) await cancelReminder(task.notificationId);
    persist(tasks.filter((t) => t.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Hola, {user}</Text>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem task={item} onToggle={toggleTask} onDelete={deleteTask} />
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>
            No tenés tareas todavía. ¡Agregá la primera!
          </Text>
        }
        contentContainerStyle={styles.list}
      />

      <AppButton
        title="Nueva tarea"
        onPress={() => navigation.navigate("AddTask")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f5f5f5" },
  greeting: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
  list: { flexGrow: 1 },
  empty: { textAlign: "center", color: "#888", marginTop: 40 },
});
