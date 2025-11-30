import { useTheme } from "@/hooks/use-theme";
import React from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
} from "react-native";

export interface InputProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  style?: StyleProp<TextStyle>;
  displayLabel?: boolean;
  label?: string;
  variant?: "default" | "minimal";
}

export default function Input({
  value,
  onChangeText,
  style,
  displayLabel = false,
  label,
  variant = "default",
  ...rest
}: InputProps) {
  const { colors } = useTheme();

  const inputStyles =
    variant === "minimal"
      ? [
          styles.minimalInput,
          {
            backgroundColor: colors.background,
            color: colors.text,
          },
          style,
        ]
      : [
          styles.input,
          {
            backgroundColor: colors.inputBackground,
            color: colors.inputText,
            borderColor: colors.card,
          },
          style,
        ];

  const labelStyles =
    variant === "minimal"
      ? [styles.minimalLabel, { color: colors.subtext }]
      : [styles.label, { color: colors.text }];

  return (
    <View>
      {displayLabel && label && (
        <Text style={labelStyles}>{label}</Text>
      )}
      <TextInput
        style={inputStyles}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={variant === "minimal" ? colors.placeholder : "#999"}
        autoCapitalize="none"
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    marginTop: 16,
    paddingLeft: 4,
  },
  minimalInput: {
    fontSize: 16,
    padding: 0,
  },
  minimalLabel: {
    fontSize: 16,
    marginBottom: 12,
  },
});
