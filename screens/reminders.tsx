import ErrorState from "@/components/ui/error-state";
import Loader from "@/components/ui/loader";
import ReminderSettingsModal, {
  ReminderSettings,
} from "@/components/ui/modals/reminder-settings-modal";
import PrayerReminderCard from "@/components/ui/prayer-reminder-card";
import ToggleCard from "@/components/ui/toggle-card";
import { usePrayers } from "@/contexts/PrayersContext";
import { useReminders } from "@/contexts/RemindersContext";
import { useTheme } from "@/hooks/use-theme";
import { Prayer } from "@/services/prayers";
import { setReminder } from "@/services/reminders";
import { useEffect, useState } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface PrayerWithReminder extends Prayer {
  reminderSettings: ReminderSettings;
}

export default function RemindersScreen() {
  const { colors, neutral } = useTheme();
  const {
    prayers: allPrayers,
    loading: loadingPrayers,
    refetch: refetchPrayers,
  } = usePrayers();
  const {
    reminders,
    loading: loadingReminders,
    error,
    refetch: refetchReminders,
    updateOptimistic,
    revert,
  } = useReminders();
  const [pushNotifications, setPushNotifications] = useState<boolean>(true);
  const [emailNotifications, setEmailNotifications] = useState<boolean>(false);
  const [prayers, setPrayers] = useState<PrayerWithReminder[]>([]);
  const [editingPrayerId, setEditingPrayerId] = useState<string | null>(null);
  const [showReminderSettings, setShowReminderSettings] =
    useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Pull-to-refresh fetches both prayers and reminders
    await Promise.all([refetchPrayers(), refetchReminders()]);
    setRefreshing(false);
  };

  // Combine all prayers with their reminder settings (if they have any)
  useEffect(() => {
    const transformedPrayers = allPrayers.map((prayer) => {
      // Find if this prayer has a reminder
      const reminder = reminders.find((r) => r.prayer_id === prayer.id);

      return {
        ...prayer,
        reminderSettings: reminder
          ? {
              type: reminder.enabled ? reminder.type : null,
              time: reminder.time,
              dayOfWeek: reminder.day_of_week,
            }
          : {
              type: null,
              time: null,
              dayOfWeek: undefined,
            },
      };
    });
    setPrayers(transformedPrayers);
  }, [allPrayers, reminders]);

  const handleEditReminder = (prayerId: string) => {
    setEditingPrayerId(prayerId);
    setShowReminderSettings(true);
  };

  const handleSaveReminderSettings = async (settings: ReminderSettings) => {
    if (!editingPrayerId) return;

    try {
      const updates = {
        type: settings.type,
        time: settings.time,
        day_of_week: settings.dayOfWeek,
        enabled: settings.type !== null, // Enable if type is set, disable if null
      };

      // Optimistically update context
      updateOptimistic(editingPrayerId, updates);

      // Save to database in background
      const { error } = await setReminder({
        prayer_id: editingPrayerId,
        ...updates,
      });

      if (error) {
        // Revert optimistic update
        await revert();
        throw new Error("Failed to update reminder");
      }
    } catch (error) {
      // Revert optimistic update
      await revert();
      throw error;
    }
  };

  if ((loadingPrayers || loadingReminders) && prayers.length === 0) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <Loader text="Loading prayers..." />
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <ErrorState
          message={error}
          onRetry={() => Promise.all([refetchPrayers(), refetchReminders()])}
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
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
      {/* General Notifications Section */}
      <Text style={[styles.sectionTitle, { color: neutral.primary }]}>
        GENERAL NOTIFICATIONS
      </Text>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <ToggleCard
          value={pushNotifications}
          onValueChange={setPushNotifications}
          icon="notifications"
          displayIcon={true}
          label="Push Notifications"
        />
        <View
          style={[styles.divider, { backgroundColor: colors.background }]}
        />
        <ToggleCard
          value={emailNotifications}
          onValueChange={setEmailNotifications}
          icon="mail"
          displayIcon={true}
          label="Email Notifications"
        />
      </View>

      {/* Prayer Requests Section */}
      <Text style={[styles.sectionTitle, { color: neutral.primary }]}>
        REMINDERS FOR PRAYER REQUESTS
      </Text>
      <View style={styles.prayersContainer}>
        {prayers.length === 0 ? (
          <Pressable style={styles.fillSpaceEmpty} onPress={() => {}}>
            <View style={styles.emptyState}>
              <Text style={[styles.emptyText, { color: colors.subtext }]}>
                No prayer reminders yet
              </Text>
            </View>
          </Pressable>
        ) : (
          <>
            {prayers.map((prayer) => (
              <PrayerReminderCard
                key={prayer.id}
                prayer={prayer}
                reminderSettings={prayer.reminderSettings}
                onEditReminder={() => handleEditReminder(prayer.id)}
              />
            ))}
            <Pressable style={styles.fillSpace} onPress={() => {}} />
          </>
        )}
      </View>
      {/* Reminder Settings Modal */}
      <ReminderSettingsModal
        visible={showReminderSettings}
        onClose={() => {
          setShowReminderSettings(false);
          setEditingPrayerId(null);
        }}
        onSave={handleSaveReminderSettings}
        initialSettings={
          editingPrayerId
            ? prayers.find((p) => p.id === editingPrayerId)?.reminderSettings
            : undefined
        }
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 1,
    marginTop: 24,
    marginBottom: 12,
    marginLeft: 4,
  },
  card: {
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  divider: {
    height: 1,
    marginLeft: 52,
  },
  prayersContainer: {
    marginBottom: 24,
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
