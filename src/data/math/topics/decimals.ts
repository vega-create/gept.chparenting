import type { MathTopic } from "../types";

const topic: MathTopic = {
  id: "decimals",
  title: "小數",
  icon: "🔵",
  grade: "國小 4-5 年級",
  color: "from-teal-500 to-teal-600",
  border: "border-teal-200",
  concepts: [
    {
      title: "認識小數",
      explanation: "小數是用小數點來表示不到 1 的數。小數點右邊第一位是十分位（0.1），第二位是百分位（0.01）。例如 2.35 表示 2 又 35 個百分之一。",
      examples: [
        { question: "0.7 表示什麼？", steps: ["0.7 = 7 個 0.1", "也就是 7/10"], answer: "7/10" },
        { question: "2.35 的十分位和百分位各是多少？", steps: ["十分位：3（代表 0.3）", "百分位：5（代表 0.05）"], answer: "十分位 3，百分位 5" },
      ],
    },
    {
      title: "小數加減法",
      explanation: "小數加減法要對齊小數點，再從右到左逐位計算。和整數加減法一樣需要進位或借位。",
      examples: [
        { question: "3.45 + 2.37 = ?", steps: ["對齊小數點", "百分位：5 + 7 = 12，寫 2 進 1", "十分位：4 + 3 + 1 = 8", "個位：3 + 2 = 5", "答案：5.82"], answer: "5.82" },
        { question: "5.2 - 1.85 = ?", steps: ["5.20 - 1.85", "百分位：0 不夠減 5，借 1", "10 - 5 = 5", "十分位：1 - 8，不夠再借", "答案：3.35"], answer: "3.35" },
      ],
    },
    {
      title: "小數乘法",
      explanation: "先忽略小數點按整數相乘，再數兩個因數共有幾位小數，從右邊數回來標上小數點。",
      examples: [
        { question: "0.3 × 0.4 = ?", steps: ["3 × 4 = 12", "0.3 有 1 位小數，0.4 有 1 位", "共 2 位小數", "12 → 0.12"], answer: "0.12" },
        { question: "2.5 × 4 = ?", steps: ["25 × 4 = 100", "2.5 有 1 位小數", "100 → 10.0 = 10"], answer: "10" },
      ],
    },
  ],
  practices: [
    { question: "0.6 + 0.8 = ?", options: ["1.4", "1.2", "0.14", "1.6"], answer: 0, explanation: "6+8=14，進位得 1.4。" },
    { question: "3.25 + 1.7 = ?", options: ["4.32", "4.95", "4.22", "5.95"], answer: 1, explanation: "3.25 + 1.70 = 4.95。" },
    { question: "5.0 - 2.3 = ?", options: ["3.7", "2.7", "3.3", "2.3"], answer: 1, explanation: "5.0 - 2.3 = 2.7。" },
    { question: "4.56 - 1.23 = ?", options: ["3.23", "3.33", "3.43", "2.33"], answer: 1, explanation: "逐位相減：6-3=3，5-2=3，4-1=3，得 3.33。" },
    { question: "0.5 × 6 = ?", options: ["3.0", "3.5", "0.30", "30"], answer: 0, explanation: "5×6=30，1 位小數 → 3.0。" },
    { question: "0.2 × 0.3 = ?", options: ["0.6", "0.06", "6", "0.006"], answer: 1, explanation: "2×3=6，共 2 位小數 → 0.06。" },
    { question: "1.5 + 2.5 = ?", options: ["3.0", "4.0", "3.5", "4.5"], answer: 1, explanation: "1.5 + 2.5 = 4.0。" },
    { question: "7.8 - 3.9 = ?", options: ["3.9", "4.1", "3.1", "4.9"], answer: 0, explanation: "7.8 - 3.9 = 3.9。" },
    { question: "0.25 × 4 = ?", options: ["0.1", "1.0", "10", "0.5"], answer: 1, explanation: "25×4=100，2 位小數 → 1.00 = 1.0。" },
    { question: "6.3 + 2.85 = ?", options: ["9.15", "8.85", "9.85", "8.15"], answer: 0, explanation: "6.30 + 2.85 = 9.15。" },
    { question: "10.0 - 4.56 = ?", options: ["5.44", "5.54", "6.44", "4.44"], answer: 0, explanation: "10.00 - 4.56 = 5.44。" },
    { question: "3.5 × 2 = ?", options: ["6.0", "7.0", "5.5", "6.5"], answer: 1, explanation: "35×2=70，1 位小數 → 7.0。" },
    { question: "0.12 + 0.08 = ?", options: ["0.20", "0.2", "0.10", "0.20 = 0.2"], answer: 3, explanation: "12+8=20，答案 0.20 = 0.2。" },
    { question: "2.4 × 0.5 = ?", options: ["1.2", "12", "0.12", "1.0"], answer: 0, explanation: "24×5=120，共 2 位小數 → 1.20 = 1.2。" },
    { question: "8.1 - 0.99 = ?", options: ["7.11", "7.01", "7.21", "8.01"], answer: 0, explanation: "8.10 - 0.99 = 7.11。" },
  ],
  challenge: {
    timeLimit: 60,
    generateProblem: () => {
      const isAdd = Math.random() > 0.5;
      const a = Math.floor(Math.random() * 90 + 10) / 10; // 1.0-9.9
      const b = Math.floor(Math.random() * 90 + 10) / 10;
      if (isAdd) {
        return { question: `${a.toFixed(1)} + ${b.toFixed(1)} = ?（輸入一位小數×10 的整數值）`, answer: Math.round((a + b) * 10) };
      } else {
        const big = Math.max(a, b), small = Math.min(a, b);
        return { question: `${big.toFixed(1)} - ${small.toFixed(1)} = ?（×10）`, answer: Math.round((big - small) * 10) };
      }
    },
  },
};

export default topic;
