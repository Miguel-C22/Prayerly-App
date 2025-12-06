import { getPrayers, Prayer } from "@/services/prayers";
import { useEffect, useState } from "react";

export function useFetchAllPrayers(tagId?: string | null) {
  const [allPrayers, setAllPrayers] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrayers = async (filterTagId?: string | null) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await getPrayers(filterTagId ?? tagId);

      if (fetchError) {
        setError("Failed to fetch prayers");
        return;
      }

      setAllPrayers(data || []);
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrayers();
  }, [tagId]);

  const refetchWithTag = async (newTagId?: string | null) => {
    await fetchPrayers(newTagId);
  };

  return { allPrayers, loading, error, refetch: fetchPrayers, refetchWithTag };
}

export default useFetchAllPrayers;
