import { StyleSheet, View } from "react-native";
import React from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  useNavigation,
  type NavigationProp,
  type ParamListBase,
} from "expo-router/react-navigation";
import { useTranslation } from "react-i18next";
import { SheetManager } from "react-native-actions-sheet";
import { s, vs } from "react-native-size-matters";
import AppSafeView from "../../components/views/AppSafeView";
import JourneyCards from "../../components/profile/JourneyCards";
import { AppColors } from "../../styles/colors";
import { resetTutorial } from "../../tutorial";

const SettingsScreen = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const { t } = useTranslation();

  const replayTutorial = () => {
    resetTutorial();
    navigation.navigate("MainAppBottomTabs", { screen: "Home" });
  };

  return (
    <AppSafeView style={styles.container}>
      <View style={styles.options}>
        <JourneyCards
          title={t("settingsScreen.language")}
          icon={
            <Ionicons
              name="globe-outline"
              size={s(20)}
              color={AppColors.text_headings}
            />
          }
          onPress={() => SheetManager.show("LANG_SHEET")}
          backgroundColor={AppColors.white}
          style={styles.row}
        />
        <View style={styles.separator} />
        <JourneyCards
          title={t("settingsScreen.replayTutorial")}
          icon={
            <MaterialCommunityIcons
              name="play-circle-outline"
              size={s(20)}
              color={AppColors.text_headings}
            />
          }
          onPress={replayTutorial}
          backgroundColor={AppColors.white}
          style={styles.row}
        />
      </View>
    </AppSafeView>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: vs(20),
  },
  options: {
    backgroundColor: AppColors.white,
    borderColor: AppColors.stroke_primary,
    borderRadius: s(10),
    borderWidth: s(1),
    width: "80%",
  },
  row: {
    borderWidth: 0,
    flex: 0,
    marginBottom: 0,
    minHeight: 48,
    paddingVertical: vs(8),
  },
  separator: {
    backgroundColor: AppColors.stroke_primary,
    height: s(1),
    width: "100%",
  },
});
