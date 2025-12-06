import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import PrayerPickerModal from "@/components/ui/modals/prayer-picker-modal";
import ReminderSettingsModal, {
  ReminderSettings,
} from "@/components/ui/modals/reminder-settings-modal";
import TagPickerModal from "@/components/ui/modals/tag-picker-modal";
import TagSelectorCard from "@/components/ui/tag-selector-card";
import SegmentedControl from "@/components/ui/segmented-control";
import { useJournal } from "@/contexts/JournalContext";
import { usePrayers } from "@/contexts/PrayersContext";
import { useReminders } from "@/contexts/RemindersContext";
import { useTheme } from "@/hooks/use-theme";
import { createJournal } from "@/services/journal";
import { createPrayer, Prayer } from "@/services/prayers";
import { setReminder } from "@/services/reminders";
import { getTags, Tag } from "@/services/tags";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function CreateScreen() {
  const { colors, neutral } = useTheme();
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const [prayerTitle, setPrayerTitle] = useState<string>("");
  const [prayerDescription, setPrayerDescription] = useState<string>("");
  const [reminderSettings, setReminderSettings] = useState<ReminderSettings>({
    type: null,
    time: "9:00 AM",
  });
  const [journalContent, setJournalContent] = useState<string>("");
  const [linkedPrayer, setLinkedPrayer] = useState<Prayer | null>(null);
  const [showPrayerPicker, setShowPrayerPicker] = useState<boolean>(false);
  const [showReminderSettings, setShowReminderSettings] =
    useState<boolean>(false);
  const [showTagPicker, setShowTagPicker] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingJournal, setIsLoadingJournal] = useState<boolean>(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
  const { createOptimistic: createPrayerOptimistic, revert: revertPrayers } =
    usePrayers();
  const { createOptimistic: createReminderOptimistic } = useReminders();
  const { createOptimistic: createJournalOptimistic, revert: revertJournals } =
    useJournal();

  // Fetch tags on mount
  useEffect(() => {
    const fetchTags = async () => {
      const { data } = await getTags();
      if (data) setTags(data);
    };
    fetchTags();
  }, []);

  const handleCreatePrayer = async () => {
    try {
      setIsLoading(true);

      // Create prayer in database first (need the ID)
      const { data: prayer, error: prayerError } = await createPrayer({
        title: prayerTitle,
        description: prayerDescription,
        tag_id: selectedTagId,
      });

      if (prayerError || !prayer) {
        setIsLoading(false);
        return;
      }

      // Optimistically add prayer to context (no refetch needed!)
      createPrayerOptimistic(prayer);

      // Only set reminder if user selected one
      if (reminderSettings.type && prayer.id) {
        const { data: reminder, error: reminderError } = await setReminder({
          prayer_id: prayer.id,
          type: reminderSettings.type,
          time: reminderSettings.time,
          day_of_week: reminderSettings.dayOfWeek,
        });

        if (reminderError) {
          // Revert prayer creation on reminder error
          await revertPrayers();
          setIsLoading(false);
          return;
        }

        // Optimistically add reminder to context (if we got data back)
        if (reminder) {
          createReminderOptimistic({
            ...reminder,
            prayer: prayer,
          });
        }
      }

      // Clear form
      setPrayerTitle("");
      setPrayerDescription("");
      setReminderSettings({ type: null, time: "9:00 AM" });
      setSelectedTagId(null);
    } catch (error) {
      await revertPrayers();
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateJournal = async () => {
    try {
      setIsLoadingJournal(true);

      // Get current date in the format expected by the database
      const currentDate = new Date().toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      // Create journal in database first (need the ID)
      const { data: journal, error: journalError } = await createJournal({
        content: journalContent,
        date: currentDate,
        linked_prayer_id: linkedPrayer?.id,
      });

      if (journalError || !journal) {
        setIsLoadingJournal(false);
        return;
      }

      // Optimistically add journal to context (no refetch needed!)
      createJournalOptimistic(journal);

      // Clear form after successful creation
      setJournalContent("");
      setLinkedPrayer(null);
    } catch (error) {
      await revertJournals();
    } finally {
      setIsLoadingJournal(false);
    }
  };

  const handleSelectPrayer = () => {
    setShowPrayerPicker(true);
  };

  const handleSaveReminderSettings = async (settings: ReminderSettings) => {
    setReminderSettings(settings);
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

            <TagSelectorCard
              tags={tags}
              selectedTagId={selectedTagId}
              onPress={() => setShowTagPicker(true)}
            />

            <TouchableOpacity
              style={[styles.reminderCard, { backgroundColor: colors.card }]}
              onPress={() => setShowReminderSettings(true)}
              activeOpacity={0.7}
            >
              <View style={styles.reminderLeft}>
                <View
                  style={[
                    styles.reminderIconContainer,
                    { backgroundColor: colors.background },
                  ]}
                >
                  <Ionicons
                    name={
                      reminderSettings.type
                        ? "notifications-outline"
                        : "notifications-off-outline"
                    }
                    size={20}
                    color={neutral.primary}
                  />
                </View>
                <View>
                  <Text style={[styles.reminderLabel, { color: colors.text }]}>
                    Prayer Reminder
                  </Text>
                  <Text
                    style={[styles.reminderSubtext, { color: colors.subtext }]}
                  >
                    {reminderSettings.type === "daily"
                      ? `Daily at ${reminderSettings.time}`
                      : reminderSettings.type === "weekly" &&
                        reminderSettings.dayOfWeek
                      ? `${
                          reminderSettings.dayOfWeek.charAt(0).toUpperCase() +
                          reminderSettings.dayOfWeek.slice(1)
                        }s at ${reminderSettings.time}`
                      : "No reminder set"}
                  </Text>
                </View>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={colors.subtext}
              />
            </TouchableOpacity>

            <Button
              label="Create Prayer"
              onPress={handleCreatePrayer}
              style={styles.createButton}
              loading={isLoading}
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
              loading={isLoadingJournal}
            />
          </>
        )}
      </ScrollView>

      {/* Prayer Picker Modal */}
      <PrayerPickerModal
        visible={showPrayerPicker}
        onClose={() => setShowPrayerPicker(false)}
        selectedPrayer={linkedPrayer}
        onSelectPrayer={setLinkedPrayer}
      />

      {/* Tag Picker Modal */}
      <TagPickerModal
        visible={showTagPicker}
        onClose={() => setShowTagPicker(false)}
        tags={tags}
        selectedTagId={selectedTagId}
        onSelectTag={setSelectedTagId}
      />

      {/* Reminder Settings Modal */}
      <ReminderSettingsModal
        visible={showReminderSettings}
        onClose={() => setShowReminderSettings(false)}
        onSave={handleSaveReminderSettings}
        initialSettings={reminderSettings}
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
  reminderCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 16,
    padding: 16,
    marginTop: 24,
  },
  reminderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  reminderIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  reminderLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  reminderSubtext: {
    fontSize: 13,
    marginTop: 2,
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
