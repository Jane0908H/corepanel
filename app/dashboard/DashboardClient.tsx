"use client";

import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import toast from "react-hot-toast";

interface Task {
  _id: string;
  title: string;
  status: "todo" | "doing" | "done";
  priority: "low" | "medium" | "high";
}

export default function DashboardClient() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    const res = await fetch("/api/tasks", {
      credentials: "include",
    });
    if (res.ok) {
      const data = await res.json();
      setTasks(data);
    }
  }

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
        toast.success("Task created successfully");
    } else {
        toast.error("Failed to create task");
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
    toast.success("Task deleted");
  }

  async function handleUpdate(id: string) {
    await fetch("/api/tasks", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, title: editingText }),
    });

    setTasks((prev) =>
      prev.map((t) => (t._id === id ? { ...t, title: editingText } : t))
    );

    setEditingId(null);
    toast.success("Task updated");
  }

  async function handleDragEnd(result: DropResult) {
    if (!result.destination) return;

    const { draggableId, destination } = result;

    await fetch("/api/tasks", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: draggableId,
        status: destination.droppableId,
      }),
    });

    setTasks((prev) =>
      prev.map((t) =>
        t._id === draggableId
          ? { ...t, status: destination.droppableId as any }
          : t
      )
    );
  }

  const columns = [
    { id: "todo", title: "Todo" },
    { id: "doing", title: "In Progress" },
    { id: "done", title: "Done" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white p-10">
      <div className="mb-12">
        <h1 className="text-5xl font-bold tracking-tight">
          CorePanel
        </h1>
        <p className="text-gray-400 mt-2">
          Production-ready SaaS Admin System
        </p>
      </div>

      {/* Create Task */}
      <div className="mb-10 flex gap-3">
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Add a new task..."
          className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl w-80 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <button
          onClick={handleCreate}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all duration-200"
        >
          Add Task
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid md:grid-cols-3 gap-8">
          {columns.map((col) => (
            <Droppable key={col.id} droppableId={col.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-gray-900/70 backdrop-blur-md border border-gray-800 rounded-2xl p-6 min-h-[400px] shadow-xl"
                >
                  <h2 className="text-xl font-semibold mb-6">
                    {col.title}
                  </h2>

                  {tasks.filter((t) => t.status === col.id).length === 0 && (
                    <div className="text-gray-500 text-sm text-center py-10">
                      No tasks yet.
                    </div>
                  )}

                  {tasks
                    .filter((task) => task.status === col.id)
                    .map((task, index) => (
                      <Draggable
                        key={task._id}
                        draggableId={task._id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-gray-800 p-4 rounded-xl mb-4 shadow-md hover:shadow-lg transition-all duration-200 border border-gray-700"
                          >
                            {editingId === task._id ? (
                              <div className="flex gap-2">
                                <input
                                  value={editingText}
                                  onChange={(e) =>
                                    setEditingText(e.target.value)
                                  }
                                  className="bg-gray-700 px-2 py-1 rounded w-full"
                                />
                                <button
                                  onClick={() =>
                                    handleUpdate(task._id)
                                  }
                                  className="text-green-400 text-sm"
                                >
                                  Save
                                </button>
                              </div>
                            ) : (
                              <div className="flex justify-between items-center">
                                <span className="font-medium">
                                  {task.title}
                                </span>

                                <div className="flex gap-3 text-sm">
                                  <button
                                    onClick={() => {
                                      setEditingId(task._id);
                                      setEditingText(task.title);
                                    }}
                                    className="text-yellow-400 hover:opacity-80 transition"
                                  >
                                    Edit
                                  </button>

                                  <button
                                    onClick={() =>
                                      handleDelete(task._id)
                                    }
                                    className="text-red-400 hover:opacity-80 transition"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
