import useFetchAllJournals from "@/hooks/use-fetch-all-journals";
import { Journal } from "@/services/journal";
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";

interface JournalContextType {
  journals: Journal[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createOptimistic: (journal: Journal) => void;
  updateOptimistic: (id: string, updates: Partial<Journal>) => void;
  deleteOptimistic: (id: string) => void;
  revert: () => Promise<void>;
}

const JournalContext = createContext<JournalContextType | undefined>(
  undefined
);

export function JournalProvider({ children }: { children: ReactNode }) {
  const {
    allJournals: fetchedJournals,
    loading,
    error,
    refetch: fetchFromDB,
  } = useFetchAllJournals();
  const [journals, setJournals] = useState<Journal[]>(fetchedJournals);

  // Sync with fetched data on initial load and refetch
  useEffect(() => {
    setJournals(fetchedJournals);
  }, [fetchedJournals]);

  const createOptimistic = (journal: Journal) => {
    setJournals((prev) => [journal, ...prev]);
  };

  const updateOptimistic = (id: string, updates: Partial<Journal>) => {
    setJournals((prev) =>
      prev.map((j) => (j.id === id ? { ...j, ...updates } : j))
    );
  };

  const deleteOptimistic = (id: string) => {
    setJournals((prev) => prev.filter((j) => j.id !== id));
  };

  const revert = async () => {
    await fetchFromDB();
  };

  const refetch = async () => {
    await fetchFromDB();
  };

  return (
    <JournalContext.Provider
      value={{
        journals,
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
    </JournalContext.Provider>
  );
}

export function useJournal() {
  const context = useContext(JournalContext);
  if (context === undefined) {
    throw new Error("useJournal must be used within a JournalProvider");
  }
  return context;
}
