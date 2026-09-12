import { StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import AppSafeView from "../../components/views/AppSafeView";
import NavFooter from "../../components/footers/NavFooter";
import { useNavigation } from "expo-router/react-navigation";
import AppText from "../../components/texts/AppText";
import { AppColors } from "../../styles/colors";
import { AppFonts } from "../../styles/fonts";
import { s, vs } from "react-native-size-matters";
import PregnancySetupCard from "../../components/cards/PregnancySetupCard";
import DueDateMethod from "../../components/cards/DueDateMethod";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import InputDueDate from "../../components/cards/InputDueDate";

const InitialSetupScreen = () => {
  const [selectedMethod, setSelectedMethod] = useState("LMP");
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  return (
    <>
      <AppSafeView style={styles.container}>
        <PregnancySetupCard />
        <AppText
          style={{
            color: AppColors.text_headings,
            fontFamily: AppFonts.TextRegular,
            fontSize: s(14),
          }}
        >
          {t("initialSetupScreen.calculateDates")}
        </AppText>
        <View style={styles.methodsContainer}>
          <DueDateMethod
            title={t("initialSetupScreen.lastPeriodTitle")}
            textContent={t("initialSetupScreen.lastPeriodDescription")}
            icon={
              <MaterialCommunityIcons
                name="calendar-month"
                size={s(20)}
                color={AppColors.stroke_primary}
              />
            }
            type="LMP"
            onPress={() => setSelectedMethod("LMP")}
            isSelected={selectedMethod === "LMP"}
          />
          <DueDateMethod
            title={t("initialSetupScreen.dueDateTitle")}
            textContent={t("initialSetupScreen.dueDateDescription")}
            icon={
              <MaterialCommunityIcons
                name="baby-face"
                size={s(20)}
                color={AppColors.stroke_primary}
              />
            }
            type="EDD"
            onPress={() => setSelectedMethod("EDD")}
            isSelected={selectedMethod === "EDD"}
          />
          <InputDueDate
            textEdd={
              selectedMethod === "LMP"
                ? t("initialSetupScreen.lastPeriodPrompt")
                : t("initialSetupScreen.dueDatePrompt")
            }
          />
        </View>
      </AppSafeView>
      <NavFooter
        onPressBack={() => navigation.navigate("LanguageSelectionScreen")}
        // onPressNext={() => navigation.navigate("WelcomeScreen")}
        onPressNext={() => navigation.navigate("MainAppBottomTabs")}
      />
    </>
  );
};

export default InitialSetupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: s(50),
  },
  methodsContainer: {
    paddingVertical: vs(17),
    width: "100%",
    paddingHorizontal: s(25),
  },
});
