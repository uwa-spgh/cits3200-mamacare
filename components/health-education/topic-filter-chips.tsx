import { Pressable, ScrollView, StyleSheet, Text } from "react-native";

import { colors, TOPIC_FILTERS, TopicFilterId } from "@/constants/health-education";

interface TopicFilterChipsProps {
  activeFilter: TopicFilterId;
  onSelectFilter: (id: TopicFilterId) => void;
}

export function TopicFilterChips({ activeFilter, onSelectFilter }: TopicFilterChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {TOPIC_FILTERS.map((filter) => {
        const isActive = filter.id === activeFilter;
        return (
          <Pressable
            key={filter.id}
            onPress={() => onSelectFilter(filter.id)}
            style={[styles.chip, isActive && styles.chipActive]}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
          >
            <Text style={[styles.chipLabel, isActive && styles.chipLabelActive]}>
              {filter.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    paddingVertical: 4,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: colors.primaryMuted,
  },
  chipActive: {
    backgroundColor: colors.primary,
  },
  chipLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.primary,
  },
  chipLabelActive: {
    color: colors.surface,
  },
});
