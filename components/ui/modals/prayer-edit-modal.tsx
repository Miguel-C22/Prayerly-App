import Input from "@/components/ui/input";
import { useTheme } from "@/hooks/use-theme";
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

export interface Prayer {
  id: string;
  title: string;
  description?: string;
  answered: boolean;
  createdAt: string;
}

export interface PrayerEditModalProps {
  visible: boolean;
  onClose: () => void;
  prayer: Prayer | null;
  onSave: (prayer: Prayer) => void;
}

export default function PrayerEditModal({
  visible,
  onClose,
  prayer,
  onSave,
}: PrayerEditModalProps) {
  const { colors, neutral } = useTheme();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (prayer) {
      setTitle(prayer.title);
      setDescription(prayer.description || "");
    }
  }, [prayer]);

  const handleSave = () => {
    if (prayer && title.trim()) {
      onSave({
        ...prayer,
        title: title.trim(),
        description: description.trim() || undefined,
      });
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
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              Edit Prayer
            </Text>
            <TouchableOpacity onPress={handleSave}>
              <Text style={[styles.saveText, { color: neutral.primary }]}>
                Save
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Title Input */}
            <Input
              displayLabel
              label="Title"
              placeholder="Prayer title"
              value={title}
              onChangeText={setTitle}
            />

            {/* Description Input */}
            <Input
              displayLabel
              label="Description"
              placeholder="Add a description for your prayer..."
              value={description}
              onChangeText={setDescription}
              multiline
              textAlignVertical="top"
              style={styles.textArea}
            />
          </ScrollView>
        </View>
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
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  saveText: {
    fontSize: 16,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  textArea: {
    minHeight: 150,
  },
});
