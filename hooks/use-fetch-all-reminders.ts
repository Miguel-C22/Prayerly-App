import { getReminders, ReminderWithPrayer } from "@/services/reminders";
import { useEffect, useState } from "react";

export function useFetchAllReminders() {
  const [allReminders, setAllReminders] = useState<ReminderWithPrayer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReminders = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await getReminders();

      if (fetchError) {
        setError("Failed to fetch reminders");
        return;
      }

      setAllReminders(data || []);
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  return { allReminders, loading, error, refetch: fetchReminders };
}

export default useFetchAllReminders;
