// external imports
import express from "express";
import dotenv from "dotenv";
import db from "./config/db.js";
import cookieParser from "cookie-parser";

// internal imports
import authRoutes from "./routes/auth.route.js";


dotenv.config();

const PORT =process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());


app.use("/api/v1/auth", authRoutes);
app.get("/api/v1/auth", (req, res)=>{
  res.send("Hello from server");
} );


app.listen(PORT , async ()=>{
  await db;
  console.log(`Server is running on port http://localhost:${PORT}`);
})
