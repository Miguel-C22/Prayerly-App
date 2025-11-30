import { getUserProfile, Profile } from "@/services/profile";
import { useEffect, useState } from "react";

export default function useFetchProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await getUserProfile();

      if (fetchError || !data) {
        setError("Failed to load profile");
        return;
      }

      setProfile(data);
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return { profile, loading, error, refetch: fetchProfile };
}
