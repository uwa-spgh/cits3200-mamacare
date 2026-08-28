import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { s, vs } from "react-native-size-matters";
import { AppColors } from "../../styles/colors";
import AppText from "../texts/AppText";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { AppFonts } from "../../styles/fonts";
import MamaCareTopIcon from "./MamaCareTopIcon";

const HomeHeader = () => {
  return (
    <View style={styles.container}>
      <MamaCareTopIcon/>
      <View style={styles.containerIcons}>
        <TouchableOpacity>
          <MaterialIcons
            name="notifications"
            size={s(20)}
            color={AppColors.text_secondary}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <MaterialIcons
            name="settings"
            size={s(20)}
            color={AppColors.text_secondary}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  container: {
    top: 1,
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: vs(10),
    paddingHorizontal: s(20),
    borderBottomColor: AppColors.stroke_primary,
    borderBottomWidth: s(1),
  },

  containerIcons: {
    width: s(60),
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
