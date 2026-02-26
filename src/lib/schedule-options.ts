export interface ScheduleOption {
  subject: string;
  activityType: string;
  activityId: string;
  activityName: string;
  icon: string;
  href: string;
}

export interface ScheduleCategory {
  subject: string;
  label: string;
  icon: string;
  color: string;
  options: ScheduleOption[];
}

export const SCHEDULE_CATEGORIES: ScheduleCategory[] = [
  {
    subject: "gept", label: "全民英檢", icon: "📘", color: "blue",
    options: [
      { subject: "gept", activityType: "unit", activityId: "elementary", activityName: "初級學習", icon: "🌱", href: "/elementary" },
      { subject: "gept", activityType: "game", activityId: "elementary/game", activityName: "初級遊戲", icon: "🎮", href: "/elementary/game" },
      { subject: "gept", activityType: "mock-test", activityId: "elementary/mock-test", activityName: "初級模擬測驗", icon: "📝", href: "/elementary/mock-test" },
      { subject: "gept", activityType: "speaking", activityId: "elementary/speaking", activityName: "初級口說", icon: "🎙️", href: "/elementary/speaking" },
      { subject: "gept", activityType: "writing", activityId: "elementary/writing", activityName: "初級寫作", icon: "✍️", href: "/elementary/writing" },
      { subject: "gept", activityType: "unit", activityId: "intermediate", activityName: "中級學習", icon: "⚡", href: "/intermediate" },
      { subject: "gept", activityType: "game", activityId: "intermediate/game", activityName: "中級遊戲", icon: "🎮", href: "/intermediate/game" },
      { subject: "gept", activityType: "mock-test", activityId: "intermediate/mock-test", activityName: "中級模擬測驗", icon: "📝", href: "/intermediate/mock-test" },
      { subject: "gept", activityType: "unit", activityId: "upper-intermediate", activityName: "中高級學習", icon: "🔥", href: "/upper-intermediate" },
      { subject: "gept", activityType: "game", activityId: "upper-intermediate/game", activityName: "中高級遊戲", icon: "🎮", href: "/upper-intermediate/game" },
      { subject: "gept", activityType: "mock-test", activityId: "upper-intermediate/mock-test", activityName: "中高級模擬測驗", icon: "📝", href: "/upper-intermediate/mock-test" },
    ],
  },
  {
    subject: "jlpt", label: "日文檢定", icon: "🇯🇵", color: "red",
    options: [
      { subject: "jlpt", activityType: "unit", activityId: "jlpt-n5", activityName: "N5 學習", icon: "🌸", href: "/jlpt-n5" },
      { subject: "jlpt", activityType: "game", activityId: "jlpt-n5/game", activityName: "N5 遊戲", icon: "🎮", href: "/jlpt-n5/game" },
      { subject: "jlpt", activityType: "mock-test", activityId: "jlpt-n5/mock-test", activityName: "N5 模擬測驗", icon: "📝", href: "/jlpt-n5/mock-test" },
      { subject: "jlpt", activityType: "unit", activityId: "jlpt-n4", activityName: "N4 學習", icon: "🌸", href: "/jlpt-n4" },
      { subject: "jlpt", activityType: "mock-test", activityId: "jlpt-n4/mock-test", activityName: "N4 模擬測驗", icon: "📝", href: "/jlpt-n4/mock-test" },
      { subject: "jlpt", activityType: "unit", activityId: "jlpt-n3", activityName: "N3 學習", icon: "🌺", href: "/jlpt-n3" },
      { subject: "jlpt", activityType: "mock-test", activityId: "jlpt-n3/mock-test", activityName: "N3 模擬測驗", icon: "📝", href: "/jlpt-n3/mock-test" },
      { subject: "jlpt", activityType: "unit", activityId: "jlpt-n2", activityName: "N2 學習", icon: "🏯", href: "/jlpt-n2" },
      { subject: "jlpt", activityType: "mock-test", activityId: "jlpt-n2/mock-test", activityName: "N2 模擬測驗", icon: "📝", href: "/jlpt-n2/mock-test" },
      { subject: "jlpt", activityType: "unit", activityId: "jlpt-n1", activityName: "N1 學習", icon: "🗾", href: "/jlpt-n1" },
      { subject: "jlpt", activityType: "mock-test", activityId: "jlpt-n1/mock-test", activityName: "N1 模擬測驗", icon: "📝", href: "/jlpt-n1/mock-test" },
    ],
  },
  {
    subject: "board-game", label: "教育桌遊", icon: "🎲", color: "orange",
    options: [
      { subject: "board-game", activityType: "game", activityId: "pattern-master", activityName: "圖案大師", icon: "🧩", href: "/board-games/pattern-master" },
      { subject: "board-game", activityType: "game", activityId: "mini-sudoku", activityName: "迷你數獨", icon: "🔢", href: "/board-games/mini-sudoku" },
      { subject: "board-game", activityType: "game", activityId: "memory-match", activityName: "記憶翻牌", icon: "🃏", href: "/board-games/memory-match" },
      { subject: "board-game", activityType: "game", activityId: "math-rush", activityName: "數學衝刺", icon: "🧮", href: "/board-games/math-rush" },
      { subject: "board-game", activityType: "game", activityId: "word-chain", activityName: "接龍大師", icon: "🔗", href: "/board-games/word-chain" },
      { subject: "board-game", activityType: "game", activityId: "word-search", activityName: "單字搜尋", icon: "🔎", href: "/board-games/word-search" },
      { subject: "board-game", activityType: "game", activityId: "go-game", activityName: "圍棋", icon: "⚫", href: "/board-games/go-game" },
      { subject: "board-game", activityType: "game", activityId: "chinese-checkers", activityName: "跳棋", icon: "🔴", href: "/board-games/chinese-checkers" },
      { subject: "board-game", activityType: "game", activityId: "maze-runner", activityName: "迷宮探險", icon: "🏃", href: "/board-games/maze-runner" },
      { subject: "board-game", activityType: "game", activityId: "color-tap", activityName: "色彩快手", icon: "🎨", href: "/board-games/color-tap" },
    ],
  },
  {
    subject: "math", label: "數學練習", icon: "🔢", color: "amber",
    options: [
      { subject: "math", activityType: "challenge", activityId: "basic-arithmetic", activityName: "基礎運算", icon: "➕", href: "/math/basic-arithmetic" },
      { subject: "math", activityType: "challenge", activityId: "fractions", activityName: "分數", icon: "🍕", href: "/math/fractions" },
      { subject: "math", activityType: "challenge", activityId: "decimals", activityName: "小數", icon: "🔵", href: "/math/decimals" },
      { subject: "math", activityType: "challenge", activityId: "percentages", activityName: "百分比", icon: "💯", href: "/math/percentages" },
      { subject: "math", activityType: "challenge", activityId: "geometry", activityName: "幾何", icon: "📐", href: "/math/geometry" },
      { subject: "math", activityType: "challenge", activityId: "intro-algebra", activityName: "代數入門", icon: "🔤", href: "/math/intro-algebra" },
      { subject: "math", activityType: "challenge", activityId: "word-problems", activityName: "應用題", icon: "📖", href: "/math/word-problems" },
      { subject: "math", activityType: "challenge", activityId: "time-measurement", activityName: "時間與計量", icon: "⏰", href: "/math/time-measurement" },
    ],
  },
  {
    subject: "finance", label: "兒童理財", icon: "💰", color: "purple",
    options: [
      { subject: "finance", activityType: "module", activityId: "money-basics", activityName: "認識金錢", icon: "💵", href: "/finance/money-basics" },
      { subject: "finance", activityType: "module", activityId: "needs-vs-wants", activityName: "需要 vs 想要", icon: "🤔", href: "/finance/needs-vs-wants" },
      { subject: "finance", activityType: "module", activityId: "savings-calculator", activityName: "儲蓄計算機", icon: "🏦", href: "/finance/savings-calculator" },
      { subject: "finance", activityType: "module", activityId: "allowance-budget", activityName: "零用錢分配", icon: "📊", href: "/finance/allowance-budget" },
      { subject: "finance", activityType: "module", activityId: "red-envelope", activityName: "紅包理財", icon: "🧧", href: "/finance/red-envelope" },
      { subject: "finance", activityType: "module", activityId: "expense-tracker", activityName: "記帳小達人", icon: "📒", href: "/finance/expense-tracker" },
    ],
  },
  {
    subject: "typing", label: "打字練習", icon: "⌨️", color: "emerald",
    options: [
      { subject: "typing", activityType: "game", activityId: "typing-game", activityName: "打字練習", icon: "⌨️", href: "/typing-game" },
    ],
  },
];
