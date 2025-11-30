import { supabase } from "@/utils/lib/supabase";

export interface Profile {
  id: string;
  user_id: string;
  full_name?: string;
  avatar_url?: string;
  email?: string;
  created_at: string;
  updated_at: string;
}

export interface UpdateProfileData {
  full_name?: string;
  avatar_url?: string;
  email?: string;
}

/**
 * Get the profile for the current authenticated user
 * Uses Supabase Auth user data and optionally merges with profiles table
 * @returns User profile or null if error
 */
export async function getUserProfile() {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("No authenticated user");
    }

    // Try to get additional profile data from profiles table (optional)
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

    // Combine auth user data with profile table data
    const profile: Profile = {
      id: profileData?.id || user.id,
      user_id: user.id,
      full_name:
        profileData?.full_name ||
        user.user_metadata?.full_name ||
        user.email?.split("@")[0] ||
        "",
      avatar_url: profileData?.avatar_url || user.user_metadata?.avatar_url,
      email: user.email || "",
      created_at: profileData?.created_at || user.created_at,
      updated_at:
        profileData?.updated_at || user.updated_at || new Date().toISOString(),
    };

    return { data: profile, error: null };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return { data: null, error };
  }
}

/**
 * Update the profile for the current authenticated user
 * Updates Supabase Auth user metadata (and optionally profiles table)
 * @param profileData - Profile data to update (full_name, avatar_url, email)
 * @returns Updated profile or null if error
 */
export async function updateProfile(profileData: UpdateProfileData) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("No authenticated user");
    }

    // Prepare update data
    const updateData: any = {};

    // Update email if provided (requires email verification)
    if (profileData.email && profileData.email !== user.email) {
      updateData.email = profileData.email;
    }

    // Update user metadata
    if (profileData.full_name !== undefined || profileData.avatar_url !== undefined) {
      updateData.data = {
        full_name: profileData.full_name,
        avatar_url: profileData.avatar_url,
      };
    }

    // Update Supabase Auth
    const { error: authError } = await supabase.auth.updateUser(updateData);

    if (authError) {
      throw authError;
    }

    // Optionally update profiles table if it exists
    try {
      await supabase.from("profiles").upsert(
        {
          user_id: user.id,
          full_name: profileData.full_name,
          avatar_url: profileData.avatar_url,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id",
        }
      );
    } catch (profileError) {
      // Profiles table may not exist, but auth update succeeded
    }

    return { data: null, error: null };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { data: null, error };
  }
}

/**
 * Change the password for the current authenticated user
 * @param currentPassword - Current password for verification
 * @param newPassword - New password to set
 * @returns Success status or error
 */
export async function changePassword(
  currentPassword: string,
  newPassword: string
) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !user.email) {
      throw new Error("No authenticated user");
    }

    // Verify current password by attempting to sign in
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });

    if (signInError) {
      throw new Error("Current password is incorrect");
    }

    // Update to new password
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      throw updateError;
    }

    return { data: true, error: null };
  } catch (error) {
    console.error("Error changing password:", error);
    return { data: null, error };
  }
}

/**
 * Upload an avatar image to Supabase storage
 * @param uri - Local file URI of the image
 * @returns Public URL of uploaded image or null if error
 */
export async function uploadAvatar(uri: string) {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("No authenticated user");
    }

    // Generate unique filename with user folder structure
    const fileExt = uri.split(".").pop() || "jpg";
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`; // Store in user-specific folder

    // Fetch the file from URI
    const response = await fetch(uri);
    const blob = await response.blob();

    // Convert blob to ArrayBuffer using FileReader (React Native compatible)
    const arrayBuffer = await new Promise<ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = reject;
      reader.readAsArrayBuffer(blob);
    });

    // Upload to Supabase storage
    const { error } = await supabase.storage
      .from("avatars")
      .upload(filePath, arrayBuffer, {
        contentType: `image/${fileExt}`,
        upsert: true,
      });

    if (error) {
      throw error;
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("avatars").getPublicUrl(filePath);

    return { data: publicUrl, error: null };
  } catch (error) {
    console.error("Error uploading avatar:", error);
    return { data: null, error };
  }
}
