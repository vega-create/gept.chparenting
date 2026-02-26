"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { playCorrect, playWrong, playPerfect, playVictory } from "@/lib/sounds";
import { useHighScore, getStars, GameOverScreen } from "@/lib/game-utils";

/* ─── Types ─── */
type Difficulty = "easy" | "medium" | "hard";
type Cell = 0 | 1 | 2; // 0=empty, 1=black(player), 2=white(AI)
type Board = Cell[][];

const SIZE = 9;
const DIFF_OPTIONS: { key: Difficulty; label: string; desc: string }[] = [
  { key: "easy", label: "初級", desc: "AI 隨機落子，適合初學" },
  { key: "medium", label: "中級", desc: "AI 偏好吃子與中央" },
  { key: "hard", label: "高級", desc: "AI 使用勢力圖評估" },
];

/* ─── Board Helpers ─── */
function emptyBoard(): Board {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(0) as Cell[]);
}

function cloneBoard(b: Board): Board {
  return b.map(r => [...r]);
}

function boardKey(b: Board): string {
  return b.map(r => r.join("")).join("");
}

function inBounds(r: number, c: number): boolean {
  return r >= 0 && r < SIZE && c >= 0 && c < SIZE;
}

const DIRS = [[-1, 0], [1, 0], [0, -1], [0, 1]];

/* Find all stones in the group containing (r,c) */
function getGroup(b: Board, r: number, c: number): [number, number][] {
  const color = b[r][c];
  if (color === 0) return [];
  const visited = new Set<string>();
  const group: [number, number][] = [];
  const stack: [number, number][] = [[r, c]];
  while (stack.length) {
    const [cr, cc] = stack.pop()!;
    const key = `${cr},${cc}`;
    if (visited.has(key)) continue;
    visited.add(key);
    group.push([cr, cc]);
    for (const [dr, dc] of DIRS) {
      const nr = cr + dr, nc = cc + dc;
      if (inBounds(nr, nc) && b[nr][nc] === color && !visited.has(`${nr},${nc}`)) {
        stack.push([nr, nc]);
      }
    }
  }
  return group;
}

/* Count liberties of a group */
function groupLiberties(b: Board, group: [number, number][]): number {
  const libs = new Set<string>();
  for (const [r, c] of group) {
    for (const [dr, dc] of DIRS) {
      const nr = r + dr, nc = c + dc;
      if (inBounds(nr, nc) && b[nr][nc] === 0) libs.add(`${nr},${nc}`);
    }
  }
  return libs.size;
}

/* Remove captured groups of a given color, return count removed */
function removeCaptures(b: Board, color: Cell): number {
  let removed = 0;
  const checked = new Set<string>();
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (b[r][c] !== color || checked.has(`${r},${c}`)) continue;
      const group = getGroup(b, r, c);
      group.forEach(([gr, gc]) => checked.add(`${gr},${gc}`));
      if (groupLiberties(b, group) === 0) {
        group.forEach(([gr, gc]) => { b[gr][gc] = 0; });
        removed += group.length;
      }
    }
  }
  return removed;
}

/* Check if a move is legal */
function isLegal(b: Board, r: number, c: number, color: Cell, prevKey: string | null): boolean {
  if (!inBounds(r, c) || b[r][c] !== 0) return false;
  const nb = cloneBoard(b);
  nb[r][c] = color;
  const opp: Cell = color === 1 ? 2 : 1;
  removeCaptures(nb, opp);
  // Suicide check
  const group = getGroup(nb, r, c);
  if (groupLiberties(nb, group) === 0) return false;
  // Ko check
  if (prevKey && boardKey(nb) === prevKey) return false;
  return true;
}

/* Apply a move, return [newBoard, capturedCount] */
function applyMove(b: Board, r: number, c: number, color: Cell): [Board, number] {
  const nb = cloneBoard(b);
  nb[r][c] = color;
  const opp: Cell = color === 1 ? 2 : 1;
  const captured = removeCaptures(nb, opp);
  return [nb, captured];
}

/* Chinese scoring: territory + stones on board */
function scoreBoard(b: Board): { black: number; white: number } {
  const owned = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
  const visited = new Set<string>();

  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (b[r][c] !== 0 || visited.has(`${r},${c}`)) continue;
      // BFS empty region
      const region: [number, number][] = [];
      const stack: [number, number][] = [[r, c]];
      let touchesBlack = false, touchesWhite = false;
      const regionVisited = new Set<string>();
      while (stack.length) {
        const [cr, cc] = stack.pop()!;
        const key = `${cr},${cc}`;
        if (regionVisited.has(key)) continue;
        regionVisited.add(key);
        visited.add(key);
        region.push([cr, cc]);
        for (const [dr, dc] of DIRS) {
          const nr = cr + dr, nc = cc + dc;
          if (!inBounds(nr, nc)) continue;
          if (b[nr][nc] === 1) touchesBlack = true;
          else if (b[nr][nc] === 2) touchesWhite = true;
          else if (!regionVisited.has(`${nr},${nc}`)) stack.push([nr, nc]);
        }
      }
      if (touchesBlack && !touchesWhite) region.forEach(([rr, rc]) => { owned[rr][rc] = 1; });
      else if (touchesWhite && !touchesBlack) region.forEach(([rr, rc]) => { owned[rr][rc] = 2; });
    }
  }

  let black = 0, white = 0;
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      if (b[r][c] === 1 || owned[r][c] === 1) black++;
      else if (b[r][c] === 2 || owned[r][c] === 2) white++;
    }
  }
  return { black, white };
}

/* ─── AI ─── */
function aiMove(b: Board, diff: Difficulty, prevKey: string | null): [number, number] | null {
  const legal: [number, number][] = [];
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++)
      if (isLegal(b, r, c, 2, prevKey)) legal.push([r, c]);

  if (legal.length === 0) return null;

  if (diff === "easy") {
    // 30% chance to pass
    if (Math.random() < 0.3) return null;
    return legal[Math.floor(Math.random() * legal.length)];
  }

  if (diff === "medium") {
    // Prefer captures, then center proximity
    const capturing: [number, number][] = [];
    for (const [r, c] of legal) {
      const [, cap] = applyMove(b, r, c, 2);
      if (cap > 0) capturing.push([r, c]);
    }
    if (capturing.length > 0 && Math.random() < 0.8) {
      return capturing[Math.floor(Math.random() * capturing.length)];
    }
    // Score by center distance
    const center = (SIZE - 1) / 2;
    const scored = legal.map(([r, c]) => ({
      pos: [r, c] as [number, number],
      score: -(Math.abs(r - center) + Math.abs(c - center)) + Math.random() * 3,
    }));
    scored.sort((a, b) => b.score - a.score);
    return scored[0].pos;
  }

  /* Hard: influence map */
  let bestScore = -Infinity;
  let bestMove = legal[0];
  for (const [r, c] of legal) {
    const [nb, cap] = applyMove(b, r, c, 2);
    let score = cap * 15;
    // Influence: count friendly neighbors and liberties
    const group = getGroup(nb, r, c);
    score += groupLiberties(nb, group) * 2;
    score += group.length;
    // Penalize edges
    const center = (SIZE - 1) / 2;
    const edgeDist = Math.min(r, c, SIZE - 1 - r, SIZE - 1 - c);
    if (edgeDist === 0) score -= 3;
    // Slight center preference
    score -= (Math.abs(r - center) + Math.abs(c - center)) * 0.5;
    // Threaten opponent groups
    for (const [dr, dc] of DIRS) {
      const nr = r + dr, nc = c + dc;
      if (inBounds(nr, nc) && nb[nr][nc] === 1) {
        const oppGroup = getGroup(nb, nr, nc);
        const oppLib = groupLiberties(nb, oppGroup);
        if (oppLib === 1) score += 10;
        else if (oppLib === 2) score += 4;
      }
    }
    score += Math.random() * 2;
    if (score > bestScore) { bestScore = score; bestMove = [r, c]; }
  }
  return bestMove;
}

/* ─── Component ─── */
export default function GoGamePage() {
  const [mode, setMode] = useState<"menu" | "playing" | "done">("menu");
  const [diff, setDiff] = useState<Difficulty>("easy");
  const [board, setBoard] = useState<Board>(emptyBoard);
  const [prevBoardKey, setPrevBoardKey] = useState<string | null>(null);
  const [lastMove, setLastMove] = useState<[number, number] | null>(null);
  const [capturedByBlack, setCapturedByBlack] = useState(0);
  const [capturedByWhite, setCapturedByWhite] = useState(0);
  const [consecutivePasses, setConsecutivePasses] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [score, setScore] = useState(0);
  const [isNewHigh, setIsNewHigh] = useState(false);
  const [finalScores, setFinalScores] = useState<{ black: number; white: number } | null>(null);
  const [aiThinking, setAiThinking] = useState(false);
  const [isBlackTurn, setIsBlackTurn] = useState(true);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { highScore, updateHighScore } = useHighScore("go-game");

  /* Timer */
  useEffect(() => {
    if (mode === "playing") {
      timerRef.current = setInterval(() => setElapsed(t => t + 1), 1000);
      return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }
    if (timerRef.current) clearInterval(timerRef.current);
  }, [mode]);

  const fmtTime = `${Math.floor(elapsed / 60).toString().padStart(2, "0")}:${(elapsed % 60).toString().padStart(2, "0")}`;

  /* End game */
  const endGame = useCallback((b: Board, bCap: number, wCap: number, resigned: boolean) => {
    if (timerRef.current) clearInterval(timerRef.current);
    const scores = scoreBoard(b);
    // White gets 6.5 komi (simplified)
    const whiteTotal = scores.white + 6.5;
    const blackTotal = scores.black;
    setFinalScores(scores);

    let pts: number;
    if (resigned) {
      pts = 0;
    } else if (blackTotal > whiteTotal) {
      const margin = blackTotal - whiteTotal;
      pts = Math.round(50 + margin * 5 + bCap * 2);
      playVictory();
    } else {
      pts = Math.max(Math.round(20 + bCap * 2 - (whiteTotal - blackTotal) * 2), 0);
    }
    setScore(pts);
    const newHigh = updateHighScore(pts);
    setIsNewHigh(newHigh);
    if (pts >= 100) playPerfect();
    setMode("done");
  }, [updateHighScore]);

  /* AI turn */
  const doAiTurn = useCallback((b: Board, pk: string | null, passes: number, bCap: number, wCap: number) => {
    setAiThinking(true);
    setTimeout(() => {
      const move = aiMove(b, diff, pk);
      if (move === null) {
        // AI passes
        const newPasses = passes + 1;
        setConsecutivePasses(newPasses);
        setIsBlackTurn(true);
        setAiThinking(false);
        if (newPasses >= 2) {
          endGame(b, bCap, wCap, false);
        }
        return;
      }
      const [r, c] = move;
      const prevKey = boardKey(b);
      const [nb, cap] = applyMove(b, r, c, 2);
      const newWCap = wCap + cap;
      if (cap > 0) playWrong();
      setBoard(nb);
      setPrevBoardKey(prevKey);
      setLastMove([r, c]);
      setCapturedByWhite(newWCap);
      setConsecutivePasses(0);
      setIsBlackTurn(true);
      setAiThinking(false);
    }, 400);
  }, [diff, endGame]);

  /* Player move */
  const handleCellClick = useCallback((r: number, c: number) => {
    if (mode !== "playing" || !isBlackTurn || aiThinking) return;
    if (!isLegal(board, r, c, 1, prevBoardKey)) {
      playWrong();
      return;
    }
    const prevKey = boardKey(board);
    const [nb, cap] = applyMove(board, r, c, 1);
    const newBCap = capturedByBlack + cap;
    if (cap > 0) playCorrect();
    setBoard(nb);
    setPrevBoardKey(prevKey);
    setLastMove([r, c]);
    setCapturedByBlack(newBCap);
    setConsecutivePasses(0);
    setIsBlackTurn(false);

    doAiTurn(nb, prevKey, 0, newBCap, capturedByWhite);
  }, [mode, isBlackTurn, aiThinking, board, prevBoardKey, capturedByBlack, capturedByWhite, doAiTurn]);

  /* Pass */
  const handlePass = useCallback(() => {
    if (mode !== "playing" || !isBlackTurn || aiThinking) return;
    const newPasses = consecutivePasses + 1;
    setConsecutivePasses(newPasses);
    setIsBlackTurn(false);
    if (newPasses >= 2) {
      endGame(board, capturedByBlack, capturedByWhite, false);
      return;
    }
    doAiTurn(board, prevBoardKey, newPasses, capturedByBlack, capturedByWhite);
  }, [mode, isBlackTurn, aiThinking, consecutivePasses, board, prevBoardKey, capturedByBlack, capturedByWhite, endGame, doAiTurn]);

  /* Resign */
  const handleResign = useCallback(() => {
    if (mode !== "playing") return;
    endGame(board, capturedByBlack, capturedByWhite, true);
  }, [mode, board, capturedByBlack, capturedByWhite, endGame]);

  /* Start game */
  const startGame = useCallback((d: Difficulty) => {
    setDiff(d);
    setBoard(emptyBoard());
    setPrevBoardKey(null);
    setLastMove(null);
    setCapturedByBlack(0);
    setCapturedByWhite(0);
    setConsecutivePasses(0);
    setElapsed(0);
    setScore(0);
    setIsNewHigh(false);
    setFinalScores(null);
    setAiThinking(false);
    setIsBlackTurn(true);
    setMode("playing");
  }, []);

  /* ─── Render: Menu ─── */
  if (mode === "menu") {
    return (
      <div className="max-w-lg mx-auto px-4 py-8 animate-fadeIn">
        <a href="/board-games" className="text-sm text-blue-500 hover:underline no-underline">
          &larr; 返回桌遊專區
        </a>
        <div className="text-center mt-6 mb-8">
          <div className="text-5xl mb-3">&#9898;</div>
          <h1 className="text-2xl font-black text-slate-800 mb-2">圍棋入門</h1>
          <p className="text-slate-500 text-sm">9&times;9 小棋盤，體驗圍棋的樂趣</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-amber-200 shadow-sm mb-6">
          <h3 className="font-bold text-slate-700 mb-1">遊戲規則</h3>
          <ul className="text-sm text-slate-500 space-y-1 list-disc list-inside">
            <li>你執黑先行，與 AI 白棋輪流落子</li>
            <li>圍住對方棋子（無氣）即可提子</li>
            <li>不可自殺、不可打劫（Ko）</li>
            <li>雙方連續虛手（PASS）則結束</li>
            <li>中國規則計分：地盤 + 棋子數</li>
            <li>最高紀錄：{highScore} 分</li>
          </ul>
        </div>
        <div className="space-y-3">
          {DIFF_OPTIONS.map(d => (
            <button
              key={d.key}
              onClick={() => startGame(d.key)}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold text-left cursor-pointer border-none hover:opacity-90 transition"
            >
              <div className="text-lg">{d.label}</div>
              <div className="text-xs opacity-80">{d.desc}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  /* ─── Render: Done ─── */
  if (mode === "done") {
    const stars = getStars(score, 150);
    const whiteTotal = finalScores ? finalScores.white + 6.5 : 0;
    return (
      <div className="max-w-lg mx-auto px-4 py-8 animate-fadeIn">
        <a href="/board-games" className="text-sm text-blue-500 hover:underline no-underline">
          &larr; 返回桌遊專區
        </a>
        <div className="text-center text-sm text-slate-500 mt-4 mb-2">
          {finalScores && (
            <>
              黑 {finalScores.black} 目 vs 白 {whiteTotal} 目（含貼 6.5 目）
              {finalScores.black > whiteTotal ? " ── 黑勝！" : " ── 白勝"}
            </>
          )}
        </div>
        <div className="text-center text-xs text-slate-400 mb-2">
          提子：黑吃 {capturedByBlack} 子 / 白吃 {capturedByWhite} 子 ・ 用時 {fmtTime}
        </div>
        <GameOverScreen
          score={score}
          maxScore={150}
          gameName="圍棋入門"
          stars={stars}
          highScore={Math.max(highScore, score)}
          isNewHigh={isNewHigh}
          onRestart={() => startGame(diff)}
          onBack={() => setMode("menu")}
          trackingData={{ subject: "board-game", activityType: "game", activityId: "go-game", activityName: "圍棋" }}
        />
      </div>
    );
  }

  /* ─── Render: Playing ─── */
  const cellSize = `calc(min(100vw - 32px, 400px) / ${SIZE})`;

  return (
    <div className="max-w-lg mx-auto px-4 py-6 animate-fadeIn">
      <a href="/board-games" className="text-sm text-blue-500 hover:underline no-underline">
        &larr; 返回桌遊專區
      </a>

      {/* Status bar */}
      <div className="flex justify-between items-center mt-3 mb-3 text-sm">
        <span className="text-slate-500">&#9200; {fmtTime}</span>
        <span className={`font-bold ${isBlackTurn && !aiThinking ? "text-slate-800" : "text-slate-400"}`}>
          {aiThinking ? "白棋思考中..." : isBlackTurn ? "輪到你（黑）" : ""}
        </span>
      </div>

      {/* Captures */}
      <div className="flex justify-between items-center mb-3 text-sm">
        <span className="flex items-center gap-1">
          <span className="inline-block w-4 h-4 rounded-full bg-black border border-slate-300" />
          <span className="text-slate-600">提子 {capturedByBlack}</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="text-slate-600">提子 {capturedByWhite}</span>
          <span className="inline-block w-4 h-4 rounded-full bg-white border border-slate-300" />
        </span>
      </div>

      {/* Board */}
      <div
        className="mx-auto relative rounded-lg overflow-hidden shadow-md"
        style={{
          width: `min(100vw - 32px, 400px)`,
          height: `min(100vw - 32px, 400px)`,
          backgroundColor: "#DEB887",
        }}
      >
        {/* Grid lines */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          preserveAspectRatio="none"
        >
          {Array.from({ length: SIZE }).map((_, i) => (
            <g key={i}>
              <line
                x1={0.5} y1={i + 0.5} x2={SIZE - 0.5} y2={i + 0.5}
                stroke="#8B6914" strokeWidth={0.03}
              />
              <line
                x1={i + 0.5} y1={0.5} x2={i + 0.5} y2={SIZE - 0.5}
                stroke="#8B6914" strokeWidth={0.03}
              />
            </g>
          ))}
          {/* Star points (hoshi) for 9x9 */}
          {[[2, 2], [2, 6], [6, 2], [6, 6], [4, 4]].map(([r, c]) => (
            <circle key={`${r}-${c}`} cx={c + 0.5} cy={r + 0.5} r={0.08} fill="#8B6914" />
          ))}
        </svg>

        {/* Cells grid */}
        <div
          className="relative w-full h-full grid"
          style={{
            gridTemplateColumns: `repeat(${SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${SIZE}, 1fr)`,
          }}
        >
          {board.map((row, r) =>
            row.map((cell, c) => (
              <div
                key={`${r}-${c}`}
                className="relative flex items-center justify-center cursor-pointer"
                onClick={() => handleCellClick(r, c)}
              >
                {cell === 1 && (
                  <div
                    className="rounded-full"
                    style={{
                      width: "85%",
                      height: "85%",
                      background: "radial-gradient(circle at 35% 35%, #555, #000)",
                      boxShadow: "1px 2px 4px rgba(0,0,0,0.5)",
                    }}
                  />
                )}
                {cell === 2 && (
                  <div
                    className="rounded-full"
                    style={{
                      width: "85%",
                      height: "85%",
                      background: "radial-gradient(circle at 35% 35%, #fff, #ccc)",
                      boxShadow: "1px 2px 4px rgba(0,0,0,0.3)",
                      border: "1px solid #bbb",
                    }}
                  />
                )}
                {/* Last move indicator */}
                {lastMove && lastMove[0] === r && lastMove[1] === c && cell !== 0 && (
                  <div
                    className="absolute rounded-full"
                    style={{
                      width: "20%",
                      height: "20%",
                      backgroundColor: cell === 1 ? "#f87171" : "#ef4444",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 justify-center mt-4">
        <button
          onClick={handlePass}
          disabled={!isBlackTurn || aiThinking}
          className="px-5 py-2.5 rounded-xl bg-slate-200 text-slate-700 font-bold cursor-pointer border-none hover:bg-slate-300 transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          虛手 (PASS)
        </button>
        <button
          onClick={handleResign}
          className="px-5 py-2.5 rounded-xl bg-red-100 text-red-600 font-bold cursor-pointer border-none hover:bg-red-200 transition"
        >
          認輸
        </button>
      </div>
    </div>
  );
}
