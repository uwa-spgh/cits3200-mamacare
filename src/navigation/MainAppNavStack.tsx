import { createStackNavigator } from "@react-navigation/stack";
import AuthStack from "./AuthStak";
import MainAppBottomTabs from "./MainAppBottomTabs";

const Stack = createStackNavigator();

export default function MainAppNavStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="AuthStack" component={AuthStack} />
      <Stack.Screen name="MainAppBottomTabs" component={MainAppBottomTabs} />
    </Stack.Navigator>
  );
}
