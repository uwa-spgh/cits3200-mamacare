import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";

import { colors } from "@/constants/health-education";

export function SeekHelpBanner() {
  return (
    <View style={styles.container}>
      <Ionicons name="warning" size={20} color={colors.danger} />
      <View style={styles.textBlock}>
        <Text style={styles.title}>Seek Help Immediately</Text>
        <Text style={styles.description}>
          If you experience any of these signs, do not wait. Go to the nearest clinic or
          hospital right away.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    backgroundColor: colors.dangerBg,
    borderLeftWidth: 4,
    borderLeftColor: colors.danger,
    borderRadius: 12,
    padding: 14,
  },
  textBlock: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.danger,
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
