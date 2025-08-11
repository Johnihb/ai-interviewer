import express from "express";
import upload from '../config/multer.js';
import { loginController, signupController } from "../controllers/auth.controller.js";
import { validate } from "../middleware/signupValidate.middleware.js";
import { validator } from "../validators/signup.validator.js";

const router = express.Router();


router.post("/signup",upload.single('image'), validator , validate , signupController);
router.post("/login" , loginController);

export default router;