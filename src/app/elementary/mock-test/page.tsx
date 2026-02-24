"use client";
import { UNITS } from "@/data/elementary";
import { useState, useEffect, useCallback, useRef } from "react";
import { playCorrect, playWrong, playPerfect, playVictory } from "@/lib/sounds";

const speak = (text: string, rate = 0.85) => {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US"; u.rate = rate;
  window.speechSynthesis.speak(u);
};

const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

const allListening = UNITS.flatMap(u => u.listening);
const allVocab = UNITS.flatMap(u => u.quiz);
const allReading = UNITS.flatMap(u => Array.isArray(u.reading) ? u.reading : [u.reading]);

type Phase = "intro" | "listening" | "reading" | "result" | "review";

export default function MockTestPage() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [listenQs, setListenQs] = useState<any[]>([]);
  const [vocabQs, setVocabQs] = useState<any[]>([]);
  const [readingData, setReadingData] = useState<any>(null);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timer, setTimer] = useState(0);
  const [started, setStarted] = useState(false);
  const [listenPlays, setListenPlays] = useState<Record<number, number>>({});

  const startTest = () => {
    setListenQs(shuffle(allListening).slice(0, 10));
    setVocabQs(shuffle(allVocab).slice(0, 10));
    setReadingData(allReading[Math.floor(Math.random() * allReading.length)]);
    setAnswers({});
    setTimer(0);
    setStarted(true);
    setListenPlays({});
    setPhase("listening");
  };

  useEffect(() => {
    if (!started || phase === "intro" || phase === "result" || phase === "review") return;
    const iv = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(iv);
  }, [started, phase]);

  const fmt = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;
  const setAns = (key: string, val: number) => setAnswers(a => ({ ...a, [key]: val }));

  const playListen = (idx: number, text: string) => {
    const plays = listenPlays[idx] || 0;
    if (plays < 3) { speak(text, 0.8); setListenPlays(p => ({ ...p, [idx]: plays + 1 })); }
  };

  const calcScore = useCallback(() => {
    let correct = 0, total = 0;
    const details: any[] = [];
    listenQs.forEach((q, i) => { total++; const ok = answers[`l${i}`] === q.ans; if (ok) correct++; details.push({ section: "Listening", idx: i, question: q.text, userAns: answers[`l${i}`] ?? -1, correctAns: q.ans, opts: q.opts, correct: ok }); });
    vocabQs.forEach((q, i) => { total++; const ok = answers[`v${i}`] === q.ans; if (ok) correct++; details.push({ section: "Vocabulary & Grammar", idx: i, question: q.s, userAns: answers[`v${i}`] ?? -1, correctAns: q.ans, opts: q.opts, correct: ok }); });
    readingData?.questions.forEach((q: any, i: number) => { total++; const ok = answers[`r${i}`] === q.ans; if (ok) correct++; details.push({ section: "Reading Comprehension", idx: i, question: q.q, userAns: answers[`r${i}`] ?? -1, correctAns: q.ans, opts: q.opts, correct: ok }); });
    return { correct, total, details };
  }, [listenQs, vocabQs, readingData, answers]);

  // ─── INTRO ───
  if (phase === "intro") return (
    <div className="max-w-2xl mx-auto px-4 py-12 text-center">
      <div className="bg-white rounded-2xl p-8 md:p-10 border border-slate-200 shadow-sm">
        <div className="text-5xl mb-4">📝</div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-800 mb-3">GEPT Elementary Mock Test</h1>
        <p className="text-slate-500 mb-6">初級英檢模擬測驗（全英文出題，考完看答案）</p>
        <div className="bg-blue-50 rounded-xl p-5 text-left mb-6 text-sm text-slate-700 space-y-3">
          <div className="font-bold text-blue-700 mb-1">Test Format：</div>
          <div>🎧 <strong>Part 1 — Listening</strong>：10 questions（每題最多播放 3 次）</div>
          <div>📖 <strong>Part 2 — Vocabulary & Grammar</strong>：10 questions</div>
          <div>📗 <strong>Part 3 — Reading Comprehension</strong>：1 passage + 5 questions</div>
          <div className="pt-2 border-t border-blue-200 text-blue-600 font-medium">
            ⚠️ 測驗中全英文，不顯示中文提示。考完才看成績與答案。
          </div>
        </div>
        <button onClick={startTest} className="px-10 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg cursor-pointer border-none hover:bg-blue-700 transition active:scale-95">
          🚀 Start Test
        </button>
        <div className="mt-4"><a href="/elementary" className="text-sm text-blue-500 hover:underline">← Back to Elementary</a></div>
      </div>
    </div>
  );

  // ─── RESULT ───
  if (phase === "result") {
    const { correct, total } = calcScore();
    const pct = Math.round((correct / total) * 100);
    const pass = pct >= 72;
    const lS = listenQs.filter((q, i) => answers[`l${i}`] === q.ans).length;
    const vS = vocabQs.filter((q, i) => answers[`v${i}`] === q.ans).length;
    const rS = readingData?.questions.filter((q: any, i: number) => answers[`r${i}`] === q.ans).length || 0;
    return (
      <div className="max-w-lg mx-auto px-4 py-10 text-center">
        <div className="bg-white rounded-2xl p-8 md:p-10 border border-slate-200 shadow-lg">
          <div className="text-6xl mb-3">{pass ? "🎉" : "💪"}</div>
          <h2 className="text-2xl font-black text-slate-800 mb-1">Test Complete</h2>
          <div className="text-sm text-slate-400 mb-4">Time: {fmt(timer)}</div>
          <div className="text-5xl font-black my-4" style={{ color: pass ? "#059669" : "#f59e0b" }}>{correct}/{total}</div>
          <div className="text-lg font-bold mb-2" style={{ color: pass ? "#059669" : "#f59e0b" }}>Score: {pct}%</div>
          <div className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold mb-4 ${pass ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
            {pass ? "✅ PASS（通過 72%）" : "❌ NOT PASS（未達 72%）"}
          </div>
          <div className="bg-slate-50 rounded-xl p-4 text-left text-sm space-y-2 mb-6">
            <div className="flex justify-between"><span>🎧 Listening</span><span className="font-bold">{lS}/{listenQs.length}</span></div>
            <div className="flex justify-between"><span>📖 Vocabulary & Grammar</span><span className="font-bold">{vS}/{vocabQs.length}</span></div>
            <div className="flex justify-between"><span>📗 Reading</span><span className="font-bold">{rS}/{readingData?.questions.length || 0}</span></div>
          </div>
          <div className="flex gap-3 justify-center flex-wrap">
            <button onClick={() => setPhase("review")} className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm cursor-pointer border-none hover:bg-indigo-700 transition">📋 Review Answers</button>
            <button onClick={startTest} className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm cursor-pointer border-none hover:bg-blue-700 transition">🔄 Try Again</button>
            <a href="/elementary" className="px-6 py-2.5 rounded-xl border-2 border-blue-600 text-blue-600 font-semibold text-sm no-underline hover:bg-blue-50 transition">← Back</a>
          </div>
        </div>
      </div>
    );
  }

  // ─── REVIEW ───
  if (phase === "review") {
    const { details, correct, total } = calcScore();
    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-xl border border-slate-200 sticky top-16 z-10">
          <h2 className="text-base font-bold text-slate-800 m-0">📋 Answer Review 答案詳解</h2>
          <div className="flex gap-2"><span className="text-sm font-bold text-emerald-600">✓{correct}</span><span className="text-sm font-bold text-red-500">✗{total - correct}</span></div>
        </div>
        {["Listening", "Vocabulary & Grammar", "Reading Comprehension"].map(section => {
          const items = details.filter((d: any) => d.section === section);
          if (!items.length) return null;
          return (
            <div key={section} className="mb-6">
              <h3 className="text-sm font-bold text-slate-700 mb-3">{section === "Listening" ? "🎧" : section === "Vocabulary & Grammar" ? "📖" : "📗"} {section}</h3>
              {section === "Reading Comprehension" && readingData && (
                <div className="bg-blue-50 rounded-xl p-4 mb-3 text-sm leading-7 text-slate-700 whitespace-pre-line">{readingData.passage}</div>
              )}
              <div className="space-y-3">
                {items.map((item: any, i: number) => (
                  <div key={i} className={`rounded-xl p-4 border ${item.correct ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"}`}>
                    <div className="flex items-start gap-2 mb-2">
                      <span className="text-lg">{item.correct ? "✅" : "❌"}</span>
                      <div className="font-medium text-sm text-slate-800">{item.idx + 1}. {item.question}</div>
                    </div>
                    <div className="ml-7 space-y-1">
                      {item.opts.map((o: string, oi: number) => {
                        let cls = "text-slate-500";
                        if (oi === item.correctAns) cls = "text-emerald-700 font-bold";
                        if (oi === item.userAns && oi !== item.correctAns) cls = "text-red-500 line-through";
                        return <div key={oi} className={`text-sm ${cls}`}>{String.fromCharCode(65 + oi)}. {o}{oi === item.correctAns ? " ✓" : ""}{oi === item.userAns && oi !== item.correctAns ? " (your answer)" : ""}</div>;
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        <div className="text-center py-6 flex gap-3 justify-center flex-wrap">
          <button onClick={() => setPhase("result")} className="px-6 py-2.5 rounded-xl border-2 border-slate-300 text-slate-600 font-semibold text-sm cursor-pointer bg-white">← Back to Score</button>
          <button onClick={startTest} className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm cursor-pointer border-none">🔄 Try Again</button>
        </div>
      </div>
    );
  }

  // ─── TEST (ALL ENGLISH, NO CHINESE) ───
  const lDone = listenQs.filter((_, i) => answers[`l${i}`] !== undefined).length;
  const rDone = vocabQs.filter((_, i) => answers[`v${i}`] !== undefined).length + (readingData?.questions.filter((_: any, i: number) => answers[`r${i}`] !== undefined).length || 0);
  const rTotal = vocabQs.length + (readingData?.questions.length || 0);

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-5 bg-white p-3 md:p-4 rounded-xl border border-slate-200 sticky top-16 z-10 shadow-sm">
        <div className="flex items-center gap-2">
          {phase === "reading" && <button onClick={() => setPhase("listening")} className="text-sm text-blue-500 bg-transparent border-none cursor-pointer p-1">← Back</button>}
          <span className="text-sm font-bold text-blue-600">{phase === "listening" ? "🎧 Part 1: Listening" : "📖 Part 2 & 3"}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-medium">
            {phase === "listening" ? `${lDone}/${listenQs.length}` : `${rDone}/${rTotal}`}
          </span>
          <span className="font-mono text-sm text-slate-400">{fmt(timer)}</span>
        </div>
      </div>

      {phase === "listening" && (
        <div className="space-y-4">
          <div className="bg-amber-50 rounded-xl p-3 text-sm text-amber-700">⚠️ Each question can be played up to <strong>3 times</strong>. Listen carefully.</div>
          {listenQs.map((q, i) => (
            <div key={i} className="bg-white rounded-xl p-4 md:p-5 border border-slate-200">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-sm font-bold text-slate-800 flex-shrink-0">Q{i + 1}.</span>
                <button onClick={() => playListen(i, q.text)} disabled={(listenPlays[i] || 0) >= 3}
                  className={`border rounded-lg px-3 py-1.5 text-sm cursor-pointer transition flex-shrink-0 ${(listenPlays[i] || 0) >= 3 ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed" : "bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700"}`}>
                  🔊 Play {(listenPlays[i] || 0) >= 3 ? "(max)" : `(${3 - (listenPlays[i] || 0)} left)`}
                </button>
              </div>
              <div className="space-y-1.5">
                {q.opts.map((o: string, oi: number) => (
                  <button key={oi} onClick={() => setAns(`l${i}`, oi)}
                    className={`w-full text-left p-3 rounded-lg border text-sm cursor-pointer transition ${answers[`l${i}`] === oi ? "bg-blue-50 border-blue-400 font-medium" : "bg-slate-50 border-slate-200 hover:bg-slate-100"}`}>
                    {String.fromCharCode(65 + oi)}. {o}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div className="text-center py-4">
            <button onClick={() => setPhase("reading")} disabled={lDone < listenQs.length}
              className="px-8 py-3 rounded-xl bg-blue-600 text-white font-bold cursor-pointer border-none disabled:opacity-40 hover:bg-blue-700 transition">Next: Reading →</button>
            {lDone < listenQs.length && <p className="text-xs text-slate-400 mt-2">Answer all questions to continue.</p>}
          </div>
        </div>
      )}

      {phase === "reading" && (
        <div className="space-y-4">
          <h3 className="font-bold text-slate-800 text-base">Part 2: Vocabulary & Grammar</h3>
          {vocabQs.map((q, i) => (
            <div key={i} className="bg-white rounded-xl p-4 md:p-5 border border-slate-200">
              <div className="font-medium text-slate-800 mb-3 text-sm">{i + 1}. {q.s}</div>
              <div className="grid grid-cols-2 gap-2">
                {q.opts.map((o: string, oi: number) => (
                  <button key={oi} onClick={() => setAns(`v${i}`, oi)}
                    className={`p-2.5 rounded-lg border text-sm text-center cursor-pointer transition ${answers[`v${i}`] === oi ? "bg-blue-50 border-blue-400 font-medium" : "bg-slate-50 border-slate-200 hover:bg-slate-100"}`}>{o}</button>
                ))}
              </div>
            </div>
          ))}
          <h3 className="font-bold text-slate-800 mt-8 text-base">Part 3: Reading Comprehension</h3>
          <div className="bg-white rounded-xl p-4 md:p-6 border border-slate-200">
            <div className="text-xs font-semibold text-blue-600 mb-2 uppercase tracking-wide">Read the following passage:</div>
            <p className="text-sm md:text-base leading-7 md:leading-8 text-slate-700 whitespace-pre-line">{readingData.passage}</p>
          </div>
          {readingData.questions.map((q: any, i: number) => (
            <div key={i} className="bg-white rounded-xl p-4 md:p-5 border border-slate-200">
              <div className="font-medium text-slate-800 mb-3 text-sm">{vocabQs.length + i + 1}. {q.q}</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {q.opts.map((o: string, oi: number) => (
                  <button key={oi} onClick={() => setAns(`r${i}`, oi)}
                    className={`p-2.5 rounded-lg border text-sm text-left cursor-pointer transition ${answers[`r${i}`] === oi ? "bg-blue-50 border-blue-400 font-medium" : "bg-slate-50 border-slate-200 hover:bg-slate-100"}`}>{String.fromCharCode(65 + oi)}. {o}</button>
                ))}
              </div>
            </div>
          ))}
          <div className="text-center py-6">
            <button onClick={() => { setStarted(false); setPhase("result"); const s = calcScore(); const p = Math.round((s.correct / s.total) * 100); if (p === 100) playPerfect(); else if (p >= 72) playVictory(); else playWrong(); }} disabled={rDone < rTotal}
              className="px-10 py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg cursor-pointer border-none hover:bg-emerald-700 transition disabled:opacity-40">📊 Submit Test</button>
            {rDone < rTotal && <p className="text-xs text-slate-400 mt-2">Answer all questions to submit.</p>}
          </div>
        </div>
      )}
    </div>
  );
}
