import { N4_UNITS } from "@/data/jlpt-n4";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "JLPT N4 日文基礎學習 | 單字 + 文法 + 聽力 + 測驗",
  description: "免費 JLPT N4 日文線上學習，20 個單元完整教學，800+ 單字，文法、聽力、閱讀、口說、遊戲與模擬測驗。",
  alternates: { canonical: "https://learn.chparenting.com/jlpt-n4" },
};

export default function JlptN4Page() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <div className="text-5xl mb-3">🇯🇵</div>
        <h1 className="text-3xl font-black text-slate-800 mb-2">JLPT N4 基礎</h1>
        <p className="text-slate-500">基礎日文 · {N4_UNITS.reduce((sum, u) => sum + u.vocab.length, 0)}+ 單字 · 聽說讀寫完整練習</p>
      </div>

      <div className="grid gap-4 mb-8">
        {N4_UNITS.map((u) => (
          <Link key={u.id} href={`/jlpt-n4/unit/${u.id}`}
            className="flex items-center gap-4 p-5 bg-white rounded-2xl border border-slate-200 shadow-sm hover-lift no-underline">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{ background: u.color + "15" }}>{u.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-semibold mb-0.5" style={{ color: u.color }}>Unit {u.id}</div>
              <div className="text-lg font-bold text-slate-800">{u.title}</div>
              <div className="text-sm text-slate-400">{u.titleJa} · {u.vocab.length} 單字 · {u.grammar.length} 文法</div>
            </div>
            <span className="text-slate-300 text-xl">→</span>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link href="/jlpt-n4/speaking"
          className="p-6 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl border border-red-200 hover-lift no-underline text-center">
          <div className="text-3xl mb-2">🎙️</div>
          <div className="font-bold text-slate-800">口說訓練</div>
          <div className="text-sm text-slate-500 mt-1">發音、跟讀、朗讀</div>
        </Link>
        <Link href="/jlpt-n4/writing"
          className="p-6 bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl border border-violet-200 hover-lift no-underline text-center">
          <div className="text-3xl mb-2">✍️</div>
          <div className="font-bold text-slate-800">寫作練習</div>
          <div className="text-sm text-slate-500 mt-1">句子重組、翻譯</div>
        </Link>
        <Link href="/jlpt-n4/game"
          className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 hover-lift no-underline text-center">
          <div className="text-3xl mb-2">🎮</div>
          <div className="font-bold text-slate-800">綜合遊戲</div>
          <div className="text-sm text-slate-500 mt-1">用遊戲複習全部單元</div>
        </Link>
        <Link href="/jlpt-n4/mock-test"
          className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 hover-lift no-underline text-center">
          <div className="text-3xl mb-2">📝</div>
          <div className="font-bold text-slate-800">模擬測驗</div>
          <div className="text-sm text-slate-500 mt-1">仿 JLPT 正式考試</div>
        </Link>
      </div>
    </div>
  );
}
