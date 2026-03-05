import User from "../../models/user.model.js";
import serverResponse from "../../lib/action/api_Response.js";
import setCookies from "../../lib/cookie.js";

export const signupController = async (req, res) => {
  console.log("user is here");
  console.log(req.body);
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json(serverResponse(400, 302));
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json(serverResponse(400, 300));
    }

    let user = await User.create({ name, email, password });
    await user.save();

    setCookies(res, user._id);

    user = {
      name: user.name,
      email: user.email,
      _id: user._id,
    };

    res.status(201).json(serverResponse(201, 200, user));
  } catch (error) {
    console.log(error);
    res.status(500).json(serverResponse(500, 301));
  }
};

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;


    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json(serverResponse(400, 301));
    }

    const isMatched = await user.comparePassword(password);
    if (!isMatched) {
      return res.status(400).json(serverResponse(400, 302));
    }

    setCookies(res, user._id);
    user = {
      name: user.name,
      email: user.email,
      _id: user._id,
    };
    res.status(200).json(serverResponse(201, 200, user));
  } catch (error) {
    console.log(error);
    res.status(500).json(serverResponse(500, 3));
  }
};

export const getUser = async (req, res) => {
  try {
    const { user } = req;
    res.status(200).json(serverResponse(200, 203, user));
  } catch (error) {
    console.log(error);
    res.status(500).json(500, 304);
  }
};

export const logoutController = async (req, res) => {
  try {
    await res.clearCookie("token", {
      sameSite: "Strict",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    res.status(200).json(serverResponse(200, 201));
  } catch (error) {
    console.log(error);
    res.status(500).json(serverResponse(500, 2));
  }
};


export const checkUsername = async(req , res)=>{
  try {
    
  const {username} = req.body;
  const user = await User.findOne({name:username}).select("name");
    
    
  if(user){
    return res.status(200).json(serverResponse(200 , 300))
  }
  return res.status(200).json(serverResponse(404 , 304))
  } catch (error) {
    
  }
}