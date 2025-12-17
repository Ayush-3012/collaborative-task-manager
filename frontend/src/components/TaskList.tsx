import type { Task } from "../types/task.type";
import TaskStatusSelect from "./TaskStatusSelect";

const priorityColor: Record<string, string> = {
  LOW: "text-gray-500",
  MEDIUM: "text-blue-500",
  HIGH: "text-orange-500",
  URGENT: "text-red-600",
};

const TaskList = ({ tasks }: { tasks: Task[] }) => {
  if (tasks.length === 0) {
    return <p className="text-gray-500">No tasks found</p>;
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div key={task.id} className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex justify-between items-center">
            <h2 className="font-medium">{task.title}</h2>

            {/* <span
              className={`text-xs px-2 py-1 rounded ${
                statusColor[task.status]
              }`}
            >
              {task.status}
            </span> */}
            <TaskStatusSelect taskId={task.id} currentStatus={task.status} />
          </div>

          <p className="text-sm text-gray-600 mt-1">{task.description}</p>

          <div className="flex justify-between items-center mt-3 text-sm">
            <span className={priorityColor[task.priority]}>
              Priority: {task.priority}
            </span>

            <span className="text-gray-500">
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
