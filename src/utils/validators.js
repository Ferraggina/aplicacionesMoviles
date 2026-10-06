export const validateUsername = (username) => {
  if (!username || username.trim().length < 3) {
    return "El usuario debe tener al menos 3 caracteres";
  }
  return null;
};

export const validatePassword = (password) => {
  if (!password || password.length < 6) {
    return "La contraseña debe tener al menos 6 caracteres";
  }
  return null;
};

export const validateTaskTitle = (title) => {
  if (!title || title.trim().length === 0) {
    return "El título no puede estar vacío";
  }
  return null;
};
export const validateReminderMinutes = (value) => {
  if (value === undefined || value === null || String(value).trim() === "")
    return null;
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1 || n > 10080) {
    return "Ingrsa un numero entero (entre 1 y 10080)";
  }
  return null;
};
