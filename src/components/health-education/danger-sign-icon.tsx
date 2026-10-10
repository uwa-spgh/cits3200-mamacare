import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import type { AppIcon } from "../../constants/icon";

interface DangerSignIconViewProps {
  icon: AppIcon;
  size: number;
  color: string;
}

export function DangerSignIconView({ icon, size, color }: DangerSignIconViewProps) {
  if (icon.family === "material-community") {
    return <MaterialCommunityIcons name={icon.name} size={size} color={color} />;
  }
  if (icon.family === "material") {
    return <MaterialIcons name={icon.name} size={size} color={color} />;
  }
  if (icon.family === "entypo") {
    return <Entypo name={icon.name} size={size} color={color} />;
  }
  if (icon.family === "font-awesome-5") {
    return (
      <FontAwesome5
        name={icon.name}
        size={size}
        color={color}
        solid={icon.style === "solid"}
        regular={icon.style === "regular"}
        brand={icon.style === "brand"}
      />
    );
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
