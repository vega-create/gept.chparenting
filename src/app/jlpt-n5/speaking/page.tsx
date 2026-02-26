"use client";
import { N5_UNITS } from "@/data/jlpt-n5";
import { useState, useEffect, useRef } from "react";
import { playCorrect, playWrong, playPerfect, playVictory } from "@/lib/sounds";
import { compareTextJa, scoreSpeechResult } from "@/lib/speech-scoring";

/* Speech Recognition types */
interface SRResult { transcript: string; confidence: number }
interface SRResultList { length: number; [index: number]: SRResult }
interface SREvent { results: { length: number; [index: number]: SRResultList } }
interface SRecognition { lang: string; interimResults: boolean; maxAlternatives: number; continuous: boolean; onresult: ((e: SREvent) => void) | null; onerror: (() => void) | null; onend: (() => void) | null; start: () => void; stop: () => void; abort: () => void }

/* ─── Speech helpers ─── */
const speak = (text: string, rate = 0.8, onEnd?: () => void) => {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "ja-JP"; u.rate = rate;
  if (onEnd) u.onend = onEnd;
  window.speechSynthesis.speak(u);
};

/* ─── Utils ─── */
const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);
const pick = <T,>(arr: T[], n: number): T[] => shuffle(arr).slice(0, n);

/* ─── Data sources ─── */
const allVocab = N5_UNITS.flatMap(u => u.vocab);
const allSentences = N5_UNITS.flatMap(u => u.listening.map(l => ({ text: l.text, zh: l.zh })));
const allPassages = N5_UNITS.flatMap(u => {
  const readings = Array.isArray(u.reading) ? u.reading : [u.reading];
  return readings.map((r, i) => ({
    passage: r.passage,
    title: u.title + (readings.length > 1 ? ` (${i + 1})` : ""),
  }));
});

/* ─── Q&A questions ─── */
const QA_QUESTIONS = [
  { q: "お名前は何ですか？", hint: "你叫什麼名字？", sample: "わたしは田中です。" },
  { q: "どこから来ましたか？", hint: "你從哪裡來？", sample: "台湾から来ました。" },
  { q: "趣味は何ですか？", hint: "你的興趣是什麼？", sample: "読書が好きです。" },
  { q: "今日は何曜日ですか？", hint: "今天星期幾？", sample: "今日は月曜日です。" },
  { q: "好きな食べ物は何ですか？", hint: "你喜歡什麼食物？", sample: "寿司が好きです。" },
];

type Mode = "menu" | "words" | "sentences" | "passage" | "qa";

export default function SpeakingPage() {
  const [mode, setMode] = useState<Mode>("menu");
  const [supported, setSupported] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const [idx, setIdx] = useState(0);
  const [recording, setRecording] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [attempts, setAttempts] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [bestScores, setBestScores] = useState<Record<number, number>>({});
  const [showText, setShowText] = useState(false);
  const [showSample, setShowSample] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const recognizerRef = useRef<SRecognition | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const wnd = window as unknown as Record<string, unknown>;
      const SR = wnd.SpeechRecognition || wnd.webkitSpeechRecognition;
      if (!SR) setSupported(false);
    }
  }, []);

  // Stop speech when leaving page
  useEffect(() => { return () => { if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel(); }; }, []);

  const startMode = (m: Mode) => {
    setMode(m); setIdx(0); setResult(null); setAttempts(0);
    setTotalScore(0); setCompleted(0); setBestScores({});
    setShowText(false); setShowSample(false);
    switch (m) {
      case "words": setItems(pick(allVocab, 10)); break;
      case "sentences": setItems(pick(allSentences, 8)); break;
      case "passage": setItems([allPassages[Math.floor(Math.random() * allPassages.length)]]); break;
      case "qa": setItems(pick(QA_QUESTIONS, 5)); break;
    }
  };

  const startRecording = (targetText: string) => {
    const wnd = window as unknown as Record<string, unknown>;
    const SRClass = (wnd.SpeechRecognition || wnd.webkitSpeechRecognition) as { new(): SRecognition } | undefined;
    if (!SRClass) return;

    if (recognizerRef.current) {
      try { recognizerRef.current.abort(); } catch { /* ignore */ }
    }

    const recog = new SRClass();
    recognizerRef.current = recog;
    recog.lang = "ja-JP";
    recog.interimResults = false;
    recog.maxAlternatives = 3;
    recog.continuous = false;

    recog.onresult = (e: SREvent) => {
      const alts: { transcript: string; confidence: number }[] = [];
      for (let i = 0; i < e.results[0].length; i++) {
        alts.push({
          transcript: e.results[0][i].transcript,
          confidence: e.results[0][i].confidence ?? 0,
        });
      }
      const { pct: bestPct, transcript: bestTranscript, matched: bestMatched } =
        scoreSpeechResult(alts, targetText, compareTextJa);

      setResult({ transcript: bestTranscript, pct: bestPct, matched: bestMatched });
      setRecording(false);
      setAttempts(a => a + 1);
      if (bestPct >= 90) playPerfect();
      else if (bestPct >= 50) playCorrect();
      else playWrong();

      setBestScores(prev => {
        const prevBest = prev[idx] || 0;
        if (bestPct > prevBest) {
          setTotalScore(s => s - prevBest + bestPct);
          return { ...prev, [idx]: bestPct };
        }
        return prev;
      });
    };

    recog.onerror = () => { setRecording(false); recognizerRef.current = null; };
    recog.onend = () => { setRecording(false); recognizerRef.current = null; };

    setResult(null);
    setRecording(true);
    recog.start();
  };

  const next = () => {
    if (idx + 1 >= items.length) {
      setCompleted(items.length);
      return;
    }
    setIdx(i => i + 1);
    setResult(null);
    setAttempts(0);
    setShowText(false);
    setShowSample(false);
  };

  const prev = () => {
    if (idx <= 0) return;
    setIdx(i => i - 1);
    setResult(null);
    setAttempts(0);
    setShowText(false);
    setShowSample(false);
  };

  const pctColor = (pct: number) => pct >= 80 ? "#059669" : pct >= 50 ? "#f59e0b" : "#ef4444";
  const pctEmoji = (pct: number) => pct >= 90 ? "🌟" : pct >= 80 ? "⭐" : pct >= 60 ? "👍" : pct >= 40 ? "💪" : "🔄";
  const pctMsg = (pct: number) => pct >= 90 ? "完璧！Perfect!" : pct >= 80 ? "すごい！Very good!" : pct >= 60 ? "いいね！Keep going!" : pct >= 40 ? "頑張って！Try again!" : "もう一度！";

  /* ═══════════════ MENU ═══════════════ */
  if (mode === "menu") return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">🎙️</div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-800 mb-2">口說訓練中心</h1>
        <p className="text-slate-500">練習日文發音、跟讀、朗讀和問答</p>
        {!supported && (
          <div className="mt-3 bg-red-50 text-red-600 rounded-xl p-3 text-sm">
            ⚠️ 您的瀏覽器不支援語音辨識，請使用 <strong>Chrome</strong> 瀏覽器
          </div>
        )}
      </div>

      <div className="grid gap-4">
        {[
          { m: "words" as Mode, icon: "🔤", title: "單字發音", desc: "唸出日文單字，AI 即時辨識你的發音", tag: "基礎", color: "#dc2626", count: "10 個單字" },
          { m: "sentences" as Mode, icon: "🗣️", title: "句子跟讀", desc: "先聽再唸，3 種速度可調、無限重試", tag: "初級", color: "#7c3aed", count: "8 個句子" },
          { m: "passage" as Mode, icon: "📖", title: "短文朗讀", desc: "挑戰朗讀整段日文文章，逐句練習", tag: "進階", color: "#059669", count: "1 篇短文" },
          { m: "qa" as Mode, icon: "💬", title: "問答練習", desc: "聽日文問題、用日文回答", tag: "N5", color: "#dc2626", count: "5 題" },
        ].map(item => (
          <button key={item.m} onClick={() => startMode(item.m)} disabled={!supported && item.m !== "menu"}
            className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition text-left cursor-pointer disabled:opacity-40 active:scale-[0.99]">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{ background: item.color + "12" }}>{item.icon}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-bold text-slate-800">{item.title}</span>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: item.color + "15", color: item.color }}>{item.tag}</span>
              </div>
              <div className="text-sm text-slate-500">{item.desc}</div>
              <div className="text-xs text-slate-400 mt-1">{item.count}</div>
            </div>
            <span className="text-slate-300">→</span>
          </button>
        ))}
      </div>

      <div className="text-center mt-6">
        <a href="/jlpt-n5" className="text-sm text-red-500 hover:underline no-underline">← 回到 JLPT N5</a>
      </div>
    </div>
  );

  /* ═══════════════ COMPLETED SCREEN ═══════════════ */
  if (completed > 0 && completed >= items.length) {
    const avgScore = items.length > 0 ? Math.round(Object.values(bestScores).reduce((a, b) => a + b, 0) / items.length) : 0;
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-lg">
          <div className="text-6xl mb-3">{avgScore >= 70 ? "🎉" : "💪"}</div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">練習完成！</h2>
          <div className="text-5xl font-black my-4" style={{ color: pctColor(avgScore) }}>{avgScore}%</div>
          <div className="text-sm text-slate-500 mb-4">平均正確率</div>

          <div className="bg-slate-50 rounded-xl p-4 text-left text-sm space-y-2 mb-6">
            {items.map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-slate-600">第 {i + 1} 題</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${bestScores[i] || 0}%`, background: pctColor(bestScores[i] || 0) }} />
                  </div>
                  <span className="font-bold text-sm w-10 text-right" style={{ color: pctColor(bestScores[i] || 0) }}>{bestScores[i] || 0}%</span>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 justify-center flex-wrap">
            <button onClick={() => startMode(mode)} className="px-6 py-2.5 rounded-xl bg-red-500 text-white font-semibold text-sm cursor-pointer border-none">🔄 再練一次</button>
            <button onClick={() => setMode("menu")} className="px-6 py-2.5 rounded-xl border-2 border-slate-300 text-slate-600 font-semibold text-sm cursor-pointer bg-white">← 選其他模式</button>
          </div>
        </div>
      </div>
    );
  }

  const item = items[idx];
  if (!item) return null;

  /* ─── Shared Recording Button ─── */
  const RecordButton = ({ target, size = "lg" }: { target: string; size?: "lg" | "sm" }) => (
    <div className="text-center">
      <button onClick={() => recording ? null : startRecording(target)} disabled={recording}
        className={`rounded-full cursor-pointer transition border-3 ${recording ? "animate-pulse" : "hover:scale-105"} ${size === "lg" ? "w-20 h-20 text-3xl" : "w-14 h-14 text-xl"}`}
        style={{ borderColor: recording ? "#ef4444" : "#dc2626", background: recording ? "#fee2e2" : "#fef2f2" }}>
        {recording ? "🎤" : "🎙️"}
      </button>
      <div className="text-sm text-slate-400 mt-2">
        {recording ? "聞いています…大きな声で！" : result ? "もう一度試すには押してください" : "押して録音開始"}
      </div>
    </div>
  );

  /* ─── Result Display (character-by-character for Japanese) ─── */
  const ResultDisplay = ({ targetText }: { targetText: string }) => {
    if (!result) return null;
    const cleanTarget = targetText.replace(/[\s\u3000]/g, "");
    const chars = Array.from(cleanTarget);
    return (
      <div className="animate-fadeIn mt-4">
        <div className="text-center mb-3">
          <span className="inline-block px-5 py-2 rounded-full text-2xl font-black" style={{ color: pctColor(result.pct), background: pctColor(result.pct) + "12" }}>
            {pctEmoji(result.pct)} {result.pct}%
          </span>
          <div className="text-sm text-slate-500 mt-1">{pctMsg(result.pct)}</div>
        </div>

        {/* Character-by-character highlight */}
        <div className="bg-slate-50 rounded-xl p-4 mb-3">
          <div className="text-sm text-slate-400 mb-2">逐字比對：</div>
          <div className="text-lg leading-10 tracking-wider">
            {chars.map((c, i) => {
              const isPunc = /[。、！？「」（）]/.test(c);
              if (isPunc) return <span key={i} className="text-slate-400">{c}</span>;
              const isMatched = result.matched.includes(i);
              return (
                <span key={i} className="transition" style={{
                  color: isMatched ? "#059669" : "#ef4444",
                  fontWeight: isMatched ? 700 : 400,
                  textDecoration: isMatched ? "none" : "underline wavy",
                }}>{c}</span>
              );
            })}
          </div>
        </div>

        {result.transcript && (
          <div className="text-xs text-slate-400 text-center">
            AI 聽到：「{result.transcript}」
          </div>
        )}

        <div className="flex gap-3 justify-center mt-4">
          <button onClick={() => { setResult(null); setRecording(false); }}
            className="px-5 py-2.5 rounded-xl border-2 border-red-300 text-red-600 font-semibold text-sm cursor-pointer bg-white hover:bg-red-50 transition">
            🔄 再唸一次
          </button>
          <button onClick={next}
            className="px-5 py-2.5 rounded-xl bg-red-500 text-white font-semibold text-sm cursor-pointer border-none hover:bg-red-600 transition">
            {idx + 1 >= items.length ? "看結果 →" : "下一題 →"}
          </button>
        </div>
      </div>
    );
  };

  /* ─── Navigation Buttons ─── */
  const NavButtons = () => (
    <div className="flex justify-between mt-4">
      <button onClick={prev} disabled={idx <= 0}
        className="px-4 py-2 rounded-lg text-sm font-medium text-slate-500 bg-slate-100 border border-slate-200 cursor-pointer disabled:opacity-30 hover:bg-slate-200 transition">
        ← 上一題
      </button>
      <button onClick={next}
        className="px-4 py-2 rounded-lg text-sm font-medium text-red-600 bg-red-50 border border-red-200 cursor-pointer hover:bg-red-100 transition">
        {idx + 1 >= items.length ? "完成 →" : "跳過 →"}
      </button>
    </div>
  );

  /* ═══════════════ HEADER ═══════════════ */
  const modeLabel = mode === "words" ? "🔤 單字發音" : mode === "sentences" ? "🗣️ 句子跟讀" : mode === "passage" ? "📖 短文朗讀" : "💬 問答練習";

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 bg-white p-3 rounded-xl border border-slate-200 sticky top-16 z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <button onClick={() => { setMode("menu"); setCompleted(0); }} className="text-sm text-red-500 bg-transparent border-none cursor-pointer p-1">← 返回</button>
          <span className="text-sm font-bold text-slate-700">{modeLabel}</span>
        </div>
        <div className="flex items-center gap-2">
          {mode !== "passage" && (
            <span className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-full font-medium">
              {idx + 1} / {items.length}
            </span>
          )}
          {Object.keys(bestScores).length > 0 && (
            <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full font-medium">
              avg {Math.round(Object.values(bestScores).reduce((a, b) => a + b, 0) / Math.max(Object.keys(bestScores).length, 1))}%
            </span>
          )}
        </div>
      </div>

      {/* Progress */}
      {mode !== "passage" && (
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-5">
          <div className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-red-500 to-pink-500"
            style={{ width: `${((idx) / items.length) * 100}%` }} />
        </div>
      )}

      {/* ─── WORD PRONUNCIATION ─── */}
      {mode === "words" && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="text-center mb-6">
            <div className="text-4xl md:text-5xl font-black text-red-600 mb-2">{item.ja}</div>
            <div className="text-xl text-slate-500 mb-1">{item.reading}</div>
            <div className="text-sm text-slate-400">{item.pos}</div>
            <div className="text-lg font-semibold text-slate-600 mt-1">{item.zh}</div>
            <button onClick={() => { setIsPlaying(true); speak(item.ja, 0.8, () => setIsPlaying(false)); }}
              className="mt-3 px-4 py-2 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm cursor-pointer hover:bg-red-100 transition">
              {isPlaying ? "🔊 再生中..." : "🔊 先聽發音"}
            </button>
          </div>
          <RecordButton target={item.ja} />
          <ResultDisplay targetText={item.ja} />
          {!result && (
            <div className="text-center mt-4">
              <div className="text-xs text-slate-300">例句：{item.ex}</div>
              <div className="text-xs text-slate-300">{item.exZh}</div>
            </div>
          )}
          <NavButtons />
        </div>
      )}

      {/* ─── SENTENCE REPEAT ─── */}
      {mode === "sentences" && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="text-center mb-4">
            <div className="text-sm text-slate-400 mb-3">先聽日文句子，再跟著唸</div>
            <div className="flex justify-center gap-3 mb-4">
              <button onClick={() => { setIsPlaying(true); speak(item.text, 0.5, () => setIsPlaying(false)); }}
                className="px-4 py-2.5 rounded-lg border border-purple-200 bg-purple-50 text-purple-600 text-sm cursor-pointer hover:bg-purple-100 transition">
                🐢 慢速
              </button>
              <button onClick={() => { setIsPlaying(true); speak(item.text, 0.8, () => setIsPlaying(false)); }}
                className="px-5 py-2.5 rounded-lg border border-purple-300 bg-purple-100 text-purple-700 text-sm font-bold cursor-pointer hover:bg-purple-200 transition">
                {isPlaying ? "🔊 再生中" : "🔊 普通"}
              </button>
              <button onClick={() => { setIsPlaying(true); speak(item.text, 1.0, () => setIsPlaying(false)); }}
                className="px-4 py-2.5 rounded-lg border border-purple-200 bg-purple-50 text-purple-600 text-sm cursor-pointer hover:bg-purple-100 transition">
                🐇 快速
              </button>
            </div>
          </div>

          {/* Toggle text */}
          <div className="text-center mb-4">
            <button onClick={() => setShowText(!showText)}
              className="text-xs text-slate-400 bg-transparent border border-dashed border-slate-200 rounded-lg px-3 py-1.5 cursor-pointer hover:bg-slate-50 transition">
              {showText ? "👁️ 隱藏文字" : "👁️ 顯示文字（先聽再看）"}
            </button>
          </div>
          {showText && (
            <div className="bg-purple-50 rounded-xl p-4 mb-4 text-center animate-fadeIn">
              <p className="text-base font-medium text-slate-800 leading-7">{item.text}</p>
              <p className="text-sm text-slate-400 mt-1">{item.zh}</p>
            </div>
          )}

          <RecordButton target={item.text} />
          <ResultDisplay targetText={item.text} />
          <NavButtons />
        </div>
      )}

      {/* ─── PASSAGE READ-ALOUD ─── */}
      {mode === "passage" && (() => {
        const sentences = item.passage.split(/(?<=[。！？])\s*/).filter((s: string) => s.trim().length > 1);
        const currentSentence = sentences[idx] || "";
        const totalSentences = sentences.length;

        return (
          <div>
            {/* Full passage display */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm mb-4">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600">
                  {item.title}
                </span>
                <span className="text-xs text-slate-400">
                  句子 {Math.min(idx + 1, totalSentences)} / {totalSentences}
                </span>
              </div>
              <div className="text-sm leading-8 text-slate-600">
                {sentences.map((s: string, i: number) => (
                  <span key={i} className="transition-all" style={{
                    background: i === idx ? "#dcfce7" : i < idx ? "#f0fdf4" : "transparent",
                    color: i === idx ? "#166534" : i < idx ? "#86efac" : "#64748b",
                    fontWeight: i === idx ? 700 : 400,
                    borderRadius: 4, padding: "1px 2px",
                  }}>{s} </span>
                ))}
              </div>
            </div>

            {/* Current sentence practice */}
            {idx < totalSentences ? (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <div className="bg-emerald-50 rounded-xl p-4 mb-4">
                  <div className="text-sm text-emerald-600 font-medium mb-1">現在練習這句：</div>
                  <div className="text-lg font-semibold text-slate-800 leading-8">{currentSentence}</div>
                </div>
                <div className="flex justify-center gap-3 mb-4">
                  <button onClick={() => speak(currentSentence, 0.5)}
                    className="px-3 py-2 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-600 text-sm cursor-pointer">🐢 慢</button>
                  <button onClick={() => speak(currentSentence, 0.8)}
                    className="px-4 py-2 rounded-lg border border-emerald-300 bg-emerald-100 text-emerald-700 text-sm font-bold cursor-pointer">🔊 聽</button>
                  <button onClick={() => speak(currentSentence, 1.0)}
                    className="px-3 py-2 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-600 text-sm cursor-pointer">🐇 快</button>
                </div>
                <RecordButton target={currentSentence} />
                <ResultDisplay targetText={currentSentence} />
                <div className="flex justify-between mt-4">
                  <button onClick={prev} disabled={idx <= 0}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-slate-500 bg-slate-100 border border-slate-200 cursor-pointer disabled:opacity-30 hover:bg-slate-200 transition">
                    ← 上一句
                  </button>
                  <button onClick={next}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 cursor-pointer hover:bg-emerald-100 transition">
                    {idx + 1 >= totalSentences ? "完成 →" : "跳過 →"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center">
                <div className="text-4xl mb-3">🎉</div>
                <div className="text-xl font-bold text-slate-800 mb-2">整篇文章練習完成！</div>
                <div className="text-slate-500 mb-4">平均正確率：{Math.round(Object.values(bestScores).reduce((a, b) => a + b, 0) / Math.max(Object.keys(bestScores).length, 1))}%</div>
                <div className="flex gap-3 justify-center">
                  <button onClick={() => startMode("passage")} className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold text-sm cursor-pointer border-none">🔄 換一篇</button>
                  <button onClick={() => setMode("menu")} className="px-6 py-2.5 rounded-xl border-2 border-slate-300 text-slate-600 font-semibold text-sm cursor-pointer bg-white">← 返回</button>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* ─── Q&A PRACTICE ─── */}
      {mode === "qa" && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="text-center mb-5">
            <div className="bg-red-50 rounded-xl p-4 mb-4">
              <div className="text-xs text-red-400 font-medium mb-2 uppercase">質問 {idx + 1}</div>
              <div className="text-lg font-bold text-slate-800">{item.q}</div>
              <div className="text-sm text-slate-400 mt-1">{item.hint}</div>
            </div>
            <button onClick={() => { setIsPlaying(true); speak(item.q, 0.8, () => setIsPlaying(false)); }}
              className="px-4 py-2 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm cursor-pointer hover:bg-red-100 transition mb-2">
              {isPlaying ? "🔊 再生中..." : "🔊 聽問題"}
            </button>
          </div>

          <div className="text-center mb-2">
            <div className="text-sm text-slate-400 mb-3">用日文回答，不用完美，勇敢說就對了！💪</div>
          </div>

          <RecordButton target={item.sample} />

          {result && (
            <div className="animate-fadeIn mt-4">
              <div className="text-center mb-3">
                <span className="inline-block px-5 py-2 rounded-full text-2xl font-black" style={{ color: pctColor(result.pct), background: pctColor(result.pct) + "12" }}>
                  {pctEmoji(result.pct)} {result.pct}%
                </span>
                <div className="text-sm text-slate-500 mt-1">{result.pct >= 60 ? "よくできました！回答得很好！" : "頑張って！多說幾次就會更好！"}</div>
              </div>

              {result.transcript && (
                <div className="bg-blue-50 rounded-xl p-4 mb-3">
                  <div className="text-xs text-blue-400 mb-1">AI 聽到你說：</div>
                  <div className="text-sm text-slate-700">「{result.transcript}」</div>
                </div>
              )}

              {/* Sample answer toggle */}
              <div className="text-center mb-3">
                <button onClick={() => setShowSample(!showSample)}
                  className="text-xs text-slate-400 bg-transparent border border-dashed border-slate-200 rounded-lg px-3 py-1.5 cursor-pointer">
                  {showSample ? "隱藏參考答案" : "💡 看參考答案"}
                </button>
              </div>
              {showSample && (
                <div className="bg-amber-50 rounded-xl p-4 mb-3 animate-fadeIn">
                  <div className="text-xs text-amber-500 mb-1">參考答案：</div>
                  <div className="text-sm text-slate-700">{item.sample}</div>
                  <button onClick={() => speak(item.sample, 0.8)} className="mt-2 text-xs text-amber-600 bg-transparent border border-amber-200 rounded-lg px-2 py-1 cursor-pointer">🔊 聽參考答案</button>
                </div>
              )}

              <div className="flex gap-3 justify-center mt-3">
                <button onClick={() => { setResult(null); setShowSample(false); }}
                  className="px-5 py-2.5 rounded-xl border-2 border-red-300 text-red-600 font-semibold text-sm cursor-pointer bg-white">
                  🔄 再答一次
                </button>
                <button onClick={next}
                  className="px-5 py-2.5 rounded-xl bg-red-500 text-white font-semibold text-sm cursor-pointer border-none">
                  {idx + 1 >= items.length ? "看結果 →" : "下一題 →"}
                </button>
              </div>
            </div>
          )}
          <NavButtons />
        </div>
      )}
    </div>
  );
}
