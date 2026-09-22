import { StyleSheet, Text, Touchable, TouchableOpacity, View } from "react-native";
import React, { FC, ReactNode } from "react";
import { s, vs } from "react-native-size-matters";
import { AppColors } from "../../styles/colors";
import AppText from "../texts/AppText";
import { AppFonts } from "../../styles/fonts";

interface DueDateMethodProp {
  title: string;
  textContent: string;
  icon: ReactNode;
  type: "LMP" | "EDD";
  onPress: () => void;
  isSelected?: boolean;
}

const DueDateMethod: FC<DueDateMethodProp> = ({
  title,
  textContent,
  icon,
  type,
  onPress,
  isSelected = false,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: isSelected
            ? AppColors.background_light_accent
            : AppColors.white,
          borderColor: isSelected
            ? AppColors.button_primary_accent
            : AppColors.stroke_primary,
        },
      ]}
      onPress={onPress}
    >
      <View style={styles.header}>
        <AppText
          style={[
            styles.title,
            {
              color: isSelected
                ? AppColors.button_primary_accent
                : AppColors.text_headings,
            },
          ]}
        >
          {title}
        </AppText>
        {icon}
      </View>
      <View style={styles.content}>
        <AppText style={styles.textContent}>{textContent}</AppText>
      </View>
    </TouchableOpacity>
  );
};

export default DueDateMethod;

const styles = StyleSheet.create({
  container: {
    height: vs(100),
    width: "100%",
    paddingHorizontal: s(25),
    paddingVertical: s(20),
    borderWidth: s(1.5),
    borderRadius: s(10),
    marginBottom: s(10),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
  },
  title: {
    fontFamily: AppFonts.Heading2Regular,
    fontSize: s(14),
  },
  content: {
    marginTop: s(10),
  },

  textContent: {
    color: AppColors.text_secondary,
    fontFamily: AppFonts.TextRegular,
    fontSize: s(12),
  },
});
