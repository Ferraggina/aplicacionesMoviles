
Mis Tareas

Aplicación móvil de gestión de tareas hecha con React Native + Expo para el Parcial 1 de Aplicaciones Móviles (ISTEA).

Opción elegida

Gestor de tareas: agregar tareas con título y recordatorio.

Video demo

COMPLETAR: pegar acá el link del video en YouTube (máximo 1 minuto)

Cómo ejecutar la app

Requisitos: Node.js y la app Expo Go en el celular.

npm install
npx expo start

Escaneá el QR con Expo Go.


Funcionalidades implementadas

Registro e inicio de sesión local (usuario y contraseña) guardados en AsyncStorage.
Acceso protegido: sin sesión solo se ven Login y Registro. La sesión se mantiene al cerrar y reabrir la app.
Crear, listar, marcar como hecha y eliminar tareas. Cada usuario ve solo sus tareas.
Datos persistentes con AsyncStorage.
Notificación local programada a los X minutos que se indiquen al crear la tarea (se cancela si la tarea se elimina).
Navegación con React Navigation (Stack): Login, Registro, Home y Alta de tarea.
Componentes reutilizables (AppButton, AppInput, TaskItem) con StyleSheet.
Tests con Jest y React Native Testing Library (componente, validaciones y formateo).
Botón "Salir" para cerrar sesión.