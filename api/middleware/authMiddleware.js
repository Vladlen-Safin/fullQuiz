import jwt from "jsonwebtoken";

const jwtSecret = "my_jwt_secret_keyy";

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ status: "error", message: "Нет токена авторизации" });
    }

    // Формат заголовка: "Bearer <token>"
    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ status: "error", message: "Токен не найден" });
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded; // добавляем данные пользователя в объект запроса
        next();
    } catch (err) {
        return res.status(403).json({ status: "error", message: "Токен недействителен" });
    }
};
