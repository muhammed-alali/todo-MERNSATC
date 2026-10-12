"use client";

import axios from "axios";
import { FormEvent, useEffect, useState } from "react";

interface Task {
  _id?: string;
  title: string;
  description?: string;
  completed: boolean;
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);

  const [newTask, setNewTask] = useState<Task>({
    title: "",
    description: "",
    completed: false,
  });

  const [editingId, setEditingId] = useState<string | null>(null);

  const [editTask, setEditTask] = useState({
    title: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );

  // ==========================================
  // Toast
  // ==========================================

  const showMessage = (text: string, type: "success" | "error" = "success") => {
    setMessage(text);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
    }, 2500);
  };
  console.log(process.env.NEXT_PUBLIC_API_URL, "ffffff");
  // ==========================================
  // GET ALL TASKS
  // ==========================================

  const fetchData = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/tasks`,
      );

      setTasks(response.data);

      console.log("tasks:", response.data);
    } catch (error) {
      console.log("Error fetching tasks:", error);

      showMessage("Failed to load tasks", "error");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // GET ONE TASK
  // ==========================================

  const getTask = async (id: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/task/${id}`,
      );

      console.log("Task:", response.data);

      return response.data;
    } catch (error) {
      console.log("Error getting task:", error);

      showMessage("Failed to get task", "error");
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    fetchData();
  }, []);

  // ==========================================
  // CREATE TASK
  // ==========================================

  const createTask = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!newTask.title.trim()) {
      showMessage("Please enter a task title", "error");

      return;
    }

    try {
      setAdding(true);

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/task`, newTask);

      await fetchData();

      setNewTask({
        title: "",
        description: "",
        completed: false,
      });

      showMessage("Task added successfully");
    } catch (error) {
      console.log("Error creating task:", error);

      showMessage("Failed to create task", "error");
    } finally {
      setAdding(false);
    }
  };

  // ==========================================
  // START EDIT
  // ==========================================

  const startEdit = (task: Task) => {
    const id = task._id;

    if (!id) return;

    setEditingId(id);

    setEditTask({
      title: task.title,
      description: task.description ?? "",
    });
  };

  // ==========================================
  // CANCEL EDIT
  // ==========================================

  const cancelEdit = () => {
    setEditingId(null);

    setEditTask({
      title: "",
      description: "",
    });
  };

  // ==========================================
  // UPDATE TASK
  // ==========================================

  const updateTask = async (id: string) => {
    if (!editTask.title.trim()) {
      showMessage("Task title cannot be empty", "error");

      return;
    }

    try {
      setUpdatingId(id);

      await axios.put(`http://localhost:5000/task/${id}`, {
        title: editTask.title,
        description: editTask.description,
      });

      await fetchData();

      cancelEdit();

      showMessage("Task updated successfully");
    } catch (error) {
      console.log("Error updating task:", error);

      showMessage("Failed to update task", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  // ==========================================
  // TOGGLE COMPLETED
  // ==========================================

  const toggleCompleted = async (task: Task) => {
    const id = task._id;

    if (!id) return;

    try {
      setUpdatingId(id);

      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/task/${id}`, {
        completed: !task.completed,
      });

      await fetchData();

      showMessage(
        task.completed ? "Task marked as active" : "Task completed ✓",
      );
    } catch (error) {
      console.log("Error updating completed:", error);

      showMessage("Failed to update task", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  // ==========================================
  // DELETE TASK
  // ==========================================

  const deleteTask = async (id: string) => {
    try {
      setDeletingId(id);

      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/task/${id}`);

      await fetchData();

      showMessage("Task deleted successfully");
    } catch (error) {
      console.log("Error deleting task:", error);

      showMessage("Failed to delete task", "error");
    } finally {
      setDeletingId(null);
    }
  };

  // ==========================================
  // STATS
  // ==========================================

  const completedTasks = tasks.filter((task) => task.completed).length;

  const pendingTasks = tasks.length - completedTasks;

  // ==========================================
  // UI
  // ==========================================

  return (
    <main className="tasks-page">
      {/* Toast */}
      {message && (
        <div
          className={`toast ${
            messageType === "error" ? "toast-error" : "toast-success"
          }`}
        >
          <span>{messageType === "error" ? "!" : "✓"}</span>

          {message}
        </div>
      )}

      <div className="tasks-container">
        {/* ================= HEADER ================= */}
        <header className="tasks-header">
          <div>
            <span className="tasks-badge">✦ Productivity</span>

            <h1>
              My <span>Tasks</span>
            </h1>

            <p>Organize your work and stay productive.</p>
          </div>

          <div className="tasks-count">
            <strong>{tasks.length}</strong>

            <span>Total</span>
          </div>
        </header>
        {/* ================= STATS ================= */}
        <div className="stats">
          <div className="stat-card">
            <div className="stat-icon total">✓</div>

            <div>
              <strong>{tasks.length}</strong>

              <span>Total Tasks</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon completed">✓</div>

            <div>
              <strong>{completedTasks}</strong>

              <span>Completed</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon pending">◷</div>

            <div>
              <strong>{pendingTasks}</strong>

              <span>In Progress</span>
            </div>
          </div>
        </div>
        {/* ================= CREATE ================= */}
        <section className="task-form-card">
          <form onSubmit={createTask}>
            {/* Title */}
            <div className="input-wrapper">
              <span className="input-icon">+</span>

              <input
                type="text"
                placeholder="What do you need to do?"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    title: e.target.value,
                  })
                }
              />
            </div>

            {/* Description */}
            <div className="input-wrapper description-input">
              <span className="input-icon description-icon">≡</span>

              <textarea
                placeholder="Add a description..."
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({
                    ...newTask,
                    description: e.target.value,
                  })
                }
              />
            </div>

            {/* Options */}
            <div className="form-options">
              <label className="completed-option">
                <input
                  type="checkbox"
                  checked={newTask.completed}
                  onChange={(e) =>
                    setNewTask({
                      ...newTask,
                      completed: e.target.checked,
                    })
                  }
                />

                <span className="custom-checkbox">
                  {newTask.completed && "✓"}
                </span>

                <span>Mark as completed</span>
              </label>

              {/* Add Button */}
              <button
                type="submit"
                className="add-button"
                disabled={adding || !newTask.title.trim()}
              >
                {adding ? (
                  <span className="spinner" />
                ) : (
                  <>
                    <span>+</span>
                    Add Task
                  </>
                )}
              </button>
            </div>
          </form>
        </section>
        {/* ================= TASKS ================= */}
        <section className="tasks-section">
          <div className="section-title">
            <div>
              <h2>Your Tasks</h2>

              <p>Manage your daily work</p>
            </div>

            <span>
              {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
            </span>
          </div>

          {/* Loading */}

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner" />

              <p>Loading tasks...</p>
            </div>
          ) : tasks.length === 0 ? (
            /* Empty */

            <div className="empty-state">
              <div className="empty-icon">✓</div>

              <h3>No tasks yet</h3>

              <p>Add your first task and start being productive.</p>
            </div>
          ) : (
            <div className="task-list">
              {tasks.map((task, index) => {
                const id = task._id;

                const isEditing = editingId === id;

                const isDeleting = deletingId === id;

                const isUpdating = updatingId === id;

                return (
                  <article
                    className={`task-card ${task.completed ? "task-done" : ""}`}
                    key={id ?? index}
                    style={{
                      animationDelay: `${index * 70}ms`,
                    }}
                  >
                    {/* CHECK */}

                    <button
                      className={`task-check ${
                        task.completed ? "completed" : ""
                      }`}
                      onClick={() => id && toggleCompleted(task)}
                      disabled={isUpdating || !id}
                      aria-label="Complete task"
                    >
                      {task.completed && "✓"}
                    </button>

                    {/* CONTENT */}

                    <div className="task-content">
                      {isEditing ? (
                        <div className="edit-box">
                          <input
                            value={editTask.title}
                            onChange={(e) =>
                              setEditTask({
                                ...editTask,
                                title: e.target.value,
                              })
                            }
                            autoFocus
                          />

                          <textarea
                            placeholder="Description..."
                            value={editTask.description}
                            onChange={(e) =>
                              setEditTask({
                                ...editTask,
                                description: e.target.value,
                              })
                            }
                          />

                          <div className="edit-actions">
                            <button
                              className="save-button"
                              onClick={() => id && updateTask(id)}
                              disabled={isUpdating}
                            >
                              {isUpdating ? "Saving..." : "Save"}
                            </button>

                            <button
                              className="cancel-button"
                              onClick={cancelEdit}
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <h3
                            className={task.completed ? "task-completed" : ""}
                          >
                            {task.title}
                          </h3>

                          {task.description && <p>{task.description}</p>}

                          <span className="task-status">
                            {task.completed ? "Completed" : "In progress"}
                          </span>
                        </>
                      )}
                    </div>

                    {/* ACTIONS */}

                    {!isEditing && (
                      <div className="task-actions">
                        <button
                          className="action-button edit"
                          onClick={() => startEdit(task)}
                          disabled={!id || isUpdating}
                          title="Edit"
                        >
                          ✎
                        </button>

                        <button
                          className="action-button delete"
                          onClick={() => id && deleteTask(id)}
                          disabled={!id || isDeleting}
                          title="Delete"
                        >
                          {isDeleting ? (
                            <span className="small-spinner" />
                          ) : (
                            "⌫"
                          )}
                        </button>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
