import useFetchAllPrayers from "@/hooks/use-fetch-all-prayers";
import { Prayer } from "@/services/prayers";
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
  const {
    allPrayers: fetchedPrayers,
    loading,
    error,
    refetch: fetchFromDB,
  } = useFetchAllPrayers();
  const [prayers, setPrayers] = useState<Prayer[]>(fetchedPrayers);

  // Sync with fetched data on initial load and refetch
  useEffect(() => {
    setPrayers(fetchedPrayers);
  }, [fetchedPrayers]);

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
    await fetchFromDB();
  };

  const refetch = async () => {
    await fetchFromDB();
  };

  return (
    <PrayersContext.Provider
      value={{
        prayers,
        loading,
        error,
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
