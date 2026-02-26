import type { RedEnvelopeScenario } from "../types";

export const scenarios: RedEnvelopeScenario[] = [
  {
    title: "🧧 過年紅包 — 基本款",
    amount: 600,
    description: "阿公阿嬤給了你 600 元的紅包。你會怎麼分配這筆錢呢？",
    suggestedSplit: { savings: 300, spending: 200, sharing: 100 },
  },
  {
    title: "🧧 過年紅包 — 大紅包",
    amount: 2000,
    description: "今年過年收到了一個 2000 元的大紅包！好開心～這筆錢要怎麼運用呢？",
    suggestedSplit: { savings: 1200, spending: 600, sharing: 200 },
  },
  {
    title: "🎂 生日禮金",
    amount: 500,
    description: "叔叔阿姨來參加你的生日會，送了你 500 元。你打算怎麼用？",
    suggestedSplit: { savings: 200, spending: 200, sharing: 100 },
  },
  {
    title: "🏆 比賽獎金",
    amount: 1000,
    description: "你在學校比賽得了第一名，拿到 1000 元獎金！恭喜！你要怎麼分配？",
    suggestedSplit: { savings: 500, spending: 300, sharing: 200 },
  },
  {
    title: "🧧 中秋節紅包",
    amount: 800,
    description: "中秋節收到了 800 元的紅包。你會存起來、花掉、還是分享呢？",
    suggestedSplit: { savings: 400, spending: 300, sharing: 100 },
  },
  {
    title: "💼 做家事獎勵",
    amount: 300,
    description: "幫忙做了一個月的家事，爸媽給了 300 元獎勵金。你打算怎麼用？",
    suggestedSplit: { savings: 150, spending: 100, sharing: 50 },
  },
  {
    title: "🎊 畢業禮金",
    amount: 3000,
    description: "小學畢業了！家人一共給了 3000 元畢業禮金。這是一筆大數目呢！",
    suggestedSplit: { savings: 2000, spending: 700, sharing: 300 },
  },
  {
    title: "🍀 抽獎得獎",
    amount: 200,
    description: "在學校園遊會抽到了 200 元的獎金！好幸運！你會怎麼用？",
    suggestedSplit: { savings: 100, spending: 50, sharing: 50 },
  },
];
