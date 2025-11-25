import { supabase } from "@/utils/lib/supabase";
import * as Linking from "expo-linking";
import { router } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { useTheme } from "@/hooks/use-theme";

export default function AuthCallback() {
  const { colors, neutral } = useTheme();

  useEffect(() => {
    // Get the initial URL that opened the app
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink(url);
      }
    });

    // Listen for incoming links while app is open
    const subscription = Linking.addEventListener("url", ({ url }) => {
      handleDeepLink(url);
    });

    return () => subscription.remove();
  }, []);

  async function handleDeepLink(url: string) {
    try {
      // Extract tokens from URL hash (Supabase uses hash fragments)
      const hashParams = url.split("#")[1];
      if (!hashParams) {
        router.replace("/(tabs)");
        return;
      }

      const params = new URLSearchParams(hashParams);
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");

      if (accessToken && refreshToken) {
        // Set the session with the tokens from the URL
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          console.error("Error setting session:", error);
        }
      }

      // Redirect to home
      router.replace("/(tabs)");
    } catch (error) {
      console.error("Error handling deep link:", error);
      router.replace("/(tabs)");
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ActivityIndicator size="large" color={neutral.primary} />
      <Text style={[styles.text, { color: colors.text }]}>
        Verifying your account...
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
  },
  text: {
    fontSize: 16,
  },
});
