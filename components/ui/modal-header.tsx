import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import React, { ReactNode } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type ModalHeaderVariant = "edit" | "picker" | "view";

interface ModalHeaderProps {
  onClose: () => void;
  handleSave?: () => void;
  loading?: boolean;
  title?: string;
  saveLabel?: string;
  displaySaveLabel?: boolean;
  variant?: ModalHeaderVariant;
  centerElement?: ReactNode;
  rightElement?: ReactNode;
}

function ModalHeader({
  onClose,
  handleSave,
  loading = false,
  title = "",
  saveLabel = "Save",
  displaySaveLabel = true,
  variant = "edit",
  centerElement,
  rightElement,
}: ModalHeaderProps) {
  const { colors, neutral } = useTheme();

  // Picker variant: Title on left, Close on right
  if (variant === "picker") {
    return (
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {title}
        </Text>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>
    );
  }

  // Edit/View variant: Close on left, Title/Custom center, Save/Custom/Nothing on right
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onClose} disabled={loading}>
        <Ionicons name="close" size={24} color={colors.text} />
      </TouchableOpacity>

      {centerElement || (
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {title}
        </Text>
      )}

      {rightElement ||
        (variant === "edit" && displaySaveLabel && handleSave ? (
          <TouchableOpacity onPress={handleSave} disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color={neutral.primary} />
            ) : (
              <Text style={[styles.saveText, { color: neutral.primary }]}>
                {saveLabel}
              </Text>
            )}
          </TouchableOpacity>
        ) : (
          <View style={{ width: 24 }} />
        ))}
    </View>
  );
}

export default ModalHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  saveText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
