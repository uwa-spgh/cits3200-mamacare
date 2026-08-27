import {createStackNavigator} from "@react-navigation/stack";
import SignInScreen from "../screens/auth/SignInScreen";
import SignUpScreen from "../screens/auth/SignUPScreen";

const Stack = createStackNavigator();

export default function AuthStack() {
    return (
        <Stack.Navigator
        screenOptions={{
            headerShown: false
        }
        }>
            <Stack.Screen name="SignInScreen" component={SignInScreen} />
            <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
        </Stack.Navigator>
    );
}