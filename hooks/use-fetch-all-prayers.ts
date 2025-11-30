import { getPrayers, Prayer } from "@/services/prayers";
import { useEffect, useState } from "react";

export function useFetchAllPrayers() {
  const [allPrayers, setAllPrayers] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrayers = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await getPrayers();

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
  }, []);

  return { allPrayers, loading, error, refetch: fetchPrayers };
}

export default useFetchAllPrayers;
