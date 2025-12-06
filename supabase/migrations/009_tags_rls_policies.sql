-- Migration: Tags RLS Policies
-- Description: Add Row Level Security policies for tags table
-- Date: 2025-12-06

-- ============================================================================
-- ENABLE RLS ON TAGS TABLE
-- ============================================================================
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- TAGS READ POLICY
-- ============================================================================
-- Allow all authenticated users to read tags (read-only access)
-- Tags are predefined and managed by admin, not user-created
CREATE POLICY "Users can view all tags"
  ON tags
  FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================================
-- NO INSERT/UPDATE/DELETE POLICIES FOR TAGS
-- ============================================================================
-- Tags are predefined and should only be managed by admin/migrations
-- Users cannot create, update, or delete tags
-- Only SELECT is allowed via the policy above

-- ============================================================================
-- PRAYERS TABLE POLICIES (Verification)
-- ============================================================================
-- No changes needed to prayers table policies
-- The existing user_id-based RLS policies automatically cover the new tag_id column
-- Users can only access prayers where user_id = auth.uid(), which includes the tag_id field
