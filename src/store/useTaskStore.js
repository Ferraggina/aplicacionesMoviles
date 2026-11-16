import { create } from "zustand";
import { getTasks, saveTasks } from "../storage/storage";
import { cancelReminder } from "../services/notifications";

export const useTaskStore = create((set, get) => ({
  owner: null, // usuario dueño de las tareas cargadas
  tasks: [],

  // Carga las tareas del usuario desde AsyncStorage
  loadTasks: async (username) => {
    const tasks = await getTasks(username);
    set({ owner: username, tasks });
  },

  addTask: async (task) => {
    const { owner, tasks } = get();
    const updated = [...tasks, task];
    set({ tasks: updated });
    await saveTasks(owner, updated);
  },

  updateTask: async (id, changes) => {
    const { owner, tasks } = get();
    const updated = tasks.map((t) => (t.id === id ? { ...t, ...changes } : t));
    set({ tasks: updated });
    await saveTasks(owner, updated);
  },

  toggleTask: async (id) => {
    const task = get().tasks.find((t) => t.id === id);
    if (task) await get().updateTask(id, { done: !task.done });
  },

  deleteTask: async (id) => {
    const { owner, tasks } = get();
    const task = tasks.find((t) => t.id === id);
    if (task?.notificationId) await cancelReminder(task.notificationId);
    const updated = tasks.filter((t) => t.id !== id);
    set({ tasks: updated });
    await saveTasks(owner, updated);
  },
}));
