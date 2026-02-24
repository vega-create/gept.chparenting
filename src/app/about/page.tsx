import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "關於我們 | GEPT 全民英檢免費學習平台",
  description: "GEPT Learn 是由智慧媽咪國際有限公司（Mommy Wisdom International LTD.）製作的免費英檢學習平台，希望讓孩子開心練英文。",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <div className="text-5xl mb-3">💡</div>
        <h1 className="text-3xl font-black text-slate-800 mb-2">關於我們</h1>
        <p className="text-slate-500">一個媽媽想讓孩子快樂學英文的小小計畫</p>
      </div>

      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm mb-6">
        <h2 className="text-xl font-bold text-slate-800 mb-4">📘 為什麼做 GEPT Learn？</h2>
        <p className="text-slate-600 leading-7 mb-4">
          身為兩個孩子的媽媽，我一直在想：有沒有辦法讓孩子準備英檢的時候，
          不只是背單字、寫考卷，而是能用更輕鬆有趣的方式來練習？
        </p>
        <p className="text-slate-600 leading-7 mb-4">
          於是我決定自己動手做！運用數位行銷和網站開發的專長，打造了這個<strong>完全免費</strong>的英檢學習平台。
          這裡有單字卡、聽力跟讀、閱讀練習、小遊戲和模擬測驗，
          希望讓孩子可以隨時隨地、用自己的節奏來練習英文。
        </p>
        <p className="text-slate-600 leading-7">
          老實說，這個平台還在持續進化中 🚀 
          如果你有任何「要是能加這個功能就好了！」的想法，非常歡迎告訴我們，
          我們會一步步把它做得更好、更好玩！
        </p>
      </div>

      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm mb-6">
        <h2 className="text-xl font-bold text-slate-800 mb-4">✨ 平台特色</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-blue-50 border border-blue-100">
            <div className="text-2xl mb-2">📖</div>
            <div className="font-bold text-slate-800 mb-1">初級 20 + 中級 34 + 中高級 40 單元</div>
            <div className="text-sm text-slate-500">超過 8,000 個單字，涵蓋英檢初級到中高級範圍</div>
          </div>
          <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
            <div className="text-2xl mb-2">🎧</div>
            <div className="font-bold text-slate-800 mb-1">聽力 + 跟讀練習</div>
            <div className="text-sm text-slate-500">可調速度、無限重複，練到聽懂為止</div>
          </div>
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
            <div className="text-2xl mb-2">🎮</div>
            <div className="font-bold text-slate-800 mb-1">7 種學習小遊戲</div>
            <div className="text-sm text-slate-500">單字配對、拼字、聽寫…邊玩邊記</div>
          </div>
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
            <div className="text-2xl mb-2">📝</div>
            <div className="font-bold text-slate-800 mb-1">全英文模擬測驗</div>
            <div className="text-sm text-slate-500">比照正式英檢格式，考完才看答案</div>
          </div>
        </div>
        <div className="mt-4 p-4 rounded-xl bg-pink-50 border border-pink-100 text-center">
          <span className="text-lg">💰</span>
          <span className="font-bold text-slate-800 ml-2">而且完全免費，不用註冊！</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm mb-6">
        <h2 className="text-xl font-bold text-slate-800 mb-4">🏢 智慧媽咪國際有限公司</h2>
        <p className="text-slate-600 leading-7 mb-4">
          GEPT Learn 由<strong>智慧媽咪國際有限公司（Mommy Wisdom International LTD.）</strong>製作與維護。
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

      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm mb-6">
        <h2 className="text-xl font-bold text-slate-800 mb-4">🌐 更多資源</h2>
        <a href="https://chparenting.com" target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 hover:shadow-md transition no-underline">
          <span className="text-2xl">👶</span>
          <div>
            <div className="font-bold text-slate-800">CH Parenting</div>
            <div className="text-sm text-slate-500">親子教養與家庭生活分享</div>
          </div>
          <span className="ml-auto text-pink-400">↗</span>
        </a>
      </div>

      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8 border border-amber-200 text-center">
        <div className="text-2xl mb-2">💌</div>
        <h3 className="font-bold text-slate-800 mb-2">有想法想告訴我們？</h3>
        <p className="text-sm text-slate-600 mb-4">
          不管是功能建議、錯誤回報，還是想說聲加油，都歡迎聯繫我們！<br />
          你的回饋是讓這個平台變得更好的最大動力 ❤️
        </p>
        <a href="https://chparenting.com" target="_blank" rel="noopener noreferrer"
          className="inline-block px-6 py-2.5 bg-amber-500 text-white rounded-xl font-semibold text-sm hover:bg-amber-600 transition no-underline">
          前往官網聯繫 →
        </a>
      </div>
    </div>
  );
}
