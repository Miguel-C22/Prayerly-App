import { supabase } from "@/utils/lib/supabase";

export interface Prayer {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  answered: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreatePrayerData {
  title: string;
  description?: string;
  answered?: boolean;
}

export interface UpdatePrayerData {
  title?: string;
  description?: string;
  answered?: boolean;
}

/**
 * Get all prayers for the current authenticated user
 * @returns Array of prayers or null if error
 */
export async function getPrayers() {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("No authenticated user");
    }

    const { data, error } = await supabase
      .from("prayers")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching prayers:", error);
    return { data: null, error };
  }
}

/**
 * Create a new prayer for the current authenticated user
 * Also creates a default reminder entry (NULL/disabled) so prayer shows up on reminders screen
 * @param prayerData - Prayer data (title, description, answered)
 * @returns Created prayer or null if error
 */
export async function createPrayer(prayerData: CreatePrayerData) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("No authenticated user");
    }

    const { data, error } = await supabase
      .from("prayers")
      .insert({
        user_id: user.id,
        title: prayerData.title,
        description: prayerData.description,
        answered: prayerData.answered ?? false,
      })
      .select()
      .single();

    if (error) throw error;

    // Create a default reminder entry (NULL/disabled) so prayer shows up on reminders screen
    const { error: reminderError } = await supabase
      .from("reminders")
      .insert({
        user_id: user.id,
        prayer_id: data.id,
        type: null,
        time: null,
        enabled: false,
      });

    if (reminderError) {
      console.error("Error creating default reminder:", reminderError);
      // Don't fail the prayer creation if reminder creation fails
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error creating prayer:", error);
    return { data: null, error };
  }
}

/**
 * Update an existing prayer
 * @param id - Prayer ID
 * @param updates - Fields to update (title, description, answered)
 * @returns Updated prayer or null if error
 */
export async function updatePrayer(id: string, updates: UpdatePrayerData) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("No authenticated user");
    }

    const { data, error } = await supabase
      .from("prayers")
      .update(updates)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error updating prayer:", error);
    return { data: null, error };
  }
}

/**
 * Delete a prayer
 * @param id - Prayer ID
 * @returns Success status or error
 */
export async function deletePrayer(id: string) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("No authenticated user");
    }

    const { error } = await supabase
      .from("prayers")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;

    return { error: null };
  } catch (error) {
    console.error("Error deleting prayer:", error);
    return { error };
  }
}
