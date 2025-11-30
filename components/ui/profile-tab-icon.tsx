import { useProfile } from "@/contexts/ProfileContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

export default function ProfileHeaderIcon() {
  const { profile } = useProfile();
  const router = useRouter();

  const navigateToProfile = () => {
    router.push("/profile");
  };

  return (
    <TouchableOpacity onPress={navigateToProfile} style={styles.container}>
      {profile?.avatar_url ? (
        <View style={styles.avatarContainer}>
          <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
        </View>
      ) : (
        <View style={styles.placeholderContainer}>
          <Ionicons name="person-circle-outline" size={32} color="#666" />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    marginRight: 16,
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#666",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  placeholderContainer: {
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
});
