import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTaskSchema } from "./createTask.schema";
import type { CreateTaskInput } from "./createTask.schema";
import { createTask } from "../api/task.api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { getUsers } from "../api/user.api";
import { useQuery } from "@tanstack/react-query";
import Navbar from "../components/Navbar";

const CreateTask = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateTaskInput>({
    resolver: zodResolver(createTaskSchema),
  });

  const onSubmit = async (data: CreateTaskInput) => {
    try {
      setError("");
      await createTask({
        ...data,
        dueDate: new Date(data.dueDate).toISOString(),
      });

      navigate("/");
    } catch {
      setError("Failed to create task");
    }
  };

  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <Navbar />
      <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Create Task</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            {...register("title")}
            placeholder="Title"
            className="w-full border rounded px-3 py-2"
          />
          {errors.title && (
            <p className="text-red-500 text-sm">{errors.title.message}</p>
          )}

          <textarea
            {...register("description")}
            placeholder="Description"
            className="w-full border rounded px-3 py-2"
          />
          {errors.description && (
            <p className="text-red-500 text-sm">{errors.description.message}</p>
          )}

          <input
            type="datetime-local"
            {...register("dueDate")}
            className="w-full border rounded px-3 py-2"
          />

          <select
            {...register("priority")}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Select priority</option>
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
            <option value="URGENT">URGENT</option>
          </select>

          <select
            {...register("assignedToId")}
            className="w-full border rounded px-3 py-2"
          >
            <option value="">Assign to user</option>

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

          {errors.assignedToId && (
            <p className="text-red-500 text-sm">
              {errors.assignedToId.message}
            </p>
          )}

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:cursor-pointer hover:scale-105 duration-150 transition-all text-white py-2 rounded"
          >
            {isSubmitting ? "Creating..." : "Create Task"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTask;
