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
      }),
    });

    if (res.ok) {
      const created = await res.json();
      setTasks((prev) => [...prev, created]);
      setNewTitle("");
      toast.success("Task created");
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
    const { source, destination } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceTasks = tasks.filter(
      (task) => task.status === source.droppableId
    );

    const destinationTasks = tasks.filter(
      (task) => task.status === destination.droppableId
    );

    const movedTask = sourceTasks[source.index];
    if (!movedTask) return;

    sourceTasks.splice(source.index, 1);

    movedTask.status = destination.droppableId as any;

    destinationTasks.splice(destination.index, 0, movedTask);

    const otherTasks = tasks.filter(
      (task) =>
        task.status !== source.droppableId &&
        task.status !== destination.droppableId
    );

    const newTasks = [
      ...otherTasks,
      ...sourceTasks,
      ...destinationTasks,
    ];

    setTasks(newTasks);

    await fetch("/api/tasks", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: movedTask._id,
        status: movedTask.status,
      }),
    });
  }

  const columns = [
    { id: "todo", title: "To Do" },
    { id: "doing", title: "In Progress" },
    { id: "done", title: "Completed" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white p-10">
      <div className="mb-10">
        <h1 className="text-4xl font-bold">Task Board</h1>
        <p className="text-gray-400 mt-2">
          Drag tasks between columns to update status
        </p>
      </div>

      <div className="mb-8 flex gap-3">
        <input
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Enter task title..."
          className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleCreate}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl transition"
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
                  className="bg-gray-900 border border-gray-800 rounded-2xl p-6 min-h-[400px]"
                >
                  <h2 className="text-xl font-semibold mb-6">
                    {col.title}
                  </h2>

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
                            className="bg-gray-800 p-4 rounded-xl mb-4 border border-gray-700 hover:shadow-lg transition"
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
                                <span>{task.title}</span>
                                <div className="flex gap-3 text-sm">
                                  <button
                                    onClick={() => {
                                      setEditingId(task._id);
                                      setEditingText(task.title);
                                    }}
                                    className="text-yellow-400"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleDelete(task._id)
                                    }
                                    className="text-red-400"
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
