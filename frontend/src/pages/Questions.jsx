import React, { useEffect, useState } from 'react';
import { useGeminiStore } from '../stores/geminiStore';
import DataDisplayUI from '../components/DataDisplayUI';
import ServerErrorPage from '../components/ServerError';
import { FileText, Send, Loader2, Clock, ChevronDown } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'react-hot-toast';

const Questions = () => {
  const { questions, loading, postAnswer, feedback, statusError, candidate } = useGeminiStore();
  const [answer, setAnswer] = useState({});
  const [activeQuestion, setActiveQuestion] = useState(null);

  // submit handler 
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate that all questions have answers
    const unansweredQuestions = questions

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
        (candidate.difficulty && candidate.difficulty === 'easy') 
          ? toast.error("hey you cheater you cheating", {
              autoClose: 5000,
              icon: "😂🤣"
            }) 
          : (candidate.difficulty === 'medium' 
              ? toast.error("Don't do that ! ok") 
              : postAnswer(answer)
            );
    }
  };


  // visibility change handler 
  useEffect(() => {
    document.addEventListener("visibilitychange", handleBlur);
    return () => {
      document.removeEventListener("visibilitychange", handleBlur);
    };
  }, [document.visibilityState]);

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

  // Calculate progress
  const answeredCount = Object.values(answer).filter(a => a && a.trim().length > 0).length;
  const totalCount = questions.length;

  // error display 
  if (statusError === "Internal Server Error") return <ServerErrorPage />;

  // feedback display 
  if (feedback && feedback.length !== 0) {
    return <DataDisplayUI data={feedback} />;
  }

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
        className="w-full max-w-2xl"
      >
        {/* Top accent line */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-neutral-500 to-transparent mb-8" />

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-8 space-y-3"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/5 border border-white/10 mb-2">
            <FileText className="w-5 h-5 text-neutral-300" />
          </div>
          <h1 className="text-2xl font-light tracking-tight text-white">
            Assessment Sheet
          </h1>
          <p className="text-neutral-500 text-sm font-light">
            Answer each question carefully · {totalCount} question{totalCount !== 1 ? 's' : ''}
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0.8 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-neutral-500 text-xs font-light uppercase tracking-widest">Progress</span>
            <span className="text-neutral-400 text-xs font-light">
              {answeredCount} / {totalCount}
            </span>
          </div>
          <div className="h-px w-full bg-white/[0.08] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white/40 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: totalCount > 0 ? `${(answeredCount / totalCount) * 100}%` : '0%' }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </motion.div>

        {/* Paper / Form Container */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            {questions.map((quest, index) => {
              const questionText = typeof quest === 'string' ? quest : quest.question;
              const questionType = typeof quest === 'object' ? quest.type : null;
              const isFocused = activeQuestion === index;
              const hasAnswer = answer[`Answer${index + 1}`]?.trim().length > 0;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: 0.3 + index * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={`relative bg-white/[0.03] border rounded-xl transition-all duration-300 ${
                    isFocused
                      ? 'border-white/20 bg-white/[0.05] shadow-[0_0_30px_rgba(255,255,255,0.04)]'
                      : hasAnswer
                        ? 'border-white/[0.12] bg-white/[0.04]'
                        : 'border-white/[0.08]'
                  }`}
                >
                  {/* Question Header */}
                  <div className="px-5 pt-5 pb-3">
                    <div className="flex items-start gap-3">
                      {/* Number */}
                      <div className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-medium transition-all duration-300 ${
                        isFocused
                          ? 'bg-white text-black'
                          : hasAnswer
                            ? 'bg-white/15 text-white/80'
                            : 'bg-white/[0.06] text-neutral-500 border border-white/[0.08]'
                      }`}>
                        {hasAnswer ? '✓' : index + 1}
                      </div>

                      {/* Question Text + Type */}
                      <div className="flex-1 min-w-0">
                        {questionType && (
                          <span className="inline-block text-[10px] font-medium uppercase tracking-widest text-neutral-500 mb-1.5">
                            {questionType}
                          </span>
                        )}
                        <label
                          htmlFor={`Answer${index + 1}`}
                          className="block text-white/90 text-sm leading-relaxed font-light cursor-pointer"
                        >
                          {questionText}
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="mx-5 h-px bg-white/[0.5]" />

                  {/* Answer Area */}
                  <div className="p-5 pt-4 relative">
                    <textarea
                      id={`Answer${index + 1}`}
                      value={answer[`Answer${index + 1}`] || ""}
                      name={`Answer${index + 1}`}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      onFocus={() => setActiveQuestion(index)}
                      onBlur={() => setActiveQuestion(null)}
                      placeholder="Write your answer here..."
                      required
                      rows={4}
                      className="w-full bg-transparent text-white/80 text-sm leading-relaxed placeholder-neutral-400 focus:outline-none resize-none font-light question-textarea"
                    />
                    {/* Character count */}
                    <div className="flex items-center justify-end mt-1">
                      <span className="text-neutral-600 text-[10px] font-light tabular-nums">
                        {answer[`Answer${index + 1}`]?.length || 0} chars
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Submit Area */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 + questions.length * 0.08 + 0.1 }}
            className="mt-8 space-y-4"
          >
            <button
              type="submit"
              disabled={loading}
              className="group/btn w-full relative bg-white text-black text-sm font-medium py-3.5 px-4 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.08)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none cursor-pointer"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2.5">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Evaluating...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Submit Answers</span>
                  <Send className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-0.5" />
                </div>
              )}
            </button>

            {/* Hint */}
            <p className="text-center text-neutral-600 text-xs font-light">
              Press{' '}
              <kbd className="px-1.5 py-0.5 bg-white/[0.04] border border-white/[0.08] rounded text-[10px] font-mono text-neutral-400">
                Ctrl + Enter
              </kbd>{' '}
              to submit
            </p>
          </motion.div>
        </form>

        {/* Bottom accent line */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-neutral-700 to-transparent mt-8" />
      </motion.div>
    </div>
  );
};

export default Questions;