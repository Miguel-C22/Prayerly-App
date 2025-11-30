import useFetchAllReminders from "@/hooks/use-fetch-all-reminders";
import { Prayer } from "@/services/prayers";
import { ReminderWithPrayer, ReminderType, DayOfWeek } from "@/services/reminders";
import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";

interface RemindersContextType {
  reminders: ReminderWithPrayer[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createOptimistic: (reminder: ReminderWithPrayer) => void;
  updateOptimistic: (
    prayerId: string,
    updates: {
      type: ReminderType | null;
      time: string | null;
      day_of_week?: DayOfWeek;
      enabled?: boolean;
    }
  ) => void;
  updatePrayerInReminders: (prayerId: string, prayerUpdates: Partial<Prayer>) => void;
  deleteOptimistic: (prayerId: string) => void;
  revert: () => Promise<void>;
}

const RemindersContext = createContext<RemindersContextType | undefined>(
  undefined
);

export function RemindersProvider({ children }: { children: ReactNode }) {
  const {
    allReminders: fetchedReminders,
    loading,
    error,
    refetch: fetchFromDB,
  } = useFetchAllReminders();
  const [reminders, setReminders] = useState<ReminderWithPrayer[]>(fetchedReminders);

  // Sync with fetched data on initial load and refetch
  useEffect(() => {
    setReminders(fetchedReminders);
  }, [fetchedReminders]);

  const createOptimistic = (reminder: ReminderWithPrayer) => {
    setReminders((prev) => [reminder, ...prev]);
  };

  const updateOptimistic = (
    prayerId: string,
    updates: {
      type: ReminderType | null;
      time: string | null;
      day_of_week?: DayOfWeek;
      enabled?: boolean;
    }
  ) => {
    setReminders((prev) =>
      prev.map((r) =>
        r.prayer_id === prayerId
          ? {
              ...r,
              type: updates.type,
              time: updates.time,
              day_of_week: updates.day_of_week,
              enabled: updates.enabled ?? r.enabled,
            }
          : r
      )
    );
  };

  const updatePrayerInReminders = (prayerId: string, prayerUpdates: Partial<Prayer>) => {
    setReminders((prev) =>
      prev.map((r) =>
        r.prayer.id === prayerId
          ? {
              ...r,
              prayer: { ...r.prayer, ...prayerUpdates },
            }
          : r
      )
    );
  };

  const deleteOptimistic = (prayerId: string) => {
    setReminders((prev) => prev.filter((r) => r.prayer_id !== prayerId));
  };

  const revert = async () => {
    await fetchFromDB();
  };

  const refetch = async () => {
    await fetchFromDB();
  };

  return (
    <RemindersContext.Provider
      value={{
        reminders,
        loading,
        error,
        refetch,
        createOptimistic,
        updateOptimistic,
        updatePrayerInReminders,
        deleteOptimistic,
        revert,
      }}
    >
      {children}
    </RemindersContext.Provider>
  );
}

export function useReminders() {
  const context = useContext(RemindersContext);
  if (context === undefined) {
    throw new Error("useReminders must be used within a RemindersProvider");
  }
  return context;
}
