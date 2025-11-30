import User from "../../models/user.model.js";

import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import serverResponse from "../../lib/action/api_Response.js";
dotenv.config();

export const verifyToken = async (req , res , next)=>{
  const token = req.cookies.token;

  if(!token){
    return res.status(401).json(serverResponse(401 , 303))
  }

  const result = jwt.verify(token , process.env.JWT_SECRET);

  if(!result){
    return res.status(401).json(serverResponse(401 , 303))
  }
  req.user = await User.findById(result.id);

  next();
}