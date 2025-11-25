import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import TextLink from "@/components/ui/text-link";
import { useTheme } from "@/hooks/use-theme";
import { supabase } from "@/utils/lib/supabase";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import React, { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";

export default function SignInScreen() {
  const { colors, neutral } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert("Error", error.message);
    setLoading(false);
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.headerContainer}>
        <FontAwesome5 name="cross" size={50} color={neutral.primary} />
        <Text style={[styles.title, { color: colors.text }]}>
          Your prayer journey matters, let’s continue!
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

      <TextLink
        href={"/(auth)/forgot-password"}
        label={"Forgot Password?"}
        style={{ alignSelf: "flex-end", marginBottom: 20 }}
      />

      <Button
        label="Sign In"
        onPress={signInWithEmail}
        loading={loading}
        loadingMessage="Signing in..."
      />
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: colors.subtext }]}>
          Don't have an account?{" "}
        </Text>

        <TextLink href={"/(auth)/sign-up"} label={"Sign Up"} bold={true} />
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
    fontSize: 14,
  },
});
