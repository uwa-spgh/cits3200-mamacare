import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, StyleSheet, Text } from "react-native";

import { colors } from "@/constants/health-education";

interface EmergencyCallButtonProps {
  onPress?: () => void;
}

export function EmergencyCallButton({ onPress }: EmergencyCallButtonProps) {
  return (
    <Pressable style={styles.button} onPress={onPress} accessibilityRole="button">
      <Ionicons name="medkit" size={18} color={colors.surface} />
      <Text style={styles.label}>Call Emergency</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.danger,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingVertical: 14,
    borderRadius: 14,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.surface,
  },
});
