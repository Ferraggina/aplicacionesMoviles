import AsyncStorage from "@react-native-async-storage/async-storage";

const USERS_KEY = "users";
const SESSION_KEY = "session";

export const getUsers = async () => {
  try {
    const raw = await AsyncStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Error al leer los usuarios", e);
    return [];
  }
};

export const saveUsers = (users) =>
  AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));

export const getSession = () => AsyncStorage.getItem(SESSION_KEY);
export const saveSession = (username) =>
  AsyncStorage.setItem(SESSION_KEY, username);
export const clearSession = () => AsyncStorage.removeItem(SESSION_KEY);

const tasksKey = (username) => `tasks:${username}`;
export const getTasks = async (username) => {
  try {
    const raw = await AsyncStorage.getItem(tasksKey(username));
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error("Error al leer las tareas", e);
    return [];
  }
};

export const saveTasks = (username, tasks) =>
  AsyncStorage.setItem(tasksKey(username), JSON.stringify(tasks));
