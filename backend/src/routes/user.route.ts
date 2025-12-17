import { Router } from "express";
import { getUsers } from "../controllers/user.controller.js";
import { verifyAuthToken } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.route("/").get(verifyAuthToken, getUsers);

export default userRouter;
