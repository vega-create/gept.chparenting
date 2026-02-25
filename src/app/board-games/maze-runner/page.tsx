"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { playCorrect, playWrong, playPerfect, playVictory } from "@/lib/sounds";
import { useHighScore, getStars, GameOverScreen } from "@/lib/game-utils";

/* ─── Types ─── */
type Difficulty = "easy" | "medium" | "hard";
type Cell = { top: boolean; right: boolean; bottom: boolean; left: boolean; visited: boolean };

const DIFF_CONFIG: Record<Difficulty, { rows: number; cols: number; cellSize: number }> = {
  easy: { rows: 7, cols: 7, cellSize: 40 },
  medium: { rows: 10, cols: 10, cellSize: 32 },
  hard: { rows: 14, cols: 14, cellSize: 24 },
};

const DIFF_OPTIONS: { key: Difficulty; label: string; desc: string }[] = [
  { key: "easy", label: "初級", desc: "7x7 迷宮" },
  { key: "medium", label: "中級", desc: "10x10 迷宮" },
  { key: "hard", label: "高級", desc: "14x14 迷宮" },
];

/* ─── Maze Generation (Recursive Backtracker) ─── */
function generateMaze(rows: number, cols: number): Cell[][] {
  const grid: Cell[][] = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      top: true, right: true, bottom: true, left: true, visited: false,
    }))
  );

  const stack: [number, number][] = [];
  const start: [number, number] = [0, 0];
  grid[0][0].visited = true;
  stack.push(start);

  const directions: { dr: number; dc: number; wall: keyof Cell; opposite: keyof Cell }[] = [
    { dr: -1, dc: 0, wall: "top", opposite: "bottom" },
    { dr: 1, dc: 0, wall: "bottom", opposite: "top" },
    { dr: 0, dc: -1, wall: "left", opposite: "right" },
    { dr: 0, dc: 1, wall: "right", opposite: "left" },
  ];

  while (stack.length > 0) {
    const [r, c] = stack[stack.length - 1];
    const neighbors = directions
      .map(d => ({ nr: r + d.dr, nc: c + d.dc, ...d }))
      .filter(({ nr, nc }) => nr >= 0 && nr < rows && nc >= 0 && nc < cols && !grid[nr][nc].visited);

    if (neighbors.length === 0) {
      stack.pop();
    } else {
      const { nr, nc, wall, opposite } = neighbors[Math.floor(Math.random() * neighbors.length)];
      (grid[r][c] as any)[wall] = false;
      (grid[nr][nc] as any)[opposite] = false;
      grid[nr][nc].visited = true;
      stack.push([nr, nc]);
    }
  }

  return grid;
}

export default function MazeRunnerPage() {
  const [mode, setMode] = useState<"menu" | "playing" | "done">("menu");
  const [diff, setDiff] = useState<Difficulty>("easy");
  const [maze, setMaze] = useState<Cell[][]>([]);
  const [playerPos, setPlayerPos] = useState<[number, number]>([0, 0]);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [score, setScore] = useState(0);
  const [isNewHigh, setIsNewHigh] = useState(false);
  const [trail, setTrail] = useState<Set<string>>(new Set(["0,0"]));
  const { highScore, updateHighScore } = useHighScore("maze-runner");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const gameRef = useRef<HTMLDivElement>(null);

  const config = DIFF_CONFIG[diff];
  const goalPos: [number, number] = [config.rows - 1, config.cols - 1];

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const finishGame = useCallback((finalMoves: number, finalTime: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    playVictory();
    const maxMoves = config.rows * config.cols * 2;
    const moveScore = Math.max(100 - Math.floor((finalMoves / maxMoves) * 80), 10);
    const maxTime = config.rows * config.cols * 3;
    const timeScore = Math.max(50 - Math.floor((finalTime / maxTime) * 50), 0);
    const finalScore = moveScore + timeScore;
    setScore(finalScore);
    const newHigh = updateHighScore(finalScore);
    setIsNewHigh(newHigh);
    if (finalScore >= 120) playPerfect();
    setMode("done");
  }, [config.rows, config.cols, updateHighScore]);

  const startGame = useCallback((d: Difficulty) => {
    setDiff(d);
    const c = DIFF_CONFIG[d];
    const newMaze = generateMaze(c.rows, c.cols);
    setMaze(newMaze);
    setPlayerPos([0, 0]);
    setMoves(0);
    setTime(0);
    setScore(0);
    setIsNewHigh(false);
    setTrail(new Set(["0,0"]));
    setMode("playing");

    if (timerRef.current) clearInterval(timerRef.current);
    let t = 0;
    timerRef.current = setInterval(() => {
      t++;
      setTime(t);
    }, 1000);

    setTimeout(() => gameRef.current?.focus(), 100);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const movePlayer = useCallback((dr: number, dc: number) => {
    if (mode !== "playing") return;
    const [r, c] = playerPos;
    const nr = r + dr;
    const nc = c + dc;

    if (nr < 0 || nr >= config.rows || nc < 0 || nc >= config.cols) return;

    // Check walls
    const cell = maze[r][c];
    if (dr === -1 && cell.top) return;
    if (dr === 1 && cell.bottom) return;
    if (dc === -1 && cell.left) return;
    if (dc === 1 && cell.right) return;

    const newMoves = moves + 1;
    setPlayerPos([nr, nc]);
    setMoves(newMoves);
    setTrail(prev => { const next = new Set(Array.from(prev)); next.add(`${nr},${nc}`); return next; });

    if (nr === goalPos[0] && nc === goalPos[1]) {
      finishGame(newMoves, time);
    }
  }, [mode, playerPos, config.rows, config.cols, maze, moves, goalPos, finishGame, time]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowUp": case "w": case "W": e.preventDefault(); movePlayer(-1, 0); break;
      case "ArrowDown": case "s": case "S": e.preventDefault(); movePlayer(1, 0); break;
      case "ArrowLeft": case "a": case "A": e.preventDefault(); movePlayer(0, -1); break;
      case "ArrowRight": case "d": case "D": e.preventDefault(); movePlayer(0, 1); break;
    }
  }, [movePlayer]);

  /* ─── Menu ─── */
  if (mode === "menu") {
    return (
      <div className="max-w-lg mx-auto px-4 py-8 animate-fadeIn">
        <a href="/board-games" className="text-sm text-violet-500 hover:underline no-underline">← 返回桌遊專區</a>
        <div className="text-center mt-6 mb-8">
          <div className="text-5xl mb-3">🏃</div>
          <h1 className="text-2xl font-black text-slate-800 mb-2">迷宮探險</h1>
          <p className="text-slate-500 text-sm">找到出口，越快越好！</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-violet-200 shadow-sm mb-6">
          <h3 className="font-bold text-slate-700 mb-1">遊戲規則</h3>
          <ul className="text-sm text-slate-500 space-y-1 list-disc list-inside">
            <li>使用方向鍵或按鈕移動角色</li>
            <li>從左上角出發，到達右下角的終點</li>
            <li>移動次數越少、用時越短，分數越高</li>
            <li>最高紀錄：{highScore} 分</li>
          </ul>
        </div>
        <div className="space-y-3">
          {DIFF_OPTIONS.map(d => (
            <button key={d.key} onClick={() => startGame(d.key)}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold text-left cursor-pointer border-none hover:opacity-90 transition">
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
    const stars = getStars(score, 150);
    return (
      <div className="max-w-lg mx-auto px-4 py-8 animate-fadeIn">
        <a href="/board-games" className="text-sm text-violet-500 hover:underline no-underline">← 返回桌遊專區</a>
        <div className="text-center text-sm text-slate-500 mt-4 mb-2">
          移動 {moves} 步 ・ 用時 {formatTime(time)}
        </div>
        <GameOverScreen
          score={score} maxScore={150} gameName="迷宮探險" stars={stars}
          highScore={Math.max(highScore, score)} isNewHigh={isNewHigh}
          onRestart={() => startGame(diff)} onBack={() => setMode("menu")}
        />
      </div>
    );
  }

  /* ─── Playing ─── */
  return (
    <div className="max-w-lg mx-auto px-4 py-8 animate-fadeIn" ref={gameRef} tabIndex={0} onKeyDown={handleKeyDown} style={{ outline: "none" }}>
      <a href="/board-games" className="text-sm text-violet-500 hover:underline no-underline">← 返回桌遊專區</a>

      {/* Header */}
      <div className="flex justify-between items-center mt-4 mb-4">
        <div className="text-sm text-slate-500">👣 {moves} 步</div>
        <div className="text-sm font-mono text-slate-500">⏱ {formatTime(time)}</div>
        <div className="text-sm font-bold text-violet-600">
          {DIFF_OPTIONS.find(d => d.key === diff)?.label}
        </div>
      </div>

      {/* Maze Grid */}
      <div className="bg-white rounded-2xl p-3 border border-violet-200 shadow-sm mb-4 overflow-auto">
        <div className="mx-auto" style={{ width: config.cols * config.cellSize + 2, height: config.rows * config.cellSize + 2 }}>
          <div className="relative border border-slate-800" style={{ width: config.cols * config.cellSize, height: config.rows * config.cellSize }}>
            {maze.map((row, r) =>
              row.map((cell, c) => {
                const isPlayer = playerPos[0] === r && playerPos[1] === c;
                const isGoal = r === goalPos[0] && c === goalPos[1];
                const isTrail = trail.has(`${r},${c}`);
                const size = config.cellSize;
                return (
                  <div
                    key={`${r}-${c}`}
                    className="absolute"
                    style={{
                      left: c * size,
                      top: r * size,
                      width: size,
                      height: size,
                      borderTop: cell.top ? "2px solid #334155" : "none",
                      borderRight: cell.right ? "2px solid #334155" : "none",
                      borderBottom: cell.bottom ? "2px solid #334155" : "none",
                      borderLeft: cell.left ? "2px solid #334155" : "none",
                      backgroundColor: isPlayer ? "#8b5cf6" : isGoal ? "#fbbf24" : isTrail ? "#ede9fe" : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: size * 0.55,
                      transition: "background-color 0.15s",
                    }}
                  >
                    {isPlayer ? "😊" : isGoal ? "⭐" : ""}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Direction Buttons (mobile-friendly) */}
      <div className="flex flex-col items-center gap-2 mt-4">
        <button onClick={() => movePlayer(-1, 0)}
          className="w-16 h-16 rounded-xl bg-violet-500 text-white text-2xl font-bold cursor-pointer border-none hover:bg-violet-600 active:scale-95 transition flex items-center justify-center">
          ↑
        </button>
        <div className="flex gap-2">
          <button onClick={() => movePlayer(0, -1)}
            className="w-16 h-16 rounded-xl bg-violet-500 text-white text-2xl font-bold cursor-pointer border-none hover:bg-violet-600 active:scale-95 transition flex items-center justify-center">
            ←
          </button>
          <button onClick={() => movePlayer(1, 0)}
            className="w-16 h-16 rounded-xl bg-violet-500 text-white text-2xl font-bold cursor-pointer border-none hover:bg-violet-600 active:scale-95 transition flex items-center justify-center">
            ↓
          </button>
          <button onClick={() => movePlayer(0, 1)}
            className="w-16 h-16 rounded-xl bg-violet-500 text-white text-2xl font-bold cursor-pointer border-none hover:bg-violet-600 active:scale-95 transition flex items-center justify-center">
            →
          </button>
        </div>
      </div>
      <p className="text-center text-xs text-slate-400 mt-2">也可使用鍵盤方向鍵或 WASD</p>
    </div>
  );
}
