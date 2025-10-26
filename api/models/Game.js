import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
  gameId: { type: String, required: true, unique: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  students: [
    // {
    //   name: String,
    //   correctCount: { type: Number, default: 0 }
    // }
    new mongoose.Schema(
      {
        id: { type: String, required: true }, // твой внешний ID игрока
        name: String,
        correctCount: { type: Number, default: 0 }
      },
      { _id: false } // <-- ВАЖНО! Отключает создание ObjectId
    )
  ],
  questions: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
      text: String,
      options: [String],
      correctAnswers: [String],
      gameGroupId: { type: mongoose.Schema.Types.ObjectId, ref: "GroupGame"}
    }
  ],
  answers: [
    {
      studentName: String,
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
      selected: [String],
      isCorrect: Boolean
    }
  ],
  createdAt: { type: Date, default: Date.now },
  finishedAt: { type: Date }
});

export default mongoose.model("Game", gameSchema);
