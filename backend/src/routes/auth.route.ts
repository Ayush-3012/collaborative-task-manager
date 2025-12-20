import { Router } from "express";
import {
  login,
  logout,
  myProfile,
  register,
  updateProfile,
} from "../controllers/auth.controller.js";
import { verifyAuthToken } from "../middlewares/auth.middleware.js";

const authRouter = Router();

authRouter.route("/register").post(register);
authRouter.route("/login").post(login);
authRouter.route("/me").get(verifyAuthToken, myProfile);
authRouter.route("/update").put(verifyAuthToken, updateProfile);
authRouter.route("/logout").post(logout);

export default authRouter;
