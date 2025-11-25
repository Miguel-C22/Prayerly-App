import { useAuthContext } from "@/hooks/auth/use-auth-context";
import { SplashScreen } from "expo-router";

// SplashScreenController component to display the Expo SplashScreen while the authentication session is loading:

SplashScreen.preventAutoHideAsync();

export function SplashScreenController() {
  const { isLoading } = useAuthContext();

  if (!isLoading) {
    SplashScreen.hideAsync();
  }

  return null;
}
