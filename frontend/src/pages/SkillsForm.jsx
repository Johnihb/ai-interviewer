import { Activity, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CaseSensitive, Image, Briefcase, FileText, Upload, ArrowRight, X as XIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import toast from "react-hot-toast";
import { useGeminiStore } from "../stores/geminiStore";

export default function SkillsForm() {
  const [mode, setMode] = useState("text");

  return (
    <div className="min-h-[90dvh] flex items-center justify-center p-4 mt-16 relative overflow-hidden">

      {/* Subtle ambient background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.03)_0%,_transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(255,255,255,0.02)_0%,_transparent_50%)]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        {/* Top accent line */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-neutral-500 to-transparent mb-8" />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-10 space-y-3"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/5 border border-white/10 mb-2">
            <Briefcase className="w-5 h-5 text-neutral-300" />
          </div>
          <h1 className="text-2xl font-light tracking-tight text-white">
            Job Assessment
          </h1>
          <p className="text-neutral-500 text-sm font-light">
            Enter your job role details to begin
          </p>
        </motion.div>

        {/* Mode Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="flex justify-center mb-8"
        >
          <div className="flex bg-white/[0.03] border border-white/[0.08] rounded-xl p-1 gap-1">
            <button
              onClick={() => setMode("text")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-light transition-all duration-300 cursor-pointer ${mode === "text"
                  ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.06)]"
                  : "text-neutral-500 hover:text-neutral-300 hover:bg-white/[0.04]"
                }`}
            >
              <CaseSensitive className="w-4 h-4" />
              <span>Text</span>
            </button>
            <button
              onClick={() => setMode("image")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-light transition-all duration-300 cursor-pointer ${mode === "image"
                  ? "bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.06)]"
                  : "text-neutral-500 hover:text-neutral-300 hover:bg-white/[0.04]"
                }`}
            >
              <Image className="w-4 h-4" />
              <span>Image</span>
            </button>
          </div>
        </motion.div>

        {/* Form Content */}
        <AnimatePresence mode="wait">
        
        <Activity mode={mode === 'text' ? 'visible' : 'hidden'}>
        <motion.div
              key="text"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <Form>
                <TextMode />
              </Form>
            </motion.div>
          </Activity>
              
             <Activity mode={mode === 'image' ? 'visible' : 'hidden'}>
            <motion.div
              key="image"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
              <Form>
                <ImageMode />
              </Form>
            </motion.div>
         
              </Activity> 
        </AnimatePresence>

        {/* Bottom accent line */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-neutral-700 to-transparent mt-8" />
      </motion.div>
    </div>
  );
}

const ImageMode = () => {
  const [preview, setPreview] = useState(null);
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const clearFile = () => {
    setPreview(null);
    setFileName("");
    const input = document.getElementById("image");
    if (input) input.value = "";
  };

  return (
    <div className="space-y-5">
      {/* Image Upload */}
      <div className="group">
        <label
          htmlFor="image"
          className="flex items-center gap-2 text-neutral-400 text-xs font-medium uppercase tracking-widest mb-2.5 transition-colors group-focus-within:text-neutral-200"
        >
          <Upload className="w-3.5 h-3.5" />
          Upload Resume / Job Description
        </label>

        {!preview ? (
          <label
            htmlFor="image"
            className="flex flex-col items-center justify-center w-full h-44 bg-white/[0.03] border border-dashed border-white/[0.12] rounded-xl cursor-pointer transition-all duration-300 hover:border-white/25 hover:bg-white/[0.05] group/upload"
          >
            <Upload className="w-8 h-8 text-neutral-600 mb-3 transition-transform duration-300 group-hover/upload:scale-110 group-hover/upload:text-neutral-400" />
            <span className="text-neutral-500 text-sm font-light">
              Click to upload an image
            </span>
            <span className="text-neutral-600 text-xs mt-1">
              JPG, PNG, or WebP
            </span>
          </label>
        ) : (
          <div className="relative w-full h-44 rounded-xl overflow-hidden border border-white/[0.08]">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <button
                type="button"
                onClick={clearFile}
                className="p-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white hover:bg-white/20 transition-all duration-200"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>
            <div className="absolute bottom-2 left-2 right-2 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5">
              <span className="text-white text-xs font-light truncate block">
                {fileName}
              </span>
            </div>
          </div>
        )}

        <input
          id="image"
          name="image"
          type="file"
          className="hidden"
          accept=".jpg,.jpeg,.png,.webp"
          onChange={handleFileChange}
        />
      </div>

      {/* Specific Role */}
      <div className="group">
        <label
          htmlFor="role"
          className="flex items-center gap-2 text-neutral-400 text-xs font-medium uppercase tracking-widest mb-2.5 transition-colors group-focus-within:text-neutral-200"
        >
          <Briefcase className="w-3.5 h-3.5" />
          Specific Job Role
        </label>
        <textarea
          name="role"
          id="role"
          rows={3}
          placeholder="e.g. Senior React Developer with focus on..."
          className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-sm placeholder-neutral-600 focus:border-white/25 focus:bg-white/[0.05] focus:outline-none focus:ring-1 focus:ring-white/10 transition-all duration-300 resize-none"
        />
      </div>
    </div>
  );
};

const Form = ({ children }) => {
  const getQuestions = useGeminiStore((state) => state.getQuestions);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
      await getQuestions(data);
      navigate("/questions");
    } catch (error) {
      console.error("Error", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
      encType="multipart/form-data"
    >
      {children}

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="group/btn flex-1 relative bg-white text-black text-sm font-medium py-3.5 px-4 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.08)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none cursor-pointer"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2.5">
              <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              <span>Generating...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <span>Start Assessment</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
            </div>
          )}
        </button>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="px-5 py-3.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-neutral-400 text-sm font-light transition-all duration-300 hover:text-white hover:bg-white/[0.06] hover:border-white/15 active:scale-[0.98] cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

const TextMode = () => {
  return (
    <div className="space-y-5">
      {/* Job Role Field */}
      <div className="group">
        <label
          htmlFor="role"
          className="flex items-center gap-2 text-neutral-400 text-xs font-medium uppercase tracking-widest mb-2.5 transition-colors group-focus-within:text-neutral-200"
        >
          <Briefcase className="w-3.5 h-3.5" />
          Job Role
        </label>
        <input
          type="text"
          id="role"
          name="role"
          placeholder="e.g. Senior Frontend Developer"
          required
          className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-sm placeholder-neutral-600 focus:border-white/25 focus:bg-white/[0.05] focus:outline-none focus:ring-1 focus:ring-white/10 transition-all duration-300"
        />
      </div>

      {/* Description Field */}
      <div className="group">
        <label
          htmlFor="description"
          className="flex items-center gap-2 text-neutral-400 text-xs font-medium uppercase tracking-widest mb-2.5 transition-colors group-focus-within:text-neutral-200"
        >
          <FileText className="w-3.5 h-3.5" />
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          placeholder="Describe the role, required skills, or paste a job description..."
          className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-sm placeholder-neutral-600 focus:border-white/25 focus:bg-white/[0.05] focus:outline-none focus:ring-1 focus:ring-white/10 transition-all duration-300 resize-none"
        />
      </div>
    </div>
  );
};