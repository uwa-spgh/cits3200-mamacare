import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "expo-router/react-navigation";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { s, vs } from "react-native-size-matters";
import AppSafeView from "../../components/views/AppSafeView";
import { enableNotifications } from "../../notifications/notificationService";
import { AppColors } from "../../styles/colors";
import { AppFonts } from "../../styles/fonts";

const benefits = [
  { icon: "calendar-check-outline", key: "appointments" },
  { icon: "pill", key: "medication" },
  { icon: "book-open-page-variant-outline", key: "education" },
] as const;

export default function NotificationPermissionScreen() {
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const [isRequesting, setIsRequesting] = useState(false);

  const continueToWelcome = () => {
    navigation.replace("WelcomeScreen");
  };

  const requestPermission = async () => {
    setIsRequesting(true);
    try {
      await enableNotifications();
    } catch {
      // Onboarding can continue; permission remains available in Profile.
    }
    setIsRequesting(false);
    continueToWelcome();
  };

  return (
    <AppSafeView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          accessibilityLabel={t("notificationPermissionScreen.backAccessibility")}
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

        <View style={styles.content}>
          <View style={styles.bellCircle}>
            <Ionicons
              color={AppColors.button_primary_accent}
              name="notifications"
              size={s(42)}
            />
          </View>

          <Text style={styles.title}>
            {t("notificationPermissionScreen.title")}
          </Text>
          <Text style={styles.subtitle}>
            {t("notificationPermissionScreen.subtitle")}
          </Text>

          <View style={styles.benefitsCard}>
            {benefits.map((benefit) => (
              <View key={benefit.key} style={styles.benefitRow}>
                <View style={styles.benefitIcon}>
                  <MaterialCommunityIcons
                    color={AppColors.section_green}
                    name={benefit.icon}
                    size={s(22)}
                  />
                </View>
                <View style={styles.benefitCopy}>
                  <Text style={styles.benefitTitle}>
                    {t(`notificationPermissionScreen.benefits.${benefit.key}.title`)}
                  </Text>
                  <Text style={styles.benefitDescription}>
                    {t(`notificationPermissionScreen.benefits.${benefit.key}.description`)}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.offlineNote}>
            <Ionicons color={AppColors.section_green} name="cloud-offline-outline" size={s(18)} />
            <Text style={styles.offlineText}>
              {t("notificationPermissionScreen.offline")}
            </Text>
          </View>

          <Pressable
            accessibilityRole="button"
            disabled={isRequesting}
            onPress={requestPermission}
            style={({ pressed }) => [
              styles.allowButton,
              pressed && styles.buttonPressed,
              isRequesting && styles.buttonDisabled,
            ]}
          >
            {isRequesting ? (
              <ActivityIndicator color={AppColors.white} />
            ) : (
              <>
                <Ionicons color={AppColors.white} name="notifications" size={s(20)} />
                <Text style={styles.allowText}>
                  {t("notificationPermissionScreen.allow")}
                </Text>
              </>
            )}
          </Pressable>

          <Pressable
            accessibilityRole="button"
            disabled={isRequesting}
            onPress={continueToWelcome}
            style={styles.notNowButton}
          >
            <Text style={styles.notNowText}>
              {t("notificationPermissionScreen.notNow")}
            </Text>
          </Pressable>

          <Text style={styles.settingsNote}>
            {t("notificationPermissionScreen.settingsLater")}
          </Text>
        </View>
      </ScrollView>
    </AppSafeView>
  );
}

const styles = StyleSheet.create({
  allowButton: {
    alignItems: "center",
    backgroundColor: AppColors.button_primary_accent,
    borderRadius: s(24),
    flexDirection: "row",
    gap: s(8),
    justifyContent: "center",
    marginTop: vs(15),
    minHeight: vs(46),
    width: "100%",
  },
  allowText: {
    color: AppColors.white,
    fontFamily: AppFonts.Heading1Bold,
    fontSize: s(15),
  },
  backButton: {
    alignItems: "center",
    height: s(40),
    justifyContent: "center",
    width: s(40),
  },
  bellCircle: {
    alignItems: "center",
    backgroundColor: AppColors.background_light_accent,
    borderColor: AppColors.primary_section,
    borderRadius: s(46),
    borderWidth: s(2),
    height: s(86),
    justifyContent: "center",
    width: s(86),
  },
  benefitCopy: { flex: 1, marginLeft: s(12) },
  benefitDescription: {
    color: AppColors.text_secondary,
    fontFamily: AppFonts.TextRegular,
    fontSize: s(12),
    lineHeight: s(17),
    marginTop: vs(1),
  },
  benefitIcon: {
    alignItems: "center",
    backgroundColor: "#E4F5EC",
    borderRadius: s(21),
    height: s(42),
    justifyContent: "center",
    width: s(42),
  },
  benefitRow: { alignItems: "center", flexDirection: "row", marginBottom: vs(12) },
  benefitsCard: {
    backgroundColor: AppColors.bg_button_secondary,
    borderRadius: s(14),
    marginTop: vs(17),
    paddingHorizontal: s(16),
    paddingBottom: vs(2),
    paddingTop: vs(14),
    width: "100%",
  },
  benefitTitle: {
    color: AppColors.text_headings,
    fontFamily: AppFonts.TextBold,
    fontSize: s(14),
  },
  buttonDisabled: { opacity: 0.65 },
  buttonPressed: { opacity: 0.88 },
  container: { backgroundColor: AppColors.background_primary, flex: 1 },
  content: { alignItems: "center", maxWidth: 520, width: "100%" },
  notNowButton: { paddingHorizontal: s(18), paddingVertical: vs(10) },
  notNowText: {
    color: AppColors.button_primary_accent,
    fontFamily: AppFonts.TextBold,
    fontSize: s(13),
  },
  offlineNote: {
    alignItems: "center",
    flexDirection: "row",
    gap: s(7),
    marginTop: vs(12),
  },
  offlineText: {
    color: AppColors.section_green,
    flex: 1,
    fontFamily: AppFonts.TextMedium,
    fontSize: s(12),
  },
  scrollContent: {
    alignItems: "center",
    flexGrow: 1,
    paddingBottom: vs(16),
    paddingHorizontal: s(24),
    paddingTop: vs(8),
  },
  settingsNote: {
    color: AppColors.text_secondary,
    fontFamily: AppFonts.TextRegular,
    fontSize: s(11),
    textAlign: "center",
  },
  subtitle: {
    color: AppColors.text_secondary,
    fontFamily: AppFonts.TextRegular,
    fontSize: s(13),
    lineHeight: s(19),
    marginTop: vs(5),
    maxWidth: s(340),
    textAlign: "center",
  },
  title: {
    color: AppColors.button_primary_accent,
    fontFamily: AppFonts.Heading1ExtraBold,
    fontSize: s(22),
    marginTop: vs(13),
    textAlign: "center",
  },
});
