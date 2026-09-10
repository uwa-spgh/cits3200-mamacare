import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { PreferencesProvider } from "../context/PreferencesContext";

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export default function RootLayout() {
  return (
    <PreferencesProvider>
      <StatusBar style="dark" />

      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#DFBEC3",
          },
          headerTintColor: "#AE214D",
          headerShadowVisible: true,
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="notifications"
          options={{
            headerShown: true,
            headerTitle: "MamaCare",

            // On iOS this keeps only the back arrow
            headerBackButtonDisplayMode: "minimal",
          }}
        />

        <Stack.Screen
          name="languageSelection"
          options={{
            headerTitle: "Language Selection",
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="+not-found"
          options={{}}
        />
      </Stack>
    </PreferencesProvider>
  );
}