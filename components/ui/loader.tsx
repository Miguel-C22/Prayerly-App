import { useTheme } from "@/hooks/use-theme";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

export interface LoaderProps {
  text?: string;
  size?: "small" | "large";
}

export default function Loader({ text, size = "large" }: LoaderProps) {
  const { colors, neutral } = useTheme();

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={neutral.primary} />
      {text && (
        <Text style={[styles.text, { color: colors.subtext }]}>{text}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  text: {
    marginTop: 12,
    fontSize: 16,
  },
});
