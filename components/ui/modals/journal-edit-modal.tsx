import Button from "@/components/ui/button";
import ErrorState from "@/components/ui/error-state";
import Input from "@/components/ui/input";
import ModalHeader from "@/components/ui/modal-header";
import { usePrayers } from "@/contexts/PrayersContext";
import { useTheme } from "@/hooks/use-theme";
import { Prayer } from "@/services/prayers";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PrayerPickerModal from "./prayer-picker-modal";

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
  onSave: (journal: JournalEntry) => Promise<void>;
  onDelete: (journalId: string) => Promise<void>;
}

export default function JournalEditModal({
  visible,
  onClose,
  journal,
  onSave,
  onDelete,
}: JournalEditModalProps) {
  const { colors, neutral } = useTheme();
  const insets = useSafeAreaInsets();
  const { prayers } = usePrayers();
  const [content, setContent] = useState<string>("");
  const [selectedPrayer, setSelectedPrayer] = useState<Prayer | null>(null);
  const [showPrayerPicker, setShowPrayerPicker] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (journal) {
      setContent(journal.content);
      const linkedPrayer = prayers.find((p) => p.id === journal.linkedPrayerId);
      setSelectedPrayer(linkedPrayer || null);
      setError(null);
    }
  }, [journal, prayers]);

  const handleSave = async () => {
    if (!journal) return;

    setLoading(true);
    setError(null);

    try {
      await onSave({
        ...journal,
        content,
        linkedPrayerId: selectedPrayer?.id,
      });
      onClose();
    } catch (err) {
      setError("Failed to save journal. Please try again.");
      setLoading(false);
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!journal) return;

    setLoading(true);
    setError(null);

    try {
      await onDelete(journal.id);
      onClose();
      setLoading(false);
    } catch (err) {
      setError("Failed to delete journal. Please try again.");
      setLoading(false);
    }
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
          style={[
            styles.container,
            { backgroundColor: colors.background, paddingTop: insets.top },
          ]}
        >
          <ModalHeader
            onClose={onClose}
            handleSave={handleSave}
            loading={loading}
            title="Journal"
            saveLabel="Save"
          />

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
          >
            {/* Error Message */}
            {error && <ErrorState message={error} onRetry={handleSave} />}

            {/* Date */}
            <Text style={[styles.date, { color: colors.subtext }]}>
              {journal?.date}
            </Text>

            {/* Prayer Selector */}
            <TouchableOpacity
              style={[styles.prayerSelector, { borderColor: colors.card }]}
              onPress={() => setShowPrayerPicker(true)}
              disabled={loading}
            >
              <View style={styles.prayerLeft}>
                <Ionicons name="link" size={18} color={neutral.primary} />
                <Text style={[styles.prayerText, { color: neutral.primary }]}>
                  {selectedPrayer?.title || "Link to Prayer"}
                </Text>
              </View>
              <Ionicons name="chevron-down" size={20} color={colors.subtext} />
            </TouchableOpacity>

            {/* Content Input */}
            <Input
              variant="minimal"
              displayLabel
              label="What are you thankful for today?"
              placeholder="Write your thoughts..."
              value={content}
              onChangeText={setContent}
              multiline
              textAlignVertical="top"
              editable={!loading}
              style={styles.input}
            />
          </ScrollView>

          {/* Delete Button - Fixed at bottom */}
          <View style={styles.footer}>
            <Button
              label="Delete Journal"
              onPress={handleDelete}
              style={styles.deleteButton}
              textStyle={{ color: neutral.primary }}
              loading={loading}
            />
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Prayer Picker Modal */}
      <PrayerPickerModal
        visible={showPrayerPicker}
        onClose={() => setShowPrayerPicker(false)}
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
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 0,
    paddingTop: 0,
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
  input: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
  },
  deleteButton: {
    backgroundColor: "transparent",
  },
});
