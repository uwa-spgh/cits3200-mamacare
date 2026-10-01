import AsyncStorage from "@react-native-async-storage/async-storage";
import i18n from "../localization/i18n";
import {
  cancelReminder,
  configureNotificationPlatform,
  getNotificationPermission,
  getPendingReminders,
  requestNotificationPermission,
  scheduleReminder,
} from "./notificationAdapter";
import {
  ancReminderDates,
  EDUCATION_HOUR,
  EDUCATION_MINUTE,
  EDUCATION_WEEKDAY,
  localDateKey,
  medicationReminderOccurrences,
} from "./planning";
import type { MedicationForReminder } from "./planning";
import type { ReminderKind } from "./types";

export const NOTIFICATION_PREFERENCES_KEY = "mamacare:notification-preferences";
export const MEDICATION_STORAGE_KEY = "mamacare:medications";
export const PLANNER_STORAGE_KEY = "mamacare:planner";
export const MAX_PENDING_MAMACARE_REMINDERS = 60;

export type NotificationPreferences = {
  anc: boolean;
  medication: boolean;
  education: boolean;
};

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  anc: true,
  medication: true,
  education: true,
};

type PlannerNotificationState = {
  completedVisits?: string[];
  appointments?: Record<string, { date: string; facility: string }>;
};

const visitNames: Record<string, { en: string; ne: string }> = {
  "anc-1": { en: "1st ANC Visit", ne: "पहिलो एएनसी भ्रमण" },
  "anc-2": { en: "2nd ANC Visit", ne: "दोस्रो एएनसी भ्रमण" },
  "anc-3": { en: "3rd ANC Visit", ne: "तेस्रो एएनसी भ्रमण" },
  "anc-4": { en: "4th ANC Visit", ne: "चौथो एएनसी भ्रमण" },
  "anc-5": { en: "5th ANC Visit", ne: "पाँचौँ एएनसी भ्रमण" },
  "anc-6": { en: "6th ANC Visit", ne: "छैटौँ एएनसी भ्रमण" },
  "anc-7": { en: "7th ANC Visit", ne: "सातौँ एएनसी भ्रमण" },
  "anc-8": { en: "8th ANC Visit", ne: "आठौँ एएनसी भ्रमण" },
};

const selectedLanguage = () => (i18n.language.startsWith("ne") ? "ne" : "en");

const copy = {
  en: {
    medicationTitle: "Medication reminder",
    medicationBody: (medication: MedicationForReminder) =>
      `Time to take ${medication.name}${medication.dosage ? ` (${medication.dosage})` : ""}.`,
    ancTitle: "ANC appointment reminder",
    ancBody: (name: string, date: Date) =>
      `${name} is ${date.toLocaleString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })}.`,
    educationTitle: "A friendly MamaCare reminder",
    educationBody: "Take a few minutes to read a pregnancy education topic this week.",
  },
  ne: {
    medicationTitle: "औषधि सम्झना",
    medicationBody: (medication: MedicationForReminder) =>
      `${medication.name}${medication.dosage ? ` (${medication.dosage})` : ""} लिने समय भयो।`,
    ancTitle: "एएनसी भेटघाट सम्झना",
    ancBody: (name: string, date: Date) =>
      `${name} ${date.toLocaleString("ne-NP", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })} मा छ।`,
    educationTitle: "MamaCare को मैत्रीपूर्ण सम्झना",
    educationBody: "यस हप्ता गर्भावस्था शिक्षाको एउटा विषय पढ्न केही मिनेट निकाल्नुहोस्।",
  },
};

export const loadNotificationPreferences = async () => {
  const stored = await AsyncStorage.getItem(NOTIFICATION_PREFERENCES_KEY);

  if (!stored) {
    return DEFAULT_NOTIFICATION_PREFERENCES;
  }

  try {
    return {
      ...DEFAULT_NOTIFICATION_PREFERENCES,
      ...(JSON.parse(stored) as Partial<NotificationPreferences>),
    };
  } catch {
    return DEFAULT_NOTIFICATION_PREFERENCES;
  }
};

export const saveNotificationPreferences = async (
  preferences: NotificationPreferences,
) => {
  await AsyncStorage.setItem(
    NOTIFICATION_PREFERENCES_KEY,
    JSON.stringify(preferences),
  );
};

const cancelKind = async (kind: ReminderKind) => {
  const pending = await getPendingReminders();
  await Promise.all(
    pending
      .filter((reminder) => reminder.data.kind === kind)
      .map((reminder) => cancelReminder(reminder.id)),
  );
};

const canSchedule = async () => (await getNotificationPermission()) === "granted";

const performMedicationSync = async (
  medications: MedicationForReminder[],
) => {
  await cancelKind("medication");
  const preferences = await loadNotificationPreferences();

  if (!preferences.medication || !(await canSchedule())) {
    return;
  }

  const language = selectedLanguage();
  const now = new Date();
  const alreadyPending = await getPendingReminders();
  const availableMedicationSlots = Math.max(
    0,
    MAX_PENDING_MAMACARE_REMINDERS - alreadyPending.length,
  );

  for (const { medication, date } of medicationReminderOccurrences(
    medications,
    now,
    availableMedicationSlots,
  )) {
    await scheduleReminder({
      title: copy[language].medicationTitle,
      body: copy[language].medicationBody(medication),
      channel: "important",
      date,
      data: {
        mamaCareReminder: true,
        kind: "medication",
        sourceId: medication.id,
        occurrenceDate: localDateKey(date),
        scheduledFor: date.toISOString(),
      },
    });
  }
};

const performAncSync = async (state: PlannerNotificationState) => {
  await cancelKind("anc");
  const preferences = await loadNotificationPreferences();

  if (!preferences.anc || !(await canSchedule())) {
    return;
  }

  const language = selectedLanguage();
  const now = new Date();
  const completed = new Set(state.completedVisits ?? []);

  for (const [visitId, appointment] of Object.entries(state.appointments ?? {})) {
    if (completed.has(visitId)) {
      continue;
    }

    const appointmentDate = new Date(appointment.date);
    if (Number.isNaN(appointmentDate.getTime())) {
      continue;
    }

    const name = visitNames[visitId]?.[language] ?? visitId;

    for (const date of ancReminderDates(appointment.date, now)) {
      await scheduleReminder({
        title: copy[language].ancTitle,
        body: copy[language].ancBody(name, appointmentDate),
        channel: "important",
        date,
        data: {
          mamaCareReminder: true,
          kind: "anc",
          sourceId: visitId,
          scheduledFor: date.toISOString(),
        },
      });
    }
  }
};

const performEducationSync = async () => {
  await cancelKind("education");
  const preferences = await loadNotificationPreferences();

  if (!preferences.education || !(await canSchedule())) {
    return;
  }

  const language = selectedLanguage();
  await scheduleReminder({
    title: copy[language].educationTitle,
    body: copy[language].educationBody,
    channel: "education",
    weekly: {
      weekday: EDUCATION_WEEKDAY,
      hour: EDUCATION_HOUR,
      minute: EDUCATION_MINUTE,
    },
    data: {
      mamaCareReminder: true,
      kind: "education",
      scheduleLabel: "Saturday at 10:00 AM",
    },
  });
};

let medicationSyncQueue: Promise<void> = Promise.resolve();
let ancSyncQueue: Promise<void> = Promise.resolve();
let educationSyncQueue: Promise<void> = Promise.resolve();

export const syncMedicationNotifications = (
  medications: MedicationForReminder[],
) => {
  const task = medicationSyncQueue
    .catch(() => undefined)
    .then(() => performMedicationSync(medications));
  medicationSyncQueue = task.catch(() => undefined);
  return task;
};

export const syncAncNotifications = (state: PlannerNotificationState) => {
  const task = ancSyncQueue
    .catch(() => undefined)
    .then(() => performAncSync(state));
  ancSyncQueue = task.catch(() => undefined);
  return task;
};

export const syncEducationNotification = () => {
  const task = educationSyncQueue
    .catch(() => undefined)
    .then(() => performEducationSync());
  educationSyncQueue = task.catch(() => undefined);
  return task;
};

const readJson = async <T,>(key: string, fallback: T): Promise<T> => {
  const value = await AsyncStorage.getItem(key);
  if (!value) return fallback;

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

export const syncAllNotifications = async () => {
  const [medications, planner] = await Promise.all([
    readJson<MedicationForReminder[]>(MEDICATION_STORAGE_KEY, []),
    readJson<PlannerNotificationState>(PLANNER_STORAGE_KEY, {}),
  ]);

  await configureNotificationPlatform();
  await syncAncNotifications(planner);
  await syncEducationNotification();
  await syncMedicationNotifications(medications);
};

export const initializeNotifications = async () => {
  await configureNotificationPlatform();
  const permission = await getNotificationPermission();

  if (permission === "granted") {
    await syncAllNotifications();
  }

  return permission;
};

export const enableNotifications = async () => {
  const permission = await requestNotificationPermission();
  if (permission === "granted") {
    await syncAllNotifications();
  }
  return permission;
};

export {
  getNotificationPermission,
  getPendingReminders,
};
export type { NotificationPermission } from "./types";
