import type { BottomTabBarButtonProps } from "expo-router/js-tabs";
import { PlatformPressable } from "expo-router/react-navigation";
import { StyleSheet, View } from "react-native";
import type { TutorialTargetId } from "./steps";
import { useTutorialTarget } from "./useTutorialTarget";

interface TutorialTabBarButtonProps extends BottomTabBarButtonProps {
  target: TutorialTargetId;
}

export default function TutorialTabBarButton({
  target,
  ...buttonProps
}: TutorialTabBarButtonProps) {
  const targetProps = useTutorialTarget(target);
  return (
    <View {...targetProps} style={styles.fill}>
      <PlatformPressable {...buttonProps} />
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
});
