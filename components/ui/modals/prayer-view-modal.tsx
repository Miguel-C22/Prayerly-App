import Button from "@/components/ui/button";
import ErrorState from "@/components/ui/error-state";
import Input from "@/components/ui/input";
import JournalCard from "@/components/ui/journal-card";
import ModalHeader from "@/components/ui/modal-header";
import TagPickerModal from "@/components/ui/modals/tag-picker-modal";
import TagSelectorCard from "@/components/ui/tag-selector-card";
import { useTheme } from "@/hooks/use-theme";
import { Prayer } from "@/services/prayers";
import { Tag } from "@/services/tags";
import JournalEditModal, { JournalEntry } from "./journal-edit-modal";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  tags: Tag[];
  onSave: (prayer: Prayer) => Promise<void>;
  onDelete: (prayerId: string) => Promise<void>;
  onUpdateJournal: (journal: JournalEntry) => Promise<void>;
  onDeleteJournal: (journalId: string) => Promise<void>;
}

export default function PrayerViewModal({
  visible,
  onClose,
  prayer,
  linkedJournals,
  tags,
  onSave,
  onDelete,
  onUpdateJournal,
  onDeleteJournal,
}: PrayerViewModalProps) {
  const { colors, neutral } = useTheme();
  const insets = useSafeAreaInsets();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [answered, setAnswered] = useState<boolean>(false);
  const [tagId, setTagId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedJournal, setSelectedJournal] = useState<JournalEntry | null>(null);
  const [showJournalModal, setShowJournalModal] = useState<boolean>(false);
  const [showTagPicker, setShowTagPicker] = useState<boolean>(false);

  useEffect(() => {
    if (prayer) {
      setTitle(prayer.title);
      setDescription(prayer.description || "");
      setAnswered(prayer.answered);
      setTagId(prayer.tag_id || null);
      setError(null);
    }
  }, [prayer]);

  const handleSave = async () => {
    if (!prayer || !title.trim()) return;

    setLoading(true);
    setError(null);

    try {
      await onSave({
        ...prayer,
        title: title.trim(),
        description: description.trim() || undefined,
        answered: answered,
        tag_id: tagId,
      });
      setLoading(false);
    } catch (err) {
      setError("Failed to save prayer. Please try again.");
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!prayer) return;

    setLoading(true);
    setError(null);

    try {
      await onDelete(prayer.id);
      setLoading(false);
    } catch (err) {
      setError("Failed to delete prayer. Please try again.");
      setLoading(false);
    }
  };

  const handleJournalPress = (journal: LinkedJournal) => {
    setSelectedJournal({
      id: journal.id,
      date: journal.date,
      content: journal.preview,
      linkedPrayerId: prayer?.id,
    });
    setShowJournalModal(true);
  };

  if (!prayer) return null;

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
            variant="edit"
            onClose={onClose}
            handleSave={handleSave}
            loading={loading}
            title="Prayer"
            saveLabel="Save"
          />

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Error Message */}
            {error && <ErrorState message={error} onRetry={handleSave} />}

            {/* Title Input */}
            <Input
              variant="minimal"
              displayLabel
              label="Title"
              placeholder="Enter prayer title..."
              value={title}
              onChangeText={setTitle}
              editable={!loading}
              style={styles.titleInput}
            />

            {/* Description Input */}
            <Input
              variant="minimal"
              displayLabel
              label="Description"
              placeholder="Add a description for your prayer..."
              value={description}
              onChangeText={setDescription}
              multiline
              textAlignVertical="top"
              editable={!loading}
              style={styles.descriptionInput}
            />

            {/* Tag Selector */}
            <TagSelectorCard
              tags={tags}
              selectedTagId={tagId}
              onPress={() => setShowTagPicker(true)}
              disabled={loading}
            />

            {/* Answered Toggle */}
            <View
              style={[styles.answeredSection, { backgroundColor: colors.card }]}
            >
              <Text style={[styles.answeredLabel, { color: colors.text }]}>
                Answered
              </Text>
              <Switch
                value={answered}
                onValueChange={setAnswered}
                trackColor={{ false: colors.background, true: neutral.primary }}
                thumbColor="#fff"
                disabled={loading}
              />
            </View>

            {/* Journals */}
            {linkedJournals.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>
                  Journals
                </Text>
                {linkedJournals.map((journal) => (
                  <JournalCard
                    key={journal.id}
                    date={journal.date}
                    preview={journal.preview}
                    onPress={() => handleJournalPress(journal)}
                    truncate={false}
                  />
                ))}
              </View>
            )}
          </ScrollView>

          {/* Footer - Fixed at bottom */}
          <View style={styles.footer}>
            {/* Created Date */}
            <Text style={[styles.createdDate, { color: colors.subtext }]}>
              Created {new Date(prayer.created_at).toLocaleDateString()}
            </Text>

            {/* Delete Button */}
            <Button
              label="Delete Prayer"
              onPress={handleDelete}
              style={styles.deleteButton}
              textStyle={{ color: neutral.primary }}
              loading={loading}
            />
          </View>
        </View>

        {/* Tag Picker Modal */}
        <TagPickerModal
          visible={showTagPicker}
          onClose={() => setShowTagPicker(false)}
          tags={tags}
          selectedTagId={tagId}
          onSelectTag={setTagId}
        />

        {/* Journal Edit Modal */}
        <JournalEditModal
          visible={showJournalModal}
          onClose={() => setShowJournalModal(false)}
          journal={selectedJournal}
          onSave={onUpdateJournal}
          onDelete={onDeleteJournal}
        />
      </KeyboardAvoidingView>
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
    paddingBottom: 20,
    paddingTop: 12,
  },
  createdDate: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 16,
  },
  answeredSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginTop: 8,
    marginBottom: 24,
  },
  answeredLabel: {
    fontSize: 17,
    fontWeight: "500",
  },
  titleInput: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 16,
    paddingHorizontal: 0,
  },
  descriptionInput: {
    fontSize: 15,
    lineHeight: 22,
    minHeight: 80,
    marginBottom: 16,
    paddingHorizontal: 0,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  deleteButton: {
    backgroundColor: "transparent",
  },
});
