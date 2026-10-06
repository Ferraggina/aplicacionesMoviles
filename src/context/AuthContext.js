import React, { createContext, useContext, useEffect, useState } from 'react';
import { getUsers, saveUsers, getSession, saveSession, clearSession } from '../storage/storage';
import { validateUsername, validatePassword } from '../utils/validators';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Al abrir la app: ¿había una sesión guardada?
  useEffect(() => {
    getSession().then((saved) => {
      setUser(saved);
      setLoading(false);
    });
  }, []);

  const register = async (username, password) => {
    const error = validateUsername(username) || validatePassword(password);
    if (error) return { ok: false, error };

    const users = await getUsers();
    const name = username.trim();
    if (users.some((u) => u.username.toLowerCase() === name.toLowerCase())) {
      return { ok: false, error: 'Ese usuario ya existe' };
    }
    await saveUsers([...users, { username: name, password }]);
    return { ok: true };
  };

  const login = async (username, password) => {
    const users = await getUsers();
    const found = users.find(
      (u) => u.username.toLowerCase() === username.trim().toLowerCase() && u.password === password
    );
    if (!found) return { ok: false, error: 'Usuario o contraseña incorrectos' };

    await saveSession(found.username);
    setUser(found.username);
    return { ok: true };
  };

  const logout = async () => {
    await clearSession();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
