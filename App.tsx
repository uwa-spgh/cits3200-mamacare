import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { AppColors } from "./src/styles/colors";
import MainAppNavStack from "./src/navigation/MainAppNavStack";
import { NavigationContainer } from "@react-navigation/native";
import {useFonts} from 'expo-font'

export default function App() {

  const [fontsLoaded] = useFonts({
    "Nunito-Bold": require("./src/assets/fonts/nunito/Nunito-Bold.ttf"),
    "Nunito-ExtraBold": require("./src/assets/fonts/nunito/Nunito-ExtraBold.ttf"),
    "Nunito-Medium": require("./src/assets/fonts/nunito/Nunito-Medium.ttf"),
    "Nunito-Regular": require("./src/assets/fonts/nunito/Nunito-Regular.ttf"),
    "Nunito-Light": require("./src/assets/fonts/nunito/Nunito-Light.ttf"),

    "Poppins-Bold": require("./src/assets/fonts/poppins/Poppins-Bold.ttf"),
    "Poppins-ExtraBold": require("./src/assets/fonts/poppins/Poppins-ExtraBold.ttf"),
    "Poppins-Medium": require("./src/assets/fonts/poppins/Poppins-Medium.ttf"),
    "Poppins-Regular": require("./src/assets/fonts/poppins/Poppins-Regular.ttf"),
    "Poppins-Light": require("./src/assets/fonts/poppins/Poppins-Light.ttf"),

    "Inter-Bold": require("./src/assets/fonts/inter/Inter_18pt-Bold.ttf"),
    "Inter-Medium": require("./src/assets/fonts/inter/Inter_18pt-Medium.ttf"),
    "Inter-Regular": require("./src/assets/fonts/inter/Inter_18pt-Regular.ttf"),
    "Inter-Light": require("./src/assets/fonts/inter/Inter_18pt-Light.ttf"),
  })

  if(!fontsLoaded){
    return <ActivityIndicator size={'large'}/>
  }

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
