"use client";
import { useState } from "react";

const FAQ_ITEMS = [
  {
    q: "這個平台完全免費嗎？",
    a: "是的！所有功能都完全免費，不會有任何隱藏收費。我們希望讓每個家庭都能使用優質的學習資源，不需要花補習費。",
  },
  {
    q: "需要註冊才能使用嗎？",
    a: "目前所有學習功能都不需要註冊，直接開始學習就好！未來會推出帳號系統，讓你可以追蹤學習進度和紀錄成績。",
  },
  {
    q: "適合什麼年齡的學生？",
    a: "英檢初級適合國中生（12-15 歲），中級適合高中生（15-18 歲），中高級適合大學生或成人。日文 JLPT N5 適合入門學習者，N4～N1 適合進階到高級學習者。教育桌遊適合 6-15 歲兒童，打字練習則適合所有年齡。依照自己的程度選擇即可！",
  },
  {
    q: "平台上有哪些學習內容？",
    a: "目前提供五大學習工具：① 全民英檢（94 個單元，涵蓋 8,000+ 單字，初級・中級・中高級完整聽說讀寫練習）；② JLPT 日文檢定（N5～N1 全 5 個級別，每級 20 單元共 100 單元，涵蓋單字、文法、聽力、閱讀、遊戲、模擬測驗、口說與寫作練習）；③ 教育桌遊（16 款遊戲，包含邏輯、程式概念、記憶力、反應力、數學、語言等類別）；④ 打字練習（中英雙語打字訓練）；⑤ 數學和兒童理財工具即將推出。",
  },
  {
    q: "可以在手機上使用嗎？",
    a: "可以！本平台支援手機、平板、電腦等各種裝置。我們針對手機做了特別優化，底部有專用導航列，使用起來就像 App 一樣方便。",
  },
  {
    q: "內容會更新嗎？",
    a: "會！我們持續在新增內容和改善功能。目前英檢、日文 N5～N1、教育桌遊和打字練習都已上線，數學練習和兒童理財工具正在開發中，敬請期待！",
  },
  {
    q: "如何回報問題或建議？",
    a: "歡迎透過我們的官網 aimommywisdom.com 聯繫我們。不管是功能建議、錯誤回報，還是想說聲加油，我們都非常歡迎！",
  },
  {
    q: "日文 JLPT 學習工具有什麼功能？",
    a: "JLPT N5～N1 全 5 個級別已全部上線！每個級別各有 20 個學習單元，涵蓋單字（附例句）、文法解說、聽力練習、閱讀理解和綜合測驗。N5 還有五十音互動教學。每個級別都提供 5 種遊戲模式、模擬測驗、口說練習和寫作練習（句子重組、中翻日、引導式寫作）。",
  },
  {
    q: "教育桌遊有哪些遊戲？",
    a: "教育桌遊專區共有 16 款遊戲，分為 7 大類：邏輯開發（圖案大師、迷你數獨、數列探險）、程式概念（程式路徑、邏輯閘門、迴圈建造師）、記憶力（記憶翻牌、記憶旋律）、反應力（色彩快手、打地鼠）、數學挑戰（數學衝刺、快速排序）、語言探索（接龍大師、單字搜尋）、解謎冒險（迷宮探險、表情密碼）。",
  },
  {
    q: "數學練習工具什麼時候上線？",
    a: "獨立的數學練習工具正在開發中，目前你可以先到教育桌遊專區體驗「數學衝刺」（60 秒限時計算挑戰，分初級、中級、高級三個難度）和「快速排序」等數學相關遊戲！",
  },
  {
    q: "兒童理財工具什麼時候上線？",
    a: "兒童理財學習工具正在規劃開發中，預計會包含預算分配、存錢挑戰、慾望 vs 需要等互動模組，讓孩子從小培養正確的金錢觀念。你可以訂閱電子報，新功能上線時我們會第一時間通知你！",
  },
  {
    q: "這個平台和官方全民英檢有關嗎？",
    a: "沒有，本平台是獨立的免費學習資源，與 LTTC 財團法人語言訓練測驗中心（全民英檢官方機構）無關。我們只是提供輔助練習工具。",
  },
  {
    q: "可以離線使用嗎？",
    a: "目前需要網路連線才能使用。部分功能（如電子書瀏覽）在載入後可以在短暫斷線時繼續使用，但完整功能建議在有網路的環境下操作。",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map(item => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

      <div className="text-center mb-10">
        <div className="text-5xl mb-3">❓</div>
        <h1 className="text-3xl font-black text-slate-800 mb-2">常見問題</h1>
        <p className="text-slate-500">關於親子多元學習平台的常見問題</p>
      </div>

      <div className="space-y-3">
        {FAQ_ITEMS.map((item, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full text-left p-6 flex items-center justify-between bg-transparent border-0 cursor-pointer"
            >
              <span className="font-bold text-slate-800 pr-4">{item.q}</span>
              <span className="text-slate-400 text-xl shrink-0">{openIndex === i ? "−" : "+"}</span>
            </button>
            {openIndex === i && (
              <div className="px-6 pb-6 text-slate-600 leading-7 border-t border-slate-100 pt-4">
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <p className="text-slate-500 mb-3">還有其他問題？</p>
        <a href="https://aimommywisdom.com" target="_blank" rel="noopener noreferrer"
          className="inline-block px-6 py-2.5 bg-blue-600 text-white rounded-xl font-semibold text-sm hover:bg-blue-700 transition no-underline">
          聯繫我們 →
        </a>
      </div>
    </div>
  );
}
