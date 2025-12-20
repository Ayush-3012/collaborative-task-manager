import { updateTaskStatus, type TaskStatus } from "../api/task.api";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { FiCheckCircle } from "react-icons/fi";

type Props = {
  taskId: string;
  currentStatus: string;
};

const statusStyles: Record<string, string> = {
  TODO: "bg-slate-100 text-slate-600",
  IN_PROGRESS: "bg-blue-100 text-blue-600",
  REVIEW: "bg-yellow-100 text-yellow-700",
  COMPLETED: "bg-emerald-100 text-emerald-700",
};

const statuses: TaskStatus[] = ["TODO", "IN_PROGRESS", "REVIEW", "COMPLETED"];

const TaskStatusSelect = ({ taskId, currentStatus }: Props) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const handleChange = async (newStatus: string) => {
    if (newStatus === currentStatus) return;

    try {
      setLoading(true);
      await updateTaskStatus(taskId, newStatus as TaskStatus);
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <FiCheckCircle
        size={14}
        className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
      />

      <select
        value={currentStatus}
        disabled={loading}
        onChange={(e) => handleChange(e.target.value)}
        className={`
          appearance-none pl-7 pr-6 py-1.5 text-xs font-medium rounded-full
          border border-slate-300 bg-white
          focus:outline-none focus:ring-2 focus:ring-indigo-500
          hover:border-slate-400 transition
          ${statusStyles[currentStatus]}
          ${loading ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
        `}
      >
        {statuses.map((status) => (
          <option key={status} value={status}>
            {status.replace("_", " ")}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TaskStatusSelect;
