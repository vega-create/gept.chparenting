"use client";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/dashboard", label: "總覽", icon: "📊" },
  { href: "/dashboard/schedule", label: "學習計畫", icon: "📋" },
  { href: "/dashboard/records", label: "學習紀錄", icon: "📈" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Tab navigation */}
      <nav className="flex gap-1 mb-6 bg-slate-100 rounded-xl p-1 overflow-x-auto">
        {TABS.map((tab) => {
          const isActive = pathname === tab.href;
          return (
            <a
              key={tab.href}
              href={tab.href}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg font-medium text-sm transition no-underline whitespace-nowrap ${
                isActive
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </a>
          );
        })}
      </nav>

      {children}
    </div>
  );
}
