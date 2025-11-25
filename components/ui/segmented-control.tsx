import { useTheme } from "@/hooks/use-theme";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export interface SegmentedControlProps {
  options: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export default function SegmentedControl({
  options,
  selectedIndex,
  onSelect,
}: SegmentedControlProps) {
  const { colors, neutral } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      {options.map((option, index) => {
        const isSelected = index === selectedIndex;
        return (
          <TouchableOpacity
            key={option}
            style={[
              styles.option,
              isSelected && {
                backgroundColor: neutral.primary,
              },
            ]}
            onPress={() => onSelect(index)}
          >
            <Text
              style={[
                styles.optionText,
                { color: isSelected ? "#fff" : colors.subtext },
                isSelected && styles.optionTextSelected,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: 10,
    padding: 4,
    marginBottom: 20,
  },
  option: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  optionText: {
    fontSize: 14,
    fontWeight: "500",
  },
  optionTextSelected: {
    fontWeight: "600",
  },
});
