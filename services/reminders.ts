import { supabase } from "@/utils/lib/supabase";

export type ReminderType = "daily" | "weekly";
export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface Reminder {
  id: string;
  user_id: string;
  prayer_id: string;
  type: ReminderType | null;
  day_of_week?: DayOfWeek;
  enabled: boolean;
  time: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReminderWithPrayer extends Reminder {
  prayer: {
    id: string;
    user_id: string;
    title: string;
    description?: string;
    answered: boolean;
    created_at: string;
    updated_at: string;
  };
}

export interface SetReminderData {
  prayer_id: string;
  type: ReminderType | null;
  time: string | null;
  day_of_week?: DayOfWeek;
  enabled?: boolean;
}

/**
 * Get all reminders for the current authenticated user with prayer details
 * @returns Array of reminders with prayer information or null if error
 */
export async function getReminders() {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("No authenticated user");
    }

    const { data, error } = await supabase
      .from("reminders")
      .select(
        `
        *,
        prayer:prayers (
          id,
          user_id,
          title,
          description,
          answered,
          created_at,
          updated_at
        )
      `
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return { data: data as ReminderWithPrayer[], error: null };
  } catch (error) {
    console.error("Error fetching reminders:", error);
    return { data: null, error };
  }
}

/**
 * Create or update a reminder for a specific prayer
 * If a reminder already exists for the prayer, it will be updated
 * @param reminderData - Reminder data (prayer_id, type, time, day_of_week, enabled)
 * @returns Created or updated reminder or null if error
 */
export async function setReminder(reminderData: SetReminderData) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("No authenticated user");
    }

    // Validate weekly reminders have a day_of_week
    if (reminderData.type === "weekly" && !reminderData.day_of_week) {
      throw new Error("Weekly reminders require a day_of_week");
    }

    // If type is null, time should also be null (reminder not configured)
    if (reminderData.type === null && reminderData.time !== null) {
      throw new Error("If type is null, time must also be null");
    }

    // Check if a reminder already exists for this prayer
    const { data: existingReminder } = await supabase
      .from("reminders")
      .select("id")
      .eq("prayer_id", reminderData.prayer_id)
      .eq("user_id", user.id)
      .maybeSingle();

    if (existingReminder) {
      // Update existing reminder
      const { data, error } = await supabase
        .from("reminders")
        .update({
          type: reminderData.type,
          time: reminderData.time,
          day_of_week: reminderData.day_of_week,
          enabled: reminderData.enabled ?? true,
        })
        .eq("id", existingReminder.id)
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } else {
      // Create new reminder
      const { data, error } = await supabase
        .from("reminders")
        .insert({
          user_id: user.id,
          prayer_id: reminderData.prayer_id,
          type: reminderData.type,
          time: reminderData.time,
          day_of_week: reminderData.day_of_week,
          enabled: reminderData.enabled ?? true,
        })
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    }
  } catch (error) {
    console.error("Error setting reminder:", error);
    return { data: null, error };
  }
}