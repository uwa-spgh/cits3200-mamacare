import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import { DangerSignIcon } from "@/constants/danger-signs";

interface DangerSignIconViewProps {
  icon: DangerSignIcon;
  size: number;
  color: string;
}

// Danger sign icons can come from Ionicons, MaterialCommunityIcons, Entypo,
// or FontAwesome6 (some glyphs, like the headache or baby icons, only exist
// in one set) — this picks the right icon component based on which set the
// icon is tagged with.
export function DangerSignIconView({ icon, size, color }: DangerSignIconViewProps) {
  if (icon.family === "material-community") {
    return <MaterialCommunityIcons name={icon.name} size={size} color={color} />;
  }
  if (icon.family === "entypo") {
    return <Entypo name={icon.name} size={size} color={color} />;
  }
  if (icon.family === "font-awesome-6") {
    return (
      <FontAwesome6
        name={icon.name}
        size={size}
        color={color}
        solid={icon.style === "solid"}
        regular={icon.style === "regular"}
        brand={icon.style === "brand"}
      />
    );
  }
  return <Ionicons name={icon.name} size={size} color={color} />;
}
