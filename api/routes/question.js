import express from "express";
import Question from "../models/Question.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const questionRouter = express.Router();

// Добавить вопрос
questionRouter.post("/create", authMiddleware, roleMiddleware(["teacher", "admin"]), async (req, res) => {
  try {
    const { text, type, options, gameGroupId } = req.body;
    if (!text || !type || !options || !gameGroupId) {
      return res.status(400).json({status: 'warning', message: "Текст, ответы и тип вопроса обязательны"});
    }
    const newQuestion = new Question({ text, type, options, gameGroupId });
    await newQuestion.save();
    return res.status(200).json(newQuestion);
  } catch (error) {
    console.error("Ошибка при добавлении вопроса: ", error);
    return res.status(500).json({status: 'error', error: "Ошибка при добавлении вопроса", message: error});
  }
});

// Добавить множество вопросов
questionRouter.post(
  "/createMany",
  authMiddleware,
  roleMiddleware(["teacher", "admin"]),
  async (req, res) => {
    try {
      const { rawText, gameGroupId } = req.body;

      if (!rawText || !gameGroupId) {
        return res.status(400).json({
          status: "warning",
          message: "Текст вопросов и gameGroupId обязательны",
        });
      }

      // 1. Разделяем блоки вопросов по пустым строкам
      const blocks = rawText
        .split(/\n\s*\n/) // разделяем по одной или нескольким пустым строкам
        .map((b) => b.trim())
        .filter((b) => b.length > 0);

      const createdQuestions = [];

      for (const block of blocks) {
        const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);

        if (lines.length < 2) {
          continue; // недостаточно данных
        }

        // Первая строка — текст вопроса
        const text = lines[0];

        // Остальные строки — варианты
        const options = lines.slice(1);

        // Ищем правильный ответ (строка со *)
        const correct = options.find((opt) => opt.startsWith("*"));

        if (!correct) {
          return res.status(400).json({
            status: "warning",
            message: `У вопроса "${text}" нет ответа, помеченного *`,
          });
        }

        const question = new Question({
          text,
          type: "single",
          options,          // сохраняем, модель сама очистит *
          gameGroupId,
        });

        await question.save();
        createdQuestions.push(question);
      }

      return res.status(200).json({
        status: "success",
        created: createdQuestions.length,
        questions: createdQuestions,
      });

    } catch (error) {
      console.error("Ошибка при добавлении вопросов: ", error);
      return res.status(500).json({
        status: "error",
        error: "Ошибка при добавлении вопросов",
        message: error,
      });
    }
  }
);


// Изменить вопрос
questionRouter.put("/:id", authMiddleware, roleMiddleware(["teacher", "admin"]), async (req, res) => {
  try {
    const { text, type, options, gameGroupId } = req.body;
    if (!text || !type || !options || !gameGroupId) {
      return res.status(400).json({status: 'warning', message: "Текст, ответы и тип вопроса обязательны"});
    }
    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      { text, type, options, gameGroupId },
      { new: true, runValidators: true }
    );
    if (!updatedQuestion) {
      return res.status(404).json({status: 'warning', message: "Вопрос не найден"});
    }
    return res.status(200).json(updatedQuestion);
  } catch (error) {
    console.error("Ошибка при изменении вопроса: ", error);
    return res.status(500).json({status: 'error', error: "Ошибка при изменении вопроса", message: error});
  }
});

// Удалить вопрос
questionRouter.delete("/:id", authMiddleware, roleMiddleware(["teacher", "admin"]), async (req, res) => {
  try {
    const deletedQuestion = await Question.findByIdAndDelete(req.params.id);
    if (!deletedQuestion) {
      return res.status(404).json({status: 'warning', message: "Вопрос не найден"});
    }
    return res.status(200).json({status: 'success', message: "Вопрос успешно удалён"});
  } catch (error) {
    console.error("Ошибка при удалении вопроса: ", error);
    return res.status(500).json({status: 'error', error: "Ошибка при удалении вопроса", message: error});
  }
});

// Получить все вопросы
questionRouter.get("/all", authMiddleware, roleMiddleware(["teacher", "admin"]), async (req, res) => {
  try {
    const allQuestions = await Question.find();
    return res.status(200).json(allQuestions);
  } catch (error) {
    console.error("Ошибка при получении всех вопросов: ", error);
    return res.status(500).json({status: 'error', error: "Ошибка при получении всех вопросов", message: error});
  }
});

// Получить вопрос по ID
questionRouter.get("/:id", authMiddleware, roleMiddleware(["teacher", "admin"]), async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({status: 'warning', message: "Вопрос не найден"});
    }
    return res.status(200).json(question);
  } catch (error) {
    console.error("Ошибка при получении вопроса по ID: ", error);
    return res.status(500).json({status: 'error', error: "Ошибка при получении вопроса по ID", message: error});
  }
});


export default questionRouter;
