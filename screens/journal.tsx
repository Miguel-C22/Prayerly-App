import ErrorState from "@/components/ui/error-state";
import JournalCard from "@/components/ui/journal-card";
import Loader from "@/components/ui/loader";
import JournalEditModal, {
  JournalEntry,
} from "@/components/ui/modals/journal-edit-modal";
import { useJournal } from "@/contexts/JournalContext";
import { useTheme } from "@/hooks/use-theme";
import { useJournalActions } from "@/hooks/use-journal-actions";
import { useEffect, useState } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function JournalScreen() {
  const { colors, neutral } = useTheme();
  const {
    journals: allJournals,
    loading,
    error,
    refetch,
  } = useJournal();
  const { handleUpdateJournal, handleDeleteJournal } = useJournalActions();
  const [journals, setJournals] = useState<JournalEntry[]>([]);
  const [selectedJournal, setSelectedJournal] = useState<JournalEntry | null>(
    null
  );
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Pull-to-refresh is the only time we fetch from database
    await refetch();
    setRefreshing(false);
  };

  // Transform journals data to match JournalEntry interface
  useEffect(() => {
    const transformedJournals = allJournals.map((journal) => ({
      id: journal.id,
      date: journal.date,
      content: journal.content,
      linkedPrayerId: journal.linked_prayer_id,
    }));
    setJournals(transformedJournals);
  }, [allJournals]);

  const handleOpenJournal = (journal: JournalEntry) => {
    setSelectedJournal(journal);
    setShowEditModal(true);
  };

  if (loading && journals.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Loader text="Loading journals..." />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ErrorState message={error} onRetry={refetch} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        alwaysBounceVertical={true}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={neutral.primary}
            colors={[neutral.primary]}
          />
        }
      >
        <Pressable style={styles.fillSpaceEmpty} onPress={() => {}}>
          {journals.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyText, { color: colors.subtext }]}>
                No journal entries yet
              </Text>
            </View>
          ) : (
            <>
              {journals.map((journal) => (
                <JournalCard
                  key={journal.id}
                  date={journal.date}
                  preview={journal.content}
                  onPress={() => handleOpenJournal(journal)}
                />
              ))}
            </>
          )}
        </Pressable>
      </ScrollView>

      <JournalEditModal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        journal={selectedJournal}
        onSave={handleUpdateJournal}
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
    flexGrow: 1,
  },
  fillSpace: {
    height: 100,
  },
  fillSpaceEmpty: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 16,
  },
});
