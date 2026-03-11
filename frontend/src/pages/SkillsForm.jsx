import { Activity, useState } from "react";
// import { useGeminiStore } from '../stores/geminiStore';
import { useNavigate } from "react-router-dom";
import { CaseSensitive, Image } from "lucide-react";
import toast from "react-hot-toast";
import { useGeminiStore } from "../stores/geminiStore";

export default function SkillsForm() {
  
  const [mode, setMode] = useState("text");

  return (
    <div className="min-h-[90dvh]  flex items-center justify-center px-6 flex-col gap-4 mt-18 overflow-hidden">
      <div className="w-full max-w-md  rounded-2xl p-8 border border-gray-700">
        {/* Header */}
        <div className="h-20 mb-6">
          <h1 className="text-cyan-400 text-3xl font-medium text-center drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">
            Job Assessment
          </h1>
          <p className="text-gray-400 text-lg text-center">
            Enter your job role details below
          </p>
        </div>

        <div className="flex justify-center ">
          <button
            className={`flex ${mode === "text" ? "text-cyan-400 bg-green-300" : "text-gray-400 bg-white"} p-2 rounded-l-sm`}
            onClick={() => setMode("text")}
          >
            <CaseSensitive size={30} />{" "}
          </button>
          <button
            className={`flex ${mode === "image" ? "text-cyan-400 bg-green-300" : "text-gray-400 bg-white"} p-2 rounded-r-sm`}
            onClick={() => setMode("image")}
          >
            <Image size={30} />{" "}
          </button>
        </div>

        <Activity mode={mode === "text" ? "visible" : "hidden"}>
          <Form
          >
            <TextMode />

          </Form>
        </Activity>

        <Activity Activity mode={mode === "image" ? "visible" : "hidden"}>
         <Form>
          <ImageMode />

        </Form>
        </Activity>
      </div>
    </div>
  );
}

const ImageMode = () => {
  return (
    <div className={`flex flex-col gap-4  `}>
      <label htmlFor="image">Image:</label>

      <input
        id="image"
        name="image"
        type="file"
        className=" size-80 bg-cyan-400 hover:bg-cyan-500 font-medium py-3 rounded-lg transition-all duration-200 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] focus:outline-none focus:border-cyan-400 border border-cyan-400 text-white "
        accept=".jpg, .jpeg, .png ,.webp "
      />

      <label htmlFor="role">Specific job role:</label>
      <textarea name="role" id="role"></textarea>
    </div>
  );
};


const Form = ({children})=>{
  const getQuestions = useGeminiStore((state) => state.getQuestions)
   const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
        getQuestions(data)
        
    } catch (error) {
      console.error("Error",error)
      toast.error("Error");
    }

    navigate("/questions");


  };
  
  return   (<form
            onSubmit={handleSubmit}
            className="space-y-4 text-xl flex flex-col gap-4 "
            encType="multipart/form-data"
          >
            {children}   
              <div className="flex gap-4 text-xl">
              <button
                type="submit"
                className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-3 rounded-lg transition-all duration-200 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] border border-cyan-500"
              >
                Submit
              </button>
              <button
                type="button"
                // onClick={handleCancel}
                className="flex-1 bg-transparent border border-red-500 hover:border-red-400 text-red-400 hover:text-red-300 font-medium py-3 rounded-lg transition-all duration-200 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]"
              >
                Cancel
              </button>
            </div>         
          </form> 
)}


const TextMode = ()=>{
  return (
   <>
       {/* job Field */}

            <div className="mb-4">
              <label className="block text-xl text-green-400 font-medium mb-3 drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]">
                Job role
              </label>
              <input
                type="text"
                placeholder="e.g. Sr. frontend dev."
                required
                name="role"
                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 focus:shadow-[0_0_15px_rgba(34,197,94,0.3)] transition-all duration-200 h-10"
              />
            </div>

            {/* Experience Field */}
            <div className="mb-4">
              <label
                htmlFor="description"
                className="block text-purple-400 text-xl font-medium mb-3 drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]"
              >
                Description
              </label>
              <textarea
                className="w-full focus:outline-none  bg-gray-800  focus:border-white border rounded-sm"
                name="description"
                id="description"
              ></textarea>
            </div>
   </> 
  )
}