// models/InterviewSession.model.js
import mongoose, { Schema } from "mongoose";

const questionSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  type: { type: String, required: true },
  question: { type: String, required: true },
});

const answerSchema = new Schema({
  questionId: { type: Number, required: true },
  score: { type: Number, required: true },
  what_was_good: { type: String, required: true },
  what_was_missing: { type: String, required: true },
  tip: { type: String, required: true },
});

const overallSchema = new Schema({
  score: { type: Number, required: true },
  summary: { type: String, required: true },
  top_strength: { type: String, required: true },
  top_weakness: { type: String, required: true },
  recommendation: { type: String, required: true },
});

const interviewSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: { type: String, required: true },
    questions: { type: [questionSchema], required: true },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    cvStatus: {
      type: String,
      enum: ["pending", "reviewed"],
      default: "pending",
    },
    cvResult: { type: String },
    qaResult: {
      results: [{ type: answerSchema }],
      overall: overallSchema,
    },
    qaStatus: {
      type: String,
      enum: ["pending", "evaluated"],
      default: "pending",
    },
  },
  { timestamps: true },
);

// Auto-delete sessions after 24 hours
interviewSessionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

export default mongoose.model("InterviewSession", interviewSessionSchema);
