import { useState, useRef, useCallback } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import {
  FileText,
  Upload,
  X as XIcon,
  ArrowRight,
  CheckCircle2,
  File,
} from "lucide-react";
import { motion , AnimatePresence } from "motion/react";
import toast from "react-hot-toast";
import axios from "../lib/axios";
import { useEffect } from "react";
import CVResult from "./CVResult";
import { useGeminiStore } from "../stores/geminiStore";

// ─── Constants ────────────────────────────────────────────────────────────────
const ACCEPTED_TYPE = "application/pdf";
const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatBytes = (bytes) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const getWrongFormatMessage = (filename) => {
  const ext = filename.split(".").pop()?.toUpperCase() ?? "that";
  const messages = [
    `Oops! ${ext} files can't apply here 🙈 — only PDFs get the interview!`,
    `Sorry, ${ext} is not the chosen one 📜 — PDFs only, please!`,
    `Hmm, a ${ext} file? We only speak PDF here 🤓`,
    `That's a cute ${ext}, but we're in a PDF-only zone 🚪`,
  ];
  return messages[Math.floor(Math.random() * messages.length)];
};

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Ambient background — same pattern used across all pages */
const AmbientBackground = () => (
  <div className="fixed inset-0 -z-10">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.03)_0%,_transparent_60%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(255,255,255,0.02)_0%,_transparent_50%)]" />
  </div>
);

/** Page header with icon, title, and subtitle */
const PageHeader = () => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
    className="text-center mb-10 space-y-3"
  >
    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/5 border border-white/10 mb-2">
      <FileText className="w-5 h-5 text-neutral-300" />
    </div>
    <h1 className="text-2xl font-light tracking-tight text-white">
      Upload Your CV
    </h1>
    <p className="text-neutral-500 text-sm font-light">
      Share your resume so we can tailor your interview experience
    </p>
  </motion.div>
);

/** Accent rule lines, reused at top and bottom of the card */
const AccentLine = ({ className = "" }) => (
  <div
    className={`h-px w-full bg-gradient-to-r from-transparent via-neutral-500 to-transparent ${className}`}
  />
);

/** File info pill displayed after a file is chosen */
const FileInfoBadge = ({ file, onClear }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.95 }}
    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
    className="flex items-center gap-3 w-full px-4 py-3 bg-white/[0.04] border border-white/[0.1] rounded-xl"
  >
    {/* Icon */}
    <div className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-lg bg-white/[0.06] border border-white/[0.08]">
      <File className="w-4 h-4 text-neutral-300" />
    </div>

    {/* Name + size */}
    <div className="flex-1 min-w-0">
      <p className="text-white text-sm font-light truncate">{file.name}</p>
      <p className="text-neutral-500 text-xs mt-0.5">{formatBytes(file.size)}</p>
    </div>

    {/* Ready chip */}
    <div className="flex-shrink-0 flex items-center gap-1.5 text-neutral-400 text-xs">
      <CheckCircle2 className="w-3.5 h-3.5 text-neutral-300" />
      <span>Ready</span>
    </div>

    {/* Clear */}
    <button
      type="button"
      onClick={onClear}
      aria-label="Remove file"
      className="flex-shrink-0 p-1.5 rounded-lg text-neutral-600 hover:text-neutral-300 hover:bg-white/[0.06] transition-all duration-200 cursor-pointer"
    >
      <XIcon className="w-3.5 h-3.5" />
    </button>
  </motion.div>
);

/** Drag-and-drop / click-to-upload drop zone */
const DropZone = ({ onFile, inputRef }) => {
  const [isDragging, setIsDragging] = useState(false);

  const validateAndSet = useCallback(
    (file) => {
      if (!file) return;
      if (file.type !== ACCEPTED_TYPE) {
        toast.error(getWrongFormatMessage(file.name), {
          icon: "😅",
          style: { background: "#1a1a1a", color: "#fff", border: "1px solid rgba(255,255,255,0.08)" },
        });
        return;
      }
      if (file.size > MAX_SIZE_BYTES) {
        toast.error(`That PDF is too heavy 😰 — keep it under ${MAX_SIZE_MB} MB!`, {
          icon: "📦",
          style: { background: "#1a1a1a", color: "#fff", border: "1px solid rgba(255,255,255,0.08)" },
        });
        return;
      }
      onFile(file);
    },
    [onFile]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      validateAndSet(file);
    },
    [validateAndSet]
  );

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleInputChange = (e) => {
    validateAndSet(e.target.files?.[0]);
    // Reset input so same file can be re-selected after removal
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <label
      htmlFor="cv-upload"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`
        group/drop flex flex-col items-center justify-center w-full h-48 rounded-xl cursor-pointer
        border border-dashed transition-all duration-300
        ${
          isDragging
            ? "border-white/40 bg-white/[0.06] scale-[1.01]"
            : "border-white/[0.12] bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.05]"
        }
      `}
    >
      <motion.div
        animate={{ y: isDragging ? -4 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="flex flex-col items-center gap-3"
      >
        <div
          className={`flex items-center justify-center w-12 h-12 rounded-2xl border transition-all duration-300
            ${isDragging ? "bg-white/10 border-white/20" : "bg-white/[0.04] border-white/[0.08] group-hover/drop:bg-white/[0.07] group-hover/drop:border-white/15"}
          `}
        >
          <Upload
            className={`w-5 h-5 transition-all duration-300 ${
              isDragging ? "text-white scale-110" : "text-neutral-500 group-hover/drop:text-neutral-300 group-hover/drop:scale-105"
            }`}
          />
        </div>

        <div className="text-center space-y-1">
          <p className="text-neutral-400 text-sm font-light">
            {isDragging ? "Drop it like it's hot 🔥" : "Drag & drop or click to upload"}
          </p>
          <p className="text-neutral-600 text-xs">PDF only · up to {MAX_SIZE_MB} MB</p>
        </div>
      </motion.div>

      <input
        ref={inputRef}
        id="cv-upload"
        name="cv"
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={handleInputChange}
      />
    </label>
  );
};

/** Submit + Cancel actions — consistent with SkillsForm */
const FormActions = ({ isLoading, onCancel }) => (
  <div className="flex gap-3 pt-2">
    <button
      type="submit"
      disabled={isLoading}
      className="group/btn flex-1 relative bg-white text-black text-sm font-medium py-3.5 px-4 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.08)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none cursor-pointer"
    >
      {isLoading ? (
        <div className="flex items-center justify-center gap-2.5">
          <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
          <span>Uploading…</span>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2">
          <span>Continue</span>
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
        </div>
      )}
    </button>

    <button
      type="button"
      onClick={onCancel}
      className="px-5 py-3.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-neutral-400 text-sm font-light transition-all duration-300 hover:text-white hover:bg-white/[0.06] hover:border-white/15 active:scale-[0.98] cursor-pointer"
    >
      Cancel
    </button>
  </div>
);

// ─── Field label ──────────────────────────────────────────────────────────────
const FieldLabel = ({ icon: Icon, children }) => (
  <label className="flex items-center gap-2 text-neutral-400 text-xs font-medium uppercase tracking-widest mb-2.5 transition-colors group-focus-within:text-neutral-200">
    <Icon className="w-3.5 h-3.5" />
    {children}
  </label>
);

// ─── Main page ────────────────────────────────────────────────────────────────
export default function CV() {
  const {cvResult, setCvResult} = useGeminiStore();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [ result , setResult ] = useState(null);

  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // !For initial Loading of existing CV result if any
  useEffect(()=>{
    if(cvResult){
      setResult(cvResult)
      return ;
    }


    axios.get('/gemini/existing-cvResult')
      .then(res=>{
      const resultStatus = res.data?.user?.cvStatus || res.data?.user?.session?.cvStatus || null
      if(resultStatus === "reviewed"){
        const cvResponse = res?.data?.user?.session?.cvResult || res.data?.user?.cvResult || null
        setResult(cvResponse)
        setCvResult(cvResponse)
      }
    })
    .catch(err => {
      console.error('Failed to fetch existing CV result:', err);
    });
  },[cvResult, setCvResult])


  // *redirecting to result page if result is already there   
  if (result) return <Navigate to='/cv-result' />;


  const handleClearFile = () => {
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please upload your CV first 📄", {
        icon: "🙏",
        style: { background: "#1a1a1a", color: "#fff", border: "1px solid rgba(255,255,255,0.08)" },
      });
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("cv", file);

      const res = await axios.post('/gemini/evaluate-cv', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setResult(res.data?.user?.session?.cvResult || res.data?.user?.cvResult || null);

      toast.success("CV uploaded successfully! 🎉", {
        style: { background: "#1a1a1a", color: "#fff", border: "1px solid rgba(255,255,255,0.08)" },
      });
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.", {
        style: { background: "#1a1a1a", color: "#fff", border: "1px solid rgba(255,255,255,0.08)" },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[90dvh] flex items-center justify-center p-4 mt-16 relative overflow-hidden">
      <AmbientBackground />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md"
      >
        <AccentLine className="mb-8" />

        <PageHeader />

        <form onSubmit={handleSubmit} className="space-y-5" encType="multipart/form-data">
          {/* Upload field */}
          <div className="group space-y-2.5">
            <FieldLabel icon={Upload}>Resume / CV</FieldLabel>

            <AnimatePresence mode="wait">
              {file ? (
                <FileInfoBadge key="badge" file={file} onClear={handleClearFile} />
              ) : (
                <motion.div
                  key="dropzone"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                >
                  <DropZone onFile={setFile} inputRef={inputRef} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Format hint */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-neutral-600 text-xs font-light flex items-center gap-1.5"
          >
            <FileText className="w-3 h-3 flex-shrink-0" />
            We accept PDF format only for the best parsing accuracy.
          </motion.p>

          <FormActions isLoading={isLoading} onCancel={() => navigate(-1)} />
        </form>

        <AccentLine className="mt-8" />
      </motion.div>
    </div>
  );
}