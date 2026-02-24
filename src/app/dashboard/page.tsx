"use client";
import { useAuth } from "@/contexts/AuthContext";

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-slate-400">載入中...</div>
      </div>
    );
  }

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "使用者";

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <div className="text-5xl mb-3">👋</div>
        <h1 className="text-3xl font-black text-slate-800 mb-2">歡迎回來，{displayName}！</h1>
        <p className="text-slate-500">你的學習空間</p>
      </div>

      {/* Placeholder cards for future features */}
      <div className="grid sm:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center opacity-60">
          <div className="text-4xl mb-3">📊</div>
          <h3 className="font-bold text-slate-800 mb-2">學習進度</h3>
          <p className="text-sm text-slate-500 mb-4">追蹤你的學習紀錄和測驗成績</p>
          <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">即將推出</span>
        </div>
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center opacity-60">
          <div className="text-4xl mb-3">📈</div>
          <h3 className="font-bold text-slate-800 mb-2">成績統計</h3>
          <p className="text-sm text-slate-500 mb-4">查看各科目的練習數據和進步趨勢</p>
          <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">即將推出</span>
        </div>
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center opacity-60">
          <div className="text-4xl mb-3">⭐</div>
          <h3 className="font-bold text-slate-800 mb-2">收藏單字</h3>
          <p className="text-sm text-slate-500 mb-4">收藏常錯的單字，重點複習</p>
          <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">即將推出</span>
        </div>
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center opacity-60">
          <div className="text-4xl mb-3">🏆</div>
          <h3 className="font-bold text-slate-800 mb-2">學習成就</h3>
          <p className="text-sm text-slate-500 mb-4">完成學習目標，獲得成就徽章</p>
          <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-semibold">即將推出</span>
        </div>
      </div>

      {/* Quick access */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200 text-center">
        <h3 className="text-xl font-bold text-slate-800 mb-4">現在就開始學習！</h3>
        <div className="flex flex-wrap justify-center gap-3">
          <a href="/elementary" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition no-underline">
            🌱 初級
          </a>
          <a href="/intermediate" className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition no-underline">
            ⚡ 中級
          </a>
          <a href="/upper-intermediate" className="px-6 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition no-underline">
            🔥 中高級
          </a>
        </div>
      </div>
    </div>
  );
}
