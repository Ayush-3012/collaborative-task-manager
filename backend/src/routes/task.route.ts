import { Router } from "express";
import { verifyAuthToken } from "../middlewares/auth.middleware.js";
import {
  createTask,
  getDashboardData,
  getOverdueTasks,
  getTasks,
  updateTask,
} from "../controllers/task.controller.js";

const taskRouter = Router();

taskRouter.route("/").post(verifyAuthToken, createTask);
taskRouter.route("/").get(verifyAuthToken, getTasks);
taskRouter.route("/overdue").get(verifyAuthToken, getOverdueTasks);
taskRouter.route("/dashboard").get(verifyAuthToken, getDashboardData);
taskRouter.route("/:id").patch(verifyAuthToken, updateTask);

export default taskRouter;
