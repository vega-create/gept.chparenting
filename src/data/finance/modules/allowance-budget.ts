import type { BudgetCategory } from "../types";

export const budgetCategories: BudgetCategory[] = [
  { id: "savings", label: "💰 儲蓄", icon: "💰", color: "bg-emerald-500", defaultPct: 30 },
  { id: "needs", label: "🍱 需要", icon: "🍱", color: "bg-blue-500", defaultPct: 40 },
  { id: "wants", label: "🎮 想要", icon: "🎮", color: "bg-pink-500", defaultPct: 20 },
  { id: "sharing", label: "❤️ 分享", icon: "❤️", color: "bg-amber-500", defaultPct: 10 },
];

export const allowanceAmounts = [50, 100, 150, 200, 300, 500];

export const budgetTips = [
  { title: "先存後花", tip: "拿到零用錢，先把要存的拿出來，再花剩下的。", icon: "🏦" },
  { title: "記錄花費", tip: "每次花錢都記下來，週末回顧一下錢花到哪裡了。", icon: "📝" },
  { title: "等一等原則", tip: "想買東西時，先等 3 天再決定，避免衝動消費。", icon: "⏳" },
  { title: "分享的快樂", tip: "留一點錢分享給需要的人，給予比接受更快樂。", icon: "🤗" },
  { title: "目標存錢", tip: "為想要的東西設定存錢目標，看著錢越來越多很有成就感！", icon: "🎯" },
];
