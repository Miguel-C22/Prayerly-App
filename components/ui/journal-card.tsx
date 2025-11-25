import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export interface JournalCardProps {
  date: string;
  preview: string;
  onPress: () => void;
}

export default function JournalCard({ date, preview, onPress }: JournalCardProps) {
  const { colors, neutral, isDark } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: isDark ? colors.card : "#f5f5f5" },
      ]}
      onPress={onPress}
    >
      <View style={styles.content}>
        <Text style={[styles.date, { color: neutral.primary }]}>
          {date.toUpperCase()}
        </Text>
        <Text
          style={[styles.preview, { color: isDark ? colors.text : "#333" }]}
          numberOfLines={2}
        >
          {preview}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={neutral.primary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  content: {
    flex: 1,
    marginRight: 12,
  },
  date: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  preview: {
    fontSize: 14,
    lineHeight: 20,
  },
});
