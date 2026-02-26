import type { MathTopic } from "../types";

const topic: MathTopic = {
  id: "geometry",
  title: "幾何",
  icon: "📐",
  grade: "國小 3-6 年級",
  color: "from-emerald-500 to-emerald-600",
  border: "border-emerald-200",
  concepts: [
    {
      title: "周長",
      explanation: "周長是圖形外圍一圈的總長度。長方形周長 = (長 + 寬) × 2，正方形周長 = 邊長 × 4。",
      examples: [
        { question: "長方形長 8 公分、寬 5 公分，求周長。", steps: ["周長 = (長 + 寬) × 2", "= (8 + 5) × 2", "= 13 × 2 = 26"], answer: "26 公分" },
        { question: "正方形邊長 6 公分，求周長。", steps: ["周長 = 邊長 × 4", "= 6 × 4 = 24"], answer: "24 公分" },
      ],
    },
    {
      title: "面積",
      explanation: "面積是圖形佔的平面大小。長方形面積 = 長 × 寬，三角形面積 = 底 × 高 ÷ 2。",
      examples: [
        { question: "長方形長 10，寬 4，求面積。", steps: ["面積 = 長 × 寬", "= 10 × 4 = 40"], answer: "40 平方公分" },
        { question: "三角形底 6，高 8，求面積。", steps: ["面積 = 底 × 高 ÷ 2", "= 6 × 8 ÷ 2 = 24"], answer: "24 平方公分" },
      ],
    },
    {
      title: "圓的周長和面積",
      explanation: "圓周長 = 直徑 × π（大約 3.14），也就是 2 × 半徑 × π。圓面積 = 半徑 × 半徑 × π。",
      examples: [
        { question: "半徑 7 公分的圓，周長約多少？", steps: ["周長 = 2 × r × π", "= 2 × 7 × 3.14", "= 43.96"], answer: "約 43.96 公分" },
        { question: "半徑 5 公分的圓，面積約多少？", steps: ["面積 = r × r × π", "= 5 × 5 × 3.14", "= 78.5"], answer: "約 78.5 平方公分" },
      ],
    },
  ],
  practices: [
    { question: "正方形邊長 9，周長 = ?", options: ["27", "36", "81", "18"], answer: 1, explanation: "9 × 4 = 36。" },
    { question: "長方形長 12 寬 5，周長 = ?", options: ["34", "60", "17", "24"], answer: 0, explanation: "(12+5)×2 = 34。" },
    { question: "長方形長 7 寬 3，面積 = ?", options: ["10", "20", "21", "24"], answer: 2, explanation: "7 × 3 = 21。" },
    { question: "正方形邊長 8，面積 = ?", options: ["32", "16", "64", "24"], answer: 2, explanation: "8 × 8 = 64。" },
    { question: "三角形底 10 高 6，面積 = ?", options: ["60", "30", "16", "36"], answer: 1, explanation: "10×6÷2 = 30。" },
    { question: "三角形底 12 高 5，面積 = ?", options: ["17", "60", "30", "35"], answer: 2, explanation: "12×5÷2 = 30。" },
    { question: "半徑 10 的圓，周長約 = ?", options: ["31.4", "62.8", "314", "628"], answer: 1, explanation: "2×10×3.14 = 62.8。" },
    { question: "直徑 8 的圓，周長約 = ?", options: ["12.56", "25.12", "50.24", "8"], answer: 1, explanation: "8×3.14 = 25.12。" },
    { question: "半徑 3 的圓，面積約 = ?", options: ["9.42", "18.84", "28.26", "6.28"], answer: 2, explanation: "3×3×3.14 = 28.26。" },
    { question: "長方形長 15 寬 8，面積 = ?", options: ["120", "46", "23", "60"], answer: 0, explanation: "15 × 8 = 120。" },
    { question: "周長 20 的正方形，邊長 = ?", options: ["4", "5", "10", "80"], answer: 1, explanation: "20÷4 = 5。" },
    { question: "面積 36 的正方形，邊長 = ?", options: ["9", "6", "12", "18"], answer: 1, explanation: "√36 = 6。" },
    { question: "梯形上底 4 下底 8 高 5，面積 = ?", options: ["30", "20", "60", "40"], answer: 0, explanation: "(4+8)×5÷2 = 30。" },
    { question: "平行四邊形底 9 高 4，面積 = ?", options: ["13", "36", "26", "18"], answer: 1, explanation: "9 × 4 = 36。" },
    { question: "半徑 4 的圓，面積約 = ?", options: ["25.12", "50.24", "12.56", "100.48"], answer: 1, explanation: "4×4×3.14 = 50.24。" },
  ],
  challenge: {
    timeLimit: 60,
    generateProblem: () => {
      const type = Math.floor(Math.random() * 3);
      if (type === 0) {
        const l = 3 + Math.floor(Math.random() * 15);
        const w = 2 + Math.floor(Math.random() * 10);
        return { question: `長方形長 ${l} 寬 ${w}，面積 = ?`, answer: l * w };
      } else if (type === 1) {
        const s = 2 + Math.floor(Math.random() * 12);
        return { question: `正方形邊長 ${s}，周長 = ?`, answer: s * 4 };
      } else {
        const b = 4 + Math.floor(Math.random() * 12);
        const h = 2 + Math.floor(Math.random() * 10);
        return { question: `三角形底 ${b} 高 ${h}，面積 = ?（如有小數取整）`, answer: Math.floor(b * h / 2) };
      }
    },
  },
};

export default topic;
