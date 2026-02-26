import type { MathTopic } from "../types";

const topic: MathTopic = {
  id: "time-measurement",
  title: "時間與計量",
  icon: "⏰",
  grade: "國小 1-4 年級",
  color: "from-pink-500 to-pink-600",
  border: "border-pink-200",
  concepts: [
    {
      title: "時間單位換算",
      explanation: "1 小時 = 60 分鐘，1 分鐘 = 60 秒，1 天 = 24 小時。要換算時間，記住這些基本倍數關係就可以了。",
      examples: [
        { question: "2 小時 30 分 = 幾分鐘？", steps: ["2 小時 = 2 × 60 = 120 分鐘", "120 + 30 = 150 分鐘"], answer: "150 分鐘" },
        { question: "180 分鐘 = 幾小時？", steps: ["180 ÷ 60 = 3 小時"], answer: "3 小時" },
      ],
    },
    {
      title: "長度與重量",
      explanation: "長度：1 公里 = 1000 公尺，1 公尺 = 100 公分，1 公分 = 10 公釐。重量：1 公斤 = 1000 公克。相鄰單位之間是 10、100 或 1000 的關係。",
      examples: [
        { question: "3.5 公里 = 幾公尺？", steps: ["1 公里 = 1000 公尺", "3.5 × 1000 = 3500 公尺"], answer: "3500 公尺" },
        { question: "2400 公克 = 幾公斤？", steps: ["1 公斤 = 1000 公克", "2400 ÷ 1000 = 2.4 公斤"], answer: "2.4 公斤" },
      ],
    },
    {
      title: "容量",
      explanation: "1 公升 = 1000 毫升。日常生活中，一瓶寶特瓶飲料大約 600 毫升，一個量杯通常是 200 或 250 毫升。",
      examples: [
        { question: "2.5 公升 = 幾毫升？", steps: ["1 公升 = 1000 毫升", "2.5 × 1000 = 2500 毫升"], answer: "2500 毫升" },
        { question: "750 毫升 = 幾公升？", steps: ["750 ÷ 1000 = 0.75 公升"], answer: "0.75 公升" },
      ],
    },
  ],
  practices: [
    { question: "3 小時 = 幾分鐘？", options: ["120", "180", "200", "300"], answer: 1, explanation: "3 × 60 = 180 分鐘。" },
    { question: "150 分鐘 = 幾小時幾分？", options: ["2 小時 10 分", "2 小時 30 分", "1 小時 50 分", "2 小時 50 分"], answer: 1, explanation: "150÷60 = 2 餘 30，即 2 小時 30 分。" },
    { question: "2 公里 = 幾公尺？", options: ["200", "2000", "20000", "20"], answer: 1, explanation: "2 × 1000 = 2000 公尺。" },
    { question: "350 公分 = 幾公尺？", options: ["35", "3.5", "0.35", "3500"], answer: 1, explanation: "350 ÷ 100 = 3.5 公尺。" },
    { question: "1.5 公斤 = 幾公克？", options: ["150", "15", "1500", "15000"], answer: 2, explanation: "1.5 × 1000 = 1500 公克。" },
    { question: "3000 毫升 = 幾公升？", options: ["30", "3", "0.3", "300"], answer: 1, explanation: "3000 ÷ 1000 = 3 公升。" },
    { question: "2 天 = 幾小時？", options: ["12", "24", "48", "36"], answer: 2, explanation: "2 × 24 = 48 小時。" },
    { question: "5 分鐘 = 幾秒？", options: ["50", "300", "500", "3000"], answer: 1, explanation: "5 × 60 = 300 秒。" },
    { question: "4500 公尺 = 幾公里？", options: ["45", "0.45", "4.5", "450"], answer: 2, explanation: "4500 ÷ 1000 = 4.5 公里。" },
    { question: "800 公克 = 幾公斤？", options: ["80", "0.8", "8", "0.08"], answer: 1, explanation: "800 ÷ 1000 = 0.8 公斤。" },
    { question: "1 小時 45 分 = 幾分鐘？", options: ["145", "105", "115", "85"], answer: 1, explanation: "60 + 45 = 105 分鐘。" },
    { question: "2.5 公升 = 幾毫升？", options: ["250", "25", "2500", "25000"], answer: 2, explanation: "2.5 × 1000 = 2500 毫升。" },
    { question: "72 小時 = 幾天？", options: ["2 天", "3 天", "4 天", "7.2 天"], answer: 1, explanation: "72 ÷ 24 = 3 天。" },
    { question: "1 公尺 25 公分 = 幾公分？", options: ["125", "1025", "1250", "12.5"], answer: 0, explanation: "100 + 25 = 125 公分。" },
    { question: "6.2 公里 = 幾公尺？", options: ["62", "620", "6200", "62000"], answer: 2, explanation: "6.2 × 1000 = 6200 公尺。" },
  ],
  challenge: {
    timeLimit: 60,
    generateProblem: () => {
      const type = Math.floor(Math.random() * 4);
      if (type === 0) {
        const h = 1 + Math.floor(Math.random() * 10);
        return { question: `${h} 小時 = 幾分鐘？`, answer: h * 60 };
      } else if (type === 1) {
        const km = 1 + Math.floor(Math.random() * 10);
        return { question: `${km} 公里 = 幾公尺？`, answer: km * 1000 };
      } else if (type === 2) {
        const kg = 1 + Math.floor(Math.random() * 9);
        return { question: `${kg} 公斤 = 幾公克？`, answer: kg * 1000 };
      } else {
        const l = 1 + Math.floor(Math.random() * 9);
        return { question: `${l} 公升 = 幾毫升？`, answer: l * 1000 };
      }
    },
  },
};

export default topic;
