import dotenv from "dotenv";
dotenv.config();
import http from "http";
import app from "./app.js";
import { setupSocket } from "./socket.js";

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

export const io = setupSocket(server);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
