import React, { useCallback, useLayoutEffect } from "react";
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
import { useTaskStore } from "../store/useTaskStore";

export default function HomeScreen({ navigation }) {
  const { user, logout } = useAuth();

  const tasks = useTaskStore((s) => s.tasks);
  const loadTasks = useTaskStore((s) => s.loadTasks);
  const toggleTask = useTaskStore((s) => s.toggleTask);
  const deleteTask = useTaskStore((s) => s.deleteTask);

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
      loadTasks(user);
    }, [user, loadTasks]),
  );

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
            No tenés tareas todavía. Agregá una para comenzar
          </Text>
        }
        contentContainerStyle={styles.list}
      />

      <View style={styles.newTaskButton}>
        <AppButton
          title="Nueva tarea"
          onPress={() => navigation.navigate("AddTask")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#f5f5f5" },
  greeting: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
  list: { flexGrow: 1 },
  empty: { textAlign: "center", color: "#888", marginTop: 40 },
  newTaskButton: { marginBottom: 50 },
});
