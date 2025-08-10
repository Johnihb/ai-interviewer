import mongoose from "mongoose";
import bcrypt from "bcrypt";
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: "Please enter a valid email address",
    },
  },
  password: {
    type: String,
    minlength: [6, "Password must be at least 6 characters long"],
    required: true,
  },
  image: {
    public_id: {
      type :String ,
      required: [true, "Image public id is required"]
    },
    url: {
      type :String ,
      required: [true, "Image url is required"],
    }
  },
} , {
  timestamps: true
});

userSchema.pre("save", async function(next){
  if(!this.isModified("password") ){
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});


userSchema.methods.comparePassword = async function(candidatePassword){
  return await bcrypt.compare(candidatePassword , this.password);
}

const User = mongoose.model("User", userSchema);

export default User;