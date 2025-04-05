import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js"; // Import auth router
import "./services/DeletetingOtps.js";
import postRouter from "./routes/posts.route.js";
import jobRouter from "./routes/job.route.js";
import eventRouter from "./routes/event.route.js";
import messageRouter from "./routes/message.route.js";

import http from "http";
import { Server } from "socket.io";

const app = express();

const server = http.createServer(app);

const allowedOrigin = process.env.CLIENT_URL;
app.use(
  cors({
    origin: allowedOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

const io = new Server(server, {
  cors: {
    origin: allowedOrigin,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("joinChat", (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  socket.on("sendMessage", (messageData) => {
    io.to(messageData.receiver).emit("receiveMessage", messageData);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

// server.listen(5000, () => {
//   console.log("Server running on port 5000");
// });

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/jobs", jobRouter);
app.use("/api/events", eventRouter);
app.use("/api/messages", messageRouter);

export default app;
