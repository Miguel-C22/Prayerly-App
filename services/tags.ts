import { supabase } from "@/utils/lib/supabase";

export interface Tag {
  id: string;
  name: string;
  icon_name: string;
  display_order: number;
  created_at: string;
}

/**
 * Get all available prayer tags
 * Tags are predefined and ordered by display_order
 * @returns Array of tags or null if error
 */
export async function getTags() {
  try {
    const { data, error } = await supabase
      .from("tags")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching tags:", error);
    return { data: null, error };
  }
}

/**
 * Get a single tag by ID
 * @param id - Tag ID
 * @returns Tag or null if error
 */
export async function getTagById(id: string) {
  try {
    const { data, error } = await supabase
      .from("tags")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching tag:", error);
    return { data: null, error };
  }
}
