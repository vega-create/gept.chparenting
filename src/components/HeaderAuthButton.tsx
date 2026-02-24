"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import Image from "next/image";

export default function HeaderAuthButton() {
  const { user, loading, configured, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  // If Supabase is not configured, show login link that goes to /login (which will show setup info)
  if (!configured) {
    return (
      <a
        href="/login"
        className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium text-sm no-underline hover:bg-blue-700 transition"
      >
        登入
      </a>
    );
  }

  if (loading) {
    return (
      <div className="w-16 h-9 bg-slate-100 rounded-lg animate-pulse" />
    );
  }

  if (!user) {
    return (
      <a
        href="/login"
        className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium text-sm no-underline hover:bg-blue-700 transition"
      >
        登入
      </a>
    );
  }

  const displayName = user.user_metadata?.full_name || user.email?.split("@")[0] || "使用者";
  const avatarUrl = user.user_metadata?.avatar_url;

  return (
    <div className="relative">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center gap-2 bg-transparent border border-slate-200 rounded-lg px-3 py-1.5 cursor-pointer hover:bg-slate-50 transition"
      >
        {avatarUrl ? (
          <Image src={avatarUrl} alt="" width={24} height={24} className="w-6 h-6 rounded-full" />
        ) : (
          <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">
            {displayName[0]}
          </div>
        )}
        <span className="text-sm font-medium text-slate-700 max-w-[80px] truncate">{displayName}</span>
        <span className="text-xs text-slate-400">▾</span>
      </button>

      {menuOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
          <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden min-w-[140px]">
            <a
              href="/dashboard"
              className="block px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition no-underline"
            >
              📊 學習紀錄
            </a>
            <button
              onClick={signOut}
              className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 transition bg-transparent border-0 cursor-pointer border-t border-slate-100"
            >
              🚪 登出
            </button>
          </div>
        </>
      )}
    </div>
  );
}
