import { updateTaskStatus } from "../api/task.api";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

type Props = {
  taskId: string;
  currentStatus: string;
};

const statusColor: Record<string, string> = {
  TODO: "bg-gray-200",
  IN_PROGRESS: "bg-blue-200",
  REVIEW: "bg-yellow-200",
  COMPLETED: "bg-green-200",
};

const statuses = ["TODO", "IN_PROGRESS", "REVIEW", "COMPLETED"];

const TaskStatusSelect = ({ taskId, currentStatus }: Props) => {
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const handleChange = async (newStatus: string) => {
    if (newStatus === currentStatus) return;

    try {
      setLoading(true);
      await updateTaskStatus(taskId, newStatus);
      // refresh tasks list
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <select
      value={currentStatus}
      disabled={loading}
      onChange={(e) => handleChange(e.target.value)}
      className="border rounded px-2 py-1 text-sm"
    >
      {statuses.map((status) => (
        <option
          key={status}
          value={status}
          className={`${statusColor[status]}`}
        >
          {status}
        </option>
      ))}
    </select>
  );
};

export default TaskStatusSelect;
