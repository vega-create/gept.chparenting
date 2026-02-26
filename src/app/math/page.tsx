import type { Metadata } from "next";
import Link from "next/link";
import { MATH_TOPICS } from "@/data/math/topics";

export const metadata: Metadata = {
  title: "數學練習 | 觀念教學 + 互動練習 + 限時挑戰",
  description: "8 大主題數學學習工具：基礎運算、分數、小數、百分比、幾何、代數入門、應用題、時間與計量。觀念教學搭配互動練習，適合國小到國中學生。",
  alternates: { canonical: "https://learn.chparenting.com/math" },
};

const GRADE_GROUPS = [
  { label: "🌱 基礎（國小 1-3 年級）", ids: ["basic-arithmetic", "time-measurement"] },
  { label: "🌿 進階（國小 3-5 年級）", ids: ["fractions", "decimals", "geometry", "word-problems"] },
  { label: "🌳 挑戰（國小 5 年級～國中）", ids: ["percentages", "intro-algebra"] },
];

export default function MathPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <div className="text-5xl mb-3 animate-float">🔢</div>
        <h1 className="text-3xl font-black text-slate-800 mb-2">數學練習</h1>
        <p className="text-slate-500">觀念教學 · 互動練習 · 限時挑戰 — 從基礎到進階</p>
      </div>

      {/* How to use */}
      <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200 mb-8">
        <h2 className="font-bold text-slate-800 mb-2">📖 學習方式</h2>
        <div className="grid sm:grid-cols-3 gap-4 text-sm text-slate-600">
          <div className="flex gap-2"><span className="text-amber-500 font-bold">1.</span>先看<strong>觀念教學</strong>，理解原理和範例</div>
          <div className="flex gap-2"><span className="text-amber-500 font-bold">2.</span>做<strong>互動練習</strong>，每題都有詳解</div>
          <div className="flex gap-2"><span className="text-amber-500 font-bold">3.</span>挑戰<strong>限時計算</strong>，訓練速度和準確</div>
        </div>
      </div>

      {/* Topics by grade */}
      <div className="space-y-8">
        {GRADE_GROUPS.map((group) => (
          <div key={group.label}>
            <h2 className="text-xl font-bold text-slate-800 mb-4">{group.label}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {group.ids.map((id) => {
                const t = MATH_TOPICS.find((x) => x.id === id);
                if (!t) return null;
                return (
                  <Link key={t.id} href={`/math/${t.id}`}
                    className={`bg-white rounded-2xl overflow-hidden border ${t.border} shadow-sm hover-lift no-underline`}>
                    <div className={`bg-gradient-to-r ${t.color} p-4 text-white`}>
                      <div className="text-3xl mb-1">{t.icon}</div>
                      <div className="text-lg font-bold">{t.title}</div>
                      <div className="text-sm opacity-80">{t.grade}</div>
                    </div>
                    <div className="p-4">
                      <div className="flex gap-2 flex-wrap">
                        <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-600">📖 {t.concepts.length} 個觀念</span>
                        <span className="text-xs px-2.5 py-1 rounded-full bg-green-50 text-green-600">✏️ {t.practices.length} 題練習</span>
                        <span className="text-xs px-2.5 py-1 rounded-full bg-orange-50 text-orange-600">⏱️ 限時挑戰</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="text-center mt-10">
        <a href="/" className="text-sm text-amber-500 hover:underline no-underline">← 回到首頁</a>
      </div>
    </div>
  );
}
