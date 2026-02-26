"use client";
import { usePathname } from "next/navigation";
import { useState } from "react";

const GEPT_PREFIXES = ["/elementary", "/intermediate", "/upper-intermediate"];
const JLPT_PREFIXES = ["/jlpt-n5", "/jlpt-n4", "/jlpt-n3", "/jlpt-n2", "/jlpt-n1"];
const BOARD_GAME_PREFIX = "/board-games";
const MATH_PREFIX = "/math";
const FINANCE_PREFIX = "/finance";
const DASHBOARD_PREFIX = "/dashboard";

export default function MobileBottomNav() {
  const pathname = usePathname();

  // Check if we're in a GEPT level section
  const isGeptSection = GEPT_PREFIXES.some(p => pathname.startsWith(p));
  const isJlptSection = JLPT_PREFIXES.some(p => pathname.startsWith(p));
  const isBoardGameSection = pathname.startsWith(BOARD_GAME_PREFIX);
  const isMathSection = pathname.startsWith(MATH_PREFIX);
  const isFinanceSection = pathname.startsWith(FINANCE_PREFIX);
  const isDashboardSection = pathname.startsWith(DASHBOARD_PREFIX);

  if (isDashboardSection) {
    return <DashboardNav pathname={pathname} />;
  }

  if (isGeptSection) {
    return <GeptNav pathname={pathname} />;
  }

  if (isJlptSection) {
    return <JlptNav pathname={pathname} />;
  }

  if (isBoardGameSection) {
    return <BoardGameNav pathname={pathname} />;
  }

  if (isMathSection) {
    return <MathNav pathname={pathname} />;
  }

  if (isFinanceSection) {
    return <FinanceNav pathname={pathname} />;
  }

  return <PlatformNav pathname={pathname} />;
}

function PlatformNav({ pathname }: { pathname: string }) {
  const [moreOpen, setMoreOpen] = useState(false);

  const items = [
    { href: "/", icon: "🏠", label: "首頁", match: pathname === "/" },
    { href: "/elementary", icon: "📘", label: "英檢", match: false },
    { href: "/jlpt-n5", icon: "🇯🇵", label: "日文", match: false },
    { href: "/board-games", icon: "🎲", label: "桌遊", match: false },
  ];

  const moreItems = [
    { href: "/math", icon: "🔢", label: "數學練習" },
    { href: "/finance", icon: "💰", label: "兒童理財" },
    { href: "/typing-game", icon: "⌨️", label: "打字練習" },
    { href: "/how-to-use", icon: "📋", label: "使用說明" },
    { href: "/faq", icon: "❓", label: "常見問題" },
    { href: "/about", icon: "💕", label: "關於我們" },
  ];

  const isMoreActive = moreItems.some(m => pathname === m.href || pathname.startsWith(m.href + "/"));

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 safe-bottom">
      {/* More menu popup */}
      {moreOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/30" onClick={() => setMoreOpen(false)} />
          <div className="absolute bottom-full left-0 right-0 z-50 bg-white border-t border-slate-200 rounded-t-2xl shadow-lg px-4 py-4">
            <div className="grid grid-cols-3 gap-3">
              {moreItems.map(item => (
                <a key={item.href} href={item.href}
                  className={`flex flex-col items-center gap-1 no-underline py-3 px-2 rounded-xl transition ${
                    pathname === item.href || pathname.startsWith(item.href + "/")
                      ? "text-rose-400 bg-rose-50"
                      : "text-slate-500 hover:bg-slate-50"
                  }`}>
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-xs font-medium">{item.label}</span>
                </a>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="flex justify-around items-center h-14">
        {items.map(item => (
          <a key={item.href} href={item.href}
            className={`flex flex-col items-center gap-0.5 no-underline py-1 px-3 transition ${
              item.match ? "text-rose-400" : "text-slate-400 hover:text-rose-400"
            }`}>
            <span className="text-lg">{item.icon}</span>
            <span className="text-[10px] font-medium">{item.label}</span>
          </a>
        ))}
        {/* More button */}
        <button
          onClick={() => setMoreOpen(!moreOpen)}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 transition bg-transparent border-0 cursor-pointer ${
            moreOpen || isMoreActive ? "text-rose-400" : "text-slate-400"
          }`}>
          <span className="text-lg">⋯</span>
          <span className="text-[10px] font-medium">更多</span>
        </button>
      </div>
    </nav>
  );
}

function JlptNav({ pathname }: { pathname: string }) {
  let base = "/jlpt-n5";
  if (pathname.startsWith("/jlpt-n4")) base = "/jlpt-n4";
  else if (pathname.startsWith("/jlpt-n3")) base = "/jlpt-n3";
  else if (pathname.startsWith("/jlpt-n2")) base = "/jlpt-n2";
  else if (pathname.startsWith("/jlpt-n1")) base = "/jlpt-n1";

  const items = [
    { href: "/", icon: "🏠", label: "首頁", match: false },
    { href: base, icon: "📖", label: "學習", match: pathname === base },
    { href: `${base}/speaking`, icon: "🎙️", label: "口說", match: pathname.includes("/speaking") },
    { href: `${base}/game`, icon: "🎮", label: "遊戲", match: pathname.includes("/game") },
    { href: `${base}/mock-test`, icon: "📝", label: "測驗", match: pathname.includes("/mock-test") },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 safe-bottom">
      <div className="flex justify-around items-center h-14">
        {items.map(item => (
          <a key={item.href} href={item.href}
            className={`flex flex-col items-center gap-0.5 no-underline py-1 px-3 transition ${
              item.match ? "text-red-500" : "text-slate-400 hover:text-red-500"
            }`}>
            <span className="text-lg">{item.icon}</span>
            <span className="text-[10px] font-medium">{item.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}

function BoardGameNav({ pathname }: { pathname: string }) {
  const items = [
    { href: "/", icon: "🏠", label: "首頁", match: false },
    { href: "/board-games", icon: "🎲", label: "桌遊", match: pathname === "/board-games" },
    { href: "/board-games/memory-match", icon: "🧠", label: "記憶", match: pathname.includes("/memory") },
    { href: "/board-games/code-path", icon: "💻", label: "程式", match: pathname.includes("/code-path") || pathname.includes("/logic-gates") || pathname.includes("/loop-builder") },
    { href: "/board-games/pattern-master", icon: "🧩", label: "邏輯", match: pathname.includes("/pattern") || pathname.includes("/sudoku") || pathname.includes("/sequence") },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 safe-bottom">
      <div className="flex justify-around items-center h-14">
        {items.map(item => (
          <a key={item.href} href={item.href}
            className={`flex flex-col items-center gap-0.5 no-underline py-1 px-3 transition ${
              item.match ? "text-orange-500" : "text-slate-400 hover:text-orange-500"
            }`}>
            <span className="text-lg">{item.icon}</span>
            <span className="text-[10px] font-medium">{item.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}

function MathNav({ pathname }: { pathname: string }) {
  const items = [
    { href: "/", icon: "🏠", label: "首頁", match: false },
    { href: "/math", icon: "🔢", label: "數學", match: pathname === "/math" },
    { href: "/math/basic-arithmetic", icon: "➕", label: "運算", match: pathname.includes("/basic-arithmetic") },
    { href: "/math/geometry", icon: "📐", label: "幾何", match: pathname.includes("/geometry") },
    { href: "/math/word-problems", icon: "📖", label: "應用", match: pathname.includes("/word-problems") },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 safe-bottom">
      <div className="flex justify-around items-center h-14">
        {items.map(item => (
          <a key={item.href} href={item.href}
            className={`flex flex-col items-center gap-0.5 no-underline py-1 px-3 transition ${
              item.match ? "text-amber-600" : "text-slate-400 hover:text-amber-600"
            }`}>
            <span className="text-lg">{item.icon}</span>
            <span className="text-[10px] font-medium">{item.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}

function FinanceNav({ pathname }: { pathname: string }) {
  const items = [
    { href: "/", icon: "🏠", label: "首頁", match: false },
    { href: "/finance", icon: "💰", label: "理財", match: pathname === "/finance" },
    { href: "/finance/money-basics", icon: "📖", label: "觀念", match: pathname.includes("/money-basics") },
    { href: "/finance/savings-calculator", icon: "🏦", label: "儲蓄", match: pathname.includes("/savings") || pathname.includes("/red-envelope") },
    { href: "/finance/allowance-budget", icon: "📊", label: "預算", match: pathname.includes("/allowance") || pathname.includes("/expense") },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 safe-bottom">
      <div className="flex justify-around items-center h-14">
        {items.map(item => (
          <a key={item.href} href={item.href}
            className={`flex flex-col items-center gap-0.5 no-underline py-1 px-3 transition ${
              item.match ? "text-purple-600" : "text-slate-400 hover:text-purple-600"
            }`}>
            <span className="text-lg">{item.icon}</span>
            <span className="text-[10px] font-medium">{item.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}

function DashboardNav({ pathname }: { pathname: string }) {
  const items = [
    { href: "/", icon: "🏠", label: "首頁", match: false },
    { href: "/dashboard", icon: "📊", label: "總覽", match: pathname === "/dashboard" },
    { href: "/dashboard/schedule", icon: "📋", label: "計畫", match: pathname.includes("/schedule") },
    { href: "/dashboard/records", icon: "📈", label: "紀錄", match: pathname.includes("/records") },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 safe-bottom">
      <div className="flex justify-around items-center h-14">
        {items.map(item => (
          <a key={item.href} href={item.href}
            className={`flex flex-col items-center gap-0.5 no-underline py-1 px-3 transition ${
              item.match ? "text-rose-400" : "text-slate-400 hover:text-rose-400"
            }`}>
            <span className="text-lg">{item.icon}</span>
            <span className="text-[10px] font-medium">{item.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}

function GeptNav({ pathname }: { pathname: string }) {
  // Determine current level base path
  let base = "/elementary";
  if (pathname.startsWith("/upper-intermediate")) base = "/upper-intermediate";
  else if (pathname.startsWith("/intermediate")) base = "/intermediate";

  const items = [
    { href: "/", icon: "🏠", label: "首頁", match: false },
    { href: base, icon: "📖", label: "學習", match: pathname === base },
    { href: `${base}/speaking`, icon: "🎙️", label: "口說", match: pathname.includes("/speaking") },
    { href: `${base}/game`, icon: "🎮", label: "遊戲", match: pathname.includes("/game") },
    { href: `${base}/mock-test`, icon: "📝", label: "測驗", match: pathname.includes("/mock-test") },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 safe-bottom">
      <div className="flex justify-around items-center h-14">
        {items.map(item => (
          <a key={item.href} href={item.href}
            className={`flex flex-col items-center gap-0.5 no-underline py-1 px-3 transition ${
              item.match ? "text-rose-400" : "text-slate-400 hover:text-rose-400"
            }`}>
            <span className="text-lg">{item.icon}</span>
            <span className="text-[10px] font-medium">{item.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}
