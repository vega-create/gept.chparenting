"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { playCorrect, playWrong, playPerfect, playVictory } from "@/lib/sounds";
import { useHighScore, getStars, GameOverScreen, shuffle } from "@/lib/game-utils";
import { useTimer } from "@/lib/game-utils";

/* ─── Types ─── */
type Difficulty = "easy" | "medium" | "hard";

interface Card {
  id: number;
  emoji: string;
  pairId: number;
  flipped: boolean;
  matched: boolean;
}

const ALL_EMOJIS = ["🐶", "🐱", "🐰", "🐻", "🦊", "🐼", "🐨", "🦁", "🐸", "🐙"];
const DIFF_CONFIG: Record<Difficulty, { cols: number; rows: number; pairs: number }> = {
  easy: { cols: 4, rows: 3, pairs: 6 },
  medium: { cols: 4, rows: 4, pairs: 8 },
  hard: { cols: 5, rows: 4, pairs: 10 },
};

const DIFF_OPTIONS: { key: Difficulty; label: string; desc: string }[] = [
  { key: "easy", label: "初級", desc: "3x4（6 對）" },
  { key: "medium", label: "中級", desc: "4x4（8 對）" },
  { key: "hard", label: "高級", desc: "4x5（10 對）" },
];

function createCards(pairs: number): Card[] {
  const emojis = shuffle(ALL_EMOJIS).slice(0, pairs);
  const cards: Card[] = [];
  emojis.forEach((emoji, i) => {
    cards.push({ id: i * 2, emoji, pairId: i, flipped: false, matched: false });
    cards.push({ id: i * 2 + 1, emoji, pairId: i, flipped: false, matched: false });
  });
  return shuffle(cards);
}

export default function MemoryMatchPage() {
  const [mode, setMode] = useState<"menu" | "playing" | "done">("menu");
  const [diff, setDiff] = useState<Difficulty>("easy");
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [isChecking, setIsChecking] = useState(false);
  const [isNewHigh, setIsNewHigh] = useState(false);
  const [score, setScore] = useState(0);
  const { highScore, updateHighScore } = useHighScore("memory-match");
  const { time, fmt: timerFmt, reset: resetTimer } = useTimer(mode === "playing");
  const totalPairs = DIFF_CONFIG[diff].pairs;

  const startGame = useCallback((d: Difficulty) => {
    setDiff(d);
    const config = DIFF_CONFIG[d];
    setCards(createCards(config.pairs));
    setFlippedIds([]);
    setMoves(0);
    setMatchedPairs(0);
    setIsChecking(false);
    setMode("playing");
    resetTimer();
    setIsNewHigh(false);
    setScore(0);
  }, [resetTimer]);

  const handleFlip = useCallback((cardId: number) => {
    if (isChecking) return;
    if (flippedIds.length >= 2) return;

    const card = cards.find(c => c.id === cardId);
    if (!card || card.flipped || card.matched) return;

    const newFlipped = [...flippedIds, cardId];
    setFlippedIds(newFlipped);
    setCards(prev => prev.map(c => c.id === cardId ? { ...c, flipped: true } : c));

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      setIsChecking(true);

      const [id1, id2] = newFlipped;
      const card1 = cards.find(c => c.id === id1)!;
      const card2 = cards.find(c => c.id === id2)!;

      if (card1.pairId === card2.pairId) {
        // Match!
        playCorrect();
        const newMatched = matchedPairs + 1;
        setMatchedPairs(newMatched);
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            c.pairId === card1.pairId ? { ...c, matched: true, flipped: true } : c
          ));
          setFlippedIds([]);
          setIsChecking(false);

          if (newMatched === totalPairs) {
            // Game complete
            const maxMoves = totalPairs * 3;
            const moveScore = Math.max(100 - (moves + 1 - totalPairs) * 3, 20);
            const timeScore = Math.max(50 - Math.floor(time / 5), 0);
            const finalScore = Math.min(moveScore + timeScore, 150);
            setScore(finalScore);
            const newHigh = updateHighScore(finalScore);
            setIsNewHigh(newHigh);
            if (moves + 1 <= totalPairs + 2) playPerfect();
            else playVictory();
            setMode("done");
          }
        }, 500);
      } else {
        // No match
        playWrong();
        setTimeout(() => {
          setCards(prev => prev.map(c =>
            newFlipped.includes(c.id) && !c.matched ? { ...c, flipped: false } : c
          ));
          setFlippedIds([]);
          setIsChecking(false);
        }, 800);
      }
    }
  }, [isChecking, flippedIds, cards, matchedPairs, totalPairs, moves, time, updateHighScore]);

  /* ─── Menu ─── */
  if (mode === "menu") {
    return (
      <div className="max-w-lg mx-auto px-4 py-8 animate-fadeIn">
        <a href="/board-games" className="text-sm text-pink-500 hover:underline no-underline">← 返回桌遊專區</a>
        <div className="text-center mt-6 mb-8">
          <div className="text-5xl mb-3">🃏</div>
          <h1 className="text-2xl font-black text-slate-800 mb-2">記憶翻牌</h1>
          <p className="text-slate-500 text-sm">翻開配對，訓練你的記憶力</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-pink-200 shadow-sm mb-6">
          <h3 className="font-bold text-slate-700 mb-1">遊戲規則</h3>
          <ul className="text-sm text-slate-500 space-y-1 list-disc list-inside">
            <li>每次翻開 2 張牌</li>
            <li>圖案相同即配對成功</li>
            <li>翻牌次數越少、速度越快，分數越高</li>
            <li>最高紀錄：{highScore} 分</li>
          </ul>
        </div>
        <div className="space-y-3">
          {DIFF_OPTIONS.map(d => (
            <button key={d.key} onClick={() => startGame(d.key)}
              className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold text-left cursor-pointer border-none hover:opacity-90 transition">
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
        <a href="/board-games" className="text-sm text-pink-500 hover:underline no-underline">← 返回桌遊專區</a>
        <div className="text-center text-sm text-slate-500 mt-4 mb-2">翻牌 {moves} 次 ・ 用時 {timerFmt}</div>
        <GameOverScreen
          score={score} maxScore={150} gameName="記憶翻牌" stars={stars}
          highScore={Math.max(highScore, score)} isNewHigh={isNewHigh}
          onRestart={() => startGame(diff)} onBack={() => setMode("menu")}
        />
      </div>
    );
  }

  /* ─── Playing ─── */
  const config = DIFF_CONFIG[diff];

  return (
    <div className="max-w-lg mx-auto px-4 py-8 animate-fadeIn">
      <a href="/board-games" className="text-sm text-pink-500 hover:underline no-underline">← 返回桌遊專區</a>

      {/* Header */}
      <div className="flex justify-between items-center mt-4 mb-6">
        <div className="text-sm text-slate-500">翻牌 {moves} 次</div>
        <div className="text-sm font-mono text-slate-500">⏱ {timerFmt}</div>
        <div className="text-sm font-bold text-pink-600">{matchedPairs}/{totalPairs} 對</div>
      </div>

      {/* Card Grid */}
      <div className="bg-white rounded-2xl p-4 border border-pink-200 shadow-sm">
        <div className="grid gap-2 mx-auto" style={{
          gridTemplateColumns: `repeat(${config.cols}, 1fr)`,
          maxWidth: config.cols * 72,
        }}>
          {cards.map(card => (
            <button key={card.id} onClick={() => handleFlip(card.id)}
              className={`aspect-square rounded-xl text-2xl flex items-center justify-center cursor-pointer border-none transition-all duration-300 transform
                ${card.matched
                  ? "bg-green-100 border-2 border-green-300 scale-90 opacity-70"
                  : card.flipped
                    ? "bg-pink-100 border-2 border-pink-300 scale-105"
                    : "bg-gradient-to-br from-pink-400 to-rose-500 hover:from-pink-500 hover:to-rose-600 scale-100"
                }
              `}
              style={{ minHeight: 60 }}
              disabled={card.flipped || card.matched || isChecking}
            >
              {card.flipped || card.matched ? (
                <span className="animate-fadeIn">{card.emoji}</span>
              ) : (
                <span className="text-white text-lg">?</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
