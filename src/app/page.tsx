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
    color: "from-blue-500 to-blue-600", border: "border-blue-200",
    active: true, href: "/elementary",
    features: ["94 單元電子書", "聽說讀寫 + 文法", "7 種遊戲練習", "模擬測驗 + 口說 + 寫作"],
  },
  {
    id: "japanese", title: "日文檢定", sub: "JLPT N5–N1", icon: "🇯🇵",
    desc: "五十音到 N1 完整日文學習",
    color: "from-red-400 to-red-500", border: "border-red-200",
    active: false, href: "#",
    features: ["五十音教學", "N5～N1 單字文法", "聽力閱讀練習", "JLPT 模擬測驗"],
  },
  {
    id: "math", title: "數學練習", sub: "Math", icon: "🔢",
    desc: "國小到國中數學闖關",
    color: "from-amber-400 to-amber-500", border: "border-amber-200",
    active: false, href: "#",
    features: ["四則運算", "應用題練習", "闖關模式"],
  },
  {
    id: "boardgame", title: "教育桌遊", sub: "Board Games", icon: "🎲",
    desc: "邊玩邊學的線上桌遊",
    color: "from-emerald-400 to-emerald-500", border: "border-emerald-200",
    active: false, href: "#",
    features: ["單字配對", "數學對戰", "理財大富翁"],
  },
  {
    id: "finance", title: "兒童理財", sub: "Financial Literacy", icon: "💰",
    desc: "從小培養金錢觀念",
    color: "from-purple-400 to-purple-500", border: "border-purple-200",
    active: false, href: "#",
    features: ["預算分配", "存錢挑戰", "慾望 vs 需要"],
  },
];

export default function HomePage() {
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="max-w-6xl mx-auto px-4 py-16 md:py-24 relative">
          <div className="text-center">
            <div className="text-6xl mb-4 animate-float">📚</div>
            <h1 className="text-3xl md:text-5xl font-black mb-4 leading-tight">
              親子多元<span className="text-yellow-300">學習</span>平台
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-3">
              減輕家長負擔，讓孩子快樂學習
            </p>
            <p className="text-base text-blue-200 max-w-xl mx-auto mb-8">
              英檢・日文・數學・桌遊 — 免費互動式學習工具
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href="/elementary" className="px-8 py-3 bg-white text-blue-700 rounded-xl font-bold text-lg hover:bg-blue-50 transition shadow-lg hover:shadow-xl no-underline">
                📘 開始學英檢
              </a>
              <a href="#tools" className="px-8 py-3 bg-white/10 border border-white/30 rounded-xl font-semibold text-lg hover:bg-white/20 transition no-underline">
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
            每天 15 分鐘，按照 <strong className="text-blue-600">單字 → 文法 → 聽力 → 閱讀 → 測驗</strong> 的順序學習效果最好！
            學完整個單元後到遊戲區綜合練習，讓學習更有趣。
          </p>
        </div>
      </section>

      {/* Newsletter CTA */}
      <NewsletterCTA />
    </div>
  );
}
