import { validationResult } from "express-validator";

export const validate = async (req , res , next)=>{
  try {
    const result = await validationResult(req);
    if(!result.isEmpty()){
      return res.status(400).json({
        message: result.array()[0].msg,
      })
    }
    next();
  } catch (error) {
    return res.status(500).json({
      message: "Error in validation",
      error: error.message,
    })
  }
}