/* ─── Finance Section Type Definitions ─── */

export interface SortingItem {
  name: string;
  icon: string;
  isNeed: boolean; // true = 需要, false = 想要
  explanation: string;
}

export interface BudgetCategory {
  id: string;
  label: string;
  icon: string;
  color: string;
  defaultPct: number;
}

export interface SavingsGoal {
  name: string;
  icon: string;
  amount: number;
}

export interface RedEnvelopeScenario {
  title: string;
  amount: number;
  description: string;
  suggestedSplit: { savings: number; spending: number; sharing: number };
}

export interface ExpenseCategory {
  id: string;
  label: string;
  icon: string;
}

export interface FlashCard {
  front: string;
  back: string;
  icon: string;
}

export interface QuizItem {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface FinanceModule {
  id: string;
  title: string;
  icon: string;
  description: string;
  color: string;
  border: string;
  type: "lesson" | "game" | "tool";
}
