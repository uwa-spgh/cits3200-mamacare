import { useNavigation } from "expo-router/react-navigation";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors } from "../../constants/health-education";
import { ArticleSection as ArticleSectionData } from "../../constants/articles";

interface ArticleSectionProps {
  section: ArticleSectionData;
}

export function ArticleSection({ section }: ArticleSectionProps) {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();

  return (
    <View style={styles.container}>
      <View style={styles.headingRow}>
        <View style={styles.accent} />
        <Text style={styles.heading}>{section.heading}</Text>
      </View>
      {section.intro && <Text style={styles.paragraph}>{section.intro}</Text>}
      {section.body && <Text style={styles.paragraph}>{section.body}</Text>}
      {section.bullets?.map((bullet) => (
        <View key={bullet} style={styles.bulletRow}>
          <View style={styles.bulletDot} />
          <Text style={styles.bulletText}>{bullet}</Text>
        </View>
      ))}
      {section.note && <Text style={[styles.paragraph, styles.note]}>{section.note}</Text>}
      {section.link && (
        <Pressable
          onPress={() =>
            navigation.navigate(section.link!.screen, section.link!.params)
          }
          accessibilityRole="link"
        >
          <Text style={styles.link}>
            {t("articleScreen.viewGuide", { defaultValue: section.link.label })} →
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  headingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  accent: {
    width: 4,
    height: 16,
    borderRadius: 2,
    backgroundColor: colors.tagNutrition,
  },
  heading: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  paragraph: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  note: {
    marginTop: 4,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    paddingLeft: 12,
  },
  bulletDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.tagNutrition,
    marginTop: 7,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  link: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary,
  },
});