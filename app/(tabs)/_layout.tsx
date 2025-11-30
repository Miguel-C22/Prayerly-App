import ProfileHeaderIcon from "@/components/ui/profile-tab-icon";
import { Colors } from "@/constants/theme";
import { JournalProvider } from "@/contexts/JournalContext";
import { PrayersProvider } from "@/contexts/PrayersContext";
import { ProfileProvider } from "@/contexts/ProfileContext";
import { RemindersProvider } from "@/contexts/RemindersContext";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <PrayersProvider>
      <RemindersProvider>
        <JournalProvider>
          <ProfileProvider>
            <Tabs
              screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
                headerShown: true,
              }}
            >
            <Tabs.Screen
              name="index"
              options={{
                title: "Home",
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="home" size={size} color={color} />
                ),
                headerRight: () => <ProfileHeaderIcon />,
              }}
            />
            <Tabs.Screen
              name="journal"
              options={{
                title: "Journal",
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="journal" size={size} color={color} />
                ),
                headerRight: () => <ProfileHeaderIcon />,
              }}
            />
            <Tabs.Screen
              name="reminders"
              options={{
                title: "Reminders",
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="notifications" size={size} color={color} />
                ),
                headerRight: () => <ProfileHeaderIcon />,
              }}
            />
            <Tabs.Screen
              name="profile"
              options={{
                title: "Profile",
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="person" size={size} color={color} />
                ),
              }}
            />
            <Tabs.Screen
              name="create"
              options={{
                title: "Create",
                tabBarIcon: ({ color, size }) => (
                  <Ionicons name="add" size={size} color={color} />
                ),
                headerRight: () => <ProfileHeaderIcon />,
              }}
            />
          </Tabs>
          </ProfileProvider>
        </JournalProvider>
      </RemindersProvider>
    </PrayersProvider>
  );
}
