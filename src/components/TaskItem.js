import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { formatReminder } from "../utils/formatters";

export default function TaskItem({ task, onToggle, onDelete }) {
  const reminder = formatReminder(task.reminderAt);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.info}
        onPress={() => onToggle(task.id)}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: task.done }}
      >
        <Text style={[styles.title, task.done && styles.done]}>
          {task.done ? "✓ " : "○ "}
          {task.title}
        </Text>
        {reminder ? <Text style={styles.reminder}>⏰ {reminder}</Text> : null}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => onDelete(task.id)}
        accessibilityLabel={`Eliminar ${task.title}`}
        style={styles.deleteButton}
      >
        <Text style={styles.deleteText}>Eliminar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  info: { flex: 1 },
  title: { fontSize: 16, color: "#222" },
  done: { textDecorationLine: "line-through", color: "#999" },
  reminder: { fontSize: 12, color: "#0066cc", marginTop: 4 },
  deleteButton: { paddingHorizontal: 8, paddingVertical: 6 },
  deleteText: { color: "#cc0000", fontWeight: "600" },
});
