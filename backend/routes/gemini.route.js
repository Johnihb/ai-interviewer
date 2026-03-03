import express from "express";
import { getGemini, postGemini } from "../controllers/gemini.controller.js";
import { verifyToken } from "../middleware/validation-result/verifyToken.middleware.js";
import { evaluateAnswer, evaluateCV, generateQuestions } from "../controllers/gemini.js";
import  multer  from "../config/multer.js";



const router = express.Router();

router.post("/question", verifyToken , getGemini);
router.post("/answer", verifyToken , postGemini);
router.post("/gemini", verifyToken, multer.single('pdf') , evaluateCV);
router.post("/vacancy", verifyToken, multer.single('image') , generateQuestions);
router.post('/evaluate-answer', verifyToken, evaluateAnswer);
export default router;
