/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import * as taskApi from "../api/task.api";

export const useTasks = (params?: any) => {
  const [tasks, setTasks] = useState<taskApi.CreateTaskPayload[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await taskApi.getTasks(params);
      setTasks(data);
    } catch {
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [JSON.stringify(params)]);

  return {
    tasks,
    loading,
    error,
    refetch: fetchTasks,
  };
};
