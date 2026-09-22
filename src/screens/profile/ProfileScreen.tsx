import {
  Alert,
  Settings,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import AppSafeView from "../../components/views/AppSafeView";
import ProfilePicture from "../../components/profile/ProfilePicture";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import AppText from "../../components/texts/AppText";
import { setUserName } from "../../store/reducers/dataReducers";
import { s, vs } from "react-native-size-matters";
import { AppFonts } from "../../styles/fonts";
import { AppColors } from "../../styles/colors";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { ScrollView } from "react-native-gesture-handler";
import EddCard from "../../components/profile/EddCard";
import JourneyCards from "../../components/profile/JourneyCards";
import { Ionicons } from "@expo/vector-icons";
import { SheetManager } from "react-native-actions-sheet";
import { useNavigation } from "expo-router/react-navigation";

const ProfileScreen = () => {
  const userName = useSelector(
    (state: { dataReducer: { userName: string } }) =>
      state.dataReducer.userName,
  );
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();

  const { t } = useTranslation();

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
            <AppText style={styles.gestationText}>
              {t("profileScreen.gestationWeek", { week: 24 })}
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
                Alert.alert(
                  t("profileScreen.comingSoon"),
                  t("profileScreen.featureComingLater"),
                )
              }
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
              onPress={() =>
                Alert.alert(
                  t("profileScreen.comingSoon"),
                  t("profileScreen.featureComingLater"),
                )
              }
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
              onPress={() =>
                Alert.alert(
                  t("profileScreen.comingSoon"),
                  t("profileScreen.featureComingLater"),
                )
              }
              backgroundColor={AppColors.icon_bg_emergency}
            />
          </View>
        </View>
        <View style={styles.settings}>
          <View style={styles.settingsContent}>
            <AppText
              style={{
                fontFamily: AppFonts.TextBold,
                fontSize: s(12),
                color: AppColors.text_headings,
                marginBottom: s(15),
              }}
            >
              {t("profileScreen.appSettings")}
            </AppText>
            <View style={styles.settingsOptions}>
              <JourneyCards
                title={t("profileScreen.language")}
                icon={
                  <Ionicons
                    name="globe-outline"
                    size={s(20)}
                    color={AppColors.text_headings}
                  />
                }
                onPress={() => SheetManager.show("LANG_SHEET")}
                backgroundColor={AppColors.white}
                style={{
                  borderWidth: 0,
                  marginBottom: 0,
                  height: s(40),
                  paddingVertical: 0,
                }}
              />
              <View style={styles.separator}></View>
              <JourneyCards
                title={t("profileScreen.notifications")}
                icon={
                  <MaterialCommunityIcons
                    name="bell-ring-outline"
                    size={s(20)}
                    color={AppColors.text_headings}
                  />
                }
                onPress={() =>
                  Alert.alert(
                    t("profileScreen.comingSoon"),
                    t("profileScreen.featureComingLater"),
                  )
                }
                backgroundColor={AppColors.white}
                style={{
                  borderWidth: 0,
                  marginBottom: 0,
                  height: s(40),
                  paddingVertical: 0,
                }}
              />
              <View style={styles.separator}></View>
              <JourneyCards
                title={t("profileScreen.helpAndSupport")}
                icon={
                  <Ionicons
                    name="help-circle-outline"
                    size={s(20)}
                    color={AppColors.text_headings}
                  />
                }
                onPress={() =>
                  Alert.alert(
                    t("profileScreen.comingSoon"),
                    t("profileScreen.featureComingLater"),
                  )
                }
                backgroundColor={AppColors.white}
                style={{
                  borderWidth: 0,
                  marginBottom: 0,
                  height: s(40),
                  paddingVertical: 0,
                }}
              />
            </View>
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
                  onPress: () =>
                    navigation.reset({
                      index: 0,
                      routes: [{ name: "AuthStack" }],
                    }),
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
            <AppText style={{
              fontFamily: AppFonts.TextRegular,
              color: AppColors.text_headings,
              fontSize: s(13),
              marginLeft: s(5)}}
            >{t("profileScreen.logout")}</AppText>
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
    marginTop: s(15),
    fontFamily: AppFonts.TextBold,
    color: AppColors.text_headings,
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

  settings: {
    width: "100%",
    marginBottom: s(15),
    justifyContent: "center",
    alignItems: "center",
  },

  settingsContent: {
    width: "80%",
  },

  settingsOptions: {
    borderWidth: s(1),
    borderColor: AppColors.stroke_primary,
    borderRadius: s(10),
    backgroundColor: AppColors.white,
  },

  separator: {
    height: s(1),
    width: "100%",
    backgroundColor: AppColors.stroke_primary,
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
