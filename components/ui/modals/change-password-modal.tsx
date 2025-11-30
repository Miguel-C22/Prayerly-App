import Button from "@/components/ui/button";
import ModalHeader from "@/components/ui/modal-header";
import Input from "@/components/ui/input";
import { useTheme } from "@/hooks/use-theme";
import React, { useState } from "react";
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

export interface ChangePasswordModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (currentPassword: string, newPassword: string) => Promise<void>;
}

export default function ChangePasswordModal({
  visible,
  onClose,
  onSave,
}: ChangePasswordModalProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [currentPassword, setCurrentPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const resetForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSave = async () => {
    setError("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await onSave(currentPassword, newPassword);
      resetForm();
    } catch (err) {
      setError("Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}
      >
        <TouchableOpacity style={styles.backdrop} onPress={handleClose} />
        <View
          style={[
            styles.container,
            { backgroundColor: colors.background, paddingTop: insets.top },
          ]}
        >
          <ModalHeader
            onClose={handleClose}
            handleSave={handleSave}
            loading={loading}
            title="Change Password"
            displaySaveLabel={false}
          />

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Input
              displayLabel
              label="Current Password"
              placeholder="Enter current password"
              value={currentPassword}
              onChangeText={setCurrentPassword}
              secureTextEntry
              editable={!loading}
            />

            <Input
              displayLabel
              label="New Password"
              placeholder="Enter new password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              editable={!loading}
            />

            <Input
              displayLabel
              label="Confirm New Password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              editable={!loading}
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Button
              label={loading ? "Updating..." : "Update Password"}
              onPress={handleSave}
              disabled={loading}
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
  errorText: {
    color: "#ff4444",
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
});
