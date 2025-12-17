import { api } from "./axios";

export const getTasks = async (params?: {
  status?: string;
  priority?: string;
  sort?: string;
  order?: string;
}) => {
  const res = await api.get("/tasks", { params });
  return res.data.tasks;
};

export const createTask = async (data: {
  title: string;
  description: string;
  dueDate: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  assignedToId: string;
}) => {
  const res = await api.post("/tasks", data);
  return res.data;
};

export const updateTaskStatus = async (taskId: string, status: string) => {
  const res = await api.patch(`/tasks/${taskId}`, { status });
  return res.data;
};

export const getDashboard = async () => {
  const res = await api.get("/tasks/dashboard");
  return res.data;
};
