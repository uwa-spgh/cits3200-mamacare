import { StyleSheet, Text, View } from "react-native";
import { s, vs } from "react-native-size-matters";
import React, { FC } from "react";
import { AppColors } from "../../styles/colors";
import BackBtn from "../buttons/BackBtn";
import { useNavigation } from "@react-navigation/native";
import NextBtn from "../buttons/NextBtn";
import AppButton from "../buttons/AppButton";

interface NavFooterProps {
  onPressBack: () => void;
  onPressNext: () => void;
}

const NavFooter: FC<NavFooterProps> = ({ onPressBack, onPressNext }) => {
  return (
    <View style={styles.container}>
      <BackBtn
        onPress={onPressBack}
        iconSize={s(16)}
        color={AppColors.text_secondary}
      />
      <NextBtn onPress={onPressNext} iconSize={s(16)} color={AppColors.white} />
    </View>
  );
};

export default NavFooter;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: s(50),
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
    bottom: 1,
    height: vs(60),
    width: "100%",
    backgroundColor: AppColors.background_primary,
    borderTopColor: AppColors.stroke_primary,
    borderTopWidth: s(1.5),
  },
});
