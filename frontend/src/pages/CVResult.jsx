import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FileText,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  ChevronDown,
  CheckCircle2,
  Star,
  BarChart2,
  RefreshCw,
} from "lucide-react";

// ---------------------------------------------------------------------------
// Parser: converts the raw AI string into a structured object.
// Uses a line-by-line state machine so it never misses bullets.
// ---------------------------------------------------------------------------
function parseCVString(raw) {
  if (!raw || typeof raw !== "string") return null;

  // 1. Overall score
  const overallMatch = raw.match(
    /OVERALL\s+SCORE\s*:\s*(\d+(?:\.\d+)?)\s*\/\s*(\d+)/i
  );
  const overallScore = overallMatch ? parseFloat(overallMatch[1]) : 0;

  // 2. Identify which section a heading line belongs to
  function detectSection(line) {
    const stripped = line
      .replace(/[*_:#]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .toUpperCase();

    if (stripped === "SECTION SCORES" || stripped === "SECTION SCORE")
      return "sectionScores";
    if (stripped === "STRENGTHS" || stripped === "STRENGTH")
      return "strengths";
    if (stripped === "WEAKNESSES" || stripped === "WEAKNESS")
      return "weaknesses";
    if (
      stripped === "SUGGESTIONS FOR IMPROVEMENT" ||
      stripped === "SUGGESTIONS" ||
      stripped === "SUGGESTION"
    )
      return "suggestions";
    if (stripped === "OVERALL SCORE") return "__skip__";
    return null;
  }

  // 3. Walk line by line
  const buckets = {
    sectionScores: [],
    strengths: [],
    weaknesses: [],
    suggestions: [],
  };

  const lines = raw.split(/\r?\n/);
  let current = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    // Does the line look like a section heading?
    // A heading is a line that, after stripping markdown/punctuation,
    // matches one of our known section names.
    // Heuristic: no lowercase letters (or it's one of the known phrases)
    const sec = detectSection(line);
    if (sec !== null) {
      current = sec === "__skip__" ? null : sec;
      continue;
    }

    if (!current) continue;

    // Strip common prefix decorators: bullets, numbers, bold markers
    const clean = line
      .replace(/^\*\*(.+?)\*\*\s*:?/, "$1:")  // **Bold:** -> Bold:
      .replace(/^[-*\u2022]\s+/, "")           // - or * or bullet
      .replace(/^\d+[.)]\s+/, "")              // 1. or 1)
      .trim();

    if (!clean || clean.length < 4) continue;

    if (current === "sectionScores") {
      // Must be "Label: score/outOf"
      const m = clean.match(/^(.+?)\s*:\s*(\d+(?:\.\d+)?)\s*\/\s*(\d+)/);
      if (m) {
        buckets.sectionScores.push({
          label: m[1].trim(),
          score: parseFloat(m[2]),
          outOf: parseFloat(m[3]),
        });
      }
    } else {
      buckets[current].push(clean);
    }
  }

  return {
    overallScore,
    sectionScores: buckets.sectionScores,
    strengths: buckets.strengths,
    weaknesses: buckets.weaknesses,
    suggestions: buckets.suggestions,
  };
}

// ---------------------------------------------------------------------------
// Color helpers
// ---------------------------------------------------------------------------
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

function scoreColor(score, max = 10) {
  const pct = score / max;
  if (pct >= 0.75)
    return {
      text: "text-emerald-400",
      bar: "from-emerald-500 to-teal-400",
      label: "Strong",
      bg: "bg-emerald-400/10 border-emerald-500/20",
      dot: "bg-emerald-400",
      ring1: "#10b981",
      ring2: "#2dd4bf",
    };
  if (pct >= 0.5)
    return {
      text: "text-amber-400",
      bar: "from-amber-500 to-yellow-400",
      label: "Fair",
      bg: "bg-amber-400/10 border-amber-500/20",
      dot: "bg-amber-400",
      ring1: "#f59e0b",
      ring2: "#facc15",
    };
  return {
    text: "text-rose-400",
    bar: "from-rose-500 to-red-400",
    label: "Weak",
    bg: "bg-rose-400/10 border-rose-500/20",
    dot: "bg-rose-400",
    ring1: "#f43f5e",
    ring2: "#ef4444",
  };
}

function getVerdict(score, max = 10) {
  const pct = score / max;
  if (pct >= 0.75) return "Great Work — Keep Polishing";
  if (pct >= 0.5) return "Decent Start — Room to Grow";
  return "Needs Significant Improvement";
}

// ---------------------------------------------------------------------------
// Shared sub-components
// ---------------------------------------------------------------------------

const AmbientBackground = () => (
  <div className="fixed inset-0 -z-10 pointer-events-none">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.03)_0%,_transparent_60%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(16,185,129,0.03)_0%,_transparent_50%)]" />
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(244,63,94,0.03)_0%,_transparent_50%)]" />
  </div>
);

const AccentLine = ({ className = "" }) => (
  <div
    className={`h-px w-full bg-gradient-to-r from-transparent via-neutral-600 to-transparent ${className}`}
  />
);

const CircularScore = ({ score, outOf = 10 }) => {
  const [displayed, setDisplayed] = useState(0);
  const { ring1, ring2, text } = scoreColor(score, outOf);
  const size = 140;
  const stroke = 8;
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const pct = clamp(score / outOf, 0, 1);
  const gradId = `cv-ring-${score}-${outOf}`;

  useEffect(() => {
    let frame;
    const start = performance.now();
    const dur = 1200;
    const tick = (now) => {
      const t = Math.min((now - start) / dur, 1);
      setDisplayed((1 - Math.pow(1 - t, 3)) * score);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [score]);

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" stroke="#ffffff0a" strokeWidth={stroke}
        />
        <circle
          cx={size / 2} cy={size / 2} r={r}
          fill="none" strokeWidth={stroke} strokeLinecap="round"
          stroke={`url(#${gradId})`}
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - pct)}
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.34,1.56,0.64,1)" }}
        />
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={ring1} />
            <stop offset="100%" stopColor={ring2} />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={`text-3xl font-bold ${text}`}>{displayed.toFixed(1)}</span>
        <span className="text-neutral-500 text-xs mt-0.5">/ {outOf}</span>
      </div>
    </div>
  );
};

const SectionScoreBar = ({ label, score, outOf, delay = 0 }) => {
  const [width, setWidth] = useState(0);
  const pct = clamp((score / outOf) * 100, 0, 100);
  const { text, bar, bg, label: scoreLabel } = scoreColor(score, outOf);

  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), delay + 100);
    return () => clearTimeout(t);
  }, [pct, delay]);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-neutral-400 text-xs font-light tracking-wide">{label}</span>
        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${bg} ${text}`}>
            {scoreLabel}
          </span>
          <span className={`text-xs font-semibold ${text}`}>
            {score}<span className="text-neutral-600 font-light">/{outOf}</span>
          </span>
        </div>
      </div>
      <div className="h-1.5 w-full rounded-full bg-white/[0.05] overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${bar} transition-all duration-1000 ease-out`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
};

const DetailCard = ({
  icon: Icon,
  title,
  items,
  cardStyle,
  dotColor,
  defaultOpen = false,
  delay = 0,
}) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`rounded-2xl border overflow-hidden backdrop-blur-sm ${cardStyle}`}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 cursor-pointer transition-colors duration-200 hover:bg-white/[0.025]"
      >
        <div className="flex items-center gap-3">
          <Icon className="w-4 h-4" />
          <span className="text-white text-sm font-light tracking-wide">{title}</span>
          <span className="text-neutral-600 text-xs bg-white/[0.04] border border-white/[0.07] rounded-full px-2 py-0.5">
            {items.length}
          </span>
        </div>
        <ChevronDown
          className="w-4 h-4 text-neutral-500 transition-transform duration-300"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 space-y-3 border-t border-white/[0.05] pt-4">
              {items.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.3, ease: "easeOut" }}
                  className="flex items-start gap-3"
                >
                  <div className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColor}`} />
                  <p className="text-neutral-300 text-xs font-light leading-relaxed">{item}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const EmptyState = () => (
  <div className="min-h-screen flex items-center justify-center p-6">
    <div className="text-center space-y-4">
      <div className="w-16 h-16 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
        <FileText className="w-7 h-7 text-neutral-500" />
      </div>
      <h2 className="text-lg font-light text-neutral-300">No Results Yet</h2>
      <p className="text-sm text-neutral-600 font-light max-w-xs mx-auto">
        Upload your CV to receive a detailed analysis report.
      </p>
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// Main page
// ---------------------------------------------------------------------------
export default function CVResult({ data}) {
  const parsed =
    typeof data === "string"
      ? parseCVString(data)
      : data && typeof data === "object"
      ? data
      : null;

  if (!parsed) return <EmptyState />;

  const {
    overallScore = 0,
    sectionScores = [],
    strengths = [],
    weaknesses = [],
    suggestions = [],
  } = parsed;

  const overallStyle = scoreColor(overallScore, 10);
  const verdict = getVerdict(overallScore, 10);

  return (
    <div className="min-h-screen relative overflow-hidden py-20 px-4">
      <AmbientBackground />

      <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
        <AccentLine />

        {/* Page Header */}
        <div className="text-center space-y-2 pb-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/[0.09] mb-2">
            <FileText className="w-5 h-5 text-neutral-300" />
          </div>
          <h1 className="text-2xl font-light tracking-tight text-white">CV Analysis Report</h1>
          <p className="text-neutral-500 text-sm font-light">
            Here's a detailed assessment of your resume
          </p>
        </div>

        {/* Overall Score Card */}
        <div className="flex flex-col sm:flex-row items-center gap-8 px-8 py-8 rounded-2xl border border-white/[0.07] bg-white/[0.025] backdrop-blur-sm">
          <div className="flex flex-col items-center gap-2">
            <CircularScore score={overallScore} outOf={10} />
            <span className="text-xs text-neutral-500 font-light uppercase tracking-widest">
              Overall Score
            </span>
          </div>

          <div className="flex-1 space-y-3 text-center sm:text-left">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium ${overallStyle.text} ${overallStyle.bg}`}
            >
              <Star className="w-3.5 h-3.5" />
              {overallStyle.label} — {verdict}
            </div>
            <p className="text-neutral-400 text-xs font-light leading-relaxed max-w-xs">
              {overallScore >= 7
                ? "Your CV is strong. A few refinements can push you to the top of the pile."
                : overallScore >= 5
                ? "There's a decent foundation here. Focus on the weaknesses below to level up."
                : "Your CV needs significant improvements across multiple sections. Focus on the suggestions below to strengthen your application."}
            </p>
          </div>

          {/* Stat chips */}
          <div className="flex sm:flex-col gap-3">
            <div className="flex flex-col items-center px-4 py-2.5 rounded-xl border border-emerald-500/15">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 mb-1" />
              <span className="text-white text-sm font-semibold">{strengths.length}</span>
              <span className="text-neutral-600 text-[10px] tracking-wide">Strengths</span>
            </div>
            <div className="flex flex-col items-center px-4 py-2.5 rounded-xl border border-rose-500/15">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 mb-1" />
              <span className="text-white text-sm font-semibold">{weaknesses.length}</span>
              <span className="text-neutral-600 text-[10px] tracking-wide">Weaknesses</span>
            </div>
            <div className="flex flex-col items-center px-4 py-2.5 rounded-xl border border-amber-500/15">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400 mb-1" />
              <span className="text-white text-sm font-semibold">{suggestions.length}</span>
              <span className="text-neutral-600 text-[10px] tracking-wide">Tips</span>
            </div>
          </div>
        </div>

        {/* Section Scores */}
        {sectionScores.length > 0 && (
          <div className="px-6 py-6 rounded-2xl border border-white/[0.07] bg-white/[0.025] backdrop-blur-sm space-y-5">
            <div className="flex items-center gap-2 mb-1">
              <BarChart2 className="w-3.5 h-3.5 text-neutral-500" />
              <p className="text-neutral-400 text-xs uppercase tracking-widest font-medium">
                Section Breakdown
              </p>
            </div>
            {sectionScores.map(({ label, score, outOf }, i) => (
              <SectionScoreBar key={label} label={label} score={score} outOf={outOf} delay={i * 120} />
            ))}
          </div>
        )}

        {/* Detail Cards */}
        <div className="space-y-3">
          {strengths.length > 0 && (
            <DetailCard
              icon={CheckCircle2}
              title="Strengths"
              items={strengths}
              cardStyle="bg-emerald-400/[0.04] border-emerald-500/20 text-emerald-400"
              dotColor="bg-emerald-400"
              defaultOpen={true}
              delay={0}
            />
          )}
          {weaknesses.length > 0 && (
            <DetailCard
              icon={AlertTriangle}
              title="Weaknesses"
              items={weaknesses}
              cardStyle="bg-rose-400/[0.04] border-rose-500/20 text-rose-400"
              dotColor="bg-rose-400"
              defaultOpen={false}
              delay={0.08}
            />
          )}
          {suggestions.length > 0 && (
            <DetailCard
              icon={Lightbulb}
              title="Suggestions for Improvement"
              items={suggestions}
              cardStyle="bg-amber-400/[0.04] border-amber-500/20 text-amber-400"
              dotColor="bg-amber-400"
              defaultOpen={false}
              delay={0.16}
            />
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button className="group/btn flex-1 bg-white text-black text-sm font-medium py-3.5 px-4 rounded-xl transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.08)] hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2">
            <TrendingUp className="w-4 h-4 transition-transform duration-300 group-hover/btn:scale-110" />
            Continue to Interview Prep
          </button>
          
        </div>

        <AccentLine />
      </div>
    </div>
  );
}