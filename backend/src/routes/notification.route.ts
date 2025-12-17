import { Router } from "express";
import { verifyAuthToken } from "../middlewares/auth.middleware.js";
import {
  getNotifications,
  markNotificationAsRead,
} from "../controllers/notification.controller.js";

const notificationRouter = Router();

notificationRouter.route("/").get(verifyAuthToken, getNotifications);
notificationRouter
  .route("/:id/read")
  .patch(verifyAuthToken, markNotificationAsRead);

export default notificationRouter;
