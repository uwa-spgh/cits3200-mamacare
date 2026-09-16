import type { Entypo, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

type IoniconName = keyof typeof Ionicons.glyphMap;
type MaterialCommunityIconName = keyof typeof MaterialCommunityIcons.glyphMap;
type MaterialIconName = keyof typeof MaterialIcons.glyphMap;
type EntypoName = keyof typeof Entypo.glyphMap;
export type FontAwesomeStyle = "solid" | "regular" | "brand";

export type AppIcon =
  | { family: "ionicons"; name: IoniconName }
  | { family: "material-community"; name: MaterialCommunityIconName }
  | { family: "material"; name: MaterialIconName }
  | { family: "entypo"; name: EntypoName }
  | { family: "font-awesome-5"; name: string; style: FontAwesomeStyle }
  | { family: "font-awesome-6"; name: string; style: FontAwesomeStyle };

export const ion = (name: IoniconName): AppIcon => ({ family: "ionicons", name });
export const mci = (name: MaterialCommunityIconName): AppIcon => ({
  family: "material-community",
  name,
});
export const mi = (name: MaterialIconName): AppIcon => ({ family: "material", name });
export const entypo = (name: EntypoName): AppIcon => ({ family: "entypo", name });
export const fa5 = (name: string, style: FontAwesomeStyle = "solid"): AppIcon => ({
  family: "font-awesome-5",
  name,
  style,
});
export const fa6 = (name: string, style: FontAwesomeStyle = "solid"): AppIcon => ({
  family: "font-awesome-6",
  name,
  style,
});
