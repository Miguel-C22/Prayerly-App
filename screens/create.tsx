import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import PrayerPickerModal, {
  Prayer,
} from "@/components/ui/modals/prayer-picker-modal";
import SegmentedControl from "@/components/ui/segmented-control";
import ToggleCard from "@/components/ui/toggle-card";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const MOCK_PRAYERS: Prayer[] = [
  { id: "1", title: "Prayer for Guidance" },
  { id: "2", title: "For my family's health" },
  { id: "3", title: "Gratitude for blessings" },
];

export default function CreateScreen() {
  const { colors, neutral } = useTheme();
  const [selectedTab, setSelectedTab] = useState(0);
  const [prayerTitle, setPrayerTitle] = useState("");
  const [prayerDescription, setPrayerDescription] = useState("");
  const [dailyReminder, setDailyReminder] = useState(false);
  const [weeklyReminder, setWeeklyReminder] = useState(false);
  const [journalContent, setJournalContent] = useState("");
  const [linkedPrayer, setLinkedPrayer] = useState<Prayer | null>(null);
  const [showPrayerPicker, setShowPrayerPicker] = useState(false);

  const handleCreatePrayer = () => {
    console.log({
      prayerTitle,
      prayerDescription,
      dailyReminder,
      weeklyReminder,
    });
  };

  const handleCreateJournal = () => {
    console.log({ journalContent, linkedPrayerId: linkedPrayer?.id });
  };

  const handleSelectPrayer = () => {
    setShowPrayerPicker(true);
  };

  const today = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <SegmentedControl
          options={["Prayer", "Journal"]}
          selectedIndex={selectedTab}
          onSelect={setSelectedTab}
        />

        {selectedTab === 0 ? (
          // Prayer Form
          <>
            <Input
              value={prayerTitle}
              onChangeText={setPrayerTitle}
              placeholder="What are you praying for?"
              displayLabel={true}
              label="Title"
            />

            <Input
              value={prayerDescription}
              onChangeText={setPrayerDescription}
              placeholder="Add more details..."
              displayLabel={true}
              label="Description"
              multiline={true}
              style={{ height: 200, paddingTop: 16 }}
            />

            <View style={[styles.card, { backgroundColor: colors.card }]}>
              <ToggleCard
                value={dailyReminder}
                onValueChange={setDailyReminder}
                icon="notifications-outline"
                displayIcon={true}
                label="Daily reminder"
              />
              <View
                style={[styles.divider, { backgroundColor: colors.background }]}
              />
              <ToggleCard
                value={weeklyReminder}
                onValueChange={setWeeklyReminder}
                icon="calendar-outline"
                displayIcon={true}
                label="Weekly reminder"
              />
            </View>

            <Button
              label="Create Prayer"
              onPress={handleCreatePrayer}
              style={styles.createButton}
            />
          </>
        ) : (
          // Journal Form
          <>
            <Text style={[styles.dateText, { color: colors.subtext }]}>
              {today}
            </Text>

            <TouchableOpacity
              style={[styles.prayerSelector, { borderColor: colors.card }]}
              onPress={handleSelectPrayer}
            >
              <View style={styles.prayerLeft}>
                <Ionicons name="link" size={18} color={neutral.primary} />
                <Text style={[styles.prayerText, { color: neutral.primary }]}>
                  {linkedPrayer?.title || "Link to Prayer (optional)"}
                </Text>
              </View>
              <Ionicons name="chevron-down" size={20} color={colors.subtext} />
            </TouchableOpacity>

            <Text style={[styles.prompt, { color: colors.subtext }]}>
              What are you thankful for today?
            </Text>

            <Input
              value={journalContent}
              onChangeText={setJournalContent}
              placeholder="Write your thoughts..."
              multiline={true}
              style={{ height: 200, paddingTop: 16 }}
            />

            <Button
              label="Create Journal Entry"
              onPress={handleCreateJournal}
              style={styles.createButton}
            />
          </>
        )}
      </ScrollView>

      {/* Prayer Picker Modal */}
      <PrayerPickerModal
        visible={showPrayerPicker}
        onClose={() => setShowPrayerPicker(false)}
        prayers={MOCK_PRAYERS}
        selectedPrayer={linkedPrayer}
        onSelectPrayer={setLinkedPrayer}
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
  createButton: {
    marginTop: 24,
    marginBottom: 40,
  },
  card: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginTop: 24,
  },
  divider: {
    height: 1,
    marginLeft: 52,
  },
  // Journal styles
  dateText: {
    fontSize: 14,
    marginBottom: 16,
  },
  prayerSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  prayerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  prayerText: {
    fontSize: 16,
    fontWeight: "500",
  },
  prompt: {
    fontSize: 16,
    marginBottom: 12,
  },
});
