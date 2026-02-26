"use client";
import { useState, useCallback, useRef } from "react";
import { playCorrect, playWrong, playPerfect, playVictory } from "@/lib/sounds";
import { useHighScore, getStars, GameOverScreen } from "@/lib/game-utils";

/* ─── Level Data ─── */
type Dir = "up" | "down" | "left" | "right";
const DIR_EMOJI: Record<Dir, string> = { up: "⬆️", down: "⬇️", left: "⬅️", right: "➡️" };
const DIR_DELTA: Record<Dir, [number, number]> = { up: [-1, 0], down: [1, 0], left: [0, -1], right: [0, 1] };

interface Level {
  size: number;
  start: [number, number];
  goal: [number, number];
  walls: [number, number][];
  maxMoves: number;
  hint?: string;
}

const LEVELS: Level[] = [
  { size: 5, start: [0, 0], goal: [0, 4], walls: [], maxMoves: 4, hint: "試試往右走 4 步" },
  { size: 5, start: [0, 0], goal: [4, 0], walls: [], maxMoves: 4, hint: "試試往下走 4 步" },
  { size: 5, start: [0, 0], goal: [4, 4], walls: [], maxMoves: 8, hint: "先往右再往下" },
  { size: 5, start: [0, 0], goal: [4, 4], walls: [[0, 1], [1, 1], [2, 1]], maxMoves: 10, hint: "繞過牆壁" },
  { size: 5, start: [0, 0], goal: [4, 4], walls: [[1, 0], [1, 1], [1, 2], [3, 2], [3, 3], [3, 4]], maxMoves: 12, hint: "找到迷宮路線" },
  { size: 5, start: [2, 0], goal: [2, 4], walls: [[0, 2], [1, 2], [2, 2], [3, 2]], maxMoves: 10, hint: "需要繞一大圈" },
  { size: 5, start: [0, 0], goal: [4, 4], walls: [[0, 2], [1, 2], [2, 0], [2, 1], [2, 3], [2, 4], [4, 2]], maxMoves: 14 },
  { size: 5, start: [4, 0], goal: [0, 4], walls: [[1, 1], [1, 3], [2, 2], [3, 1], [3, 3]], maxMoves: 12 },
];

const TOTAL_LEVELS = LEVELS.length;

export default function CodePathPage() {
  const [mode, setMode] = useState<"menu" | "playing" | "running" | "done">("menu");
  const [level, setLevel] = useState(0);
  const [commands, setCommands] = useState<Dir[]>([]);
  const [robotPos, setRobotPos] = useState<[number, number]>([0, 0]);
  const [path, setPath] = useState<[number, number][]>([]);
  const [runResult, setRunResult] = useState<"success" | "fail" | "wall" | null>(null);
  const [score, setScore] = useState(0);
  const [isNewHigh, setIsNewHigh] = useState(false);
  const { highScore, updateHighScore } = useHighScore("code-path");
  const runTimeoutRef = useRef<NodeJS.Timeout[]>([]);

  const currentLevel = LEVELS[level] || LEVELS[0];
  const wallSet = new Set(currentLevel.walls.map(w => `${w[0]},${w[1]}`));

  const startGame = useCallback(() => {
    setLevel(0);
    setScore(0);
    setCommands([]);
    setRobotPos(LEVELS[0].start);
    setPath([]);
    setRunResult(null);
    setMode("playing");
    setIsNewHigh(false);
  }, []);

  const addCommand = (dir: Dir) => {
    if (commands.length >= currentLevel.maxMoves) return;
    setCommands(prev => [...prev, dir]);
  };

  const removeCommand = (idx: number) => {
    setCommands(prev => prev.filter((_, i) => i !== idx));
  };

  const clearCommands = () => setCommands([]);

  const runProgram = useCallback(() => {
    if (commands.length === 0) return;
    setMode("running");
    setPath([currentLevel.start]);
    setRobotPos(currentLevel.start);
    setRunResult(null);

    let pos: [number, number] = [...currentLevel.start] as [number, number];
    const positions: [number, number][] = [pos];
    let hitWall = false;

    for (const cmd of commands) {
      const [dr, dc] = DIR_DELTA[cmd];
      const nr = pos[0] + dr;
      const nc = pos[1] + dc;

      if (nr < 0 || nr >= currentLevel.size || nc < 0 || nc >= currentLevel.size) {
        hitWall = true;
        break;
      }
      if (wallSet.has(`${nr},${nc}`)) {
        hitWall = true;
        break;
      }
      pos = [nr, nc];
      positions.push([...pos] as [number, number]);
    }

    // Animate step by step
    runTimeoutRef.current.forEach(clearTimeout);
    runTimeoutRef.current = [];

    positions.forEach((p, i) => {
      const t = setTimeout(() => {
        setRobotPos(p);
        setPath(positions.slice(0, i + 1));

        if (i === positions.length - 1) {
          // Last step
          if (hitWall) {
            setRunResult("wall");
            playWrong();
            setTimeout(() => { setMode("playing"); setRunResult(null); setPath([]); setRobotPos(currentLevel.start); }, 1500);
          } else if (p[0] === currentLevel.goal[0] && p[1] === currentLevel.goal[1]) {
            setRunResult("success");
            const points = Math.max(15 - commands.length, 5);
            setScore(s => s + points);
            playCorrect();
            setTimeout(() => {
              if (level + 1 >= TOTAL_LEVELS) {
                const finalScore = score + points;
                const newHigh = updateHighScore(finalScore);
                setIsNewHigh(newHigh);
                if (finalScore >= TOTAL_LEVELS * 10) playPerfect();
                else playVictory();
                setMode("done");
              } else {
                const nextLv = level + 1;
                setLevel(nextLv);
                setCommands([]);
                setRobotPos(LEVELS[nextLv].start);
                setPath([]);
                setRunResult(null);
                setMode("playing");
              }
            }, 1200);
          } else {
            setRunResult("fail");
            playWrong();
            setTimeout(() => { setMode("playing"); setRunResult(null); setPath([]); setRobotPos(currentLevel.start); }, 1500);
          }
        }
      }, i * 400);
      runTimeoutRef.current.push(t);
    });
  }, [commands, currentLevel, level, score, wallSet, updateHighScore]);

  /* ─── Menu ─── */
  if (mode === "menu") {
    return (
      <div className="max-w-lg mx-auto px-4 py-8 animate-fadeIn">
        <a href="/board-games" className="text-sm text-cyan-500 hover:underline no-underline">← 返回桌遊專區</a>
        <div className="text-center mt-6 mb-8">
          <div className="text-5xl mb-3">🤖</div>
          <h1 className="text-2xl font-black text-slate-800 mb-2">程式路徑</h1>
          <p className="text-slate-500 text-sm">編寫指令，引導機器人到達目標</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-cyan-200 shadow-sm mb-6">
          <h3 className="font-bold text-slate-700 mb-1">遊戲規則</h3>
          <ul className="text-sm text-slate-500 space-y-1 list-disc list-inside">
            <li>共 {TOTAL_LEVELS} 關</li>
            <li>用方向指令引導 🤖 到達 🎯</li>
            <li>避開牆壁 🧱</li>
            <li>指令越少，分數越高</li>
            <li>最高紀錄：{highScore} 分</li>
          </ul>
        </div>
        <button onClick={startGame}
          className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg cursor-pointer border-none hover:opacity-90 transition">
          🚀 開始闖關
        </button>
      </div>
    );
  }

  /* ─── Done ─── */
  if (mode === "done") {
    const maxScore = TOTAL_LEVELS * 15;
    const stars = getStars(score, maxScore);
    return (
      <div className="max-w-lg mx-auto px-4 py-8 animate-fadeIn">
        <a href="/board-games" className="text-sm text-cyan-500 hover:underline no-underline">← 返回桌遊專區</a>
        <GameOverScreen
          score={score} maxScore={maxScore} gameName="程式路徑" stars={stars}
          highScore={Math.max(highScore, score)} isNewHigh={isNewHigh}
          onRestart={startGame} onBack={() => setMode("menu")}
          trackingData={{ subject: "board-game", activityType: "game", activityId: "code-path", activityName: "程式路徑" }}
        />
      </div>
    );
  }

  /* ─── Playing / Running ─── */
  const isRunning = mode === "running";
  const pathSet = new Set(path.map(p => `${p[0]},${p[1]}`));

  return (
    <div className="max-w-lg mx-auto px-4 py-8 animate-fadeIn">
      <a href="/board-games" className="text-sm text-cyan-500 hover:underline no-underline">← 返回桌遊專區</a>

      {/* Header */}
      <div className="flex justify-between items-center mt-4 mb-4">
        <div className="text-sm text-slate-500">第 {level + 1}/{TOTAL_LEVELS} 關</div>
        <div className="text-sm font-bold text-cyan-600">{score} 分</div>
      </div>

      {/* Grid */}
      <div className="bg-white rounded-2xl p-4 border border-cyan-200 shadow-sm mb-4">
        <div className="grid gap-1 mx-auto" style={{ gridTemplateColumns: `repeat(${currentLevel.size}, 1fr)`, maxWidth: currentLevel.size * 52 }}>
          {Array.from({ length: currentLevel.size * currentLevel.size }, (_, idx) => {
            const r = Math.floor(idx / currentLevel.size);
            const c = idx % currentLevel.size;
            const isStart = r === currentLevel.start[0] && c === currentLevel.start[1];
            const isGoal = r === currentLevel.goal[0] && c === currentLevel.goal[1];
            const isWall = wallSet.has(`${r},${c}`);
            const isRobot = r === robotPos[0] && c === robotPos[1];
            const isPath = pathSet.has(`${r},${c}`);
            return (
              <div key={idx}
                className={`w-[48px] h-[48px] flex items-center justify-center rounded-lg text-xl transition-all duration-300
                  ${isWall ? "bg-slate-700" : isPath ? "bg-cyan-100" : isGoal ? "bg-amber-100" : "bg-slate-50 border border-slate-200"}
                `}>
                {isRobot ? "🤖" : isGoal ? "🎯" : isWall ? "🧱" : isStart && !isRunning ? "📍" : ""}
              </div>
            );
          })}
        </div>
      </div>

      {/* Run result */}
      {runResult && (
        <div className={`text-center text-sm font-bold mb-3 ${runResult === "success" ? "text-green-500" : "text-red-500"}`}>
          {runResult === "success" ? "✅ 成功到達目標！" : runResult === "wall" ? "💥 撞到牆壁了！" : "❌ 沒有到達目標"}
        </div>
      )}

      {/* Command list */}
      <div className="bg-white rounded-xl p-3 border border-cyan-200 mb-4 min-h-[52px]">
        <div className="text-xs text-slate-400 mb-1">指令 ({commands.length}/{currentLevel.maxMoves})</div>
        <div className="flex flex-wrap gap-1">
          {commands.map((cmd, i) => (
            <button key={i} onClick={() => !isRunning && removeCommand(i)}
              className={`px-2 py-1 rounded-lg text-lg cursor-pointer border-none transition ${isRunning ? "bg-cyan-100" : "bg-slate-100 hover:bg-red-100"}`}>
              {DIR_EMOJI[cmd]}
            </button>
          ))}
          {commands.length === 0 && <span className="text-xs text-slate-300">點擊下方方向鍵加入指令</span>}
        </div>
      </div>

      {/* Controls */}
      {!isRunning && (
        <>
          <div className="flex gap-2 justify-center mb-3">
            {(Object.keys(DIR_EMOJI) as Dir[]).map(dir => (
              <button key={dir} onClick={() => addCommand(dir)}
                className="w-14 h-14 rounded-xl bg-white border-2 border-cyan-200 text-2xl cursor-pointer hover:border-cyan-400 hover:bg-cyan-50 transition">
                {DIR_EMOJI[dir]}
              </button>
            ))}
          </div>
          <div className="flex gap-3 justify-center">
            <button onClick={runProgram} disabled={commands.length === 0}
              className="px-6 py-2.5 rounded-xl bg-green-500 text-white font-bold cursor-pointer border-none hover:bg-green-600 transition disabled:opacity-40">
              ▶️ 執行
            </button>
            <button onClick={clearCommands}
              className="px-6 py-2.5 rounded-xl border-2 border-slate-300 text-slate-600 font-bold cursor-pointer bg-white hover:bg-slate-50 transition">
              🗑️ 清除
            </button>
          </div>
          {currentLevel.hint && (
            <div className="text-center mt-3 text-xs text-slate-400">💡 {currentLevel.hint}</div>
          )}
        </>
      )}
    </div>
  );
}
