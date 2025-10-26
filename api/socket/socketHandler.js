import Game from "../models/Game.js";
import Question from "../models/Question.js";

let currentQuestion = null;
const activeGames = new Map();

export const initSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("Новый клиент:", socket.id);

    // 🔹 Создание новой игры преподавателем
    socket.on("createGame", async ({ teacherId }) => {
      const gameId = Math.random().toString(36).substring(2, 8).toUpperCase();
      activeGames.set(gameId, {
        teacherId,
        students: [],
        currentQuestion: null,
        answers: [],
        isActive: true
      });

      // создаем запись в базе
      await Game.create({ gameId, teacherId });

      socket.join(gameId);
      socket.emit("gameCreated", { gameId });
      console.log(`Игра ${gameId} создана преподавателем ${teacherId}`);
    });

    // 🔹 Подключение студента
    socket.on("joinGame", async ({ gameId, studentName }) => {
      const game = activeGames.get(gameId);
      if (!game) {
        socket.emit("error", { message: "Игра не найдена" });
        return;
      }

      game.students.push({ name: studentName, correctCount: 0 });
      socket.join(gameId);

      io.to(gameId).emit("studentJoined", { students: game.students });
      console.log(`${studentName} подключился к игре ${gameId}`);

      // Обновляем в базе
      await Game.updateOne(
        { gameId },
        { $addToSet: { students: { name: studentName } } }
      );
    });

    // 🔹 Учитель запускает вопрос
    socket.on("startQuestion", async ({ gameId, questionId }) => {
      const question = await Question.findById(questionId);
      if (!question) return;

      const q = {
        id: question._id,
        text: question.text,
        options: question.options,
        correctAnswers: question.correctAnswers
      };

      const game = activeGames.get(gameId);
      if (game) {
        game.currentQuestion = q;
        game.answers = [];
      }

      io.to(gameId).emit("newQuestion", q);
      console.log(`В игре ${gameId} начался вопрос: ${question.text}`);

      // сохраняем вопрос в историю игры
      await Game.updateOne(
        { gameId },
        { $addToSet: { questions: q } }
      );
    });

    // 🔹 Студент отвечает
    socket.on("studentAnswer", async ({ gameId, studentName, selected }) => {
      const game = activeGames.get(gameId);
      if (!game || !game.currentQuestion) return;

      const { currentQuestion } = game;
      const isCorrect = compareAnswers(selected, currentQuestion.correctAnswers);

      game.answers.push({ studentName, selected, isCorrect });
      if (isCorrect) {
        const student = game.students.find((s) => s.name === studentName);
        if (student) student.correctCount += 1;
      }

      // сохранить ответ в базу
      await Game.updateOne(
        { gameId },
        {
          $push: {
            answers: {
              studentName,
              questionId: currentQuestion.id,
              selected,
              isCorrect
            }
          }
        }
      );

      io.to(gameId).emit("studentAnswered", { studentName });
    });

    // 🔹 Учитель показывает правильный ответ
    socket.on("showAnswer", ({ gameId }) => {
      const game = activeGames.get(gameId);
      if (!game || !game.currentQuestion) return;

      io.to(gameId).emit("showCorrectAnswer", {
        correctAnswers: game.currentQuestion.correctAnswers
      });
    });

    // 🔹 Следующий вопрос
    socket.on("nextQuestion", async ({ gameId, questionId }) => {
      const question = await Question.findById(questionId);
      if (!question) return;

      const q = {
        id: question._id,
        text: question.text,
        options: question.options,
        correctAnswers: question.correctAnswers
      };

      const game = activeGames.get(gameId);
      if (game) {
        game.currentQuestion = q;
        game.answers = [];
      }

      io.to(gameId).emit("newQuestion", q);

      await Game.updateOne(
        { gameId },
        { $addToSet: { questions: q } }
      );
    });

    // 🔹 Завершение игры
    socket.on("endGame", async ({ gameId }) => {
      const game = activeGames.get(gameId);
      if (!game) return;

      await Game.updateOne(
        { gameId },
        {
          $set: {
            finishedAt: new Date(),
            students: game.students
          }
        }
      );

      io.to(gameId).emit("gameEnded", {
        results: game.students
      });

      activeGames.delete(gameId);
      console.log(`Игра ${gameId} завершена`);
    });

    // 🔹 Отключение
    socket.on("disconnect", () => {
      for (const [gameId, game] of activeGames.entries()) {
        const idx = game.students.findIndex((s) => s.id === socket.id);
        if (idx !== -1) {
          const left = game.students.splice(idx, 1)[0];
          io.to(gameId).emit("studentLeft", { student: left });
          console.log(`${left.name} вышел из игры ${gameId}`);
        }
      }
    });
  });
};

// Функция сравнения ответов
function compareAnswers(selected, correct) {
  console.log("Сравниваем ответы:", selected, correct);
  if (!Array.isArray(selected) || !Array.isArray(correct)) return false;
  if (selected.length === 0 || correct.length === 0) return false;

  // Убираем возможные звёздочки и лишние пробелы
  const normalize = (s) => s.replace(/^\*\s*/, '').trim().toLowerCase();

  // Приводим оба массива к нормализованным строкам
  const selectedValue = normalize(selected[0]);
  const normalizedCorrect = correct.map(normalize);

  // Проверяем, есть ли выбранный ответ среди правильных
  return normalizedCorrect.includes(selectedValue);
}

