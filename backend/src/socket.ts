import { Server } from "socket.io";
import type { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";

interface SocketUserPayload {
  userId: string;
}

export const setupSocket = (server: HttpServer) => {
  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "https://collaborative-task-manager-pi.vercel.app/"],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) {
        return next(new Error("Authentication error"));
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as SocketUserPayload;

      socket.data.userId = decoded.userId;
      next();
    } catch (err) {
      next(new Error("Authentication failed"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.data.userId;

    console.log(`🟢 Socket connected: ${userId}`);

    socket.join(userId);

    socket.on("disconnect", () => {
      console.log(`🔴 Socket disconnected: ${userId}`);
    });
  });

  return io;
};
