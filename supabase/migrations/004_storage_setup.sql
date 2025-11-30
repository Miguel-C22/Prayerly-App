-- Migration: Storage Setup
-- Description: Setup storage buckets for user profile pictures
-- Date: 2025-11-25
-- Note: This migration requires manual setup in Supabase Dashboard or CLI

-- ============================================================================
-- STORAGE BUCKET: avatars
-- ============================================================================
-- Manual Steps (via Supabase Dashboard):
-- 1. Go to Storage in Supabase Dashboard
-- 2. Create a new bucket named 'avatars'
-- 3. Set to Public
-- 4. Configure allowed MIME types: image/jpeg, image/png, image/gif, image/webp
-- 5. Set file size limit: 2MB

-- Or via Supabase CLI:
-- supabase storage buckets create avatars --public

-- ============================================================================
-- STORAGE POLICIES
-- ============================================================================

-- Policy: Allow users to upload their own avatar
CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: Allow users to update their own avatar
CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: Allow users to delete their own avatar
CREATE POLICY "Users can delete own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: Anyone can view avatars (public bucket)
CREATE POLICY "Anyone can view avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- ============================================================================
-- HELPER FUNCTION: Generate Avatar URL
-- ============================================================================

CREATE OR REPLACE FUNCTION get_avatar_url(user_id UUID)
RETURNS TEXT AS $$
DECLARE
  avatar_path TEXT;
BEGIN
  SELECT profile_picture INTO avatar_path
  FROM profiles
  WHERE id = user_id;

  IF avatar_path IS NOT NULL THEN
    RETURN avatar_path;
  ELSE
    RETURN NULL;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
