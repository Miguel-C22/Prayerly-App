import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export interface ProfileHeaderProps {
  username: string;
  email: string;
  profilePicture?: string;
  onChangePhoto: () => void;
}

export default function ProfileHeader({
  username,
  email,
  profilePicture,
  onChangePhoto,
}: ProfileHeaderProps) {
  const { colors, neutral } = useTheme();

  return (
    <View style={styles.container}>
      {/* Profile Picture */}
      <TouchableOpacity style={styles.photoContainer} onPress={onChangePhoto}>
        {profilePicture ? (
          <Image source={{ uri: profilePicture }} style={styles.photo} />
        ) : (
          <View
            style={[styles.photoPlaceholder, { backgroundColor: colors.card }]}
          >
            <Ionicons name="person" size={40} color={colors.subtext} />
          </View>
        )}
        <View
          style={[styles.editBadge, { backgroundColor: neutral.primary }]}
        >
          <Ionicons name="camera" size={14} color="#fff" />
        </View>
      </TouchableOpacity>

      {/* User Info */}
      <Text style={[styles.username, { color: colors.text }]}>{username}</Text>
      <Text style={[styles.email, { color: colors.subtext }]}>{email}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 24,
  },
  photoContainer: {
    position: "relative",
    marginBottom: 16,
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  photoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  username: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
  },
});
