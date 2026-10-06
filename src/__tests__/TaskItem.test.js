import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import TaskItem from "../components/TaskItem";

describe("TaskItem", () => {
  const task = { id: "1", title: "Estudiar", done: false, reminderAt: null };

  it("muestra el título de la tarea", async () => {
    await render(
      <TaskItem task={task} onToggle={jest.fn()} onDelete={jest.fn()} />,
    );
    expect(screen.getByText(/Estudiar/)).toBeTruthy();
  });

  it('llama a onDelete con el id al tocar "Eliminar"', async () => {
    const onDelete = jest.fn();
    await render(
      <TaskItem task={task} onToggle={jest.fn()} onDelete={onDelete} />,
    );

    await fireEvent.press(screen.getByText("Eliminar"));

    expect(onDelete).toHaveBeenCalledWith("1");
  });

  it("llama a onToggle con el id al tocar el título", async () => {
    const onToggle = jest.fn();
    await render(
      <TaskItem task={task} onToggle={onToggle} onDelete={jest.fn()} />,
    );

    await fireEvent.press(screen.getByText(/Estudiar/));

    expect(onToggle).toHaveBeenCalledWith("1");
  });
});
