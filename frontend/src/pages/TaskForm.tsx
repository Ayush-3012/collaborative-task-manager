import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTaskSchema } from "./createTask.schema";
import type { CreateTaskInput } from "./createTask.schema";
import { createTask, getTaskById, updateTask } from "../api/task.api";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUsers } from "../api/user.api";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  FiEdit3,
  FiPlusCircle,
  FiFlag,
  FiCalendar,
  FiUser,
  FiFileText,
} from "react-icons/fi";

const TaskForm = () => {
  const navigate = useNavigate();
  const { id: taskId } = useParams();
  const isEditMode = !!taskId;

  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
  });

  /* 👤 users */
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  /* 📥 load task in edit mode */
  const { data: task } = useQuery({
    queryKey: ["task", taskId],
    queryFn: () => getTaskById(taskId!),
    enabled: isEditMode,
  });

  useEffect(() => {
    if (task) {
      reset({
        title: task.title,
        description: task.description,
        dueDate: task.dueDate.slice(0, 16),
        priority: task.priority,
        assignedToId: task.assignedToId,
      });
    }
  }, [task, reset]);

  /* 🚀 submit */
  const onSubmit = async (data: CreateTaskInput) => {
    try {
      setError("");

      const payload = {
        ...data,
        dueDate: new Date(data.dueDate).toISOString(),
      };

      if (isEditMode) {
        await updateTask(taskId!, payload);
      } else {
        await createTask(payload);
      }

      navigate("/dashboard");
    } catch {
      setError(isEditMode ? "Failed to update task" : "Failed to create task");
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50 px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-xl mx-auto bg-white border border-slate-200 rounded-xl shadow-lg p-6 sm:p-8"
      >
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-lg bg-indigo-50 text-indigo-600">
            {isEditMode ? <FiEdit3 /> : <FiPlusCircle />}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-800">
              {isEditMode ? "Edit Task" : "Create New Task"}
            </h2>
            <p className="text-sm text-slate-500">
              {isEditMode
                ? "Update task details"
                : "Fill in details to create a task"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Title
            </label>
            <div className="relative">
              <FiFileText className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                {...register("title")}
                placeholder="Task title"
                className="w-full border border-slate-300 rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Description
            </label>
            <textarea
              {...register("description")}
              placeholder="Describe the task..."
              rows={4}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Due Date
            </label>
            <div className="relative">
              <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="datetime-local"
                {...register("dueDate")}
                className="w-full border border-slate-300 rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Priority
            </label>
            <div className="relative">
              <FiFlag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                {...register("priority")}
                className="w-full border border-slate-300 rounded-lg pl-10 pr-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select priority</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
          </div>

          {/* Assign User */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Assign To
            </label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <select
                {...register("assignedToId")}
                className="w-full border border-slate-300 rounded-lg pl-10 pr-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select user</option>
                {usersLoading ? (
                  <option disabled>Loading users...</option>
                ) : (
                  users.map((user: any) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-red-600 text-sm bg-red-50 px-3 py-2 rounded">
              {error}
            </p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center gap-2 bg-indigo-600 text-white py-2.5 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 transition"
          >
            {isSubmitting
              ? isEditMode
                ? "Updating..."
                : "Creating..."
              : isEditMode
              ? "Update Task"
              : "Create Task"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default TaskForm;
