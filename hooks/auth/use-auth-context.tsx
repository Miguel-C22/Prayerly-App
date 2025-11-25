import { Session } from "@supabase/supabase-js";
import { createContext, useContext } from "react";

// React context to manage the authentication session, making it accessible from any component:

export type AuthData = {
  session?: Session | null;
  profile?: any | null;
  isLoading: boolean;
  isLoggedIn: boolean;
};

export const AuthContext = createContext<AuthData>({
  session: undefined,
  profile: undefined,
  isLoading: true,
  isLoggedIn: false,
});

export const useAuthContext = () => useContext(AuthContext);
