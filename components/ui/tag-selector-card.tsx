import { useTheme } from "@/hooks/use-theme";
import { Tag } from "@/services/tags";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface TagSelectorCardProps {
  tags: Tag[];
  selectedTagId: string | null;
  onPress: () => void;
  disabled?: boolean;
}

export default function TagSelectorCard({
  tags,
  selectedTagId,
  onPress,
  disabled = false,
}: TagSelectorCardProps) {
  const { colors, neutral } = useTheme();

  const selectedTag = selectedTagId
    ? tags.find((t) => t.id === selectedTagId)
    : null;

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.card }]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View style={styles.left}>
        <View
          style={[styles.iconContainer, { backgroundColor: colors.background }]}
        >
          <Ionicons
            name={
              selectedTag?.icon_name
                ? (selectedTag.icon_name as any)
                : "pricetag-outline"
            }
            size={20}
            color={neutral.primary}
          />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.label, { color: colors.subtext }]}>
            Prayer Tag
          </Text>
          <Text style={[styles.value, { color: colors.text }]}>
            {selectedTag?.name || "No tag selected"}
          </Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.subtext} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 16,
    padding: 16,
    marginTop: 24,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 2,
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
  },
});
