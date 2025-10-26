import express from "express";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const userRouter = express.Router();

// Получить всех пользователей
userRouter.get("/all", authMiddleware, roleMiddleware(["teacher", "admin"]), async (req, res) => {
    try {
        const allUsers = await User.find();
        if(allUsers.length === 0) {
            return res.status(404).json({status: 'warning', message: "Пользователи не найдены"});
        }
        return res.status(200).json(allUsers);
    } catch (error) {
        console.error("Ошибка при получении всех пользователей: ", error);
        return res.status(500).json({status: 'error', error: "Ошибка при получении всех пользователей", message: error});
    }
});

// Получить пользователя по ID
userRouter.get("/:id", authMiddleware, roleMiddleware(["teacher", "admin"]), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({status: 'warning', message: "Пользователь не найден"});
        }
        return res.status(200).json(user);
    } catch (error) {
        console.error("Ошибка при получении пользователя по ID: ", error);
        return res.status(500).json({status: 'error', error: "Ошибка при получении пользователя по ID", message: error});
    }
});

// Получить пользователей по группе (классу)
userRouter.get("/class/:classId", authMiddleware, roleMiddleware(["teacher", "admin"]), async (req, res) => {
    try {
        const usersInClass = await User.find({ class: req.params.classId });
        if (usersInClass.length === 0) {
            return res.status(404).json({status: 'warning', message: "Пользователи в данном классе не найдены"});
        }
        return res.status(200).json(usersInClass);
    } catch (error) {
        console.error("Ошибка при получении пользователей по классу: ", error);
        return res.status(500).json({status: 'error', error: "Ошибка при получении пользователей по классу", message: error});
    }
});

// Обновить пользователя по ID
userRouter.put("/:id", authMiddleware, roleMiddleware(["admin"]), async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({status: 'warning', message: "Пользователь не найден"});
        }
        return res.status(200).json({status: 'success', message: "Пользователь успешно обновлен", user: updatedUser});
    } catch (error) {
        console.error("Ошибка при обновлении пользователя: ", error);
        return res.status(500).json({status: 'error', error: "Ошибка при обновлении пользователя", message: error});
    }
});

// Удалить пользователя по ID
userRouter.delete("/:id", authMiddleware, roleMiddleware(["admin"]), async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({status: 'warning', message: "Пользователь не найден"});
        }
        return res.status(200).json({status: 'success', message: "Пользователь успешно удален"});
    } catch (error) {
        console.error("Ошибка при удалении пользователя: ", error);
        return res.status(500).json({status: 'error', error: "Ошибка при удалении пользователя", message: error});
    }
});

export default userRouter;