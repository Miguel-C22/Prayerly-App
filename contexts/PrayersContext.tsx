import useFetchAllPrayers from "@/hooks/use-fetch-all-prayers";
import { Prayer } from "@/services/prayers";
import { PRAYER_FILTERING_THRESHOLD } from "@/constants/app-config";
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";

interface PrayersContextType {
  prayers: Prayer[];
  loading: boolean;
  error: string | null;
  selectedTagId: string | null;
  setSelectedTagId: (tagId: string | null) => void;
  refetch: () => Promise<void>;
  createOptimistic: (prayer: Prayer) => void;
  updateOptimistic: (id: string, updates: Partial<Prayer>) => void;
  deleteOptimistic: (id: string) => void;
  revert: () => Promise<void>;
}

const PrayersContext = createContext<PrayersContextType | undefined>(
  undefined
);

export function PrayersProvider({ children }: { children: ReactNode }) {
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const [totalPrayerCount, setTotalPrayerCount] = useState<number>(0);

  // Determine filtering mode based on prayer count
  const useServerSideFiltering = totalPrayerCount >= PRAYER_FILTERING_THRESHOLD;

  const {
    allPrayers: fetchedPrayers,
    loading,
    error,
    refetchWithTag,
  } = useFetchAllPrayers(useServerSideFiltering ? selectedTagId : null);
  const [prayers, setPrayers] = useState<Prayer[]>(fetchedPrayers);

  // Sync with fetched data and apply client-side filtering when below threshold
  useEffect(() => {
    if (useServerSideFiltering) {
      // Server already filtered, use as-is
      setPrayers(fetchedPrayers);
    } else {
      // Client-side filtering needed
      if (selectedTagId === null) {
        // Show all prayers
        setPrayers(fetchedPrayers);
      } else {
        // Filter by selected tag
        const filtered = fetchedPrayers.filter(
          (prayer) => prayer.tag_id === selectedTagId
        );
        setPrayers(filtered);
      }
    }

    // Update total count when fetching all prayers (not when fetching filtered subset)
    if (selectedTagId === null || !useServerSideFiltering) {
      setTotalPrayerCount(fetchedPrayers.length);
    }
  }, [fetchedPrayers, selectedTagId, useServerSideFiltering]);

  // Debug logging for filtering mode (development only)
  useEffect(() => {
    if (__DEV__) {
      console.log(
        `Prayer filtering mode: ${
          useServerSideFiltering ? "SERVER-SIDE" : "CLIENT-SIDE"
        } (${totalPrayerCount} prayers)`
      );
    }
  }, [useServerSideFiltering, totalPrayerCount]);

  const createOptimistic = (prayer: Prayer) => {
    setPrayers((prev) => [prayer, ...prev]);
  };

  const updateOptimistic = (id: string, updates: Partial<Prayer>) => {
    setPrayers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const deleteOptimistic = (id: string) => {
    setPrayers((prev) => prev.filter((p) => p.id !== id));
  };

  const revert = async () => {
    await refetchWithTag(selectedTagId);
  };

  const refetch = async () => {
    await refetchWithTag(selectedTagId);
  };

  return (
    <PrayersContext.Provider
      value={{
        prayers,
        loading,
        error,
        selectedTagId,
        setSelectedTagId,
        refetch,
        createOptimistic,
        updateOptimistic,
        deleteOptimistic,
        revert,
      }}
    >
      {children}
    </PrayersContext.Provider>
  );
}

export function usePrayers() {
  const context = useContext(PrayersContext);
  if (context === undefined) {
    throw new Error("usePrayers must be used within a PrayersProvider");
  }
  return context;
}
