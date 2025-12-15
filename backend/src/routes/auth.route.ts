import { Router } from "express";
import { register } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.route("/register").post(register);
authRouter.route("/login").post();
authRouter.route("/logout").post();

export default authRouter;
