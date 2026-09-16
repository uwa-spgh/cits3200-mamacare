import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/health-education";
import { ArticleSection } from "@/constants/articles";

interface GoodToKnowCardProps {
  section: ArticleSection;
}

export function GoodToKnowCard({ section }: GoodToKnowCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.headingRow}>
        <View style={styles.iconCircle}>
          <Ionicons name="heart" size={16} color={colors.primary} />
        </View>
        <Text style={styles.heading}>{section.heading}</Text>
      </View>
      {section.body && <Text style={styles.paragraph}>{section.body}</Text>}
      {section.bullets?.map((bullet) => (
        <View key={bullet} style={styles.bulletRow}>
          <View style={styles.bulletDot} />
          <Text style={styles.bulletText}>{bullet}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    backgroundColor: colors.primaryMuted,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    borderRadius: 12,
    padding: 14,
  },
  headingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.primary,
  },
  paragraph: {
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
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
    backgroundColor: colors.primary,
    marginTop: 7,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    lineHeight: 20,
  },
});
