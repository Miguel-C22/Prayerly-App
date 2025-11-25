import Button from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import PrayerPickerModal from "./prayer-picker-modal";

export interface Prayer {
  id: string;
  title: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  content: string;
  linkedPrayerId?: string;
}

export interface JournalEditModalProps {
  visible: boolean;
  onClose: () => void;
  journal: JournalEntry | null;
  prayers: Prayer[];
  onSave: (journal: JournalEntry) => void;
  onDelete: (journalId: string) => void;
}

export default function JournalEditModal({
  visible,
  onClose,
  journal,
  prayers,
  onSave,
  onDelete,
}: JournalEditModalProps) {
  const { colors, neutral } = useTheme();
  const [content, setContent] = useState("");
  const [selectedPrayer, setSelectedPrayer] = useState<Prayer | null>(null);
  const [showPrayerPicker, setShowPrayerPicker] = useState(false);

  useEffect(() => {
    if (journal) {
      setContent(journal.content);
      const linkedPrayer = prayers.find((p) => p.id === journal.linkedPrayerId);
      setSelectedPrayer(linkedPrayer || null);
    }
  }, [journal, prayers]);

  const handleSave = () => {
    if (journal) {
      onSave({
        ...journal,
        content,
        linkedPrayerId: selectedPrayer?.id,
      });
    }
    onClose();
  };

  const handleDelete = () => {
    if (journal) {
      onDelete(journal.id);
    }
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}
      >
        <TouchableOpacity style={styles.backdrop} onPress={onClose} />
        <View
          style={[styles.container, { backgroundColor: colors.background }]}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave}>
              <Text style={[styles.saveText, { color: neutral.primary }]}>
                Save
              </Text>
            </TouchableOpacity>
          </View>

          {/* Date */}
          <Text style={[styles.date, { color: colors.subtext }]}>
            {journal?.date}
          </Text>

          {/* Prayer Selector */}
          <TouchableOpacity
            style={[styles.prayerSelector, { borderColor: colors.card }]}
            onPress={() => setShowPrayerPicker(true)}
          >
            <View style={styles.prayerLeft}>
              <Ionicons name="link" size={18} color={neutral.primary} />
              <Text style={[styles.prayerText, { color: neutral.primary }]}>
                {selectedPrayer?.title || "Link to Prayer"}
              </Text>
            </View>
            <Ionicons name="chevron-down" size={20} color={colors.subtext} />
          </TouchableOpacity>

          {/* Prompt */}
          <Text style={[styles.prompt, { color: colors.subtext }]}>
            What are you thankful for today?
          </Text>

          {/* Content Input */}
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.background,
                color: colors.text,
              },
            ]}
            placeholder="Write your thoughts..."
            placeholderTextColor={colors.placeholder}
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
          />

          {/* Delete Button */}
          <Button
            label="Delete Journal"
            onPress={handleDelete}
            style={styles.deleteButton}
            textStyle={{ color: neutral.primary }}
          />
        </View>
      </KeyboardAvoidingView>

      {/* Prayer Picker Modal */}
      <PrayerPickerModal
        visible={showPrayerPicker}
        onClose={() => setShowPrayerPicker(false)}
        prayers={prayers}
        selectedPrayer={selectedPrayer}
        onSelectPrayer={setSelectedPrayer}
      />
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
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
  },
  saveText: {
    fontSize: 16,
    fontWeight: "600",
  },
  date: {
    fontSize: 14,
    marginBottom: 16,
  },
  prayerSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  prayerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  prayerText: {
    fontSize: 16,
    fontWeight: "500",
  },
  prompt: {
    fontSize: 16,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
  },
  deleteButton: {
    backgroundColor: "transparent",
    marginTop: 20,
  },
});
