import { AuthContext } from "@/hooks/auth/use-auth-context";
import { supabase } from "@/utils/lib/supabase";
import type { Session } from "@supabase/supabase-js";
import * as Linking from "expo-linking";
import { PropsWithChildren, useEffect, useState } from "react";

// Provider component to manage the authentication session throughout the app:
export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | undefined | null>();
  const [profile, setProfile] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // Fetch the session once, and subscribe to auth state changes
  useEffect(() => {
    const fetchSession = async () => {
      setIsLoading(true);
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error) {
        console.error("Error fetching session:", error);
      }
      setSession(session);
      setIsLoading(false);
    };
    fetchSession();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      console.log("Auth state changed:", { event: _event, session });
      setSession(session);
    });
    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Handle deep links for auth (email verification, password reset)
  useEffect(() => {
    const handleDeepLink = async (url: string) => {
      if (!url) return;

      // Extract tokens from URL hash (Supabase uses hash fragments)
      const hashParams = url.split("#")[1];
      if (!hashParams) return;

      const params = new URLSearchParams(hashParams);
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");

      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });

        if (error) {
          console.error("Error setting session from deep link:", error);
        }
      }
    };

    // Check for initial URL (app opened via deep link)
    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink(url);
    });

    // Listen for incoming links while app is open
    const subscription = Linking.addEventListener("url", ({ url }) => {
      handleDeepLink(url);
    });

    return () => subscription.remove();
  }, []);

  // Fetch the profile when the session changes
  useEffect(() => {
    const fetchProfile = async () => {
      if (session) {
        try {
          const { data } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();
          setProfile(data);
        } catch (error) {
          console.log("Profile fetch error (table may not exist):", error);
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
    };
    fetchProfile();
  }, [session]);
  return (
    <AuthContext.Provider
      value={{
        session,
        isLoading,
        profile,
        isLoggedIn: !!session,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
