import axios from "../lib/axios";
import {create} from "zustand";
import toast from "react-hot-toast";

export const useGeminiStore = create((set,get) => ({
  statusError : '',
  candidate :{
    skill : "" ,
    experience : "" ,
    count : "" ,
    difficulty : "" ,
  },
  question : [] ,
   loading : false ,
  feedback : [],


   getQuestion : async(formData)=>{
    set({loading : true , feedback : [] , statusError : ' '})
    try {
      set({candidate : formData})
      const response = await axios.post("/gemini/question" , formData) ;
      let result = response?.data?.question?.split(" ,").map(q => q.trim());
      result = Array.isArray(result)? result : [result];
      set({ question: result });

      toast.success("Question fetched successfully");
    } catch (error) {
      console.log("error" , error)
      if(error?.response?.status === 500){
        return set({statusError : "Internal Server Error"})
      }     
      set({question : ['question 1' , 'question 2' , 'question 3']})
      toast.error("Failed to fetch question");
    }finally {
      set({loading : false})
    }
  },

  postAnswer : async(formData)=>{
    set({loading : true , feedback : [] , statusError : ' '})
    try {
      const response = await axios.post("/gemini/answer" , {question : get().question , answer : JSON.stringify(formData) , candidate : get().candidate}) ;
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