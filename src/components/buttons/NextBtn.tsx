import { Ionicons } from "@expo/vector-icons";
import type { FC } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity } from "react-native";
import { s, vs } from "react-native-size-matters";
import { AppColors } from "../../styles/colors";
import AppText from "../texts/AppText";

interface NextBtnProps {
  color: string;
  disabled?: boolean;
  iconSize: number;
  onPress: () => void;
}

const NextBtn: FC<NextBtnProps> = ({
  color,
  disabled = false,
  iconSize,
  onPress,
}) => {
  const { t } = useTranslation();
  return (
    <TouchableOpacity
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={[styles.container, disabled && styles.disabled]}
    >
      <AppText style={[styles.btnText, { color }]}>
        {t("buttonArrows.next")}
      </AppText>
      <Ionicons name="chevron-forward" size={iconSize} color={color} />
    </TouchableOpacity>
  );
};

export default NextBtn;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: AppColors.button_primary_accent,
    borderRadius: s(8),
    flexDirection: "row",
    paddingHorizontal: s(20),
    paddingVertical: vs(8),
  },
  disabled: {
    opacity: 0.45,
  },
  btnText: {
    color: AppColors.text_secondary,
    paddingRight: s(5),
  },
});
