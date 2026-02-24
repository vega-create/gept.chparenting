export default function Footer() {
  return (
    <footer className="bg-slate-50 border-t border-slate-200 py-8 mt-12 hidden md:block">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <div className="flex justify-center gap-6 text-sm text-slate-500 mb-4 flex-wrap">
          <a href="/elementary" className="hover:text-blue-600 transition">初級英檢</a>
          <a href="/intermediate" className="hover:text-blue-600 transition">中級英檢</a>
          <a href="/upper-intermediate" className="hover:text-blue-600 transition">中高級英檢</a>
          <a href="/jlpt-n5" className="hover:text-red-500 transition">JLPT N5</a>
          <a href="/typing-game" className="hover:text-blue-600 transition">打字練習</a>
          <a href="/how-to-use" className="hover:text-blue-600 transition">使用說明</a>
          <a href="/faq" className="hover:text-blue-600 transition">常見問題</a>
          <a href="/about" className="hover:text-blue-600 transition">關於我們</a>
        </div>
        <p className="text-sm text-slate-400">
          © 2026 親子多元學習平台 — 由{" "}
          <a href="https://aimommywisdom.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
            智慧媽咪國際有限公司 Mommy Wisdom International LTD.
          </a>{" "}
          製作
        </p>
        <p className="text-xs text-slate-400 mt-1">本站為免費學習資源平台</p>
      </div>
    </footer>
  );
}
