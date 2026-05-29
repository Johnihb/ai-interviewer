import axios from "../lib/axios";
import {create} from "zustand";
import toast from "react-hot-toast";

export const useGeminiStore = create((set) => ({
  statusError : ' ',
  questions : [] ,
  setQuestions : (questions) => set({ questions }),
  loading : false ,
  feedback : null,
  setFeedback : (feedback) => set({ feedback }),
  cvResult : null,
  setCvResult : (cvResult) => set({ cvResult }),

   getQuestions : async(formData)=>{
    set({loading : true , feedback : null , statusError : ' '})
    try {

      const response = await axios.post("/gemini/vacancy" , formData) ;
      set({ questions: response?.data?.user?.questions , feedback: response?.data?.user?.qaResult ?? null });
    } catch (error) {
      if(error?.response?.status === 500){
        return set({statusError : "Internal Server Error"})
      }     
      set({questions : []})
      toast.error("Failed to fetch question");
    }finally {
      set({loading : false})
    }
  },

  postAnswer : async(formData)=>{
    set({loading : true , feedback : null , statusError : ' '})
    try {
      const response = await axios.post("/gemini/evaluate-answer" , {answers : formData}) ;
      let result = response?.data?.result
      set({ feedback: result });
      toast.success("Answer checked successfully");
    } catch (error) {
      if(error?.response?.status === 500){
        return set({statusError : "Internal Server Error"})
      }
      
      set({feedback : null})
      toast.error("Failed to fetch fee dback");
    }finally {
      // set({loading : false , question : [] , answer : []})
      set({loading : false })
    }
  },


}))