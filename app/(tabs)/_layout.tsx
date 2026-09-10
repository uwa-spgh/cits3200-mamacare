import { Tabs } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#AE214D",
        tabBarInactiveTintColor: "#66585B",

        tabBarShowLabel: false,

        headerShadowVisible: true,
        headerStyle: {
          backgroundColor: "#DFBEC3",
        },
        headerTintColor: "#AE214D",

        tabBarStyle: {
          backgroundColor: "#DFBEC3",

          // Base height + whatever space the phone needs
          height: 58 + insets.bottom,

          paddingTop: 8,
          paddingBottom: Math.max(insets.bottom, 8),
        },

        tabBarItemStyle: {
          alignItems: "center",
          justifyContent: "center",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerTitle: "MamaCare",

          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="planner"
        options={{
          headerTitle: "Planner",

          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "calendar" : "calendar-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="about"
        options={{
          headerTitle: "About",

          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={
                focused
                  ? "information-circle"
                  : "information-circle-outline"
              }
              size={26}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          headerTitle: "Settings",

          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "settings" : "settings-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}