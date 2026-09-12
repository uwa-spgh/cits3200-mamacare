// Health and Education Screen — Education Library
import { useNavigation } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { SearchBar } from "../../components/health-education/search-bar";
import { TopicFilterChips } from "../../components/health-education/topic-filter-chips";
import { TopicGrid } from "../../components/health-education/topic-grid";
import {
  colors,
  EDUCATION_TOPICS,
  TopicFilterId,
} from "../../constants/health-education";
import AppSafeView from "../../components/views/AppSafeView";
import HomeHeader from "../../components/headers/HomeHeader";

export default function HealthAndEducationScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<TopicFilterId>("all");
  const { t } = useTranslation();

  const translatedTopics = EDUCATION_TOPICS.map((topic) => ({
    ...topic,
    title: t(`libraryScreen.topics.${topic.id}.title`),
    description: t(`libraryScreen.topics.${topic.id}.description`),
  }));

  const filteredTopics = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return translatedTopics.filter((topic) => {
      const matchesFilter =
        activeFilter === "all" || topic.category === activeFilter;
      const matchesQuery =
        query.length === 0 || topic.title.toLowerCase().includes(query);
      return matchesFilter && matchesQuery;
    });
  }, [activeFilter, searchQuery, translatedTopics]);

  const navigation = useNavigation<any>();

  return (
    <AppSafeView>
      <HomeHeader />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.titleBlock}>
          <Text style={styles.heading}>{t("libraryScreen.title")}</Text>
          <Text style={styles.subheading}>{t("libraryScreen.subtitle")}</Text>
        </View>

        <Pressable
          style={styles.dangerLink}
          accessibilityRole="button"
          onPress={() => navigation.navigate("DangerSigns")}
        >
          <View style={styles.dangerLinkIcon}>
            <Ionicons name="warning-outline" size={18} color={colors.danger} />
          </View>
          <Text style={styles.dangerLinkLabel}>{t("libraryScreen.dangerSigns")}</Text>
          <Ionicons name="chevron-forward" size={18} color={colors.danger} />
        </Pressable>

        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={t("libraryScreen.searchPlaceholder")}
          accessibilityLabel={t("libraryScreen.searchAccessibilityLabel")}
        />

        <TopicFilterChips
          activeFilter={activeFilter}
          onSelectFilter={setActiveFilter}
        />

        <View style={styles.section}>
          <TopicGrid
            topics={filteredTopics}
            onSelectTopic={() => {
              // TODO: navigate to the Article screen
            }}
          />
        </View>
      </ScrollView>
    </AppSafeView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    gap: 20,
  },
  titleBlock: {
    gap: 4,
  },
  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  subheading: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  section: {
    gap: 10,
  },
  dangerLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.dangerBg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.dangerBorder,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  dangerLinkIcon: {
    width: 30,
    height: 30,
    borderRadius: 10,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  dangerLinkLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: colors.danger,
  },
});
