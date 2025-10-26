import express from "express";
import GroupGameModel from "../models/GroupGame.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Создать новый вид игры
router.post("/", authMiddleware, roleMiddleware(["teacher", "admin"]), async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name || !description) {
            return res.status(400).json({status: "warning", message: "Переданные не корректные параметры"})
        }
        const newGroupGame = new GroupGameModel({name, description});
        await newGroupGame.save();
        return res.status(200).json({status: "success", message: "Вид игры успешно создан", groupGame: newGroupGame});
    } catch (error) {
        console.log("Возникла ошибка при добавлении вида игры");
        return res.status(500).json({status: "error", message: "Возникла ошибка при добавлении вида игры"})
    }
});

// Изменить вид игры по id
router.put("/:id", authMiddleware, roleMiddleware(["teacher", "admin"]), async (req, res) => {
    try {
        const { name, description} = req.body;
        if (!name || !description) {
            return res.status(400).json({status: "warning", message: "Переданные не корректные параметры"})
        }
        const updateGroupGame = await GroupGameModel.findByIdAndUpdate(
            req.params.id,
            { name, description},
            { new: true, runValidators: true}
        );
        if (!updateGroupGame) {
            return res.status(404).json({status: "warning", message: "Вид не найден"});
        }
        return res.status(200).json({status: "success", message: "Вид успешно обновлен"});
    } catch (error) {
        console.log("Ошибка при изменении вида игры");
        return res.status(500).json({status: "error", message: "Ошибка при изменении вида игры"})
    }
});

// Удалить вид игры
router.delete("/:id", authMiddleware, roleMiddleware(["teacher", "admin"]), async (req, res) => {
    try {
        const delGroupGame = await GroupGameModel.findByIdAndDelete(req.params.id);
        if (!delGroupGame) {
            return res.status(404).json({status: "warning", message: "Вид не найден"});
        }
    } catch (error) {
        console.log("Ошибка при удалении вида игры");
        return res.status(500).json({status: "error", message: "Ошибка при удалении вида игры"});
    }
});

// Получить все виды 
router.get("/", authMiddleware, roleMiddleware(["teacher", "admin"]), async (req, res) => {
    try {
        const allGroupGame = await GroupGameModel.find();
        if(!allGroupGame) {
            return res.status(404).json({status: "warning", message: "Виды не найдены "});
        }
        return res.status(200).json(allGroupGame);
    } catch (error) {
        console.log("Ошибка при получении всех видов игр");
        return res.status(500).json({status: "error", message: "Ошибка при получении всех видов игр"})
    } 
});

// Получить вид игры по id
router.get("/:id", authMiddleware, roleMiddleware(["teacher", "admin"]), async (req, res) => {
    try {
        const groupGame = await GroupGameModel.findById(req.params.id);
        if(!groupGame) {
            return res.status(404).json({status: "warning", message: "Вид игры не найден!"});
        }
        return res.status(200).json(groupGame);
    } catch (error) {
        console.log("Ошибка при получении определенного вида игры", error);
        return res.status(500).json("Ошибка при получении определенного вида игры");
    }
})

export default router;