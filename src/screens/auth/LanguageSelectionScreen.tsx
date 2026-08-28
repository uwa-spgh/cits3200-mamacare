import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { s, vs } from "react-native-size-matters";
import AppSafeView from "../../components/views/AppSafeView";
import AppText from "../../components/texts/AppText";
import { AppColors } from "../../styles/colors";
import { AppFonts } from "../../styles/fonts";
import AppButton from "../../components/buttons/AppButton";
import { useNavigation } from "@react-navigation/native";
import NavFooter from "../../components/footers/NavFooter";

const LanguageSelectionScreen = () => {

  const navigation = useNavigation<any>();
  
  return (
    <>
    <AppSafeView style={styles.container}>
      <AppText style={styles.mainHeading}>Language Selection</AppText>
      <View style={{ paddingHorizontal: s(20) }}>
        <AppText style={styles.secText}>
          Please choose your preferred language to continue.
        </AppText>
      </View>

      <View style={styles.btsContainer}>
        <AppButton
          title="English"
          style={styles.btnEnglish}
          onPress={() => navigation.navigate("MainAppBottomTabs")}
        />
        <AppButton
          title="Nepali (नेपाली)"
          style={styles.btnNepali}
          textColor={AppColors.text_secondary}
          onPress={() => navigation.navigate("MainAppBottomTabs")}
        />
      </View>
    </AppSafeView>
    <NavFooter/>
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
    width: '100%',
    paddingHorizontal: s(20)
  }
});
