import { Alert, StyleSheet, View } from "react-native";
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
import { useSelector } from "react-redux";
import { saveDueDate, type RootState } from "../../store/store";
import { calculateDueDate, parseDueDate, PREGNANCY_LENGTH_DAYS } from "../../pregnancy/progress";

type DateMethod = "LMP" | "EDD";

const DATE_ENTRY_RANGE_DAYS = 365;

const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const InitialSetupScreen = () => {
  const edd = useSelector((state: RootState) => state.dataReducer.edd);
  const [selectedMethod, setSelectedMethod] = useState<DateMethod>(edd ? "EDD" : "LMP");
  const [selectedDate, setSelectedDate] = useState(() => parseDueDate(edd)?.toISOString() ?? "");
  const [saving, setSaving] = useState(false);
  const navigation = useNavigation<any>();
  const { t } = useTranslation();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selectMethod = (method: DateMethod) => {
    setSelectedMethod(method);
    setSelectedDate("");
  };

  const continueToNotifications = async () => {
    if (saving) return;
    const dueDate = calculateDueDate(selectedDate, selectedMethod);
    if (!dueDate) {
      Alert.alert(t("pregnancy.invalidDate"));
      return;
    }
    setSaving(true);
    try {
      await saveDueDate(dueDate);
      navigation.navigate("NotificationPermissionScreen");
    } catch {
      Alert.alert(t("pregnancy.saveErrorTitle"), t("pregnancy.saveError"));
    } finally {
      setSaving(false);
    }
  };

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
            onPress={() => selectMethod("LMP")}
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
            onPress={() => selectMethod("EDD")}
            isSelected={selectedMethod === "EDD"}
          />
          <InputDueDate
            maximumDate={
              selectedMethod === "LMP"
                ? today
                : addDays(today, PREGNANCY_LENGTH_DAYS)
            }
            minimumDate={
              selectedMethod === "LMP"
                ? addDays(today, -DATE_ENTRY_RANGE_DAYS)
                : addDays(today, -14)
            }
            onChange={setSelectedDate}
            textEdd={
              selectedMethod === "LMP"
                ? t("initialSetupScreen.lastPeriodPrompt")
                : t("initialSetupScreen.dueDatePrompt")
            }
            value={selectedDate}
          />
        </View>
      </AppSafeView>
      <NavFooter
        nextDisabled={!selectedDate || saving}
        onPressBack={() => { if (!saving) navigation.navigate("LanguageSelectionScreen"); }}
        onPressNext={continueToNotifications}
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
