import User from "../models/user.model.js";

import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";


export const signupController = async (req, res)=>{
  try {
    

    const {name, email, password , confirmPassword} = req.body;

    if(!name || !email || !password || !confirmPassword){
      return res.status(400).json({
        message: "Please fill all the fields",
      })
    }

    const existingUser = await User.findOne({email});
    if(existingUser){
      return res.status(400).json({
        message: "User already exists",
      })
    }

    if(password !== confirmPassword){
      return res.status(400).json({
        message: "Password and confirm password do not match",
      })
    }

    if(!req.file){
      return res.status(400).json({
        message: "Please upload a profile picture",
      })
    }
    const response = await cloudinary.uploader.upload( req.file.path , {"folder": "ai_interviewer"});
    const user = await User.create({name, email, password , image : response ? 
      {
        public_id : response.public_id,
      url : response.secure_url,
      } : null
    });
    await user.save();

    fs.unlinkSync(req.file.path);// delete the temp file 


    res.status(201).json({
      success: true,
      message: "User created successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error in signup",
      error: error.message,
    });
  }
}


