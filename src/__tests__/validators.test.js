import {
  validateUsername,
  validatePassword,
  validateTaskTitle,
  validateReminderMinutes,
} from "../utils/validators";

describe("validateUsername", () => {
  it("rechaza un usuario de menos de 3 caracteres", () => {
    expect(validateUsername("ab")).toBe(
      "El usuario debe tener al menos 3 caracteres",
    );
  });

  it("acepta un usuario válido", () => {
    expect(validateUsername("cristian")).toBeNull();
  });
});

describe("validatePassword", () => {
  it("rechaza una contraseña de menos de 6 caracteres", () => {
    expect(validatePassword("12345")).toBe(
      "La contraseña debe tener al menos 6 caracteres",
    );
  });

  it("acepta una contraseña válida", () => {
    expect(validatePassword("123456")).toBeNull();
  });
});

describe("validateTaskTitle", () => {
  it("rechaza un título vacío o con solo espacios", () => {
    expect(validateTaskTitle("   ")).toBe("El título no puede estar vacío");
  });
});

describe("validateReminderMinutes", () => {
  it("acepta el campo vacío (el recordatorio es opcional)", () => {
    expect(validateReminderMinutes("")).toBeNull();
  });

  it("rechaza valores que no son enteros positivos", () => {
    expect(validateReminderMinutes("abc")).not.toBeNull();
    expect(validateReminderMinutes("0")).not.toBeNull();
    expect(validateReminderMinutes("1.5")).not.toBeNull();
  });
});
