import { StyleSheet, Text, View } from "react-native";

import { AppIconView } from "@/components/health-education/app-icon";
import { colors, TopicCategory } from "@/constants/health-education";
import { AppIcon } from "@/constants/icon";

interface ArticleHeroProps {
  icon: AppIcon;
  tagLabel: string;
  category: TopicCategory;
}

export function ArticleHero({ icon, tagLabel, category }: ArticleHeroProps) {
  const tint = category === "nutrition" ? colors.tagNutrition : colors.primary;

  return (
    <View style={[styles.hero, { backgroundColor: tint + "26" }]}>
      <View style={[styles.tag, { backgroundColor: tint }]}>
        <Text style={styles.tagLabel}>{tagLabel}</Text>
      </View>
      <AppIconView icon={icon} size={56} color={tint} />
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    height: 160,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  tag: {
    position: "absolute",
    top: 12,
    left: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  tagLabel: {
    color: colors.surface,
    fontSize: 12,
    fontWeight: "700",
  },
});
