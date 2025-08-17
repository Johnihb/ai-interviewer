import create from "zustand";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

export const useUserStore = create((set) => ({
    user: null,
    loading : false ,
    
    signup : async (formData) => {
        set({ loading: true });
        try {
        const response = await axios.post("/auth/signup", formData);
        toast.success("Signup successful");
        set({ user: response.data.user });
      } catch (error) {
        console.error("Signup failed:", error);
        toast.error("Signup failed");
      }
    } 
}))
