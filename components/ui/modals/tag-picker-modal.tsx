import Button from "@/components/ui/button";
import ModalHeader from "@/components/ui/modal-header";
import { useTheme } from "@/hooks/use-theme";
import { Tag } from "@/services/tags";
import { Ionicons } from "@expo/vector-icons";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface TagPickerModalProps {
  visible: boolean;
  onClose: () => void;
  tags: Tag[];
  selectedTagId: string | null;
  onSelectTag: (tagId: string | null) => void;
}

export default function TagPickerModal({
  visible,
  onClose,
  tags,
  selectedTagId,
  onSelectTag,
}: TagPickerModalProps) {
  const { colors, neutral } = useTheme();
  const insets = useSafeAreaInsets();

  const handleSelectTag = (tagId: string | null) => {
    onSelectTag(tagId);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <ModalHeader title="Select Tag" onClose={onClose} />

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* No tag option */}
          <TouchableOpacity
            style={[styles.tagOption, { backgroundColor: colors.card }]}
            onPress={() => handleSelectTag(null)}
          >
            <View style={styles.left}>
              <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
                <Ionicons name="close-circle" size={20} color={colors.subtext} />
              </View>
              <Text style={[styles.tagName, { color: colors.text }]}>
                No Tag
              </Text>
            </View>
            {selectedTagId === null && (
              <Ionicons name="checkmark" size={24} color={neutral.primary} />
            )}
          </TouchableOpacity>

          {/* Tag options */}
          {tags.map((tag) => (
            <TouchableOpacity
              key={tag.id}
              style={[styles.tagOption, { backgroundColor: colors.card }]}
              onPress={() => handleSelectTag(tag.id)}
            >
              <View style={styles.left}>
                <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
                  <Ionicons name={tag.icon_name as any} size={20} color={neutral.primary} />
                </View>
                <Text style={[styles.tagName, { color: colors.text }]}>
                  {tag.name}
                </Text>
              </View>
              {selectedTagId === tag.id && (
                <Ionicons name="checkmark" size={24} color={neutral.primary} />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
          <Button label="Cancel" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  tagOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tagName: {
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
});
