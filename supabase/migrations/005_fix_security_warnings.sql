-- Migration: Fix Security Warnings
-- Description: Add search_path to functions to prevent SQL injection vulnerabilities
-- Date: 2025-11-25

-- ============================================================================
-- FIX: Function Search Path Security
-- ============================================================================
-- The search_path parameter prevents potential SQL injection attacks by
-- ensuring functions only use the public schema and don't rely on user-controlled
-- search paths. This is a security best practice recommended by Supabase.

-- Fix handle_new_user function
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create profile using the new user's ID and email
  INSERT INTO profiles (id, username)
  VALUES (NEW.id, NEW.email);

  -- Create default preferences for the user
  INSERT INTO user_preferences (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Fix update_updated_at_column function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = '';

-- Fix get_avatar_url function
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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';
