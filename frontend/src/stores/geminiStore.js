import axios from "../lib/axios";
import {create} from "zustand";
import toast from "react-hot-toast";

export const useGeminiStore = create((set) => ({
   question : null ,
   getQuestion : async(formData)=>{
    try {
      const response = await axios.post("/gemini/question" , formData);
      set({ question: response.data.question });
      console.log(response.data.question)
      toast.success("Question fetched successfully");
    } catch (error) {
      console.error("Failed to fetch question:", error);
      toast.error("Failed to fetch question");
    }
  }
}))