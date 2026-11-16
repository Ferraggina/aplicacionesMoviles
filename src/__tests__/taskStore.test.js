jest.mock("../storage/storage", () => ({
  getTasks: jest.fn().mockResolvedValue([]),
  saveTasks: jest.fn().mockResolvedValue(undefined),
}));
jest.mock("../services/notifications", () => ({
  cancelReminder: jest.fn().mockResolvedValue(undefined),
}));
jest.mock("../services/calendar", () => ({
  deleteTaskEvent: jest.fn().mockResolvedValue(undefined),
}));

import { useTaskStore } from "../store/useTaskStore";
import { getTasks, saveTasks } from "../storage/storage";
import { cancelReminder } from "../services/notifications";
import { deleteTaskEvent } from "../services/calendar";

const makeTask = (overrides = {}) => ({
  id: "1",
  title: "Estudiar",
  done: false,
  notificationId: null,
  calendarEventId: null,
  ...overrides,
});

describe("useTaskStore", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useTaskStore.setState({ owner: "cristian", tasks: [] });
  });

  it("carga las tareas del usuario", async () => {
    getTasks.mockResolvedValueOnce([makeTask()]);

    await useTaskStore.getState().loadTasks("ana");

    expect(useTaskStore.getState().owner).toBe("ana");
    expect(useTaskStore.getState().tasks).toHaveLength(1);
  });

  it("agrega una tarea y la guarda", async () => {
    await useTaskStore.getState().addTask(makeTask());

    expect(useTaskStore.getState().tasks).toHaveLength(1);
    expect(saveTasks).toHaveBeenCalledTimes(1);
  });

  it("marca una tarea como hecha y vuelve a desmarcarla", async () => {
    useTaskStore.setState({ tasks: [makeTask()] });

    await useTaskStore.getState().toggleTask("1");
    expect(useTaskStore.getState().tasks[0].done).toBe(true);

    await useTaskStore.getState().toggleTask("1");
    expect(useTaskStore.getState().tasks[0].done).toBe(false);
  });

  it("elimina la tarea y cancela su notificación y su evento", async () => {
    useTaskStore.setState({
      tasks: [makeTask({ notificationId: "n1", calendarEventId: "e1" })],
    });

    await useTaskStore.getState().deleteTask("1");

    expect(useTaskStore.getState().tasks).toHaveLength(0);
    expect(cancelReminder).toHaveBeenCalledWith("n1");
    expect(deleteTaskEvent).toHaveBeenCalledWith("e1");
  });
});
