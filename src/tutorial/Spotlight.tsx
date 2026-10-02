import { StyleSheet, View } from "react-native";
import Svg, { Path, Rect } from "react-native-svg";
import { AppColors } from "../styles/colors";
import { spotlightPath, type Hole, type Size } from "./geometry";
import { TUTORIAL_DIM } from "./theme";

interface SpotlightProps {
  screen: Size;
  hole: Hole;
}

const OUTLINE_WIDTH = 2;

export default function Spotlight({ screen, hole }: SpotlightProps) {
  const inset = OUTLINE_WIDTH / 2;
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      pointerEvents="none"
      style={StyleSheet.absoluteFill}
    >
      <Svg width={screen.width} height={screen.height}>
        <Path d={spotlightPath(screen, hole)} fill={TUTORIAL_DIM} fillRule="evenodd" />
        <Rect
          x={hole.x + inset}
          y={hole.y + inset}
          width={Math.max(0, hole.width - OUTLINE_WIDTH)}
          height={Math.max(0, hole.height - OUTLINE_WIDTH)}
          rx={Math.max(0, hole.radius - inset)}
          ry={Math.max(0, hole.radius - inset)}
          fill="none"
          stroke={AppColors.white}
          strokeWidth={OUTLINE_WIDTH}
        />
      </Svg>
    </View>
  );
}
