import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { AppColors } from "./src/styles/colors";
import MainAppNavStack from "./src/navigation/MainAppNavStack";
import { NavigationContainer } from "expo-router/react-navigation";
import { useFonts } from "expo-font";
import { Provider } from "react-redux";
import { store } from "./src/store/store";
import i18n from "./src/localization/i18n";
import { I18nextProvider } from "react-i18next";

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
  });

  if (!fontsLoaded) {
    return <ActivityIndicator size={"large"} />;
  }

  return (
    <>
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <NavigationContainer>
            <FlashMessage position="top" />
            <MainAppNavStack />
          </NavigationContainer>
        </I18nextProvider>
      </Provider>
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
