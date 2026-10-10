import { Alert, Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import type { PregnancyProgress } from "../../pregnancy/progress";
import { getBabySize } from "../../pregnancy/babySizes";
import { pregnancyLocale } from "../../pregnancy/format";

export default function BabySizeCard({ progress }: { progress: PregnancyProgress | null }) {
  const { t, i18n } = useTranslation();
  const size = progress ? getBabySize(progress.weeks) : null;
  const number = new Intl.NumberFormat(pregnancyLocale(i18n.language));
  return (
    <View style={styles.card}>
      <View style={styles.icon} accessible={false}>
        {size?.emoji ? <Text style={styles.emoji}>{size.emoji}</Text> :
          <Ionicons name="nutrition-outline" size={34} color="#B62555" />}
      </View>
      <Text style={styles.title}>
        {size ? t(size.comparisonType === "length" ? "pregnancy.lengthOf" : "pregnancy.sizeOf", {
          comparison: t(`pregnancy.comparisons.${size.comparison}`),
        }) : t("pregnancy.babySize")}
      </Text>
      {size ? (
        <>
          <Text style={styles.description}>
            {t("pregnancy.typicalLength", { length: number.format(size.lengthCm) })}
            {" "}{t(size.measurement === "headToBottom" ? "pregnancy.headToBottom" : "pregnancy.headToHeel")}
          </Text>
          <Text style={styles.note}>{t("pregnancy.referenceWeek", { week: number.format(size.week) })}</Text>
          <Pressable accessibilityRole="link" onPress={() => {
            Linking.openURL(size.sourceUrl).catch(() => Alert.alert(t("pregnancy.sourceError")));
          }} style={styles.source}>
            <Text style={styles.sourceText}>{t("pregnancy.source")}</Text>
          </Pressable>
        </>
      ) : (
        <Text style={styles.description}>
          {t(!progress ? "pregnancy.enterDueDate" : progress.weeks < 4 ? "pregnancy.earlySize" : "pregnancy.lateSize")}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { alignItems: "center", backgroundColor: "#F9E3E5", borderRadius: 12, padding: 20, marginBottom: 24 },
  icon: { width: 60, height: 60, borderRadius: 30, backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center" },
  emoji: { fontSize: 36 },
  title: { marginTop: 12, fontSize: 19, fontWeight: "700", color: "#2B2224", textAlign: "center" },
  description: { marginTop: 6, fontSize: 13, color: "#66585B", textAlign: "center" },
  note: { marginTop: 8, fontSize: 12, color: "#66585B", textAlign: "center" },
  source: { padding: 12 },
  sourceText: { fontSize: 12, color: "#B62555", textDecorationLine: "underline" },
});
