-- Migration: Row Level Security Policies
-- Description: Enable RLS and create policies to ensure users can only access their own data
-- Date: 2025-11-25

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE prayers ENABLE ROW LEVEL SECURITY;
ALTER TABLE journals ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PROFILES POLICIES
-- ============================================================================

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- ============================================================================
-- PRAYERS POLICIES
-- ============================================================================

CREATE POLICY "Users can view own prayers"
  ON prayers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create prayers"
  ON prayers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own prayers"
  ON prayers FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own prayers"
  ON prayers FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- JOURNALS POLICIES
-- ============================================================================

CREATE POLICY "Users can view own journals"
  ON journals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create journals"
  ON journals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own journals"
  ON journals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own journals"
  ON journals FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- REMINDERS POLICIES
-- ============================================================================

CREATE POLICY "Users can view own reminders"
  ON reminders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create reminders"
  ON reminders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reminders"
  ON reminders FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reminders"
  ON reminders FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- USER_PREFERENCES POLICIES
-- ============================================================================

CREATE POLICY "Users can view own preferences"
  ON user_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own preferences"
  ON user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own preferences"
  ON user_preferences FOR UPDATE
  USING (auth.uid() = user_id);
