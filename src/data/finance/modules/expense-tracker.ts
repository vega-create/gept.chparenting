import type { ExpenseCategory } from "../types";

export const expenseCategories: ExpenseCategory[] = [
  { id: "food", label: "食物", icon: "🍱" },
  { id: "transport", label: "交通", icon: "🚌" },
  { id: "stationery", label: "文具", icon: "✏️" },
  { id: "snacks", label: "零食", icon: "🍬" },
  { id: "entertainment", label: "娛樂", icon: "🎮" },
  { id: "books", label: "書籍", icon: "📖" },
  { id: "gifts", label: "禮物", icon: "🎁" },
  { id: "savings", label: "存入儲蓄", icon: "💰" },
];

export const sampleTransactions = [
  { day: 1, desc: "學校午餐加菜", amount: 20, categoryId: "food" },
  { day: 1, desc: "搭公車", amount: 15, categoryId: "transport" },
  { day: 2, desc: "買鉛筆", amount: 10, categoryId: "stationery" },
  { day: 2, desc: "珍珠奶茶", amount: 45, categoryId: "snacks" },
  { day: 3, desc: "存入撲滿", amount: 50, categoryId: "savings" },
  { day: 3, desc: "買漫畫", amount: 80, categoryId: "books" },
  { day: 4, desc: "夾娃娃", amount: 30, categoryId: "entertainment" },
  { day: 4, desc: "午餐", amount: 50, categoryId: "food" },
  { day: 5, desc: "買橡皮擦", amount: 15, categoryId: "stationery" },
  { day: 5, desc: "糖果", amount: 20, categoryId: "snacks" },
  { day: 5, desc: "存入撲滿", amount: 30, categoryId: "savings" },
  { day: 6, desc: "同學生日禮物", amount: 100, categoryId: "gifts" },
  { day: 6, desc: "冰淇淋", amount: 35, categoryId: "snacks" },
  { day: 7, desc: "搭公車", amount: 15, categoryId: "transport" },
  { day: 7, desc: "存入撲滿", amount: 50, categoryId: "savings" },
];

export const badges = [
  { id: "first-entry", name: "初次記帳", icon: "📝", condition: "記錄第一筆支出" },
  { id: "saver", name: "小小儲蓄家", icon: "💰", condition: "存錢超過 3 次" },
  { id: "tracker", name: "記帳達人", icon: "⭐", condition: "連續 7 天都有記帳" },
  { id: "budget-keeper", name: "預算守護者", icon: "🛡️", condition: "一週花費不超過預算" },
  { id: "generous", name: "慷慨小天使", icon: "😇", condition: "有分享或送禮記錄" },
];
