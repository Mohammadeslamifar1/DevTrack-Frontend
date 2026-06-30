import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import api from "@/api/axios";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [open, setOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const [project, setProject] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("todo");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");

  const [filterProject, setFilterProject] = useState("");

  async function loadProjects() {
    const res = await api.get("projects/");
    setProjects(res.data);
  }

  async function loadTasks() {
    try {
      setLoading(true);

      const url = filterProject
        ? `tasks/?project=${filterProject}`
        : "tasks/";

      const res = await api.get(url);
      setTasks(res.data);
    } catch {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    loadTasks();
  }, [filterProject]);

  function openCreateDialog() {
    setEditTask(null);
    setProject("");
    setTitle("");
    setDescription("");
    setStatus("todo");
    setPriority("medium");
    setDueDate("");
    setOpen(true);
  }

  function openEditDialog(task) {
    setEditTask(task);
    setProject(task.project);
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
    setPriority(task.priority);
    setDueDate(task.due_date || "");
    setOpen(true);
  }

  async function saveTask() {
    const payload = {
      project,
      title,
      description,
      status,
      priority,
      due_date: dueDate,
    };

    try {
      if (editTask) {
        await api.put(`tasks/${editTask.id}/`, payload);
      } else {
        await api.post("tasks/", payload);
      }
      setOpen(false);
      loadTasks();
    } catch {
      alert("Failed to save task");
    }
  }

  async function deleteTask(id) {
    try {
      await api.delete(`tasks/${id}/`);
      loadTasks();
    } catch {
      alert("Failed to delete task");
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <p className="text-gray-600">Loading tasks...</p>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <p className="text-red-600">{error}</p>
        <Button onClick={loadTasks}>Retry</Button>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Tasks</h2>
        <Button onClick={openCreateDialog}>New Task</Button>
      </div>

      {/* Project Filter */}
      <div className="mb-6">
        <select
          className="border p-2 w-64"
          value={filterProject}
          onChange={(e) => setFilterProject(e.target.value)}
        >
          <option value="">All Projects</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Empty State */}
      {tasks.length === 0 && (
        <div className="text-center space-y-4">
          <p className="text-gray-600">No tasks found.</p>
          <Button onClick={openCreateDialog}>Create a task</Button>
        </div>
      )}

      {/* Task List */}
      <div className="grid grid-cols-3 gap-6">
        {tasks.map((task) => (
          <Card key={task.id} className="p-6 space-y-2">
            <h3 className="text-xl font-bold">{task.title}</h3>
            <p className="text-gray-600">{task.description}</p>

            <p>Status: {task.status}</p>
            <p>Priority: {task.priority}</p>
            <p>Due: {task.due_date || "None"}</p>

            <div className="flex gap-2 pt-4">
              <Button onClick={() => openEditDialog(task)}>Edit</Button>
              <Button variant="destructive" onClick={() => deleteTask(task.id)}>
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editTask ? "Edit Task" : "New Task"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <select
              className="border p-2 w-full"
              value={project}
              onChange={(e) => setProject(e.target.value)}
            >
              <option value="">Select project</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            <Input
              placeholder="Task title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <Input
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <select
              className="border p-2 w-full"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>

            <select
              className="border p-2 w-full"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />

            <Button className="w-full" onClick={saveTask}>
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
