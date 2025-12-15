import dotenv from "dotenv";
dotenv.config();
import http from "http";
import { Server } from "socket.io";
import app from "./app.js";

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

export const io = new Server(server, {
  cors: { origin: true, credentials: true },
});

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
