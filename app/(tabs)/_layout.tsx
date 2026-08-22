import { Tabs } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { Ionicons } from '@expo/vector-icons';

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export default function TabsLayout() {
  return (
    <Tabs
        screenOptions={{
            tabBarActiveTintColor: "#AE214D",
            headerShadowVisible: true,
            headerStyle: {
                backgroundColor: "#DFBEC3"
            },
            tabBarStyle: {
                backgroundColor: "#DFBEC3"
            },
            headerTintColor: "#AE214D"
        }}

    >
      <Tabs.Screen name="index" 
      options = {{
        headerTitle:"MamaCare",
        tabBarIcon: (
            {focused, color}) => 
            <Ionicons 
            name ={ focused ? "home-sharp" : "home-outline"}
            size = {30}
            />,
      }} 
      />

      <Tabs.Screen name = "settings"
      options = {{
        headerTitle: "Settings",
        headerShown: true, //removes header, Set True for now, will be removed later
        tabBarIcon: (
          {focused, color}) => 
          <Ionicons 
          name ={ focused ? "settings" : "settings-outline"}
          size = {30}
          />,
      }}
      />

      <Tabs.Screen name="languageSelection"
      options={{
        headerTitle: "LangugaeSelection",
      }} 
      />
      <Tabs.Screen name="about"
      options = {{
        headerTitle:"About",
        tabBarIcon: (
            {focused, color}) => 
            <Ionicons 
            name ={ focused ? "information-circle" : "information-outline"}
            size = {30}
            />,
      }} 
      />

    </Tabs>
  );
}
