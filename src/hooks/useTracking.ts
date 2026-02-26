"use client";
import { useState, useEffect, useCallback } from "react";
import { trackActivity as _trackActivity, getStreak, type TrackActivityParams, type StreakData } from "@/lib/tracking";
import { useAuth } from "@/contexts/AuthContext";

export function useTracking() {
  const { user } = useAuth();
  const [streak, setStreak] = useState<StreakData | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshStreak = useCallback(async () => {
    if (!user) { setStreak(null); setLoading(false); return; }
    const data = await getStreak();
    setStreak(data);
    setLoading(false);
  }, [user]);

  useEffect(() => { refreshStreak(); }, [refreshStreak]);

  const trackActivity = useCallback(async (params: TrackActivityParams) => {
    const result = await _trackActivity(params);
    if (result) setStreak(result);
    return result;
  }, []);

  return { trackActivity, streak, refreshStreak, loading, isLoggedIn: !!user };
}
