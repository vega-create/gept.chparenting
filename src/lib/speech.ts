// Shared speech synthesis utilities for all learning tools
export const speak = (text: string, rate = 0.85, lang = "en-US") => {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  u.rate = rate;
  window.speechSynthesis.speak(u);
};

export const speakJa = (text: string, rate = 0.85) => speak(text, rate, "ja-JP");
export const speakEn = (text: string, rate = 0.85) => speak(text, rate, "en-US");

export const stopSpeaking = () => {
  if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
};

export const pauseSpeaking = () => {
  if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.pause();
};

export const resumeSpeaking = () => {
  if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.resume();
};
