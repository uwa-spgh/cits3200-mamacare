import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { s, vs } from "react-native-size-matters";
import React, { FC } from "react";
import { AppColors } from "../../styles/colors";
import { AppFonts } from "../../styles/fonts";
import AppText from "../texts/AppText";

interface RadioButtonProps {
  title: string;
  isSelected: boolean;
  onPress?: () => void;
}

const RadioButton: FC<RadioButtonProps> = ({ title, isSelected=false, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.circle}>
        {isSelected && <View style={styles.innerCircle} />}
      </View>
      <AppText style={styles.title}>{title}</AppText>
    </TouchableOpacity>
  );
};

export default RadioButton;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: vs(5),
  },

  circle: {
    height: s(20),
    width: s(20),
    borderRadius: s(10),
    borderWidth: s(2),
    borderColor: AppColors.text_headings,
    alignItems: "center",
    justifyContent: "center",
  },

  innerCircle: {
    height: s(10),
    width: s(10),
    borderRadius: s(5),
    backgroundColor: AppColors.text_headings,
  },

  title: {
    fontFamily: AppFonts.TextRegular,
    fontSize: s(15),
    color: AppColors.text_headings,
    marginLeft: s(10),
  },
});
