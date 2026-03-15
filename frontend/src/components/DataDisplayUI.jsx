import React, { useState, useEffect, useRef } from 'react';
import {
  Award, TrendingUp, TrendingDown, Star, ChevronDown, ChevronUp,
  Lightbulb, CheckCircle, XCircle, AlertTriangle, Zap, BarChart2
} from 'lucide-react';
import { useGeminiStore } from '../stores/geminiStore';

/* ─── tiny helpers ─────────────────────────────────────────────────────────── */
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

function scoreColor(score, max = 10) {
  const pct = score / max;
  if (pct >= 0.75) return { text: 'text-emerald-400', bar: 'from-emerald-500 to-teal-400', label: 'Strong', bg: 'bg-emerald-400/10 border-emerald-500/20' };
  if (pct >= 0.5)  return { text: 'text-amber-400',   bar: 'from-amber-500 to-yellow-400', label: 'Fair',   bg: 'bg-amber-400/10 border-amber-500/20'   };
  return               { text: 'text-rose-400',    bar: 'from-rose-500 to-red-400',    label: 'Weak',   bg: 'bg-rose-400/10 border-rose-500/20'    };
}

function recommendationColor(rec = '') {
  if (/hire/i.test(rec) && !/no/i.test(rec)) return { text: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-500/30' };
  if (/consider/i.test(rec))                 return { text: 'text-amber-400',   bg: 'bg-amber-400/10 border-amber-500/30'    };
  return                                            { text: 'text-rose-400',    bg: 'bg-rose-400/10 border-rose-500/30'      };
}

/* ─── animated score ring ───────────────────────────────────────────────────── */
const ringColors = (score, max) => {
  const pct = score / max;
  if (pct >= 0.75) return { c1: '#10b981', c2: '#2dd4bf', text: 'text-emerald-400' }; // emerald → teal
  if (pct >= 0.5)  return { c1: '#f59e0b', c2: '#facc15', text: 'text-amber-400'   }; // amber → yellow
  return                  { c1: '#f43f5e', c2: '#ef4444', text: 'text-rose-400'    }; // rose → red
};

function ScoreRing({ score, max = 10, size = 110, stroke = 8 }) {
  const [displayed, setDisplayed] = useState(0);
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const pct = clamp(score / max, 0, 1);
  const { c1, c2, text } = ringColors(score, max);

  useEffect(() => {
    let frame;
    const start = performance.now();
    const dur = 1200;
    const animate = (now) => {
      const t = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - t, 3);
      setDisplayed(ease * score);
      if (t < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#ffffff0a" strokeWidth={stroke} />
        <circle
          cx={size/2} cy={size/2} r={r} fill="none"
          strokeWidth={stroke} strokeLinecap="round"
          stroke="url(#ring-grad)"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - pct)}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.34,1.56,0.64,1)' }}
        />
        <defs>
          <linearGradient id="ring-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={c1} />
            <stop offset="100%" stopColor={c2} />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`text-2xl font-bold ${text}`}>{displayed.toFixed(1)}</span>
        <span className="text-neutral-500 text-xs">/ {max}</span>
      </div>
    </div>
  );
}

/* ─── mini horizontal bar ───────────────────────────────────────────────────── */
function MiniBar({ score, max = 10 }) {
  const [width, setWidth] = useState(0);
  const pct = clamp((score / max) * 100, 0, 100);
  const { bar } = scoreColor(score, max);

  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 100);
    return () => clearTimeout(t);
  }, [pct]);

  return (
    <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
      <div
        className={`h-full rounded-full bg-gradient-to-r ${bar} transition-all duration-1000 ease-out`}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}

/* ─── question card ─────────────────────────────────────────────────────────── */
function QuestionCard({ result, index, questions }) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef(null);
  const { text, label, bg } = scoreColor(result.score);
  // questions[] items are objects like { id, type, question, _id }
  const questionObj = questions?.[index];
  const question = typeof questionObj === 'string' ? questionObj : questionObj?.question ?? null;

  const rows = [
    { icon: <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />, label: 'What was good',    value: result.what_was_good,    color: 'text-emerald-300' },
    { icon: <XCircle     className="w-3.5 h-3.5 text-rose-400    shrink-0 mt-0.5" />, label: 'What was missing', value: result.what_was_missing, color: 'text-rose-300'    },
    { icon: <Lightbulb   className="w-3.5 h-3.5 text-amber-400   shrink-0 mt-0.5" />, label: 'Tip',              value: result.tip,              color: 'text-amber-300'   },
  ].filter(r => r.value);

  return (
    <div
      className="group rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-4 p-4 text-left"
      >
        {/* index bubble */}
        <div className="shrink-0 w-8 h-8 rounded-full bg-white/5 border border-white/8 flex items-center justify-center text-xs font-medium text-neutral-400">
          {index + 1}
        </div>

        {/* question text */}
        <div className="flex-1 min-w-0">
          {question && (
            <p className="text-neutral-200 text-sm font-light leading-snug line-clamp-2">
              {question}
            </p>
          )}
          {!question && (
            <p className="text-neutral-400 text-sm font-light">Question {index + 1}</p>
          )}
          <MiniBar score={result.score} />
        </div>

        {/* score badge */}
        <div className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${bg} ${text}`}>
          <Star className="w-3 h-3" />
          {result.score}
          <span className="text-neutral-500 font-light">/ 10</span>
        </div>

        {/* chevron */}
        <div className="shrink-0 text-neutral-600 group-hover:text-neutral-400 transition-colors duration-200">
          {open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* expandable body */}
      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: open ? `${contentRef.current?.scrollHeight || 400}px` : '0px', opacity: open ? 1 : 0 }}
      >
        {rows.length > 0 ? (
          <div className="px-4 pb-4 space-y-3 border-t border-white/[0.04] pt-4">
            {rows.map((row, i) => (
              <div key={i} className="flex gap-3 text-sm">
                {row.icon}
                <div>
                  <span className="text-neutral-500 text-xs uppercase tracking-widest font-medium block mb-0.5">{row.label}</span>
                  <span className={`leading-relaxed font-light ${row.color}`}>{row.value}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-4 pb-4 pt-3 border-t border-white/[0.04]">
            <p className="text-neutral-500 text-sm font-light">No detailed feedback for this question.</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── main component ─────────────────────────────────────────────────────────── */
export default function DataDisplayUI({ data }) {
  const { feedback, questions } = useGeminiStore();

  const source = feedback || data;

  /* Normalise to { results, overall } */
  let results = [];
  let overall = null;

  if (source && typeof source === 'object' && !Array.isArray(source)) {
    results = Array.isArray(source.results) ? source.results : [];
    overall = source.overall || null;
  }

  const hasData = results.length > 0 || overall;

  const rec      = overall?.recommendation || '';
  const recStyle = recommendationColor(rec);
  const ovScore  = overall?.score ?? 0;

  if (!hasData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 mt-16">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
            <BarChart2 className="w-7 h-7 text-neutral-500" />
          </div>
          <h2 className="text-lg font-light text-neutral-300">No Results Yet</h2>
          <p className="text-sm text-neutral-600 font-light">Submit your answers to see your interview feedback here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 mt-16">
      <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">

        {/* ── top accent */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-neutral-700 to-transparent" />

        {/* ── page title */}
        <div className="text-center space-y-1 pb-2">
          <h1 className="text-2xl font-light tracking-tight text-white">Interview Results</h1>
          <p className="text-neutral-500 text-sm font-light">Detailed breakdown of your performance</p>
        </div>

        {/* ── overall card */}
        {overall && (
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] backdrop-blur-sm p-6 space-y-6">
            {/* score row */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="flex flex-col items-center gap-2">
                <ScoreRing score={ovScore} />
                <span className="text-xs text-neutral-500 font-light uppercase tracking-widest">Overall Score</span>
              </div>

              <div className="flex-1 space-y-4">
                {/* recommendation pill */}
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium ${recStyle.text} ${recStyle.bg}`}>
                  <Zap className="w-3.5 h-3.5" />
                  {rec || 'Pending'}
                </div>

                {/* summary */}
                {overall.summary && (
                  <p className="text-neutral-300 text-sm font-light leading-relaxed">
                    {overall.summary}
                  </p>
                )}

                {/* strength / weakness */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {overall.top_strength && (
                    <div className="flex gap-2.5 p-3 rounded-xl bg-emerald-400/5 border border-emerald-500/15">
                      <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] uppercase tracking-widest text-emerald-500/70 font-medium block mb-0.5">Top Strength</span>
                        <span className="text-emerald-300 text-xs font-light leading-relaxed">{overall.top_strength}</span>
                      </div>
                    </div>
                  )}
                  {overall.top_weakness && (
                    <div className="flex gap-2.5 p-3 rounded-xl bg-rose-400/5 border border-rose-500/15">
                      <TrendingDown className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[10px] uppercase tracking-widest text-rose-500/70 font-medium block mb-0.5">Top Weakness</span>
                        <span className="text-rose-300 text-xs font-light leading-relaxed">{overall.top_weakness}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* quick stats row */}
            {results.length > 0 && (
              <>
                <div className="h-px bg-white/[0.05]" />
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Questions', value: results.length },
                    { label: 'Avg Score',  value: (results.reduce((a, r) => a + r.score, 0) / results.length).toFixed(1) },
                    { label: 'Verdict',    value: rec || '—' },
                  ].map((s, i) => (
                    <div key={i} className="text-center space-y-0.5">
                      <div className="text-lg font-light text-white">{s.value}</div>
                      <div className="text-[11px] text-neutral-500 uppercase tracking-widest">{s.label}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── per-question section */}
        {results.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-white/[0.05]" />
              <span className="text-[11px] text-neutral-500 uppercase tracking-widest font-medium">Per Question</span>
              <div className="h-px flex-1 bg-white/[0.05]" />
            </div>

            <div className="space-y-2">
              {results.map((result, i) => (
                <QuestionCard
                  key={result.questionId ?? i}
                  result={result}
                  index={i}
                  questions={questions}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── bottom accent */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-neutral-800 to-transparent" />
        <p className="text-center text-[11px] text-neutral-600 font-light pb-4">
          Powered by AI — results are indicative, not definitive
        </p>

      </div>
    </div>
  );
}