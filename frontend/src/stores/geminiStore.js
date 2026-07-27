import axios from "../lib/axios";
import {create} from "zustand";
import toast from "react-hot-toast";

const initialState = {
  statusError : ' ',
  questions : [] ,
  loading : false ,
  feedback : null,
  cvResult : null,
  sessionLoaded: false,
};

export const useGeminiStore = create((set) => ({
  ...initialState,
  setSession: (session) => set({
    questions: session?.questions ?? [],
    feedback: session?.qaStatus === "evaluated" ? session.qaResult : null,
    cvResult: session?.cvStatus === "reviewed" ? session.cvResult : null,
    sessionLoaded: true,
  }),
  reset: () => set(initialState),

   getQuestions : async(formData)=>{
    set({loading : true , feedback : null , statusError : ' '})
    try {

      const response = await axios.post("/gemini/vacancy" , formData) ;
      const session = response.data.data;
      set({
        questions: session.questions,
        feedback: session.qaStatus === "evaluated" ? session.qaResult : null,
        cvResult: session.cvStatus === "reviewed" ? session.cvResult : null,
        sessionLoaded: true,
      });
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
      const session = response.data.data;
      set({
        feedback: session.qaResult,
        questions: session.questions,
        cvResult: session.cvStatus === "reviewed" ? session.cvResult : null,
        sessionLoaded: true,
      });
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

  evaluateCV: async (formData) => {
    set({ loading: true, statusError: ' ' });
    try {
      const response = await axios.post("/gemini/evaluate-cv", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const { cvResult } = response.data.data;
      set({ cvResult, sessionLoaded: true });
      return cvResult;
    } catch (error) {
      if (error?.response?.status === 500) set({ statusError: "Internal Server Error" });
      toast.error("Failed to evaluate CV");
      throw error;
    } finally {
      set({ loading: false });
    }
  },

}))
