import { StyleSheet, View } from "react-native";
import React, { FC, useState } from "react";
import { s, vs } from "react-native-size-matters";
import { AppColors } from "../../styles/colors";
import AppText from "../texts/AppText";
import { AppFonts } from "../../styles/fonts";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useTranslation } from "react-i18next";
import DateInput from "../inputs/DateInput";

interface InputDueDateInputProps{
    textEdd: string;
}

const InputDueDate: FC<InputDueDateInputProps> = ({textEdd}) => {
  const [dueDate, setDueDate] = useState("");
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <AppText
        style={{
          fontSize: s(14),
          fontFamily: AppFonts.TextRegular,
          color: AppColors.text_headings,
        }}
      >
        {textEdd}
      </AppText>
      <View style={styles.innerContainer}>
        <DateInput
          onChange={setDueDate}
          placeholder={t("initialSetupScreen.datePlaceholder")}
          value={dueDate}
        />
        <View style={styles.infoContainer}>
          <MaterialCommunityIcons
            name="alert-circle"
            color={AppColors.button_primary_accent}
            size={s(20)}
          />
          <AppText style={styles.infoText}>
            {t("initialSetupScreen.privacyNotice")}
          </AppText>
        </View>
      </View>
    </View>
  );
};

export default InputDueDate;

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.white,
    borderColor: AppColors.stroke_primary,
    width: "100%",
    paddingHorizontal: s(18),
    paddingVertical: s(20),
    borderWidth: s(1.5),
    borderRadius: s(10),
    marginVertical: s(10),
  },

  innerContainer: {
    paddingVertical: s(10),
  },

  infoContainer: {
    flexDirection: "row",
  backgroundColor: "#FFF0F1",
  padding: s(10),
  borderRadius: s(5),
  alignItems: "flex-start",
  height: vs(70)
  },

  infoText: {
    flex: 1,
    fontFamily: AppFonts.TextRegular,
    color: AppColors.text_secondary,
    fontSize: s(10),
    paddingRight: s(10),
    marginHorizontal: s(10)
    
  },
});
