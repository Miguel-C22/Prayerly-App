import { Colors, neutralColors, ThemeColors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

type Theme = {
  colors: ThemeColors;
  neutral: typeof neutralColors;
  isDark: boolean;
};

/**
 * Hook to get all theme colors based on current color scheme
 *
 * Usage:
 * const { colors, neutral, isDark } = useTheme();
 * <View style={{ backgroundColor: colors.background }}>
 *   <Text style={{ color: colors.text }}>Hello</Text>
 *   <Button color={neutral.primary} />
 * </View>
 */
export function useTheme(): Theme {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return {
    colors: Colors[colorScheme ?? "light"],
    neutral: neutralColors,
    isDark,
  };
}
