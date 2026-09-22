import { StyleSheet, Text, View } from "react-native";
import ActionSheet, { SheetManager } from "react-native-actions-sheet";
import React, { useState } from "react";
import AppText from "../texts/AppText";
import AppButton from "../buttons/AppButton";
import { s, vs } from "react-native-size-matters";
import { AppFonts } from "../../styles/fonts";
import { AppColors } from "../../styles/colors";
import RadioButton from "../inputs/RadioButton";
import { languagesArr } from "../../localization/languageList";
import i18n from "../../localization/i18n";
import { useTranslation } from "react-i18next";

const LanguageBottomSheet = () => {
  const { t } = useTranslation();
  const [selectedLang, setSelectedLang] = useState(i18n.language);
  const onLanguagePress = (code: string) => {
    setSelectedLang(code);
  };
  const handleConfirm = () => {
    SheetManager.hide("LANG_SHEET");
    i18n.changeLanguage(selectedLang);
  };

  return (
    <ActionSheet id="LANG_SHEET">
      <View style={styles.container}>
        <AppText style={styles.title}>{t("languageBottomSheet.selectLanguage")}</AppText>
        {languagesArr.map((lang) => (
          <RadioButton
            key={lang.code}
            title={lang.label}
            isSelected={selectedLang === lang.code}
            onPress={() => onLanguagePress(lang.code)}
          />
        ))}
        <AppButton
          style={{
            marginTop: s(10),
          }}
          title={t("languageBottomSheet.confirm")}
          onPress={handleConfirm}
        ></AppButton>
      </View>
    </ActionSheet>
  );
};

export default LanguageBottomSheet;

const styles = StyleSheet.create({
  container: {
    padding: s(16),
  },

  title: {
    fontFamily: AppFonts.Heading1Regular,
    color: AppColors.text_headings,
    fontSize: s(15),
    textAlign: "center",
    marginBottom: s(20),
  },
});
