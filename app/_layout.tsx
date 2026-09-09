import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
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

      <Stack>
        <Stack.Screen 
          name="(tabs)" 
          options = {{
            headerTitle:"MamaCare",
            headerShown: false, // hide header
            headerLeft: () => <></>, // removes the "go back" button that automatically is created
          }} 
        />

        <Stack.Screen 
          name="languageSelection"
          options={{
            headerTitle: "Language Selection",
            headerShown:false,
          }} 
        />
        
        <Stack.Screen name="+not-found" options = {{}} />
        
      </Stack>
    </PreferencesProvider>
  );
}
