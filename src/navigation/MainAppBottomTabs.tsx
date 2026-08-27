import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/home/HomeScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import MedsScreen from "../screens/meds/MedsScreen";
import LibraryScreen from "../screens/library/LibraryScreen";
import { AppColors } from "../styles/colors";
import { s, vs } from "react-native-size-matters";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { IS_ANDROID } from "../constants/constants";

const Tab = createBottomTabNavigator();

export default function MainAppBottomTabs() {
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
          title: "Home",
        }}
      />
      <Tab.Screen
        name="Meds"
        component={MedsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="pills" size={size} color={color}/>
          ),
          title: "Meds",
        }}
      />
      <Tab.Screen name="Library" component={LibraryScreen} 
      options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="university" size={size} color={color}/>
          ),
          title: "Library",
        }}/>
      <Tab.Screen name="Profile" component={ProfileScreen} options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="user" size={size} color={color}/>
          ),
          title: "Profile",
        }}/>
    </Tab.Navigator>
  );
}
