import SignOutButton from "@/components/auth/sign-out-button";
import ChangePasswordModal from "@/components/ui/modals/change-password-modal";
import EditProfileModal from "@/components/ui/modals/edit-profile-modal";
import ProfileHeader from "@/components/ui/profile-header";
import SettingsRow from "@/components/ui/settings-row";
import { useTheme } from "@/hooks/use-theme";
import { useState } from "react";
import {
  Linking,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";

const MOCK_USER = {
  username: "John Doe",
  email: "john.doe@example.com",
  profilePicture: undefined,
};

export default function ProfileScreen() {
  const { colors, neutral, isDark } = useTheme();
  const [user, setUser] = useState(MOCK_USER);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [darkMode, setDarkMode] = useState(isDark);

  const handleChangePhoto = () => {
    console.log("Change photo");
  };

  const handleSaveProfile = (username: string, email: string) => {
    setUser((prev) => ({ ...prev, username, email }));
  };

  const handleChangePassword = (
    currentPassword: string,
    newPassword: string
  ) => {
    console.log("Password changed");
  };

  const handleToggleTheme = (value: boolean) => {
    setDarkMode(value);
  };

  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Header */}
        <ProfileHeader
          username={user.username}
          email={user.email}
          profilePicture={user.profilePicture}
          onChangePhoto={handleChangePhoto}
        />

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
            style={[styles.sectionContent, { backgroundColor: colors.card }]}
          >
            <SettingsRow
              icon="moon-outline"
              label="Dark Mode"
              showChevron={false}
              rightElement={
                <Switch
                  value={darkMode}
                  onValueChange={handleToggleTheme}
                  trackColor={{
                    false: colors.background,
                    true: neutral.primary,
                  }}
                  thumbColor="#fff"
                />
              }
            />
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
        username={user.username}
        email={user.email}
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
});
