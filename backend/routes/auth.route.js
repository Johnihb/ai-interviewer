import express from "express";
import upload from '../config/multer.js';
import { loginController, signupController , getUser , logoutController} from "../controllers/auth.controller.js";
import { validate } from "../middleware/auth.middleware.js";
import { validator } from "../validators/signup.validator.js";
import { loginValidator } from "../validators/login.validator.js";
import { verifyToken } from "../middleware/jwt.middleware.js";
const router = express.Router();


// router.post("/signup",upload.single('image'), validator , validate , signupController);
router.post("/signup" , validator , validate , signupController);
router.post("/login" ,loginValidator , validate , loginController);


router.get("/me" , verifyToken , getUser)// get user profile
router.post('/logout' , verifyToken , logoutController)

export default router;