"use client";
import { useState, useCallback } from "react";
import { playCorrect, playWrong, playPerfect, playVictory } from "@/lib/sounds";
import { useHighScore, getStars, GameOverScreen, shuffle } from "@/lib/game-utils";

/* ─── Gate Types ─── */
type GateType = "AND" | "OR" | "NOT" | "NAND" | "NOR" | "XOR";
type PuzzleMode = "output" | "input";

interface Puzzle {
  gate: GateType;
  inputs: (0 | 1)[];
  output: 0 | 1;
  mode: PuzzleMode;
  question: string;
}

function evalGate(gate: GateType, inputs: (0 | 1)[]): 0 | 1 {
  switch (gate) {
    case "AND": return (inputs[0] & inputs[1]) as 0 | 1;
    case "OR": return (inputs[0] | inputs[1]) as 0 | 1;
    case "NOT": return (inputs[0] === 0 ? 1 : 0) as 0 | 1;
    case "NAND": return ((inputs[0] & inputs[1]) === 0 ? 1 : 0) as 0 | 1;
    case "NOR": return ((inputs[0] | inputs[1]) === 0 ? 1 : 0) as 0 | 1;
    case "XOR": return (inputs[0] ^ inputs[1]) as 0 | 1;
  }
}

const GATE_DESC: Record<GateType, string> = {
  AND: "兩個都是 1 → 輸出 1",
  OR: "至少一個是 1 → 輸出 1",
  NOT: "輸入反轉（0→1, 1→0）",
  NAND: "AND 的反轉",
  NOR: "OR 的反轉",
  XOR: "兩個不同 → 輸出 1",
};

const GATE_SYMBOL: Record<GateType, string> = {
  AND: "&&", OR: "||", NOT: "!", NAND: "!&", NOR: "!|", XOR: "^",
};

function generatePuzzle(round: number): Puzzle {
  let gatePool: GateType[];
  if (round < 3) gatePool = ["AND", "OR"];
  else if (round < 5) gatePool = ["AND", "OR", "NOT"];
  else if (round < 8) gatePool = ["AND", "OR", "NOT", "NAND", "NOR"];
  else gatePool = ["AND", "OR", "NOT", "NAND", "NOR", "XOR"];

  const gate = gatePool[Math.floor(Math.random() * gatePool.length)];
  const isNot = gate === "NOT";
  const inputs: (0 | 1)[] = isNot
    ? [Math.random() > 0.5 ? 1 : 0]
    : [Math.random() > 0.5 ? 1 : 0, Math.random() > 0.5 ? 1 : 0];
  const output = evalGate(gate, inputs);

  const mode: PuzzleMode = round > 3 && Math.random() > 0.6 ? "input" : "output";

  let question: string;
  if (mode === "output") {
    question = isNot
      ? `NOT(${inputs[0]}) = ?`
      : `${inputs[0]} ${GATE_SYMBOL[gate]} ${inputs[1]} = ?`;
  } else {
    question = isNot
      ? `NOT(?) = ${output}`
      : `? ${GATE_SYMBOL[gate]} ${inputs[1]} = ${output}`;
  }

  return { gate, inputs, output, mode, question };
}

const TOTAL_ROUNDS = 12;

export default function LogicGatesPage() {
  const [mode, setMode] = useState<"menu" | "playing" | "done">("menu");
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [isNewHigh, setIsNewHigh] = useState(false);
  const { highScore, updateHighScore } = useHighScore("logic-gates");

  const startGame = useCallback(() => {
    setRound(0);
    setScore(0);
    setFeedback(null);
    setPuzzle(generatePuzzle(0));
    setMode("playing");
    setIsNewHigh(false);
  }, []);

  const nextRound = useCallback(() => {
    if (round + 1 >= TOTAL_ROUNDS) {
      const newHigh = updateHighScore(score);
      setIsNewHigh(newHigh);
      if (score === TOTAL_ROUNDS * 10) playPerfect();
      else if (score >= TOTAL_ROUNDS * 6) playVictory();
      setMode("done");
      return;
    }
    const next = round + 1;
    setRound(next);
    setPuzzle(generatePuzzle(next));
    setFeedback(null);
  }, [round, score, updateHighScore]);

  const handleAnswer = useCallback((ans: 0 | 1) => {
    if (!puzzle || feedback) return;

    let correct: boolean;
    if (puzzle.mode === "output") {
      correct = ans === puzzle.output;
    } else {
      // For "input" mode, check if the answer is the first input
      correct = ans === puzzle.inputs[0];
    }

    if (correct) {
      setScore(s => s + 10);
      setFeedback("correct");
      playCorrect();
    } else {
      setFeedback("wrong");
      playWrong();
    }
    setTimeout(nextRound, 1000);
  }, [puzzle, feedback, nextRound]);

  /* ─── Menu ─── */
  if (mode === "menu") {
    return (
      <div className="max-w-lg mx-auto px-4 py-8 animate-fadeIn">
        <a href="/board-games" className="text-sm text-cyan-500 hover:underline no-underline">← 返回桌遊專區</a>
        <div className="text-center mt-6 mb-8">
          <div className="text-5xl mb-3">⚡</div>
          <h1 className="text-2xl font-black text-slate-800 mb-2">邏輯閘門</h1>
          <p className="text-slate-500 text-sm">學習 AND、OR、NOT 等邏輯運算</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-cyan-200 shadow-sm mb-6">
          <h3 className="font-bold text-slate-700 mb-2">邏輯閘門介紹</h3>
          <div className="space-y-2 text-sm">
            {(Object.entries(GATE_DESC) as [GateType, string][]).map(([gate, desc]) => (
              <div key={gate} className="flex items-center gap-2 text-slate-600">
                <span className="font-mono font-bold text-cyan-600 w-12">{gate}</span>
                <span>{desc}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-cyan-200 shadow-sm mb-6">
          <h3 className="font-bold text-slate-700 mb-1">遊戲規則</h3>
          <ul className="text-sm text-slate-500 space-y-1 list-disc list-inside">
            <li>共 {TOTAL_ROUNDS} 題</li>
            <li>根據邏輯閘判斷輸出（0 或 1）</li>
            <li>進階題需要推算輸入值</li>
            <li>最高紀錄：{highScore} 分</li>
          </ul>
        </div>
        <button onClick={startGame}
          className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg cursor-pointer border-none hover:opacity-90 transition">
          🚀 開始挑戰
        </button>
      </div>
    );
  }

  /* ─── Done ─── */
  if (mode === "done") {
    const maxScore = TOTAL_ROUNDS * 10;
    const stars = getStars(score, maxScore);
    return (
      <div className="max-w-lg mx-auto px-4 py-8 animate-fadeIn">
        <a href="/board-games" className="text-sm text-cyan-500 hover:underline no-underline">← 返回桌遊專區</a>
        <GameOverScreen
          score={score} maxScore={maxScore} gameName="邏輯閘門" stars={stars}
          highScore={Math.max(highScore, score)} isNewHigh={isNewHigh}
          onRestart={startGame} onBack={() => setMode("menu")}
        />
      </div>
    );
  }

  /* ─── Playing ─── */
  return (
    <div className="max-w-lg mx-auto px-4 py-8 animate-fadeIn">
      <a href="/board-games" className="text-sm text-cyan-500 hover:underline no-underline">← 返回桌遊專區</a>

      {/* Header */}
      <div className="flex justify-between items-center mt-4 mb-6">
        <div className="text-sm text-slate-500">第 {round + 1}/{TOTAL_ROUNDS} 題</div>
        <div className="text-sm font-bold text-cyan-600">{score} 分</div>
      </div>

      {puzzle && (
        <div className="bg-white rounded-2xl p-6 border border-cyan-200 shadow-sm mb-6">
          {/* Gate Visual */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-4 bg-slate-50 rounded-xl px-6 py-4">
              {/* Inputs */}
              <div className="flex flex-col gap-2">
                {puzzle.inputs.map((inp, i) => (
                  <div key={i} className={`w-10 h-10 rounded-lg flex items-center justify-center font-mono font-bold text-lg
                    ${puzzle.mode === "input" && i === 0 ? "bg-amber-100 text-amber-600 border-2 border-dashed border-amber-400" :
                      inp === 1 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {puzzle.mode === "input" && i === 0 ? "?" : inp}
                  </div>
                ))}
              </div>

              {/* Arrow + Gate */}
              <div className="text-slate-400">→</div>
              <div className="w-16 h-16 rounded-xl bg-cyan-100 border-2 border-cyan-300 flex flex-col items-center justify-center">
                <span className="font-mono font-bold text-cyan-700 text-sm">{puzzle.gate}</span>
                <span className="text-xs text-cyan-500">{GATE_SYMBOL[puzzle.gate]}</span>
              </div>
              <div className="text-slate-400">→</div>

              {/* Output */}
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-mono font-bold text-lg
                ${puzzle.mode === "output" ? "bg-amber-100 text-amber-600 border-2 border-dashed border-amber-400" :
                  puzzle.output === 1 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {puzzle.mode === "output" ? "?" : puzzle.output}
              </div>
            </div>
          </div>

          {/* Question */}
          <div className="text-center mb-4">
            <div className="font-mono text-lg font-bold text-slate-700">{puzzle.question}</div>
            <div className="text-xs text-slate-400 mt-1">{GATE_DESC[puzzle.gate]}</div>
          </div>

          {/* Answer buttons */}
          {!feedback && (
            <div className="flex gap-4 justify-center">
              <button onClick={() => handleAnswer(0)}
                className="w-20 h-20 rounded-2xl bg-red-50 border-2 border-red-200 text-3xl font-mono font-black text-red-600 cursor-pointer hover:bg-red-100 hover:border-red-400 transition">
                0
              </button>
              <button onClick={() => handleAnswer(1)}
                className="w-20 h-20 rounded-2xl bg-green-50 border-2 border-green-200 text-3xl font-mono font-black text-green-600 cursor-pointer hover:bg-green-100 hover:border-green-400 transition">
                1
              </button>
            </div>
          )}

          {/* Feedback */}
          {feedback && (
            <div className={`text-center text-lg font-bold ${feedback === "correct" ? "text-green-500" : "text-red-500"}`}>
              {feedback === "correct" ? "✅ 正確！" : `❌ 答案是 ${puzzle.mode === "output" ? puzzle.output : puzzle.inputs[0]}`}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
