import SettingsRow from "@/components/ui/settings-row";
import { supabase } from "@/utils/lib/supabase";
import React from "react";

async function onSignOutButtonPress() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error("Error signing out:", error);
  }
}

export default function SignOutButton() {
  return (
    <SettingsRow
      icon="log-out-outline"
      label="Sign Out"
      onPress={onSignOutButtonPress}
      showChevron={false}
      destructive
    />
  );
}
