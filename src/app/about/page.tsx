import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "關於我們 | 親子多元學習平台",
  description: "親子多元學習平台由智慧媽咪國際有限公司製作，提供全民英檢、日文、數學等免費學習工具，減輕家長負擔，讓孩子快樂學習。",
  alternates: { canonical: "https://learn.chparenting.com/about" },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  name: "關於親子多元學習平台",
  url: "https://learn.chparenting.com/about",
  mainEntity: {
    "@type": "Organization",
    name: "智慧媽咪國際有限公司 Mommy Wisdom International LTD.",
    url: "https://aimommywisdom.com",
    description: "專注於數位行銷與教育科技，打造免費親子學習平台。",
  },
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="text-center mb-10">
        <div className="text-5xl mb-3">💡</div>
        <h1 className="text-3xl font-black text-slate-800 mb-2">關於我們</h1>
        <p className="text-slate-500">減輕家長負擔，讓孩子快樂學習</p>
      </div>

      {/* Platform Vision */}
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm mb-6">
        <h2 className="text-xl font-bold text-slate-800 mb-4">🌟 平台願景</h2>
        <p className="text-slate-600 leading-7 mb-4">
          <strong>親子多元學習平台</strong>是一個完全免費的線上學習資源平台，
          讓家長不需要花補習費，也能在家陪孩子有效學習。
        </p>
        <p className="text-slate-600 leading-7 mb-4">
          我們相信：好的學習工具不應該只有付得起補習費的家庭才能享有。
          透過互動式的遊戲化學習，每個孩子都能用自己的節奏快樂成長。
        </p>
        <p className="text-slate-600 leading-7">
          目前已上線<strong>全民英檢</strong>（初級・中級・中高級，共 94 單元）、
          <strong>JLPT 日文檢定</strong>（N5～N1 全 5 級，共 100 單元）、
          <strong>教育桌遊</strong>（16 款邏輯・程式・記憶・數學遊戲）和<strong>打字練習</strong>。
          數學練習與兒童理財工具正在開發中 🚀
        </p>
      </div>

      {/* Current Tools */}
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm mb-6">
        <h2 className="text-xl font-bold text-slate-800 mb-4">🛠️ 目前提供的工具</h2>
        <div className="space-y-3">
          <a href="/elementary" className="flex items-center gap-4 p-4 rounded-xl bg-blue-50 border border-blue-100 hover:shadow-md transition no-underline">
            <span className="text-3xl">📘</span>
            <div>
              <div className="font-bold text-slate-800">全民英檢 GEPT</div>
              <div className="text-sm text-slate-500">94 單元 · 8,000+ 單字 · 初級到中高級 · 聽說讀寫完整練習</div>
            </div>
            <span className="ml-auto text-blue-400">→</span>
          </a>
          <a href="/jlpt-n5" className="flex items-center gap-4 p-4 rounded-xl bg-red-50 border border-red-100 hover:shadow-md transition no-underline">
            <span className="text-3xl">🇯🇵</span>
            <div>
              <div className="font-bold text-slate-800">JLPT 日文檢定</div>
              <div className="text-sm text-slate-500">N5～N1 全 5 級 · 100 單元 · 五十音 · 單字文法 · 聽說讀寫 · 遊戲 · 模擬測驗</div>
            </div>
            <span className="ml-auto text-red-400">→</span>
          </a>
          <a href="/board-games" className="flex items-center gap-4 p-4 rounded-xl bg-orange-50 border border-orange-100 hover:shadow-md transition no-underline">
            <span className="text-3xl">🎲</span>
            <div>
              <div className="font-bold text-slate-800">教育桌遊</div>
              <div className="text-sm text-slate-500">16 款遊戲 · 邏輯推理 · 程式概念 · 記憶力 · 數學衝刺 · 語言探索</div>
            </div>
            <span className="ml-auto text-orange-400">→</span>
          </a>
          <a href="/typing-game" className="flex items-center gap-4 p-4 rounded-xl bg-emerald-50 border border-emerald-100 hover:shadow-md transition no-underline">
            <span className="text-3xl">⌨️</span>
            <div>
              <div className="font-bold text-slate-800">打字練習</div>
              <div className="text-sm text-slate-500">中英雙語打字訓練 · 落下文字 · 限時挑戰 · 速度測試</div>
            </div>
            <span className="ml-auto text-emerald-400">→</span>
          </a>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          {[
            { icon: "🔢", label: "數學練習", status: "開發中" },
            { icon: "💰", label: "兒童理財", status: "開發中" },
          ].map((t) => (
            <div key={t.label} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center opacity-60">
              <div className="text-2xl mb-1">{t.icon}</div>
              <div className="text-sm font-medium text-slate-600">{t.label}</div>
              <div className="text-xs text-slate-400">{t.status}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Company Info */}
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm mb-6">
        <h2 className="text-xl font-bold text-slate-800 mb-4">🏢 智慧媽咪國際有限公司</h2>
        <p className="text-slate-600 leading-7 mb-4">
          親子多元學習平台由<strong>智慧媽咪國際有限公司（Mommy Wisdom International LTD.）</strong>製作與維護。
          我們是一家專注於數位行銷與教育科技的公司，相信科技可以讓學習變得更容易。
        </p>
        <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
          <h3 className="font-bold text-slate-700 mb-3 text-sm">我們的服務</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-slate-600">
            <div className="flex items-center gap-1.5"><span className="text-blue-400">✓</span> SEO 優化</div>
            <div className="flex items-center gap-1.5"><span className="text-blue-400">✓</span> 數位廣告</div>
            <div className="flex items-center gap-1.5"><span className="text-blue-400">✓</span> 網站開發</div>
            <div className="flex items-center gap-1.5"><span className="text-blue-400">✓</span> 企業培訓</div>
            <div className="flex items-center gap-1.5"><span className="text-blue-400">✓</span> AI 自動化</div>
            <div className="flex items-center gap-1.5"><span className="text-blue-400">✓</span> 教育科技</div>
          </div>
        </div>
      </div>

      {/* Resources */}
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm mb-6">
        <h2 className="text-xl font-bold text-slate-800 mb-4">🌐 更多資源</h2>
        <div className="space-y-3">
          <a href="https://aimommywisdom.com" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 hover:shadow-md transition no-underline">
            <span className="text-2xl">👶</span>
            <div>
              <div className="font-bold text-slate-800">AI Mommy Wisdom</div>
              <div className="text-sm text-slate-500">智慧媽咪國際有限公司官網</div>
            </div>
            <span className="ml-auto text-pink-400">↗</span>
          </a>
          <a href="https://chparenting.com" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 hover:shadow-md transition no-underline">
            <span className="text-2xl">👨‍👩‍👧</span>
            <div>
              <div className="font-bold text-slate-800">CH Parenting</div>
              <div className="text-sm text-slate-500">親子教養與家庭生活分享</div>
            </div>
            <span className="ml-auto text-blue-400">↗</span>
          </a>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-200 text-center">
        <div className="text-2xl mb-2">💌</div>
        <h3 className="font-bold text-slate-800 mb-2">有想法想告訴我們？</h3>
        <p className="text-sm text-slate-600 mb-4">
          不管是功能建議、錯誤回報，還是想說聲加油，都歡迎聯繫我們！<br />
          你的回饋是讓這個平台變得更好的最大動力 ❤️
        </p>
        <a href="https://aimommywisdom.com" target="_blank" rel="noopener noreferrer"
          className="inline-block px-6 py-2.5 bg-amber-500 text-white rounded-xl font-semibold text-sm hover:bg-amber-600 transition no-underline">
          前往官網聯繫 →
        </a>
      </div>
    </div>
  );
}
