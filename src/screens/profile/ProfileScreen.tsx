import {
  Alert,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import AppSafeView from "../../components/views/AppSafeView";
import ProfilePicture from "../../components/profile/ProfilePicture";
import { useTranslation } from "react-i18next";
import AppText from "../../components/texts/AppText";
import { s, vs } from "react-native-size-matters";
import { AppFonts } from "../../styles/fonts";
import { AppColors } from "../../styles/colors";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { ScrollView } from "react-native-gesture-handler";
import EddCard from "../../components/profile/EddCard";
import { usePregnancyProgress } from "../../pregnancy/usePregnancyProgress";
import { formatGestation } from "../../pregnancy/format";
import JourneyCards from "../../components/profile/JourneyCards";
import { useNavigation } from "expo-router/react-navigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { resetData } from "../../store/reducers/dataReducers";
import { persistor } from "../../store/store";
import { useMedications } from "../../context/MedicationContext";
import { useMedicalHistory } from "../../context/MedicalHistoryContext";
import {
  PLANNER_STORAGE_KEY,
  syncAllNotifications,
} from "../../notifications/notificationService";
import { DUE_DATE_STORAGE_KEY } from "../../pregnancy/storage";

const ProfileScreen = () => {
  const userName = useSelector(
    (state: { dataReducer: { userName: string } }) =>
      state.dataReducer.userName,
  );

  const navigation = useNavigation<any>();
  const dispatch = useDispatch();
  const { resetMedicationData } = useMedications();
  const { resetMedicalHistory } = useMedicalHistory();

  const { t, i18n } = useTranslation();
  const pregnancyProgress = usePregnancyProgress();

  const handleLogout = async () => {
    try {
      await resetMedicationData();
      resetMedicalHistory();

      await Promise.all([
        AsyncStorage.removeItem("@mamacare/emergency-contacts"),
        AsyncStorage.removeItem(PLANNER_STORAGE_KEY),
        AsyncStorage.removeItem(DUE_DATE_STORAGE_KEY),
      ]);

      dispatch(resetData());

      await persistor.flush();
      await persistor.purge();

      await syncAllNotifications();

      navigation.reset({
        index: 0,
        routes: [{ name: "AuthStack" }],
      });
    } catch (error) {
      console.error("Failed to clear user data during logout:", error);
    }
  };

  return (
    <AppSafeView style={styles.container}>
      <ScrollView style={styles.scrollArea}>
        <View style={styles.profileInfo}>
          <ProfilePicture />
          <AppText style={styles.userName}>{userName}</AppText>
          <View style={styles.gestation}>
            <MaterialCommunityIcons
              name="baby-face"
              size={s(20)}
              color={AppColors.button_primary_accent}
            />
            <AppText style={[styles.gestationText, { flexShrink: 1 }]}>
              {pregnancyProgress ? formatGestation(pregnancyProgress, t, i18n.language) : t("pregnancy.noDueDate")}
            </AppText>
          </View>
        </View>
        <View style={styles.eddContainer}>
          <EddCard />
        </View>
        <View style={styles.journey}>
          <View style={styles.contentJourney}>
            <AppText
              style={{
                fontFamily: AppFonts.TextBold,
                fontSize: s(12),
                color: AppColors.text_headings,
                marginBottom: s(15),
              }}
            >
              {t("profileScreen.myJourney")}
            </AppText>
            <JourneyCards
              title={t("profileScreen.personalInformation")}
              icon={
                <MaterialCommunityIcons
                  name="account-outline"
                  size={s(20)}
                  color={AppColors.white}
                />
              }
              onPress={() =>
                navigation.navigate("PersonalInformation")}
              backgroundColor={AppColors.button_primary_accent}
            />
            <JourneyCards
              title={t("profileScreen.medicalHistory")}
              icon={
                <MaterialCommunityIcons
                  name="medical-bag"
                  size={s(20)}
                  color={AppColors.icon_border_green}
                />
              }
              onPress={() => {
                navigation.navigate("MedicalHistory");
              }}
              backgroundColor={AppColors.cyan}
            />
            <JourneyCards
              title={t("profileScreen.emergencyContacts")}
              icon={
                <MaterialCommunityIcons
                  name="asterisk"
                  size={s(20)}
                  color={AppColors.marron}
                />
              }
              onPress={() => navigation.navigate("EmergencyContacts")}
              backgroundColor={AppColors.icon_bg_emergency}
            />
          </View>
        </View>
        <TouchableOpacity
          activeOpacity={0.6}
          style={styles.button}
          onPress={() =>
            Alert.alert(
              t("profileScreen.logoutTitle"),
              t("profileScreen.logoutMessage"),
              [
                { text: t("profileScreen.cancel"), style: "cancel" },
                {
                  text: t("profileScreen.logout"),
                  style: "destructive",
                  onPress: handleLogout,
                },
              ],
            )
          }
        >
          <View
            style={{
              flexDirection: "row",
              paddingVertical: vs(5),
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <MaterialCommunityIcons
              name="logout"
              size={s(20)}
              color={AppColors.text_headings}
            />
            <AppText
              style={{
                fontFamily: AppFonts.TextRegular,
                color: AppColors.text_headings,
                fontSize: s(13),
                marginLeft: s(5),
              }}
            >
              {t("profileScreen.logout")}
            </AppText>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </AppSafeView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },

  scrollArea: {
    flex: 1,
    marginBottom: s(20),
  },

  profileInfo: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: s(20),
  },

  userName: {
    flexDirection: "row",
    marginTop: s(15),
    fontFamily: AppFonts.TextBold,
    color: AppColors.text_headings,
    alignContent: "center",
    justifyContent: "center",
    alignSelf: "center",
  },

  gestation: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: s(8),
  },

  gestationText: {
    marginLeft: s(10),
    fontFamily: AppFonts.TextRegular,
    color: AppColors.button_primary_accent,
    fontSize: s(15),
  },

  eddContainer: {
    alignItems: "center",
    justifyContent: "center",
  },

  journey: {
    width: "100%",
    marginVertical: vs(15),
    justifyContent: "center",
    alignItems: "center",
  },

  contentJourney: {
    width: "80%",
  },

  button: {
    width: "80%",
    height: vs(38),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: s(20),
    alignSelf: "center",
    marginVertical: vs(10),
    borderColor: "#8C7074",
    borderWidth: s(1),
  },
});
