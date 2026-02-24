"use client";
import { usePathname } from "next/navigation";

const GEPT_PREFIXES = ["/elementary", "/intermediate", "/upper-intermediate"];

export default function MobileBottomNav() {
  const pathname = usePathname();

  // Check if we're in a GEPT level section
  const isGeptSection = GEPT_PREFIXES.some(p => pathname.startsWith(p));

  if (isGeptSection) {
    return <GeptNav pathname={pathname} />;
  }

  return <PlatformNav pathname={pathname} />;
}

function PlatformNav({ pathname }: { pathname: string }) {
  const items = [
    { href: "/", icon: "🏠", label: "首頁", match: pathname === "/" },
    { href: "/elementary", icon: "📘", label: "英檢", match: false },
    { href: "/how-to-use", icon: "📋", label: "說明", match: pathname === "/how-to-use" },
    { href: "/about", icon: "💡", label: "關於", match: pathname === "/about" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 safe-bottom">
      <div className="flex justify-around items-center h-14">
        {items.map(item => (
          <a key={item.href} href={item.href}
            className={`flex flex-col items-center gap-0.5 no-underline py-1 px-3 transition ${
              item.match ? "text-blue-600" : "text-slate-400 hover:text-blue-600"
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
              item.match ? "text-blue-600" : "text-slate-400 hover:text-blue-600"
            }`}>
            <span className="text-lg">{item.icon}</span>
            <span className="text-[10px] font-medium">{item.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}
