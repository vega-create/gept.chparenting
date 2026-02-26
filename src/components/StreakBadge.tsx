"use client";
import { useTracking } from "@/hooks/useTracking";

export default function StreakBadge() {
  const { streak, isLoggedIn } = useTracking();

  if (!isLoggedIn || !streak || streak.current_streak === 0) return null;

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 text-xs font-bold">
      <span>🔥</span>
      <span>{streak.current_streak}</span>
    </span>
  );
}
