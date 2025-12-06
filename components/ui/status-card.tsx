import { useTheme } from "@/hooks/use-theme";
import { StyleSheet, Text, View } from "react-native";

interface StatusCardProps {
  unansweredCount: number;
  answeredCount: number;
  journalCount: number;
}

export default function StatusCard({
  unansweredCount,
  answeredCount,
  journalCount
}: StatusCardProps) {
  const { colors, neutral } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <View style={styles.stat}>
        <Text style={[styles.number, { color: neutral.primary }]}>
          {unansweredCount}
        </Text>
        <Text style={[styles.label, { color: colors.subtext }]}>
          Unanswered
        </Text>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.background }]} />

      <View style={styles.stat}>
        <Text style={[styles.number, { color: neutral.primary }]}>
          {answeredCount}
        </Text>
        <Text style={[styles.label, { color: colors.subtext }]}>
          Answered
        </Text>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.background }]} />

      <View style={styles.stat}>
        <Text style={[styles.number, { color: neutral.primary }]}>
          {journalCount}
        </Text>
        <Text style={[styles.label, { color: colors.subtext }]}>
          Journal Entries
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  number: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 4,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
  },
  divider: {
    width: 1,
    marginHorizontal: 8,
  },
});
