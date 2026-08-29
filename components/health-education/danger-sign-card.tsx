import Ionicons from "@expo/vector-icons/Ionicons";
import { StyleSheet, Text, View } from "react-native";

import { DangerSignIconView } from "@/components/health-education/danger-sign-icon";
import { colors } from "@/constants/health-education";
import { DangerSign } from "@/constants/danger-signs";

interface DangerSignCardProps {
  sign: DangerSign;
}

export function DangerSignCard({ sign }: DangerSignCardProps) {
  const isEmergency = sign.urgency === "emergency";
  const actionLabel = isEmergency ? "Call for emergency help" : "Go to hospital immediately";
  const actionIcon = isEmergency ? "call-outline" : "add-circle-outline";

  return (
    <View style={styles.card}>
      <View style={styles.iconCircle}>
        <DangerSignIconView icon={sign.icon} size={18} color={colors.danger} />
      </View>
      <View style={styles.body}>
        <Text style={styles.title}>{sign.title}</Text>
        <View style={styles.action}>
          <Ionicons name={actionIcon} size={14} color={colors.danger} />
          <Text style={styles.actionLabel}>{actionLabel}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.surface,
    borderLeftWidth: 4,
    borderLeftColor: colors.danger,
    borderRadius: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
    borderRightColor: colors.border,
    borderBottomColor: colors.border,
    padding: 12,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.dangerBg,
    alignItems: "center",
    justifyContent: "center",
  },
  body: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.danger,
  },
});
