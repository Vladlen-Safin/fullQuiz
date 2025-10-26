import mongoose from "mongoose";
import bcrypt from "bcryptjs";

/**
 * Модель пользователя.
 * Поля:
 * - fullName → полное имя (обязательное)
 * - email    → электронная почта (обязательное, уникальное)
 * - password → пароль (обязательное)
 * - role     → роль пользователя (student, teacher, admin; по умолчанию student)
 * - class    → ссылка на класс (только для студентов)
 * - createdAt → дата создания (автоматически устанавливается при создании)
 */
const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "teacher", "admin"], default: "student" },
  class: { type: mongoose.Schema.Types.ObjectId, ref: "Class" }, // только для студентов
  createdAt: { type: Date, default: Date.now }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model("User", userSchema);
