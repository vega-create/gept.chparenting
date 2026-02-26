"use client";

import { useState, useCallback } from "react";
import { sortingItems } from "@/data/finance/modules/needs-vs-wants";
import { playCorrect, playWrong, playPerfect, playVictory } from "@/lib/sounds";

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function NeedsVsWants() {
  const [items, setItems] = useState(() => shuffle(sortingItems).slice(0, 15));
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ correct: boolean; explanation: string } | null>(null);
  const [done, setDone] = useState(false);

  const current = items[idx];

  const handleChoice = (isNeed: boolean) => {
    if (feedback) return;
    const correct = isNeed === current.isNeed;
    if (correct) { setScore(s => s + 1); playCorrect(); }
    else playWrong();
    setFeedback({ correct, explanation: current.explanation });
  };

  const handleNext = () => {
    if (idx + 1 >= items.length) {
      setDone(true);
      if (score >= items.length - 1) playPerfect();
      else playVictory();
    } else {
      setIdx(idx + 1);
      setFeedback(null);
    }
  };

  const restart = useCallback(() => {
    setItems(shuffle(sortingItems).slice(0, 15));
    setIdx(0);
    setScore(0);
    setFeedback(null);
    setDone(false);
  }, []);

  if (done) {
    const pct = Math.round((score / items.length) * 100);
    return (
      <div className="text-center bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
        <div className="text-5xl mb-3">{pct >= 90 ? "🎉" : pct >= 60 ? "👍" : "💪"}</div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">分類完成！</h2>
        <div className="text-4xl font-black text-amber-500 my-3">{score} / {items.length}</div>
        <div className="text-sm text-slate-500 mb-4">正確率 {pct}%</div>
        <button onClick={restart} className="px-6 py-2.5 rounded-xl bg-rose-300 text-white font-bold cursor-pointer border-none hover:bg-rose-400 transition">🔄 再玩一次</button>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center text-sm text-slate-400 mb-2">第 {idx + 1} / {items.length} 題</div>
      <div className="text-center text-sm font-bold text-emerald-600 mb-4">✅ 答對 {score} 題</div>

      {/* Item card */}
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center mb-4">
        <div className="text-6xl mb-3">{current.icon}</div>
        <h3 className="text-2xl font-black text-slate-800">{current.name}</h3>
        <p className="text-slate-400 mt-2">這是「需要」還是「想要」？</p>
      </div>

      {/* Choice buttons */}
      {!feedback ? (
        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => handleChoice(true)}
            className="py-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 text-emerald-700 font-bold text-lg cursor-pointer hover:bg-emerald-100 transition">
            ✅ 需要
          </button>
          <button onClick={() => handleChoice(false)}
            className="py-4 rounded-2xl bg-pink-50 border-2 border-pink-300 text-pink-700 font-bold text-lg cursor-pointer hover:bg-pink-100 transition">
            💝 想要
          </button>
        </div>
      ) : (
        <div>
          <div className={`p-4 rounded-xl text-sm mb-3 ${feedback.correct ? "bg-emerald-50 border border-emerald-200 text-emerald-700" : "bg-red-50 border border-red-200 text-red-700"}`}>
            <div className="font-bold mb-1">{feedback.correct ? "✅ 正確！" : `❌ 答案是「${current.isNeed ? "需要" : "想要"}`}</div>
            {feedback.explanation}
          </div>
          <button onClick={handleNext}
            className="w-full py-3 rounded-xl bg-rose-300 text-white font-bold cursor-pointer border-none hover:bg-rose-400 transition">
            {idx + 1 >= items.length ? "看結果 →" : "下一題 →"}
          </button>
        </div>
      )}
    </div>
  );
}
