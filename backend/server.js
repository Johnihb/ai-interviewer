// external imports
import express from "express";
import dotenv from "dotenv";
import db from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import morgan from "morgan";
// internal imports
import authRoutes from "./routes/auth.route.js";
import geminiRoutes from "./routes/gemini.route.js";
import helmet from "helmet";

dotenv.config();

const PORT =process.env.PORT || 5000;

const app = express();


if(process.env.NODE_ENV === "development"){
  app.use(morgan("dev"));
  app.use(helmet({
    contentSecurityPolicy:false
  }))
}else{
  app.use(helmet())
}

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors({

  origin : ["http://localhost:5173","http://localhost:5174"],
  credentials : true,
}))






app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/gemini", geminiRoutes);



app.listen(PORT , async ()=>{
  await db;
  console.log(`Server is running on port http://localhost:${PORT}`);
})
