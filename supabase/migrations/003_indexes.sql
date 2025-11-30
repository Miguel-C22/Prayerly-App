-- Migration: Database Indexes
-- Description: Create indexes for improved query performance
-- Date: 2025-11-25

-- ============================================================================
-- PRAYERS INDEXES
-- ============================================================================

-- Index for fetching all prayers by user (used in home screen)
CREATE INDEX IF NOT EXISTS idx_prayers_user_id
  ON prayers(user_id);

-- Index for filtering prayers by answered status
CREATE INDEX IF NOT EXISTS idx_prayers_user_answered
  ON prayers(user_id, answered);

-- Index for sorting prayers by creation date
CREATE INDEX IF NOT EXISTS idx_prayers_created_at
  ON prayers(created_at DESC);

-- ============================================================================
-- JOURNALS INDEXES
-- ============================================================================

-- Index for fetching all journals by user (used in journal screen)
CREATE INDEX IF NOT EXISTS idx_journals_user_id
  ON journals(user_id);

-- Index for finding journals linked to a specific prayer
CREATE INDEX IF NOT EXISTS idx_journals_prayer_id
  ON journals(linked_prayer_id);

-- Index for sorting journals by creation date
CREATE INDEX IF NOT EXISTS idx_journals_created_at
  ON journals(created_at DESC);

-- Composite index for user + linked prayer lookups
CREATE INDEX IF NOT EXISTS idx_journals_user_prayer
  ON journals(user_id, linked_prayer_id);

-- ============================================================================
-- REMINDERS INDEXES
-- ============================================================================

-- Index for fetching all reminders by user
CREATE INDEX IF NOT EXISTS idx_reminders_user_id
  ON reminders(user_id);

-- Index for fetching reminders for a specific prayer
CREATE INDEX IF NOT EXISTS idx_reminders_prayer_id
  ON reminders(prayer_id);

-- Index for finding enabled reminders (for notification scheduling)
CREATE INDEX IF NOT EXISTS idx_reminders_enabled
  ON reminders(enabled)
  WHERE enabled = true;

-- Composite index for user + prayer + enabled status
CREATE INDEX IF NOT EXISTS idx_reminders_user_prayer_enabled
  ON reminders(user_id, prayer_id, enabled);
