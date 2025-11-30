import SignOutButton from "@/components/auth/sign-out-button";
import ErrorState from "@/components/ui/error-state";
import Loader from "@/components/ui/loader";
import ChangePasswordModal from "@/components/ui/modals/change-password-modal";
import EditProfileModal from "@/components/ui/modals/edit-profile-modal";
import ProfileImageUpload from "@/components/ui/profile-image-upload";
import SettingsRow from "@/components/ui/settings-row";
import ThemeSelector from "@/components/ui/theme-selector";
import { useProfile } from "@/contexts/ProfileContext";
import { useTheme } from "@/hooks/use-theme";
import { changePassword, updateProfile } from "@/services/profile";
import { useState } from "react";
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function ProfileScreen() {
  const { colors } = useTheme();
  const { profile, loading, error, updateOptimistic, revert, refetch } =
    useProfile();
  const [showEditProfile, setShowEditProfile] = useState<boolean>(false);
  const [showChangePassword, setShowChangePassword] = useState<boolean>(false);

  const handleImageUpload = async (imageUrl: string) => {
    try {
      // Optimistically update context
      updateOptimistic({ avatar_url: imageUrl });

      // Save to database in background
      const { error } = await updateProfile({ avatar_url: imageUrl });

      if (error) {
        // Revert optimistic update
        await revert();
        throw new Error("Failed to update avatar");
      }
    } catch (error) {
      // Revert optimistic update
      await revert();
    }
  };

  const handleSaveProfile = async (username: string, email: string) => {
    try {
      const emailChanged = email !== profile?.email;

      // Optimistically update context
      updateOptimistic({ full_name: username, email });
      setShowEditProfile(false);

      // Save to database in background
      const { error } = await updateProfile({
        full_name: username,
        email: email,
      });

      if (error) {
        // Revert optimistic update
        await revert();
        throw new Error("Failed to update profile");
      }

      // Show email verification message if email was changed
      if (emailChanged) {
        Alert.alert(
          "Email Verification Required",
          `A confirmation email has been sent to ${email}. Please check your inbox and click the confirmation link to update your email.`
        );
      }
    } catch (error) {
      // Revert optimistic update
      await revert();
      throw error;
    }
  };

  const handleChangePassword = async (
    currentPassword: string,
    newPassword: string
  ) => {
    try {
      const { error } = await changePassword(currentPassword, newPassword);

      if (error) {
        Alert.alert(
          "Password Change Failed",
          error instanceof Error ? error.message : "Failed to change password"
        );
        return;
      }

      Alert.alert("Success", "Your password has been changed successfully");
      setShowChangePassword(false);
    } catch (err) {
      Alert.alert("Error", "An unexpected error occurred");
    }
  };

  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  if (loading && !profile) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Loader text="Loading profile..." />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ErrorState message={error} onRetry={refetch} />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ErrorState message="Failed to load profile" onRetry={refetch} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Image Upload */}
        <ProfileImageUpload
          currentImageUrl={profile.avatar_url}
          onUploadComplete={handleImageUpload}
        />

        {/* Profile Info */}
        <View style={styles.profileInfo}>
          <Text style={[styles.username, { color: colors.text }]}>
            {profile.full_name || "User"}
          </Text>
          <Text style={[styles.email, { color: colors.subtext }]}>
            {profile.email || ""}
          </Text>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.subtext }]}>
            ACCOUNT
          </Text>
          <View
            style={[styles.sectionContent, { backgroundColor: colors.card }]}
          >
            <SettingsRow
              icon="person-outline"
              label="Edit Profile"
              onPress={() => setShowEditProfile(true)}
            />
            <View
              style={[styles.divider, { backgroundColor: colors.background }]}
            />
            <SettingsRow
              icon="lock-closed-outline"
              label="Change Password"
              onPress={() => setShowChangePassword(true)}
            />
          </View>
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.subtext }]}>
            PREFERENCES
          </Text>
          <View
            style={[
              styles.sectionContent,
              { backgroundColor: colors.card, padding: 16 },
            ]}
          >
            <Text style={[styles.preferenceLabel, { color: colors.text }]}>
              Theme
            </Text>
            <ThemeSelector />
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.subtext }]}>
            SUPPORT
          </Text>
          <View
            style={[styles.sectionContent, { backgroundColor: colors.card }]}
          >
            <SettingsRow
              icon="help-circle-outline"
              label="Help & FAQ"
              onPress={() => openLink("https://example.com/help")}
            />
            <View
              style={[styles.divider, { backgroundColor: colors.background }]}
            />
            <SettingsRow
              icon="shield-outline"
              label="Privacy Policy"
              onPress={() => openLink("https://example.com/privacy")}
            />
            <View
              style={[styles.divider, { backgroundColor: colors.background }]}
            />
            <SettingsRow
              icon="document-text-outline"
              label="Terms of Service"
              onPress={() => openLink("https://example.com/terms")}
            />
          </View>
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <View
            style={[styles.sectionContent, { backgroundColor: colors.card }]}
          >
            <SettingsRow
              icon="information-circle-outline"
              label="Version 1.0.0"
              showChevron={false}
            />
          </View>
        </View>

        {/* Sign Out */}
        <View style={styles.section}>
          <View
            style={[styles.sectionContent, { backgroundColor: colors.card }]}
          >
            <SignOutButton />
          </View>
        </View>
      </ScrollView>

      {/* Modals */}
      <EditProfileModal
        visible={showEditProfile}
        onClose={() => setShowEditProfile(false)}
        username={profile.full_name || ""}
        email={profile.email || ""}
        onSave={handleSaveProfile}
      />

      <ChangePasswordModal
        visible={showChangePassword}
        onClose={() => setShowChangePassword(false)}
        onSave={handleChangePassword}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  profileInfo: {
    alignItems: "center",
    marginBottom: 12,
  },
  username: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  sectionContent: {
    borderRadius: 12,
    overflow: "hidden",
  },
  divider: {
    height: 1,
    marginLeft: 64,
  },
  preferenceLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
  },
});
