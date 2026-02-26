"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export interface ScheduleItem {
  subject: string;
  activityType: string;
  activityId: string;
  activityName: string;
  icon: string;
  href: string;
}

export type WeekSchedule = Record<number, ScheduleItem[]>; // 0-6

export function useSchedule() {
  const { user } = useAuth();
  const [schedule, setSchedule] = useState<WeekSchedule>({});
  const [loading, setLoading] = useState(true);

  const fetchSchedule = useCallback(async () => {
    if (!user || !isSupabaseConfigured()) { setLoading(false); return; }
    const supabase = createClient();
    if (!supabase) { setLoading(false); return; }

    const { data } = await supabase
      .from("weekly_schedules")
      .select("day_of_week, activities")
      .eq("user_id", user.id);

    const map: WeekSchedule = {};
    (data ?? []).forEach((row: { day_of_week: number; activities: ScheduleItem[] }) => {
      map[row.day_of_week] = row.activities;
    });
    setSchedule(map);
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchSchedule(); }, [fetchSchedule]);

  const saveDay = useCallback(async (dayOfWeek: number, activities: ScheduleItem[]) => {
    if (!user || !isSupabaseConfigured()) return;
    const supabase = createClient();
    if (!supabase) return;

    await supabase.from("weekly_schedules").upsert(
      { user_id: user.id, day_of_week: dayOfWeek, activities, updated_at: new Date().toISOString() },
      { onConflict: "user_id,day_of_week" }
    );

    setSchedule((prev) => ({ ...prev, [dayOfWeek]: activities }));
  }, [user]);

  const deleteDay = useCallback(async (dayOfWeek: number) => {
    if (!user || !isSupabaseConfigured()) return;
    const supabase = createClient();
    if (!supabase) return;

    await supabase.from("weekly_schedules")
      .delete()
      .eq("user_id", user.id)
      .eq("day_of_week", dayOfWeek);

    setSchedule((prev) => {
      const next = { ...prev };
      delete next[dayOfWeek];
      return next;
    });
  }, [user]);

  const todayTasks = schedule[new Date().getDay()] ?? [];

  return { schedule, todayTasks, loading, saveDay, deleteDay, refresh: fetchSchedule };
}
