"use client";
import type { LearningActivity } from "@/lib/tracking";

const SUBJECT_BADGES: Record<string, { label: string; color: string; icon: string }> = {
  "gept": { label: "英檢", color: "bg-blue-100 text-blue-700", icon: "📘" },
  "jlpt": { label: "日文", color: "bg-red-100 text-red-700", icon: "🇯🇵" },
  "board-game": { label: "桌遊", color: "bg-orange-100 text-orange-700", icon: "🎲" },
  "math": { label: "數學", color: "bg-amber-100 text-amber-700", icon: "🔢" },
  "finance": { label: "理財", color: "bg-purple-100 text-purple-700", icon: "💰" },
  "typing": { label: "打字", color: "bg-emerald-100 text-emerald-700", icon: "⌨️" },
};

function formatTime(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "剛剛";
  if (diffMin < 60) return `${diffMin} 分鐘前`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr} 小時前`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay} 天前`;
  return d.toLocaleDateString("zh-TW");
}

function renderStars(stars: number | null) {
  if (stars == null) return null;
  return <span className="text-yellow-500">{"⭐".repeat(stars)}{"☆".repeat(3 - stars)}</span>;
}

export default function ActivityCard({ activity }: { activity: LearningActivity }) {
  const badge = SUBJECT_BADGES[activity.subject] ?? { label: activity.subject, color: "bg-slate-100 text-slate-700", icon: "📄" };

  return (
    <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100">
      <span className="text-2xl">{badge.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-slate-800 text-sm truncate">{activity.activity_name}</div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${badge.color}`}>{badge.label}</span>
          {activity.score != null && activity.max_score != null && (
            <span className="text-xs text-slate-500">{activity.score}/{activity.max_score}</span>
          )}
          {renderStars(activity.stars)}
        </div>
      </div>
      <span className="text-xs text-slate-400 shrink-0">{formatTime(activity.completed_at)}</span>
    </div>
  );
}
