import { api } from "./axios";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type TaskStatus =
  | "TODO"
  | "IN_PROGRESS"
  | "REVIEW"
  | "COMPLETED";

export type CreateTaskPayload = {
  title: string;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  assignedToId: string;
};

export type UpdateTaskPayload = {
  title?: string;
  description?: string;
  dueDate?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  assignedToId?: string;
};

export const getTasks = async (params?: {
  status?: TaskStatus;
  priority?: TaskPriority;
  sort?: "dueDate" | "createdAt";
  order?: "asc" | "desc";
}) => {
  const res = await api.get("/tasks", { params });
  return res.data.tasks;
};

export const getTaskById = async (taskId: string) => {
  const res = await api.get(`/tasks/${taskId}`);
  return res.data.task;
};

export const getDashboard = async () => {
  const res = await api.get("/tasks/dashboard");
  return res.data;
};

export const createTask = async (data: CreateTaskPayload) => {
  const res = await api.post("/tasks", data);
  return res.data.task;
};

export const updateTask = async (
  taskId: string,
  data: UpdateTaskPayload
) => {
  const res = await api.patch(`/tasks/${taskId}`, data);
  return res.data.task;
};

export const updateTaskStatus = async (
  taskId: string,
  status: TaskStatus
) => {
  const res = await api.patch(`/tasks/${taskId}`, { status });
  return res.data.task;
};

export const deleteTask = async (taskId: string) => {
  const res = await api.delete(`/tasks/${taskId}`);
  return res.data;
};
