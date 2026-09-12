// Design tokens and content for the Health & Education flow
//
// TBD swap PLACEHOLDER titles/descriptions/images
// once the client sends through articles/information.

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
}

export const EDUCATION_TOPICS: EducationTopic[] = [
  {
    id: "healthyNutrition",
    title: "Healthy Nutrition",
    description: "Placeholder description — content to come.",
    category: "nutrition",
    tagLabel: "Nutrition",
  },
  {
    id: "ancVisits",
    title: "Importance of ANC Visits",
    description: "Placeholder description — content to come.",
    category: "general",
    tagLabel: "ANC Care",
  },
  {
    id: "birthPreparedness",
    title: "Birth Preparedness",
    description: "Placeholder description — content to come.",
    category: "birth-prep",
    tagLabel: "Birth Prep",
  },
  {
    id: "labourPreparation",
    title: "Labour Preparation",
    description: "Placeholder description — content to come.",
    category: "birth-prep",
    tagLabel: "Birth Prep",
  },
  {
    id: "breastfeedingPreparation",
    title: "Breastfeeding Preparation",
    description: "Placeholder description — content to come.",
    category: "general",
    tagLabel: "Breastfeeding",
  },
  {
    id: "generalPregnancyAdvice",
    title: "General Pregnancy Advice",
    description: "Placeholder description — content to come.",
    category: "general",
    tagLabel: "General",
  },
];
