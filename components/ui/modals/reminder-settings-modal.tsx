import ErrorState from "@/components/ui/error-state";
import ModalHeader from "@/components/ui/modal-header";
import { useTheme } from "@/hooks/use-theme";
import { generateTimeSlots } from "@/utils/generate-time-slots";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type ReminderType = "daily" | "weekly" | null;
export type DayOfWeek =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface ReminderSettings {
  type: ReminderType;
  time: string | null;
  dayOfWeek?: DayOfWeek;
}

export interface ReminderSettingsModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (settings: ReminderSettings) => Promise<void>;
  initialSettings?: ReminderSettings;
}

const DAYS: { value: DayOfWeek; label: string }[] = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
];

export default function ReminderSettingsModal({
  visible,
  onClose,
  onSave,
  initialSettings,
}: ReminderSettingsModalProps) {
  const { colors, neutral } = useTheme();
  const insets = useSafeAreaInsets();
  const [reminderType, setReminderType] = useState<ReminderType>(
    initialSettings?.type || null
  );
  const [selectedTime, setSelectedTime] = useState<string>(
    initialSettings?.time || "9:00 AM"
  );
  const [selectedDay, setSelectedDay] = useState<DayOfWeek | undefined>(
    initialSettings?.dayOfWeek
  );
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const TIME_SLOTS = generateTimeSlots();

  useEffect(() => {
    if (visible) {
      setReminderType(initialSettings?.type || null);
      setSelectedTime(initialSettings?.time || "9:00 AM");
      setSelectedDay(initialSettings?.dayOfWeek);
      setShowTimePicker(false);
      setError(null);
    }
  }, [visible, initialSettings]);

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!reminderType) {
        await onSave({ type: null, time: null });
        onClose();
        return;
      }

      const settings: ReminderSettings = {
        type: reminderType,
        time: selectedTime,
      };

      if (reminderType === "weekly" && selectedDay) {
        settings.dayOfWeek = selectedDay;
      }

      await onSave(settings);
      setLoading(false);
      onClose();
    } catch (err) {
      setError("Failed to save reminder. Please try again.");
      setLoading(false);
    }
  };

  const handleSelectTime = (time: string) => {
    setSelectedTime(time);
    setShowTimePicker(false);
  };

  const renderRadioButton = (
    type: ReminderType,
    label: string,
    description: string
  ) => {
    const isSelected = reminderType === type;
    return (
      <TouchableOpacity
        style={[
          styles.radioOption,
          { borderColor: colors.card },
          isSelected && {
            borderColor: neutral.primary,
            backgroundColor: neutral.primary + "10",
          },
        ]}
        onPress={() => setReminderType(type)}
        disabled={loading}
      >
        <View style={styles.radioLeft}>
          <View
            style={[
              styles.radioCircle,
              { borderColor: isSelected ? neutral.primary : colors.card },
            ]}
          >
            {isSelected && (
              <View
                style={[
                  styles.radioInner,
                  { backgroundColor: neutral.primary },
                ]}
              />
            )}
          </View>
          <View style={styles.radioTextContainer}>
            <Text style={[styles.radioLabel, { color: colors.text }]}>
              {label}
            </Text>
            <Text style={[styles.radioDescription, { color: colors.subtext }]}>
              {description}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
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
        <View
          style={[
            styles.container,
            { backgroundColor: colors.background, paddingTop: insets.top },
          ]}
        >
          <ModalHeader
            onClose={onClose}
            handleSave={handleSave}
            loading={loading}
            title="Reminder Settings"
            saveLabel="Save"
          />

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Error Message */}
            {error && <ErrorState message={error} onRetry={handleSave} />}
            {/* Reminder Type Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                Frequency
              </Text>
              {renderRadioButton(null, "No Reminder", "No notifications")}
              {renderRadioButton(
                "daily",
                "Daily",
                "Receive a reminder every day"
              )}
              {renderRadioButton(
                "weekly",
                "Weekly",
                "Receive a reminder once a week"
              )}
            </View>

            {/* Day Selection (only for weekly) */}
            {reminderType === "weekly" && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Select Day
                </Text>
                <View style={styles.daysContainer}>
                  {DAYS.map((day) => {
                    const isSelected = selectedDay === day.value;
                    return (
                      <TouchableOpacity
                        key={day.value}
                        style={[
                          styles.dayButton,
                          { borderColor: colors.card },
                          isSelected && {
                            backgroundColor: neutral.primary,
                            borderColor: neutral.primary,
                          },
                        ]}
                        onPress={() => setSelectedDay(day.value)}
                        disabled={loading}
                      >
                        <Text
                          style={[
                            styles.dayButtonText,
                            { color: isSelected ? "#fff" : colors.text },
                          ]}
                        >
                          {day.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Time Selection */}
            {reminderType && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Time
                </Text>
                <TouchableOpacity
                  style={[
                    styles.timeSelector,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.card,
                    },
                  ]}
                  onPress={() => setShowTimePicker(!showTimePicker)}
                  disabled={loading}
                >
                  <Text style={[styles.timeText, { color: colors.text }]}>
                    {selectedTime}
                  </Text>
                  <Ionicons
                    name={showTimePicker ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={colors.subtext}
                  />
                </TouchableOpacity>

                {/* Inline Time Picker */}
                {showTimePicker && (
                  <View
                    style={[
                      styles.timePickerContainer,
                      { backgroundColor: colors.card },
                    ]}
                  >
                    <ScrollView
                      style={styles.timePickerScroll}
                      showsVerticalScrollIndicator={false}
                    >
                      {TIME_SLOTS.map((time) => {
                        const isSelected = time === selectedTime;
                        return (
                          <TouchableOpacity
                            key={time}
                            style={[
                              styles.timeItem,
                              isSelected && {
                                backgroundColor: neutral.primary + "20",
                              },
                            ]}
                            onPress={() => handleSelectTime(time)}
                            disabled={loading}
                          >
                            <Text
                              style={[
                                styles.timeItemText,
                                {
                                  color: isSelected
                                    ? neutral.primary
                                    : colors.text,
                                },
                                isSelected && styles.timeItemTextSelected,
                              ]}
                            >
                              {time}
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
                      })}
                    </ScrollView>
                  </View>
                )}
              </View>
            )}
          </ScrollView>
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
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  container: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  radioOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 12,
  },
  radioLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  radioCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  radioTextContainer: {
    gap: 2,
  },
  radioLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  radioDescription: {
    fontSize: 13,
  },
  daysContainer: {
    gap: 8,
  },
  dayButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: "center",
  },
  dayButtonText: {
    fontSize: 15,
    fontWeight: "500",
  },
  timeSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
  },
  timeText: {
    fontSize: 16,
    fontWeight: "500",
  },
  timePickerContainer: {
    marginTop: 12,
    borderRadius: 10,
    overflow: "hidden",
  },
  timePickerScroll: {
    maxHeight: 240,
  },
  timeItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  timeItemText: {
    fontSize: 16,
  },
  timeItemTextSelected: {
    fontWeight: "600",
  },
});
