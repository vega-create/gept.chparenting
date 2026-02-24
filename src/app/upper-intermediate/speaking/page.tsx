"use client";
import { UI_UNITS as UNITS } from "@/data/upper-intermediate";
import { useState, useEffect, useCallback, useRef } from "react";
import { playCorrect, playWrong, playPerfect, playVictory } from "@/lib/sounds";

const speak = (text: string, rate = 0.85, onEnd?: () => void) => {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US"; u.rate = rate;
  if (onEnd) u.onend = onEnd;
  window.speechSynthesis.speak(u);
};

const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);
const pick = <T,>(arr: T[], n: number): T[] => shuffle(arr).slice(0, n);

// All vocabulary
const allVocab = UNITS.flatMap(u => u.vocab);
// All listening sentences for repeat practice
const allSentences = UNITS.flatMap(u => u.listening.map(l => ({ text: l.text, zh: l.zh })));
// Reading passages for read-aloud
const allPassages = UNITS.flatMap(u => { const readings = Array.isArray(u.reading) ? u.reading : [u.reading]; return readings.map((r, i) => ({ passage: r.passage, title: u.title + (readings.length > 1 ? ` (${i+1})` : '') })); });

// Q&A practice questions (GEPT format)
const QA_QUESTIONS = [
  { q: "What do you usually do after school?", hint: "放學後你通常做什麼？", sample: "After school, I usually do my homework first. Then I play with my friends or watch TV." },
  { q: "What is your favorite food? Why?", hint: "你最喜歡的食物是什麼？為什麼？", sample: "My favorite food is fried chicken. It is crispy and delicious." },
  { q: "Tell me about your family.", hint: "跟我說說你的家人。", sample: "There are four people in my family. My father, my mother, my sister, and me." },
  { q: "What do you like to do on weekends?", hint: "你週末喜歡做什麼？", sample: "On weekends, I like to go to the park and ride my bicycle. Sometimes I go shopping with my mom." },
  { q: "Describe your best friend.", hint: "描述你最好的朋友。", sample: "My best friend is Amy. She is tall and has long hair. She is very kind and funny." },
  { q: "What is your favorite subject at school?", hint: "你最喜歡的科目是什麼？", sample: "My favorite subject is English. I think it is fun and useful." },
  { q: "What do you want to be when you grow up?", hint: "你長大想做什麼？", sample: "I want to be a doctor because I want to help people." },
  { q: "How do you get to school every day?", hint: "你每天怎麼上學？", sample: "I take the bus to school every day. It takes about 20 minutes." },
  { q: "What did you do last weekend?", hint: "你上週末做了什麼？", sample: "Last weekend, I went to the movies with my family. We watched a funny movie." },
  { q: "If you could travel anywhere, where would you go?", hint: "如果你可以去任何地方旅行，你想去哪？", sample: "I would go to Japan. I want to see the cherry blossoms and eat sushi." },
  { q: "What is the weather like today?", hint: "今天天氣怎麼樣？", sample: "Today is sunny and warm. It is a beautiful day." },
  { q: "Do you have any pets? Tell me about them.", hint: "你有寵物嗎？告訴我。", sample: "Yes, I have a dog. His name is Lucky. He is very cute and friendly." },
  { q: "What is your favorite season? Why?", hint: "你最喜歡的季節是什麼？為什麼？", sample: "My favorite season is summer because I can go swimming and eat ice cream." },
  { q: "Tell me about your school.", hint: "跟我說說你的學校。", sample: "My school is near my home. It has a big playground and a nice library." },
  { q: "What do you usually eat for breakfast?", hint: "你早餐通常吃什麼？", sample: "I usually eat toast and drink milk for breakfast. Sometimes I have eggs too." },
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
  const recognizerRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SR) setSupported(false);
    }
  }, []);

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

  const compareText = (target: string, spoken: string): { pct: number; matched: number[] } => {
    const targetWords = target.toLowerCase().replace(/[^\w\s]/g, "").split(/\s+/).filter(Boolean);
    const spokenWords = spoken.toLowerCase().replace(/[^\w\s]/g, "").split(/\s+/).filter(Boolean);
    const matched: number[] = [];
    targetWords.forEach((tw, i) => {
      if (spokenWords.some(sw => sw === tw || (tw.length > 3 && (sw.includes(tw) || tw.includes(sw))))) {
        matched.push(i);
      }
    });
    return { pct: Math.round((matched.length / Math.max(targetWords.length, 1)) * 100), matched };
  };

  const startRecording = (targetText: string) => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;

    // Stop any ongoing recognition
    if (recognizerRef.current) {
      try { recognizerRef.current.abort(); } catch {}
    }

    const recog = new SR();
    recognizerRef.current = recog;
    recog.lang = "en-US";
    recog.interimResults = false;
    recog.maxAlternatives = 3;
    recog.continuous = false;

    recog.onresult = (e: any) => {
      let bestPct = 0;
      let bestTranscript = "";
      let bestMatched: number[] = [];

      for (let i = 0; i < e.results[0].length; i++) {
        const transcript = e.results[0][i].transcript;
        const { pct, matched } = compareText(targetText, transcript);
        if (pct > bestPct) {
          bestPct = pct; bestTranscript = transcript; bestMatched = matched;
        }
      }

      setResult({ transcript: bestTranscript, pct: bestPct, matched: bestMatched });
      setRecording(false);
      setAttempts(a => a + 1);
      if (bestPct >= 90) playPerfect();
      else if (bestPct >= 50) playCorrect();
      else playWrong();

      // Track best score per question
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

  const pctColor = (pct: number) => pct >= 80 ? "#059669" : pct >= 50 ? "#f59e0b" : "#ef4444";
  const pctEmoji = (pct: number) => pct >= 90 ? "🌟" : pct >= 80 ? "⭐" : pct >= 60 ? "👍" : pct >= 40 ? "💪" : "🔄";
  const pctMsg = (pct: number) => pct >= 90 ? "太棒了！Perfect!" : pct >= 80 ? "很好！Great job!" : pct >= 60 ? "不錯！Keep going!" : pct >= 40 ? "加油！Try again!" : "再試一次！";

  // ─── MENU ───
  if (mode === "menu") return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">🎙️</div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-800 mb-2">口說訓練中心</h1>
        <p className="text-slate-500">練習發音、跟讀、朗讀和回答問題</p>
        {!supported && (
          <div className="mt-3 bg-red-50 text-red-600 rounded-xl p-3 text-sm">
            ⚠️ 您的瀏覽器不支援語音辨識，請使用 <strong>Chrome</strong> 瀏覽器
          </div>
        )}
      </div>

      <div className="grid gap-4">
        {[
          { m: "words" as Mode, icon: "🔤", title: "單字發音", desc: "唸出單字，AI 即時辨識你的發音", tag: "基礎", color: "#2563eb", count: "10 個單字" },
          { m: "sentences" as Mode, icon: "🗣️", title: "句子跟讀", desc: "先聽再唸，可調速度、無限重試", tag: "初級", color: "#7c3aed", count: "8 個句子" },
          { m: "passage" as Mode, icon: "📖", title: "短文朗讀", desc: "挑戰朗讀整段文章，逐句練習", tag: "進階", color: "#059669", count: "1 篇短文" },
          { m: "qa" as Mode, icon: "💬", title: "問答練習", desc: "聽問題、用英文回答（仿 GEPT 口試）", tag: "GEPT", color: "#dc2626", count: "5 題" },
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
        <a href="/upper-intermediate" className="text-sm text-blue-500 hover:underline">← 回初級首頁</a>
      </div>
    </div>
  );

  // ─── COMPLETED SCREEN ───
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
            <button onClick={() => startMode(mode)} className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm cursor-pointer border-none">🔄 再練一次</button>
            <button onClick={() => setMode("menu")} className="px-6 py-2.5 rounded-xl border-2 border-slate-300 text-slate-600 font-semibold text-sm cursor-pointer bg-white">← 選其他模式</button>
          </div>
        </div>
      </div>
    );
  }

  const item = items[idx];
  if (!item) return null;

  // ─── Shared Recording Button ───
  const RecordButton = ({ target, size = "lg" }: { target: string; size?: "lg" | "sm" }) => (
    <div className="text-center">
      <button onClick={() => recording ? null : startRecording(target)} disabled={recording}
        className={`rounded-full cursor-pointer transition border-3 ${recording ? "animate-pulse" : "hover:scale-105"} ${size === "lg" ? "w-20 h-20 text-3xl" : "w-14 h-14 text-xl"}`}
        style={{ borderColor: recording ? "#ef4444" : "#dc2626", background: recording ? "#fee2e2" : "#fef2f2" }}>
        {recording ? "🎤" : "🎙️"}
      </button>
      <div className="text-sm text-slate-400 mt-2">
        {recording ? "正在聽...大聲唸！" : result ? "再按一次可重試" : "按下開始錄音"}
      </div>
    </div>
  );

  // ─── Result Display ───
  const ResultDisplay = ({ targetText }: { targetText: string }) => {
    if (!result) return null;
    const words = targetText.split(/\s+/);
    return (
      <div className="animate-fadeIn mt-4">
        <div className="text-center mb-3">
          <span className="inline-block px-5 py-2 rounded-full text-2xl font-black" style={{ color: pctColor(result.pct), background: pctColor(result.pct) + "12" }}>
            {pctEmoji(result.pct)} {result.pct}%
          </span>
          <div className="text-sm text-slate-500 mt-1">{pctMsg(result.pct)}</div>
        </div>

        {/* Word-by-word highlight */}
        <div className="bg-slate-50 rounded-xl p-4 mb-3">
          <div className="text-sm text-slate-400 mb-2">逐字比對：</div>
          <div className="text-base leading-8">
            {words.map((w, i) => (
              <span key={i} className="transition mr-1" style={{
                color: result.matched.includes(i) ? "#059669" : "#ef4444",
                fontWeight: result.matched.includes(i) ? 700 : 400,
                textDecoration: result.matched.includes(i) ? "none" : "underline wavy",
              }}>{w}</span>
            ))}
          </div>
        </div>

        {result.transcript && (
          <div className="text-xs text-slate-400 text-center">
            AI 聽到：&quot;{result.transcript}&quot;
          </div>
        )}

        <div className="flex gap-3 justify-center mt-4">
          <button onClick={() => { setResult(null); setRecording(false); }}
            className="px-5 py-2.5 rounded-xl border-2 border-blue-300 text-blue-600 font-semibold text-sm cursor-pointer bg-white hover:bg-blue-50 transition">
            🔄 再唸一次
          </button>
          <button onClick={next}
            className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm cursor-pointer border-none hover:bg-blue-700 transition">
            {idx + 1 >= items.length ? "看結果 →" : "下一題 →"}
          </button>
        </div>
      </div>
    );
  };

  // ─── HEADER ───
  const modeLabel = mode === "words" ? "🔤 單字發音" : mode === "sentences" ? "🗣️ 句子跟讀" : mode === "passage" ? "📖 短文朗讀" : "💬 問答練習";

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 bg-white p-3 rounded-xl border border-slate-200 sticky top-16 z-10 shadow-sm">
        <div className="flex items-center gap-2">
          <button onClick={() => { setMode("menu"); setCompleted(0); }} className="text-sm text-blue-500 bg-transparent border-none cursor-pointer p-1">← 返回</button>
          <span className="text-sm font-bold text-slate-700">{modeLabel}</span>
        </div>
        <div className="flex items-center gap-2">
          {mode !== "passage" && (
            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-medium">
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
          <div className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-blue-500 to-purple-500"
            style={{ width: `${((idx) / items.length) * 100}%` }} />
        </div>
      )}

      {/* ─── WORD PRONUNCIATION ─── */}
      {mode === "words" && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="text-center mb-6">
            <div className="text-4xl md:text-5xl font-black text-blue-600 mb-2">{item.en}</div>
            <div className="text-sm text-slate-400">{item.pos}</div>
            <div className="text-lg font-semibold text-slate-600 mt-1">{item.zh}</div>
            <button onClick={() => { setIsPlaying(true); speak(item.en, 0.8, () => setIsPlaying(false)); }}
              className="mt-3 px-4 py-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 text-sm cursor-pointer hover:bg-blue-100 transition">
              {isPlaying ? "🔊 播放中..." : "🔊 先聽發音"}
            </button>
          </div>
          <RecordButton target={item.en} />
          <ResultDisplay targetText={item.en} />
          {!result && (
            <div className="text-center mt-4">
              <div className="text-xs text-slate-300">例句：{item.ex}</div>
            </div>
          )}
        </div>
      )}

      {/* ─── SENTENCE REPEAT ─── */}
      {mode === "sentences" && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="text-center mb-4">
            <div className="text-sm text-slate-400 mb-3">先聽英文句子，再跟著唸</div>
            <div className="flex justify-center gap-3 mb-4">
              <button onClick={() => { setIsPlaying(true); speak(item.text, 0.6, () => setIsPlaying(false)); }}
                className="px-4 py-2.5 rounded-lg border border-purple-200 bg-purple-50 text-purple-600 text-sm cursor-pointer hover:bg-purple-100 transition">
                🐢 慢速
              </button>
              <button onClick={() => { setIsPlaying(true); speak(item.text, 0.8, () => setIsPlaying(false)); }}
                className="px-5 py-2.5 rounded-lg border border-purple-300 bg-purple-100 text-purple-700 text-sm font-bold cursor-pointer hover:bg-purple-200 transition">
                {isPlaying ? "🔊 播放中" : "🔊 正常速"}
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
        </div>
      )}

      {/* ─── PASSAGE READ-ALOUD ─── */}
      {mode === "passage" && (() => {
        const sentences = item.passage.split(/(?<=[.!?])\s+/).filter((s: string) => s.trim().length > 5);
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
              <div className="text-sm leading-7 text-slate-600">
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
                  <div className="text-lg font-semibold text-slate-800 leading-7">{currentSentence}</div>
                </div>
                <div className="flex justify-center gap-3 mb-4">
                  <button onClick={() => speak(currentSentence, 0.6)}
                    className="px-3 py-2 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-600 text-sm cursor-pointer">🐢 慢</button>
                  <button onClick={() => speak(currentSentence, 0.8)}
                    className="px-4 py-2 rounded-lg border border-emerald-300 bg-emerald-100 text-emerald-700 text-sm font-bold cursor-pointer">🔊 聽</button>
                  <button onClick={() => speak(currentSentence, 1.0)}
                    className="px-3 py-2 rounded-lg border border-emerald-200 bg-emerald-50 text-emerald-600 text-sm cursor-pointer">🐇 快</button>
                </div>
                <RecordButton target={currentSentence} />
                <ResultDisplay targetText={currentSentence} />
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
              <div className="text-xs text-red-400 font-medium mb-2 uppercase">Question {idx + 1}</div>
              <div className="text-lg font-bold text-slate-800">{item.q}</div>
              <div className="text-sm text-slate-400 mt-1">{item.hint}</div>
            </div>
            <button onClick={() => { setIsPlaying(true); speak(item.q, 0.8, () => setIsPlaying(false)); }}
              className="px-4 py-2 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm cursor-pointer hover:bg-red-100 transition mb-2">
              {isPlaying ? "🔊 播放中..." : "🔊 聽問題"}
            </button>
          </div>

          <div className="text-center mb-2">
            <div className="text-sm text-slate-400 mb-3">用英文回答，不用很完美，勇敢說就對了！💪</div>
          </div>

          <RecordButton target={item.sample} />

          {result && (
            <div className="animate-fadeIn mt-4">
              <div className="text-center mb-3">
                <span className="inline-block px-5 py-2 rounded-full text-2xl font-black" style={{ color: pctColor(result.pct), background: pctColor(result.pct) + "12" }}>
                  {pctEmoji(result.pct)} {result.pct}%
                </span>
                <div className="text-sm text-slate-500 mt-1">{result.pct >= 60 ? "很棒！你的回答很好！" : "繼續加油！多說幾次就會更好！"}</div>
              </div>

              {result.transcript && (
                <div className="bg-blue-50 rounded-xl p-4 mb-3">
                  <div className="text-xs text-blue-400 mb-1">AI 聽到你說：</div>
                  <div className="text-sm text-slate-700">&quot;{result.transcript}&quot;</div>
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
                  className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-semibold text-sm cursor-pointer border-none">
                  {idx + 1 >= items.length ? "看結果 →" : "下一題 →"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
