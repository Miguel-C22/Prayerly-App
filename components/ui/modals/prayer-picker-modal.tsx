import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export interface Prayer {
  id: string;
  title: string;
}

export interface PrayerPickerModalProps {
  visible: boolean;
  onClose: () => void;
  prayers: Prayer[];
  selectedPrayer: Prayer | null;
  onSelectPrayer: (prayer: Prayer | null) => void;
}

export default function PrayerPickerModal({
  visible,
  onClose,
  prayers,
  selectedPrayer,
  onSelectPrayer,
}: PrayerPickerModalProps) {
  const { colors, neutral } = useTheme();

  const handleSelect = (prayer: Prayer | null) => {
    onSelectPrayer(prayer);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />
        <View style={[styles.container, { backgroundColor: colors.card }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.text }]}>
              Link to Prayer
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* None option */}
          <TouchableOpacity
            style={[
              styles.prayerItem,
              !selectedPrayer && {
                backgroundColor: neutral.primary + "20",
              },
            ]}
            onPress={() => handleSelect(null)}
          >
            <Text
              style={[
                styles.prayerText,
                { color: !selectedPrayer ? neutral.primary : colors.subtext },
              ]}
            >
              No linked prayer
            </Text>
            {!selectedPrayer && (
              <Ionicons name="checkmark" size={20} color={neutral.primary} />
            )}
          </TouchableOpacity>

          <View
            style={[styles.divider, { backgroundColor: colors.background }]}
          />

          {/* Prayer List */}
          <FlatList
            data={prayers}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const isSelected = selectedPrayer?.id === item.id;
              return (
                <TouchableOpacity
                  style={[
                    styles.prayerItem,
                    isSelected && {
                      backgroundColor: neutral.primary + "20",
                    },
                  ]}
                  onPress={() => handleSelect(item)}
                >
                  <View style={styles.prayerContent}>
                    <Ionicons
                      name="hand-left-outline"
                      size={18}
                      color={isSelected ? neutral.primary : colors.subtext}
                    />
                    <Text
                      style={[
                        styles.prayerText,
                        { color: isSelected ? neutral.primary : colors.text },
                        isSelected && styles.prayerTextSelected,
                      ]}
                    >
                      {item.title}
                    </Text>
                  </View>
                  {isSelected && (
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={neutral.primary}
                    />
                  )}
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  container: {
    maxHeight: "60%",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    marginHorizontal: 20,
  },
  prayerItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  prayerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  prayerText: {
    fontSize: 16,
  },
  prayerTextSelected: {
    fontWeight: "600",
  },
});
