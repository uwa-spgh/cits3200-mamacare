import { createStackNavigator } from "expo-router/js-stack";
import AuthStack from "./AuthStak";
import MainAppBottomTabs from "./MainAppBottomTabs";
import DangerSignsScreen from "../screens/library/danger-signs";
import { useTranslation } from "react-i18next";

const Stack = createStackNavigator();

export default function MainAppNavStack() {

  const { t} = useTranslation();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        headerBackTitle: t("buttonArrows.back"),
        headerBackAccessibilityLabel: t("buttonArrows.backAccessibility"),
      }}
    >
      <Stack.Screen name="AuthStack" component={AuthStack} />
      <Stack.Screen name="MainAppBottomTabs" component={MainAppBottomTabs} />
      <Stack.Screen
        name="DangerSigns"
        component={DangerSignsScreen}
        options={{
          headerShown: true,
          title: t("libraryScreen.dangerSigns"),
        }}
      />
    </Stack.Navigator>
  );
}
