"use client";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useSchedule, type ScheduleItem } from "@/hooks/useSchedule";
import SchedulePicker from "@/components/SchedulePicker";

const DAY_LABELS = ["週日", "週一", "週二", "週三", "週四", "週五", "週六"];
const DAY_COLORS = [
  "border-red-200 bg-red-50",
  "border-blue-200 bg-blue-50",
  "border-emerald-200 bg-emerald-50",
  "border-amber-200 bg-amber-50",
  "border-purple-200 bg-purple-50",
  "border-orange-200 bg-orange-50",
  "border-slate-200 bg-slate-50",
];

export default function SchedulePage() {
  const { user, loading: authLoading } = useAuth();
  const { schedule, loading, saveDay } = useSchedule();
  const [pickerDay, setPickerDay] = useState<number | null>(null);
  const [saving, setSaving] = useState<number | null>(null);

  if (authLoading || loading) {
    return <div className="min-h-[40vh] flex items-center justify-center"><div className="text-slate-400">載入中...</div></div>;
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-3">🔒</div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">請先登入</h2>
        <p className="text-slate-500 mb-4">登入後就可以設定學習計畫</p>
        <a href="/login" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold no-underline hover:bg-blue-700 transition">登入</a>
      </div>
    );
  }

  const today = new Date().getDay();

  const handleAdd = async (dayOfWeek: number, item: ScheduleItem) => {
    const current = schedule[dayOfWeek] ?? [];
    const updated = [...current, item];
    setSaving(dayOfWeek);
    await saveDay(dayOfWeek, updated);
    setSaving(null);
    setPickerDay(null);
  };

  const handleRemove = async (dayOfWeek: number, idx: number) => {
    const current = schedule[dayOfWeek] ?? [];
    const updated = current.filter((_, i) => i !== idx);
    setSaving(dayOfWeek);
    await saveDay(dayOfWeek, updated);
    setSaving(null);
  };

  // Show Mon-Sun order (1,2,3,4,5,6,0)
  const dayOrder = [1, 2, 3, 4, 5, 6, 0];

  return (
    <div className="space-y-6">
      <div className="text-center mb-2">
        <h1 className="text-2xl font-bold text-slate-800">📋 每週學習計畫</h1>
        <p className="text-slate-500 text-sm mt-1">設定每天要學什麼，養成規律學習習慣</p>
      </div>

      {/* Desktop: grid layout */}
      <div className="hidden md:grid md:grid-cols-7 gap-2">
        {dayOrder.map((day) => {
          const items = schedule[day] ?? [];
          const isToday = day === today;
          return (
            <div
              key={day}
              className={`rounded-xl border-2 p-3 min-h-[200px] flex flex-col ${
                isToday ? "border-blue-400 bg-blue-50/50 ring-2 ring-blue-200" : `border-slate-200 bg-white`
              }`}
            >
              <div className={`text-center font-bold text-sm mb-2 pb-2 border-b ${
                isToday ? "text-blue-600 border-blue-200" : "text-slate-600 border-slate-100"
              }`}>
                {DAY_LABELS[day]}
                {isToday && <span className="ml-1 text-xs font-normal text-blue-400">(今天)</span>}
              </div>

              <div className="flex-1 space-y-1">
                {items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-1 p-1.5 bg-white rounded-lg border border-slate-100 group">
                    <span className="text-sm">{item.icon}</span>
                    <span className="text-xs text-slate-700 flex-1 truncate">{item.activityName}</span>
                    <button
                      onClick={() => handleRemove(day, idx)}
                      className="text-slate-300 hover:text-red-500 text-xs bg-transparent border-0 cursor-pointer opacity-0 group-hover:opacity-100 transition"
                    >✕</button>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setPickerDay(day)}
                disabled={saving === day}
                className="mt-2 w-full py-1.5 text-xs text-blue-500 hover:bg-blue-50 rounded-lg bg-transparent border border-dashed border-blue-200 cursor-pointer transition"
              >
                {saving === day ? "儲存中..." : "➕ 新增"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Mobile: vertical list */}
      <div className="md:hidden space-y-3">
        {dayOrder.map((day) => {
          const items = schedule[day] ?? [];
          const isToday = day === today;
          return (
            <div
              key={day}
              className={`rounded-xl border-2 p-4 ${
                isToday ? "border-blue-400 bg-blue-50/50" : `${DAY_COLORS[day]}`
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`font-bold ${isToday ? "text-blue-600" : "text-slate-700"}`}>
                  {DAY_LABELS[day]}
                  {isToday && <span className="ml-1 text-xs font-normal text-blue-400">(今天)</span>}
                </span>
                <span className="text-xs text-slate-400">{items.length} 項活動</span>
              </div>

              {items.length > 0 && (
                <div className="space-y-1.5 mb-3">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2 bg-white rounded-lg border border-slate-100">
                      <span className="text-lg">{item.icon}</span>
                      <span className="text-sm text-slate-700 flex-1">{item.activityName}</span>
                      <button
                        onClick={() => handleRemove(day, idx)}
                        className="text-slate-300 hover:text-red-500 bg-transparent border-0 cursor-pointer text-sm"
                      >✕</button>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() => setPickerDay(day)}
                disabled={saving === day}
                className="w-full py-2 text-sm text-blue-500 hover:bg-blue-100/50 rounded-lg bg-transparent border border-dashed border-blue-200 cursor-pointer transition"
              >
                {saving === day ? "儲存中..." : "➕ 新增活動"}
              </button>
            </div>
          );
        })}
      </div>

      {/* Tips */}
      <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 text-center">
        <p className="text-sm text-amber-700">
          💡 建議每天安排 1-3 項活動，每次 15 分鐘，持續學習效果最好！
        </p>
      </div>

      {/* Activity Picker Modal */}
      {pickerDay !== null && (
        <SchedulePicker
          onSelect={(item) => handleAdd(pickerDay, {
            subject: item.subject,
            activityType: item.activityType,
            activityId: item.activityId,
            activityName: item.activityName,
            icon: item.icon,
            href: item.href,
          })}
          onClose={() => setPickerDay(null)}
          existingIds={(schedule[pickerDay] ?? []).map((i) => i.activityId)}
        />
      )}
    </div>
  );
}
