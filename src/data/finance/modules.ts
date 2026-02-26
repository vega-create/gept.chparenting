import type { FinanceModule } from "./types";

export const FINANCE_MODULES: FinanceModule[] = [
  {
    id: "money-basics",
    title: "認識金錢",
    icon: "💰",
    description: "金錢的基本概念、貨幣種類和理財常識",
    color: "from-amber-500 to-amber-600",
    border: "border-amber-200",
    type: "lesson",
  },
  {
    id: "needs-vs-wants",
    title: "需要 vs 想要",
    icon: "🤔",
    description: "分辨生活必需品和非必需品",
    color: "from-blue-500 to-blue-600",
    border: "border-blue-200",
    type: "game",
  },
  {
    id: "savings-calculator",
    title: "儲蓄計算機",
    icon: "🏦",
    description: "設定目標，計算每天存多少錢可以達成",
    color: "from-emerald-500 to-emerald-600",
    border: "border-emerald-200",
    type: "tool",
  },
  {
    id: "allowance-budget",
    title: "零用錢分配",
    icon: "📊",
    description: "學習分配零用錢到儲蓄、需要、想要和分享",
    color: "from-pink-500 to-pink-600",
    border: "border-pink-200",
    type: "game",
  },
  {
    id: "red-envelope",
    title: "紅包理財",
    icon: "🧧",
    description: "模擬收到紅包後的理財分配決策",
    color: "from-red-500 to-red-600",
    border: "border-red-200",
    type: "game",
  },
  {
    id: "expense-tracker",
    title: "記帳小達人",
    icon: "📝",
    description: "模擬 7 天記帳，學習追蹤花費",
    color: "from-violet-500 to-violet-600",
    border: "border-violet-200",
    type: "game",
  },
];

export function getModuleById(id: string): FinanceModule | undefined {
  return FINANCE_MODULES.find((m) => m.id === id);
}
