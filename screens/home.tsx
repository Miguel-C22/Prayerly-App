import PrayerEditModal from "@/components/ui/modals/prayer-edit-modal";
import PrayerViewModal, {
  LinkedJournal,
} from "@/components/ui/modals/prayer-view-modal";
import PrayerCard, { Prayer } from "@/components/ui/prayer-card";
import SearchInput from "@/components/ui/search-input";
import SegmentedControl from "@/components/ui/segmented-control";
import { useTheme } from "@/hooks/use-theme";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const MOCK_PRAYERS: Prayer[] = [
  {
    id: "1",
    title: "For Mom's health",
    description:
      "Praying for my mother's recovery from her surgery. Lord, guide the doctors and bring her strength.",
    answered: false,
    createdAt: "April 15, 2024",
  },
  {
    id: "2",
    title: "Wisdom for my family",
    description:
      "Asking God for wisdom in making important family decisions about moving to a new city.",
    answered: false,
    createdAt: "April 10, 2024",
  },
  {
    id: "3",
    title: "Peace during a difficult time",
    description:
      "Going through a challenging season at work. Praying for peace and clarity.",
    answered: false,
    createdAt: "April 5, 2024",
  },
  {
    id: "4",
    title: "Guidance for career change",
    description: "Seeking God's direction as I consider a new job opportunity.",
    answered: false,
    createdAt: "March 28, 2024",
  },
  {
    id: "5",
    title: "Healing for a friend",
    description:
      "My close friend was diagnosed with an illness. Praying for complete healing.",
    answered: false,
    createdAt: "March 20, 2024",
  },
  {
    id: "6",
    title: "Strength to overcome anxiety",
    description:
      "Struggling with anxiety lately. Asking for God's peace that surpasses understanding.",
    answered: true,
    createdAt: "March 15, 2024",
  },
  {
    id: "7",
    title: "Restoration of relationship",
    description:
      "Praying for reconciliation with a family member after a disagreement.",
    answered: true,
    createdAt: "March 10, 2024",
  },
  {
    id: "8",
    title: "Financial provision",
    description: "Trusting God for provision during an unexpected expense.",
    answered: true,
    createdAt: "February 28, 2024",
  },
  {
    id: "9",
    title: "Safe travels",
    description: "Praying for safety during my upcoming trip.",
    answered: true,
    createdAt: "February 20, 2024",
  },
  {
    id: "10",
    title: "Patience with children",
    description: "Asking for more patience and wisdom in parenting my kids.",
    answered: true,
    createdAt: "February 15, 2024",
  },
];

const MOCK_LINKED_JOURNALS: LinkedJournal[] = [
  {
    id: "1",
    date: "April 28, 2024",
    preview:
      "Reflecting on His grace today. I felt a profound sense of peace...",
  },
  {
    id: "2",
    date: "April 25, 2024",
    preview: "Grateful for the small blessings - a warm cup of coffee...",
  },
];

export default function HomeScreen() {
  const { colors } = useTheme();
  const [prayers, setPrayers] = useState(MOCK_PRAYERS);
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPrayer, setSelectedPrayer] = useState<Prayer | null>(null);
  const [showPrayerModal, setShowPrayerModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleToggleAnswered = (prayerId: string, answered: boolean) => {
    setPrayers((prev) =>
      prev.map((p) => (p.id === prayerId ? { ...p, answered } : p))
    );
  };

  const handleOpenPrayer = (prayer: Prayer) => {
    setSelectedPrayer(prayer);
    setShowPrayerModal(true);
  };

  const handleDeletePrayer = (prayerId: string) => {
    setPrayers((prev) => prev.filter((p) => p.id !== prayerId));
    setShowPrayerModal(false);
  };

  const handleEditPrayer = () => {
    setShowPrayerModal(false);
    setShowEditModal(true);
  };

  const handleSavePrayer = (updatedPrayer: Prayer) => {
    setPrayers((prev) =>
      prev.map((p) => (p.id === updatedPrayer.id ? updatedPrayer : p))
    );
    setSelectedPrayer(updatedPrayer);
    setShowEditModal(false);
    setShowPrayerModal(true);
  };

  // Filter prayers based on tab and search
  const filteredPrayers = prayers.filter((prayer) => {
    const matchesTab = selectedTab === 0 ? !prayer.answered : prayer.answered;
    const matchesSearch = prayer.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

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
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
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
            filteredPrayers.map((prayer) => (
              <PrayerCard
                key={prayer.id}
                prayer={prayer}
                onPress={() => handleOpenPrayer(prayer)}
                onToggleAnswered={(answered) =>
                  handleToggleAnswered(prayer.id, answered)
                }
              />
            ))
          )}
        </ScrollView>
      </View>

      {/* Prayer View Modal */}
      <PrayerViewModal
        visible={showPrayerModal}
        onClose={() => setShowPrayerModal(false)}
        prayer={selectedPrayer}
        linkedJournals={MOCK_LINKED_JOURNALS}
        onEdit={handleEditPrayer}
        onDelete={handleDeletePrayer}
      />

      {/* Prayer Edit Modal */}
      <PrayerEditModal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        prayer={selectedPrayer}
        onSave={handleSavePrayer}
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
  scrollContent: {
    paddingBottom: 40,
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
