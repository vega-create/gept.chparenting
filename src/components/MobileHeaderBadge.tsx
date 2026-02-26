"use client";
import { usePathname } from "next/navigation";
import { useState } from "react";

const LEVELS = [
  { prefix: "/elementary", label: "🌱 初級", href: "/elementary", color: "text-rose-500", bg: "bg-rose-50" },
  { prefix: "/intermediate", label: "⚡ 中級", href: "/intermediate", color: "text-emerald-600", bg: "bg-emerald-50" },
  { prefix: "/upper-intermediate", label: "🔥 中高級", href: "/upper-intermediate", color: "text-purple-600", bg: "bg-purple-50" },
];

export default function MobileHeaderBadge() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Sort by prefix length descending so /upper-intermediate matches before /intermediate
  const sorted = [...LEVELS].sort((a, b) => b.prefix.length - a.prefix.length);
  const current = sorted.find(l => pathname.startsWith(l.prefix));

  if (current) {
    return (
      <a href={current.href} className={`md:hidden text-sm font-semibold no-underline ${current.color}`}>
        {current.label}
      </a>
    );
  }

  // On home/about: show level switcher
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
            {LEVELS.map(l => (
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
