import {createStackNavigator} from "expo-router/js-stack";
import SignInScreen from "../screens/auth/SignInScreen";
import SignUpScreen from "../screens/auth/SignUPScreen";
import LanguageSelectionScreen from "../screens/auth/LanguageSelectionScreen";
import InitialSetupScreen from "../screens/auth/InitialSetupScreen";
import WelcomeScreen from "../screens/auth/WelcomeScreen";

const Stack = createStackNavigator();

export default function AuthStack() {
    return (
        <Stack.Navigator
        screenOptions={{
            headerShown: false
        }
        }>
            {/*<Stack.Screen name="SignInScreen" component={SignInScreen} />
            <Stack.Screen name="SignUpScreen" component={SignUpScreen} />*/}
            <Stack.Screen name="LanguageSelectionScreen" component={LanguageSelectionScreen} />
            <Stack.Screen name="InitialSetupScreen" component={InitialSetupScreen} />
            <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
        </Stack.Navigator>
    );
}