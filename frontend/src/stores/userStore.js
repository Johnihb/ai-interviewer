import {create} from "zustand";
import axios from "../lib/axios";
import toast  from "react-hot-toast";

export const useUserStore = create((set) => ({
    user: null,
    loading : false ,
    
    signup : async (formData) => {
      console.log(import.meta.mode)
        set({ loading: true });
        try {
        const response = await axios.post("/auth/signup", formData);
        console.log('success')
        toast.success("Signup successful");
        set({ user: response.data.user });
      } catch (error) {
        console.error("Signup failed:", error);
        toast.error("Signup failed");
        console.log(error)
      }finally {
        set({ loading: false });
      }
    } 
}))
