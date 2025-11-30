import { useTheme } from "@/hooks/use-theme";
import { uploadAvatar } from "@/services/profile";
import { showImagePickerOptions } from "@/utils/image-utils";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export interface ProfileImageUploadProps {
  currentImageUrl?: string;
  onUploadComplete: (imageUrl: string) => void;
}

export default function ProfileImageUpload({
  currentImageUrl,
  onUploadComplete,
}: ProfileImageUploadProps) {
  const { colors, neutral } = useTheme();
  const [uploading, setUploading] = useState<boolean>(false);

  const handleUpload = async (uri: string) => {
    try {
      setUploading(true);

      const { data: publicUrl, error } = await uploadAvatar(uri);

      if (error || !publicUrl) {
        throw new Error("Failed to upload image");
      }

      onUploadComplete(publicUrl);
    } catch (error) {
      Alert.alert("Upload Failed", "Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => showImagePickerOptions(handleUpload)}
      disabled={uploading}
    >
      <View style={styles.imageWrapper}>
        <View
          style={[
            styles.imageContainer,
            { backgroundColor: colors.card, borderColor: neutral.primary },
          ]}
        >
          {currentImageUrl ? (
            <Image source={{ uri: currentImageUrl }} style={styles.image} />
          ) : (
            <View
              style={[
                styles.placeholder,
                { backgroundColor: colors.background },
              ]}
            >
              <Ionicons
                name="person-circle-outline"
                size={80}
                color={colors.subtext}
              />
            </View>
          )}

          {uploading && (
            <View style={styles.uploadingOverlay}>
              <ActivityIndicator size="large" color="#fff" />
            </View>
          )}
        </View>

        <View style={[styles.editBadge, { backgroundColor: neutral.primary }]}>
          <Ionicons name="camera" size={16} color="#fff" />
        </View>
      </View>

      {uploading && (
        <Text style={[styles.uploadingText, { color: colors.subtext }]}>
          Uploading...
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 20,
  },
  imageWrapper: {
    width: 120,
    height: 120,
    position: "relative",
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  uploadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  uploadingText: {
    marginTop: 8,
    fontSize: 14,
  },
});
