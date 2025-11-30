-- Migration: Optimize RLS Performance
-- Description: Optimize RLS policies by wrapping auth.uid() in SELECT to avoid re-evaluation per row
-- Date: 2025-11-25

-- ============================================================================
-- PERFORMANCE OPTIMIZATION
-- ============================================================================
-- By wrapping auth.uid() in a SELECT statement like (select auth.uid()),
-- the function is evaluated once per query instead of once per row.
-- This significantly improves performance when querying multiple rows.

-- ============================================================================
-- DROP EXISTING POLICIES
-- ============================================================================

-- Profiles policies
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Prayers policies
DROP POLICY IF EXISTS "Users can view own prayers" ON prayers;
DROP POLICY IF EXISTS "Users can create prayers" ON prayers;
DROP POLICY IF EXISTS "Users can update own prayers" ON prayers;
DROP POLICY IF EXISTS "Users can delete own prayers" ON prayers;

-- Journals policies
DROP POLICY IF EXISTS "Users can view own journals" ON journals;
DROP POLICY IF EXISTS "Users can create journals" ON journals;
DROP POLICY IF EXISTS "Users can update own journals" ON journals;
DROP POLICY IF EXISTS "Users can delete own journals" ON journals;

-- Reminders policies
DROP POLICY IF EXISTS "Users can view own reminders" ON reminders;
DROP POLICY IF EXISTS "Users can create reminders" ON reminders;
DROP POLICY IF EXISTS "Users can update own reminders" ON reminders;
DROP POLICY IF EXISTS "Users can delete own reminders" ON reminders;

-- User preferences policies
DROP POLICY IF EXISTS "Users can view own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can insert own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can update own preferences" ON user_preferences;

-- Storage policies
DROP POLICY IF EXISTS "Users can upload own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;

-- ============================================================================
-- RECREATE OPTIMIZED POLICIES
-- ============================================================================

-- ============================================================================
-- PROFILES POLICIES
-- ============================================================================

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING ((select auth.uid()) = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING ((select auth.uid()) = id);

-- ============================================================================
-- PRAYERS POLICIES
-- ============================================================================

CREATE POLICY "Users can view own prayers"
  ON prayers FOR SELECT
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can create prayers"
  ON prayers FOR INSERT
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own prayers"
  ON prayers FOR UPDATE
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own prayers"
  ON prayers FOR DELETE
  USING ((select auth.uid()) = user_id);

-- ============================================================================
-- JOURNALS POLICIES
-- ============================================================================

CREATE POLICY "Users can view own journals"
  ON journals FOR SELECT
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can create journals"
  ON journals FOR INSERT
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own journals"
  ON journals FOR UPDATE
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own journals"
  ON journals FOR DELETE
  USING ((select auth.uid()) = user_id);

-- ============================================================================
-- REMINDERS POLICIES
-- ============================================================================

CREATE POLICY "Users can view own reminders"
  ON reminders FOR SELECT
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can create reminders"
  ON reminders FOR INSERT
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own reminders"
  ON reminders FOR UPDATE
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can delete own reminders"
  ON reminders FOR DELETE
  USING ((select auth.uid()) = user_id);

-- ============================================================================
-- USER_PREFERENCES POLICIES
-- ============================================================================

CREATE POLICY "Users can view own preferences"
  ON user_preferences FOR SELECT
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own preferences"
  ON user_preferences FOR INSERT
  WITH CHECK ((select auth.uid()) = user_id);

CREATE POLICY "Users can update own preferences"
  ON user_preferences FOR UPDATE
  USING ((select auth.uid()) = user_id);

-- ============================================================================
-- STORAGE POLICIES (AVATARS)
-- ============================================================================

-- Policy: Allow users to upload their own avatar
CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    (select auth.uid())::text = (storage.foldername(name))[1]
  );

-- Policy: Allow users to update their own avatar
CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' AND
    (select auth.uid())::text = (storage.foldername(name))[1]
  );

-- Policy: Allow users to delete their own avatar
CREATE POLICY "Users can delete own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars' AND
    (select auth.uid())::text = (storage.foldername(name))[1]
  );

-- Policy: Anyone can view avatars (public bucket)
CREATE POLICY "Anyone can view avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');
