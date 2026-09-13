import { Alert, StyleSheet, Text, View } from "react-native";
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

const ProfileScreen = () => {
  const userName = useSelector(
    (state: { dataReducer: { userName: string } }) =>
      state.dataReducer.userName,
  );
  const dispatch = useDispatch();

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
            <AppText style={styles.gestationText}>Week 24</AppText>
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
              My Journey
            </AppText>
            <JourneyCards
              title={"Personal Information"}
              icon={
                <MaterialCommunityIcons
                  name="account-outline"
                  size={s(20)}
                  color={AppColors.white}
                />
              }
              onPress={() => Alert.alert("Coming soon", "This feature will be added later.")}
              backgroundColor={AppColors.button_primary_accent}
            />
            <JourneyCards
              title={"Medical History"}
              icon={
                <MaterialCommunityIcons
                  name="medical-bag"
                  size={s(20)}
                  color={AppColors.icon_border_green}
                />
              }
              onPress={() => Alert.alert("Coming soon", "This feature will be added later.")}
              backgroundColor={AppColors.cyan}
            />
            <JourneyCards
              title={"Emergency Contacts"}
              icon={
                <MaterialCommunityIcons
                  name="asterisk"
                  size={s(20)}
                  color={AppColors.marron}
                />
              }
              onPress={() => Alert.alert("Coming soon", "This feature will be added later.")}
              backgroundColor={AppColors.icon_bg_emergency}
            />
          </View>
        </View>
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
});
