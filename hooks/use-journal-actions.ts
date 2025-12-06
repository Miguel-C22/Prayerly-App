import { useJournal } from "@/contexts/JournalContext";
import { updateJournal, deleteJournal } from "@/services/journal";
import { JournalEntry } from "@/components/ui/modals/journal-edit-modal";

export function useJournalActions() {
  const {
    updateOptimistic,
    deleteOptimistic,
    revert,
  } = useJournal();

  const handleUpdateJournal = async (journal: JournalEntry) => {
    try {
      const updates = {
        content: journal.content,
        date: journal.date,
        linked_prayer_id: journal.linkedPrayerId,
      };

      updateOptimistic(journal.id, updates);

      const { error } = await updateJournal(journal.id, updates);

      if (error) {
        await revert();
        throw new Error("Failed to update journal");
      }
    } catch (error) {
      await revert();
      throw error;
    }
  };

  const handleDeleteJournal = async (journalId: string) => {
    try {
      deleteOptimistic(journalId);

      const { error } = await deleteJournal(journalId);

      if (error) {
        await revert();
        throw new Error("Failed to delete journal");
      }
    } catch (error) {
      await revert();
      throw error;
    }
  };

  return {
    handleUpdateJournal,
    handleDeleteJournal,
  };
}
