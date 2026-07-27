import mongoose from "mongoose";
import dotenv from "dotenv";


dotenv.config();

  mongoose.connect(process.env.MONGO_URI).then(()=>{
  }).catch((err)=>{
    console.log(err);
    process.exit(1);
  });

export default mongoose;