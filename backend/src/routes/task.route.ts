import { Router } from "express";
import { verifyAuthToken } from "../middlewares/auth.middleware.js";
import {
  createTask,
  deleteTask,
  getDashboardData,
  getOverdueTasks,
  getTaskById,
  getTasks,
  updateTask,
} from "../controllers/task.controller.js";

const taskRouter = Router();

taskRouter.route("/dashboard").get(verifyAuthToken, getDashboardData);
taskRouter.route("/overdue").get(verifyAuthToken, getOverdueTasks);

taskRouter.route("/").get(verifyAuthToken, getTasks);
taskRouter.route("/").post(verifyAuthToken, createTask);

taskRouter.route("/:id").get(verifyAuthToken, getTaskById);
taskRouter.route("/:id").patch(verifyAuthToken, updateTask);
taskRouter.route("/:id").delete(verifyAuthToken, deleteTask);

export default taskRouter;
