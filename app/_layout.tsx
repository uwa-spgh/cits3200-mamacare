import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from "expo-status-bar";

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export default function RootLayout() {
  return (
    <>
    <StatusBar style="dark" />
      <Stack>
        <Stack.Screen name="(tabs)" 
        options = {{
          headerTitle:"MamaCare",
          headerShown: false,
          headerLeft: () => <></>, // removes the "go back" button that automatically is created
        }} 
        />
        <Stack.Screen name="languageSelection"
        options={{
          headerTitle: "LangugaeSelection",
        }} 
        />
        <Stack.Screen name="+not-found" options = {{}} />
      </Stack>
    </>
  );
}
