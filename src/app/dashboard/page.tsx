"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTracking } from "@/hooks/useTracking";
import { useSchedule } from "@/hooks/useSchedule";
import { getRecentActivities, getTodayActivities, getWeekStats, type LearningActivity } from "@/lib/tracking";
import ActivityCard from "@/components/ActivityCard";

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { streak } = useTracking();
  const { todayTasks, loading: scheduleLoading } = useSchedule();

  const [recentActivities, setRecentActivities] = useState<LearningActivity[]>([]);
  const [todayCompleted, setTodayCompleted] = useState<LearningActivity[]>([]);
  const [weekStats, setWeekStats] = useState({ count: 0, avgScore: 0, subjects: [] as string[] });
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!user) { setDataLoading(false); return; }
    Promise.all([
      getRecentActivities(5),
      getTodayActivities(),
      getWeekStats(),
    ]).then(([recent, today, stats]) => {
      setRecentActivities(recent);
      setTodayCompleted(today);
      setWeekStats(stats);
      setDataLoading(false);
    });
  }, [user]);

  if (authLoading) {
    return <div className="min-h-[60vh] flex items-center justify-center"><div className="text-slate-400">載入中...</div></div>;
  }

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "使用者";
  const isLoading = dataLoading || scheduleLoading;

  // Check which today's tasks are completed
  const todayCompletedIds = new Set(todayCompleted.map((a) => a.activity_id));

  return (
    <div className="space-y-6">
      {/* Welcome + Streak */}
      <div className="bg-gradient-to-r from-rose-400 to-rose-500 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-1">👋 歡迎回來，{displayName}！</h1>
            <p className="text-rose-100 text-sm">持續學習，每天進步一點點</p>
          </div>
          {streak && streak.current_streak > 0 && (
            <div className="flex items-center gap-3 bg-white/15 rounded-xl px-5 py-3">
              <div className="text-center">
                <div className="text-3xl">🔥</div>
              </div>
              <div>
                <div className="text-2xl font-black">{streak.current_streak} 天</div>
                <div className="text-xs text-rose-200">連續學習</div>
              </div>
              {streak.longest_streak > streak.current_streak && (
                <div className="text-xs text-rose-200 border-l border-white/20 pl-3 ml-1">
                  最長紀錄<br /><span className="font-bold text-white">{streak.longest_streak} 天</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Today's Schedule */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span>📋</span> 今日學習計畫
          </h2>
          <a href="/dashboard/schedule" className="text-sm text-rose-500 hover:underline no-underline">編輯計畫 →</a>
        </div>

        {isLoading ? (
          <div className="text-slate-400 text-sm py-4 text-center">載入中...</div>
        ) : todayTasks.length === 0 ? (
          <div className="text-center py-6">
            <div className="text-3xl mb-2">📝</div>
            <p className="text-slate-500 text-sm mb-3">還沒有設定今天的學習計畫</p>
            <a href="/dashboard/schedule" className="text-sm text-rose-500 font-medium hover:underline no-underline">
              前往設定 →
            </a>
          </div>
        ) : (
          <div className="space-y-2">
            {todayTasks.map((task) => {
              const done = todayCompletedIds.has(task.activityId);
              return (
                <a
                  key={task.activityId}
                  href={task.href}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition no-underline ${
                    done
                      ? "bg-emerald-50 border-emerald-200"
                      : "bg-white border-slate-100 hover:border-rose-200 hover:bg-rose-50"
                  }`}
                >
                  <span className="text-xl">{task.icon}</span>
                  <span className={`flex-1 font-medium text-sm ${done ? "text-emerald-700 line-through" : "text-slate-700"}`}>
                    {task.activityName}
                  </span>
                  {done ? (
                    <span className="text-emerald-500 text-lg">✅</span>
                  ) : (
                    <span className="text-xs text-rose-400 font-medium">開始 →</span>
                  )}
                </a>
              );
            })}
            <div className="text-xs text-slate-400 text-center pt-2">
              完成 {todayTasks.filter((t) => todayCompletedIds.has(t.activityId)).length} / {todayTasks.length}
            </div>
          </div>
        )}
      </div>

      {/* Week Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm text-center">
          <div className="text-3xl font-black text-rose-500">{isLoading ? "-" : weekStats.count}</div>
          <div className="text-xs text-slate-500 mt-1">本週活動</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm text-center">
          <div className="text-3xl font-black text-emerald-600">{isLoading ? "-" : weekStats.avgScore > 0 ? `${weekStats.avgScore}%` : "-"}</div>
          <div className="text-xs text-slate-500 mt-1">平均分數</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm text-center">
          <div className="text-3xl font-black text-purple-600">{isLoading ? "-" : weekStats.subjects.length}</div>
          <div className="text-xs text-slate-500 mt-1">涵蓋科目</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <span>🕐</span> 最近學習
          </h2>
          <a href="/dashboard/records" className="text-sm text-rose-500 hover:underline no-underline">查看全部 →</a>
        </div>

        {isLoading ? (
          <div className="text-slate-400 text-sm py-4 text-center">載入中...</div>
        ) : recentActivities.length === 0 ? (
          <div className="text-center py-6">
            <div className="text-3xl mb-2">🚀</div>
            <p className="text-slate-500 text-sm">還沒有學習紀錄，開始第一個活動吧！</p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentActivities.map((a) => (
              <ActivityCard key={a.id} activity={a} />
            ))}
          </div>
        )}
      </div>

      {/* Quick Access */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 border border-amber-200 text-center">
        <h3 className="font-bold text-slate-800 mb-3">快速開始</h3>
        <div className="flex flex-wrap justify-center gap-2">
          <a href="/elementary" className="px-4 py-2 bg-rose-400 text-white rounded-lg font-semibold text-sm hover:bg-rose-500 transition no-underline">📘 英檢</a>
          <a href="/jlpt-n5" className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold text-sm hover:bg-red-600 transition no-underline">🇯🇵 日文</a>
          <a href="/board-games" className="px-4 py-2 bg-orange-500 text-white rounded-lg font-semibold text-sm hover:bg-orange-600 transition no-underline">🎲 桌遊</a>
          <a href="/math" className="px-4 py-2 bg-amber-500 text-white rounded-lg font-semibold text-sm hover:bg-amber-600 transition no-underline">🔢 數學</a>
          <a href="/finance" className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold text-sm hover:bg-purple-700 transition no-underline">💰 理財</a>
          <a href="/typing-game" className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold text-sm hover:bg-emerald-700 transition no-underline">⌨️ 打字</a>
        </div>
      </div>
    </div>
  );
}
