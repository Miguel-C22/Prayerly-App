import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  message = "Something went wrong",
  onRetry,
}: ErrorStateProps) {
  const { colors, neutral } = useTheme();

  return (
    <View style={styles.container}>
      <Ionicons name="alert-circle-outline" size={48} color={colors.subtext} />
      <Text style={[styles.message, { color: colors.text }]}>{message}</Text>
      {onRetry && (
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: neutral.primary }]}
          onPress={onRetry}
        >
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
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
    paddingHorizontal: 20,
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  retryText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
