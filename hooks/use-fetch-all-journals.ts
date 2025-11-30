import { getJournals, Journal } from "@/services/journal";
import { useEffect, useState } from "react";

export function useFetchAllJournals() {
  const [allJournals, setAllJournals] = useState<Journal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchJournals = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await getJournals();

      if (fetchError) {
        setError("Failed to fetch journals");
        return;
      }

      setAllJournals(data || []);
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJournals();
  }, []);

  return { allJournals, loading, error, refetch: fetchJournals };
}

export default useFetchAllJournals;
