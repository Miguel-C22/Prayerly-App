import Button from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export interface Prayer {
  id: string;
  title: string;
  description?: string;
  answered: boolean;
  createdAt: string;
}

export interface LinkedJournal {
  id: string;
  date: string;
  preview: string;
}

export interface PrayerViewModalProps {
  visible: boolean;
  onClose: () => void;
  prayer: Prayer | null;
  linkedJournals: LinkedJournal[];
  onEdit: () => void;
  onDelete: (prayerId: string) => void;
}

export default function PrayerViewModal({
  visible,
  onClose,
  prayer,
  linkedJournals,
  onEdit,
  onDelete,
}: PrayerViewModalProps) {
  const { colors, neutral } = useTheme();

  const handleDelete = () => {
    if (prayer) {
      onDelete(prayer.id);
    }
    onClose();
  };

  if (!prayer) return null;

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
          style={[styles.container, { backgroundColor: colors.background }]}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
            {prayer.answered && (
              <View
                style={[
                  styles.answeredBadge,
                  { backgroundColor: neutral.primary + "20" },
                ]}
              >
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color={neutral.primary}
                />
                <Text style={[styles.answeredText, { color: neutral.primary }]}>
                  Answered
                </Text>
              </View>
            )}
            <TouchableOpacity onPress={onEdit}>
              <Text style={[styles.editText, { color: neutral.primary }]}>
                Edit
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Prayer Icon */}
            <View style={styles.iconWrapper}>
              <View
                style={[styles.iconContainer, { backgroundColor: colors.card }]}
              >
                <Ionicons name="hand-left" size={32} color={neutral.primary} />
              </View>
            </View>

            {/* Title */}
            <Text style={[styles.title, { color: colors.text }]}>
              {prayer.title}
            </Text>

            {/* Date */}
            <Text style={[styles.date, { color: colors.subtext }]}>
              Created {prayer.createdAt}
            </Text>

            {/* Description */}
            {prayer.description && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Description
                </Text>
                <Text style={[styles.description, { color: colors.subtext }]}>
                  {prayer.description}
                </Text>
              </View>
            )}

            {/* Linked Journals */}
            {linkedJournals.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Linked Journals
                </Text>
                {linkedJournals.map((journal) => (
                  <View
                    key={journal.id}
                    style={[
                      styles.journalItem,
                      { backgroundColor: colors.card },
                    ]}
                  >
                    <Text
                      style={[styles.journalDate, { color: neutral.primary }]}
                    >
                      {journal.date}
                    </Text>
                    <Text
                      style={[styles.journalPreview, { color: colors.subtext }]}
                      numberOfLines={2}
                    >
                      {journal.preview}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>

          {/* Delete Button */}
          <Button
            label="Delete Prayer"
            onPress={handleDelete}
            style={styles.deleteButton}
            textStyle={{ color: neutral.primary }}
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
    height: "90%",
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
  },
  answeredBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  answeredText: {
    fontSize: 14,
    fontWeight: "600",
  },
  editText: {
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  iconWrapper: {
    alignItems: "center",
    marginBottom: 16,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  journalItem: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  journalDate: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  journalPreview: {
    fontSize: 14,
    lineHeight: 20,
  },
  deleteButton: {
    backgroundColor: "transparent",
    marginHorizontal: 20,
    marginTop: 10,
  },
});
