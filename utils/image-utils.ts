import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

export interface ImagePickerResult {
  uri: string;
  width?: number;
  height?: number;
  type?: string;
}

/**
 * Pick an image from camera or library with proper permissions
 * @param useCamera - true for camera, false for library
 * @returns Image data or null if canceled/failed
 */
export async function pickImage(
  useCamera: boolean = false
): Promise<ImagePickerResult | null> {
  try {
    // Request permissions
    const permissionResult = useCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.status !== "granted") {
      Alert.alert(
        "Permission Needed",
        useCamera
          ? "Camera permission is required to take photos."
          : "Photo library permission is required to select images."
      );
      return null;
    }

    // Launch image picker or camera
    const result = useCamera
      ? await ImagePicker.launchCameraAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        })
      : await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });

    // Safely check result using optional chaining
    if (result.canceled) {
      return null;
    }

    const asset = result.assets?.[0];
    if (!asset?.uri) {
      return null;
    }

    return {
      uri: asset.uri,
      width: asset.width,
      height: asset.height,
      type: asset.type,
    };
  } catch (error) {
    Alert.alert("Error", "Failed to select image");
    return null;
  }
}

/**
 * Show options to pick image from camera or library
 * @param onImageSelected - Callback with selected image URI
 */
export function showImagePickerOptions(
  onImageSelected: (uri: string) => void | Promise<void>
): void {
  Alert.alert("Profile Photo", "Choose an option", [
    {
      text: "Take Photo",
      onPress: async () => {
        const result = await pickImage(true);
        if (result) {
          await onImageSelected(result.uri);
        }
      },
    },
    {
      text: "Choose from Library",
      onPress: async () => {
        const result = await pickImage(false);
        if (result) {
          await onImageSelected(result.uri);
        }
      },
    },
    {
      text: "Cancel",
      style: "cancel",
    },
  ]);
}
