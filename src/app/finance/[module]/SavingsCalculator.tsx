"use client";

import { useState } from "react";
import { savingsGoals, dailySavingsOptions } from "@/data/finance/modules/savings-calculator";

export default function SavingsCalculator() {
  const [goalIdx, setGoalIdx] = useState(0);
  const [customAmount, setCustomAmount] = useState("");
  const [dailySaving, setDailySaving] = useState(10);
  const [useCustom, setUseCustom] = useState(false);

  const goal = savingsGoals[goalIdx];
  const targetAmount = useCustom ? (parseInt(customAmount) || 0) : goal.amount;
  const daysNeeded = dailySaving > 0 ? Math.ceil(targetAmount / dailySaving) : 0;
  const weeksNeeded = Math.ceil(daysNeeded / 7);

  return (
    <div className="space-y-6">
      {/* Goal selection */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-4">🎯 選擇存錢目標</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
          {savingsGoals.map((g, i) => (
            <button key={g.name} onClick={() => { setGoalIdx(i); setUseCustom(false); }}
              className={`p-3 rounded-xl border-2 text-center cursor-pointer transition ${!useCustom && goalIdx === i ? "border-emerald-400 bg-emerald-50" : "border-slate-200 bg-white hover:bg-slate-50"}`}>
              <div className="text-2xl">{g.icon}</div>
              <div className="text-sm font-bold text-slate-700">{g.name}</div>
              <div className="text-xs text-slate-400">NT${g.amount.toLocaleString()}</div>
            </button>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button onClick={() => setUseCustom(true)}
            className={`px-4 py-2 rounded-xl text-sm font-bold cursor-pointer transition border-2 ${useCustom ? "border-emerald-400 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}>
            ✏️ 自訂金額
          </button>
          {useCustom && (
            <input type="number" value={customAmount} onChange={(e) => setCustomAmount(e.target.value)}
              placeholder="輸入金額"
              className="px-4 py-2 rounded-xl border-2 border-slate-200 w-36 text-center focus:border-emerald-400 focus:outline-none" />
          )}
        </div>
      </div>

      {/* Daily savings */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-4">💰 每天存多少錢？</h2>
        <div className="flex flex-wrap gap-2">
          {dailySavingsOptions.map((amt) => (
            <button key={amt} onClick={() => setDailySaving(amt)}
              className={`px-5 py-2.5 rounded-xl font-bold cursor-pointer transition border-2 ${dailySaving === amt ? "border-amber-400 bg-amber-50 text-amber-700" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}>
              NT${amt}
            </button>
          ))}
        </div>
      </div>

      {/* Result */}
      {targetAmount > 0 && dailySaving > 0 && (
        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 border border-emerald-200">
          <h2 className="text-lg font-bold text-slate-800 mb-4 text-center">📊 計算結果</h2>
          <div className="text-center">
            <div className="text-sm text-slate-500 mb-1">
              {useCustom ? "自訂目標" : `${goal.icon} ${goal.name}`}
            </div>
            <div className="text-2xl font-black text-slate-800 mb-4">
              目標 NT${targetAmount.toLocaleString()}
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="bg-white rounded-xl p-3 border border-emerald-100">
                <div className="text-2xl font-black text-emerald-600">{daysNeeded}</div>
                <div className="text-xs text-slate-500">天</div>
              </div>
              <div className="bg-white rounded-xl p-3 border border-emerald-100">
                <div className="text-2xl font-black text-emerald-600">{weeksNeeded}</div>
                <div className="text-xs text-slate-500">週</div>
              </div>
              <div className="bg-white rounded-xl p-3 border border-emerald-100">
                <div className="text-2xl font-black text-emerald-600">{Math.ceil(daysNeeded / 30)}</div>
                <div className="text-xs text-slate-500">個月</div>
              </div>
            </div>

            <p className="text-sm text-slate-600">
              每天存 <strong className="text-emerald-600">NT${dailySaving}</strong>，
              <strong className="text-emerald-600">{daysNeeded} 天</strong>後就能存到
              <strong className="text-emerald-600"> NT${targetAmount.toLocaleString()}</strong>！
            </p>

            {/* progress visualization */}
            <div className="mt-4">
              <div className="text-xs text-slate-400 mb-1">進度預覽（每格 = 1 天）</div>
              <div className="flex flex-wrap gap-0.5 justify-center max-h-24 overflow-hidden">
                {Array.from({ length: Math.min(daysNeeded, 90) }).map((_, i) => (
                  <div key={i} className="w-3 h-3 rounded-sm bg-emerald-400 opacity-70" />
                ))}
                {daysNeeded > 90 && <span className="text-xs text-slate-400 self-center ml-1">+{daysNeeded - 90} 天</span>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
        <h3 className="font-bold text-slate-800 mb-2">💡 存錢小撇步</h3>
        <ul className="text-sm text-slate-600 space-y-1.5">
          <li>• 準備一個存錢筒或撲滿，每天固定投入</li>
          <li>• 把存錢目標寫在紙上貼在看得到的地方</li>
          <li>• 每週數一次存了多少，看著錢變多很有成就感！</li>
          <li>• 如果某天忘記存，隔天補上就好，不要放棄</li>
        </ul>
      </div>
    </div>
  );
}
