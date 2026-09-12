import Ionicons from "@expo/vector-icons/Ionicons";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { DangerSignIconView } from "../../components/health-education/danger-sign-icon";
import { colors } from "../../constants/health-education";
import { AncContactDangerSigns, DangerSign } from "../../constants/danger-signs";

interface ContactDangerSignsAccordionProps {
  contact: AncContactDangerSigns;
  signs: DangerSign[];
  expanded: boolean;
  onToggle: () => void;
}

export function ContactDangerSignsAccordion({
  contact,
  signs,
  expanded,
  onToggle,
}: ContactDangerSignsAccordionProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Pressable
        onPress={onToggle}
        style={styles.header}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
      >
        <View>
          <Text style={styles.contactLabel}>
            {t("dangerSignsScreen.contact")} {contact.contact}
          </Text>
          <Text style={styles.contactWeeks}>{contact.label}</Text>
        </View>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={18}
          color={colors.textSecondary}
        />
      </Pressable>
      {expanded && (
        <View style={styles.signList}>
          <Text style={styles.watchForLabel}>{t("dangerSignsScreen.watchFor")}</Text>
          {signs.map((sign) => (
            <View key={sign.id} style={styles.signRow}>
              <DangerSignIconView icon={sign.icon} size={16} color={colors.danger} />
              <Text style={styles.signRowLabel}>{sign.title}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
  },
  contactLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  contactWeeks: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  signList: {
    gap: 8,
    paddingHorizontal: 14,
    paddingBottom: 14,
  },
  watchForLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  signRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  signRowLabel: {
    fontSize: 14,
    color: colors.textPrimary,
  },
});
