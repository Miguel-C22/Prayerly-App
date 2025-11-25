import { useTheme } from "@/hooks/use-theme";
import { Href, Link } from "expo-router";
import React from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
} from "react-native";

interface TextLinkProps {
  href: Href;
  label: string;
  bold?: boolean;
  style?: StyleProp<TextStyle>;
}

export default function TextLink({
  href,
  label,
  bold = false,
  style,
}: TextLinkProps) {
  const { neutral } = useTheme();

  return (
    <View>
      <Link href={href} asChild>
        <TouchableOpacity>
          <Text
            style={[
              styles.linkText,
              { color: neutral.primary },
              bold && styles.text,
              style,
            ]}
          >
            {label}
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  linkText: {
    fontSize: 14,
  },
  text: {
    fontWeight: "600",
  },
});
