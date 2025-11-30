-- Migration: Allow NULL type and time in reminders table
-- This allows prayers to have a reminder entry without being configured yet

-- Allow type to be NULL
ALTER TABLE reminders
  ALTER COLUMN type DROP NOT NULL;

-- Allow time to be NULL
ALTER TABLE reminders
  ALTER COLUMN time DROP NOT NULL;

-- Update the type check constraint to handle NULL
ALTER TABLE reminders DROP CONSTRAINT IF EXISTS reminders_type_check;
ALTER TABLE reminders ADD CONSTRAINT reminders_type_check
  CHECK (type IS NULL OR type IN ('daily', 'weekly'));

-- Update weekly constraint to only apply when type is set
ALTER TABLE reminders DROP CONSTRAINT IF EXISTS weekly_requires_day;
ALTER TABLE reminders ADD CONSTRAINT weekly_requires_day
  CHECK (type IS NULL OR type != 'weekly' OR day_of_week IS NOT NULL);

-- Create NULL reminder entries for existing prayers that don't have reminders
-- This ensures all prayers show up on the reminders screen
INSERT INTO reminders (user_id, prayer_id, type, time, enabled)
SELECT
  p.user_id,
  p.id,
  NULL,
  NULL,
  FALSE
FROM prayers p
LEFT JOIN reminders r ON r.prayer_id = p.id
WHERE r.id IS NULL;

-- Add comments to clarify the purpose
COMMENT ON COLUMN reminders.type IS 'Reminder type (daily, weekly) or NULL if not configured yet';
COMMENT ON COLUMN reminders.time IS 'Reminder time or NULL if not configured yet';
