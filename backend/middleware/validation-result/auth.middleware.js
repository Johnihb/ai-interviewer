import { validationResult } from "express-validator";
import serverResponse from "../../lib/action/api_Response.js";

export const validate = async (req , res , next)=>{
  try {
    const result = await validationResult(req);
    if(!result.isEmpty()){
      return res.status(400).json(serverResponse(400 ,result.array()[0].msg, ))
    }
    next();
  } catch (error) {
    return res.status(500).json(serverResponse(500 , 1))
  }
}