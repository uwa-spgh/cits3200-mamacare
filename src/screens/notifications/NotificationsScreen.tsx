import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "expo-router/react-navigation";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  AppState,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import AppSafeView from "../../components/views/AppSafeView";
import {
  enableNotifications,
  getNotificationPermission,
  getPendingReminders,
  loadNotificationPreferences,
  saveNotificationPreferences,
  scheduleTestNotification,
  syncAllNotifications,
} from "../../notifications/notificationService";
import type {
  NotificationPermission,
  NotificationPreferences,
} from "../../notifications/notificationService";
import type { PendingReminder, ReminderKind } from "../../notifications/types";

const BRAND = "#BC1F58";
const GREEN = "#098F48";
const BACKGROUND = "#FFF8F8";
const TEXT = "#3E3034";

export default function NotificationsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const [permission, setPermission] =
    useState<NotificationPermission>("undetermined");
  const [preferences, setPreferences] = useState<NotificationPreferences>({
    anc: true,
    medication: true,
    education: true,
  });
  const [pending, setPending] = useState<PendingReminder[]>([]);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    const [nextPermission, nextPreferences, nextPending] = await Promise.all([
      getNotificationPermission(),
      loadNotificationPreferences(),
      getPendingReminders(),
    ]);
    setPermission(nextPermission);
    setPreferences(nextPreferences);
    setPending(nextPending);
  }, []);

  useEffect(() => {
    refresh().catch(() => undefined);

    const listener = AppState.addEventListener("change", (state) => {
      if (state === "active") refresh().catch(() => undefined);
    });

    return () => listener.remove();
  }, [refresh]);

  const handleEnable = async () => {
    setBusy(true);
    try {
      if (permission === "denied") {
        await Linking.openSettings();
        return;
      }

      const result = await enableNotifications();
      setPermission(result);
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  const handleToggle = async (key: keyof NotificationPreferences) => {
    const next = { ...preferences, [key]: !preferences[key] };
    setPreferences(next);
    await saveNotificationPreferences(next);
    await syncAllNotifications();
    await refresh();
  };

  const handleTest = async (kind: ReminderKind) => {
    setBusy(true);
    try {
      const result = await scheduleTestNotification(kind);

      if (result.permission !== "granted") {
        Alert.alert(
          t("notificationsScreen.permissionNeeded"),
          t("notificationsScreen.permissionInstructions"),
        );
        return;
      }

      Alert.alert(
        t("notificationsScreen.testScheduled"),
        t("notificationsScreen.testScheduledBody"),
      );
      await refresh();
    } finally {
      setBusy(false);
    }
  };

  const permissionLabel = t(`notificationsScreen.permission.${permission}`);

  return (
    <AppSafeView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.titleRow}>
          <Pressable
            accessibilityLabel={t("buttonArrows.backAccessibility")}
            hitSlop={12}
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" color={BRAND} size={24} />
          </Pressable>
          <Text style={styles.title}>{t("notificationsScreen.title")}</Text>
        </View>
        <Text style={styles.subtitle}>{t("notificationsScreen.subtitle")}</Text>

        <View style={styles.permissionCard}>
          <View style={styles.permissionIcon}>
            <Ionicons
              name={permission === "granted" ? "checkmark" : "notifications-outline"}
              color="#FFFFFF"
              size={22}
            />
          </View>
          <View style={styles.permissionCopy}>
            <Text style={styles.cardTitle}>{t("notificationsScreen.permissionTitle")}</Text>
            <Text style={styles.cardDescription}>{permissionLabel}</Text>
          </View>
          {permission !== "granted" ? (
            <Pressable disabled={busy} onPress={handleEnable} style={styles.enableButton}>
              <Text style={styles.enableButtonText}>{t("notificationsScreen.enable")}</Text>
            </Pressable>
          ) : null}
        </View>

        <Text style={styles.sectionTitle}>{t("notificationsScreen.reminderTypes")}</Text>
        <View style={styles.settingsCard}>
          <PreferenceRow
            description={t("notificationsScreen.ancDescription")}
            icon="calendar-outline"
            label={t("notificationsScreen.anc")}
            onChange={() => handleToggle("anc")}
            value={preferences.anc}
          />
          <Divider />
          <PreferenceRow
            description={t("notificationsScreen.medicationDescription")}
            icon="medical-outline"
            label={t("notificationsScreen.medication")}
            onChange={() => handleToggle("medication")}
            value={preferences.medication}
          />
          <Divider />
          <PreferenceRow
            description={t("notificationsScreen.educationDescription")}
            icon="book-outline"
            label={t("notificationsScreen.education")}
            onChange={() => handleToggle("education")}
            value={preferences.education}
          />
        </View>

        <View style={styles.pendingHeader}>
          <Text style={styles.sectionTitle}>{t("notificationsScreen.pending")}</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{pending.length}</Text>
          </View>
        </View>
        <Text style={styles.helperText}>{t("notificationsScreen.pendingDescription")}</Text>

        {__DEV__ ? (
          <View style={styles.developerCard}>
            <View style={styles.developerHeading}>
              <Ionicons name="construct-outline" color={BRAND} size={20} />
              <Text style={styles.cardTitle}>{t("notificationsScreen.developerTesting")}</Text>
            </View>
            <Text style={styles.cardDescription}>
              {t("notificationsScreen.developerDescription")}
            </Text>
            <View style={styles.testButtons}>
              {(["medication", "anc", "education"] as ReminderKind[]).map((kind) => (
                <Pressable
                  disabled={busy}
                  key={kind}
                  onPress={() => handleTest(kind)}
                  style={styles.testButton}
                >
                  <Text style={styles.testButtonText}>
                    {t(`notificationsScreen.test.${kind}`)}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        ) : null}

        {__DEV__ ? (
          <View style={styles.pendingCard}>
            <Text style={styles.pendingTitle}>{t("notificationsScreen.pendingList")}</Text>
            {pending.length === 0 ? (
              <Text style={styles.emptyText}>{t("notificationsScreen.noPending")}</Text>
            ) : (
              pending.map((reminder) => (
                <View key={reminder.id} style={styles.pendingRow}>
                  <View style={styles.pendingDot} />
                  <View style={styles.pendingCopy}>
                    <Text numberOfLines={1} style={styles.pendingItemTitle}>
                      {reminder.title}
                    </Text>
                    <Text numberOfLines={1} style={styles.pendingItemBody}>
                      {reminder.body}
                    </Text>
                    <Text style={styles.pendingTime}>{formatPendingTime(reminder)}</Text>
                  </View>
                </View>
              ))
            )}
            <Pressable onPress={() => refresh()} style={styles.refreshButton}>
              <Ionicons name="refresh" color={BRAND} size={16} />
              <Text style={styles.refreshText}>{t("notificationsScreen.refresh")}</Text>
            </Pressable>
          </View>
        ) : null}
      </ScrollView>
    </AppSafeView>
  );
}

function PreferenceRow({
  description,
  icon,
  label,
  onChange,
  value,
}: {
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onChange: () => void;
  value: boolean;
}) {
  return (
    <View style={styles.preferenceRow}>
      <View style={styles.preferenceIcon}>
        <Ionicons name={icon} color={BRAND} size={21} />
      </View>
      <View style={styles.preferenceCopy}>
        <Text style={styles.preferenceLabel}>{label}</Text>
        <Text style={styles.preferenceDescription}>{description}</Text>
      </View>
      <Switch
        onValueChange={onChange}
        trackColor={{ false: "#D7C9CD", true: "#E8AFC2" }}
        thumbColor={value ? BRAND : "#F4F4F4"}
        value={value}
      />
    </View>
  );
}

const Divider = () => <View style={styles.divider} />;

const formatPendingTime = (reminder: PendingReminder) => {
  if (reminder.data.scheduleLabel) return reminder.data.scheduleLabel;

  if (reminder.data.scheduledFor) {
    const date = new Date(reminder.data.scheduledFor);
    if (!Number.isNaN(date.getTime())) return date.toLocaleString();
  }

  return reminder.data.kind ?? "reminder";
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: BACKGROUND },
  content: { padding: 20, paddingBottom: 48 },
  titleRow: { alignItems: "center", flexDirection: "row", gap: 10 },
  backButton: { alignItems: "center", height: 36, justifyContent: "center", width: 36 },
  title: { color: BRAND, fontSize: 26, fontWeight: "800" },
  subtitle: { color: "#705A61", fontSize: 14, lineHeight: 20, marginTop: 5 },
  permissionCard: { alignItems: "center", backgroundColor: "#FFFFFF", borderColor: "#F0D4DD", borderRadius: 14, borderWidth: 1, flexDirection: "row", marginTop: 20, padding: 14 },
  permissionIcon: { alignItems: "center", backgroundColor: GREEN, borderRadius: 22, height: 44, justifyContent: "center", width: 44 },
  permissionCopy: { flex: 1, marginHorizontal: 12 },
  cardTitle: { color: TEXT, fontSize: 15, fontWeight: "700" },
  cardDescription: { color: "#7A666C", fontSize: 12, lineHeight: 17, marginTop: 3 },
  enableButton: { backgroundColor: BRAND, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 9 },
  enableButtonText: { color: "#FFFFFF", fontSize: 12, fontWeight: "700" },
  sectionTitle: { color: TEXT, fontSize: 16, fontWeight: "800", marginTop: 24 },
  settingsCard: { backgroundColor: "#FFFFFF", borderRadius: 14, marginTop: 10, paddingHorizontal: 14 },
  preferenceRow: { alignItems: "center", flexDirection: "row", paddingVertical: 15 },
  preferenceIcon: { alignItems: "center", backgroundColor: "#FBE4EA", borderRadius: 20, height: 40, justifyContent: "center", width: 40 },
  preferenceCopy: { flex: 1, marginHorizontal: 12 },
  preferenceLabel: { color: TEXT, fontSize: 14, fontWeight: "700" },
  preferenceDescription: { color: "#806D73", fontSize: 12, lineHeight: 17, marginTop: 2 },
  divider: { backgroundColor: "#F0E4E7", height: 1, marginLeft: 52 },
  pendingHeader: { alignItems: "center", flexDirection: "row", gap: 8 },
  countBadge: { backgroundColor: "#FBE4EA", borderRadius: 12, marginTop: 24, paddingHorizontal: 8, paddingVertical: 3 },
  countText: { color: BRAND, fontSize: 12, fontWeight: "800" },
  helperText: { color: "#806D73", fontSize: 12, lineHeight: 18, marginTop: 5 },
  developerCard: { backgroundColor: "#FFF0F4", borderColor: "#EAB9C9", borderRadius: 14, borderWidth: 1, marginTop: 18, padding: 15 },
  developerHeading: { alignItems: "center", flexDirection: "row", gap: 8 },
  testButtons: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 12 },
  testButton: { backgroundColor: BRAND, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10 },
  testButtonText: { color: "#FFFFFF", fontSize: 12, fontWeight: "700" },
  pendingCard: { backgroundColor: "#FFFFFF", borderRadius: 14, marginTop: 14, padding: 15 },
  pendingTitle: { color: TEXT, fontSize: 14, fontWeight: "800", marginBottom: 8 },
  emptyText: { color: "#89747A", fontSize: 12, paddingVertical: 8 },
  pendingRow: { alignItems: "center", borderBottomColor: "#F2E7EA", borderBottomWidth: 1, flexDirection: "row", paddingVertical: 9 },
  pendingDot: { backgroundColor: GREEN, borderRadius: 4, height: 8, marginRight: 10, width: 8 },
  pendingCopy: { flex: 1 },
  pendingItemTitle: { color: TEXT, fontSize: 12, fontWeight: "700" },
  pendingItemBody: { color: "#67545A", fontSize: 11, marginTop: 2 },
  pendingTime: { color: "#867177", fontSize: 11, marginTop: 2 },
  refreshButton: { alignItems: "center", alignSelf: "flex-start", flexDirection: "row", gap: 5, marginTop: 12 },
  refreshText: { color: BRAND, fontSize: 12, fontWeight: "700" },
});
