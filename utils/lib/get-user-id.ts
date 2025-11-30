import { supabase } from "./supabase";

export const getUserId = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("No authenticated user");
    }

    return user.id;
  } catch (error) {
    console.error("Error fetching user ID:", error);
    return null;
  }
};
