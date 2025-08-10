import express from "express";
import upload from '../config/multer.js';
import { signupController } from "../controllers/auth.controller.js";


const router = express.Router();


router.post("/signup",upload.single('image') , signupController);

export default router;