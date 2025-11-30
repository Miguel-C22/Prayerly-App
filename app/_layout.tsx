import { SplashScreenController } from "@/components/auth/splash-screen-controller";
import { ThemeProvider as CustomThemeProvider } from "@/contexts/ThemeContext";
import { useAuthContext } from "@/hooks/auth/use-auth-context";
import { useTheme } from "@/hooks/use-theme";
import AuthProvider from "@/providers/auth-provider";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { Redirect, Stack, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Keyboard, Pressable } from "react-native";

function RootNavigator() {
  const { isLoggedIn, isLoading } = useAuthContext();
  const segments = useSegments();

  // Don't redirect while still loading
  if (isLoading) return null;

  // Check if we're on an auth screen
  const inAuthGroup = segments[0] === "(auth)";

  // Redirect based on auth state
  if (!isLoggedIn && !inAuthGroup) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  if (isLoggedIn && inAuthGroup) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="auth/callback" options={{ headerShown: false }} />
    </Stack>
  );
}

function ThemedApp() {
  const { isDark } = useTheme();

  return (
    <NavigationThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
      <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        <AuthProvider>
          <SplashScreenController />
          <RootNavigator />
          <StatusBar style={isDark ? "light" : "dark"} />
        </AuthProvider>
      </Pressable>
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <CustomThemeProvider>
      <ThemedApp />
    </CustomThemeProvider>
  );
}
