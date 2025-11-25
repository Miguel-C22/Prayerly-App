import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export interface Prayer {
  id: string;
  title: string;
  description?: string;
  answered: boolean;
  createdAt: string;
}

export interface PrayerCardProps {
  prayer: Prayer;
  onPress: () => void;
  onToggleAnswered: (answered: boolean) => void;
}

export default function PrayerCard({
  prayer,
  onPress,
  onToggleAnswered,
}: PrayerCardProps) {
  const { colors, neutral } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      {/* Top Section - Pressable */}
      <TouchableOpacity style={styles.topSection} onPress={onPress}>
        <View style={styles.left}>
          <View
            style={[styles.iconContainer, { backgroundColor: colors.background }]}
          >
            <Ionicons name="hand-left" size={20} color={neutral.primary} />
          </View>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {prayer.title}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.subtext} />
      </TouchableOpacity>

      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: colors.background }]} />

      {/* Bottom Section - Toggle */}
      <View style={styles.bottomSection}>
        <Text style={[styles.label, { color: colors.subtext }]}>Answered</Text>
        <Switch
          value={prayer.answered}
          onValueChange={onToggleAnswered}
          trackColor={{ false: colors.background, true: neutral.primary }}
          thumbColor="#fff"
        />
      </View>
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
  label: {
    fontSize: 15,
    fontWeight: "500",
  },
});
