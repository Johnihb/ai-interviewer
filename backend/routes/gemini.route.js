import express from "express";
import { verifyToken } from "../middleware/validation-result/verifyToken.middleware.js";
import  multer  from "../config/multer.js";
import { evaluateCV, generateQuestions, evaluateAnswer, existingQuestion, existingCVResult } from "../controllers/ai/gemini.controller.js";

const router = express.Router();

router.post("/evaluate-cv", verifyToken, multer.single('cv') , evaluateCV);
router.post("/vacancy", verifyToken, multer.single('image') , generateQuestions);
router.post('/evaluate-answer', verifyToken, evaluateAnswer);
router.get('/existing-question', verifyToken,existingQuestion );
router.get('/existing-cvResult', verifyToken,existingCVResult );
export default router;
