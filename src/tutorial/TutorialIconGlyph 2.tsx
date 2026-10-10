import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import type { TutorialIcon } from "./steps";

interface TutorialIconGlyphProps {
  icon: TutorialIcon;
  size: number;
  color: string;
}

export default function TutorialIconGlyph({ icon, size, color }: TutorialIconGlyphProps) {
  switch (icon.family) {
    case "FontAwesome5":
      return <FontAwesome5 name={icon.name} size={size} color={color} />;
    case "MaterialCommunityIcons":
      return <MaterialCommunityIcons name={icon.name} size={size} color={color} />;
    case "MaterialIcons":
      return <MaterialIcons name={icon.name} size={size} color={color} />;
  }
}
