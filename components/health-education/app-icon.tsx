import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { AppIcon } from "@/constants/icon";

interface AppIconViewProps {
  icon: AppIcon;
  size: number;
  color: string;
}

export function AppIconView({ icon, size, color }: AppIconViewProps) {
  switch (icon.family) {
    case "material-community":
      return <MaterialCommunityIcons name={icon.name} size={size} color={color} />;
    case "material":
      return <MaterialIcons name={icon.name} size={size} color={color} />;
    case "entypo":
      return <Entypo name={icon.name} size={size} color={color} />;
    case "font-awesome-5":
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
    case "font-awesome-6":
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
    default:
      return <Ionicons name={icon.name} size={size} color={color} />;
  }
}
