import { createBottomTabNavigator } from "expo-router/js-tabs";
import HomeScreen from "../screens/home/HomeScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import MedsScreen from "../screens/meds/MedsScreen";
import LibraryScreen from "../screens/library/LibraryScreen";
import { AppColors } from "../styles/colors";
import { s, vs } from "react-native-size-matters";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { IS_ANDROID } from "../constants/constants";
import { useTranslation } from "react-i18next";

const Tab = createBottomTabNavigator();

export default function MainAppBottomTabs() {
  
  const {t} = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: AppColors.button_primary_accent,
        tabBarInactiveTintColor: AppColors.text_secondary,
        tabBarLabelStyle: {
          marginTop: vs(4),
          fontSize: s(12),
        },
        tabBarStyle: IS_ANDROID && {
            height: vs(50)
        }
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="home" size={size} color={color} />
          ),
          title: t("navTabs.homeTab"),
        }}
      />
      <Tab.Screen
        name="Meds"
        component={MedsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="pills" size={size} color={color}/>
          ),
          title: t("navTabs.medsTab"),
        }}
      />
      <Tab.Screen name="Library" component={LibraryScreen} 
      options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="university" size={size} color={color}/>
          ),
          title:t("navTabs.libraryTab"),
        }}/>
      <Tab.Screen name="Profile" component={ProfileScreen} options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="user" size={size} color={color}/>
          ),
          title: t("navTabs.profileTab"),
        }}/>
    </Tab.Navigator>
  );
}
