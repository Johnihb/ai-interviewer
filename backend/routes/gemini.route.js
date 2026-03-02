import express from "express";
import { getGemini, postGemini } from "../controllers/gemini.controller.js";
import { verifyToken } from "../middleware/validation-result/verifyToken.middleware.js";
import { pdfParse, vaccancyParse } from "../controllers/gemini.js";
import  multer  from "../config/multer.js";



const router = express.Router();

router.post("/question", verifyToken , getGemini);

router.post("/answer", verifyToken , postGemini);
router.post("/gemini", multer.single('pdf') , pdfParse);
router.post("/vaccancy", verifyToken, multer.single('image') , vaccancyParse);

export default router;
