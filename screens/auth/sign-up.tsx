import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import TextLink from "@/components/ui/text-link";
import { useTheme } from "@/hooks/use-theme";
import { supabase } from "@/utils/lib/supabase";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

export default function SignupScreen() {
  const { colors, neutral } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signUpWithEmail() {
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        emailRedirectTo: "prayerly://auth/callback",
      },
    });

    if (error) {
      Alert.alert("Error", error.message);
    } else if (!session) {
      Alert.alert(
        "Check your email",
        "Please check your inbox for email verification!"
      );
    }
    setLoading(false);
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerContainer}>
        <MaterialCommunityIcons
          name="hands-pray"
          size={50}
          color={neutral.primary}
        />
        <Text style={[styles.title, { color: colors.text }]}>
          A more consistent prayer life starts here.
        </Text>
      </View>
      <View style={styles.inputContainer}>
        <Input
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputContainer}>
        <Input
          onChangeText={setPassword}
          value={password}
          placeholder="Password"
          keyboardType="visible-password"
          secureTextEntry={true}
        />
      </View>

      <View style={styles.inputContainer}>
        <Input
          onChangeText={setConfirmPassword}
          value={confirmPassword}
          placeholder="Confirm password"
          keyboardType="visible-password"
          secureTextEntry={true}
        />
      </View>

      <Button
        label="Sign Up"
        onPress={signUpWithEmail}
        loading={loading}
        loadingMessage="Creating account..."
      />

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.subtext }]}>
          Already have an account?{" "}
        </Text>

        <TextLink href={"/(auth)/sign-in"} label={"Sign In"} bold={true} />
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
  headerContainer: {
    display: "flex",
    alignItems: "center",
    gap: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    color: "#666",
    fontSize: 14,
  },
});
