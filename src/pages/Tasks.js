import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import LogoutButton from "../components/LogoutButton";
import Badge from "../components/Badge";

const Tasks = () => {
  const [newTask, setNewTask] = useState("");
  const tasks = useQuery(api.tasks.get) || [];
  const createTask = useMutation(api.tasks.create);
  const updateTask = useMutation(api.tasks.update);
  const deleteTask = useMutation(api.tasks.remove);

  const handleCreateTask = async () => {
    if (!newTask.trim()) return;
    await createTask({ text: newTask, isCompleted: false });
    setNewTask("");
  };

  const handleUpdateTask = async (id, text, isCompleted) => {
    await updateTask({ id, text, isCompleted });
  };

  const handleDeleteTask = async (id) => {
    await deleteTask({ id });
  };

  return (
    <div>
      <h1>Task Manager</h1>
      <Badge />
      <div>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="New task"
        />
        <button onClick={handleCreateTask}>Add Task</button>
      </div>
      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            <input
              type="checkbox"
              checked={task.isCompleted}
              onChange={() =>
                handleUpdateTask(task._id, task.text, !task.isCompleted)
              }
            />
            <input
              type="text"
              value={task.text}
              onChange={(e) =>
                handleUpdateTask(task._id, e.target.value, task.isCompleted)
              }
            />
            <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
      <LogoutButton /> {/* Use the LogoutButton component */}
    </div>
  );
};

export default Tasks;