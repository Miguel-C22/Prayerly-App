import React, { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import TextLink from "@/components/ui/text-link";
import { useTheme } from "@/hooks/use-theme";
import { supabase } from "@/utils/lib/supabase";

export default function ForgotPasswordScreen() {
  const { colors } = useTheme();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function resetPassword() {
    if (!email) {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "prayerly://auth/reset-password",
    });

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert(
        "Check your email",
        "We've sent you a password reset link. Please check your inbox."
      );
    }
    setLoading(false);
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>Reset Password</Text>
      <Text style={styles.subtitle}>
        Enter your email address and we'll send you a link to reset your
        password.
      </Text>

      <View style={styles.inputContainer}>
        <Input
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          keyboardType="email-address"
        />
      </View>

      <Button
        label="Send Reset Link"
        onPress={resetPassword}
        loading={loading}
        loadingMessage="Sending..."
      />

      <View style={styles.footer}>
        <TextLink
          href={"/(auth)/sign-in"}
          label={"Back to Sign In"}
          bold={true}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  footer: {
    alignItems: "center",
  },
});
