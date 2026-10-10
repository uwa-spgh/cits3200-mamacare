import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { AppColors } from "./src/styles/colors";
import MainAppNavStack from "./src/navigation/MainAppNavStack";
import { NavigationContainer } from "expo-router/react-navigation";
import { useFonts } from "expo-font";
import { Provider } from "react-redux";
import { persistor, store } from "./src/store/store";
import i18n from "./src/localization/i18n";
import { I18nextProvider } from "react-i18next";
import { MedicationProvider } from "./src/context/MedicationContext";
import { registerSheet } from "react-native-actions-sheet";
import LanguageBottomSheet from "./src/components/sheets/LanguageBottomSheet";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { SheetProvider } from "react-native-actions-sheet";
import { PersistGate } from "redux-persist/integration/react";
import { useEffect } from "react";
import { useSelector } from "react-redux";

registerSheet("LANG_SHEET", LanguageBottomSheet);

 function PersistenceDebug() {
  const language = useSelector(
    (state: { dataReducer: { language: string } }) =>
      state.dataReducer.language
  );

  useEffect(() => {
    console.log("[Persistence test] Redux language:", language);
  }, [language]);

  return null;
}

function LanguageSync() {
  const language = useSelector(
    (state: { dataReducer: { language: string } }) =>
      state.dataReducer.language
  );

  useEffect(() => {
    console.log("[LanguageSync] Redux language:", language);
    console.log("[LanguageSync] i18n language before:", i18n.language);

    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language]);

  return null;
}

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
      <SafeAreaProvider>
        <SheetProvider>
          <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <PersistenceDebug />
              <LanguageSync />
              <I18nextProvider i18n={i18n}>
                <NavigationContainer>
                  <MedicationProvider>
                    <FlashMessage position="top" />
                    <MainAppNavStack />
                  </MedicationProvider>
                </NavigationContainer>
              </I18nextProvider>
            </PersistGate>
          </Provider>
        </SheetProvider>
      </SafeAreaProvider>
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
