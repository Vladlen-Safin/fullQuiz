import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  answers: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
      response: [String]
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Answer", answerSchema);
