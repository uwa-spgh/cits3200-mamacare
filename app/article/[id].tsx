// Article screen - full content for one Education Library topic.
import Ionicons from "@expo/vector-icons/Ionicons";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ArticleHero } from "@/components/health-education/article-hero";
import { ArticleSection } from "@/components/health-education/article-section";
import { AppHeader } from "@/components/health-education/app-header";
import { GoodToKnowCard } from "@/components/health-education/good-to-know-card";
import { ARTICLES, estimateReadTime } from "@/constants/articles";
import { colors, EDUCATION_TOPICS } from "@/constants/health-education";

export default function ArticleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const topic = EDUCATION_TOPICS.find((item) => item.id === id);
  const article = id ? ARTICLES[id] : undefined;

  if (!topic || !article) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <AppHeader title="MamaCare" />
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>This article couldn&apos;t be found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <AppHeader title="MamaCare" />
      <ScrollView contentContainerStyle={styles.content}>
        <ArticleHero icon={topic.icon} tagLabel={topic.tagLabel} category={topic.category} />

        <View style={styles.readTimeRow}>
          <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.readTime}>{estimateReadTime(article)}</Text>
        </View>

        <View style={styles.titleBlock}>
          <Text style={styles.title}>{article.title}</Text>
          {article.summary && <Text style={styles.summary}>{article.summary}</Text>}
        </View>

        {article.sections.map((section) => (
          <ArticleSection key={section.heading} section={section} />
        ))}

        {article.goodToKnow && <GoodToKnowCard section={article.goodToKnow} />}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    gap: 16,
    paddingBottom: 32,
  },
  readTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  readTime: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  titleBlock: {
    gap: 6,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  summary: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  notFound: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  notFoundText: {
    fontSize: 15,
    color: colors.textSecondary,
  },
});
