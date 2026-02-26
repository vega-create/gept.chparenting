"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useLearningRecords } from "@/hooks/useLearningRecords";
import ActivityCard from "@/components/ActivityCard";

const SUBJECT_OPTIONS = [
  { value: "", label: "全部科目" },
  { value: "gept", label: "📘 全民英檢" },
  { value: "jlpt", label: "🇯🇵 日文檢定" },
  { value: "board-game", label: "🎲 教育桌遊" },
  { value: "math", label: "🔢 數學練習" },
  { value: "finance", label: "💰 兒童理財" },
  { value: "typing", label: "⌨️ 打字練習" },
];

export default function RecordsPage() {
  const { user, loading: authLoading } = useAuth();
  const { records, total, loading, loadMore, hasMore, filters, updateFilters } = useLearningRecords();

  if (authLoading) {
    return <div className="min-h-[40vh] flex items-center justify-center"><div className="text-slate-400">載入中...</div></div>;
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-3">🔒</div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">請先登入</h2>
        <p className="text-slate-500 mb-4">登入後就可以查看學習紀錄</p>
        <a href="/login" className="px-6 py-3 bg-rose-300 text-white rounded-xl font-bold no-underline hover:bg-rose-400 transition">登入</a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-2">
        <h1 className="text-2xl font-bold text-slate-800">📈 學習紀錄</h1>
        <p className="text-slate-500 text-sm mt-1">查看所有完成的學習活動</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
        <div className="flex flex-wrap gap-3">
          <select
            value={filters.subject ?? ""}
            onChange={(e) => updateFilters({ ...filters, subject: e.target.value || undefined })}
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white text-slate-700"
          >
            {SUBJECT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <input
            type="date"
            value={filters.dateFrom ?? ""}
            onChange={(e) => updateFilters({ ...filters, dateFrom: e.target.value || undefined })}
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white text-slate-700"
            placeholder="從"
          />
          <input
            type="date"
            value={filters.dateTo ?? ""}
            onChange={(e) => updateFilters({ ...filters, dateTo: e.target.value || undefined })}
            className="px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white text-slate-700"
            placeholder="到"
          />
          {(filters.subject || filters.dateFrom || filters.dateTo) && (
            <button
              onClick={() => updateFilters({})}
              className="px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg bg-transparent border border-red-200 cursor-pointer"
            >
              清除篩選
            </button>
          )}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-blue-50 rounded-xl p-4 border border-blue-200 flex items-center justify-between">
        <span className="text-sm text-blue-700 font-medium">
          共 <strong>{total}</strong> 筆學習紀錄
        </span>
      </div>

      {/* Records List */}
      {loading && records.length === 0 ? (
        <div className="text-center py-12 text-slate-400">載入中...</div>
      ) : records.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-5xl mb-3">📄</div>
          <p className="text-slate-500">沒有符合條件的學習紀錄</p>
        </div>
      ) : (
        <div className="space-y-2">
          {records.map((r) => (
            <ActivityCard key={r.id} activity={r} />
          ))}
        </div>
      )}

      {/* Load More */}
      {hasMore && (
        <div className="text-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-6 py-2.5 bg-rose-300 text-white rounded-xl font-semibold text-sm hover:bg-rose-400 transition border-0 cursor-pointer disabled:opacity-50"
          >
            {loading ? "載入中..." : "載入更多"}
          </button>
        </div>
      )}
    </div>
  );
}
