import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useColorScheme as useDeviceColorScheme } from "react-native";

type ThemeMode = "light" | "dark" | "system";
type ColorScheme = "light" | "dark";

interface ThemeContextType {
  themeMode: ThemeMode;
  colorScheme: ColorScheme;
  setThemeMode: (mode: ThemeMode) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = "@theme_mode";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const deviceColorScheme = useDeviceColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>("system");

  // Load theme preference on mount
  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme === "light" || savedTheme === "dark" || savedTheme === "system") {
        setThemeModeState(savedTheme);
      }
    } catch (error) {
      console.error("Error loading theme preference:", error);
    }
  };

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      setThemeModeState(mode);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.error("Error saving theme preference:", error);
    }
  };

  // Determine actual color scheme based on theme mode
  const colorScheme: ColorScheme =
    themeMode === "system"
      ? deviceColorScheme ?? "light"
      : themeMode;

  return (
    <ThemeContext.Provider value={{ themeMode, colorScheme, setThemeMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
}
