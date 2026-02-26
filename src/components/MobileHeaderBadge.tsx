"use client";
import { usePathname } from "next/navigation";
import { useState } from "react";

const GEPT_LEVELS = [
  { prefix: "/upper-intermediate", label: "🔥 中高級", href: "/upper-intermediate", color: "text-purple-600" },
  { prefix: "/intermediate", label: "⚡ 中級", href: "/intermediate", color: "text-emerald-600" },
  { prefix: "/elementary", label: "🌱 初級", href: "/elementary", color: "text-rose-400" },
];

const JLPT_LEVELS = [
  { prefix: "/jlpt-n1", label: "N1 最上級", href: "/jlpt-n1", color: "text-red-600" },
  { prefix: "/jlpt-n2", label: "N2 上級", href: "/jlpt-n2", color: "text-red-500" },
  { prefix: "/jlpt-n3", label: "N3 中級", href: "/jlpt-n3", color: "text-red-500" },
  { prefix: "/jlpt-n4", label: "N4 基礎", href: "/jlpt-n4", color: "text-red-400" },
  { prefix: "/jlpt-n5", label: "N5 入門", href: "/jlpt-n5", color: "text-red-400" },
];

type SectionConfig = {
  match: (p: string) => boolean;
  icon: string;
  label: string;
  color: string;
  levels?: typeof GEPT_LEVELS;
};

const SECTIONS: SectionConfig[] = [
  {
    match: (p) => ["/elementary", "/intermediate", "/upper-intermediate"].some(x => p.startsWith(x)),
    icon: "📘", label: "英檢", color: "text-rose-400",
    levels: GEPT_LEVELS,
  },
  {
    match: (p) => p.startsWith("/jlpt"),
    icon: "🇯🇵", label: "日文", color: "text-red-500",
    levels: JLPT_LEVELS,
  },
  {
    match: (p) => p.startsWith("/board-games"),
    icon: "🎲", label: "桌遊", color: "text-orange-500",
  },
  {
    match: (p) => p.startsWith("/math"),
    icon: "🔢", label: "數學", color: "text-amber-600",
  },
  {
    match: (p) => p.startsWith("/finance"),
    icon: "💰", label: "理財", color: "text-purple-600",
  },
  {
    match: (p) => p.startsWith("/typing-game"),
    icon: "⌨️", label: "打字", color: "text-cyan-600",
  },
];

export default function MobileHeaderBadge() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const currentSection = SECTIONS.find(s => s.match(pathname));

  // Inside a section with levels (GEPT/JLPT) → show current level + dropdown to switch
  if (currentSection?.levels) {
    const currentLevel = currentSection.levels.find(l => pathname.startsWith(l.prefix));
    const displayLabel = currentLevel ? currentLevel.label : currentSection.label;
    const displayColor = currentLevel ? currentLevel.color : currentSection.color;

    return (
      <div className="md:hidden relative">
        <button onClick={() => setOpen(!open)}
          className={`text-sm font-semibold bg-transparent border-0 cursor-pointer flex items-center gap-1 ${displayColor}`}>
          {currentSection.icon} {displayLabel} <span className="text-xs text-slate-400">▾</span>
        </button>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden min-w-[140px]">
              {currentSection.levels.map(l => (
                <a key={l.prefix} href={l.href}
                  className={`block px-4 py-2.5 text-sm font-medium no-underline transition ${
                    pathname.startsWith(l.prefix) ? `${l.color} bg-slate-50 font-bold` : `${l.color} hover:bg-slate-50`
                  }`}>
                  {l.label}
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  // Inside a section without levels → show section badge
  if (currentSection) {
    return (
      <span className={`md:hidden text-sm font-semibold ${currentSection.color}`}>
        {currentSection.icon} {currentSection.label}
      </span>
    );
  }

  // On home/about/generic pages → show quick section switcher
  return (
    <div className="md:hidden relative">
      <button onClick={() => setOpen(!open)}
        className="text-sm text-slate-600 font-semibold bg-transparent border border-slate-200 rounded-lg px-3 py-1.5 cursor-pointer flex items-center gap-1">
        📖 選級別 <span className="text-xs">▾</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden min-w-[140px]">
            <div className="px-3 py-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">英檢 GEPT</div>
            {GEPT_LEVELS.map(l => (
              <a key={l.prefix} href={l.href}
                className={`block px-4 py-2.5 text-sm font-medium no-underline ${l.color} hover:bg-slate-50 transition`}>
                {l.label}
              </a>
            ))}
            <div className="border-t border-slate-100 mt-1" />
            <div className="px-3 py-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">日檢 JLPT</div>
            {JLPT_LEVELS.map(l => (
              <a key={l.prefix} href={l.href}
                className={`block px-4 py-2.5 text-sm font-medium no-underline ${l.color} hover:bg-slate-50 transition`}>
                {l.label}
              </a>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
