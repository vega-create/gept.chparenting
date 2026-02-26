import type { MathTopic } from "../types";

const topic: MathTopic = {
  id: "intro-algebra",
  title: "代數入門",
  icon: "🔤",
  grade: "國小 6 年級～國中",
  color: "from-rose-500 to-rose-600",
  border: "border-rose-200",
  concepts: [
    {
      title: "用未知數列式",
      explanation: "代數用字母（如 x）代表未知的數。我們可以把文字敘述翻譯成含有 x 的算式。例如「某數加 5 等於 12」可以寫成 x + 5 = 12。",
      examples: [
        { question: "某數的 3 倍是 24，求某數。", steps: ["設某數為 x", "列式：3x = 24", "解：x = 24 ÷ 3 = 8"], answer: "x = 8" },
        { question: "某數加 7 等於 15，求某數。", steps: ["設某數為 x", "列式：x + 7 = 15", "解：x = 15 - 7 = 8"], answer: "x = 8" },
      ],
    },
    {
      title: "一元一次方程式",
      explanation: "一元一次方程式只有一個未知數（x），且 x 的最高次方是 1。解方程式就是把 x 單獨移到等號的一邊。移項時要變號。",
      examples: [
        { question: "2x + 3 = 11，求 x。", steps: ["2x = 11 - 3", "2x = 8", "x = 8 ÷ 2 = 4"], answer: "x = 4" },
        { question: "5x - 8 = 17，求 x。", steps: ["5x = 17 + 8", "5x = 25", "x = 25 ÷ 5 = 5"], answer: "x = 5" },
      ],
    },
    {
      title: "等式性質",
      explanation: "等式兩邊同時加、減、乘、除同一個數（除數不為 0），等式仍然成立。這是解方程式的基本原理。",
      examples: [
        { question: "若 x - 4 = 10，兩邊同時加 4", steps: ["x - 4 + 4 = 10 + 4", "x = 14"], answer: "x = 14" },
        { question: "若 x/3 = 7，兩邊同時乘 3", steps: ["(x/3) × 3 = 7 × 3", "x = 21"], answer: "x = 21" },
      ],
    },
  ],
  practices: [
    { question: "x + 5 = 12，x = ?", options: ["5", "7", "17", "6"], answer: 1, explanation: "x = 12 - 5 = 7。" },
    { question: "3x = 18，x = ?", options: ["3", "15", "6", "54"], answer: 2, explanation: "x = 18 ÷ 3 = 6。" },
    { question: "x - 9 = 4，x = ?", options: ["13", "5", "36", "14"], answer: 0, explanation: "x = 4 + 9 = 13。" },
    { question: "2x + 1 = 9，x = ?", options: ["5", "4", "3", "8"], answer: 1, explanation: "2x = 8，x = 4。" },
    { question: "x/4 = 5，x = ?", options: ["1", "9", "20", "25"], answer: 2, explanation: "x = 5 × 4 = 20。" },
    { question: "4x - 3 = 13，x = ?", options: ["2.5", "4", "10", "3"], answer: 1, explanation: "4x = 16，x = 4。" },
    { question: "7 + x = 20，x = ?", options: ["27", "13", "3", "14"], answer: 1, explanation: "x = 20 - 7 = 13。" },
    { question: "6x = 42，x = ?", options: ["6", "7", "8", "36"], answer: 1, explanation: "x = 42 ÷ 6 = 7。" },
    { question: "x/5 + 2 = 6，x = ?", options: ["20", "30", "4", "15"], answer: 0, explanation: "x/5 = 4，x = 20。" },
    { question: "3x + 4 = 25，x = ?", options: ["7", "9", "3", "8"], answer: 0, explanation: "3x = 21，x = 7。" },
    { question: "50 - 2x = 30，x = ?", options: ["10", "40", "20", "15"], answer: 0, explanation: "2x = 20，x = 10。" },
    { question: "x × 8 = 56，x = ?", options: ["6", "7", "8", "48"], answer: 1, explanation: "x = 56 ÷ 8 = 7。" },
    { question: "2(x + 3) = 16，x = ?", options: ["5", "8", "6.5", "10"], answer: 0, explanation: "x + 3 = 8，x = 5。" },
    { question: "100 - x = 37，x = ?", options: ["137", "63", "73", "37"], answer: 1, explanation: "x = 100 - 37 = 63。" },
    { question: "5x + 10 = 35，x = ?", options: ["9", "5", "25", "45"], answer: 1, explanation: "5x = 25，x = 5。" },
  ],
  challenge: {
    timeLimit: 60,
    generateProblem: () => {
      const x = 1 + Math.floor(Math.random() * 20);
      const a = 2 + Math.floor(Math.random() * 8);
      const b = Math.floor(Math.random() * 20);
      const result = a * x + b;
      return { question: `${a}x + ${b} = ${result}，x = ?`, answer: x };
    },
  },
};

export default topic;
