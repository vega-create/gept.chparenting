"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { MATH_TOPICS } from "@/data/math/topics";
import type { MathTopic, MathPractice } from "@/data/math/types";
import { playCorrect, playWrong, playPerfect, playVictory } from "@/lib/sounds";
import { useParams } from "next/navigation";

type Tab = "concepts" | "practice" | "challenge";

export default function MathTopicPage() {
  const params = useParams();
  const topicId = params.topic as string;
  const topic = MATH_TOPICS.find((t) => t.id === topicId);

  const [tab, setTab] = useState<Tab>("concepts");

  if (!topic) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <p className="text-slate-500">找不到這個主題</p>
        <Link href="/math" className="text-amber-500 hover:underline no-underline mt-4 inline-block">← 回到數學練習</Link>
      </div>
    );
  }

  const tabs: { key: Tab; label: string }[] = [
    { key: "concepts", label: "📖 觀念" },
    { key: "practice", label: "✏️ 練習" },
    { key: "challenge", label: "⏱️ 挑戰" },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link href="/math" className="text-sm text-amber-500 hover:underline no-underline">← 回到數學練習</Link>

      <div className="text-center mt-4 mb-6">
        <div className="text-4xl mb-2">{topic.icon}</div>
        <h1 className="text-2xl font-black text-slate-800">{topic.title}</h1>
        <p className="text-sm text-slate-500">{topic.grade}</p>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-2 justify-center mb-6">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-5 py-2 rounded-xl font-bold text-sm border-none cursor-pointer transition ${tab === t.key ? `bg-gradient-to-r ${topic.color} text-white shadow` : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "concepts" && <ConceptsTab topic={topic} />}
      {tab === "practice" && <PracticeTab topic={topic} />}
      {tab === "challenge" && <ChallengeTab topic={topic} />}
    </div>
  );
}

/* ─── Concepts Tab ─── */
function ConceptsTab({ topic }: { topic: MathTopic }) {
  return (
    <div className="space-y-6">
      {topic.concepts.map((c, i) => (
        <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800 mb-3">{c.title}</h2>
          <p className="text-slate-600 leading-7 mb-4">{c.explanation}</p>
          <div className="space-y-3">
            {c.examples.map((ex, j) => (
              <div key={j} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="font-bold text-slate-700 mb-2">💡 {ex.question}</div>
                <div className="space-y-1 ml-4">
                  {ex.steps.map((s, k) => (
                    <div key={k} className="text-sm text-slate-600">• {s}</div>
                  ))}
                </div>
                <div className="mt-2 font-bold text-emerald-600">✅ 答案：{ex.answer}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Practice Tab ─── */
function PracticeTab({ topic }: { topic: MathTopic }) {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const [done, setDone] = useState(false);
  const practices = topic.practices;
  const q = practices[idx];

  const handleSelect = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === q.answer) {
      setCorrect((c) => c + 1);
      playCorrect();
    } else {
      playWrong();
    }
  };

  const handleNext = () => {
    if (idx + 1 >= practices.length) {
      setDone(true);
      if (correct + 1 >= practices.length) playPerfect();
      else playVictory();
    } else {
      setIdx(idx + 1);
      setSelected(null);
    }
  };

  const handleRestart = () => {
    setIdx(0);
    setSelected(null);
    setCorrect(0);
    setDone(false);
  };

  if (done) {
    const pct = Math.round((correct / practices.length) * 100);
    return (
      <div className="text-center bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
        <div className="text-5xl mb-3">{pct >= 90 ? "🎉" : pct >= 60 ? "👍" : "💪"}</div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">練習完成！</h2>
        <div className="text-4xl font-black text-amber-500 my-3">{correct} / {practices.length}</div>
        <div className="text-sm text-slate-500 mb-4">正確率 {pct}%</div>
        <button onClick={handleRestart} className="px-6 py-2.5 rounded-xl bg-amber-500 text-white font-bold cursor-pointer border-none hover:bg-amber-600 transition">🔄 再做一次</button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-slate-400">第 {idx + 1} / {practices.length} 題</span>
        <span className="text-sm font-bold text-emerald-600">✅ {correct} 題正確</span>
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-4">{q.question}</h3>
      <div className="space-y-2.5">
        {q.options.map((opt, i) => {
          let cls = "bg-slate-50 border-slate-200 hover:bg-slate-100";
          if (selected !== null) {
            if (i === q.answer) cls = "bg-emerald-50 border-emerald-400 text-emerald-700";
            else if (i === selected) cls = "bg-red-50 border-red-400 text-red-700";
          }
          return (
            <button key={i} onClick={() => handleSelect(i)}
              className={`w-full text-left p-3.5 rounded-xl border-2 font-medium cursor-pointer transition ${cls}`}>
              {opt}
            </button>
          );
        })}
      </div>
      {selected !== null && (
        <div className="mt-4">
          <div className={`p-3 rounded-xl text-sm ${selected === q.answer ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
            {q.explanation}
          </div>
          <button onClick={handleNext}
            className="mt-3 px-5 py-2 rounded-xl bg-amber-500 text-white font-bold cursor-pointer border-none hover:bg-amber-600 transition">
            {idx + 1 >= practices.length ? "看結果 →" : "下一題 →"}
          </button>
        </div>
      )}
    </div>
  );
}

/* ─── Challenge Tab ─── */
function ChallengeTab({ topic }: { topic: MathTopic }) {
  const [phase, setPhase] = useState<"ready" | "playing" | "done">("ready");
  const [remaining, setRemaining] = useState(topic.challenge.timeLimit);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [problem, setProblem] = useState<{ question: string; answer: number } | null>(null);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const nextProblem = useCallback(() => {
    setProblem(topic.challenge.generateProblem());
    setInput("");
    setFeedback(null);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [topic]);

  useEffect(() => {
    if (phase !== "playing" || remaining <= 0) return;
    const iv = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(iv);
          setPhase("done");
          playVictory();
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [phase, remaining]);

  const start = () => {
    setPhase("playing");
    setScore(0);
    setStreak(0);
    setRemaining(topic.challenge.timeLimit);
    nextProblem();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problem || input.trim() === "") return;
    const num = parseFloat(input);
    if (Math.abs(num - problem.answer) < 0.01) {
      const pts = 10 + Math.min(streak, 5) * 2;
      setScore((s) => s + pts);
      setStreak((s) => s + 1);
      setFeedback("correct");
      playCorrect();
      setTimeout(nextProblem, 400);
    } else {
      setStreak(0);
      setFeedback("wrong");
      playWrong();
      setTimeout(nextProblem, 800);
    }
  };

  if (phase === "ready") {
    return (
      <div className="text-center bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
        <div className="text-5xl mb-3">⏱️</div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">限時挑戰</h2>
        <p className="text-slate-500 text-sm mb-2">在 {topic.challenge.timeLimit} 秒內答對越多題越好！</p>
        <p className="text-slate-400 text-xs mb-4">連續答對可獲得額外加分</p>
        <button onClick={start} className={`px-8 py-3 rounded-xl bg-gradient-to-r ${topic.color} text-white font-bold text-lg cursor-pointer border-none hover:opacity-90 transition`}>
          開始挑戰 🚀
        </button>
      </div>
    );
  }

  if (phase === "done") {
    return (
      <div className="text-center bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
        <div className="text-5xl mb-3">🏆</div>
        <h2 className="text-2xl font-black text-slate-800 mb-2">挑戰結束！</h2>
        <div className="text-4xl font-black text-amber-500 my-3">{score} 分</div>
        <button onClick={start} className="px-6 py-2.5 rounded-xl bg-amber-500 text-white font-bold cursor-pointer border-none hover:bg-amber-600 transition">🔄 再挑戰一次</button>
      </div>
    );
  }

  const fmt = `${Math.floor(remaining / 60).toString().padStart(2, "0")}:${(remaining % 60).toString().padStart(2, "0")}`;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <span className="text-lg font-bold text-slate-800">⏱️ {fmt}</span>
        <span className="text-lg font-bold text-amber-500">🏆 {score} 分</span>
      </div>
      {streak > 1 && <div className="text-center text-sm font-bold text-orange-500 mb-2">🔥 連續 {streak} 題！</div>}
      {/* progress bar */}
      <div className="h-2 bg-slate-100 rounded-full mb-6 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all"
          style={{ width: `${(remaining / topic.challenge.timeLimit) * 100}%` }} />
      </div>

      {problem && (
        <div className="text-center">
          <h3 className={`text-2xl font-black mb-6 transition-colors ${feedback === "correct" ? "text-emerald-600" : feedback === "wrong" ? "text-red-500" : "text-slate-800"}`}>
            {problem.question}
          </h3>
          <form onSubmit={handleSubmit} className="flex gap-3 justify-center items-center">
            <input ref={inputRef} type="number" step="any" value={input} onChange={(e) => setInput(e.target.value)}
              className="w-32 px-4 py-3 rounded-xl border-2 border-slate-200 text-center text-xl font-bold focus:border-amber-400 focus:outline-none"
              placeholder="答案" autoComplete="off" />
            <button type="submit"
              className={`px-6 py-3 rounded-xl bg-gradient-to-r ${topic.color} text-white font-bold cursor-pointer border-none hover:opacity-90 transition`}>
              送出
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
