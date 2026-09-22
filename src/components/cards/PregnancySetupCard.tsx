import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { AppColors } from "../../styles/colors";
import { AppFonts } from "../../styles/fonts";
import { s, vs } from "react-native-size-matters";
import { useTranslation } from "react-i18next";

const PregnancySetupCard = () => {
  const { t } = useTranslation();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("initialSetupScreen.setupTitle")}</Text>
      <Text style={styles.content}>
        {t("initialSetupScreen.setupDescription")}
      </Text>
    </View>
  );
};

export default PregnancySetupCard;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: s(22),
    marginBottom: s(25)
  },
  title: {
    color: AppColors.button_primary_accent,
    fontFamily: AppFonts.Heading2Regular,
    fontSize: s(14),
    marginBottom: s(7),
  },

  content: {
    textAlign: 'center',
    color: AppColors.text_secondary,
    fontFamily: AppFonts.TextRegular,
    fontSize: s(14)
  },
});
