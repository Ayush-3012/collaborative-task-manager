import * as taskApi from "../api/task.api";

export const useTaskActions = () => {
  const createTask = async (data: taskApi.CreateTaskPayload) => await taskApi.createTask(data);

  const updateStatus = async (taskId: string, status: taskApi.TaskStatus) =>
    await taskApi.updateTaskStatus(taskId, status);

  const deleteTask = (id: string) => taskApi.deleteTask(id);

  return {
    createTask,
    updateStatus,
    deleteTask,
  };
};
