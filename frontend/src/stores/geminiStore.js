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
      // let result = response?.data?.question?.split(" ,").map(q => q.trim().replace(/^["']|["']$/g, ""));
      console.log("i am question" , response?.data?.question)
      set({ question: response?.data?.question });

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
    console.log("i am answer" , formData)
    try {

      const response = await axios.post("/gemini/answer" , {question : get().question , answer : formData , candidate : get().candidate}) ;
      // let result = response?.data?.result?.split(" ,").map(q => q.trim().replace(/^['"]|['"]$/g, ""));
      set({ feedback: response?.data?.result });
      console.log("i am feedback" , response?.data?.result)
      toast.success("Answer checked successfully");
    } catch (error) {
      console.log("error" , error)
      if(error?.response?.status === 500){
        return set({statusError : "Internal Server Error"})
      }
      
      set({feedback : ['feedback 1' , 'feedback 2' , 'feedback 3']})
      toast.error("Failed to fetch fee dback");
    }finally {
      set({loading : false})
    }
  }
}))