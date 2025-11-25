import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export interface SettingsRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  showChevron?: boolean;
  destructive?: boolean;
}

export default function SettingsRow({
  icon,
  label,
  onPress,
  rightElement,
  showChevron = true,
  destructive = false,
}: SettingsRowProps) {
  const { colors, neutral } = useTheme();

  const textColor = destructive ? "#ff4444" : colors.text;
  const iconColor = destructive ? "#ff4444" : neutral.primary;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.left}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: iconColor + "20" },
          ]}
        >
          <Ionicons name={icon} size={20} color={iconColor} />
        </View>
        <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      </View>
      {rightElement ? (
        rightElement
      ) : showChevron && onPress ? (
        <Ionicons name="chevron-forward" size={20} color={colors.subtext} />
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
  },
});
