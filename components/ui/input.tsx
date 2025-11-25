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
}

export default function Input({
  value,
  onChangeText,
  style,
  displayLabel = false,
  label,
  ...rest
}: InputProps) {
  const { colors } = useTheme();

  return (
    <View>
      {displayLabel && (
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      )}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.inputBackground,
            color: colors.inputText,
            borderColor: colors.card,
          },
          style,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="#999"
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
});
