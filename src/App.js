import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "./convex/_generated/api";

const App = () => {
  // State for task input
  const [newTask, setNewTask] = useState("");

  // Fetch all tasks using the useQuery hook
  const tasks = useQuery(api.tasks.get) || [];

  // Define mutations for create, update, and delete operations
  const createTask = useMutation(api.tasks.create);
  const updateTask = useMutation(api.tasks.update);
  const deleteTask = useMutation(api.tasks.remove);

  // Handle creating a new task
  const handleCreateTask = async () => {
    if (!newTask.trim()) return; // Prevent creating empty tasks
    await createTask({ text: newTask, isCompleted: false });
    setNewTask(""); // Reset input after task creation
  };

  // Handle updating a task
  const handleUpdateTask = async (id, text, isCompleted) => {
    await updateTask({ id, text, isCompleted });
  };

  // Handle deleting a task
  const handleDeleteTask = async (id) => {
    await deleteTask({ id });
  };

  return (
    <div className="App">
      <h1>Task Manager</h1>

      {/* Input field for adding a new task */}
      <div>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="New task"
        />
        <button onClick={handleCreateTask}>Add Task</button>
      </div>

      {/* List of tasks */}
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
    </div>
  );
};

export default App;