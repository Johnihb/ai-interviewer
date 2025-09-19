import {check} from "express-validator";

export const signUpvalidator = [
  check("name")
    .trim()
    .notEmpty().withMessage("Name is required")
    .isLength({min: 3}).withMessage("Name must be at least 3 characters long"),
 
  check("email").trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Email is invalid").isLowercase().withMessage("Email must be lowercase"),
  
  check("password")
    .trim().notEmpty().withMessage("Password is required")
    .isLength({min: 6}).withMessage("Password must be at least 6 characters long"),
  
  check("confirmPassword").trim().custom((value , {req})=>{
    if(value !== req.body.password){
      throw new Error("Password and Confirm Password do not match");
    }
    return true;
  })
]
