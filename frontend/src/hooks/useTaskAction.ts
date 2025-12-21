import * as taskApi from "../api/task.api";
import { useSnackbar } from "notistack";

export const useTaskActions = () => {
  const { enqueueSnackbar } = useSnackbar();

  const createTask = async (data: taskApi.CreateTaskPayload) => {
    try {
      const res = await taskApi.createTask(data);
      enqueueSnackbar("Task created successfully", { variant: "success" });
      return res;
    } catch (err) {
      enqueueSnackbar("Failed to create task", { variant: "error" });
      throw err;
    }
  };

  const updateStatus = async (taskId: string, status: taskApi.TaskStatus) => {
    try {
      const res = await taskApi.updateTaskStatus(taskId, status);
      enqueueSnackbar("Task status updated", { variant: "info" });
      return res;
    } catch (err) {
      enqueueSnackbar("Failed to update task", { variant: "error" });
      throw err;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await taskApi.deleteTask(id);
      enqueueSnackbar("Task deleted", { variant: "warning" });
    } catch (err) {
      enqueueSnackbar("Failed to delete task", { variant: "error" });
      throw err;
    }
  };

  return {
    createTask,
    updateStatus,
    deleteTask,
  };
};
