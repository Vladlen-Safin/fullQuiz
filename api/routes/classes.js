import express from "express";
import ClassModel from "../models/Class.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Создать новый класс
router.post("/", authMiddleware, roleMiddleware(["teacher", "admin"]), async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ status: "warning", message: "Название класса обязательно" });
        }
        const newClass = new ClassModel({ name });
        await newClass.save();
        return res.status(200).json({ status: "success", message: "Класс успешно создан", class: newClass });
    } catch (error) {
        console.error("Ошибка при создании класса: ", error);
        return res.status(500).json({ status: "error", error: "Ошибка при создании класса", message: error });
    }
});

// Изменить класс
router.put("/:id", authMiddleware, roleMiddleware(["teacher", "admin"]), async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ status: "warning", message: "Название класса обязательно" });
        }
        const updatedClass = await ClassModel.findByIdAndUpdate(
            req.params.id,
            { name },
            { new: true, runValidators: true }
        );
        if (!updatedClass) {
            return res.status(404).json({ status: "warning", message: "Класс не найден" });
        }
        return res.status(200).json({ status: "success", message: "Класс успешно обновлён", class: updatedClass });
    } catch (error) {
        console.error("Ошибка при изменении класса: ", error);
        return res.status(500).json({ status: "error", error: "Ошибка при изменении класса", message: error });
    }
});

// Удалить класс
router.delete("/:id", authMiddleware, roleMiddleware(["teacher", "admin"]), async (req, res) => {
    try {
        const deletedClass = await ClassModel.findByIdAndDelete(req.params.id);
        if (!deletedClass) {
            return res.status(404).json({ status: "warning", message: "Класс не найден" });
        }
        return res.status(200).json({ status: "success", message: "Класс успешно удалён" });
    } catch (error) {
        console.error("Ошибка при удалении класса: ", error);
        return res.status(500).json({ status: "error", error: "Ошибка при удалении класса", message: error });
    }
});

// Получить все классы
router.get("/", authMiddleware, async (req, res) => {
    try {
        const classes = await ClassModel.find();
        if (!classes) {
            return res.status(404).json({ status: "warning", message: "Классы не найдены" });
        }
        return res.status(200).json(classes);
    } catch (error) {
        console.error("Ошибка при получении классов: ", error);
        return res.status(500).json({ status: "error", error: "Ошибка при получении классов", message: error });
    }
});

// Получить класс по ID
router.get("/:id", authMiddleware, async (req, res) => {
    try {
        const classItem = await ClassModel.findById(req.params.id);
        if (!classItem) {
            return res.status(404).json({ status: "warning", message: "Класс не найден" });
        }
        return res.status(200).json(classItem);
    } catch (error) {
        console.error("Ошибка при получении класса: ", error);
        return res.status(500).json({ status: "error", error: "Ошибка при получении класса", message: error });
    }
});

export default router;
