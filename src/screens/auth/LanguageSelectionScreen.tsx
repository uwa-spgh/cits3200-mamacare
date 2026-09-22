import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { s, vs } from "react-native-size-matters";
import AppSafeView from "../../components/views/AppSafeView";
import AppText from "../../components/texts/AppText";
import { AppColors } from "../../styles/colors";
import { AppFonts } from "../../styles/fonts";
import AppButton from "../../components/buttons/AppButton";
import { useNavigation } from "expo-router/react-navigation";
import NavFooter from "../../components/footers/NavFooter";
import { useDispatch, useSelector } from "react-redux";
import { setLanguage } from "../../store/reducers/dataReducers";
import { useTranslation } from "react-i18next";
import i18n from "../../localization/i18n";

const LanguageSelectionScreen = () => {
  const navigation = useNavigation<any>();
  const language = useSelector(
    (state: { dataReducer: { language: string } }) => state.dataReducer.language
  );
  const dispatch = useDispatch();

  const {t} = useTranslation();

  return (
    <>
      <AppSafeView style={styles.container}>
        <AppText style={styles.mainHeading}>{t("languageSelectionScreen.languageSelection")}</AppText>
        <View style={{ paddingHorizontal: s(20) }}>
          <AppText style={styles.secText}>
            {t("languageSelectionScreen.langSelectText")}
          </AppText>
        </View>

        <View style={styles.btsContainer}>
          <AppButton
            title={t("languageSelectionScreen.englishOption")}
            style={styles.btnEnglish}
            onPress={() => {
              dispatch(setLanguage('en'))
              i18n.changeLanguage('en')
            }}
          />
          <AppButton
            title={t("languageSelectionScreen.nepaliOption")}
            style={styles.btnNepali}
            textColor={AppColors.text_secondary}
            onPress={() => {
              dispatch(setLanguage('ne'))
              i18n.changeLanguage('ne')
            }}
          />
        </View>
      </AppSafeView>
      <NavFooter
        onPressBack={() => navigation.navigate("MainAppBottomTabs")}
        onPressNext={() => navigation.navigate("InitialSetupScreen")}
      />
    </>
  );
};

export default LanguageSelectionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mainHeading: {
    color: AppColors.button_primary_accent,
    fontFamily: AppFonts.Heading1ExtraBold,
    fontSize: s(25),
  },

  secText: {
    textAlign: "center",
    marginVertical: vs(10),
    color: AppColors.text_secondary,
    fontFamily: AppFonts.TextRegular,
  },

  btnEnglish: {
    marginTop: s(50),
  },

  btnNepali: {
    backgroundColor: AppColors.bg_button_secondary,
    borderColor: AppColors.stroke_primary,
    borderWidth: s(2),
    marginVertical: vs(10),
  },

  btsContainer: {
    width: "100%",
    paddingHorizontal: s(20),
  },
});
