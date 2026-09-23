import { StyleSheet, View } from "react-native";
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
import { useDispatch } from "react-redux";
import { setEdd } from "../../store/reducers/dataReducers";

type DateMethod = "LMP" | "EDD";

const PREGNANCY_LENGTH_DAYS = 280;
const DATE_ENTRY_RANGE_DAYS = 365;

const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const InitialSetupScreen = () => {
  const [selectedMethod, setSelectedMethod] = useState<DateMethod>("LMP");
  const [selectedDate, setSelectedDate] = useState("");
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();
  const { t } = useTranslation();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const selectMethod = (method: DateMethod) => {
    setSelectedMethod(method);
    setSelectedDate("");
  };

  const continueToNotifications = () => {
    if (!selectedDate) {
      return;
    }

    const enteredDate = new Date(selectedDate);
    const dueDate =
      selectedMethod === "LMP"
        ? addDays(enteredDate, PREGNANCY_LENGTH_DAYS)
        : enteredDate;

    dispatch(setEdd(dueDate.toISOString()));
    navigation.navigate("NotificationPermissionScreen");
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
                : addDays(today, DATE_ENTRY_RANGE_DAYS)
            }
            minimumDate={
              selectedMethod === "LMP"
                ? addDays(today, -DATE_ENTRY_RANGE_DAYS)
                : today
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
        nextDisabled={!selectedDate}
        onPressBack={() => navigation.navigate("LanguageSelectionScreen")}
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
