import ErrorState from "@/components/ui/error-state";
import Input from "@/components/ui/input";
import ModalHeader from "@/components/ui/modal-header";
import { useTheme } from "@/hooks/use-theme";
import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export interface EditProfileModalProps {
  visible: boolean;
  onClose: () => void;
  username: string;
  email: string;
  onSave: (username: string, email: string) => Promise<void>;
}

export default function EditProfileModal({
  visible,
  onClose,
  username: initialUsername,
  email: initialEmail,
  onSave,
}: EditProfileModalProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [username, setUsername] = useState<string>(initialUsername);
  const [email, setEmail] = useState<string>(initialEmail);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setUsername(initialUsername);
    setEmail(initialEmail);
    setError(null);
  }, [initialUsername, initialEmail]);

  const handleSave = async () => {
    if (!username.trim() || !email.trim()) return;

    setLoading(true);
    setError(null);

    try {
      await onSave(username.trim(), email.trim());
      setLoading(false);
      onClose();
    } catch (err) {
      setError("Failed to update profile. Please try again.");
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
            title="Edit Profile"
            saveLabel="Save"
          />

          <ScrollView
            style={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Error Message */}
            {error && <ErrorState message={error} onRetry={handleSave} />}

            <Input
              displayLabel
              label="Username"
              placeholder="Enter username"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              editable={!loading}
            />

            <Input
              displayLabel
              label="Email"
              placeholder="Enter email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
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
});
