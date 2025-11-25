import { useTheme } from "@/hooks/use-theme";
import React from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

export interface ButtonProps {
  label: string;
  onPress: () => void;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  disabled?: boolean;
  loadingMessage?: string;
}

export default function Button({
  label,
  onPress,
  loading = false,
  style,
  textStyle,
  disabled,
  loadingMessage = "Processing...",
}: ButtonProps) {
  const { neutral } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: neutral.primary },
        loading && styles.buttonDisabled,
        style,
      ]}
      onPress={onPress}
      disabled={loading || disabled}
    >
      <Text style={[styles.buttonText, textStyle]}>
        {loading ? loadingMessage : label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#0a7ea4",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
