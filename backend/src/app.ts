import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
const allowedOrigins = [
  "http://localhost:5173",
  "https://collaborative-task-manager-pi.vercel.app/",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser(process.env.COOKIE_SECRET));

app.get("/", (req, res) => res.json("Welcome to Backend"));

import authRouter from "./routes/auth.route.js";
import taskRouter from "./routes/task.route.js";
import notificationRouter from "./routes/notification.route.js";
import userRouter from "./routes/user.route.js";

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/tasks", taskRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/notifications", notificationRouter);

export default app;
