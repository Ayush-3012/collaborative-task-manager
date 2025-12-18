import { useEffect, useState } from "react";
import TaskFilters from "../components/TaskFilters";
import TaskList from "../components/TaskList";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getTasks } from "../api/task.api";
import { useAuth } from "../hooks/useAuth";
import { connectSocket, disconnectSocket } from "../socket";

const Dashboard = () => {
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    sort: "",
  });

  const { data: tasks, isLoading } = useQuery({
    queryKey: ["tasks", filters],
    queryFn: () =>
      getTasks({
        status: filters.status || undefined,
        priority: filters.priority || undefined,
        sort: filters.sort || undefined,
        order: "asc",
      }),
  });

  const queryClient = useQueryClient();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const socket = connectSocket("dummy-token");

    socket.on("task-updated", () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    });

    socket.on("task-assigned", (notification) => {
      alert(notification.message);
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    });

    return () => {
      disconnectSocket();
    };
  }, [user, queryClient]);

  const handleChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <main className="p-6 max-w-5xl mx-auto">
        <TaskFilters
          status={filters.status}
          priority={filters.priority}
          sort={filters.sort}
          onChange={handleChange}
        />

        {isLoading ? <p>Loading tasks...</p> : <TaskList tasks={tasks ?? []} />}
      </main>
    </div>
  );
};

export default Dashboard;
