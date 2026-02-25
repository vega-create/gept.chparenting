"use client";
import { useState, useCallback, useEffect, useRef } from "react";
import { playCorrect, playWrong, playPerfect, playVictory } from "@/lib/sounds";
import { useHighScore, getStars, GameOverScreen } from "@/lib/game-utils";

/* ─── Built-in word list (200+ common English words) ─── */
const WORD_LIST = new Set([
  "apple","area","art","back","bag","ball","band","bank","base","bat","bear","bed","bell","best",
  "bird","bit","black","block","blue","board","boat","body","bone","book","box","boy","brain",
  "bread","bridge","brown","bus","butter","cake","call","camp","can","cap","car","card","care",
  "case","cat","cell","chair","chance","change","check","child","city","class","clean","clear",
  "clock","close","cloud","club","coat","cold","color","come","control","cook","cool","corner",
  "count","country","cover","cross","crowd","cup","cut","dance","dark","day","dead","deal",
  "deep","desk","dinner","doctor","dog","door","double","down","draw","dream","dress","drink",
  "drive","drop","dry","dust","ear","earth","east","eat","edge","egg","end","engine","enough",
  "enter","even","evening","event","ever","every","eye","face","fact","fall","family","fan",
  "farm","fast","fat","father","fear","feel","field","fight","fill","film","find","fine",
  "finger","fire","fish","flag","flat","floor","flower","fly","food","foot","force","forest",
  "form","forward","four","free","fresh","friend","front","fruit","full","fun","game","garden",
  "gate","girl","give","glass","go","gold","good","grass","green","ground","group","grow",
  "guard","gun","hair","half","hall","hand","hang","happy","hard","hat","have","head","heart",
  "heat","heavy","help","hide","high","hill","hit","hold","hole","home","hope","horse","hot",
  "hotel","house","human","hundred","hunt","hurry","ice","idea","image","inside","iron","island",
  "join","jump","just","keep","key","kid","kill","kind","king","kitchen","knee","knife","knock",
  "lake","land","large","last","late","laugh","law","lead","leaf","learn","leave","left","leg",
  "let","letter","level","library","life","lift","light","like","line","lion","list","listen",
  "little","live","long","look","lose","lot","love","low","luck","lunch","machine","main",
  "make","man","many","map","mark","market","master","match","matter","mean","meet","member",
  "memory","message","metal","middle","might","mile","milk","mind","minute","miss","model",
  "modern","moment","money","month","moon","morning","mother","mountain","mouth","move","much",
  "music","name","nation","nature","near","neck","need","ネ","net","never","new","news","next",
  "nice","night","noise","none","north","nose","note","nothing","notice","now","number","nurse",
  "ocean","offer","office","oil","old","one","only","open","orange","order","other","outside",
  "own","page","paint","pair","paper","parent","park","part","party","pass","past","path",
  "pay","peace","people","person","pick","picture","piece","place","plan","plant","play",
  "please","point","pool","poor","popular","position","possible","post","power","present",
  "press","pretty","price","print","private","problem","produce","program","protect","public",
  "pull","push","put","quarter","queen","question","quick","quiet","quite","race","rain",
  "raise","range","reach","read","ready","real","reason","record","red","remember","report",
  "rest","result","return","rich","ride","right","ring","rise","river","road","rock","role",
  "roll","roof","room","root","rope","round","rule","run","safe","salt","same","sand","save",
  "say","school","sea","seat","second","see","sell","send","serve","set","seven","shake",
  "shape","share","she","ship","shirt","shoe","shoot","shop","short","shot","should","show",
  "shut","side","sign","silver","simple","since","sing","sister","sit","size","skill","skin",
  "sky","sleep","slip","slow","small","smell","smile","smoke","snow","soft","soil","some",
  "son","song","soon","sort","sound","south","space","speak","speed","spend","sport","spot",
  "spring","square","stage","stand","star","start","state","station","stay","step","stick",
  "still","stone","stop","store","storm","story","strange","street","strong","student","study",
  "style","sugar","summer","sun","support","sure","sweet","swim","table","tail","take","talk",
  "tall","taste","teach","team","tell","ten","test","than","thank","thick","thin","thing",
  "think","through","throw","tie","time","tiny","today","together","top","total","touch",
  "town","trade","train","travel","tree","trip","trouble","true","trust","try","turn","type",
  "uncle","under","unit","until","use","usual","valley","value","very","view","visit","voice",
  "wait","walk","wall","want","war","warm","wash","watch","water","wave","way","wear","weather",
  "week","weight","well","west","wet","what","wheel","white","whole","wide","wife","wild","will",
  "win","wind","window","winter","wish","with","woman","wonder","wood","word","work","world",
  "worry","write","wrong","yard","year","yellow","young","youth","zero","zone"
]);

const WORD_ARRAY = Array.from(WORD_LIST).filter(w => /^[a-z]+$/.test(w));

const TURN_TIME = 15;

function getWordsStartingWith(letter: string): string[] {
  return WORD_ARRAY.filter(w => w.startsWith(letter.toLowerCase()));
}

function getRandomStarter(): string {
  const starters = WORD_ARRAY.filter(w => w.length >= 3 && w.length <= 6);
  return starters[Math.floor(Math.random() * starters.length)];
}

export default function WordChainPage() {
  const [mode, setMode] = useState<"menu" | "playing" | "done">("menu");
  const [chain, setChain] = useState<string[]>([]);
  const [usedWords, setUsedWords] = useState<Set<string>>(new Set());
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [turnTime, setTurnTime] = useState(TURN_TIME);
  const [feedback, setFeedback] = useState<{ type: "correct" | "wrong"; msg: string } | null>(null);
  const [lives, setLives] = useState(3);
  const [isNewHigh, setIsNewHigh] = useState(false);
  const { highScore, updateHighScore } = useHighScore("word-chain");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chainEndRef = useRef<HTMLDivElement>(null);

  const lastLetter = chain.length > 0 ? chain[chain.length - 1].slice(-1) : "";

  const endGame = useCallback((finalScore: number) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setScore(finalScore);
    const newHigh = updateHighScore(finalScore);
    setIsNewHigh(newHigh);
    if (finalScore >= 200) playPerfect();
    else if (finalScore >= 100) playVictory();
    setMode("done");
  }, [updateHighScore]);

  const resetTurnTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTurnTime(TURN_TIME);
    let t = TURN_TIME;
    timerRef.current = setInterval(() => {
      t--;
      setTurnTime(t);
    }, 1000);
  }, []);

  const startGame = useCallback(() => {
    const starter = getRandomStarter();
    setChain([starter]);
    setUsedWords(new Set([starter]));
    setInput("");
    setScore(0);
    setLives(3);
    setFeedback(null);
    setIsNewHigh(false);
    setMode("playing");
    resetTurnTimer();
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [resetTurnTimer]);

  // Watch for turn timer expiry
  useEffect(() => {
    if (turnTime <= 0 && mode === "playing") {
      playWrong();
      const newLives = lives - 1;
      setLives(newLives);
      setFeedback({ type: "wrong", msg: "時間到！" });
      setTimeout(() => setFeedback(null), 1500);

      if (newLives <= 0) {
        endGame(score);
      } else {
        // Give a hint word and continue
        const available = getWordsStartingWith(lastLetter).filter(w => !usedWords.has(w));
        if (available.length === 0) {
          endGame(score);
        } else {
          const hint = available[Math.floor(Math.random() * available.length)];
          setChain(prev => [...prev, `(${hint})`]);
          setUsedWords(prev => { const s = new Set(Array.from(prev)); s.add(hint); return s; });
          resetTurnTimer();
          setInput("");
        }
      }
    }
  }, [turnTime, mode, lives, score, lastLetter, usedWords, endGame, resetTurnTimer]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    chainEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chain]);

  const handleSubmit = useCallback(() => {
    if (mode !== "playing") return;
    const word = input.trim().toLowerCase();
    setInput("");

    if (word.length < 2) {
      setFeedback({ type: "wrong", msg: "至少 2 個字母" });
      setTimeout(() => setFeedback(null), 1500);
      return;
    }

    if (chain.length > 0 && word[0] !== lastLetter) {
      playWrong();
      setFeedback({ type: "wrong", msg: `必須以「${lastLetter.toUpperCase()}」開頭` });
      setTimeout(() => setFeedback(null), 1500);
      return;
    }

    if (usedWords.has(word)) {
      playWrong();
      setFeedback({ type: "wrong", msg: "這個字已經用過了" });
      setTimeout(() => setFeedback(null), 1500);
      return;
    }

    if (!WORD_LIST.has(word)) {
      playWrong();
      const newLives = lives - 1;
      setLives(newLives);
      setFeedback({ type: "wrong", msg: "不在字典中，-1 生命" });
      setTimeout(() => setFeedback(null), 1500);
      if (newLives <= 0) {
        endGame(score);
        return;
      }
      inputRef.current?.focus();
      return;
    }

    // Valid word!
    playCorrect();
    const wordScore = word.length * 2 + (turnTime > 10 ? 5 : turnTime > 5 ? 3 : 1);
    const newScore = score + wordScore;
    setScore(newScore);
    setChain(prev => [...prev, word]);
    setUsedWords(prev => { const s = new Set(Array.from(prev)); s.add(word); return s; });
    setFeedback({ type: "correct", msg: `+${wordScore} 分` });
    setTimeout(() => setFeedback(null), 1000);
    resetTurnTimer();
    inputRef.current?.focus();

    // Check if any words start with last letter of this word
    const nextLetter = word.slice(-1);
    const available = getWordsStartingWith(nextLetter).filter(w => !usedWords.has(w) && w !== word);
    if (available.length === 0) {
      // No more words possible - player wins!
      setTimeout(() => endGame(newScore + 50), 500);
    }
  }, [mode, input, chain, lastLetter, usedWords, lives, score, turnTime, endGame, resetTurnTimer]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  }, [handleSubmit]);

  /* ─── Menu ─── */
  if (mode === "menu") {
    return (
      <div className="max-w-lg mx-auto px-4 py-8 animate-fadeIn">
        <a href="/board-games" className="text-sm text-emerald-500 hover:underline no-underline">← 返回桌遊專區</a>
        <div className="text-center mt-6 mb-8">
          <div className="text-5xl mb-3">🔗</div>
          <h1 className="text-2xl font-black text-slate-800 mb-2">接龍大師</h1>
          <p className="text-slate-500 text-sm">英文單字接龍，訓練你的詞彙量</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-emerald-200 shadow-sm mb-6">
          <h3 className="font-bold text-slate-700 mb-1">遊戲規則</h3>
          <ul className="text-sm text-slate-500 space-y-1 list-disc list-inside">
            <li>系統給出一個起始單字</li>
            <li>你要輸入一個以<span className="font-bold text-emerald-600">前一個字的最後字母</span>開頭的單字</li>
            <li>每個單字只能用一次</li>
            <li>每回合限時 {TURN_TIME} 秒</li>
            <li>共 3 條命，單字不在字典或超時會扣命</li>
            <li>字越長、速度越快，得分越高</li>
            <li>最高紀錄：{highScore} 分</li>
          </ul>
        </div>
        <button onClick={startGame}
          className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-lg cursor-pointer border-none hover:opacity-90 transition">
          開始接龍
        </button>
      </div>
    );
  }

  /* ─── Done ─── */
  if (mode === "done") {
    const stars = getStars(score, 200);
    return (
      <div className="max-w-lg mx-auto px-4 py-8 animate-fadeIn">
        <a href="/board-games" className="text-sm text-emerald-500 hover:underline no-underline">← 返回桌遊專區</a>
        <div className="text-center text-sm text-slate-500 mt-4 mb-2">
          接龍 {chain.length} 個字 ・ 得分 {score}
        </div>
        <GameOverScreen
          score={score} maxScore={200} gameName="接龍大師" stars={stars}
          highScore={Math.max(highScore, score)} isNewHigh={isNewHigh}
          onRestart={startGame} onBack={() => setMode("menu")}
        />
        <div className="mt-4 bg-white rounded-2xl p-4 border border-emerald-200 shadow-sm">
          <h4 className="font-bold text-sm text-slate-600 mb-2">完成的接龍：</h4>
          <div className="flex flex-wrap gap-1">
            {chain.map((w, i) => (
              <span key={i} className={`text-xs px-2 py-1 rounded-full ${w.startsWith("(") ? "bg-slate-100 text-slate-400" : "bg-emerald-100 text-emerald-700"}`}>
                {w}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  /* ─── Playing ─── */
  return (
    <div className="max-w-lg mx-auto px-4 py-8 animate-fadeIn">
      <a href="/board-games" className="text-sm text-emerald-500 hover:underline no-underline">← 返回桌遊專區</a>

      {/* Header */}
      <div className="flex justify-between items-center mt-4 mb-4">
        <div className="text-sm text-slate-500">
          {"❤️".repeat(lives)}{"🖤".repeat(3 - lives)}
        </div>
        <div className={`text-sm font-mono ${turnTime <= 5 ? "text-red-500 font-bold" : "text-slate-500"}`}>
          ⏱ {turnTime}s
        </div>
        <div className="text-sm font-bold text-emerald-600">🏆 {score}</div>
      </div>

      {/* Timer bar */}
      <div className="w-full h-2 bg-slate-200 rounded-full mb-4 overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-1000 ${turnTime <= 5 ? "bg-red-500" : "bg-gradient-to-r from-emerald-400 to-teal-500"}`}
          style={{ width: `${(turnTime / TURN_TIME) * 100}%` }} />
      </div>

      {/* Chain display */}
      <div className="bg-white rounded-2xl p-4 border border-emerald-200 shadow-sm mb-4 max-h-40 overflow-y-auto">
        <div className="flex flex-wrap gap-1">
          {chain.map((w, i) => (
            <span key={i} className={`text-sm px-2 py-1 rounded-full font-medium
              ${w.startsWith("(") ? "bg-slate-100 text-slate-400 italic" : i === chain.length - 1 ? "bg-emerald-500 text-white" : "bg-emerald-100 text-emerald-700"}`}>
              {w}
            </span>
          ))}
          <div ref={chainEndRef} />
        </div>
      </div>

      {/* Current requirement */}
      <div className="text-center mb-4">
        <span className="text-sm text-slate-500">請輸入以</span>
        <span className="text-2xl font-black text-emerald-600 mx-2">{lastLetter.toUpperCase()}</span>
        <span className="text-sm text-slate-500">開頭的單字</span>
      </div>

      {/* Feedback */}
      {feedback && (
        <div className={`text-center text-sm font-bold mb-2 animate-fadeIn ${feedback.type === "correct" ? "text-green-500" : "text-red-500"}`}>
          {feedback.msg}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-3">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value.replace(/[^a-zA-Z]/g, ""))}
          onKeyDown={handleKeyDown}
          placeholder={`輸入以 ${lastLetter} 開頭的單字...`}
          className="flex-1 px-4 py-4 text-xl font-bold text-center rounded-xl border-2 border-emerald-200 focus:border-emerald-500 focus:outline-none transition lowercase"
          autoFocus
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
        />
        <button onClick={handleSubmit}
          className="px-6 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-lg cursor-pointer border-none hover:opacity-90 transition active:scale-95">
          送出
        </button>
      </div>
    </div>
  );
}
