import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import api from "@/api/axios";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadStats() {
    try {
      setLoading(true);
      const res = await api.get("dashboard-stats/");
      setStats(res.data);
    } catch {
      setError("Failed to load dashboard stats");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStats();
  }, []);

  if (loading) {
    return (
      <DashboardLayout>
        <p className="text-gray-600">Loading dashboard...</p>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <p className="text-red-600">{error}</p>
      </DashboardLayout>
    );
  }

  const { total_projects, total_tasks, status_counts } = stats;

  return (
    <DashboardLayout>
      <h2 className="text-2xl font-bold mb-6">Overview</h2>

      <div className="grid grid-cols-3 gap-6 mb-10">
        <Card className="p-6">
          <p className="text-sm text-gray-500">Total Projects</p>
          <p className="text-3xl font-bold mt-2">{total_projects}</p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-gray-500">Total Tasks</p>
          <p className="text-3xl font-bold mt-2">{total_tasks}</p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-gray-500">Completed Tasks</p>
          <p className="text-3xl font-bold mt-2">{status_counts.done}</p>
        </Card>
      </div>

      <h3 className="text-xl font-semibold mb-4">Tasks by Status</h3>
      <div className="grid grid-cols-3 gap-6">
        <Card className="p-6">
          <p className="text-sm text-gray-500">To Do</p>
          <p className="text-2xl font-bold mt-2">{status_counts.todo}</p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-gray-500">In Progress</p>
          <p className="text-2xl font-bold mt-2">{status_counts.in_progress}</p>
        </Card>

        <Card className="p-6">
          <p className="text-sm text-gray-500">Done</p>
          <p className="text-2xl font-bold mt-2">{status_counts.done}</p>
        </Card>
      </div>
    </DashboardLayout>
  );
}
