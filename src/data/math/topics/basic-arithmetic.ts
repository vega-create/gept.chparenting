import type { MathTopic } from "../types";

const topic: MathTopic = {
  id: "basic-arithmetic",
  title: "基礎運算",
  icon: "➕",
  grade: "國小 1-3 年級",
  color: "from-blue-500 to-blue-600",
  border: "border-blue-200",
  concepts: [
    {
      title: "加法與減法",
      explanation: "加法是把兩個數合在一起，減法是從一個數中拿走一些。加法和減法是互逆運算，例如 3 + 5 = 8，所以 8 - 5 = 3。",
      examples: [
        { question: "23 + 45 = ?", steps: ["個位：3 + 5 = 8", "十位：2 + 4 = 6", "答案：68"], answer: "68" },
        { question: "52 - 17 = ?", steps: ["個位：2 不夠減 7，向十位借 1", "12 - 7 = 5", "十位：4 - 1 = 3", "答案：35"], answer: "35" },
      ],
    },
    {
      title: "乘法與除法",
      explanation: "乘法是重複加法的快速方法，例如 4 × 3 就是 4 + 4 + 4 = 12。除法是把一個數平均分成幾份，是乘法的逆運算。",
      examples: [
        { question: "6 × 7 = ?", steps: ["6 × 7 表示 7 個 6 相加", "6 + 6 + 6 + 6 + 6 + 6 + 6 = 42"], answer: "42" },
        { question: "56 ÷ 8 = ?", steps: ["想：幾乘以 8 等於 56？", "7 × 8 = 56", "所以 56 ÷ 8 = 7"], answer: "7" },
      ],
    },
    {
      title: "四則混合運算",
      explanation: "先乘除，後加減。有括號的先算括號裡面的。這是運算的優先順序規則。",
      examples: [
        { question: "3 + 4 × 2 = ?", steps: ["先算乘法：4 × 2 = 8", "再算加法：3 + 8 = 11"], answer: "11" },
        { question: "(3 + 4) × 2 = ?", steps: ["先算括號：3 + 4 = 7", "再算乘法：7 × 2 = 14"], answer: "14" },
      ],
    },
  ],
  practices: [
    { question: "36 + 47 = ?", options: ["73", "83", "82", "84"], answer: 1, explanation: "個位 6+7=13，進位 1；十位 3+4+1=8，所以答案是 83。" },
    { question: "81 - 29 = ?", options: ["62", "52", "42", "58"], answer: 1, explanation: "個位 1 不夠減 9，借 1 得 11-9=2；十位 7-2=5，答案 52。" },
    { question: "7 × 8 = ?", options: ["54", "56", "48", "63"], answer: 1, explanation: "七八五十六，7 × 8 = 56。" },
    { question: "72 ÷ 9 = ?", options: ["7", "8", "9", "6"], answer: 1, explanation: "9 × 8 = 72，所以 72 ÷ 9 = 8。" },
    { question: "5 + 3 × 6 = ?", options: ["48", "23", "33", "38"], answer: 1, explanation: "先算乘法 3×6=18，再加 5，得 23。" },
    { question: "(8 - 3) × 4 = ?", options: ["17", "20", "32", "29"], answer: 1, explanation: "先算括號 8-3=5，再乘 4，得 20。" },
    { question: "125 + 376 = ?", options: ["491", "501", "511", "401"], answer: 1, explanation: "個位 5+6=11 進位；十位 2+7+1=10 進位；百位 1+3+1=5。答案 501。" },
    { question: "400 - 156 = ?", options: ["254", "244", "234", "344"], answer: 1, explanation: "400-156：借位計算，答案 244。" },
    { question: "12 × 5 = ?", options: ["55", "60", "65", "70"], answer: 1, explanation: "12×5 = 10×5 + 2×5 = 50 + 10 = 60。" },
    { question: "96 ÷ 8 = ?", options: ["11", "12", "13", "14"], answer: 1, explanation: "8×12 = 96，所以 96÷8 = 12。" },
    { question: "15 + 6 × 3 - 4 = ?", options: ["29", "33", "59", "25"], answer: 0, explanation: "先算 6×3=18，再算 15+18-4=29。" },
    { question: "100 - 45 + 23 = ?", options: ["68", "78", "32", "88"], answer: 1, explanation: "100-45=55，55+23=78。" },
    { question: "9 × 9 = ?", options: ["72", "81", "90", "63"], answer: 1, explanation: "九九八十一。" },
    { question: "144 ÷ 12 = ?", options: ["11", "12", "13", "14"], answer: 1, explanation: "12×12=144，所以 144÷12=12。" },
    { question: "(6 + 4) × (3 + 2) = ?", options: ["25", "50", "30", "45"], answer: 1, explanation: "先算兩個括號：10 × 5 = 50。" },
  ],
  challenge: {
    timeLimit: 60,
    generateProblem: () => {
      const ops = ["+", "-", "×"];
      const op = ops[Math.floor(Math.random() * ops.length)];
      let a: number, b: number, ans: number;
      if (op === "+") { a = 10 + Math.floor(Math.random() * 90); b = 10 + Math.floor(Math.random() * 90); ans = a + b; }
      else if (op === "-") { a = 20 + Math.floor(Math.random() * 80); b = 1 + Math.floor(Math.random() * a); ans = a - b; }
      else { a = 2 + Math.floor(Math.random() * 11); b = 2 + Math.floor(Math.random() * 11); ans = a * b; }
      return { question: `${a} ${op} ${b} = ?`, answer: ans };
    },
  },
};

export default topic;
