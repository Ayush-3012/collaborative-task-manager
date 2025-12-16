import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(cors());
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser(process.env.COOKIE_SECRET));

import authRouter from "./routes/auth.route.js";
import taskRouter from "./routes/task.route.js";

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/tasks", taskRouter);

export default app;
