"use client";
import { useState, useCallback, useEffect } from "react";
import { playCorrect, playWrong, playPerfect, playVictory } from "@/lib/sounds";
import { useHighScore, getStars, GameOverScreen, shuffle } from "@/lib/game-utils";
import { useTimer } from "@/lib/game-utils";

/* ─── Sudoku Generator ─── */
const EMOJIS = ["🍎", "🍊", "🍇", "🍓"];
type Difficulty = "easy" | "medium" | "hard";

function generateSudoku(diff: Difficulty): { solution: number[][]; puzzle: (number | null)[][]; } {
  // Generate a valid 4x4 Sudoku
  const base = [
    [0, 1, 2, 3],
    [2, 3, 0, 1],
    [1, 0, 3, 2],
    [3, 2, 1, 0],
  ];

  // Shuffle rows within bands and columns within stacks
  const rowPerm = shuffle([0, 1, 2, 3]);
  const colPerm = shuffle([0, 1, 2, 3]);
  const valPerm = shuffle([0, 1, 2, 3]);

  const solution: number[][] = Array.from({ length: 4 }, () => Array(4).fill(0));
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      solution[r][c] = valPerm[base[rowPerm[r]][colPerm[c]]];
    }
  }

  // Determine how many cells to reveal per row
  const givensPerRow = diff === "easy" ? 3 : diff === "medium" ? 2 : 2;
  const totalGivens = diff === "easy" ? 10 : diff === "medium" ? 8 : 6;

  const puzzle: (number | null)[][] = solution.map(row => row.map(() => null));
  let revealed = 0;

  for (let r = 0; r < 4; r++) {
    const cols = shuffle([0, 1, 2, 3]).slice(0, givensPerRow);
    cols.forEach(c => {
      if (revealed < totalGivens) {
        puzzle[r][c] = solution[r][c];
        revealed++;
      }
    });
  }

  // Fill remaining if needed
  while (revealed < totalGivens) {
    const r = Math.floor(Math.random() * 4);
    const c = Math.floor(Math.random() * 4);
    if (puzzle[r][c] === null) {
      puzzle[r][c] = solution[r][c];
      revealed++;
    }
  }

  return { solution, puzzle };
}

const DIFF_OPTIONS: { key: Difficulty; label: string; desc: string }[] = [
  { key: "easy", label: "初級", desc: "每行 3 個已知" },
  { key: "medium", label: "中級", desc: "每行 2 個已知" },
  { key: "hard", label: "高級", desc: "只有 6 個已知" },
];

export default function MiniSudokuPage() {
  const [mode, setMode] = useState<"menu" | "playing" | "done">("menu");
  const [diff, setDiff] = useState<Difficulty>("easy");
  const [solution, setSolution] = useState<number[][]>([]);
  const [puzzle, setPuzzle] = useState<(number | null)[][]>([]);
  const [board, setBoard] = useState<(number | null)[][]>([]);
  const [selected, setSelected] = useState<[number, number] | null>(null);
  const [errors, setErrors] = useState<Set<string>>(new Set());
  const [hints, setHints] = useState(3);
  const [score, setScore] = useState(0);
  const [isNewHigh, setIsNewHigh] = useState(false);
  const { highScore, updateHighScore } = useHighScore("mini-sudoku");
  const { time, fmt: timerFmt, reset: resetTimer } = useTimer(mode === "playing");

  const startGame = useCallback((d: Difficulty) => {
    setDiff(d);
    const { solution: sol, puzzle: puz } = generateSudoku(d);
    setSolution(sol);
    setPuzzle(puz);
    setBoard(puz.map(row => [...row]));
    setSelected(null);
    setErrors(new Set());
    setHints(3);
    setScore(0);
    setMode("playing");
    resetTimer();
    setIsNewHigh(false);
  }, [resetTimer]);

  const isGiven = (r: number, c: number) => puzzle[r]?.[c] !== null;

  const checkComplete = useCallback((b: (number | null)[][]) => {
    for (let r = 0; r < 4; r++)
      for (let c = 0; c < 4; c++)
        if (b[r][c] === null || b[r][c] !== solution[r][c]) return false;
    return true;
  }, [solution]);

  const placeEmoji = useCallback((val: number) => {
    if (!selected || isGiven(selected[0], selected[1])) return;
    const [r, c] = selected;
    const newBoard = board.map(row => [...row]);
    newBoard[r][c] = val;
    setBoard(newBoard);

    const key = `${r},${c}`;
    if (val !== solution[r][c]) {
      setErrors(prev => new Set(prev).add(key));
      playWrong();
    } else {
      const newErrors = new Set(errors);
      newErrors.delete(key);
      setErrors(newErrors);
      playCorrect();

      if (checkComplete(newBoard)) {
        // Calculate score: base 100 - time penalty - error penalty
        const timePenalty = Math.min(time, 50);
        const errorPenalty = errors.size * 5;
        const finalScore = Math.max(100 - timePenalty - errorPenalty, 10);
        setScore(finalScore);
        const newHigh = updateHighScore(finalScore);
        setIsNewHigh(newHigh);
        if (errors.size === 0 && time < 60) playPerfect();
        else playVictory();
        setMode("done");
      }
    }
  }, [selected, board, solution, puzzle, errors, time, checkComplete, updateHighScore]);

  const useHint = useCallback(() => {
    if (hints <= 0) return;
    // Find an empty or wrong cell
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (!isGiven(r, c) && board[r][c] !== solution[r][c]) {
          const newBoard = board.map(row => [...row]);
          newBoard[r][c] = solution[r][c];
          setBoard(newBoard);
          const newErrors = new Set(errors);
          newErrors.delete(`${r},${c}`);
          setErrors(newErrors);
          setHints(h => h - 1);
          playCorrect();
          if (checkComplete(newBoard)) {
            const finalScore = Math.max(50 - Math.min(time, 30), 10);
            setScore(finalScore);
            const newHigh = updateHighScore(finalScore);
            setIsNewHigh(newHigh);
            playVictory();
            setMode("done");
          }
          return;
        }
      }
    }
  }, [hints, board, solution, puzzle, errors, time, checkComplete, updateHighScore]);

  const clearCell = useCallback(() => {
    if (!selected || isGiven(selected[0], selected[1])) return;
    const [r, c] = selected;
    const newBoard = board.map(row => [...row]);
    newBoard[r][c] = null;
    setBoard(newBoard);
    const newErrors = new Set(errors);
    newErrors.delete(`${r},${c}`);
    setErrors(newErrors);
  }, [selected, board, puzzle, errors]);

  /* ─── Menu ─── */
  if (mode === "menu") {
    return (
      <div className="max-w-lg mx-auto px-4 py-8 animate-fadeIn">
        <a href="/board-games" className="text-sm text-purple-500 hover:underline no-underline">← 返回桌遊專區</a>
        <div className="text-center mt-6 mb-8">
          <div className="text-5xl mb-3">🔢</div>
          <h1 className="text-2xl font-black text-slate-800 mb-2">迷你數獨</h1>
          <p className="text-slate-500 text-sm">4x4 水果數獨，每行每列每宮不重複</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-purple-200 shadow-sm mb-6">
          <h3 className="font-bold text-slate-700 mb-1">遊戲規則</h3>
          <ul className="text-sm text-slate-500 space-y-1 list-disc list-inside">
            <li>每行 4 種水果各出現一次</li>
            <li>每列 4 種水果各出現一次</li>
            <li>每個 2x2 宮格 4 種水果各一次</li>
            <li>水果：{EMOJIS.join(" ")}</li>
            <li>完成越快、錯誤越少，分數越高</li>
          </ul>
        </div>
        <div className="space-y-3">
          {DIFF_OPTIONS.map(d => (
            <button key={d.key} onClick={() => startGame(d.key)}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold text-left cursor-pointer border-none hover:opacity-90 transition">
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
    const stars = getStars(score, 100);
    return (
      <div className="max-w-lg mx-auto px-4 py-8 animate-fadeIn">
        <a href="/board-games" className="text-sm text-purple-500 hover:underline no-underline">← 返回桌遊專區</a>
        <GameOverScreen
          score={score} maxScore={100} gameName="迷你數獨" stars={stars}
          highScore={Math.max(highScore, score)} isNewHigh={isNewHigh}
          onRestart={() => startGame(diff)} onBack={() => setMode("menu")}
        />
      </div>
    );
  }

  /* ─── Playing ─── */
  return (
    <div className="max-w-lg mx-auto px-4 py-8 animate-fadeIn">
      <a href="/board-games" className="text-sm text-purple-500 hover:underline no-underline">← 返回桌遊專區</a>

      {/* Header */}
      <div className="flex justify-between items-center mt-4 mb-6">
        <div className="text-sm font-mono text-slate-500">⏱ {timerFmt}</div>
        <button onClick={useHint} disabled={hints <= 0}
          className="text-sm px-3 py-1 rounded-lg bg-amber-100 text-amber-700 font-bold cursor-pointer border-none disabled:opacity-40">
          💡 提示 ({hints})
        </button>
      </div>

      {/* Board */}
      <div className="bg-white rounded-2xl p-4 border border-purple-200 shadow-sm mb-6">
        <div className="grid grid-cols-4 gap-0 max-w-[280px] mx-auto border-2 border-slate-800 rounded-lg overflow-hidden">
          {board.map((row, r) =>
            row.map((val, c) => {
              const given = isGiven(r, c);
              const isSelected = selected?.[0] === r && selected?.[1] === c;
              const hasError = errors.has(`${r},${c}`);
              const borderR = c === 1 ? "border-r-2 border-r-slate-800" : c < 3 ? "border-r border-r-slate-300" : "";
              const borderB = r === 1 ? "border-b-2 border-b-slate-800" : r < 3 ? "border-b border-b-slate-300" : "";
              return (
                <button key={`${r}-${c}`}
                  onClick={() => !given && setSelected([r, c])}
                  className={`w-[70px] h-[70px] flex items-center justify-center text-2xl cursor-pointer border-none transition-colors
                    ${borderR} ${borderB}
                    ${given ? "bg-slate-100" : isSelected ? "bg-purple-100" : hasError ? "bg-red-50" : "bg-white hover:bg-purple-50"}
                  `}>
                  {val !== null ? EMOJIS[val] : ""}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Emoji Input */}
      <div className="flex gap-3 justify-center mb-4">
        {EMOJIS.map((emoji, i) => (
          <button key={i} onClick={() => placeEmoji(i)}
            className="w-16 h-16 rounded-xl bg-white border-2 border-purple-200 text-2xl cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition">
            {emoji}
          </button>
        ))}
        <button onClick={clearCell}
          className="w-16 h-16 rounded-xl bg-white border-2 border-slate-200 text-lg cursor-pointer hover:border-red-300 hover:bg-red-50 transition">
          🗑️
        </button>
      </div>

      {selected && (
        <div className="text-center text-xs text-slate-400">
          已選取第 {selected[0] + 1} 行第 {selected[1] + 1} 列
        </div>
      )}
    </div>
  );
}
