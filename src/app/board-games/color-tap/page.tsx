"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { playCorrect, playWrong, playPerfect, playVictory } from "@/lib/sounds";
import { useHighScore, getStars, GameOverScreen, shuffle } from "@/lib/game-utils";

/* ─── Color Definitions ─── */
interface ColorDef {
  name: string;    // Chinese name displayed
  tw: string;      // Tailwind text class for INK color
  value: string;   // identifier
}

const COLOR_DEFS: ColorDef[] = [
  { name: "紅色", tw: "text-red-500", value: "red" },
  { name: "藍色", tw: "text-blue-500", value: "blue" },
  { name: "綠色", tw: "text-green-500", value: "green" },
  { name: "黃色", tw: "text-yellow-500", value: "yellow" },
];

const BUTTON_STYLES: Record<string, string> = {
  red: "bg-red-500 hover:bg-red-600",
  blue: "bg-blue-500 hover:bg-blue-600",
  green: "bg-green-500 hover:bg-green-600",
  yellow: "bg-yellow-400 hover:bg-yellow-500",
};

interface Challenge {
  word: string;       // The text displayed (e.g., "紅色")
  inkColor: string;   // The actual ink color value
  inkTw: string;      // Tailwind class for the ink
}

function generateChallenge(): Challenge {
  const wordColor = COLOR_DEFS[Math.floor(Math.random() * COLOR_DEFS.length)];
  let inkColor = COLOR_DEFS[Math.floor(Math.random() * COLOR_DEFS.length)];
  // Ensure word and ink are different for Stroop effect (80% of the time)
  if (Math.random() > 0.2) {
    while (inkColor.value === wordColor.value) {
      inkColor = COLOR_DEFS[Math.floor(Math.random() * COLOR_DEFS.length)];
    }
  }
  return { word: wordColor.name, inkColor: inkColor.value, inkTw: inkColor.tw };
}

const GAME_DURATION = 30;

export default function ColorTapPage() {
  const [mode, setMode] = useState<"menu" | "playing" | "done">("menu");
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [isNewHigh, setIsNewHigh] = useState(false);
  const { highScore, updateHighScore } = useHighScore("color-tap");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const gameActiveRef = useRef(false);

  const endGame = useCallback(() => {
    gameActiveRef.current = false;
    if (timerRef.current) clearInterval(timerRef.current);
    // score is calculated from correct/wrong at this point
    const finalScore = correct * 10 + maxCombo * 5 - wrong * 3;
    const adjustedScore = Math.max(finalScore, 0);
    const newHigh = updateHighScore(adjustedScore);
    setIsNewHigh(newHigh);
    setScore(adjustedScore);
    if (adjustedScore >= 200) playPerfect();
    else if (adjustedScore >= 100) playVictory();
    setMode("done");
  }, [correct, wrong, maxCombo, updateHighScore]);

  const startGame = useCallback(() => {
    setScore(0);
    setCorrect(0);
    setWrong(0);
    setCombo(0);
    setMaxCombo(0);
    setTimeLeft(GAME_DURATION);
    setFeedback(null);
    setChallenge(generateChallenge());
    setMode("playing");
    gameActiveRef.current = true;
    setIsNewHigh(false);

    if (timerRef.current) clearInterval(timerRef.current);
    let t = GAME_DURATION;
    timerRef.current = setInterval(() => {
      t--;
      setTimeLeft(t);
      if (t <= 0) {
        clearInterval(timerRef.current!);
        gameActiveRef.current = false;
        // Force end
        setMode(prev => {
          // We'll handle the end in an effect
          return prev;
        });
      }
    }, 1000);
  }, []);

  // Watch for timer hitting 0
  useEffect(() => {
    if (timeLeft <= 0 && mode === "playing") {
      endGame();
    }
  }, [timeLeft, mode, endGame]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleTap = useCallback((color: string) => {
    if (!challenge || mode !== "playing" || !gameActiveRef.current) return;

    if (color === challenge.inkColor) {
      setCorrect(c => c + 1);
      setCombo(c => {
        const nc = c + 1;
        setMaxCombo(mc => Math.max(mc, nc));
        return nc;
      });
      setFeedback("correct");
      playCorrect();
    } else {
      setWrong(w => w + 1);
      setCombo(0);
      setFeedback("wrong");
      playWrong();
    }

    setTimeout(() => setFeedback(null), 200);
    setChallenge(generateChallenge());
  }, [challenge, mode]);

  /* ─── Menu ─── */
  if (mode === "menu") {
    return (
      <div className="max-w-lg mx-auto px-4 py-8 animate-fadeIn">
        <a href="/board-games" className="text-sm text-amber-500 hover:underline no-underline">← 返回桌遊專區</a>
        <div className="text-center mt-6 mb-8">
          <div className="text-5xl mb-3">🎨</div>
          <h1 className="text-2xl font-black text-slate-800 mb-2">色彩快手</h1>
          <p className="text-slate-500 text-sm">Stroop 效應挑戰 — 看顏色，不看字</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-amber-200 shadow-sm mb-6">
          <h3 className="font-bold text-slate-700 mb-1">遊戲規則</h3>
          <ul className="text-sm text-slate-500 space-y-1 list-disc list-inside">
            <li>螢幕顯示一個顏色名稱的文字</li>
            <li>文字用<span className="font-bold">不同的顏色</span>印刷</li>
            <li>你要點擊<span className="font-bold text-amber-600">文字印刷的顏色</span>（不是文字意思）</li>
            <li>例如：<span className="text-blue-500 font-bold">紅色</span> → 要按<span className="font-bold text-blue-500">藍色</span></li>
            <li>限時 {GAME_DURATION} 秒</li>
            <li>最高紀錄：{highScore} 分</li>
          </ul>
        </div>
        <button onClick={startGame}
          className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-lg cursor-pointer border-none hover:opacity-90 transition">
          🚀 開始挑戰
        </button>
      </div>
    );
  }

  /* ─── Done ─── */
  if (mode === "done") {
    const stars = getStars(score, 200);
    return (
      <div className="max-w-lg mx-auto px-4 py-8 animate-fadeIn">
        <a href="/board-games" className="text-sm text-amber-500 hover:underline no-underline">← 返回桌遊專區</a>
        <div className="text-center text-sm text-slate-500 mt-4 mb-2">
          正確 {correct} 次 ・ 錯誤 {wrong} 次 ・ 最長連續 {maxCombo}
        </div>
        <GameOverScreen
          score={score} maxScore={200} gameName="色彩快手" stars={stars}
          highScore={Math.max(highScore, score)} isNewHigh={isNewHigh}
          onRestart={startGame} onBack={() => setMode("menu")}
          trackingData={{ subject: "board-game", activityType: "game", activityId: "color-tap", activityName: "色彩快手" }}
        />
      </div>
    );
  }

  /* ─── Playing ─── */
  return (
    <div className="max-w-lg mx-auto px-4 py-8 animate-fadeIn">
      <a href="/board-games" className="text-sm text-amber-500 hover:underline no-underline">← 返回桌遊專區</a>

      {/* Header */}
      <div className="flex justify-between items-center mt-4 mb-6">
        <div className="text-sm text-slate-500">⏱ {timeLeft}s</div>
        <div className="text-sm text-slate-500">🔥 {combo}</div>
        <div className="text-sm font-bold text-amber-600">✅ {correct} ❌ {wrong}</div>
      </div>

      {/* Timer bar */}
      <div className="w-full h-2 bg-slate-200 rounded-full mb-6 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-1000"
          style={{ width: `${(timeLeft / GAME_DURATION) * 100}%` }} />
      </div>

      {/* Challenge */}
      {challenge && (
        <div className={`bg-white rounded-2xl p-8 border shadow-sm mb-8 text-center transition-all
          ${feedback === "correct" ? "border-green-300 bg-green-50" : feedback === "wrong" ? "border-red-300 bg-red-50" : "border-amber-200"}
        `}>
          <div className="text-xs text-slate-400 mb-2">按下文字的「印刷顏色」</div>
          <div className={`text-6xl font-black ${challenge.inkTw}`}>
            {challenge.word}
          </div>
        </div>
      )}

      {/* Color buttons */}
      <div className="grid grid-cols-2 gap-3 max-w-[320px] mx-auto">
        {COLOR_DEFS.map(color => (
          <button key={color.value}
            onClick={() => handleTap(color.value)}
            className={`py-5 rounded-xl text-white font-bold text-lg cursor-pointer border-none transition-transform active:scale-95 ${BUTTON_STYLES[color.value]}`}>
            {color.name}
          </button>
        ))}
      </div>
    </div>
  );
}
