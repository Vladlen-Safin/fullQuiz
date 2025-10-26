import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
  gameId: { type: String, required: true, unique: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  students: [
    {
      name: String,
      correctCount: { type: Number, default: 0 }
    }
  ],
  questions: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
      text: String,
      options: [String],
      correctAnswers: [String]
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
