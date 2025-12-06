import { useTheme } from "@/hooks/use-theme";
import { Verse } from "@/constants/verses";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface VerseCardProps {
  verse: Verse;
}

export default function VerseCard({ verse }: VerseCardProps) {
  const { colors, neutral } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.icon}>
        <Ionicons name="book" size={20} color={neutral.primary} opacity={0.5} />
      </View>
      <Text style={[styles.text, { color: colors.text }]}>
        &ldquo;{verse.text}&rdquo;
      </Text>
      <Text style={[styles.reference, { color: colors.subtext }]}>
        {verse.reference}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    position: 'relative',
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '500',
    marginBottom: 8,
  },
  reference: {
    fontSize: 14,
    fontWeight: '600',
  },
  icon: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
});
