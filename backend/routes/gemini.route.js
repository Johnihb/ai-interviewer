import express from "express";
import { getGemini, postGemini } from "../controllers/gemini.controller.js";
import { verifyToken } from "../middleware/jwt.middleware.js";

const router = express.Router();

router.get("/", verifyToken , getGemini);

router.post("/", verifyToken , postGemini);

export default router;
