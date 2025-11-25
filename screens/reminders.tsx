import TimePickerModal from "@/components/ui/modals/time-picker-modal";
import TimeReminderRow from "@/components/ui/time-reminder-row";
import ToggleCard from "@/components/ui/toggle-card";
import { useTheme } from "@/hooks/use-theme";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function RemindersScreen() {
  const { colors, neutral } = useTheme();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [reminderTime, setReminderTime] = useState("9:00 AM");
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [prayerReminders, setPrayerReminders] = useState([
    { id: 1, title: "For my family's health", enabled: true },
    { id: 2, title: "Guidance on new project", enabled: true },
    { id: 3, title: "Peace for a troubled friend", enabled: false },
  ]);

  const togglePrayerReminder = (id: number) => {
    setPrayerReminders((prev) =>
      prev.map((prayer) =>
        prayer.id === id ? { ...prayer, enabled: !prayer.enabled } : prayer
      )
    );
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
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
        <View
          style={[styles.divider, { backgroundColor: colors.background }]}
        />
        <TimeReminderRow
          time={reminderTime}
          onPress={() => setShowTimePicker(true)}
        />
      </View>

      {/* Prayer Requests Section */}
      <Text style={[styles.sectionTitle, { color: neutral.primary }]}>
        REMINDERS FOR PRAYER REQUESTS
      </Text>
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        {prayerReminders.map((prayer, index) => (
          <View key={prayer.id}>
            {index > 0 && (
              <View
                style={[styles.divider, { backgroundColor: colors.background }]}
              />
            )}
            <ToggleCard
              value={prayer.enabled}
              onValueChange={() => togglePrayerReminder(prayer.id)}
              label={prayer.title}
              displayIcon={false}
            />
          </View>
        ))}
      </View>

      {/* Time Picker Modal */}
      <TimePickerModal
        visible={showTimePicker}
        onClose={() => setShowTimePicker(false)}
        selectedTime={reminderTime}
        onSelectTime={setReminderTime}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
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
});
