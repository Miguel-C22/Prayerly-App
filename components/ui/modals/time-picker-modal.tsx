import { useTheme } from "@/hooks/use-theme";
import { generateTimeSlots } from "@/utils/generate-time-slots";
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

export interface TimePickerModalProps {
  visible: boolean;
  onClose: () => void;
  selectedTime: string;
  onSelectTime: (time: string) => void;
}

export default function TimePickerModal({
  visible,
  onClose,
  selectedTime,
  onSelectTime,
}: TimePickerModalProps) {
  const { colors, neutral } = useTheme();

  const TIME_SLOTS = generateTimeSlots();

  const handleSelect = (time: string) => {
    onSelectTime(time);
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
              Select Time
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Time List */}
          <FlatList
            data={TIME_SLOTS}
            keyExtractor={(item) => item}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => {
              const isSelected = item === selectedTime;
              return (
                <TouchableOpacity
                  style={[
                    styles.timeItem,
                    isSelected && {
                      backgroundColor: neutral.primary + "20",
                    },
                  ]}
                  onPress={() => handleSelect(item)}
                >
                  <Text
                    style={[
                      styles.timeText,
                      { color: isSelected ? neutral.primary : colors.text },
                      isSelected && styles.timeTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
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
    maxHeight: "90%",
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
  timeItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  timeText: {
    fontSize: 16,
  },
  timeTextSelected: {
    fontWeight: "600",
  },
});
