import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { colors, EducationTopic } from "@/constants/health-education";

interface TopicGridProps {
  topics: EducationTopic[];
  onSelectTopic?: (topic: EducationTopic) => void;
}

export function TopicGrid({ topics, onSelectTopic }: TopicGridProps) {
  if (topics.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyStateText}>No topics match your search yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.list}>
      {topics.map((topic) => (
        <Pressable
          key={topic.id}
          onPress={() => onSelectTopic?.(topic)}
          style={styles.row}
          accessibilityRole="button"
        >
          <View style={styles.icon}>
            <Ionicons name="book-outline" size={18} color={colors.primary} />
          </View>
          <View style={styles.rowBody}>
            <Text style={styles.rowTitle}>{topic.title}</Text>
            <Text style={styles.rowDescription} numberOfLines={2}>
              {topic.description}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: 12,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.primaryMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  rowBody: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  rowDescription: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  emptyState: {
    paddingVertical: 24,
    alignItems: "center",
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
