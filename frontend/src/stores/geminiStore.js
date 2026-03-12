import axios from "../lib/axios";
import {create} from "zustand";
import toast from "react-hot-toast";

export const useGeminiStore = create((set) => ({
  statusError : ' ',
  questions : [] ,
  loading : false ,
  feedback : [],


   getQuestions : async(formData)=>{
    set({loading : true , feedback : [] , statusError : ' '})
    try {

      const response = await axios.post("/gemini/vacancy" , formData) ;
      
      console.log(response.data)

      set({ questions: response?.data?.user?.questions });

      toast.success("Questions fetched successfully");
    } catch (error) {
      console.log("error" , error)
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
    set({loading : true , feedback : [] , statusError : ' '})
    try {
      console.log('formdata :',formData)
      const response = await axios.post("/gemini/answer" , {answer : formData}) ;
      let result = response?.data?.result
      set({ feedback: result });
      toast.success("Answer checked successfully");
    } catch (error) {
      console.log("error" , error)
      if(error?.response?.status === 500){
        return set({statusError : "Internal Server Error"})
      }
      
      set({feedback :['feedback 1' , 'feedback 2' , 'feedback 3']})
      toast.error("Failed to fetch fee dback");
    }finally {
      set({loading : false , question : [] , answer : []})
    }
  }
}))