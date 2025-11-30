import { supabase } from "@/utils/lib/supabase";

export interface Journal {
  id: string;
  user_id: string;
  content: string;
  date: string;
  linked_prayer_id?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateJournalData {
  content: string;
  date: string;
  linked_prayer_id?: string;
}

export interface UpdateJournalData {
  content?: string;
  date?: string;
  linked_prayer_id?: string;
}

/**
 * Get all journals for the current authenticated user
 * @returns Array of journals or null if error
 */
export async function getJournals() {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("No authenticated user");
    }

    const { data, error } = await supabase
      .from("journals")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching journals:", error);
    return { data: null, error };
  }
}

/**
 * Create a new journal entry for the current authenticated user
 * @param journalData - Journal data (content, date, linked_prayer_id)
 * @returns Created journal or null if error
 */
export async function createJournal(journalData: CreateJournalData) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("No authenticated user");
    }

    const { data, error } = await supabase
      .from("journals")
      .insert({
        user_id: user.id,
        content: journalData.content,
        date: journalData.date,
        linked_prayer_id: journalData.linked_prayer_id,
      })
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error creating journal:", error);
    return { data: null, error };
  }
}

/**
 * Update an existing journal entry
 * @param id - Journal ID
 * @param updates - Fields to update (content, date, linked_prayer_id)
 * @returns Updated journal or null if error
 */
export async function updateJournal(id: string, updates: UpdateJournalData) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("No authenticated user");
    }

    const { data, error } = await supabase
      .from("journals")
      .update(updates)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error updating journal:", error);
    return { data: null, error };
  }
}

/**
 * Delete a journal entry
 * @param id - Journal ID
 * @returns Success status or error
 */
export async function deleteJournal(id: string) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("No authenticated user");
    }

    const { error } = await supabase
      .from("journals")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;

    return { error: null };
  } catch (error) {
    console.error("Error deleting journal:", error);
    return { error };
  }
}
