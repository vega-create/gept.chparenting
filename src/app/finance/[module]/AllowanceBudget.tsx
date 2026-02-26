"use client";

import { useState } from "react";
import { budgetCategories, allowanceAmounts, budgetTips } from "@/data/finance/modules/allowance-budget";

export default function AllowanceBudget() {
  const [allowance, setAllowance] = useState(100);
  const [pcts, setPcts] = useState<Record<string, number>>(
    Object.fromEntries(budgetCategories.map((c) => [c.id, c.defaultPct]))
  );

  const total = Object.values(pcts).reduce((a, b) => a + b, 0);
  const isValid = total === 100;

  const handleSlider = (id: string, value: number) => {
    setPcts((prev) => ({ ...prev, [id]: value }));
  };

  const reset = () => {
    setPcts(Object.fromEntries(budgetCategories.map((c) => [c.id, c.defaultPct])));
  };

  return (
    <div className="space-y-6">
      {/* Allowance selector */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-4">💵 你的零用錢是多少？</h2>
        <div className="flex flex-wrap gap-2">
          {allowanceAmounts.map((amt) => (
            <button key={amt} onClick={() => setAllowance(amt)}
              className={`px-5 py-2.5 rounded-xl font-bold cursor-pointer transition border-2 ${allowance === amt ? "border-pink-400 bg-pink-50 text-pink-700" : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}>
              NT${amt}
            </button>
          ))}
        </div>
      </div>

      {/* Budget sliders */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-slate-800">📊 分配比例</h2>
          <button onClick={reset} className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer bg-transparent border-none">重設</button>
        </div>

        {/* Total indicator */}
        <div className={`text-center mb-4 p-2 rounded-xl text-sm font-bold ${isValid ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
          {isValid ? "✅ 剛好 100%！" : `⚠️ 目前總共 ${total}%（${total > 100 ? "超過" : "不足"} ${Math.abs(100 - total)}%）`}
        </div>

        {/* Stacked bar */}
        <div className="h-6 rounded-full overflow-hidden flex mb-4">
          {budgetCategories.map((cat) => (
            <div key={cat.id} className={`${cat.color} transition-all`} style={{ width: `${pcts[cat.id]}%` }} />
          ))}
        </div>

        <div className="space-y-5">
          {budgetCategories.map((cat) => {
            const amt = Math.round(allowance * pcts[cat.id] / 100);
            return (
              <div key={cat.id}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-700">{cat.label}</span>
                  <span className="text-sm font-bold text-slate-600">{pcts[cat.id]}% = NT${amt}</span>
                </div>
                <input type="range" min={0} max={100} step={5} value={pcts[cat.id]}
                  onChange={(e) => handleSlider(cat.id, parseInt(e.target.value))}
                  className="w-full h-2 rounded-full appearance-none cursor-pointer"
                  style={{ accentColor: cat.id === "savings" ? "#10b981" : cat.id === "needs" ? "#3b82f6" : cat.id === "wants" ? "#ec4899" : "#f59e0b" }} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Result summary */}
      {isValid && (
        <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl p-6 border border-pink-200">
          <h3 className="font-bold text-slate-800 mb-3 text-center">💰 你的零用錢分配計劃</h3>
          <div className="grid grid-cols-2 gap-3">
            {budgetCategories.map((cat) => {
              const amt = Math.round(allowance * pcts[cat.id] / 100);
              return (
                <div key={cat.id} className="bg-white rounded-xl p-3 text-center border border-slate-100">
                  <div className="text-2xl mb-1">{cat.icon}</div>
                  <div className="text-sm font-bold text-slate-700">{cat.label.split(" ")[1]}</div>
                  <div className="text-lg font-black text-slate-800">NT${amt}</div>
                  <div className="text-xs text-slate-400">{pcts[cat.id]}%</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200">
        <h3 className="font-bold text-slate-800 mb-3">💡 理財小撇步</h3>
        <div className="space-y-3">
          {budgetTips.map((tip) => (
            <div key={tip.title} className="flex gap-3 items-start">
              <span className="text-xl">{tip.icon}</span>
              <div>
                <div className="font-bold text-sm text-slate-700">{tip.title}</div>
                <div className="text-sm text-slate-600">{tip.tip}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
