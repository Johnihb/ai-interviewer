import mongoose from "mongoose";
import dotenv from "dotenv";


dotenv.config();

  mongoose.connect(process.env.MONGO_URI).then(()=>{
  }).catch((err)=>{
    process.exit(1);
  });

export default mongoose;