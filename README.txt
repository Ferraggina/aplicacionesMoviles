
Mis Tareas

Aplicación móvil de gestión de tareas hecha con React Native + Expo (SDK 57) para el Parcial 2 de Aplicaciones Móviles.

Parte de la app del Parcial 1 (login local, tareas con recordatorio) y le suma permisos, cámara/galería, ubicación, contactos, calendario y estado global con Zustand.

APK (Android)

Versión instalable con todas las funciones, incluidas las notificaciones:
https://expo.dev/accounts/ferraggina/projects/todo-app/builds/180ebdd6-6495-4328-ae59-6bf677302369

Video demo
https://drive.google.com/file/d/1BegsDWDXbPx353Hjp5KZS414rM-XD8iX/view?usp=sharing

Cómo ejecutar la app

Requisitos: Node.js y la app Expo Go para SDK 57 en el celular.

npm install
npx expo start

Escaneá el QR con Expo Go.

Tambien se puede ejecutar el comando para el BUILD en el cual si funcionan las Notificaciiones: 
eas build -p android --profile preview


Funcionalidades

Del Parcial 1 

Registro e inicio de sesión local, con sesión persistente (AsyncStorage). Cada usuario ve solo sus tareas.
Crear, listar, marcar como hecha y eliminar tareas.
Notificación local a los X minutos indicados (se cancela si se elimina la tarea).
Navegación con React Navigation (Stack) y botón "Salir".


Nuevas en el Parcial 2

Para los permisos cada recurso (cámara, galería, ubicación, contactos, calendario, notificaciones) pide permiso en el momento de usarlo. 
Los contactos (expo-contacts) se elige un responsable desde la agenda y se muestra su nombre y teléfono en la tarea.
Para el calendario (expo-calendar) opción "Agregar al calendario" que crea un evento de 30 minutos vinculado a la tarea (se elimina junto con ella).
Para el estado global con Zustand se utiliza un store con loadTasks, addTask, updateTask, toggleTask y deleteTask. Los componentes leen con selectores, por ejemplo useTaskStore((s) => s.tasks).
Se agrego como un detalle la contraseña con un icono de ojito para mostrar y un monito para ocultar lo que se escribe.


Justificaion de las desiciones tecnicas

Se elige Zustand para las tareas, el context para la sesión en el store maneja la lista de tareas y persiste en AsyncStorage en cada acción; la autenticación sigue en AuthContext porque es estado de sesión y no de datos.
Se utiliza eñ SDK 57 y legacy, en este SDK expo-contacts y expo-calendar cambiaron su API principal a una basada en clases. Se usa la API de funciones desde expo-contacts/legacy y expo-calendar/legacy.
El mapa se utiliza desde un link de Google Maps en lugar de sumar una librería de mapas.