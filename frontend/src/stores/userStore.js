import {create} from "zustand";
import axios from "../lib/axios";
import toast  from "react-hot-toast";

export const useUserStore = create((set) => ({
    user: null,
    loading : false ,

    getUser : async () => {
        set({ loading: true });
        try {
        const response = await axios.get("/auth/me");
        set({ user: response.data.user });
      } catch (error) {
        console.error("Failed to fetch user:", error);
        toast.error("Failed to fetch user");
      }finally {
        set({ loading: false });
      }
    } ,
    
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
    },

    logout : async()=>{
      try {
        await axios.post("/auth/logout");
        set({ user: null });
      } catch (error) {
        console.error("Logout failed:", error);
        toast.error("Logout failed");
      }
    },


}))
