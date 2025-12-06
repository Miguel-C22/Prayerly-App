import { useTheme } from "@/hooks/use-theme";
import { Tag } from "@/services/tags";
import { Ionicons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";

interface TagFilterListProps {
  tags: Tag[];
  selectedTagId: string | null;
  onSelectTag: (tagId: string | null) => void;
}

export default function TagFilterList({
  tags,
  selectedTagId,
  onSelectTag,
}: TagFilterListProps) {
  const { colors, neutral } = useTheme();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      {/* "All" filter button */}
      <TouchableOpacity
        style={[
          styles.tag,
          { backgroundColor: colors.card },
          selectedTagId === null && { backgroundColor: neutral.primary },
        ]}
        onPress={() => onSelectTag(null)}
      >
        <Text
          style={[
            styles.tagText,
            { color: colors.text },
            selectedTagId === null && { color: '#fff' },
          ]}
        >
          All
        </Text>
      </TouchableOpacity>

      {/* Tag filter buttons */}
      {tags.map((tag) => (
        <TouchableOpacity
          key={tag.id}
          style={[
            styles.tag,
            { backgroundColor: colors.card },
            selectedTagId === tag.id && { backgroundColor: neutral.primary },
          ]}
          onPress={() => onSelectTag(tag.id)}
        >
          <Ionicons
            name={tag.icon_name as any}
            size={14}
            color={selectedTagId === tag.id ? '#fff' : neutral.primary}
          />
          <Text
            style={[
              styles.tagText,
              { color: colors.text },
              selectedTagId === tag.id && { color: '#fff' },
            ]}
          >
            {tag.name}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  content: {
    paddingRight: 16,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
