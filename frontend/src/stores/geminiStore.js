import axios from "../lib/axios";
import {create} from "zustand";
import toast from "react-hot-toast";

export const useGeminiStore = create((set,get) => ({
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
    set({loading : true})
    try {
      set({candidate : formData})
      const response = await axios.post("/gemini/question" , formData) ;
      let result = response.data.question.split(" ,").map(q => q.trim().replace(/^["']|["']$/g, ""));
      set({ question: Array.isArray(result) ? result : [result] });

      toast.success("Question fetched successfully");
    } catch (error) {
      set({question : ['question 1' , 'question 2' , 'question 3']})
      console.error("Failed to fetch question:", error);
      toast.error("Failed to fetch question");
    }finally {
      set({loading : false})
    }
  },

  postAnswer : async(formData)=>{
    set({loading : true})
    console.log("i am answer" , formData)
    try {

      const response = await axios.post("/gemini/answer" , {question : get().question , answer : formData , candidate : get().candidate}) ;
      let result = response.data.result.split(" ,").map(q => q.trim().replace(/^['"]|['"]$/g, ""));
      set({ feedback: Array.isArray(result) ? result : [result] , question : [] , answer : [] });
      console.log("i am feedback" , result)
      toast.success("Answer checked successfully");
    } catch (error) {
      set({feedback : ['feedback 1' , 'feedback 2' , 'feedback 3']})
      console.error("Failed to fetch fee dback:", error);
      toast.error("Failed to fetch fee dback");
    }finally {
      set({loading : false})
    }
  }
}))