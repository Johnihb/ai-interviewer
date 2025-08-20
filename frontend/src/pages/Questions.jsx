import React, { useEffect, useState } from 'react';
import { useGeminiStore } from '../stores/geminiStore';
import DataDisplayUI from '../components/DataDisplayUI';
import ServerErrorPage from '../components/ServerError';
import { HiOutlineDocumentText } from "react-icons/hi";
import { BiMessageSquareDetail } from "react-icons/bi";
import { MdSend } from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { toast } from "react-hot-toast";

const Questions = () => {
  const { question, loading, postAnswer, feedback, statusError, candidate } = useGeminiStore();
  const [answer, setAnswer] = useState({});

  // submit handler 
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate that all questions have answers
    const unansweredQuestions = question.filter((_, index) => {
      const answerKey = `Answer${index + 1}`;
      return !answer[answerKey] || answer[answerKey].trim() === '';
    });

    if (unansweredQuestions.length > 0) {
      toast.error(`Please answer all questions before submitting.`);
      return;
    }

    postAnswer(answer);
  };

  //  visibilitychange -> hidden & visible 
  // hidden - when user leaves the page 
  // visible - when user returns to the page 
  const handleBlur = () => {
    if(document.visibilityState === "hidden") {
      setTimeout(() => {
        (candidate.difficulty && candidate.difficulty === 'easy') 
          ? toast.error("hey you cheater you cheating", {
              autoClose: 5000,
              icon: "😂🤣"
            }) 
          : (candidate.difficulty === 'medium' 
              ? toast.error("Don't do that ! ok") 
              : postAnswer(answer)
            );
      }, 200);
    }
  };


  // visibility change handler 
  useEffect(() => {
    document.addEventListener("visibilitychange", handleBlur);
    return () => {
      document.removeEventListener("visibilitychange", handleBlur);
    };
  }, [answer]); // Added answer as dependency

  // input change handler 
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAnswer((prev) => ({ ...prev, [name]: value }));
  };

  // keydown handler 
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.ctrlKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };


  // error display 
  if (statusError === "Internal Server Error") return <ServerErrorPage />;

  // feedback display 
  if (feedback && feedback.length !== 0) {
    return <DataDisplayUI data={feedback} />;
  }


  // questions display 
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-black pt-20 pb-10 px-4">
      {/* Main Container */}
      <div className="max-w-4xl mx-auto relative">
        {/* Background Glow Effect */}
        <div className="absolute -inset-5 bg-gradient-radial from-cyan-500/5 via-cyan-500/5 to-transparent rounded-3xl pointer-events-none" />

        {/* Header Section */}
        <div className="text-center mb-10 relative z-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <HiOutlineDocumentText className="w-8 h-8 text-cyan-400 drop-shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-cyan-400 to-white bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(6,182,212,0.3)] mt-8">
              Assessment Questions
            </h1>
          </div>

          {/* Decorative Line */}
          <div className="w-20 h-0.5 mx-auto bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {/* Questions Container */}
          {question.map((quest, index) => (
            <div
              key={index}
              className="group relative p-6 bg-black/60 backdrop-blur-lg border border-cyan-500/20 rounded-2xl hover:border-cyan-400/40 hover:shadow-[0_8px_32px_rgba(6,182,212,0.1)] hover:-translate-y-0.5 transition-all duration-300"
            >
              {/* Question Number Badge */}
              <div className="absolute -top-3 left-6 px-3 py-1.5 bg-gradient-to-r from-cyan-400 to-blue-500 text-black text-sm font-bold rounded-full shadow-lg shadow-cyan-400/30">
                Question {index + 1}
              </div>

              {/* Question Text */}
              <div className="mb-5 pt-2">
                <label 
                  htmlFor={`Answer${index + 1}`}
                  className="text-white text-lg md:text-xl leading-relaxed font-medium drop-shadow-sm block cursor-pointer"
                >
                  {quest.slice(1,-1)}
                </label>
              </div>

              {/* Answer Textarea */}
              <div className="relative">
                <textarea
                  id={`Answer${index + 1}`}
                  value={answer[`Answer${index + 1}`] || ""}
                  name={`Answer${index + 1}`}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your answer here..."
                  required
                  className="w-full min-h-24 max-h-48 resize-y bg-black/40 backdrop-blur-sm border border-cyan-500/30 rounded-xl px-4 py-3 text-white text-base leading-relaxed placeholder-cyan-400/50 focus:outline-none focus:border-cyan-400/60 focus:shadow-[0_0_20px_rgba(6,182,212,0.2)] focus:bg-black/60 transition-all duration-300"
                />
                {/* Character Counter */}
                <div className="absolute bottom-2 right-3 text-xs text-cyan-400/60 pointer-events-none bg-black/70 px-2 py-1 rounded">
                  {answer[`Answer${index + 1}`]?.length || 0}
                </div>
              </div>
            </div>
          ))}

          {/* Submit Button */}
          <div className="flex justify-center pt-8">
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center gap-3 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 min-w-48 border border-cyan-400/50 ${
                loading
                  ? "bg-cyan-500/30 text-cyan-200 cursor-not-allowed opacity-70"
                  : "bg-gradient-to-r from-cyan-500 to-blue-600 text-black hover:from-cyan-400 hover:to-blue-500 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] active:scale-95"
              }`}
            >
              {loading ? (
                <>
                  <AiOutlineLoading3Quarters className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <MdSend className="w-5 h-5" />
                  Submit Answers
                </>
              )}
            </button>
          </div>
        </form>

        {/* Floating Particles */}
        <div className="absolute top-16 left-8 w-2 h-2 bg-cyan-400 rounded-full opacity-60 animate-bounce delay-0" />
        <div className="absolute top-32 right-12 w-1.5 h-1.5 bg-purple-400 rounded-full opacity-40 animate-bounce delay-1000" />
        <div className="absolute bottom-24 left-16 w-1 h-1 bg-blue-400 rounded-full opacity-50 animate-bounce delay-2000" />

        {/* Help Text */}
        <div className="text-center mt-8 text-cyan-400/60 text-sm">
          💡 Tip: Press{" "}
          <kbd className="px-2 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded text-xs font-mono">
            Ctrl + Enter
          </kbd>{" "}
          in any textarea to submit
        </div>
      </div>
    </div>
  );
};

export default Questions;