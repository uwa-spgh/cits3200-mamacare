import { StyleSheet, Text, View } from "react-native";
import { s, vs } from "react-native-size-matters";
import React from "react";
import { AppColors } from "../../styles/colors";
import BackBtn from "../buttons/BackBtn";
import { useNavigation } from "@react-navigation/native";

const NavFooter = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <BackBtn
        onPress={() => navigation.navigate("MainAppBottomTabs")}
        iconSize={s(16)}
        iconColor={AppColors.text_secondary}
      />
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
