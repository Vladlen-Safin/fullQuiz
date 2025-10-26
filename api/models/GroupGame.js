import mongoose from "mongoose"

/**
 * Модель видов игры (игры для разных классов (вопросы))
 * Поля: 
 * - name        → название вида (обязательное)
  * - description → описание вида (необязательное)
  * - createdAt   → дата создания (автоматически устанавливается при создании)
 */
const groupGameSchema = new mongoose.Schema({
    name: { type: String, required: true},
    description: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("GroupGame", groupGameSchema);