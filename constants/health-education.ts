import { AppIcon, fa5, ion, mci, mi } from "@/constants/icon";

export const colors = {
  background: "#FDF1F2",
  surface: "#FFFFFF",
  primary: "#9C2F4F",
  primaryMuted: "#F6DEE4",
  border: "#F1D9DE",
  textPrimary: "#241419",
  textSecondary: "#8A7B80",
  tagNutrition: "#3F8354",
  tabInactive: "#9A8D91",
  danger: "#C23B3B",
  dangerBg: "#FBE7E7",
  dangerBorder: "#E7B4B4",
} as const;

export type TopicCategory = "nutrition" | "birth-prep" | "general";
export type TopicFilterId = "all" | TopicCategory;

export interface TopicFilter {
  id: TopicFilterId;
  label: string;
}

export const TOPIC_FILTERS: TopicFilter[] = [
  { id: "all", label: "All Topics" },
  { id: "nutrition", label: "Nutrition" },
  { id: "birth-prep", label: "Birth Prep" },
];

export interface EducationTopic {
  id: string;
  title: string;
  description: string;
  category: TopicCategory;
  tagLabel: string;
  icon: AppIcon;
}

export const EDUCATION_TOPICS: EducationTopic[] = [
  {
    id: "healthy-nutrition",
    title: "Healthy Nutrition",
    description: "Eating well during pregnancy helps support your health and your baby's growth.",
    category: "nutrition",
    tagLabel: "Nutrition",
    icon: ion("restaurant-outline"),
  },
  {
    id: "anc-visits",
    title: "Importance of ANC Visits",
    description:
      "Antenatal care helps you and your health worker monitor your health and your baby's growth.",
    category: "general",
    tagLabel: "ANC Care",
    icon: ion("clipboard-outline"),
  },
  {
    id: "maternal-immunisation",
    title: "Maternal Immunisation",
    description: "Vaccines during pregnancy help protect you and your baby from serious infections.",
    category: "general",
    tagLabel: "Immunisation",
    icon: ion("shield-checkmark-outline"),
  },
  {
    id: "birth-preparedness",
    title: "Birth Preparedness",
    description: "Preparing for birth before labour starts can help you and your family be ready.",
    category: "birth-prep",
    tagLabel: "Birth Prep",
    icon: fa5("baby-carriage"),
  },
  {
    id: "labour-preparation",
    title: "Labour Preparation",
    description: "Knowing the signs of labour can help you recognise when it's time to go to the facility.",
    category: "birth-prep",
    tagLabel: "Birth Prep",
    icon: mi("pregnant-woman"),
  },
  {
    id: "breastfeeding-preparation",
    title: "Breastfeeding Preparation",
    description: "Breastfeeding preparation can help you feel ready to feed your baby after birth.",
    category: "general",
    tagLabel: "Breastfeeding",
    icon: mci("mother-nurse"),
  },
  {
    id: "general-pregnancy-advice",
    title: "General Pregnancy Advice",
    description: "Everyday tips to help you stay healthy and safe throughout your pregnancy.",
    category: "general",
    tagLabel: "General",
    icon: ion("information-circle-outline"),
  },
];
