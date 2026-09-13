import { StyleSheet, Text, View } from "react-native";
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
  }
});
