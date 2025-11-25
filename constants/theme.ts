import { Platform } from "react-native";

// Colors that NEVER change between themes
export const neutralColors = {
  primary: "#a092e8",
  accent: "#a092e8",
  success: "#4CAF50",
  warning: "#FFC107",
  danger: "#FF5252",
};

// Colors for LIGHT mode
const lightColors = {
  background: "#f7f6f8",
  card: "#ffffff",
  text: "#4A4A68",
  subtext: "#6E6E8A",
  inputBackground: "#ffffff",
  inputText: "#1A1A1A",
  placeholder: "#8C8C99",
  // Tab bar
  tint: neutralColors.primary,
  tabIconDefault: "#6E6E8A",
  tabIconSelected: neutralColors.primary,
  icon: "#6E6E8A",
};

// Colors for DARK mode
const darkColors = {
  background: "#121212",
  card: "#1e1e1e",
  text: "#FFFFFF",
  subtext: "#a0a0a0",
  inputBackground: "#1e1e1e",
  inputText: "#FFFFFF",
  placeholder: "#6b6b6b",
  // Tab bar
  tint: neutralColors.primary,
  tabIconDefault: "#8a8a8a",
  tabIconSelected: neutralColors.primary,
  icon: "#8a8a8a",
};

// Combined Colors object for theme system
export const Colors = {
  light: lightColors,
  dark: darkColors,
};

// Type for theme colors
export type ThemeColors = typeof lightColors;

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
