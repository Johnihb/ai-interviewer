// External modules
import express from "express";
import upload from '../config/multer.js';


// internal modules
import { loginController, signupController , getUser , logoutController} from "../controllers/auth.controller.js";
import { signUpvalidator } from "../middleware/validators/signup.validator.js";
import { loginValidator } from "../middleware/validators/login.validator.js";
import { validate } from "../middleware/validation-result/auth.middleware.js";
import { verifyToken } from "../middleware/validation-result/verifyToken.middleware.js";




const router = express.Router();


// router.post("/signup",upload.single('image'), validator , validate , signupController);// to upload the image or profile picture


//auth controller
router.post("/signup" , signUpvalidator , validate , signupController);
router.post("/login" ,loginValidator , validate , loginController);
router.post('/logout' , verifyToken , logoutController)



//user controller
router.get("/me" , verifyToken , getUser)// get user profile




export default router;