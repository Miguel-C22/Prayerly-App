import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export interface TimeReminderRowProps {
  time: string;
  onPress?: () => void;
}

export default function TimeReminderRow({
  time,
  onPress,
}: TimeReminderRowProps) {
  const { colors, neutral } = useTheme();

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.left}>
        <View
          style={[styles.iconContainer, { backgroundColor: colors.background }]}
        >
          <Ionicons name="time-outline" size={20} color={neutral.primary} />
        </View>
        <Text style={[styles.label, { color: colors.text }]}>
          Set Reminder Time
        </Text>
      </View>
      <View style={styles.right}>
        <Text style={[styles.time, { color: colors.subtext }]}>{time}</Text>
        <Ionicons name="chevron-forward" size={20} color={colors.subtext} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    marginTop: 8,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  time: {
    fontSize: 16,
  },
});
