import express from "express";
import { getGemini, postGemini } from "../controllers/gemini.controller.js";
import { verifyToken } from "../middleware/jwt.middleware.js";

const router = express.Router();

router.post("/question", verifyToken , getGemini);

router.post("/answer", verifyToken , postGemini);

export default router;
