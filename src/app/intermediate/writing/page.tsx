"use client";
import { INTER_WRITING as ELEM_WRITING } from "@/data/writing/intermediate-writing";
import { useState, useEffect } from "react";
import { playCorrect, playWrong, playPerfect, playVictory } from "@/lib/sounds";

/* ─── Utils ─── */
const shuffle = <T,>(a: T[]): T[] => [...a].sort(() => Math.random() - 0.5);
const pick = <T,>(a: T[], n: number): T[] => shuffle(a).slice(0, n);

/* ─── Types ─── */
type WritingTab = "reorder" | "translation" | "paragraph" | "guided";
type Phase = "practice" | "result";

const TABS = [
  { id: "reorder" as WritingTab, icon: "🔀", title: "句子重組", desc: "排出正確句子" },
  { id: "translation" as WritingTab, icon: "🔄", title: "中翻英", desc: "翻譯中文句子" },
  { id: "paragraph" as WritingTab, icon: "📑", title: "段落排序", desc: "排出段落順序" },
  { id: "guided" as WritingTab, icon: "✍️", title: "引導式寫作", desc: "看提示寫短文" },
];

/* ─── Shared UI ─── */
function ProgressBar({ cur, tot }: { cur: number; tot: number }) {
  return (
    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mb-4">
      <div className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-violet-500 to-fuchsia-500"
        style={{ width: `${(cur / tot) * 100}%` }} />
    </div>
  );
}

function ScoreBadge({ score, combo }: { score: number; combo: number }) {
  return (
    <div className="flex gap-2 items-center">
      <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-600 text-sm font-bold">⭐ {score}</span>
      {combo > 1 && <span className="px-3 py-1 rounded-full bg-red-50 border border-red-300 text-red-500 text-sm font-bold animate-pulse">🔥 x{combo}</span>}
    </div>
  );
}

function ResultScreen({ score, total, onBack }: { score: number; total: number; onBack: () => void }) {
  const pct = Math.round((score / Math.max(total, 1)) * 100);
  const stars = pct >= 90 ? 3 : pct >= 60 ? 2 : pct >= 30 ? 1 : 0;
  return (
    <div className="max-w-sm mx-auto mt-16 text-center bg-white rounded-2xl p-10 border border-slate-200 shadow-lg animate-slideUp">
      <div className="text-5xl mb-4">{"⭐".repeat(stars)}{"☆".repeat(3 - stars)}</div>
      <h2 className="text-2xl font-black text-slate-800 mb-2">
        {pct >= 90 ? "太厲害了！🎉" : pct >= 60 ? "做得好！👏" : "繼續加油！💪"}
      </h2>
      <div className="text-5xl font-black text-amber-500 my-4">{score} 分</div>
      <div className="text-slate-400 mb-6">正確率 {pct}%</div>
      <button onClick={onBack} className="px-8 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 text-white font-bold cursor-pointer border-none text-base hover:opacity-90 transition">
        回到選單
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Main Writing Page
   ═══════════════════════════════════════════════════════════════ */
export default function WritingPage() {
  const [tab, setTab] = useState<WritingTab | null>(null);
  const [phase, setPhase] = useState<Phase>("practice");
  const [qi, setQi] = useState(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [show, setShow] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  // Sentence reorder state
  const [sentArr, setSentArr] = useState<any[]>([]);
  const [sentRem, setSentRem] = useState<any[]>([]);

  // Translation state
  const [transInput, setTransInput] = useState("");

  // Paragraph order state
  const [paraArr, setParaArr] = useState<any[]>([]);
  const [paraRem, setParaRem] = useState<any[]>([]);

  // Guided writing state
  const [essayInput, setEssayInput] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const startTab = (t: WritingTab) => {
    setTab(t); setPhase("practice"); setQi(0); setScore(0); setCombo(0); setShow(false);
    setTransInput(""); setEssayInput(""); setSubmitted(false);

    switch (t) {
      case "reorder": {
        const qs = pick(ELEM_WRITING.sentenceReorder, 10);
        setQuestions(qs); setTotal(10);
        setSentArr([]); setSentRem(shuffle(qs[0].parts.map((p: string, i: number) => ({ t: p, id: `0-${i}` }))));
        break;
      }
      case "translation": {
        setQuestions(pick(ELEM_WRITING.translation, 8)); setTotal(8);
        break;
      }
      case "paragraph": {
        const qs = pick(ELEM_WRITING.paragraphOrder, 5);
        setQuestions(qs); setTotal(5);
        setParaArr([]); setParaRem(shuffle(qs[0].sentences.map((s: string, i: number) => ({ t: s, id: `0-${i}` }))));
        break;
      }
      case "guided": {
        setQuestions(pick(ELEM_WRITING.guidedWriting, 3)); setTotal(3);
        break;
      }
    }
  };

  // Init sentence reorder on question change
  useEffect(() => {
    if (tab === "reorder" && questions[qi] && !show) {
      setSentArr([]);
      setSentRem(shuffle(questions[qi].parts.map((p: string, i: number) => ({ t: p, id: `${qi}-${i}` }))));
    }
  }, [qi, tab, questions, show]);

  // Init paragraph order on question change
  useEffect(() => {
    if (tab === "paragraph" && questions[qi] && !show) {
      setParaArr([]);
      setParaRem(shuffle(questions[qi].sentences.map((s: string, i: number) => ({ t: s, id: `${qi}-${i}` }))));
    }
  }, [qi, tab, questions, show]);

  // Victory sound
  useEffect(() => { if (phase === "result") playVictory(); }, [phase]);

  const addPt = (pts: number, isOk: boolean) => {
    if (isOk) { setScore(s => s + pts + combo * 3); setCombo(c => c + 1); playCorrect(); }
    else { setCombo(0); playWrong(); }
  };

  const advance = () => {
    if (qi + 1 >= total) { setPhase("result"); return; }
    setQi(q => q + 1); setShow(false); setTransInput(""); setEssayInput(""); setSubmitted(false);
  };

  // ─── Sentence Reorder handlers ───
  const handleSentenceCheck = () => {
    const isOk = sentArr.map((w: any) => w.t).join(" ") === questions[qi].parts.join(" ");
    setShow(true); addPt(15, isOk);
    setTimeout(() => advance(), 1300);
  };

  // ─── Translation handlers ───
  const handleTranslationCheck = () => {
    if (show) return;
    const q = questions[qi];
    const normalized = transInput.toLowerCase().trim().replace(/[.,!?;:'"]/g, "");
    const matched = q.keywords.filter((kw: string) => normalized.includes(kw.toLowerCase()));
    const pct = matched.length / q.keywords.length;
    setShow(true);
    addPt(Math.round(pct * 15), pct >= 0.5);
    setTimeout(() => advance(), 2500);
  };

  // ─── Paragraph Order handlers ───
  const handleParagraphCheck = () => {
    const isOk = paraArr.map((s: any) => s.t).join("|") === questions[qi].sentences.join("|");
    setShow(true); addPt(20, isOk);
    setTimeout(() => advance(), 1500);
  };

  // ─── Guided Writing handlers ───
  const handleGuidedSubmit = () => {
    setSubmitted(true);
    const wordCount = essayInput.trim().split(/\s+/).filter(Boolean).length;
    const minWords = questions[qi].minWords || 30;
    const vocabUsed = (questions[qi].vocabulary || []).filter((v: string) =>
      essayInput.toLowerCase().includes(v.toLowerCase())
    ).length;
    const vocabTotal = (questions[qi].vocabulary || []).length;
    const pts = (wordCount >= minWords ? 10 : 5) + Math.round((vocabUsed / Math.max(vocabTotal, 1)) * 10);
    addPt(pts, wordCount >= minWords);
  };

  const handleGuidedNext = () => advance();

  // ─── MENU ───
  if (!tab) return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">✍️</div>
        <h1 className="text-3xl font-black text-slate-800 mb-2">寫作練習</h1>
        <p className="text-slate-500">透過多種題型練習英文寫作能力</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {TABS.map(t => (
          <button key={t.id} onClick={() => startTab(t.id)}
            className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-left cursor-pointer">
            <div className="text-3xl mb-2">{t.icon}</div>
            <div className="font-bold text-slate-800 text-lg">{t.title}</div>
            <div className="text-sm text-slate-500 mt-1">{t.desc}</div>
          </button>
        ))}
      </div>
      <div className="text-center mt-6">
        <a href="/intermediate" className="text-sm text-blue-500 hover:underline">← 回到中級</a>
      </div>
    </div>
  );

  // ─── RESULT ───
  if (phase === "result") {
    const maxPts = tab === "reorder" ? total * 15 : tab === "translation" ? total * 15 : tab === "paragraph" ? total * 20 : total * 20;
    return <ResultScreen score={score} total={maxPts} onBack={() => { setTab(null); setPhase("practice"); }} />;
  }

  // ─── PRACTICE ───
  const q = questions[qi];
  if (!q) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setTab(null)} className="text-sm text-blue-500 bg-transparent border-none cursor-pointer p-1">← 選單</button>
        <span className="text-sm font-bold text-violet-600">{TABS.find(t => t.id === tab)?.icon} {TABS.find(t => t.id === tab)?.title}</span>
        <ScoreBadge score={score} combo={combo} />
      </div>
      <ProgressBar cur={qi + 1} tot={total} />
      <div className="text-xs text-slate-400 text-center mb-4">{qi + 1} / {total}</div>

      {/* ─── Tab: Sentence Reorder ─── */}
      {tab === "reorder" && (
        <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200 shadow-sm">
          <div className="text-center mb-4">
            <span className="text-sm text-violet-600 font-medium">💡 {q.zh}</span>
          </div>
          {/* Placed words area */}
          <div className="min-h-[56px] p-3 rounded-xl border-2 border-dashed border-violet-300 bg-violet-50 flex flex-wrap gap-2 mb-4">
            {sentArr.length === 0 && <span className="text-violet-300 text-sm">👆 點擊單字排出句子</span>}
            {sentArr.map((w: any) => (
              <button key={w.id} onClick={() => { if (show) return; setSentArr(a => a.filter(x => x.id !== w.id)); setSentRem(r => [...r, w]); }}
                className="px-3 py-1.5 rounded-lg bg-violet-600 text-white font-medium text-sm cursor-pointer border-none hover:bg-violet-700 transition">
                {w.t}
              </button>
            ))}
          </div>
          {/* Remaining words */}
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            {sentRem.map((w: any) => (
              <button key={w.id} onClick={() => { if (show) return; setSentRem(r => r.filter(x => x.id !== w.id)); setSentArr(a => [...a, w]); }}
                className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-medium text-sm cursor-pointer border border-slate-300 hover:bg-slate-200 transition">
                {w.t}
              </button>
            ))}
          </div>
          {/* Check button / Result */}
          {sentArr.length === q.parts.length && !show && (
            <div className="text-center">
              <button onClick={handleSentenceCheck}
                className="px-6 py-2.5 rounded-xl bg-violet-600 text-white font-bold cursor-pointer border-none hover:bg-violet-700 transition">確認答案 ✓</button>
            </div>
          )}
          {show && (
            <div className={`text-center p-3 rounded-xl text-sm font-bold ${sentArr.map((w: any) => w.t).join(" ") === q.parts.join(" ") ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
              {sentArr.map((w: any) => w.t).join(" ") === q.parts.join(" ") ? "✅ 完美！" : `❌ 正確：${q.parts.join(" ")}`}
            </div>
          )}
        </div>
      )}

      {/* ─── Tab: Translation ─── */}
      {tab === "translation" && (
        <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200 shadow-sm">
          <div className="text-center mb-4">
            <div className="text-lg font-bold text-slate-800 mb-2">🔄 請翻譯以下中文</div>
            <div className="text-xl font-bold text-violet-700 bg-violet-50 rounded-xl p-4">{q.zh}</div>
          </div>
          {q.hint && (
            <div className="text-center mb-3">
              <span className="text-xs text-slate-400">💡 提示：{q.hint}</span>
            </div>
          )}
          <textarea value={transInput} onChange={e => setTransInput(e.target.value)} disabled={show}
            placeholder="Type your English translation here..."
            className="w-full p-4 rounded-xl border border-slate-300 text-sm leading-6 resize-none h-24 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 disabled:bg-slate-50" />
          {!show && transInput.trim() && (
            <div className="text-center mt-3">
              <button onClick={handleTranslationCheck}
                className="px-6 py-2.5 rounded-xl bg-violet-600 text-white font-bold cursor-pointer border-none hover:bg-violet-700 transition">確認答案 ✓</button>
            </div>
          )}
          {show && (
            <div className="mt-4 space-y-3">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="text-xs font-semibold text-emerald-600 mb-1">參考答案：</div>
                <div className="text-sm text-emerald-800 font-medium">{q.answer}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 text-xs text-slate-500">
                <span className="font-semibold">關鍵字：</span>
                {q.keywords.map((kw: string, i: number) => {
                  const matched = transInput.toLowerCase().includes(kw.toLowerCase());
                  return <span key={i} className={`ml-1 px-1.5 py-0.5 rounded ${matched ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>{kw}</span>;
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─── Tab: Paragraph Order ─── */}
      {tab === "paragraph" && (
        <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200 shadow-sm">
          <div className="text-center mb-4">
            <div className="text-lg font-bold text-slate-800 mb-1">📑 排出正確的段落順序</div>
            <span className="text-sm text-violet-600 font-medium">💡 {q.zh}：{q.title}</span>
          </div>
          {/* Placed sentences area */}
          <div className="min-h-[80px] p-3 rounded-xl border-2 border-dashed border-violet-300 bg-violet-50 space-y-2 mb-4">
            {paraArr.length === 0 && <span className="text-violet-300 text-sm">👆 點擊句子排出正確順序</span>}
            {paraArr.map((s: any, idx: number) => (
              <button key={s.id} onClick={() => { if (show) return; setParaArr(a => a.filter(x => x.id !== s.id)); setParaRem(r => [...r, s]); }}
                className="w-full text-left p-3 rounded-lg bg-violet-600 text-white text-sm cursor-pointer border-none hover:bg-violet-700 transition leading-5">
                <span className="font-bold mr-2">{idx + 1}.</span>{s.t}
              </button>
            ))}
          </div>
          {/* Remaining sentences */}
          <div className="space-y-2 mb-4">
            {paraRem.map((s: any) => (
              <button key={s.id} onClick={() => { if (show) return; setParaRem(r => r.filter(x => x.id !== s.id)); setParaArr(a => [...a, s]); }}
                className="w-full text-left p-3 rounded-lg bg-slate-100 text-slate-700 text-sm cursor-pointer border border-slate-300 hover:bg-slate-200 transition leading-5">
                {s.t}
              </button>
            ))}
          </div>
          {/* Check button / Result */}
          {paraArr.length === q.sentences.length && !show && (
            <div className="text-center">
              <button onClick={handleParagraphCheck}
                className="px-6 py-2.5 rounded-xl bg-violet-600 text-white font-bold cursor-pointer border-none hover:bg-violet-700 transition">確認答案 ✓</button>
            </div>
          )}
          {show && (
            <div className={`p-4 rounded-xl text-sm ${paraArr.map((s: any) => s.t).join("|") === q.sentences.join("|") ? "bg-emerald-50 border border-emerald-200" : "bg-red-50 border border-red-200"}`}>
              {paraArr.map((s: any) => s.t).join("|") === q.sentences.join("|")
                ? <div className="text-emerald-700 font-bold">✅ 完美！段落順序正確！</div>
                : <div><div className="text-red-600 font-bold mb-2">❌ 正確順序：</div>{q.sentences.map((s: string, i: number) => (
                  <div key={i} className="text-slate-700 mb-1"><span className="font-bold text-violet-600">{i + 1}.</span> {s}</div>
                ))}</div>
              }
            </div>
          )}
        </div>
      )}

      {/* ─── Tab: Guided Writing ─── */}
      {tab === "guided" && (
        <div className="bg-white rounded-2xl p-5 md:p-6 border border-slate-200 shadow-sm">
          <div className="text-center mb-4">
            <div className="text-lg font-bold text-slate-800 mb-1">✍️ {q.topic}</div>
            <div className="text-sm text-violet-600">{q.zh}</div>
          </div>
          {/* Prompts */}
          <div className="bg-violet-50 rounded-xl p-4 mb-4">
            <div className="text-xs font-semibold text-violet-600 mb-2">引導問題：</div>
            <ul className="space-y-1.5 text-sm text-slate-700">
              {q.prompts.map((p: string, i: number) => (
                <li key={i} className="flex gap-2"><span className="text-violet-400 flex-shrink-0">•</span>{p}</li>
              ))}
            </ul>
          </div>
          {/* Suggested vocabulary */}
          {q.vocabulary && q.vocabulary.length > 0 && (
            <div className="mb-4">
              <span className="text-xs font-semibold text-slate-500">建議用字：</span>
              {q.vocabulary.map((v: string, i: number) => (
                <span key={i} className="ml-1 text-xs px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600">{v}</span>
              ))}
            </div>
          )}
          {/* Textarea */}
          <textarea value={essayInput} onChange={e => setEssayInput(e.target.value)} disabled={submitted}
            placeholder="Write your paragraph here..."
            className="w-full p-4 rounded-xl border border-slate-300 text-sm leading-7 resize-none h-40 focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 disabled:bg-slate-50" />
          <div className="flex justify-between items-center mt-2 text-xs text-slate-400">
            <span>字數：{essayInput.trim().split(/\s+/).filter(Boolean).length} / {q.minWords || 30} (最低)</span>
            {!submitted && essayInput.trim().split(/\s+/).filter(Boolean).length >= (q.minWords || 30) && (
              <button onClick={handleGuidedSubmit}
                className="px-4 py-1.5 rounded-lg bg-violet-600 text-white text-xs font-bold cursor-pointer border-none hover:bg-violet-700 transition">提交 ✓</button>
            )}
            {!submitted && essayInput.trim().split(/\s+/).filter(Boolean).length > 0 && essayInput.trim().split(/\s+/).filter(Boolean).length < (q.minWords || 30) && (
              <button onClick={handleGuidedSubmit}
                className="px-4 py-1.5 rounded-lg bg-slate-400 text-white text-xs font-bold cursor-pointer border-none hover:bg-slate-500 transition">字數不足，仍要提交</button>
            )}
          </div>
          {/* Sample answer after submission */}
          {submitted && (
            <div className="mt-4 space-y-3">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="text-xs font-semibold text-emerald-600 mb-2">範文參考：</div>
                <p className="text-sm text-emerald-800 leading-7">{q.sampleAnswer}</p>
              </div>
              {q.vocabulary && (
                <div className="p-3 rounded-xl bg-slate-50 text-xs text-slate-500">
                  <span className="font-semibold">建議用字使用情況：</span>
                  {q.vocabulary.map((v: string, i: number) => {
                    const used = essayInput.toLowerCase().includes(v.toLowerCase());
                    return <span key={i} className={`ml-1 px-1.5 py-0.5 rounded ${used ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-500"}`}>{v} {used ? "✓" : "✗"}</span>;
                  })}
                </div>
              )}
              <div className="text-center">
                <button onClick={handleGuidedNext}
                  className="px-6 py-2.5 rounded-xl bg-violet-600 text-white font-bold cursor-pointer border-none hover:bg-violet-700 transition">
                  {qi + 1 < total ? "下一題 →" : "查看成績 📊"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
