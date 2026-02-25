"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { playCorrect, playWrong, playPerfect, playVictory } from "@/lib/sounds";
import { useHighScore, getStars, GameOverScreen } from "@/lib/game-utils";

/* ─── Types ─── */
type Difficulty = "easy" | "medium" | "hard";
type Operator = "+" | "-" | "×" | "÷";

interface Problem {
  a: number;
  b: number;
  op: Operator;
  answer: number;
  display: string;
}

const GAME_DURATION = 60;

const DIFF_OPTIONS: { key: Difficulty; label: string; desc: string }[] = [
  { key: "easy", label: "初級", desc: "加減法（1-20）" },
  { key: "medium", label: "中級", desc: "加減乘（1-50）" },
  { key: "hard", label: "高級", desc: "四則運算（1-99）" },
];

function generateProblem(diff: Difficulty, streak: number): Problem {
  const ops: Operator[] =
    diff === "easy" ? ["+", "-"] :
    diff === "medium" ? ["+", "-", "×"] :
    ["+", "-", "×", "÷"];

  const op = ops[Math.floor(Math.random() * ops.length)];

  // Increase range slightly with streak
  const boost = Math.min(Math.floor(streak / 5), 3);
  const maxVal =
    diff === "easy" ? 20 + boost * 5 :
    diff === "medium" ? 50 + boost * 10 :
    99;

  let a: number, b: number, answer: number;

  switch (op) {
    case "+":
      a = Math.floor(Math.random() * maxVal) + 1;
      b = Math.floor(Math.random() * maxVal) + 1;
      answer = a + b;
      break;
    case "-":
      a = Math.floor(Math.random() * maxVal) + 1;
      b = Math.floor(Math.random() * a) + 1;
      answer = a - b;
      break;
    case "×":
      a = Math.floor(Math.random() * (diff === "hard" ? 15 : 12)) + 1;
      b = Math.floor(Math.random() * (diff === "hard" ? 15 : 12)) + 1;
      answer = a * b;
      break;
    case "÷":
      b = Math.floor(Math.random() * 12) + 1;
      answer = Math.floor(Math.random() * 12) + 1;
      a = b * answer;
      break;
    default:
      a = 1; b = 1; answer = 2;
  }

  return { a, b, op, answer, display: `${a} ${op} ${b} = ?` };
}

export default function MathRushPage() {
  const [mode, setMode] = useState<"menu" | "playing" | "done">("menu");
  const [diff, setDiff] = useState<Difficulty>("easy");
  const [problem, setProblem] = useState<Problem | null>(null);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [isNewHigh, setIsNewHigh] = useState(false);
  const { highScore, updateHighScore } = useHighScore("math-rush");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const streakRef = useRef(0);

  const endGame = useCallback((finalCorrect: number, finalWrong: number, finalBestStreak: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    const finalScore = Math.max(finalCorrect * 10 + finalBestStreak * 5 - finalWrong * 3, 0);
    setScore(finalScore);
    const newHigh = updateHighScore(finalScore);
    setIsNewHigh(newHigh);
    if (finalScore >= 300) playPerfect();
    else if (finalScore >= 150) playVictory();
    setMode("done");
  }, [updateHighScore]);

  const startGame = useCallback((d: Difficulty) => {
    setDiff(d);
    setInput("");
    setScore(0);
    setCorrect(0);
    setWrong(0);
    setStreak(0);
    setBestStreak(0);
    streakRef.current = 0;
    setTimeLeft(GAME_DURATION);
    setFeedback(null);
    setIsNewHigh(false);
    setProblem(generateProblem(d, 0));
    setMode("playing");

    if (timerRef.current) clearInterval(timerRef.current);
    let t = GAME_DURATION;
    timerRef.current = setInterval(() => {
      t--;
      setTimeLeft(t);
    }, 1000);

    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  // Watch for timer hitting 0
  useEffect(() => {
    if (timeLeft <= 0 && mode === "playing") {
      endGame(correct, wrong, bestStreak);
    }
  }, [timeLeft, mode, correct, wrong, bestStreak, endGame]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleSubmit = useCallback(() => {
    if (!problem || mode !== "playing") return;
    const parsed = parseInt(input, 10);
    if (isNaN(parsed)) return;

    if (parsed === problem.answer) {
      playCorrect();
      setCorrect(c => c + 1);
      const newStreak = streakRef.current + 1;
      streakRef.current = newStreak;
      setStreak(newStreak);
      setBestStreak(bs => Math.max(bs, newStreak));
      setFeedback("correct");
    } else {
      playWrong();
      setWrong(w => w + 1);
      streakRef.current = 0;
      setStreak(0);
      setFeedback("wrong");
    }

    setInput("");
    setProblem(generateProblem(diff, streakRef.current));
    setTimeout(() => {
      setFeedback(null);
      inputRef.current?.focus();
    }, 300);
  }, [problem, input, mode, diff]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  }, [handleSubmit]);

  /* ─── Menu ─── */
  if (mode === "menu") {
    return (
      <div className="max-w-lg mx-auto px-4 py-8 animate-fadeIn">
        <a href="/board-games" className="text-sm text-blue-500 hover:underline no-underline">← 返回桌遊專區</a>
        <div className="text-center mt-6 mb-8">
          <div className="text-5xl mb-3">🔢</div>
          <h1 className="text-2xl font-black text-slate-800 mb-2">數學衝刺</h1>
          <p className="text-slate-500 text-sm">限時 {GAME_DURATION} 秒，挑戰你的心算速度！</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-blue-200 shadow-sm mb-6">
          <h3 className="font-bold text-slate-700 mb-1">遊戲規則</h3>
          <ul className="text-sm text-slate-500 space-y-1 list-disc list-inside">
            <li>螢幕顯示數學算式，輸入答案</li>
            <li>答對得 10 分，連續答對有額外加分</li>
            <li>答錯扣 3 分，連續紀錄歸零</li>
            <li>難度會隨答對次數逐漸提升</li>
            <li>最高紀錄：{highScore} 分</li>
          </ul>
        </div>
        <div className="space-y-3">
          {DIFF_OPTIONS.map(d => (
            <button key={d.key} onClick={() => startGame(d.key)}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-left cursor-pointer border-none hover:opacity-90 transition">
              <div className="text-lg">{d.label}</div>
              <div className="text-xs opacity-80">{d.desc}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  /* ─── Done ─── */
  if (mode === "done") {
    const stars = getStars(score, 300);
    return (
      <div className="max-w-lg mx-auto px-4 py-8 animate-fadeIn">
        <a href="/board-games" className="text-sm text-blue-500 hover:underline no-underline">← 返回桌遊專區</a>
        <div className="text-center text-sm text-slate-500 mt-4 mb-2">
          正確 {correct} 題 ・ 錯誤 {wrong} 題 ・ 最長連續 {bestStreak}
        </div>
        <GameOverScreen
          score={score} maxScore={300} gameName="數學衝刺" stars={stars}
          highScore={Math.max(highScore, score)} isNewHigh={isNewHigh}
          onRestart={() => startGame(diff)} onBack={() => setMode("menu")}
        />
      </div>
    );
  }

  /* ─── Playing ─── */
  return (
    <div className="max-w-lg mx-auto px-4 py-8 animate-fadeIn">
      <a href="/board-games" className="text-sm text-blue-500 hover:underline no-underline">← 返回桌遊專區</a>

      {/* Header */}
      <div className="flex justify-between items-center mt-4 mb-4">
        <div className="text-sm text-slate-500">⏱ {timeLeft}s</div>
        <div className="text-sm text-slate-500">🔥 連續 {streak}</div>
        <div className="text-sm font-bold text-blue-600">✅ {correct} ❌ {wrong}</div>
      </div>

      {/* Timer bar */}
      <div className="w-full h-2 bg-slate-200 rounded-full mb-6 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full transition-all duration-1000"
          style={{ width: `${(timeLeft / GAME_DURATION) * 100}%` }} />
      </div>

      {/* Problem */}
      {problem && (
        <div className={`bg-white rounded-2xl p-8 border shadow-sm mb-6 text-center transition-all
          ${feedback === "correct" ? "border-green-300 bg-green-50" : feedback === "wrong" ? "border-red-300 bg-red-50" : "border-blue-200"}
        `}>
          <div className="text-xs text-slate-400 mb-2">計算答案</div>
          <div className="text-4xl sm:text-5xl font-black text-slate-800 font-mono">
            {problem.display}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="flex gap-3 mb-4">
        <input
          ref={inputRef}
          type="number"
          inputMode="numeric"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="輸入答案..."
          className="flex-1 px-4 py-4 text-2xl font-bold text-center rounded-xl border-2 border-blue-200 focus:border-blue-500 focus:outline-none transition"
          autoFocus
        />
        <button onClick={handleSubmit}
          className="px-6 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-lg cursor-pointer border-none hover:opacity-90 transition active:scale-95">
          確認
        </button>
      </div>

      {/* Numpad for mobile */}
      <div className="grid grid-cols-3 gap-2 max-w-[280px] mx-auto sm:hidden">
        {[1,2,3,4,5,6,7,8,9].map(n => (
          <button key={n} onClick={() => { setInput(prev => prev + n); inputRef.current?.focus(); }}
            className="py-3 rounded-xl bg-slate-100 text-slate-800 font-bold text-xl cursor-pointer border border-slate-200 active:bg-slate-200 transition">
            {n}
          </button>
        ))}
        <button onClick={() => { setInput(prev => "-" + prev.replace("-", "")); inputRef.current?.focus(); }}
          className="py-3 rounded-xl bg-slate-100 text-slate-800 font-bold text-xl cursor-pointer border border-slate-200 active:bg-slate-200 transition">
          ±
        </button>
        <button onClick={() => { setInput(prev => prev + "0"); inputRef.current?.focus(); }}
          className="py-3 rounded-xl bg-slate-100 text-slate-800 font-bold text-xl cursor-pointer border border-slate-200 active:bg-slate-200 transition">
          0
        </button>
        <button onClick={() => { setInput(prev => prev.slice(0, -1)); inputRef.current?.focus(); }}
          className="py-3 rounded-xl bg-red-100 text-red-600 font-bold text-xl cursor-pointer border border-red-200 active:bg-red-200 transition">
          ⌫
        </button>
      </div>
    </div>
  );
}
