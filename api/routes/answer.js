import express from "express";
import Answer from "../models/Answer.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const answerRouter = express.Router();

// Сохранить ответы ученика
answerRouter.post("/answers", authMiddleware, async (req, res) => {
  try {
    const { studentName, studentClass, answers } = req.body;
    if (!studentName || !studentClass || !answers) {
      return res.status(400).json({status: 'warning', message: "Имя ученика, класс и ответы обязательны"});
    }
    const newAnswer = new Answer({ studentName, studentClass, answers });
    await newAnswer.save();
    return res.status(200).json({status: 'success', message: "Ответы успешно сохранены"});
  } catch (error) {
    console.error("Ошибка при сохранении ответов: ", error);
    return res.status(500).json({status: 'error', error: "Ошибка при сохранении ответов", message: error});
  }
});

// Получить все ответы
answerRouter.get("/answers", authMiddleware, roleMiddleware(["teacher", "admin"]), async (req, res) => {
    try {
        const allAnswers = await Answer.find().populate('answers.questionId');
        if (!allAnswers) {
            return res.status(404).json({status: 'warning', message: "Ответы не найдены"});
        }
        return res.status(200).json(allAnswers);
    } catch (error) {
        console.error("Ошибка при получении ответов: ", error);
        return res.status(500).json({status: 'error', error: "Ошибка при получении ответов", message: error});
    }
});

// Получить ответы по id студента
answerRouter.get("/answers/student/:id", async (req, res) => {
  try {
    const answers = await Answer.find({ studentId: req.params.id })
      .populate('studentId', 'fullName email class')
      .populate('answers.questionId', 'text');

    if (!answers || answers.length === 0) {
      return res.status(404).json({ status: 'warning', message: "Ответы студента не найдены" });
    }

    return res.status(200).json({ status: 'success', answers });
  } catch (error) {
    console.error("Ошибка при получении ответов: ", error);
    return res.status(500).json({
      status: 'error',
      error: "Ошибка при получении ответов",
      message: error.message
    });
  }
});


export default answerRouter;