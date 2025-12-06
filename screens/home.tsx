import ErrorState from "@/components/ui/error-state";
import Loader from "@/components/ui/loader";
import PrayerViewModal, { LinkedJournal } from "@/components/ui/modals/prayer-view-modal";
import PrayerCard from "@/components/ui/prayer-card";
import SearchInput from "@/components/ui/search-input";
import SegmentedControl from "@/components/ui/segmented-control";
import StatusCard from "@/components/ui/status-card";
import TagFilterList from "@/components/ui/tag-filter-list";
import VerseCard from "@/components/ui/verse-card";
import { getRandomVerse } from "@/constants/verses";
import { usePrayers } from "@/contexts/PrayersContext";
import { useReminders } from "@/contexts/RemindersContext";
import { useJournal } from "@/contexts/JournalContext";
import { useTheme } from "@/hooks/use-theme";
import { useJournalActions } from "@/hooks/use-journal-actions";
import { deletePrayer, Prayer, updatePrayer } from "@/services/prayers";
import { getTags, Tag } from "@/services/tags";
import { useState, useMemo, useEffect } from "react";
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
    selectedTagId,
    setSelectedTagId,
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
  const [tags, setTags] = useState<Tag[]>([]);
  const [currentVerse] = useState(() => getRandomVerse());

  // Fetch tags on mount
  useEffect(() => {
    const fetchTags = async () => {
      const { data } = await getTags();
      if (data) setTags(data);
    };
    fetchTags();
  }, []);

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
        tag_id: updatedPrayer.tag_id,
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

  // Calculate stats for status card
  const unansweredCount = prayers.filter((p) => !p.answered).length;
  const answeredCount = prayers.filter((p) => p.answered).length;
  const journalCount = journals.length;

  // Filter prayers based on tab and search (tags filtered server-side)
  const filteredPrayers = prayers.filter((prayer) => {
    const matchesTab = selectedTab === 0 ? !prayer.answered : prayer.answered;
    const matchesSearch = prayer.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // Get tag for each prayer
  const getPrayerTag = (prayer: Prayer) => {
    if (!prayer.tag_id) return null;
    return tags.find((tag) => tag.id === prayer.tag_id) || null;
  };

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
        <View style={styles.content}>
          {/* Verse Card */}
          <VerseCard verse={currentVerse} />

          {/* Status Card */}
          <StatusCard
            unansweredCount={unansweredCount}
            answeredCount={answeredCount}
            journalCount={journalCount}
          />

          {/* Tag Filter List */}
          <TagFilterList
            tags={tags}
            selectedTagId={selectedTagId}
            onSelectTag={setSelectedTagId}
          />

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
          {filteredPrayers.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyText, { color: colors.subtext }]}>
                {searchQuery
                  ? "No prayers found"
                  : selectedTab === 0
                  ? "No unanswered prayers"
                  : "No answered prayers yet"}
              </Text>
            </View>
          ) : (
            <>
              {filteredPrayers.map((prayer) => (
                <PrayerCard
                  key={prayer.id}
                  prayer={prayer}
                  tag={getPrayerTag(prayer)}
                  onPress={() => handleOpenPrayer(prayer)}
                />
              ))}
              <View style={styles.fillSpace} />
            </>
          )}
        </View>
      </ScrollView>

      {/* Prayer Modal */}
      <PrayerViewModal
        visible={showPrayerModal}
        onClose={() => setShowPrayerModal(false)}
        prayer={selectedPrayer}
        linkedJournals={linkedJournals}
        tags={tags}
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
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  fillSpace: {
    height: 100,
  },
  emptyState: {
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 60,
  },
  emptyText: {
    fontSize: 16,
  },
});
