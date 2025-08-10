import express from "express";
import upload from '../config/multer.js';
import { loginController, signupController } from "../controllers/auth.controller.js";


const router = express.Router();


router.post("/signup",upload.single('image') , signupController);
router.post("/login" , loginController);

export default router;