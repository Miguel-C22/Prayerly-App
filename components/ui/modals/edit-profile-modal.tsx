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

export interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  username: string;
  email: string;
  onSave: (username: string, email: string) => void;
}

export default function EditProfileModal({
  visible,
  onClose,
  username: initialUsername,
  email: initialEmail,
  onSave,
}: EditProfileModalProps) {
  const { colors, neutral } = useTheme();
  const [username, setUsername] = useState(initialUsername);
  const [email, setEmail] = useState(initialEmail);

  useEffect(() => {
    setUsername(initialUsername);
    setEmail(initialEmail);
  }, [initialUsername, initialEmail]);

  const handleSave = () => {
    if (username.trim() && email.trim()) {
      onSave(username.trim(), email.trim());
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
              Edit Profile
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
            <Input
              displayLabel
              label="Username"
              placeholder="Enter username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />

            <Input
              displayLabel
              label="Email"
              placeholder="Enter email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
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
});
