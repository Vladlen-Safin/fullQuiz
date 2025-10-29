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
import groupGameRouter from "./routes/gameGroup.js"

dotenv.config();
const app = express();
app.use(cors({ origin: "*" })); // 👈 Разрешаем все источники
app.use(express.json());
app.use("/api/question", questionRouter);
app.use("/api/answer", answerRouter);
app.use("/api/auth", authRouter);
app.use("/api/groupgame", groupGameRouter);

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
const HOST = process.env.HOST || '192.168.9.4';
server.listen(PORT, HOST, () => {
  console.log(`Сервер запущен: http://${HOST}:${PORT}`);
});


/** TODO */
// 0. НЕ ПОКАЗЫВАТЬ ИТОГОВУЮ ТАБЛИЦУ РЕЗУЛЬТАТОВ - показать результат у каждого студента 
// 1. Номера вопросово
// 2. Закрыть выбранный ответ (рандомное расположение кнопок у каждого студента)
// 3. Изменить ответ
// 4. После того как все ответили, через 10 (5) сек отобразить ответ, через 20 (10) сек переключить на следующийъ
// 5. Мат формулы

// По ДОКУМЕНТУ Камиллы
// Добавить вид квиза (quizType) - 1, 2, 3, 4 четверть, итоговая кр - изменить все вопросы
// Мне нужно изменить вопросы, сделать их предменто зависимыми, так же признак пользователя, предмет (ссылка на таблицу )
// Добавить класс, при регистрации учеников указать класс (пользователи)

// САМОЕ СЛОЖНОЕ
// Изменить концепцию игры, Выбор класса (10, 11), название игры, описание игры, 
// Шаблоны игр, templateGames (название, описание, банк вопросов (ссылка на базу вопросов))
// История прохождения игр

// Позже - круговые диаграммы по классам 


// Повтор вопросв (8) - PIKLM8

// Ошибка инета - Рустам-Вали Хамидий Мухаммадами