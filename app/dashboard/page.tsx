"use client";

import { useEffect, useState } from "react";

interface Task {
  _id: string;
  title: string;
  status: "todo" | "doing" | "done";
  priority: "low" | "medium" | "high";
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const taskRes = await fetch("/api/tasks", {
          credentials: "include",
        });

        if (!taskRes.ok) {
          console.error("Tasks fetch failed:", taskRes.status);
          setLoading(false);
          return;
        }

        const tasksData = await taskRes.json();
        setTasks(tasksData);

        const userRes = await fetch("/api/me", {
          credentials: "include",
        });

        if (userRes.ok) {
          const userData = await userRes.json();
          setUserEmail(userData.email);
        }
      } catch (err) {
        console.error("Dashboard load error:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  async function handleCreate() {
    if (!newTitle) return;

    const res = await fetch("/api/tasks", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newTitle,
        status: "todo",
        priority: "medium",
      }),
    });

    if (res.ok) {
      const created = await res.json();
      setTasks((prev) => [...prev, created]);
      setNewTitle("");
    }
  }

  async function handleDelete(id: string) {
    await fetch("/api/tasks", {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    setTasks((prev) => prev.filter((task) => task._id !== id));
  }

  async function handleLogout() {
    await fetch("/api/logout", {
      method: "POST",
      credentials: "include",
    });

    window.location.href = "/login?logout=1";
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-10">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          {userEmail && (
            <p className="text-gray-400 text-sm mt-1">
              Logged in as {userEmail}
            </p>
          )}
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition"
        >
          Logout
        </button>
      </div>

      {/* Create Task */}
      <div className="mb-6 flex gap-2">
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="New task..."
          className="px-4 py-2 bg-gray-800 border border-gray-700 rounded w-64"
        />
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-600 rounded"
        >
          Add
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Column
          title="Todo"
          status="todo"
          tasks={tasks}
          onDelete={handleDelete}
        />
        <Column
          title="In Progress"
          status="doing"
          tasks={tasks}
          onDelete={handleDelete}
        />
        <Column
          title="Done"
          status="done"
          tasks={tasks}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}

function Column({
  title,
  status,
  tasks,
  onDelete,
}: {
  title: string;
  status: "todo" | "doing" | "done";
  tasks: Task[];
  onDelete: (id: string) => void;
}) {
  const filtered = tasks.filter((task) => task.status === status);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <p className="text-gray-500 text-sm">No tasks</p>
        )}

        {filtered.map((task) => (
          <div
            key={task._id}
            className="bg-gray-800 p-4 rounded border border-gray-700 flex justify-between items-center"
          >
            <div>
              <span>{task.title}</span>
              <span
                className={`ml-2 text-xs px-2 py-1 rounded ${
                  task.priority === "high"
                    ? "bg-red-600"
                    : task.priority === "medium"
                    ? "bg-yellow-600"
                    : "bg-green-600"
                }`}
              >
                {task.priority}
              </span>
            </div>

            <button
              onClick={() => onDelete(task._id)}
              className="text-red-400 text-xs"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
