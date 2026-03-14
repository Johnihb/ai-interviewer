import express from "express";
import { verifyToken } from "../middleware/validation-result/verifyToken.middleware.js";
import  multer  from "../config/multer.js";
import { evaluateCV, generateQuestions, evaluateAnswer, fetchExistingQuestion } from "../controllers/ai/gemini.controller.js";

const router = express.Router();

router.post("/gemini", verifyToken, multer.single('pdf') , evaluateCV);
router.post("/vacancy", verifyToken, multer.single('image') , generateQuestions);
router.post('/evaluate-answer', verifyToken, evaluateAnswer);
router.get('/existing-question', verifyToken,fetchExistingQuestion );
export default router;
