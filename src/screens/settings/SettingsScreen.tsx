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
import JourneyCards from "../../components/profile/JourneyCards";
import { AppColors } from "../../styles/colors";
import { resetTutorial } from "../../tutorial";
import AppText from "../../components/texts/AppText";
import { AppFonts } from "../../styles/fonts";
import { useDispatch } from "react-redux";
import { setLanguage } from "../../store/reducers/dataReducers";

const SettingsScreen = () => {
  const navigation = useNavigation<NavigationProp<ParamListBase>>();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const replayTutorial = () => {
    resetTutorial();
    navigation.navigate("MainAppBottomTabs", { screen: "Home" });
  };

  return (
    <View style={styles.container}>
      <View style={styles.sectionTitleContainer}>
        <AppText style={styles.sectionTitle}>
          {t("settingsScreen.appSettings")}
        </AppText>
      </View>

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
          onPress={() =>
            SheetManager.show("LANG_SHEET", {
              payload: {
                onConfirm: (language: string) => dispatch(setLanguage(language)),
              },
            })
          }
          backgroundColor={AppColors.white}
          style={styles.row}
        />
        <View style={styles.separator} />
        <JourneyCards
          title={t("settingsScreen.notifications")}
          icon={
            <MaterialCommunityIcons
              name="bell-ring-outline"
              size={s(20)}
              color={AppColors.text_headings}
            />
          }
          onPress={() => navigation.navigate("Notifications")}
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
    </View>
  );
};

export default SettingsScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: vs(25),
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
  sectionTitleContainer: {
    width: "80%",
    marginBottom: vs(10),
  },
  sectionTitle: {
    fontFamily: AppFonts.TextBold,
    fontSize: s(12),
    color: AppColors.text_headings,
    textAlign: "left",
  },
});
