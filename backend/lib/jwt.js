import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config()

const setCookies = (res , id) =>{

  if(!process.env.JWT_SECRET){
    throw new Error("JWT_SECRET is not defined");
  }

    const token = jwt.sign({id} , process.env.JWT_SECRET , {
      expiresIn: "1d",
    });

  res.cookie("token" , token , {
    sameSite : "Strict",
    httpOnly : true,
    secure : process.env.NODE_ENV === "production",
    maxAge : 7 * 24 * 60 * 60 * 1000,

  })
}


export default setCookies