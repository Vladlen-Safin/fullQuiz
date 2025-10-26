import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import questionRouter from "./routes/question.js";
import http from "http";
import { Server } from "socket.io";
import { initSocket } from "./socket/socketHandler.js";
import answerRouter from "./routes/answer.js";
import authRouter from "./routes/auth.js";

dotenv.config();
const app = express();
app.use(cors({ origin: "*" })); // 👈 Разрешаем все источники
app.use(express.json());
app.use("/api/question", questionRouter);
app.use("/api/answer", answerRouter);
app.use("/api/auth", authRouter);

let db = 'mongodb+srv://vadlensafin:V130302Safin@quizcluster.tb0k5it.mongodb.net/'

mongoose
    .connect(process.env.MONGO_URI || db)
    .then((res) => {console.log('Connected to DB')})
    .catch((err) => {console.log(err)});

const server = http.createServer(app);

// создаем socket.io сервер
const io = new Server(server, {
  cors: {
    origin: "*", // в продакшне лучше явно указать frontend URL
    methods: ["GET", "POST"],
  },
});

// подключаем логику работы с сокетами из отдельного файла
initSocket(io);

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '192.168.0.102';
server.listen(PORT, HOST, () => {
  console.log(`Сервер запущен: http://${HOST}:${PORT}`);
});
