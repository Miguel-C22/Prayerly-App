import { useTheme } from "@/hooks/use-theme";
import { Prayer } from "@/services/prayers";
import { Tag } from "@/services/tags";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export interface PrayerCardProps {
  prayer: Prayer;
  tag?: Tag | null;
  onPress: () => void;
}

export default function PrayerCard({
  prayer,
  tag,
  onPress,
}: PrayerCardProps) {
  const { colors, neutral } = useTheme();

  // Get icon from tag or use default
  const iconName = tag?.icon_name || 'hand-left';

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.card }]}
      onPress={onPress}
    >
      <View style={styles.left}>
        <View
          style={[styles.iconContainer, { backgroundColor: colors.background }]}
        >
          <Ionicons name={iconName as any} size={20} color={neutral.primary} />
        </View>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {prayer.title}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.subtext} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 16,
    marginBottom: 16,
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
});
