// models/InterviewSession.model.js
import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  id:       { type: Number, required: true },
  type:     { type: String, required: true },
  question: { type: String, required: true },
});

const interviewSessionSchema = new mongoose.Schema({
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  role:      { type: String, required: true },
  questions: { type: [questionSchema], required: true },
  status:    { type: String, enum: ["pending", "completed"], default: "pending" },
}, { timestamps: true });

// Auto-delete sessions after 24 hours
interviewSessionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

export default mongoose.model("InterviewSession", interviewSessionSchema);