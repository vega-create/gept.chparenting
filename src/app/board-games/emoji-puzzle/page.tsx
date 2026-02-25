"use client";
import { useState, useCallback, useRef } from "react";
import { playCorrect, playWrong, playPerfect, playVictory } from "@/lib/sounds";
import { useHighScore, getStars, GameOverScreen, shuffle } from "@/lib/game-utils";

/* ─── Types ─── */
interface EmojiVar {
  emoji: string;
  value: number;
}

interface Equation {
  display: string;
  isQuestion: false;
}

interface Question {
  display: string;
  isQuestion: true;
  answer: number;
  options: number[];
}

interface Puzzle {
  emojis: EmojiVar[];
  equations: (Equation | Question)[];
  questionEmoji: string;
  answer: number;
  options: number[];
}

/* ─── Emoji Sets ─── */
const EMOJI_SETS = [
  ["🍎", "🍊", "🍋"],
  ["🐶", "🐱", "🐰"],
  ["⭐", "🌙", "☀️"],
  ["🌹", "🌻", "🌸"],
  ["🎈", "🎁", "🎀"],
  ["🍕", "🍔", "🌮"],
  ["⚽", "🏀", "🎾"],
  ["🚗", "🚀", "✈️"],
  ["💎", "👑", "🔔"],
  ["🎵", "🎸", "🥁"],
  ["🍦", "🍩", "🍪"],
  ["🐸", "🦋", "🐝"],
];

function generatePuzzle(puzzleIndex: number): Puzzle {
  const emojiSet = EMOJI_SETS[puzzleIndex % EMOJI_SETS.length];

  // Decide how many variables (2 or 3)
  const numVars = puzzleIndex < 4 ? 2 : (Math.random() > 0.4 ? 3 : 2);
  const usedEmojis = emojiSet.slice(0, numVars);

  // Generate values (1-12)
  const values = usedEmojis.map(() => Math.floor(Math.random() * 10) + 1);
  const emojiVars: EmojiVar[] = usedEmojis.map((e, i) => ({ emoji: e, value: values[i] }));

  const equations: (Equation | Question)[] = [];

  if (numVars === 2) {
    const [a, b] = emojiVars;
    // Equation 1: a + a = 2*a.value
    equations.push({ display: `${a.emoji} + ${a.emoji} = ${a.value * 2}`, isQuestion: false });
    // Equation 2: a + b = a.value + b.value
    equations.push({ display: `${a.emoji} + ${b.emoji} = ${a.value + b.value}`, isQuestion: false });
    // Question: b = ?
    const wrongAnswers = generateWrongAnswers(b.value, 3);
    const opts = shuffle([b.value, ...wrongAnswers]);
    equations.push({ display: `${b.emoji} = ?`, isQuestion: true, answer: b.value, options: opts });

    return { emojis: emojiVars, equations, questionEmoji: b.emoji, answer: b.value, options: opts };
  } else {
    const [a, b, c] = emojiVars;
    // Pick puzzle pattern randomly
    const pattern = Math.floor(Math.random() * 3);

    if (pattern === 0) {
      equations.push({ display: `${a.emoji} + ${b.emoji} = ${a.value + b.value}`, isQuestion: false });
      equations.push({ display: `${b.emoji} + ${c.emoji} = ${b.value + c.value}`, isQuestion: false });
      equations.push({ display: `${a.emoji} + ${c.emoji} = ${a.value + c.value}`, isQuestion: false });
      const wrongAnswers = generateWrongAnswers(c.value, 3);
      const opts = shuffle([c.value, ...wrongAnswers]);
      equations.push({ display: `${c.emoji} = ?`, isQuestion: true, answer: c.value, options: opts });
      return { emojis: emojiVars, equations, questionEmoji: c.emoji, answer: c.value, options: opts };
    } else if (pattern === 1) {
      equations.push({ display: `${a.emoji} × 2 = ${a.value * 2}`, isQuestion: false });
      equations.push({ display: `${a.emoji} + ${b.emoji} = ${a.value + b.value}`, isQuestion: false });
      equations.push({ display: `${b.emoji} + ${c.emoji} = ${b.value + c.value}`, isQuestion: false });
      const wrongAnswers = generateWrongAnswers(c.value, 3);
      const opts = shuffle([c.value, ...wrongAnswers]);
      equations.push({ display: `${c.emoji} = ?`, isQuestion: true, answer: c.value, options: opts });
      return { emojis: emojiVars, equations, questionEmoji: c.emoji, answer: c.value, options: opts };
    } else {
      equations.push({ display: `${a.emoji} + ${a.emoji} + ${a.emoji} = ${a.value * 3}`, isQuestion: false });
      equations.push({ display: `${a.emoji} + ${b.emoji} = ${a.value + b.value}`, isQuestion: false });
      equations.push({ display: `${b.emoji} − ${c.emoji} = ${b.value - c.value}`, isQuestion: false });
      const wrongAnswers = generateWrongAnswers(c.value, 3);
      const opts = shuffle([c.value, ...wrongAnswers]);
      equations.push({ display: `${c.emoji} = ?`, isQuestion: true, answer: c.value, options: opts });
      return { emojis: emojiVars, equations, questionEmoji: c.emoji, answer: c.value, options: opts };
    }
  }
}

function generateWrongAnswers(correct: number, count: number): number[] {
  const wrong = new Set<number>();
  while (wrong.size < count) {
    let w: number;
    const delta = Math.floor(Math.random() * 5) + 1;
    w = Math.random() > 0.5 ? correct + delta : correct - delta;
    if (w !== correct && w > 0 && !wrong.has(w)) wrong.add(w);
  }
  return Array.from(wrong);
}

const TOTAL_PUZZLES = 10;

export default function EmojiPuzzlePage() {
  const [mode, setMode] = useState<"menu" | "playing" | "done">("menu");
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [feedback, setFeedback] = useState<{ type: "correct" | "wrong"; msg: string } | null>(null);
  const [answered, setAnswered] = useState(false);
  const [isNewHigh, setIsNewHigh] = useState(false);
  const { highScore, updateHighScore } = useHighScore("emoji-puzzle");

  const startGame = useCallback(() => {
    setPuzzleIndex(0);
    setPuzzle(generatePuzzle(0));
    setScore(0);
    setCorrect(0);
    setWrong(0);
    setFeedback(null);
    setAnswered(false);
    setIsNewHigh(false);
    setMode("playing");
  }, []);

  const handleAnswer = useCallback((selected: number) => {
    if (!puzzle || answered) return;
    setAnswered(true);

    if (selected === puzzle.answer) {
      playCorrect();
      const pts = 10;
      setScore(s => s + pts);
      setCorrect(c => c + 1);
      setFeedback({ type: "correct", msg: `正確！${puzzle.questionEmoji} = ${puzzle.answer}` });
    } else {
      playWrong();
      setWrong(w => w + 1);
      setFeedback({ type: "wrong", msg: `答案是 ${puzzle.questionEmoji} = ${puzzle.answer}` });
    }

    setTimeout(() => {
      const nextIndex = puzzleIndex + 1;
      if (nextIndex >= TOTAL_PUZZLES) {
        // Game over
        const finalScore = (correct + (selected === puzzle.answer ? 1 : 0)) * 10;
        setScore(finalScore);
        const newHigh = updateHighScore(finalScore);
        setIsNewHigh(newHigh);
        if (finalScore >= 90) playPerfect();
        else if (finalScore >= 60) playVictory();
        setMode("done");
      } else {
        setPuzzleIndex(nextIndex);
        setPuzzle(generatePuzzle(nextIndex));
        setAnswered(false);
        setFeedback(null);
      }
    }, 1500);
  }, [puzzle, answered, puzzleIndex, correct, updateHighScore]);

  /* ─── Menu ─── */
  if (mode === "menu") {
    return (
      <div className="max-w-lg mx-auto px-4 py-8 animate-fadeIn">
        <a href="/board-games" className="text-sm text-orange-500 hover:underline no-underline">← 返回桌遊專區</a>
        <div className="text-center mt-6 mb-8">
          <div className="text-5xl mb-3">🧩</div>
          <h1 className="text-2xl font-black text-slate-800 mb-2">表情密碼</h1>
          <p className="text-slate-500 text-sm">破解表情符號方程式</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-orange-200 shadow-sm mb-6">
          <h3 className="font-bold text-slate-700 mb-1">遊戲規則</h3>
          <ul className="text-sm text-slate-500 space-y-1 list-disc list-inside">
            <li>每題顯示表情符號組成的方程式</li>
            <li>根據提示推算出未知數的值</li>
            <li>從選項中選擇正確答案</li>
            <li>共 {TOTAL_PUZZLES} 題，每題 10 分</li>
            <li>最高紀錄：{highScore} 分</li>
          </ul>
        </div>
        <button onClick={startGame}
          className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 text-white font-bold text-lg cursor-pointer border-none hover:opacity-90 transition">
          開始解謎
        </button>
      </div>
    );
  }

  /* ─── Done ─── */
  if (mode === "done") {
    const stars = getStars(score, TOTAL_PUZZLES * 10);
    return (
      <div className="max-w-lg mx-auto px-4 py-8 animate-fadeIn">
        <a href="/board-games" className="text-sm text-orange-500 hover:underline no-underline">← 返回桌遊專區</a>
        <div className="text-center text-sm text-slate-500 mt-4 mb-2">
          正確 {correct} 題 ・ 錯誤 {wrong} 題
        </div>
        <GameOverScreen
          score={score} maxScore={TOTAL_PUZZLES * 10} gameName="表情密碼" stars={stars}
          highScore={Math.max(highScore, score)} isNewHigh={isNewHigh}
          onRestart={startGame} onBack={() => setMode("menu")}
        />
      </div>
    );
  }

  /* ─── Playing ─── */
  return (
    <div className="max-w-lg mx-auto px-4 py-8 animate-fadeIn">
      <a href="/board-games" className="text-sm text-orange-500 hover:underline no-underline">← 返回桌遊專區</a>

      {/* Header */}
      <div className="flex justify-between items-center mt-4 mb-4">
        <div className="text-sm text-slate-500">第 {puzzleIndex + 1}/{TOTAL_PUZZLES} 題</div>
        <div className="text-sm font-bold text-orange-600">🏆 {score} 分</div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-slate-200 rounded-full mb-6 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-orange-400 to-amber-500 rounded-full transition-all duration-500"
          style={{ width: `${((puzzleIndex) / TOTAL_PUZZLES) * 100}%` }} />
      </div>

      {/* Puzzle Card */}
      {puzzle && (
        <div className={`bg-white rounded-2xl p-6 border shadow-sm mb-6 transition-all
          ${feedback?.type === "correct" ? "border-green-300 bg-green-50" : feedback?.type === "wrong" ? "border-red-300 bg-red-50" : "border-orange-200"}
        `}>
          <div className="text-xs text-slate-400 mb-4 text-center">根據方程式推算答案</div>
          <div className="space-y-3">
            {puzzle.equations.map((eq, i) => (
              <div key={i} className={`text-center text-2xl sm:text-3xl font-bold py-2 rounded-xl
                ${eq.isQuestion ? "bg-orange-100 border-2 border-orange-300 border-dashed" : ""}
              `}>
                {eq.display}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feedback */}
      {feedback && (
        <div className={`text-center text-sm font-bold mb-4 animate-fadeIn ${feedback.type === "correct" ? "text-green-500" : "text-red-500"}`}>
          {feedback.msg}
        </div>
      )}

      {/* Options */}
      {puzzle && (
        <div className="grid grid-cols-2 gap-3">
          {puzzle.options.map((opt, i) => (
            <button key={i}
              onClick={() => handleAnswer(opt)}
              disabled={answered}
              className={`py-5 rounded-xl text-2xl font-black cursor-pointer border-2 transition-all active:scale-95
                ${answered
                  ? opt === puzzle.answer
                    ? "bg-green-100 border-green-500 text-green-700"
                    : "bg-slate-50 border-slate-200 text-slate-400"
                  : "bg-white border-orange-200 text-slate-800 hover:border-orange-400 hover:bg-orange-50"
                }
              `}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
