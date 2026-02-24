import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GEPT 全民英檢免費學習平台 — 電子書 + 互動測驗 + 模擬考",
  description: "完全免費的全民英檢線上學習平台。初級、中級、中高級電子書教學，搭配互動遊戲測驗與模擬考試，聽說讀寫文法一次搞定。",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "GEPT Learn 全民英檢免費學習平台",
  description: "免費全民英檢線上學習平台，提供電子書教學、互動遊戲測驗與模擬考試",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://gept.chparenting.com",
  publisher: {
    "@type": "Organization",
    name: "智慧媽咪國際有限公司 Mommy Wisdom International LTD.",
    url: "https://chparenting.com",
  },
  potentialAction: {
    "@type": "SearchAction",
    target: "{search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

const LEVELS = [
  {
    id: "elementary", title: "初級", sub: "Elementary",
    desc: "國中畢業程度・2000 單字", icon: "🌱",
    color: "from-blue-500 to-blue-600", border: "border-blue-200", bg: "bg-blue-50",
    tag: "bg-blue-100 text-blue-700", ready: true,
    features: ["20 單元電子書", "聽說讀寫 + 文法", "口說訓練中心", "7 種遊戲 + 模擬測驗", "寫作練習"],
  },
  {
    id: "intermediate", title: "中級", sub: "Intermediate",
    desc: "高中畢業程度・5000 單字", icon: "⚡",
    color: "from-emerald-500 to-emerald-600", border: "border-emerald-200", bg: "bg-emerald-50",
    tag: "bg-emerald-100 text-emerald-700", ready: true,
    features: ["34 單元電子書", "聽說讀寫 + 文法", "口說訓練中心", "7 種遊戲 + 模擬測驗", "寫作練習"],
  },
  {
    id: "upper-intermediate", title: "中高級", sub: "Upper-Intermediate",
    desc: "大學程度・8000 單字", icon: "🔥",
    color: "from-purple-500 to-purple-600", border: "border-purple-200", bg: "bg-purple-50",
    tag: "bg-purple-100 text-purple-700", ready: true,
    features: ["40 單元電子書", "聽說讀寫 + 文法", "口說訓練中心", "7 種遊戲 + 模擬測驗", "寫作練習"],
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
            <div className="text-6xl mb-4 animate-float">📘</div>
            <h1 className="text-3xl md:text-5xl font-black mb-4 leading-tight">
              全民英檢<span className="text-yellow-300">免費</span>學習平台
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-8">
              電子書教學 → 互動測驗 → 遊戲練習 → 模擬考試<br/>
              <span className="text-yellow-200">聽・說・讀・寫・文法</span> 一次搞定
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href="/elementary" className="px-8 py-3 bg-white text-blue-700 rounded-xl font-bold text-lg hover:bg-blue-50 transition shadow-lg hover:shadow-xl">
                🌱 初級
              </a>
              <a href="/intermediate" className="px-8 py-3 bg-white text-emerald-700 rounded-xl font-bold text-lg hover:bg-emerald-50 transition shadow-lg hover:shadow-xl">
                ⚡ 中級
              </a>
              <a href="/upper-intermediate" className="px-8 py-3 bg-white text-purple-700 rounded-xl font-bold text-lg hover:bg-purple-50 transition shadow-lg hover:shadow-xl">
                🔥 中高級
              </a>
              <a href="/about" className="px-8 py-3 bg-white/10 border border-white/30 rounded-xl font-semibold text-lg hover:bg-white/20 transition">
                了解更多
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-6 -mt-12 relative z-10">
          {[
            { icon: "📖", title: "電子書教學", desc: "按單元學習單字、文法重點" },
            { icon: "🎧", title: "聽說讀寫", desc: "四項技能全面涵蓋" },
            { icon: "🎮", title: "遊戲練習", desc: "互動遊戲讓學習更有趣" },
            { icon: "📝", title: "模擬測驗", desc: "仿真正式考試格式" },
          ].map((f, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 text-center shadow-md border border-slate-100 hover-lift">
              <div className="text-4xl mb-3">{f.icon}</div>
              <h3 className="font-bold text-slate-800 mb-1">{f.title}</h3>
              <p className="text-sm text-slate-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Levels */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">選擇你的級別</h2>
        <p className="text-center text-slate-500 mb-10">從初級開始，一步步提升英文實力</p>

        <div className="grid md:grid-cols-3 gap-6">
          {LEVELS.map((lv) => (
            <div key={lv.id} className={`bg-white rounded-2xl overflow-hidden border ${lv.border} shadow-sm hover-lift`}>
              <div className={`bg-gradient-to-r ${lv.color} p-6 text-white`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl mb-2">{lv.icon}</div>
                    <h3 className="text-2xl font-bold">{lv.title}</h3>
                    <p className="text-sm opacity-80">{lv.sub}</p>
                  </div>
                  {!lv.ready && (
                    <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold">即將推出</span>
                  )}
                </div>
              </div>
              <div className="p-6">
                <p className="text-slate-600 font-medium mb-4">{lv.desc}</p>
                <ul className="space-y-2 mb-6">
                  {lv.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-slate-600">
                      <span className="text-emerald-500">✓</span> {f}
                    </li>
                  ))}
                </ul>
                {lv.ready ? (
                  <a href={`/${lv.id}`} className={`block text-center py-3 rounded-xl bg-gradient-to-r ${lv.color} text-white font-bold hover:opacity-90 transition`}>
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

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 text-center border border-amber-200">
          <div className="text-3xl mb-3">💡</div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">學習建議</h3>
          <p className="text-slate-600 max-w-lg mx-auto">
            每個單元按照 <strong className="text-blue-600">單字 → 文法 → 聽力 → 閱讀 → 測驗</strong> 的順序學習效果最好！
            先看懂再練習，學完整個單元後到遊戲區綜合練習。
          </p>
        </div>
      </section>
    </div>
  );
}
