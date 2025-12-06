-- Migration: Add Tags System
-- Description: Create tags table for prayer categorization and add tag_id to prayers table
-- Date: 2025-12-06

-- ============================================================================
-- TAGS TABLE
-- ============================================================================
-- Stores predefined prayer category tags
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  icon_name TEXT NOT NULL, -- Ionicons icon name
  display_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ALTER PRAYERS TABLE
-- ============================================================================
-- Add tag_id column to prayers table for categorization
ALTER TABLE prayers ADD COLUMN IF NOT EXISTS tag_id UUID REFERENCES tags(id) ON DELETE SET NULL;

-- ============================================================================
-- INSERT PREDEFINED TAGS
-- ============================================================================
-- Insert predefined prayer category tags
INSERT INTO tags (name, icon_name, display_order) VALUES
  ('Strength', 'fitness', 1),
  ('Family', 'people', 2),
  ('Guidance', 'compass', 3),
  ('Health', 'medical', 4),
  ('Relationships', 'heart', 5),
  ('Finances', 'cash', 6),
  ('Career', 'briefcase', 7),
  ('General', 'hand-left', 8)
ON CONFLICT (name) DO NOTHING;

-- ============================================================================
-- INDEXES
-- ============================================================================
-- Index on prayers.tag_id for filtering performance
CREATE INDEX IF NOT EXISTS idx_prayers_tag_id ON prayers(tag_id);

-- Composite index for user-tag filtering (most common query pattern)
CREATE INDEX IF NOT EXISTS idx_prayers_user_tag ON prayers(user_id, tag_id);
