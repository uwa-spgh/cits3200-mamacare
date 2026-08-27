import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import AppSafeView from "./src/components/views/AppSafeView";
import AppButton from "./src/components/buttons/AppButton";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { AppColors } from "./src/styles/colors";
import MamaCareLogo from "./src/assets/icons";
import SignInScreen from "./src/screens/auth/SignInScreen";
import SignUpScreen from "./src/screens/auth/SignUPScreen";
import MainAppNavStack from "./src/navigation/MainAppNavStack";
import { NavigationContainer } from "@react-navigation/native";

export default function App() {
  return (
    <>
      <NavigationContainer>
        <FlashMessage position="top" />
        <MainAppNavStack />
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background_primary,
    alignItems: "center",
    justifyContent: "center",
  },
});
