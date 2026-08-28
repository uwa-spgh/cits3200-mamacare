import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { AppColors } from "../../styles/colors";
import { AppFonts } from "../../styles/fonts";
import { s, vs } from "react-native-size-matters";

const PregnancySetupCard = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pregnancy Setup</Text>
      <Text style={styles.content}>
        We need a few details to accurately track your pregnancy progress and
        provide the right information at the right time.
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
