import {createStackNavigator} from "@react-navigation/stack";
import SignInScreen from "../screens/auth/SignInScreen";
import SignUpScreen from "../screens/auth/SignUPScreen";
import LanguageSelectionScreen from "../screens/auth/LanguageSelectionScreen";

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
        </Stack.Navigator>
    );
}