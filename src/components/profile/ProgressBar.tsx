import { StyleSheet, View } from "react-native";
import { s, vs } from "react-native-size-matters";
import { AppColors } from "../../styles/colors";

interface ProgressBarProps {
  progress: number;
  height?: number;
}

export default function ProgressBar({ progress, height = vs(10) }: ProgressBarProps) {
  const clamped = Math.min(Math.max(progress, 0), 1); 

  return (
    <View style={[styles.track, { height, borderRadius: height / 2 }]}>
      <View
        style={[
          styles.fill,
          { width: `${clamped * 100}%`, borderRadius: height / 2 },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: "100%",
    backgroundColor: AppColors.bg_button_secondary,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    backgroundColor: AppColors.button_primary_accent,
  },
});