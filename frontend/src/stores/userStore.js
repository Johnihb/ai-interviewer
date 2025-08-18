import {create} from "zustand";
import axios from "../lib/axios";
import toast  from "react-hot-toast";

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
      }finally {
        set({ loading: false });
      }
    } ,

    login : async(formData) => {
        set({ loading: true });
        try {
        const response = await axios.post("/auth/login", formData);
        toast.success("Login successful");
        set({ user: response.data.user });
      } catch (error) {
        console.error("Login failed:", error);
        toast.error("Login failed" , error.message );
      }finally {
        set({ loading: false });
      }
    }
}))
