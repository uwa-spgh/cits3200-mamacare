// Health and Education Screen — Education Library
// Content below is placeholder
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AppHeader } from "@/components/health-education/app-header";
import { SearchBar } from "@/components/health-education/search-bar";
import { TopicFilterChips } from "@/components/health-education/topic-filter-chips";
import { TopicGrid } from "@/components/health-education/topic-grid";
import { colors, EDUCATION_TOPICS, TopicFilterId } from "@/constants/health-education";

export default function HealthAndEducationScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<TopicFilterId>("all");

  const filteredTopics = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return EDUCATION_TOPICS.filter((topic) => {
      const matchesFilter = activeFilter === "all" || topic.category === activeFilter;
      const matchesQuery = query.length === 0 || topic.title.toLowerCase().includes(query);
      return matchesFilter && matchesQuery;
    });
  }, [activeFilter, searchQuery]);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <AppHeader title="MamaCare" />
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.titleBlock}>
          <Text style={styles.heading}>Education Library</Text>
          <Text style={styles.subheading}>Find information for your pregnancy journey.</Text>
        </View>

        <Link href="/danger-signs" asChild>
          <Pressable style={styles.dangerLink} accessibilityRole="button">
            <View style={styles.dangerLinkIcon}>
              <Ionicons name="warning-outline" size={18} color={colors.danger} />
            </View>
            <Text style={styles.dangerLinkLabel}>Danger Signs</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.danger} />
          </Pressable>
        </Link>

        <SearchBar value={searchQuery} onChangeText={setSearchQuery} />

        <TopicFilterChips activeFilter={activeFilter} onSelectFilter={setActiveFilter} />

        <View style={styles.section}>
          <TopicGrid
            topics={filteredTopics}
            onSelectTopic={() => {
              // TODO: navigate to the Article screen
            }}
          />
        </View>
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
