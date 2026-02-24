export interface JlptVocabItem {
  ja: string;        // 日文（含漢字） e.g. "食べる"
  reading: string;   // 假名讀音 e.g. "たべる"
  zh: string;        // 中文翻譯 e.g. "吃"
  pos: string;       // 詞性 e.g. "動2", "名", "い形", "な形", "副"
  ex: string;        // 日文例句
  exZh: string;      // 例句中文翻譯
}

export interface JlptGrammarPoint {
  title: string;        // 文法標題 e.g. "～は～です"
  explain: string;      // 中文說明
  examples: string[];   // 日文例句
  examplesZh: string[]; // 例句中文對照
  tip: string;          // 學習提示
}

export interface JlptListenQ {
  text: string;     // 日文聽力文本
  opts: string[];   // 選項
  ans: number;      // 正確答案 index
  zh: string;       // 題目中文提示
}

export interface JlptReadingSection {
  passage: string;  // 日文閱讀文章
  questions: { q: string; opts: string[]; ans: number }[];
}

export interface JlptQuizQ {
  s: string;        // 題幹（日文）
  opts: string[];   // 選項
  ans: number;      // 正確答案 index
}

export interface JlptUnit {
  id: number;
  title: string;      // 中文標題
  titleJa: string;    // 日文標題
  icon: string;
  color: string;
  vocab: JlptVocabItem[];
  grammar: JlptGrammarPoint[];
  listening: JlptListenQ[];
  reading: JlptReadingSection | JlptReadingSection[];
  quiz: JlptQuizQ[];
}
