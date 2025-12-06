import ErrorState from "@/components/ui/error-state";
import Loader from "@/components/ui/loader";
import PrayerViewModal, { LinkedJournal } from "@/components/ui/modals/prayer-view-modal";
import PrayerCard from "@/components/ui/prayer-card";
import SearchInput from "@/components/ui/search-input";
import SegmentedControl from "@/components/ui/segmented-control";
import { usePrayers } from "@/contexts/PrayersContext";
import { useReminders } from "@/contexts/RemindersContext";
import { useJournal } from "@/contexts/JournalContext";
import { useTheme } from "@/hooks/use-theme";
import { useJournalActions } from "@/hooks/use-journal-actions";
import { deletePrayer, Prayer, updatePrayer } from "@/services/prayers";
import { useState, useMemo } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function HomeScreen() {
  const { colors, neutral } = useTheme();
  const {
    prayers,
    loading,
    error,
    refetch,
    updateOptimistic,
    deleteOptimistic,
    revert,
  } = usePrayers();
  const {
    refetch: refetchReminders,
    updatePrayerInReminders,
    deleteOptimistic: deleteReminderOptimistic,
    revert: revertReminders,
  } = useReminders();
  const { journals } = useJournal();
  const { handleUpdateJournal, handleDeleteJournal } = useJournalActions();
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedPrayer, setSelectedPrayer] = useState<Prayer | null>(null);
  const [showPrayerModal, setShowPrayerModal] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const linkedJournals = useMemo<LinkedJournal[]>(() => {
    if (!selectedPrayer) return [];
    return journals
      .filter((j) => j.linked_prayer_id === selectedPrayer.id)
      .map((j) => ({
        id: j.id,
        date: j.date,
        preview: j.content, // Will display full content in modal
      }));
  }, [selectedPrayer, journals]);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Pull-to-refresh is the only time we fetch from database
    await Promise.all([refetch(), refetchReminders()]);
    setRefreshing(false);
  };

  const handleOpenPrayer = (prayer: Prayer) => {
    setSelectedPrayer(prayer);
    setShowPrayerModal(true);
  };

  const handleDeletePrayer = async (prayerId: string) => {
    try {
      // Optimistically delete from both contexts
      deleteOptimistic(prayerId);
      deleteReminderOptimistic(prayerId);
      setShowPrayerModal(false);

      // Delete from database in background
      const { error } = await deletePrayer(prayerId);

      if (error) {
        // Revert both contexts
        await Promise.all([revert(), revertReminders()]);
        throw new Error("Failed to delete prayer");
      }
    } catch (error) {
      // Revert both contexts
      await Promise.all([revert(), revertReminders()]);
      throw error;
    }
  };

  const handleSavePrayer = async (updatedPrayer: Prayer) => {
    try {
      const updates = {
        title: updatedPrayer.title,
        description: updatedPrayer.description,
        answered: updatedPrayer.answered,
      };

      // Optimistically update both contexts
      updateOptimistic(updatedPrayer.id, updates);
      updatePrayerInReminders(updatedPrayer.id, updates);
      setSelectedPrayer({ ...updatedPrayer, ...updates });
      setShowPrayerModal(false);

      // Save to database in background
      const { data, error } = await updatePrayer(updatedPrayer.id, updates);

      if (error || !data) {
        // Revert both contexts
        await Promise.all([revert(), revertReminders()]);
        throw new Error("Failed to update prayer");
      }

      // Update selectedPrayer with actual DB response
      setSelectedPrayer(data);
    } catch (error) {
      // Revert both contexts
      await Promise.all([revert(), revertReminders()]);
      throw error;
    }
  };

  // Filter prayers based on tab and search
  const filteredPrayers = prayers.filter((prayer) => {
    const matchesTab = selectedTab === 0 ? !prayer.answered : prayer.answered;
    const matchesSearch = prayer.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  if (loading && prayers.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Loader text="Loading prayers..." />
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
      <View style={styles.content}>
        {/* Segmented Control */}
        <SegmentedControl
          options={["Unanswered", "Answered"]}
          selectedIndex={selectedTab}
          onSelect={setSelectedTab}
        />

        {/* Search Input */}
        <SearchInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search prayers..."
        />

        {/* Prayer List */}
        <ScrollView
          style={styles.scrollView}
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
          {filteredPrayers.length === 0 ? (
            <Pressable style={styles.fillSpaceEmpty} onPress={() => {}}>
              <View style={styles.emptyState}>
                <Text style={[styles.emptyText, { color: colors.subtext }]}>
                  {searchQuery
                    ? "No prayers found"
                    : selectedTab === 0
                    ? "No unanswered prayers"
                    : "No answered prayers yet"}
                </Text>
              </View>
            </Pressable>
          ) : (
            <>
              {filteredPrayers.map((prayer) => (
                <PrayerCard
                  key={prayer.id}
                  prayer={prayer}
                  onPress={() => handleOpenPrayer(prayer)}
                />
              ))}
              <Pressable style={styles.fillSpace} onPress={() => {}} />
            </>
          )}
        </ScrollView>
      </View>

      {/* Prayer Modal */}
      <PrayerViewModal
        visible={showPrayerModal}
        onClose={() => setShowPrayerModal(false)}
        prayer={selectedPrayer}
        linkedJournals={linkedJournals}
        onSave={handleSavePrayer}
        onDelete={handleDeletePrayer}
        onUpdateJournal={handleUpdateJournal}
        onDeleteJournal={handleDeleteJournal}
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
    paddingTop: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
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
