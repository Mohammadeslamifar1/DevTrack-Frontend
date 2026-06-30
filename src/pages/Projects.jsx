import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import api from "@/api/axios";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [open, setOpen] = useState(false);
  const [editProject, setEditProject] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  async function loadProjects() {
    try {
      setLoading(true);
      const res = await api.get("projects/");
      setProjects(res.data);
    } catch (err) {
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  function openCreateDialog() {
    setEditProject(null);
    setName("");
    setDescription("");
    setOpen(true);
  }

  function openEditDialog(project) {
    setEditProject(project);
    setName(project.name);
    setDescription(project.description);
    setOpen(true);
  }

  async function saveProject() {
    try {
      if (editProject) {
        await api.put(`projects/${editProject.id}/`, { name, description });
      } else {
        await api.post("projects/", { name, description });
      }
      setOpen(false);
      loadProjects();
    } catch {
      alert("Failed to save project");
    }
  }

  async function deleteProject(id) {
    try {
      await api.delete(`projects/${id}/`);
      loadProjects();
    } catch {
      alert("Failed to delete project");
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <p className="text-gray-600">Loading projects...</p>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <p className="text-red-600">{error}</p>
        <Button onClick={loadProjects}>Retry</Button>
      </DashboardLayout>
    );
  }

  if (projects.length === 0) {
    return (
      <DashboardLayout>
        <div className="text-center space-y-4">
          <p className="text-gray-600">No projects yet.</p>
          <Button onClick={openCreateDialog}>Create your first project</Button>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Project</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <Input
                placeholder="Project name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <Input
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <Button className="w-full" onClick={saveProject}>
                Save
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Projects</h2>
        <Button onClick={openCreateDialog}>New Project</Button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="p-6 space-y-2">
            <h3 className="text-xl font-bold">{project.name}</h3>
            <p className="text-gray-600">{project.description}</p>

            <div className="flex gap-2 pt-4">
              <Button onClick={() => openEditDialog(project)}>Edit</Button>
              <Button variant="destructive" onClick={() => deleteProject(project.id)}>
                Delete
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editProject ? "Edit Project" : "New Project"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Project name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <Button className="w-full" onClick={saveProject}>
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
