import { SplashScreenController } from "@/components/auth/splash-screen-controller";
import { useAuthContext } from "@/hooks/auth/use-auth-context";
import { useColorScheme } from "@/hooks/use-color-scheme";
import AuthProvider from "@/providers/auth-provider";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
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

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Pressable style={{ flex: 1 }} onPress={Keyboard.dismiss}>
        <AuthProvider>
          <SplashScreenController />
          <RootNavigator />
          <StatusBar style="auto" />
        </AuthProvider>
      </Pressable>
    </ThemeProvider>
  );
}
