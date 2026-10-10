import { StyleSheet, View } from "react-native"; 
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
            style={[
              styles.languageButton,
              language === "en"
                ? styles.btnSelected
                : styles.btnUnselected,
            ]}
            textColor={
              language === "en"
                ? "#FFFFFF"
                : AppColors.text_secondary
            }
            onPress={() => {
              dispatch(setLanguage("en"));
              void i18n.changeLanguage("en");
            }}
          />
          <AppButton
            title={t("languageSelectionScreen.nepaliOption")}
            style={[
              styles.languageButton,
              language === "ne"
                ? styles.btnSelected
                : styles.btnUnselected,
            ]}
            textColor={
              language === "ne"
                ? "#FFFFFF"
                : AppColors.text_secondary
            }
            onPress={() => {
              dispatch(setLanguage("ne"));
              void i18n.changeLanguage("ne");
            }}
          />
        </View>
      </AppSafeView>
      <NavFooter
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

  languageButton: {
    marginVertical: vs(5),
  },

  btnSelected: {
    backgroundColor: AppColors.button_primary_accent,
    borderColor: AppColors.button_primary_accent,
    borderWidth: s(2),
  },

  btnUnselected: {
    backgroundColor: AppColors.bg_button_secondary,
    borderColor: AppColors.stroke_primary,
    borderWidth: s(2),
  },

  btsContainer: {
    width: "100%",
    paddingHorizontal: s(20),
    marginTop: s(50),
  },
});
