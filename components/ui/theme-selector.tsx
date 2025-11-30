import { useThemeContext } from "@/contexts/ThemeContext";
import { useTheme } from "@/hooks/use-theme";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type ThemeMode = "light" | "dark" | "system";

export default function ThemeSelector() {
  const { colors } = useTheme();
  const { themeMode, setThemeMode } = useThemeContext();

  const options: { mode: ThemeMode; label: string; icon: any }[] = [
    { mode: "light", label: "Light", icon: "sunny" },
    { mode: "dark", label: "Dark", icon: "moon" },
    { mode: "system", label: "System", icon: "phone-portrait" },
  ];

  return (
    <View style={styles.container}>
      {options.map((option) => {
        const isSelected = themeMode === option.mode;
        return (
          <TouchableOpacity
            key={option.mode}
            style={[
              styles.option,
              {
                backgroundColor: isSelected ? colors.card : colors.background,
                borderColor: isSelected ? colors.text : colors.card,
              },
            ]}
            onPress={() => setThemeMode(option.mode)}
          >
            <Ionicons
              name={option.icon}
              size={20}
              color={isSelected ? colors.text : colors.subtext}
            />
            <Text
              style={[
                styles.optionText,
                { color: isSelected ? colors.text : colors.subtext },
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
  },
  option: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    gap: 6,
  },
  optionText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
