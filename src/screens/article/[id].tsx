// Article screen - full content for one Education Library topic.
import Ionicons from "@expo/vector-icons/Ionicons";
import { RouteProp, useRoute } from "expo-router/react-navigation";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArticleHero } from "../../components/health-education/article-hero";
import { ArticleSection } from "../../components/health-education/article-section";
import HomeHeader from "../../components/headers/HomeHeader";
import { GoodToKnowCard } from "../../components/health-education/good-to-know-card";
import { ARTICLES, estimateReadTime } from "../../constants/articles";
import { colors, EDUCATION_TOPICS } from "../../constants/health-education";

type ArticleRouteParams = {
  Article: {
    id: string;
  };
};

export default function ArticleScreen() {
  const { id } = useRoute<RouteProp<ArticleRouteParams, "Article">>().params;
  const { t } = useTranslation();
  const topic = EDUCATION_TOPICS.find((item) => item.id === id);
  const article = id ? ARTICLES[id] : undefined;

  const translatedArticle = article && {
    ...article,
    title: t(`articles.${article.id}.title`, { defaultValue: article.title }),
    summary: article.summary
      ? t(`articles.${article.id}.summary`, { defaultValue: article.summary })
      : undefined,
    sections: article.sections.map((section, index) => ({
      ...section,
      heading: t(`articles.${article.id}.sections.${index}.heading`, {
        defaultValue: section.heading,
      }),
      intro: section.intro
        ? t(`articles.${article.id}.sections.${index}.intro`, {
            defaultValue: section.intro,
          })
        : undefined,
      body: section.body
        ? t(`articles.${article.id}.sections.${index}.body`, {
            defaultValue: section.body,
          })
        : undefined,
      note: section.note
        ? t(`articles.${article.id}.sections.${index}.note`, {
            defaultValue: section.note,
          })
        : undefined,
      bullets: section.bullets
        ? (t(`articles.${article.id}.sections.${index}.bullets`, {
            defaultValue: section.bullets,
            returnObjects: true,
          }) as string[])
        : undefined,
      link: section.link
        ? {
            ...section.link,
            label: t(`articles.${article.id}.sections.${index}.link`, {
              defaultValue: section.link.label,
            }),
          }
        : undefined,
    })),
    goodToKnow: article.goodToKnow
      ? {
          ...article.goodToKnow,
          heading: t(`articles.${article.id}.goodToKnow.heading`, {
            defaultValue: article.goodToKnow.heading,
          }),
          body: article.goodToKnow.body
            ? t(`articles.${article.id}.goodToKnow.body`, {
                defaultValue: article.goodToKnow.body,
              })
            : undefined,
          bullets: article.goodToKnow.bullets
            ? (t(`articles.${article.id}.goodToKnow.bullets`, {
                defaultValue: article.goodToKnow.bullets,
                returnObjects: true,
              }) as string[])
            : undefined,
        }
      : undefined,
  };

  if (!topic || !article) {
    return (
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <HomeHeader/>
        <View style={styles.notFound}>
          <Text style={styles.notFoundText}>{t("articleScreen.notFound")}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <HomeHeader/>
      <ScrollView contentContainerStyle={styles.content}>
        <ArticleHero icon={topic.icon} tagLabel={topic.tagLabel} category={topic.category} />

        <View style={styles.readTimeRow}>
          <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
          <Text style={styles.readTime}>
            {t("articleScreen.readTime", { minutes: estimateReadTime(article) })}
          </Text>
        </View>

        <View style={styles.titleBlock}>
          <Text style={styles.title}>{translatedArticle?.title}</Text>
            {translatedArticle?.summary && <Text style={styles.summary}>{translatedArticle.summary}</Text>}
        </View>

        {translatedArticle?.sections.map((section) => (
          <ArticleSection key={section.heading} section={section} />
        ))}

        {translatedArticle?.goodToKnow && <GoodToKnowCard section={translatedArticle.goodToKnow} />}
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