import mongoose from "mongoose";

/**
 * Модель класса (группы студентов).
 * Поля:
 * - name        → название класса (обязательное)
 * - description → описание класса (необязательное)
 * - createdAt   → дата создания (автоматически устанавливается при создании)
 */
const classSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Class", classSchema);
