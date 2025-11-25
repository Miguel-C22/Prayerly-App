import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Switch, Text, View } from "react-native";

export interface ToggleCardProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  displayIcon?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  label: string;
}

export default function ToggleCard({
  value,
  onValueChange,
  icon,
  displayIcon = false,
  label,
}: ToggleCardProps) {
  const { colors, neutral } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {displayIcon && (
          <View
            style={[styles.iconContainer, { backgroundColor: colors.card }]}
          >
            <Ionicons name={icon} size={20} color={colors.text} />
          </View>
        )}
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.card, true: neutral.primary }}
        thumbColor="#fff"
      />
    </View>
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
});
