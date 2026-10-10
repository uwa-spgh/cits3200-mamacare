import { Alert, Pressable, StyleSheet, View } from "react-native";
import { useState } from "react";
import { s } from "react-native-size-matters";
import { AppColors } from "../../styles/colors";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import AppText from "../texts/AppText";
import { AppFonts } from "../../styles/fonts";
import ProgressBar from "./ProgressBar";
import DateInput from "../inputs/DateInput";
import { useTranslation } from "react-i18next";
import { usePregnancyProgress } from "../../pregnancy/usePregnancyProgress";
import { formatCountdown, formatDueDate, pregnancyLocale } from "../../pregnancy/format";
import { normalizeDueDate } from "../../pregnancy/progress";
import { saveDueDate } from "../../store/store";

export default function EddCard() {
  const { t, i18n } = useTranslation();
  const progress = usePregnancyProgress();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const maximumDate = new Date();
  maximumDate.setDate(maximumDate.getDate() + 280);
  const minimumDate = new Date();
  minimumDate.setDate(minimumDate.getDate() - 365);

  const save = async () => {
    if (!normalizeDueDate(draft) || saving) return;
    setSaving(true);
    try {
      await saveDueDate(draft);
      setEditing(false);
    } catch {
      Alert.alert(t("pregnancy.saveErrorTitle"), t("pregnancy.saveError"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <FontAwesome5 name="calendar-alt" size={22} color={AppColors.button_primary_accent} />
        <View style={styles.rightHeader}>
          <AppText style={styles.label}>{t("pregnancy.estimatedDueDate")}</AppText>
          <AppText style={styles.date}>
            {progress ? formatDueDate(progress, i18n.language) : t("pregnancy.noDueDate")}
          </AppText>
        </View>
      </View>
      {progress ? (
        <>
          <View style={styles.separator} />
          <View style={styles.row}>
            <AppText style={styles.label}>{t("pregnancy.progress")}</AppText>
            <AppText style={styles.accent}>
              {new Intl.NumberFormat(pregnancyLocale(i18n.language), { style: "percent", maximumFractionDigits: 0 }).format(progress.progress)}
            </AppText>
          </View>
          <ProgressBar progress={progress.progress} />
          <AppText style={styles.hint}>{formatCountdown(progress, t, i18n.language)}</AppText>
        </>
      ) : <AppText style={styles.hint}>{t("pregnancy.enterDueDate")}</AppText>}

      {editing || !progress ? (
        <View style={styles.editor}>
          <AppText style={styles.hint}>{t("pregnancy.dueDateHint")}</AppText>
          <DateInput value={draft} onChange={setDraft} minimumDate={minimumDate} maximumDate={maximumDate} placeholder={t("pregnancy.estimatedDueDate")} />
          <View style={styles.actions}>
            {progress ? <Pressable disabled={saving} accessibilityRole="button" style={styles.button} onPress={() => setEditing(false)}>
              <AppText style={styles.label}>{t("pregnancy.cancel")}</AppText>
            </Pressable> : null}
            <Pressable disabled={!normalizeDueDate(draft) || saving} accessibilityRole="button"
              style={[styles.button, styles.saveButton, (!normalizeDueDate(draft) || saving) && styles.disabled]} onPress={save}>
              <AppText style={styles.saveText}>{t(saving ? "pregnancy.saving" : "pregnancy.save")}</AppText>
            </Pressable>
          </View>
        </View>
      ) : <Pressable accessibilityRole="button" style={styles.button} onPress={() => {
        setDraft(progress.dueDate.toISOString());
        setEditing(true);
      }}><AppText style={styles.accent}>{t("pregnancy.editDueDate")}</AppText></Pressable>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "90%", borderColor: AppColors.stroke_primary, borderWidth: 1, borderRadius: 10, padding: s(20), backgroundColor: AppColors.white },
  header: { flexDirection: "row", alignItems: "center" },
  rightHeader: { flex: 1, marginLeft: s(10) },
  label: { fontFamily: AppFonts.TextRegular, color: AppColors.text_secondary, fontSize: s(12) },
  date: { fontFamily: AppFonts.Heading2Medium, color: AppColors.text_headings, fontSize: s(15), marginTop: 4 },
  separator: { height: 1, backgroundColor: AppColors.stroke_primary, marginVertical: 16 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  accent: { fontFamily: AppFonts.Heading1Bold, color: AppColors.button_primary_accent, fontSize: s(12) },
  hint: { fontFamily: AppFonts.TextRegular, fontSize: s(12), color: AppColors.text_secondary, marginTop: 10 },
  editor: { marginTop: 12, gap: 12 },
  actions: { flexDirection: "row", justifyContent: "flex-end", gap: 8 },
  button: { paddingHorizontal: 14, paddingVertical: 12, minHeight: 44, alignItems: "center", justifyContent: "center" },
  saveButton: { backgroundColor: AppColors.button_primary_accent, borderRadius: 8 },
  saveText: { color: "#FFFFFF", fontFamily: AppFonts.Heading1Bold, fontSize: s(12) },
  disabled: { opacity: 0.5 },
});
