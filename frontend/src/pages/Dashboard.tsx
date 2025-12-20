import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FiClipboard, FiUserCheck, FiAlertTriangle } from "react-icons/fi";
import { getDashboard } from "../api/task.api";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import TaskList from "../components/TaskList";
import TaskFilters from "../components/TaskFilters";

const DashboardOverview = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    sort: "",
  });

  // 🔐 auth guard
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  const {
    data,
    isLoading: dashboardLoading,
    error,
  } = useQuery({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
    enabled: isAuthenticated,
  });

  if (dashboardLoading)
    return (
      <div className="p-10 text-center text-slate-500">
        Loading dashboard...
      </div>
    );

  if (error || !data)
    return (
      <div className="p-10 text-center text-red-500">
        Failed to load dashboard
      </div>
    );

  const { assignedToMe, createdByMe, overdue } = data;

  const handleChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = (tasks: any[]) => {
    let result = [...tasks];

    if (filters.status) {
      result = result.filter((t) => t.status === filters.status);
    }

    if (filters.priority) {
      result = result.filter((t) => t.priority === filters.priority);
    }

    if (filters.sort === "dueDate") {
      result.sort(
        (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      );
    }

    return result;
  };

  const filteredAssigned = applyFilters(assignedToMe);
  const filteredCreated = applyFilters(createdByMe);

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-800">
            Dashboard
          </h1>
          <p className="text-slate-500 mt-1">
            Overview of your tasks and progress
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          <StatCard
            title="Assigned to Me"
            count={assignedToMe.length}
            icon={<FiUserCheck />}
            color="indigo"
          />
          <StatCard
            title="Created by Me"
            count={createdByMe.length}
            icon={<FiClipboard />}
            color="emerald"
          />
          <StatCard
            title="Overdue"
            count={overdue.length}
            icon={<FiAlertTriangle />}
            color="red"
          />
        </motion.div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-slate-200 p-4">
          <TaskFilters
            status={filters.status}
            priority={filters.priority}
            sort={filters.sort}
            onChange={handleChange}
          />
        </div>

        {/* Assigned to Me */}
        <section className="space-y-3">
          <h2 className="text-lg font-medium text-slate-800">
            Tasks Assigned to Me
          </h2>
          <TaskList tasks={filteredAssigned} />
        </section>

        {/* Created by Me */}
        <section className="space-y-3">
          <h2 className="text-lg font-medium text-slate-800">
            Tasks Created by Me
          </h2>
          <TaskList tasks={filteredCreated} />
        </section>

        {/* Overdue */}
        <section className="space-y-3">
          <h2 className="text-lg font-medium text-red-600">Overdue Tasks</h2>
          <TaskList tasks={overdue} />
        </section>
      </main>
    </div>
  );
};

export default DashboardOverview;

/* ---------------- helper ---------------- */

const StatCard = ({
  title,
  count,
  icon,
  color,
}: {
  title: string;
  count: number;
  icon: React.ReactNode;
  color: "indigo" | "emerald" | "red";
}) => {
  const colors: any = {
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
    red: "bg-red-50 text-red-600",
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 flex items-center gap-4">
      <div className={`p-3 rounded-lg text-xl ${colors[color]}`}>{icon}</div>
      <div>
        <p className="text-sm text-slate-500">{title}</p>
        <p className="text-2xl font-semibold text-slate-800">{count}</p>
      </div>
    </div>
  );
};
