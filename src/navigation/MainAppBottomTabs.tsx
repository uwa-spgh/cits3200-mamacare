import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/home/HomeScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";
import MedsScreen from "../screens/meds/MedsScreen";
import LibraryScreen from "../screens/library/LibraryScreen";

const Tab = createBottomTabNavigator()

export default function MainAppBottomTabs () {

return (
    <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen}/>
        <Tab.Screen name="Meds" component={MedsScreen}/>
        <Tab.Screen name="Library" component={LibraryScreen}/>
        <Tab.Screen name="Profile" component={ProfileScreen}/>
    </Tab.Navigator>
)

}