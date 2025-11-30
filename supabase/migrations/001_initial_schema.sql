-- Migration: Initial Schema
-- Description: Create all core tables for Prayerly app
-- Date: 2025-11-25

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- PROFILES TABLE
-- ============================================================================
-- Extends Supabase auth.users with additional user information
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT,
  profile_picture TEXT, -- URL to storage/avatars bucket
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PRAYERS TABLE
-- ============================================================================
-- Stores user prayer requests
CREATE TABLE IF NOT EXISTS prayers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  answered BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- JOURNALS TABLE
-- ============================================================================
-- Stores user journal entries, optionally linked to prayers
CREATE TABLE IF NOT EXISTS journals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  date TEXT NOT NULL, -- Display date format: "April 28, 2024"
  linked_prayer_id UUID REFERENCES prayers(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- REMINDERS TABLE
-- ============================================================================
-- Stores prayer reminder preferences
CREATE TABLE IF NOT EXISTS reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  prayer_id UUID REFERENCES prayers(id) ON DELETE CASCADE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('daily', 'weekly')),
  day_of_week TEXT CHECK (day_of_week IN ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')),
  enabled BOOLEAN DEFAULT TRUE,
  time TEXT NOT NULL, -- Time format: "9:00 AM"
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT weekly_requires_day CHECK (type != 'weekly' OR day_of_week IS NOT NULL)
);

-- ============================================================================
-- USER_PREFERENCES TABLE
-- ============================================================================
-- Stores user app preferences and settings
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  push_notifications_enabled BOOLEAN DEFAULT TRUE,
  email_notifications_enabled BOOLEAN DEFAULT FALSE,
  theme TEXT DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to automatically create profile on user signup
-- This trigger function runs whenever a new user signs up via Supabase Auth.
-- It automatically creates:
--   1. A profile record with the user's email as their initial username
--   2. A user_preferences record with default notification settings
-- This ensures every user has these records without needing app-side logic.
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call handle_new_user on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update updated_at timestamp
-- This function automatically sets updated_at to the current time whenever a row
-- is modified. Applied to all tables that have an updated_at column.
-- Benefit: You never have to manually update timestamps in your app code.
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers to automatically update updated_at
-- These triggers fire BEFORE UPDATE on each table to ensure accurate timestamps
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prayers_updated_at BEFORE UPDATE ON prayers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_journals_updated_at BEFORE UPDATE ON journals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reminders_updated_at BEFORE UPDATE ON reminders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
