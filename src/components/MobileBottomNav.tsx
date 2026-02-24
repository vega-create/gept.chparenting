"use client";
import { usePathname } from "next/navigation";

export default function MobileBottomNav() {
  const pathname = usePathname();

  // Determine current level base path
  let base = "/elementary"; // default
  if (pathname.startsWith("/intermediate")) base = "/intermediate";
  else if (pathname.startsWith("/upper-intermediate")) base = "/upper-intermediate";

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 safe-bottom">
      <div className="flex justify-around items-center h-14">
        <a href="/" className={`flex flex-col items-center gap-0.5 no-underline py-1 px-3 transition ${pathname === "/" ? "text-blue-600" : "text-slate-400 hover:text-blue-600"}`}>
          <span className="text-lg">🏠</span>
          <span className="text-[10px] font-medium">首頁</span>
        </a>
        <a href={base} className={`flex flex-col items-center gap-0.5 no-underline py-1 px-3 transition ${pathname === base ? "text-blue-600" : "text-slate-400 hover:text-blue-600"}`}>
          <span className="text-lg">📖</span>
          <span className="text-[10px] font-medium">學習</span>
        </a>
        <a href={`${base}/speaking`} className={`flex flex-col items-center gap-0.5 no-underline py-1 px-3 transition ${pathname.includes("/speaking") ? "text-blue-600" : "text-slate-400 hover:text-blue-600"}`}>
          <span className="text-lg">🎙️</span>
          <span className="text-[10px] font-medium">口說</span>
        </a>
        <a href={`${base}/game`} className={`flex flex-col items-center gap-0.5 no-underline py-1 px-3 transition ${pathname.includes("/game") ? "text-blue-600" : "text-slate-400 hover:text-blue-600"}`}>
          <span className="text-lg">🎮</span>
          <span className="text-[10px] font-medium">遊戲</span>
        </a>
        <a href={`${base}/mock-test`} className={`flex flex-col items-center gap-0.5 no-underline py-1 px-3 transition ${pathname.includes("/mock-test") ? "text-blue-600" : "text-slate-400 hover:text-blue-600"}`}>
          <span className="text-lg">📝</span>
          <span className="text-[10px] font-medium">測驗</span>
        </a>
      </div>
    </nav>
  );
}
