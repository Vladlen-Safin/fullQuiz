import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const authRouter = express.Router();
const jwtSecret = "my_jwt_secret_keyy"; 
const jwtRefreshSecret = "my_refresh_secret_key"; // отдельный секрет для refresh token

// Регистрация
authRouter.post("/register", async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        // Валидация входных данных
        if (!fullName || !email || !password) {
            return res.status(400).json({status: 'warning', message: "Полное имя, email и пароль обязательны"});
        }
        // Проверка на существование пользователя с таким email
        const existingUser = await User.findOne({ email }); 
        if (existingUser) {
            return res.status(400).json({status: 'warning', message: "Пользователь с таким email уже существует"});
        } 

        // Хеширование пароля
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Создание нового пользователя
        const newUser = new User({ fullName, email, password: hashedPassword });
        await newUser.save();

        // Генерация Access token (1 день)
        const accessToken = jwt.sign(
            { userId: newUser._id, role: newUser.role }, 
            jwtSecret, 
            { expiresIn: '1d' } 
        );

        // Генерация Refresh token (7 дней)
        const refreshToken = jwt.sign(
            { userId: newUser._id }, 
            jwtRefreshSecret, 
            { expiresIn: '7d' }
        );

        // Можно отправить refreshToken в httpOnly cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", 
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 дней
        });

        return res.status(200).json({
            status: 'success',
            accessToken,
            user: {
                id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        console.error("Ошибка при регистрации: ", error);
        return res.status(500).json({status: 'error', error: "Ошибка при регистрации", message: error});
    }
});

// Обновление токена
authRouter.post("/refresh", async (req, res) => {
    try {
        const token = req.cookies.refreshToken;
        if (!token) return res.status(401).json({status: 'error', message: "Нет refresh token"});

        jwt.verify(token, jwtRefreshSecret, (err, decoded) => {
            if (err) return res.status(403).json({status: 'error', message: "Неверный refresh token"});

            // Генерация нового Access token
            const newAccessToken = jwt.sign(
                { userId: decoded.userId }, 
                jwtSecret, 
                { expiresIn: '1d' }
            );

            res.json({ accessToken: newAccessToken });
        });
    } catch (error) {
        console.error("Ошибка при обновлении токена:", error);
        res.status(500).json({status: 'error', message: error.message});
    }
});

// Авторизация 
authRouter.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        // Валидация входных данных
        if (!email || !password) {
            return res.status(400).json({status: 'warning', message: "Email и пароль обязательны"});
        }
        // Поиск пользователя по email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({status: 'warning', message: "Неверный email или пароль"});
        }
        // Проверка пароля
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({status: 'warning', message: "Неверный email или пароль"});
        }
        // Генерация Access token (1 день)
        const accessToken = jwt.sign(
            { userId: user._id, role: user.role }, 
            jwtSecret, 
            { expiresIn: '1d' } 
        );
        // Генерация Refresh token (7 дней)
        const refreshToken = jwt.sign(
            { userId: user._id },
            jwtRefreshSecret, 
            { expiresIn: '7d' }
        );
        // Можно отправить refreshToken в httpOnly cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 дней
        });
        return res.status(200).json({
            status: 'success',
            accessToken,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Ошибка при авторизации: ", error);
        return res.status(500).json({status: 'error', error: "Ошибка при авторизации", message: error});
    }
});

// Выход (разлогин)
authRouter.post("/logout", (req, res) => {
  try {
    if (!req.cookies.refreshToken) {
      return res.status(200).json({ status: 'success', message: "Вы уже вышли" });
    }

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    });

    return res.status(200).json({ status: 'success', message: "Успешный выход" });

  } catch (error) {
    console.error("Ошибка при выходе: ", error);
    return res.status(500).json({ status: 'error', error: "Ошибка при выходе", message: error });
  }
});


export default authRouter;
