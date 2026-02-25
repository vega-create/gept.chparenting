import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "教育桌遊專區 | 邏輯・程式・記憶・反應力訓練",
  description: "10 款免費線上教育桌遊，訓練邏輯推理、程式設計概念、記憶力與反應力，適合 6-15 歲兒童。",
  alternates: { canonical: "https://learn.chparenting.com/board-games" },
};

const CATEGORIES = [
  {
    title: "🧩 邏輯開發", color: "from-purple-500 to-indigo-600", border: "border-purple-200",
    games: [
      { id: "pattern-master", icon: "🧩", name: "圖案大師", desc: "找出缺失的圖案規律", difficulty: "初級～高級" },
      { id: "mini-sudoku", icon: "🔢", name: "迷你數獨", desc: "4x4 / 6x6 數獨挑戰", difficulty: "初級～中級" },
      { id: "sequence-quest", icon: "🔍", name: "數列探險", desc: "找出數列規律", difficulty: "初級～高級" },
    ],
  },
  {
    title: "💻 程式碼概念", color: "from-cyan-500 to-blue-600", border: "border-cyan-200",
    games: [
      { id: "code-path", icon: "🤖", name: "程式路徑", desc: "用指令引導角色過關", difficulty: "初級～中級" },
      { id: "logic-gates", icon: "⚡", name: "邏輯閘門", desc: "AND/OR/NOT 邏輯挑戰", difficulty: "初級～中級" },
      { id: "loop-builder", icon: "🔄", name: "迴圈建造師", desc: "用迴圈畫出圖形", difficulty: "中級" },
    ],
  },
  {
    title: "🧠 記憶力", color: "from-pink-500 to-rose-600", border: "border-pink-200",
    games: [
      { id: "memory-match", icon: "🃏", name: "記憶翻牌", desc: "翻牌配對記憶遊戲", difficulty: "初級～高級" },
      { id: "memory-sequence", icon: "🎵", name: "記憶旋律", desc: "記住燈光順序", difficulty: "初級～高級" },
    ],
  },
  {
    title: "⚡ 反應力", color: "from-amber-500 to-orange-600", border: "border-amber-200",
    games: [
      { id: "color-tap", icon: "🎨", name: "色彩快手", desc: "Stroop 效應顏色挑戰", difficulty: "中級" },
      { id: "whack-a-mole", icon: "🐹", name: "打地鼠", desc: "快速反應點擊挑戰", difficulty: "初級" },
    ],
  },
];

export default function BoardGamesPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <div className="text-5xl mb-3 animate-float">🎲</div>
        <h1 className="text-3xl font-black text-slate-800 mb-2">教育桌遊專區</h1>
        <p className="text-slate-500">邏輯 · 程式 · 記憶 · 反應 — 邊玩邊學</p>
      </div>

      <div className="space-y-8">
        {CATEGORIES.map((cat) => (
          <div key={cat.title}>
            <h2 className="text-xl font-bold text-slate-800 mb-4">{cat.title}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cat.games.map((game) => (
                <Link key={game.id} href={`/board-games/${game.id}`}
                  className={`bg-white rounded-2xl overflow-hidden border ${cat.border} shadow-sm hover-lift no-underline`}>
                  <div className={`bg-gradient-to-r ${cat.color} p-4 text-white`}>
                    <div className="text-3xl mb-1">{game.icon}</div>
                    <div className="text-lg font-bold">{game.name}</div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-slate-600 mb-2">{game.desc}</p>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 text-slate-500">{game.difficulty}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-10">
        <a href="/" className="text-sm text-orange-500 hover:underline no-underline">← 回到首頁</a>
      </div>
    </div>
  );
}
