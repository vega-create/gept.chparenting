"use client";
import { useState } from "react";
import { SCHEDULE_CATEGORIES, type ScheduleOption } from "@/lib/schedule-options";

interface Props {
  onSelect: (item: ScheduleOption) => void;
  onClose: () => void;
  existingIds?: string[]; // already scheduled activity IDs to grey out
}

export default function SchedulePicker({ onSelect, onClose, existingIds = [] }: Props) {
  const [expandedCat, setExpandedCat] = useState<string | null>(null);

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">選擇學習活動</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-transparent border-0 cursor-pointer text-xl">✕</button>
        </div>

        <div className="overflow-y-auto max-h-[60vh] p-4 space-y-2">
          {SCHEDULE_CATEGORIES.map((cat) => (
            <div key={cat.subject} className="border border-slate-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setExpandedCat(expandedCat === cat.subject ? null : cat.subject)}
                className="w-full text-left p-3 flex items-center gap-2 bg-transparent border-0 cursor-pointer hover:bg-slate-50"
              >
                <span className="text-xl">{cat.icon}</span>
                <span className="font-medium text-slate-800">{cat.label}</span>
                <span className="text-xs text-slate-400 ml-1">({cat.options.length})</span>
                <span className="ml-auto text-slate-400">{expandedCat === cat.subject ? "−" : "+"}</span>
              </button>
              {expandedCat === cat.subject && (
                <div className="border-t border-slate-100 p-2 space-y-1">
                  {cat.options.map((opt) => {
                    const isAdded = existingIds.includes(opt.activityId);
                    return (
                      <button
                        key={opt.activityId}
                        onClick={() => { if (!isAdded) onSelect(opt); }}
                        disabled={isAdded}
                        className={`w-full text-left p-2.5 rounded-lg flex items-center gap-2 border-0 cursor-pointer transition text-sm ${
                          isAdded ? "bg-slate-50 text-slate-300 cursor-default" : "hover:bg-blue-50 bg-transparent"
                        }`}
                      >
                        <span>{opt.icon}</span>
                        <span className={isAdded ? "text-slate-300" : "text-slate-700"}>{opt.activityName}</span>
                        {isAdded && <span className="ml-auto text-xs text-slate-300">已新增</span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
