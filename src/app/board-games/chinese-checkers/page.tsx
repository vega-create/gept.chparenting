"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { playCorrect, playWrong, playPerfect, playVictory } from "@/lib/sounds";
import { useHighScore, getStars, GameOverScreen } from "@/lib/game-utils";

/* ─── Types ─── */
type Difficulty = "easy" | "medium" | "hard";
type Mode = "menu" | "playing" | "done";
type Cell = "empty" | "player" | "ai" | null; // null = not a valid position
type Pos = { r: number; c: number };

/* ─── Board Definition ─── */
// Star board: 17 rows. Each row has a specific width and offset.
// Row structure: [rowIndex, numCells, regionTag]
// Regions: "top" (AI home), "mid" (shared), "bot" (Player home)
const ROW_DEFS: { count: number; region: "top" | "mid" | "bot" }[] = [
  { count: 1, region: "top" },   // row 0
  { count: 2, region: "top" },   // row 1
  { count: 3, region: "top" },   // row 2
  { count: 4, region: "top" },   // row 3
  { count: 13, region: "mid" },  // row 4
  { count: 12, region: "mid" },  // row 5
  { count: 11, region: "mid" },  // row 6
  { count: 10, region: "mid" },  // row 7
  { count: 9, region: "mid" },   // row 8
  { count: 10, region: "mid" },  // row 9
  { count: 11, region: "mid" },  // row 10
  { count: 12, region: "mid" },  // row 11
  { count: 13, region: "mid" },  // row 12
  { count: 4, region: "bot" },   // row 13
  { count: 3, region: "bot" },   // row 14
  { count: 2, region: "bot" },   // row 15
  { count: 1, region: "bot" },   // row 16
];

const TOTAL_ROWS = ROW_DEFS.length;
const MAX_COLS = 13;

// Build valid positions set
function buildBoard(): Cell[][] {
  const board: Cell[][] = [];
  for (let r = 0; r < TOTAL_ROWS; r++) {
    const row: Cell[] = Array(MAX_COLS).fill(null);
    const { count, region } = ROW_DEFS[r];
    const offset = Math.floor((MAX_COLS - count) / 2);
    for (let i = 0; i < count; i++) {
      const c = offset + i;
      if (region === "top") row[c] = "ai";
      else if (region === "bot") row[c] = "player";
      else row[c] = "empty";
    }
    board.push(row);
  }
  return board;
}

function isValid(r: number, c: number, board: Cell[][]): boolean {
  return r >= 0 && r < TOTAL_ROWS && c >= 0 && c < MAX_COLS && board[r][c] !== null;
}

function posKey(r: number, c: number): string { return `${r},${c}`; }

// The player's goal zone is rows 0-3 (AI's home), AI's goal zone is rows 13-16 (player's home)
function isPlayerGoal(r: number): boolean { return r <= 3; }
function isAIGoal(r: number): boolean { return r >= 13; }

function getGoalPositions(region: "top" | "bot"): Pos[] {
  const positions: Pos[] = [];
  for (let r = 0; r < TOTAL_ROWS; r++) {
    const { count, region: reg } = ROW_DEFS[r];
    if (reg !== region) continue;
    const offset = Math.floor((MAX_COLS - count) / 2);
    for (let i = 0; i < count; i++) {
      positions.push({ r, c: offset + i });
    }
  }
  return positions;
}

/* ─── Adjacency: 6 hex neighbors ─── */
// Even rows: neighbors are (r-1,c-1),(r-1,c),(r,c-1),(r,c+1),(r+1,c-1),(r+1,c)
// Odd rows: neighbors are (r-1,c),(r-1,c+1),(r,c-1),(r,c+1),(r+1,c),(r+1,c+1)
// But since our grid is rectangular with offsets, we use a simpler model:
// All cells can connect to their 6 neighbors in a hex-like grid.
// For the star board, adjacency depends on row width changes.
// We'll use direct step and jump logic per row.

function getNeighbors(r: number, c: number): Pos[] {
  // For hex grid with offset coordinates (odd-r offset):
  // We treat even rows as shifted left, odd rows as normal
  const isEven = r % 2 === 0;
  const dirs = isEven
    ? [[-1, -1], [-1, 0], [0, -1], [0, 1], [1, -1], [1, 0]]
    : [[-1, 0], [-1, 1], [0, -1], [0, 1], [1, 0], [1, 1]];
  return dirs.map(([dr, dc]) => ({ r: r + dr, c: c + dc }));
}

/* ─── Move finding ─── */
function findSteps(r: number, c: number, board: Cell[][]): Pos[] {
  return getNeighbors(r, c).filter(n => isValid(n.r, n.c, board) && board[n.r][n.c] === "empty");
}

function findJumps(r: number, c: number, board: Cell[][]): Pos[] {
  const result: Pos[] = [];
  const visited = new Set<string>();
  visited.add(posKey(r, c));

  function dfs(cr: number, cc: number) {
    const neighbors = getNeighbors(cr, cc);
    for (const n of neighbors) {
      if (!isValid(n.r, n.c, board)) continue;
      if (board[n.r][n.c] !== "player" && board[n.r][n.c] !== "ai") continue;
      // There's a piece at n, check if we can jump over it
      const jr = n.r + (n.r - cr);
      const jc = n.c + (n.c - cc);
      if (!isValid(jr, jc, board)) continue;
      if (board[jr][jc] !== "empty") continue;
      const key = posKey(jr, jc);
      if (visited.has(key)) continue;
      visited.add(key);
      result.push({ r: jr, c: jc });
      dfs(jr, jc);
    }
  }
  dfs(r, c);
  return result;
}

function findAllMoves(r: number, c: number, board: Cell[][]): Pos[] {
  return [...findSteps(r, c, board), ...findJumps(r, c, board)];
}

/* ─── Win check ─── */
function checkWin(board: Cell[][], who: "player" | "ai"): boolean {
  const goalRegion = who === "player" ? "top" : "bot";
  const goals = getGoalPositions(goalRegion);
  return goals.every(g => board[g.r][g.c] === who);
}

/* ─── Piece positions ─── */
function getPieces(board: Cell[][], who: "player" | "ai"): Pos[] {
  const pieces: Pos[] = [];
  for (let r = 0; r < TOTAL_ROWS; r++)
    for (let c = 0; c < MAX_COLS; c++)
      if (board[r][c] === who) pieces.push({ r, c });
  return pieces;
}

/* ─── AI Logic ─── */
function aiMove(board: Cell[][], diff: Difficulty): { from: Pos; to: Pos } | null {
  const pieces = getPieces(board, "ai");
  const allMoves: { from: Pos; to: Pos; score: number }[] = [];

  for (const p of pieces) {
    const moves = findAllMoves(p.r, p.c, board);
    for (const m of moves) {
      let score = 0;
      if (diff === "easy") {
        score = Math.random() * 100;
      } else if (diff === "medium") {
        // Prefer moves that go down (toward player's home = AI goal)
        score = (m.r - p.r) * 10 + Math.random() * 5;
        if (isAIGoal(m.r)) score += 50;
      } else {
        // Hard: evaluate position advancement + jump bonus
        score = (m.r - p.r) * 15;
        if (isAIGoal(m.r)) score += 80;
        // Bonus for longer jumps
        const dist = Math.abs(m.r - p.r) + Math.abs(m.c - p.c);
        if (dist > 2) score += dist * 5;
        // Penalize staying in own home when not needed
        if (isPlayerGoal(p.r) && !isPlayerGoal(m.r)) score += 20;
        // Prefer centering toward column 6
        score -= Math.abs(m.c - 6) * 2;
        score += Math.random() * 3;
      }
      allMoves.push({ from: p, to: m, score });
    }
  }

  if (allMoves.length === 0) return null;
  allMoves.sort((a, b) => b.score - a.score);

  if (diff === "hard") {
    // Pick from top 3
    const top = allMoves.slice(0, Math.min(3, allMoves.length));
    return top[Math.floor(Math.random() * top.length)];
  }
  if (diff === "medium") {
    const top = allMoves.slice(0, Math.min(5, allMoves.length));
    return top[Math.floor(Math.random() * top.length)];
  }
  // Easy: random
  return allMoves[Math.floor(Math.random() * allMoves.length)];
}

/* ─── Scoring ─── */
function calcScore(moves: number, board: Cell[][]): number {
  const goalPos = getGoalPositions("top");
  const inGoal = goalPos.filter(g => board[g.r][g.c] === "player").length;
  // Base score from pieces in goal (max 100 from 10 pieces)
  const goalScore = inGoal * 10;
  // Efficiency bonus: fewer moves = higher bonus (max ~50)
  const efficiencyBonus = Math.max(0, 50 - Math.floor(moves / 2));
  return goalScore + efficiencyBonus;
}

/* ─── Position to pixel (for rendering) ─── */
const CELL_SIZE = 28;
const CELL_GAP = 2;

function cellPosition(r: number, c: number): { x: number; y: number } {
  const { count } = ROW_DEFS[r];
  const totalWidth = MAX_COLS * (CELL_SIZE + CELL_GAP);
  const rowWidth = count * (CELL_SIZE + CELL_GAP);
  const rowOffset = (totalWidth - rowWidth) / 2;
  const offset = Math.floor((MAX_COLS - count) / 2);
  const colInRow = c - offset;
  return {
    x: rowOffset + colInRow * (CELL_SIZE + CELL_GAP) + CELL_SIZE / 2,
    y: r * (CELL_SIZE + CELL_GAP) + CELL_SIZE / 2,
  };
}

/* ─── Difficulty options ─── */
const DIFF_OPTIONS: { key: Difficulty; label: string; desc: string }[] = [
  { key: "easy", label: "初級", desc: "AI 隨機移動" },
  { key: "medium", label: "中級", desc: "AI 優先前進" },
  { key: "hard", label: "高級", desc: "AI 策略思考" },
];

/* ─── Main Component ─── */
export default function ChineseCheckersPage() {
  const [mode, setMode] = useState<Mode>("menu");
  const [diff, setDiff] = useState<Difficulty>("easy");
  const [board, setBoard] = useState<Cell[][]>([]);
  const [selected, setSelected] = useState<Pos | null>(null);
  const [validMoves, setValidMoves] = useState<Pos[]>([]);
  const [turn, setTurn] = useState<"player" | "ai">("player");
  const [moveCount, setMoveCount] = useState(0);
  const [score, setScore] = useState(0);
  const [isNewHigh, setIsNewHigh] = useState(false);
  const [message, setMessage] = useState("");
  const aiTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { highScore, updateHighScore } = useHighScore("chinese-checkers");

  const startGame = useCallback((d: Difficulty) => {
    setDiff(d);
    setBoard(buildBoard());
    setSelected(null);
    setValidMoves([]);
    setTurn("player");
    setMoveCount(0);
    setScore(0);
    setIsNewHigh(false);
    setMessage("你的回合 - 選擇一顆棋子");
    setMode("playing");
  }, []);

  const endGame = useCallback((winner: "player" | "ai", b: Cell[][]) => {
    if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
    if (winner === "player") {
      const finalScore = calcScore(moveCount, b);
      setScore(finalScore);
      const newHigh = updateHighScore(finalScore);
      setIsNewHigh(newHigh);
      if (moveCount < 30) playPerfect();
      else playVictory();
      setMessage("恭喜你贏了！");
    } else {
      setScore(Math.max(calcScore(moveCount, b) - 20, 0));
      playWrong();
      setMessage("AI 獲勝了！");
    }
    setMode("done");
  }, [moveCount, updateHighScore]);

  /* ─── Handle AI turn ─── */
  useEffect(() => {
    if (mode !== "playing" || turn !== "ai") return;
    setMessage("AI 思考中...");
    aiTimerRef.current = setTimeout(() => {
      const move = aiMove(board, diff);
      if (!move) {
        // AI stuck, player wins
        endGame("player", board);
        return;
      }
      const newBoard = board.map(row => [...row]);
      newBoard[move.from.r][move.from.c] = "empty";
      newBoard[move.to.r][move.to.c] = "ai";
      setBoard(newBoard);

      if (checkWin(newBoard, "ai")) {
        endGame("ai", newBoard);
        return;
      }
      setTurn("player");
      setMessage("你的回合 - 選擇一顆棋子");
    }, 600);

    return () => { if (aiTimerRef.current) clearTimeout(aiTimerRef.current); };
  }, [turn, mode, board, diff, endGame]);

  /* ─── Handle cell click ─── */
  const handleCellClick = useCallback((r: number, c: number) => {
    if (mode !== "playing" || turn !== "player") return;
    const cell = board[r][c];

    // If clicking on own piece, select it
    if (cell === "player") {
      const moves = findAllMoves(r, c, board);
      if (moves.length === 0) {
        playWrong();
        setMessage("這顆棋子無法移動");
        return;
      }
      setSelected({ r, c });
      setValidMoves(moves);
      playCorrect();
      setMessage(`已選擇棋子 - 點擊綠點移動`);
      return;
    }

    // If clicking on a valid move target
    if (selected && validMoves.some(m => m.r === r && m.c === c)) {
      const newBoard = board.map(row => [...row]);
      newBoard[selected.r][selected.c] = "empty";
      newBoard[r][c] = "player";
      setBoard(newBoard);
      setSelected(null);
      setValidMoves([]);
      setMoveCount(m => m + 1);
      playCorrect();

      if (checkWin(newBoard, "player")) {
        endGame("player", newBoard);
        return;
      }
      setTurn("ai");
      return;
    }

    // Deselect
    if (selected) {
      setSelected(null);
      setValidMoves([]);
      setMessage("你的回合 - 選擇一顆棋子");
    }
  }, [mode, turn, board, selected, validMoves, endGame]);

  const boardWidth = MAX_COLS * (CELL_SIZE + CELL_GAP);
  const boardHeight = TOTAL_ROWS * (CELL_SIZE + CELL_GAP);
  const validSet = new Set(validMoves.map(m => posKey(m.r, m.c)));

  /* ─── Menu ─── */
  if (mode === "menu") {
    return (
      <div className="max-w-lg mx-auto px-4 py-8 animate-fadeIn">
        <a href="/board-games" className="text-sm text-indigo-500 hover:underline no-underline">
          ← 返回桌遊專區
        </a>
        <div className="text-center mt-6 mb-8">
          <div className="text-5xl mb-3">⭐</div>
          <h1 className="text-2xl font-black text-slate-800 mb-2">跳棋</h1>
          <p className="text-slate-500 text-sm">經典中國跳棋，挑戰 AI 對手</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-indigo-200 shadow-sm mb-6">
          <h3 className="font-bold text-slate-700 mb-1">遊戲規則</h3>
          <ul className="text-sm text-slate-500 space-y-1 list-disc list-inside">
            <li>你是藍色棋子（下方），AI 是紅色棋子（上方）</li>
            <li>每回合移動一顆棋子到相鄰空位</li>
            <li>可以跳過其他棋子，連續跳躍</li>
            <li>先將所有棋子移到對面三角區即獲勝</li>
            <li>步數越少分數越高</li>
          </ul>
        </div>
        <div className="space-y-3">
          {DIFF_OPTIONS.map(d => (
            <button
              key={d.key}
              onClick={() => startGame(d.key)}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-bold text-left cursor-pointer border-none hover:opacity-90 transition"
            >
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
        <a href="/board-games" className="text-sm text-indigo-500 hover:underline no-underline">
          ← 返回桌遊專區
        </a>
        <GameOverScreen
          score={score}
          maxScore={100}
          gameName="跳棋"
          stars={stars}
          highScore={Math.max(highScore, score)}
          isNewHigh={isNewHigh}
          onRestart={() => startGame(diff)}
          onBack={() => setMode("menu")}
          trackingData={{ subject: "board-game", activityType: "game", activityId: "chinese-checkers", activityName: "跳棋" }}
        />
      </div>
    );
  }

  /* ─── Playing ─── */
  return (
    <div className="max-w-lg mx-auto px-4 py-6 animate-fadeIn">
      <a href="/board-games" className="text-sm text-indigo-500 hover:underline no-underline">
        ← 返回桌遊專區
      </a>

      {/* Header */}
      <div className="flex justify-between items-center mt-3 mb-3">
        <div className="flex items-center gap-3">
          <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-600 font-bold">
            🔴 AI
          </span>
          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-600 font-bold">
            🔵 你
          </span>
        </div>
        <div className="text-sm font-mono text-slate-500">步數：{moveCount}</div>
      </div>

      {/* Status bar */}
      <div className={`text-center text-sm font-bold mb-3 py-2 rounded-lg ${
        turn === "player"
          ? "bg-blue-50 text-blue-600"
          : "bg-red-50 text-red-600"
      }`}>
        {message}
      </div>

      {/* Board */}
      <div className="bg-white rounded-2xl p-3 border border-indigo-200 shadow-sm mb-4 overflow-x-auto">
        <div
          className="relative mx-auto"
          style={{ width: boardWidth, height: boardHeight }}
        >
          {board.map((row, r) =>
            row.map((cell, c) => {
              if (cell === null) return null;
              const { x, y } = cellPosition(r, c);
              const isSelected = selected?.r === r && selected?.c === c;
              const isValidTarget = validSet.has(posKey(r, c));
              const isPlayerGoalCell = isPlayerGoal(r);
              const isAIGoalCell = isAIGoal(r);

              let bg = "bg-slate-200"; // empty
              let border = "border-slate-300";
              let shadow = "";
              let scale = "";
              let zIndex = 1;

              if (cell === "player") {
                bg = "bg-blue-500";
                border = "border-blue-600";
                shadow = "shadow-md";
                if (isSelected) {
                  bg = "bg-blue-400";
                  border = "border-blue-300";
                  shadow = "shadow-lg shadow-blue-300/50";
                  scale = "scale-110";
                  zIndex = 10;
                }
              } else if (cell === "ai") {
                bg = "bg-red-500";
                border = "border-red-600";
                shadow = "shadow-md";
              } else if (isValidTarget) {
                bg = "bg-green-400/50";
                border = "border-green-500";
                zIndex = 5;
              } else if (isPlayerGoalCell) {
                bg = "bg-red-100";
                border = "border-red-200";
              } else if (isAIGoalCell) {
                bg = "bg-blue-100";
                border = "border-blue-200";
              }

              return (
                <button
                  key={posKey(r, c)}
                  onClick={() => handleCellClick(r, c)}
                  className={`absolute rounded-full border-2 transition-all duration-150 cursor-pointer
                    ${bg} ${border} ${shadow} ${scale}
                    ${isValidTarget ? "animate-pulse" : ""}
                    ${cell === "player" && turn === "player" ? "hover:brightness-110" : ""}
                  `}
                  style={{
                    width: CELL_SIZE,
                    height: CELL_SIZE,
                    left: x - CELL_SIZE / 2,
                    top: y - CELL_SIZE / 2,
                    zIndex,
                  }}
                  title={
                    cell === "player" ? "你的棋子"
                    : cell === "ai" ? "AI 棋子"
                    : isValidTarget ? "可移動位置"
                    : "空位"
                  }
                />
              );
            })
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-4 text-xs text-slate-400 mb-2">
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-full bg-blue-100 border border-blue-200" />
          你的目標區
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-full bg-red-100 border border-red-200" />
          AI 目標區
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-full bg-green-400/50 border border-green-500" />
          可移動
        </span>
      </div>

      {/* Piece counts */}
      <div className="flex justify-between text-xs text-slate-500 px-2">
        <span>
          你在目標區：{getGoalPositions("top").filter(g => board[g.r]?.[g.c] === "player").length}/10
        </span>
        <span>
          AI 在目標區：{getGoalPositions("bot").filter(g => board[g.r]?.[g.c] === "ai").length}/10
        </span>
      </div>
    </div>
  );
}
