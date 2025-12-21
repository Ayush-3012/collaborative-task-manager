import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiEdit, FiTrash2, FiCalendar, FiFlag } from "react-icons/fi";
import type { Task } from "../types/task.type";
import TaskStatusSelect from "./TaskStatusSelect";
import { deleteTask } from "../api/task.api";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../hooks/useAuth";

const priorityStyles: Record<string, string> = {
  LOW: "bg-slate-100 text-slate-600",
  MEDIUM: "bg-blue-100 text-blue-600",
  HIGH: "bg-orange-100 text-orange-600",
  URGENT: "bg-red-100 text-red-600",
};

const TaskList = ({ tasks }: { tasks: Task[] }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const handleDelete = async (taskId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );
    if (!confirmed) return;

    await deleteTask(taskId);
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard"] });
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500 bg-white border border-slate-200 rounded-lg">
        No tasks found. Try adjusting filters.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <motion.div
          key={task.id}
          whileHover={{ y: -2 }}
          className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-sm hover:shadow-md transition"
        >
          {/* Top row */}
          <div className="flex justify-between items-start gap-4 max-md:flex-col">
            <div className="min-w-0">
              <h2 className="font-medium text-slate-900 truncate">
                {task.title}
              </h2>
              <p className="text-sm text-slate-600 mt-1 line-clamp-2">
                {task.description}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0 max-md:w-full max-md:justify-between">
              <TaskStatusSelect taskId={task.id} currentStatus={task.status} />

              <div className="flex justify-center items-center">
                {user?.id === task.creatorId && (
                  <>
                    <button
                      onClick={() => navigate(`/tasks/${task.id}/edit`)}
                      className="p-2 text-slate-500 cursor-pointer hover:text-indigo-600 hover:bg-indigo-50 rounded transition"
                    >
                      <FiEdit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="p-2 text-slate-500 cursor-pointer hover:text-red-600 hover:bg-red-50 rounded transition"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Bottom row */}
          <div className="flex flex-wrap items-center justify-between gap-3 mt-4 text-sm">
            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  priorityStyles[task.priority]
                }`}
              >
                <FiFlag size={12} />
                {task.priority}
              </span>
            </div>

            <span className="inline-flex items-center gap-1 text-slate-500">
              <FiCalendar size={14} />
              Due {new Date(task.dueDate).toLocaleDateString()}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default TaskList;
