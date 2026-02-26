-- =============================================================
-- Supabase Schema for Learn CHParenting
-- Run this in Supabase SQL Editor (supabase.com > SQL Editor)
-- =============================================================

-- 1. Newsletter Subscribers
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMPTZ DEFAULT now(),
  is_active BOOLEAN DEFAULT true,
  source TEXT DEFAULT 'website'
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can subscribe" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);

-- 2. Learning Activities (every completed activity)
CREATE TABLE IF NOT EXISTS learning_activities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subject TEXT NOT NULL,
  activity_type TEXT NOT NULL,
  activity_id TEXT NOT NULL,
  activity_name TEXT NOT NULL,
  score INTEGER,
  max_score INTEGER,
  stars INTEGER CHECK (stars BETWEEN 0 AND 3),
  duration_seconds INTEGER,
  metadata JSONB DEFAULT '{}',
  completed_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activities_user_date ON learning_activities(user_id, completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_activities_user_subject ON learning_activities(user_id, subject);

ALTER TABLE learning_activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert own activities" ON learning_activities
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can read own activities" ON learning_activities
  FOR SELECT USING (auth.uid() = user_id);

-- 3. Daily Check-ins
CREATE TABLE IF NOT EXISTS daily_checkins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  checkin_date DATE NOT NULL DEFAULT CURRENT_DATE,
  activity_count INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, checkin_date)
);

CREATE INDEX IF NOT EXISTS idx_checkins_user_date ON daily_checkins(user_id, checkin_date DESC);

ALTER TABLE daily_checkins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can insert own checkins" ON daily_checkins
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can read own checkins" ON daily_checkins
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own checkins" ON daily_checkins
  FOR UPDATE USING (auth.uid() = user_id);

-- 4. Weekly Schedules
CREATE TABLE IF NOT EXISTS weekly_schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  activities JSONB NOT NULL DEFAULT '[]',
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, day_of_week)
);

ALTER TABLE weekly_schedules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own schedule" ON weekly_schedules
  FOR ALL USING (auth.uid() = user_id);

-- 5. User Streaks (cached for fast reads)
CREATE TABLE IF NOT EXISTS user_streaks (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_checkin_date DATE,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own streak" ON user_streaks
  FOR ALL USING (auth.uid() = user_id);

-- 6. Atomic check-in + streak update function
CREATE OR REPLACE FUNCTION record_checkin(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  v_today DATE := CURRENT_DATE;
  v_yesterday DATE := CURRENT_DATE - 1;
  v_streak RECORD;
  v_new_streak INTEGER;
BEGIN
  -- Upsert daily checkin
  INSERT INTO daily_checkins (user_id, checkin_date, activity_count)
  VALUES (p_user_id, v_today, 1)
  ON CONFLICT (user_id, checkin_date)
  DO UPDATE SET activity_count = daily_checkins.activity_count + 1;

  -- Get current streak record
  SELECT * INTO v_streak FROM user_streaks WHERE user_id = p_user_id;

  IF v_streak IS NULL THEN
    INSERT INTO user_streaks (user_id, current_streak, longest_streak, last_checkin_date)
    VALUES (p_user_id, 1, 1, v_today);
    RETURN json_build_object('current_streak', 1, 'longest_streak', 1);
  ELSIF v_streak.last_checkin_date = v_today THEN
    RETURN json_build_object('current_streak', v_streak.current_streak, 'longest_streak', v_streak.longest_streak);
  ELSIF v_streak.last_checkin_date = v_yesterday THEN
    v_new_streak := v_streak.current_streak + 1;
    UPDATE user_streaks SET
      current_streak = v_new_streak,
      longest_streak = GREATEST(v_streak.longest_streak, v_new_streak),
      last_checkin_date = v_today,
      updated_at = now()
    WHERE user_id = p_user_id;
    RETURN json_build_object('current_streak', v_new_streak, 'longest_streak', GREATEST(v_streak.longest_streak, v_new_streak));
  ELSE
    UPDATE user_streaks SET
      current_streak = 1,
      last_checkin_date = v_today,
      updated_at = now()
    WHERE user_id = p_user_id;
    RETURN json_build_object('current_streak', 1, 'longest_streak', v_streak.longest_streak);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
