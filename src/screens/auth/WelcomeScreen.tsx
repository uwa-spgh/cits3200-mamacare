import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "expo-router/react-navigation";
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { s, vs } from "react-native-size-matters";
import AppSafeView from "../../components/views/AppSafeView";
import type { RootState } from "../../store/store";
import { AppColors } from "../../styles/colors";
import { AppFonts } from "../../styles/fonts";

const PREGNANCY_LENGTH_DAYS = 280;
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

const getPregnancyWeek = (dueDate: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const normalizedDueDate = new Date(dueDate);
  normalizedDueDate.setHours(0, 0, 0, 0);

  const daysUntilDueDate = Math.round(
    (normalizedDueDate.getTime() - today.getTime()) / MILLISECONDS_PER_DAY,
  );
  const elapsedDays = PREGNANCY_LENGTH_DAYS - daysUntilDueDate;

  return Math.max(0, Math.min(40, Math.floor(elapsedDays / 7)));
};

const WelcomeScreen = () => {
  const navigation = useNavigation<any>();
  const { i18n, t } = useTranslation();
  const storedDueDate = useSelector(
    (state: RootState) => state.dataReducer.edd,
  );
  const dueDate = new Date(storedDueDate);
  const hasValidDueDate = !Number.isNaN(dueDate.getTime());
  const pregnancyWeek = hasValidDueDate ? getPregnancyWeek(dueDate) : 0;
  const formattedDueDate = hasValidDueDate
    ? new Intl.DateTimeFormat(i18n.language === "ne" ? "ne-NP" : "en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(dueDate)
    : t("welcomeScreen.dateUnavailable");

  const getStarted = () => {
    navigation.getParent()?.replace("MainAppBottomTabs");
  };

  return (
    <AppSafeView style={styles.container}>
      <View style={styles.header}>
        <Pressable
          accessibilityLabel={t("welcomeScreen.backAccessibility")}
          accessibilityRole="button"
          hitSlop={12}
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons
            color={AppColors.button_primary_accent}
            name="arrow-back"
            size={s(24)}
          />
        </Pressable>
        <Text style={styles.brand}>MamaCare</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          <View style={styles.celebrationCircle}>
            <MaterialCommunityIcons
              color={AppColors.button_primary_accent}
              name="party-popper"
              size={s(34)}
            />
          </View>

          <Text style={styles.title}>{t("welcomeScreen.title")}</Text>
          <Text style={styles.subtitle}>{t("welcomeScreen.subtitle")}</Text>

          <View style={styles.summaryCard}>
            <View style={[styles.cardIcon, styles.pregnancyIcon]}>
              <MaterialCommunityIcons
                color={AppColors.white}
                name="baby-face-outline"
                size={s(22)}
              />
            </View>
            <Text style={styles.cardLabel}>{t("welcomeScreen.youAre")}</Text>
            <Text style={styles.pregnancyValue}>
              {t("welcomeScreen.weeks", { week: pregnancyWeek })}
            </Text>
            <Text style={styles.cardSupportingText}>
              {t("welcomeScreen.pregnant")}
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <View style={[styles.cardIcon, styles.calendarIcon]}>
              <MaterialCommunityIcons
                color={AppColors.white}
                name="calendar-month-outline"
                size={s(21)}
              />
            </View>
            <Text style={styles.cardLabel}>
              {t("welcomeScreen.estimatedDueDate")}
            </Text>
            <Text style={styles.dateValue}>{formattedDueDate}</Text>
            <Text style={styles.cardSupportingText}>
              {t("welcomeScreen.markCalendar")}
            </Text>
          </View>

          <Pressable
            accessibilityLabel={t("welcomeScreen.getStartedAccessibility")}
            accessibilityRole="button"
            onPress={getStarted}
            style={({ pressed }) => [
              styles.getStartedButton,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.getStartedText}>
              {t("welcomeScreen.getStarted")}
            </Text>
            <Ionicons color={AppColors.white} name="arrow-forward" size={s(22)} />
          </Pressable>

          <Text style={styles.footerNote}>{t("welcomeScreen.adjustLater")}</Text>
        </View>
      </ScrollView>
    </AppSafeView>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  backButton: {
    alignItems: "center",
    height: s(44),
    justifyContent: "center",
    width: s(44),
  },
  brand: {
    color: AppColors.button_primary_accent,
    fontFamily: AppFonts.Heading1ExtraBold,
    fontSize: s(21),
    marginLeft: s(4),
  },
  buttonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },
  calendarIcon: {
    backgroundColor: AppColors.section_green,
  },
  cardIcon: {
    alignItems: "center",
    borderRadius: s(25),
    height: s(38),
    justifyContent: "center",
    marginBottom: vs(6),
    width: s(38),
  },
  cardLabel: {
    color: AppColors.text_headings,
    fontFamily: AppFonts.TextMedium,
    fontSize: s(14),
    textAlign: "center",
  },
  cardSupportingText: {
    color: AppColors.text_secondary,
    fontFamily: AppFonts.TextRegular,
    fontSize: s(13),
    marginTop: vs(2),
    textAlign: "center",
  },
  celebrationCircle: {
    alignItems: "center",
    backgroundColor: AppColors.background_light_accent,
    borderColor: AppColors.primary_section,
    borderRadius: s(42),
    borderWidth: s(2),
    height: s(78),
    justifyContent: "center",
    marginBottom: vs(11),
    width: s(78),
  },
  container: {
    flex: 1,
    backgroundColor: AppColors.background_primary,
  },
  content: {
    alignItems: "center",
    maxWidth: 520,
    width: "100%",
  },
  dateValue: {
    color: AppColors.section_green,
    fontFamily: AppFonts.Heading1ExtraBold,
    fontSize: s(21),
    marginTop: vs(2),
    textAlign: "center",
  },
  footerNote: {
    color: AppColors.text_secondary,
    fontFamily: AppFonts.TextRegular,
    fontSize: s(12),
    lineHeight: s(16),
    maxWidth: s(320),
    textAlign: "center",
  },
  getStartedButton: {
    alignItems: "center",
    backgroundColor: AppColors.button_primary_accent,
    borderRadius: s(28),
    elevation: 4,
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: vs(7),
    marginTop: vs(5),
    minHeight: vs(44),
    shadowColor: AppColors.black,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    width: "100%",
  },
  getStartedText: {
    color: AppColors.white,
    fontFamily: AppFonts.Heading1Bold,
    fontSize: s(15),
    marginRight: s(8),
  },
  header: {
    alignItems: "center",
    borderBottomColor: AppColors.stroke_primary,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: "row",
    minHeight: vs(46),
    paddingHorizontal: s(16),
  },
  pregnancyIcon: {
    backgroundColor: AppColors.primary_section,
  },
  pregnancyValue: {
    color: AppColors.button_primary_accent,
    fontFamily: AppFonts.Heading1ExtraBold,
    fontSize: s(21),
    marginTop: vs(2),
    textAlign: "center",
  },
  scrollContent: {
    alignItems: "center",
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: vs(12),
    paddingHorizontal: s(28),
    paddingTop: vs(12),
  },
  subtitle: {
    color: AppColors.text_secondary,
    fontFamily: AppFonts.TextRegular,
    fontSize: s(13),
    lineHeight: s(18),
    marginBottom: vs(12),
    maxWidth: s(350),
    textAlign: "center",
  },
  summaryCard: {
    alignItems: "center",
    backgroundColor: AppColors.bg_button_secondary,
    borderRadius: s(14),
    justifyContent: "center",
    marginBottom: vs(8),
    minHeight: vs(112),
    paddingHorizontal: s(20),
    paddingVertical: vs(10),
    width: "100%",
  },
  title: {
    color: AppColors.button_primary_accent,
    fontFamily: AppFonts.Heading1ExtraBold,
    fontSize: s(21),
    marginBottom: vs(4),
    textAlign: "center",
  },
});
