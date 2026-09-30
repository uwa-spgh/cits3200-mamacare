import type { FC } from "react";
import { StyleSheet, View } from "react-native";
import { s, vs } from "react-native-size-matters";
import { AppColors } from "../../styles/colors";
import BackBtn from "../buttons/BackBtn";
import NextBtn from "../buttons/NextBtn";

interface NavFooterProps {
  nextDisabled?: boolean;
  onPressBack?: () => void;
  onPressNext: () => void;
}

const NavFooter: FC<NavFooterProps> = ({
  nextDisabled = false,
  onPressBack,
  onPressNext,
}) => {
  return (
    <View style={styles.container}>
      {onPressBack ? (
        <BackBtn
          onPress={onPressBack}
          iconSize={s(16)}
          color={AppColors.text_secondary}
        />
      ) : null}
      <View style={styles.nextContainer}>
        <NextBtn
          color={AppColors.white}
          disabled={nextDisabled}
          iconSize={s(16)}
          onPress={onPressNext}
        />
      </View>
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
  nextContainer: {
    marginLeft: "auto",
  },
});
