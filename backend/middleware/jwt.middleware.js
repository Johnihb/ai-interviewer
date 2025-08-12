import User from "../models/user.model.js";

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const verifyToken = async (req , res , next)=>{
  const token = req.cookies.token;

  if(!token){
    return res.status(401).json({
      message: "Unauthorized",
    })
  }

  const result = await jwt.verify(token , process.env.JWT_SECRET);

  if(!result){
    return res.status(401).json({
      message: "Unauthorized",
    })
  }
  req.user = await User.findById(result.id);

  next();
}