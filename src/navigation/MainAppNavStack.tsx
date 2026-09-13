import { createStackNavigator } from "expo-router/js-stack";
import AuthStack from "./AuthStak";
import MainAppBottomTabs from "./MainAppBottomTabs";
import DangerSignsScreen from "../screens/library/danger-signs";
import AddMedicationScreen from "../screens/meds/addMedication";
import MedicationHistoryScreen from "../screens/meds/history";
import MedicationDetailsScreen from "../screens/meds/medicationDetails";
import ProfileScreen from "../screens/profile/ProfileScreen";
import { useTranslation } from "react-i18next";
import BackBtn from "../components/buttons/BackBtn";
import { HeaderTitle } from "expo-router/react-navigation";
import { AppColors } from "../styles/colors";
import { AppFonts } from "../styles/fonts";
import { s } from "react-native-size-matters";
import { Ionicons } from "@expo/vector-icons";

const Stack = createStackNavigator();

export default function MainAppNavStack() {
  const { t } = useTranslation();

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
      <Stack.Screen name="AddMedication" component={AddMedicationScreen} />
      <Stack.Screen
        name="MedicationHistory"
        component={MedicationHistoryScreen}
      />
      <Stack.Screen
        name="MedicationDetails"
        component={MedicationDetailsScreen}
      />
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          headerShown: true,
          headerTitle: t("navTabs.profileTab"),
          headerStyle: { backgroundColor: AppColors.background_primary },
          headerTitleStyle: {
            fontFamily: AppFonts.Heading1Bold,
            color: AppColors.button_primary_accent,
            fontSize: s(20)
          },
          headerBackTitleStyle: { fontFamily: AppFonts.Heading1Bold },
          headerTintColor: AppColors.text_secondary,
          headerBackImage: () => <Ionicons name="chevron-back" size={s(20)} />,
        }}
      />
    </Stack.Navigator>
  );
}
