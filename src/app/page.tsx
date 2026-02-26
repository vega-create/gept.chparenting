import type { Metadata } from "next";
import NewsletterCTA from "@/components/NewsletterCTA";

export const metadata: Metadata = {
  title: "親子多元學習平台 — 免費英檢・日文・數學學習資源",
  description: "免費親子多元學習平台，提供全民英檢電子書教學、互動測驗、模擬考試，日文、數學、教育桌遊等學習工具即將推出。減輕家長負擔，讓孩子快樂學習。",
};

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://learn.chparenting.com";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "親子多元學習平台",
  description: "免費親子多元學習平台，提供全民英檢、日文、數學等互動學習資源",
  url: SITE_URL,
  publisher: {
    "@type": "Organization",
    name: "智慧媽咪國際有限公司 Mommy Wisdom International LTD.",
    url: "https://aimommywisdom.com",
  },
};

const TOOLS = [
  {
    id: "gept", title: "全民英檢", sub: "GEPT", icon: "📘",
    desc: "初級・中級・中高級完整學習",
    color: "from-pink-400 to-pink-500", border: "border-pink-200",
    active: true, href: "/elementary",
    features: ["94 單元電子書", "聽說讀寫 + 文法", "7 種遊戲練習", "模擬測驗 + 口說 + 寫作"],
  },
  {
    id: "japanese", title: "日文檢定", sub: "JLPT N5–N1", icon: "🇯🇵",
    desc: "五十音到 N1 完整日文學習",
    color: "from-red-400 to-red-500", border: "border-red-200",
    active: true, href: "/jlpt-n5",
    features: ["五十音教學", "N5～N1 全級別上線", "聽說讀寫完整練習", "JLPT 模擬測驗"],
  },
  {
    id: "boardgames", title: "教育桌遊", sub: "Board Games", icon: "🎲",
    desc: "邏輯・程式・記憶・反應・數學・語言",
    color: "from-orange-400 to-orange-500", border: "border-orange-200",
    active: true, href: "/board-games",
    features: ["18 款教育遊戲", "邏輯推理 + 程式概念", "數學衝刺 + 單字搜尋", "記憶力 + 圍棋 + 跳棋"],
  },
  {
    id: "math", title: "數學練習", sub: "Math", icon: "🔢",
    desc: "觀念教學 + 互動練習 + 限時挑戰",
    color: "from-amber-400 to-amber-500", border: "border-amber-200",
    active: true, href: "/math",
    features: ["8 大主題 + 120 題練習", "觀念教學 + 範例解說", "限時計算挑戰", "國小到國中完整涵蓋"],
  },
  {
    id: "typing", title: "打字練習", sub: "Typing Game", icon: "⌨️",
    desc: "中英雙語打字訓練",
    color: "from-emerald-400 to-emerald-500", border: "border-emerald-200",
    active: true, href: "/typing-game",
    features: ["英文打字練習", "注音輸入練習", "落下文字遊戲", "打字速度測試"],
  },
  {
    id: "finance", title: "兒童理財", sub: "Financial Literacy", icon: "💰",
    desc: "儲蓄・預算・記帳・紅包理財",
    color: "from-purple-400 to-purple-500", border: "border-purple-200",
    active: true, href: "/finance",
    features: ["6 個互動學習模組", "需要 vs 想要分類", "儲蓄計算 + 預算分配", "紅包理財 + 記帳小達人"],
  },
];

export default function HomePage() {
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-pink-50 via-rose-50 to-amber-50">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #f472b6 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 relative">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-float">📚</div>
            <h1 className="text-3xl md:text-5xl font-black mb-4 leading-tight text-slate-800">
              親子多元<span className="text-pink-400">學習</span>平台
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-3">
              減輕家長負擔，讓孩子快樂學習
            </p>
            <p className="text-base text-slate-500 max-w-xl mx-auto mb-8">
              英檢・日文・數學・桌遊 — 免費互動式學習工具
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href="/elementary" className="px-8 py-3 bg-pink-400 text-white rounded-xl font-bold text-lg hover:bg-pink-500 transition shadow-lg hover:shadow-xl no-underline">
                📘 開始學英檢
              </a>
              <a href="/jlpt-n5" className="px-8 py-3 bg-white text-red-500 border border-red-200 rounded-xl font-bold text-lg hover:bg-red-50 transition shadow-md hover:shadow-lg no-underline">
                🇯🇵 學日文
              </a>
              <a href="/board-games" className="px-8 py-3 bg-white text-orange-500 border border-orange-200 rounded-xl font-bold text-lg hover:bg-orange-50 transition shadow-md hover:shadow-lg no-underline">
                🎲 玩桌遊
              </a>
              <a href="#tools" className="px-8 py-3 bg-white text-slate-600 border border-slate-200 rounded-xl font-semibold text-lg hover:bg-slate-50 transition shadow-md no-underline">
                探索所有工具 ↓
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section id="tools" className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">學習工具</h2>
        <p className="text-center text-slate-500 mb-10">多元科目，豐富學習體驗</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TOOLS.map((tool) => (
            <div key={tool.id} className={`bg-white rounded-2xl overflow-hidden border ${tool.border} shadow-sm ${tool.active ? "hover-lift" : "opacity-60"}`}>
              <div className={`bg-gradient-to-r ${tool.color} p-5 text-white`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl mb-1">{tool.icon}</div>
                    <h3 className="text-xl font-bold">{tool.title}</h3>
                    <p className="text-sm opacity-80">{tool.sub}</p>
                  </div>
                  {!tool.active && (
                    <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold">即將推出</span>
                  )}
                </div>
              </div>
              <div className="p-5">
                <p className="text-slate-600 font-medium mb-3">{tool.desc}</p>
                <ul className="space-y-1.5 mb-5">
                  {tool.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                      <span className="text-emerald-500">✓</span> {f}
                    </li>
                  ))}
                </ul>
                {tool.active ? (
                  <a href={tool.href} className={`block text-center py-3 rounded-xl bg-gradient-to-r ${tool.color} text-white font-bold hover:opacity-90 transition no-underline`}>
                    開始學習 →
                  </a>
                ) : (
                  <div className="text-center py-3 rounded-xl bg-slate-100 text-slate-400 font-semibold">
                    敬請期待 🔜
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Learning Tips */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 text-center border border-amber-200">
          <div className="text-3xl mb-3">💡</div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">學習建議</h3>
          <p className="text-slate-600 max-w-lg mx-auto">
            每天 15 分鐘，按照 <strong className="text-pink-500">單字 → 文法 → 聽力 → 閱讀 → 測驗</strong> 的順序學習效果最好！
            學完整個單元後到遊戲區綜合練習，讓學習更有趣。
          </p>
        </div>
      </section>

      {/* Newsletter CTA */}
      <NewsletterCTA />
    </div>
  );
}
