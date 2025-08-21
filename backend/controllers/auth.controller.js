import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

import setCookies from "../utils/jwt.js";
import User from "../models/user.model.js";

export const signupController = async (req, res)=>{
  
  console.log("user is here")
  console.log(req.body)
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

    /*
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
  */
    let user = await User.create({name, email, password});
    await user.save();

    // fs.unlinkSync(req.file.path);// delete the temp file 
    setCookies(res , user._id);

    user = {
      name : user.name,
      email : user.email,
      _id : user._id,
    }

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: "Error in signup",
      error: error.message,
    });
  }
}


export const loginController = async (req , res)=>{
  try {
    const {email , password} = req.body;
  
    if(!email || !password){
      return res.status(400).json({
        message: "Please fill all the fields",
      })
    }
 
    let user = await User.findOne({email});
    
    if(!user){
      return res.status(400).json({
        message: "User not found",
      })
    }
    
    const isMatched = await user.comparePassword(password);
    if(!isMatched){
      return res.status(400).json({
        message: "Invalid email or password",
      })
    }

    setCookies(res , user._id);
    user = {
      name : user.name,
      email : user.email,
      _id : user._id,
    }
    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      user : user,
    })

  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: "Error in login",
      error : error.message,
    })
  }
}

export const getUser = async (req , res)=>{
    try {
        const user = req.user;
            res.status(200).json({
            success: true,
            message: "User fetched successfully",
            user,
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: "Error in fetching user",
            error : error.message,
        })
    }
}

export const logoutController = async (req , res)=>{
  try {
    await res.clearCookie('token',{
      sameSite : "Strict",
      httpOnly : true,
      secure : process.env.NODE_ENV === "production",
    });
    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: "Error in logging out",
      error : error.message,
    })
  }
}