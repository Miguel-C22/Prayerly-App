import useFetchProfile from "@/hooks/use-fetch-profile";
import { Profile } from "@/services/profile";
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";

interface ProfileContextType {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateOptimistic: (updates: Partial<Profile>) => void;
  revert: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(
  undefined
);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const {
    profile: fetchedProfile,
    loading,
    error,
    refetch: fetchFromDB,
  } = useFetchProfile();
  const [profile, setProfile] = useState<Profile | null>(fetchedProfile);

  // Sync with fetched data on initial load and refetch
  useEffect(() => {
    setProfile(fetchedProfile);
  }, [fetchedProfile]);

  const updateOptimistic = (updates: Partial<Profile>) => {
    setProfile((prev) => (prev ? { ...prev, ...updates } : null));
  };

  const revert = async () => {
    await fetchFromDB();
  };

  const refetch = async () => {
    await fetchFromDB();
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        loading,
        error,
        refetch,
        updateOptimistic,
        revert,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}
