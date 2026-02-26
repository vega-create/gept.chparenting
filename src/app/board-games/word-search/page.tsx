"use client";
import { useState, useCallback, useRef } from "react";
import { playCorrect, playWrong, playPerfect, playVictory } from "@/lib/sounds";
import { useHighScore, getStars, GameOverScreen, shuffle } from "@/lib/game-utils";

/* ─── Types ─── */
const GRID_SIZE = 10;

type Direction = [number, number];
const DIRECTIONS: Direction[] = [
  [0, 1],   // right
  [1, 0],   // down
  [1, 1],   // diagonal down-right
  [-1, 1],  // diagonal up-right
  [0, -1],  // left
  [1, -1],  // diagonal down-left
];

interface PlacedWord {
  word: string;
  cells: [number, number][];
  found: boolean;
}

interface PuzzleData {
  grid: string[][];
  words: PlacedWord[];
}

/* ─── Word Sets ─── */
const WORD_SETS = [
  ["APPLE", "GRAPE", "LEMON", "MANGO", "PEACH", "PLUM", "BERRY", "CHERRY"],
  ["TIGER", "HORSE", "SNAKE", "EAGLE", "WHALE", "MOUSE", "SHARK", "PANDA"],
  ["TABLE", "CHAIR", "CLOCK", "SHELF", "COUCH", "LIGHT", "FRAME", "PLANT"],
  ["OCEAN", "RIVER", "CLOUD", "STORM", "BEACH", "STONE", "EARTH", "MOUNT"],
  ["PIANO", "DRUMS", "FLUTE", "SONGS", "DANCE", "BEATS", "TEMPO", "CHORD"],
  ["BREAD", "SALAD", "PASTA", "CREAM", "JUICE", "TOAST", "STEAK", "CANDY"],
  ["TRAIN", "PLANE", "CYCLE", "TRUCK", "SPEED", "DRIVE", "BRAKE", "WHEEL"],
  ["GREEN", "WHITE", "BLACK", "IVORY", "CORAL", "PEARL", "BLUSH", "AMBER"],
];

function generatePuzzle(setIndex: number): PuzzleData {
  const wordSet = WORD_SETS[setIndex % WORD_SETS.length];
  const selectedWords = shuffle([...wordSet]).slice(0, 6);

  // Initialize grid with empty
  const grid: string[][] = Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => "")
  );

  const placedWords: PlacedWord[] = [];

  // Try to place each word
  for (const word of selectedWords) {
    let placed = false;
    const shuffledDirs = shuffle([...DIRECTIONS]);

    for (let attempt = 0; attempt < 100 && !placed; attempt++) {
      const dir = shuffledDirs[attempt % shuffledDirs.length];
      const [dr, dc] = dir;

      // Calculate valid start range
      const maxR = dr >= 0 ? GRID_SIZE - dr * (word.length - 1) : GRID_SIZE;
      const minR = dr < 0 ? -dr * (word.length - 1) : 0;
      const maxC = dc >= 0 ? GRID_SIZE - dc * (word.length - 1) : GRID_SIZE;
      const minC = dc < 0 ? -dc * (word.length - 1) : 0;

      if (minR >= maxR || minC >= maxC) continue;

      const startR = Math.floor(Math.random() * (maxR - minR)) + minR;
      const startC = Math.floor(Math.random() * (maxC - minC)) + minC;

      // Check if word fits
      let canPlace = true;
      const cells: [number, number][] = [];
      for (let i = 0; i < word.length; i++) {
        const r = startR + dr * i;
        const c = startC + dc * i;
        if (r < 0 || r >= GRID_SIZE || c < 0 || c >= GRID_SIZE) { canPlace = false; break; }
        if (grid[r][c] !== "" && grid[r][c] !== word[i]) { canPlace = false; break; }
        cells.push([r, c]);
      }

      if (canPlace) {
        for (let i = 0; i < word.length; i++) {
          const [r, c] = cells[i];
          grid[r][c] = word[i];
        }
        placedWords.push({ word, cells, found: false });
        placed = true;
      }
    }
  }

  // Fill empty cells with random letters
  const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === "") {
        grid[r][c] = LETTERS[Math.floor(Math.random() * LETTERS.length)];
      }
    }
  }

  return { grid, words: placedWords };
}

export default function WordSearchPage() {
  const [mode, setMode] = useState<"menu" | "playing" | "done">("menu");
  const [puzzle, setPuzzle] = useState<PuzzleData | null>(null);
  const [puzzleSet, setPuzzleSet] = useState(0);
  const [selectedCells, setSelectedCells] = useState<Set<string>>(new Set());
  const [foundCells, setFoundCells] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const [wordsFound, setWordsFound] = useState(0);
  const [feedback, setFeedback] = useState<{ type: "correct" | "wrong"; msg: string } | null>(null);
  const [isNewHigh, setIsNewHigh] = useState(false);
  const [time, setTime] = useState(0);
  const { highScore, updateHighScore } = useHighScore("word-search");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isDragging = useRef(false);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const startGame = useCallback(() => {
    const setIdx = Math.floor(Math.random() * WORD_SETS.length);
    setPuzzleSet(setIdx);
    const p = generatePuzzle(setIdx);
    setPuzzle(p);
    setSelectedCells(new Set());
    setFoundCells(new Set());
    setScore(0);
    setWordsFound(0);
    setFeedback(null);
    setIsNewHigh(false);
    setTime(0);
    setMode("playing");

    if (timerRef.current) clearInterval(timerRef.current);
    let t = 0;
    timerRef.current = setInterval(() => {
      t++;
      setTime(t);
    }, 1000);
  }, []);

  const checkSelection = useCallback(() => {
    if (!puzzle) return;

    // Build selected cell list
    const selArray = Array.from(selectedCells).map(s => {
      const [r, c] = s.split(",").map(Number);
      return [r, c] as [number, number];
    });

    // Check if selection matches any unfound word
    let matchFound = false;
    const updatedWords = puzzle.words.map(pw => {
      if (pw.found) return pw;
      if (pw.cells.length !== selArray.length) return pw;

      // Check forward match
      const forwardMatch = pw.cells.every((cell, i) => cell[0] === selArray[i][0] && cell[1] === selArray[i][1]);
      // Check reverse match
      const reverseMatch = pw.cells.every((cell, i) => {
        const ri = selArray.length - 1 - i;
        return cell[0] === selArray[ri][0] && cell[1] === selArray[ri][1];
      });

      if (forwardMatch || reverseMatch) {
        matchFound = true;
        return { ...pw, found: true };
      }
      return pw;
    });

    if (matchFound) {
      playCorrect();
      const newFoundCells = new Set(foundCells);
      selArray.forEach(([r, c]) => newFoundCells.add(`${r},${c}`));
      setFoundCells(newFoundCells);

      const newPuzzle = { ...puzzle, words: updatedWords };
      setPuzzle(newPuzzle);

      const newWordsFound = wordsFound + 1;
      setWordsFound(newWordsFound);
      const pts = 15;
      const newScore = score + pts;
      setScore(newScore);
      setFeedback({ type: "correct", msg: `找到了！+${pts}分` });
      setTimeout(() => setFeedback(null), 1000);

      // Check if all found
      const allFound = updatedWords.every(w => w.found);
      if (allFound) {
        if (timerRef.current) clearInterval(timerRef.current);
        const timeBonus = Math.max(30 - Math.floor(time / 10), 0);
        const finalScore = newScore + timeBonus;
        setScore(finalScore);
        const newHigh = updateHighScore(finalScore);
        setIsNewHigh(newHigh);
        if (finalScore >= 100) playPerfect();
        else playVictory();
        setTimeout(() => setMode("done"), 800);
      }
    } else {
      setFeedback({ type: "wrong", msg: "不是正確的單字" });
      setTimeout(() => setFeedback(null), 800);
    }

    setSelectedCells(new Set());
  }, [puzzle, selectedCells, foundCells, wordsFound, score, time, updateHighScore]);

  const handleCellClick = useCallback((r: number, c: number) => {
    const key = `${r},${c}`;
    setSelectedCells(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }, []);

  const handleCellPointerDown = useCallback((r: number, c: number) => {
    isDragging.current = true;
    setSelectedCells(new Set([`${r},${c}`]));
  }, []);

  const handleCellPointerEnter = useCallback((r: number, c: number) => {
    if (!isDragging.current) return;
    setSelectedCells(prev => { const s = new Set(Array.from(prev)); s.add(`${r},${c}`); return s; });
  }, []);

  const handlePointerUp = useCallback(() => {
    if (isDragging.current && selectedCells.size >= 2) {
      checkSelection();
    }
    isDragging.current = false;
  }, [selectedCells, checkSelection]);

  /* ─── Menu ─── */
  if (mode === "menu") {
    return (
      <div className="max-w-lg mx-auto px-4 py-8 animate-fadeIn">
        <a href="/board-games" className="text-sm text-rose-500 hover:underline no-underline">← 返回桌遊專區</a>
        <div className="text-center mt-6 mb-8">
          <div className="text-5xl mb-3">🔍</div>
          <h1 className="text-2xl font-black text-slate-800 mb-2">單字搜尋</h1>
          <p className="text-slate-500 text-sm">在字母方格中找出隱藏的英文單字</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-rose-200 shadow-sm mb-6">
          <h3 className="font-bold text-slate-700 mb-1">遊戲規則</h3>
          <ul className="text-sm text-slate-500 space-y-1 list-disc list-inside">
            <li>10x10 字母方格中隱藏了英文單字</li>
            <li>拖曳選取或逐一點擊字母</li>
            <li>單字可能橫向、直向或斜向排列</li>
            <li>找到所有單字即完成</li>
            <li>速度越快，得分越高</li>
            <li>最高紀錄：{highScore} 分</li>
          </ul>
        </div>
        <button onClick={startGame}
          className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold text-lg cursor-pointer border-none hover:opacity-90 transition">
          開始搜尋
        </button>
      </div>
    );
  }

  /* ─── Done ─── */
  if (mode === "done") {
    const maxScore = (puzzle?.words.length || 6) * 15 + 30;
    const stars = getStars(score, maxScore);
    return (
      <div className="max-w-lg mx-auto px-4 py-8 animate-fadeIn">
        <a href="/board-games" className="text-sm text-rose-500 hover:underline no-underline">← 返回桌遊專區</a>
        <div className="text-center text-sm text-slate-500 mt-4 mb-2">
          找到 {wordsFound} 個字 ・ 用時 {formatTime(time)}
        </div>
        <GameOverScreen
          score={score} maxScore={maxScore} gameName="單字搜尋" stars={stars}
          highScore={Math.max(highScore, score)} isNewHigh={isNewHigh}
          onRestart={startGame} onBack={() => setMode("menu")}
          trackingData={{ subject: "board-game", activityType: "game", activityId: "word-search", activityName: "單字搜尋" }}
        />
      </div>
    );
  }

  /* ─── Playing ─── */
  return (
    <div className="max-w-lg mx-auto px-4 py-8 animate-fadeIn" onPointerUp={handlePointerUp}>
      <a href="/board-games" className="text-sm text-rose-500 hover:underline no-underline">← 返回桌遊專區</a>

      {/* Header */}
      <div className="flex justify-between items-center mt-4 mb-4">
        <div className="text-sm text-slate-500">{wordsFound}/{puzzle?.words.length || 0} 個字</div>
        <div className="text-sm font-mono text-slate-500">⏱ {formatTime(time)}</div>
        <div className="text-sm font-bold text-rose-600">🏆 {score}</div>
      </div>

      {/* Feedback */}
      {feedback && (
        <div className={`text-center text-sm font-bold mb-2 animate-fadeIn ${feedback.type === "correct" ? "text-green-500" : "text-red-500"}`}>
          {feedback.msg}
        </div>
      )}

      {/* Word List */}
      {puzzle && (
        <div className="flex flex-wrap gap-2 mb-4 justify-center">
          {puzzle.words.map((pw, i) => (
            <span key={i} className={`text-sm px-3 py-1 rounded-full font-bold transition-all
              ${pw.found
                ? "bg-green-100 text-green-600 line-through"
                : "bg-rose-100 text-rose-700"
              }
            `}>
              {pw.word}
            </span>
          ))}
        </div>
      )}

      {/* Grid */}
      {puzzle && (
        <div className="bg-white rounded-2xl p-3 border border-rose-200 shadow-sm select-none touch-none">
          <div className="grid mx-auto" style={{
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            maxWidth: GRID_SIZE * 36,
            gap: 2,
          }}>
            {puzzle.grid.map((row, r) =>
              row.map((letter, c) => {
                const key = `${r},${c}`;
                const isSelected = selectedCells.has(key);
                const isFound = foundCells.has(key);
                return (
                  <button
                    key={key}
                    onPointerDown={(e) => { e.preventDefault(); handleCellPointerDown(r, c); }}
                    onPointerEnter={() => handleCellPointerEnter(r, c)}
                    className={`aspect-square rounded-md flex items-center justify-center font-bold text-sm sm:text-base cursor-pointer border transition-all select-none
                      ${isFound
                        ? "bg-green-200 border-green-400 text-green-800"
                        : isSelected
                          ? "bg-rose-400 border-rose-500 text-white scale-105"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-rose-50 hover:border-rose-300"
                      }
                    `}
                    style={{ touchAction: "none" }}
                  >
                    {letter}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Check button for click-based selection */}
      {selectedCells.size >= 2 && (
        <div className="mt-4 text-center">
          <button onClick={checkSelection}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold cursor-pointer border-none hover:opacity-90 transition active:scale-95">
            確認選取（{selectedCells.size} 個字母）
          </button>
        </div>
      )}

      <p className="text-center text-xs text-slate-400 mt-3">拖曳選取字母，或逐一點擊後按確認</p>
    </div>
  );
}
