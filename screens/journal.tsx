import JournalCard from "@/components/ui/journal-card";
import JournalEditModal, {
  JournalEntry,
} from "@/components/ui/modals/journal-edit-modal";
import { useTheme } from "@/hooks/use-theme";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

const MOCK_JOURNALS: JournalEntry[] = [
  {
    id: "1",
    date: "April 28, 2024",
    content:
      "Reflecting on His grace today. I felt a profound sense of peace during my morning prayer time. God reminded me that His mercies are new every morning.",
    linkedPrayerId: "1",
  },
  {
    id: "2",
    date: "April 25, 2024",
    content:
      "Grateful for the small blessings - a warm cup of coffee, a kind word from a friend, and the sunshine streaming through my window.",
    linkedPrayerId: "2",
  },
  {
    id: "3",
    date: "April 22, 2024",
    content:
      "Struggling today but finding comfort in scripture. 'Cast all your anxiety on him because he cares for you.' - 1 Peter 5:7",
  },
  {
    id: "4",
    date: "April 19, 2024",
    content:
      "Had a breakthrough moment during worship today. Felt God's presence so strongly. Reminded that He is faithful even when I doubt.",
    linkedPrayerId: "3",
  },
  {
    id: "5",
    date: "April 16, 2024",
    content:
      "Prayed for patience today and it was immediately tested! Learning that growth often comes through challenges.",
  },
  {
    id: "6",
    date: "April 13, 2024",
    content:
      "Thankful for my small group tonight. We shared our struggles and prayed together. There's something powerful about community.",
    linkedPrayerId: "1",
  },
  {
    id: "7",
    date: "April 10, 2024",
    content:
      "Read Psalm 23 this morning. 'The Lord is my shepherd, I lack nothing.' Meditating on what it means to truly trust Him as my provider.",
    linkedPrayerId: "2",
  },
  {
    id: "8",
    date: "April 7, 2024",
    content:
      "Difficult conversation with a family member today. Praying for wisdom and reconciliation. Lord, help me to be a peacemaker.",
  },
  {
    id: "9",
    date: "April 4, 2024",
    content:
      "Woke up early for quiet time before the day started. There's something special about meeting with God in the stillness of the morning.",
    linkedPrayerId: "3",
  },
  {
    id: "10",
    date: "April 1, 2024",
    content:
      "New month, fresh start. Setting an intention to be more consistent in prayer. Lord, help me to seek You first each day.",
  },
];

const MOCK_PRAYERS: any[] = [
  { id: "1", title: "Prayer for Guidance" },
  { id: "2", title: "For my family's health" },
  { id: "3", title: "Gratitude for blessings" },
];

export default function JournalScreen() {
  const { colors } = useTheme();
  const [journals, setJournals] = useState(MOCK_JOURNALS);
  const [selectedJournal, setSelectedJournal] = useState<JournalEntry | null>(
    null
  );
  const [showEditModal, setShowEditModal] = useState(false);

  const handleOpenJournal = (journal: JournalEntry) => {
    setSelectedJournal(journal);
    setShowEditModal(true);
  };

  const handleSaveJournal = (updatedJournal: JournalEntry) => {
    setJournals((prev) =>
      prev.map((j) => (j.id === updatedJournal.id ? updatedJournal : j))
    );
    setShowEditModal(false);
  };

  const handleDeleteJournal = (journalId: string) => {
    setJournals((prev) => prev.filter((j) => j.id !== journalId));
    setShowEditModal(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {journals.map((journal) => (
          <JournalCard
            key={journal.id}
            date={journal.date}
            preview={journal.content}
            onPress={() => handleOpenJournal(journal)}
          />
        ))}
      </ScrollView>

      <JournalEditModal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        journal={selectedJournal}
        prayers={MOCK_PRAYERS}
        onSave={handleSaveJournal}
        onDelete={handleDeleteJournal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 40,
  },
});
