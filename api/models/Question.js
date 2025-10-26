import mongoose from "mongoose";

/**
 * Типы вопросов:
 *  - "single"   → один правильный ответ
 *  - "multiple" → несколько правильных ответов
 *  - "open"     → ответ в свободной форме
 *
 * При добавлении вопроса с типом single/multiple,
 * правильные варианты помечаются звёздочкой (*) в начале текста.
 */
const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  type: { type: String, enum: ["single", "multiple", "open"], default: "open" },
  options: [String], // варианты ответа (для single/multiple)
  correctAnswers: [String], // массив с правильными ответами (очищенные от звёздочек)
});

// Хук для автоматического определения correctAnswers
questionSchema.pre("save", function (next) {
  if (this.type !== "open" && Array.isArray(this.options)) {
    // Извлекаем все варианты, где есть звёздочка (*)
    this.correctAnswers = this.options
      .filter((opt) => opt.trim().startsWith("*"))
      .map((opt) => opt.replace(/^\*\s*/, "").trim()); // убираем звёздочку
    // Очищаем список options от звёздочек
    this.options = this.options.map((opt) => opt.replace(/^\*\s*/, "").trim());
  }
  next();
});

export default mongoose.model("Question", questionSchema);
