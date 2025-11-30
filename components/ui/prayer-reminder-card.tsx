import { useTheme } from "@/hooks/use-theme";
import { Prayer } from "@/services/prayers";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export interface ReminderSettings {
  type: "daily" | "weekly" | null;
  time: string | null;
  dayOfWeek?:
    | "monday"
    | "tuesday"
    | "wednesday"
    | "thursday"
    | "friday"
    | "saturday"
    | "sunday";
}

export interface PrayerReminderCardProps {
  prayer: Prayer;
  reminderSettings: ReminderSettings;
  onEditReminder: () => void;
}

export default function PrayerReminderCard({
  prayer,
  reminderSettings,
  onEditReminder,
}: PrayerReminderCardProps) {
  const { colors, neutral } = useTheme();

  const getReminderText = () => {
    if (!reminderSettings.type) {
      return "No Reminder";
    }

    if (reminderSettings.type === "daily") {
      return `Daily at ${reminderSettings.time}`;
    }

    if (reminderSettings.type === "weekly" && reminderSettings.dayOfWeek) {
      const dayLabel =
        reminderSettings.dayOfWeek.charAt(0).toUpperCase() +
        reminderSettings.dayOfWeek.slice(1);
      return `${dayLabel}s at ${reminderSettings.time}`;
    }

    return "No Reminder";
  };

  const getReminderIcon = () => {
    if (!reminderSettings.type) {
      return "notifications-off-outline";
    }
    return "notifications-outline";
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      {/* Top Section - Prayer Info */}
      <View style={styles.topSection}>
        <View style={styles.left}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: colors.background },
            ]}
          >
            <Ionicons name="hand-left" size={20} color={neutral.primary} />
          </View>
          <Text
            style={[styles.title, { color: colors.text }]}
            numberOfLines={1}
          >
            {prayer.title}
          </Text>
        </View>
      </View>

      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: colors.background }]} />

      {/* Bottom Section - Reminder Settings */}
      <TouchableOpacity
        style={styles.bottomSection}
        onPress={onEditReminder}
        activeOpacity={0.7}
      >
        <View style={styles.reminderInfo}>
          <Ionicons
            name={getReminderIcon() as any}
            size={18}
            color={colors.subtext}
          />
          <Text style={[styles.reminderText, { color: colors.subtext }]}>
            {getReminderText()}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.subtext} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
  },
  topSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  divider: {
    height: 1,
    marginHorizontal: 16,
  },
  bottomSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  reminderInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  reminderText: {
    fontSize: 15,
    fontWeight: "500",
  },
});
