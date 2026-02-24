"use client";
import { useState, useEffect } from "react";

const STEPS = [
  {
    icon: "👋",
    title: "歡迎來到親子多元學習平台",
    description: "這是一個完全免費的學習平台，專為親子設計，讓孩子用有趣的方式學習。",
  },
  {
    icon: "📘",
    title: "選擇學習工具",
    description: "目前提供全民英檢學習（初級・中級・中高級），更多工具即將推出！",
  },
  {
    icon: "📖",
    title: "開始學習",
    description: "每個單元按照 單字 → 文法 → 聽力 → 閱讀 → 測驗 的順序學習效果最好。",
  },
  {
    icon: "🎮",
    title: "遊戲 + 測驗",
    description: "學完後到遊戲區邊玩邊記，再用模擬測驗檢驗學習成果！",
  },
];

const STORAGE_KEY = "onboarding_completed";

export default function OnboardingTutorial() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Only show on first visit
    if (typeof window !== "undefined" && !localStorage.getItem(STORAGE_KEY)) {
      // Small delay for smoother experience
      const timer = setTimeout(() => setShow(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setShow(false);
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      handleClose();
    }
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  if (!show) return null;

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden animate-slideUp">
        {/* Skip button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-transparent border-0 cursor-pointer text-sm font-medium z-10"
        >
          略過
        </button>

        {/* Content */}
        <div className="p-8 text-center">
          <div className="text-5xl mb-4">{current.icon}</div>
          <h2 className="text-xl font-bold text-slate-800 mb-3">{current.title}</h2>
          <p className="text-slate-600 text-sm leading-6">{current.description}</p>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 pb-4">
          {STEPS.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`w-2 h-2 rounded-full border-0 cursor-pointer transition-all ${
                i === step ? "bg-blue-600 w-6" : "bg-slate-200"
              }`}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-3 p-4 pt-0">
          {step > 0 && (
            <button
              onClick={handlePrev}
              className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-600 font-semibold border-0 cursor-pointer hover:bg-slate-200 transition text-sm"
            >
              上一步
            </button>
          )}
          <button
            onClick={handleNext}
            className={`flex-1 py-3 rounded-xl bg-blue-600 text-white font-semibold border-0 cursor-pointer hover:bg-blue-700 transition text-sm ${
              step === 0 ? "w-full" : ""
            }`}
          >
            {isLast ? "開始學習 🚀" : "下一步"}
          </button>
        </div>
      </div>
    </div>
  );
}
