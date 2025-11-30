import { useAuthContext } from "@/hooks/auth/use-auth-context";
import { SplashScreen } from "expo-router";
import { useEffect } from "react";

// SplashScreenController component to display the Expo SplashScreen while the authentication session is loading:

SplashScreen.preventAutoHideAsync();

export function SplashScreenController() {
  const { isLoading } = useAuthContext();

  useEffect(() => {
    if (!isLoading) {
      // Hide splash screen only once when loading is done
      SplashScreen.hideAsync().catch(() => {
        // Splash screen may already be hidden, suppress error
      });
    }
  }, [isLoading]);

  return null;
}
