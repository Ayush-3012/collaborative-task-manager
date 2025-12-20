import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const connectSocket = () => {
  if (!socket) {
    const token = localStorage.getItem("token");

    socket = io(import.meta.env.VITE_API_URL.replace("/api", ""), {
      auth: {
        token,
      },
      withCredentials: true,
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
