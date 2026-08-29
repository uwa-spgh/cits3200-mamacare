// Danger Signs content
import type { Entypo, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

type IoniconName = keyof typeof Ionicons.glyphMap;
type MaterialCommunityIconName = keyof typeof MaterialCommunityIcons.glyphMap;
type EntypoName = keyof typeof Entypo.glyphMap;
type FontAwesome6Style = "solid" | "regular" | "brand";

export type DangerSignIcon =
  | { family: "ionicons"; name: IoniconName }
  | { family: "material-community"; name: MaterialCommunityIconName }
  | { family: "entypo"; name: EntypoName }
  | { family: "font-awesome-6"; name: string; style: FontAwesome6Style };

export type DangerSignUrgency = "hospital" | "emergency";

export interface DangerSign {
  id: string;
  title: string;
  urgency: DangerSignUrgency;
  icon: DangerSignIcon;
}

const ion = (name: IoniconName): DangerSignIcon => ({ family: "ionicons", name });
const mci = (name: MaterialCommunityIconName): DangerSignIcon => ({
  family: "material-community",
  name,
});
const fa6 = (name: string, style: FontAwesome6Style = "solid"): DangerSignIcon => ({
  family: "font-awesome-6",
  name,
  style,
});
const entypo = (name: EntypoName): DangerSignIcon => ({ family: "entypo", name });

export const DANGER_SIGNS: Record<string, DangerSign> = {
  "heavy-vaginal-bleeding": {
    id: "heavy-vaginal-bleeding",
    title: "Heavy Vaginal Bleeding",
    urgency: "hospital",
    icon: ion("water-outline"),
  },
  "vaginal-bleeding": {
    id: "vaginal-bleeding",
    title: "Vaginal Bleeding",
    urgency: "hospital",
    icon: ion("water-outline"),
  },
  "severe-stomach-pain": {
    id: "severe-stomach-pain",
    title: "Severe Stomach Pain",
    urgency: "hospital",
    icon: mci("stomach"),
  },
  "severe-headache": {
    id: "severe-headache",
    title: "Severe Headache",
    urgency: "hospital",
    icon: mci("head-snowflake-outline"),
  },
  "blurred-vision": {
    id: "blurred-vision",
    title: "Blurred Vision",
    urgency: "hospital",
    icon: ion("eye-outline"),
  },
  "headache-or-blurred-vision": {
    id: "headache-or-blurred-vision",
    title: "Severe Headache or Blurred Vision",
    urgency: "hospital",
    icon: ion("eye-outline"),
  },
  swelling: {
    id: "swelling",
    title: "Swelling of Face or Hands",
    urgency: "hospital",
    icon: ion("hand-left-outline"),
  },
  "fever-chills": {
    id: "fever-chills",
    title: "Fever or Chills",
    urgency: "hospital",
    icon: ion("thermometer-outline"),
  },
  "trouble-breathing": {
    id: "trouble-breathing",
    title: "Trouble Breathing",
    urgency: "emergency",
    icon: ion("pulse-outline"),
  },
  "fainting-seizures": {
    id: "fainting-seizures",
    title: "Fainting or Seizures",
    urgency: "emergency",
    icon: ion("body-outline"),
  },
  "dizziness-fainting": {
    id: "dizziness-fainting",
    title: "Dizziness or Fainting",
    urgency: "emergency",
    icon: ion("body-outline"),
  },
  "severe-vomiting": {
    id: "severe-vomiting",
    title: "Severe Vomiting",
    urgency: "hospital",
    icon: ion("medical-outline"),
  },
  "reduced-movement": {
    id: "reduced-movement",
    title: "Reduced Baby Movement",
    urgency: "hospital",
    icon: fa6("baby"),
  },
  "fluid-leaking": {
    id: "fluid-leaking",
    title: "Fluid Leaking",
    urgency: "hospital",
    icon: entypo("water"),
  },
};

// "Seek medical help immediately if you have:"
export const GENERAL_DANGER_SIGN_IDS: string[] = [
  "heavy-vaginal-bleeding",
  "severe-stomach-pain",
  "severe-headache",
  "blurred-vision",
  "swelling",
  "fever-chills",
  "trouble-breathing",
  "fainting-seizures",
  "severe-vomiting",
  "reduced-movement",
];

export interface AncContactDangerSigns {
  contact: number;
  label: string;
  signIds: string[];
}

// "Contact N — <label>" sections, each with its own "Watch for:" list.
export const ANC_CONTACT_DANGER_SIGNS: AncContactDangerSigns[] = [
  {
    contact: 1,
    label: "Before 12 weeks",
    signIds: ["vaginal-bleeding", "severe-stomach-pain", "dizziness-fainting", "severe-vomiting"],
  },
  {
    contact: 2,
    label: "20 weeks",
    signIds: ["severe-headache", "blurred-vision", "swelling", "vaginal-bleeding"],
  },
  {
    contact: 3,
    label: "26 weeks",
    signIds: ["vaginal-bleeding", "fluid-leaking", "reduced-movement"],
  },
  {
    contact: 4,
    label: "30 weeks",
    signIds: ["vaginal-bleeding", "fluid-leaking", "headache-or-blurred-vision", "reduced-movement"],
  },
  {
    contact: 5,
    label: "34 weeks",
    signIds: ["reduced-movement", "vaginal-bleeding", "fluid-leaking", "headache-or-blurred-vision"],
  },
  {
    contact: 6,
    label: "36 weeks",
    signIds: ["reduced-movement", "vaginal-bleeding", "headache-or-blurred-vision"],
  },
  {
    contact: 7,
    label: "38 weeks",
    signIds: ["reduced-movement", "vaginal-bleeding"],
  },
  {
    contact: 8,
    label: "40 weeks",
    signIds: ["reduced-movement", "vaginal-bleeding", "headache-or-blurred-vision"],
  },
];
